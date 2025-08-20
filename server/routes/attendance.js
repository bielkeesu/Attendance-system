import express from "express";
import db from "../db.js";

const router = express.Router();

// GET all staff
router.get("/all", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM attendance ORDER BY date DESC, timeIn DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching attendance:", err);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

router.get("/page", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    // Step 1: Get total attendance count
    const [countRows] = await db.query(
      "SELECT COUNT(*) as count FROM attendance"
    );
    const totalCount = countRows[0].count;
    const totalPages = Math.ceil(totalCount / limit);

    // Step 2: Get paginated results with staff names

    const query = `
      SELECT * FROM attendance
      ORDER BY date DESC, timeIn DESC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await db.query(query, [limit, offset]);

    // Step 3: Respond
    res.json({
      data: rows,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /api/attendance/recent
router.get("/recent", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, staffId, fullname, checkIn, checkOut, date
         FROM attendance
         ORDER BY id DESC
         LIMIT 5`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recent attendance" });
  }
});

// POST Attendance
router.post("/", async (req, res) => {
  const { staffId } = req.body;

  try {
    const [staffRows] = await db.execute(
      "SELECT * FROM staffs WHERE staffId = ?",
      [staffId]
    );
    if (staffRows.length === 0)
      return res.status(404).json({ error: "Staff not found" });

    const staff = staffRows[0];

    // Get today's attendance
    const [rows] = await db.execute(
      "SELECT * FROM attendance WHERE staffId = ? AND DATE(timeIn) = CURDATE() ORDER BY timeIn DESC LIMIT 1",
      [staffId]
    );

    // Get current settings
    const [settingsRow] = await db.execute(
      "SELECT * FROM settings WHERE id = 1"
    );
    const settings = settingsRow[0];

    if (!settings.enableAttendance) {
      return res
        .status(403)
        .json({ error: "Attendance is currently disabled." });
    }

    const now = new Date();
    const nowTime = now.toTimeString().split(" ")[0]; // "HH:mm:ss"
    const latestCheckIn = settings.latestCheckIn;
    const earliestCheckOut = settings.earliestCheckOut;
    const allowLate = settings.allowLateCheckIn;

    if (rows.length > 0 && !rows[0].timeOut) {
      // Already checked in, now wants to check out
      const timeIn = new Date(rows[0].timeIn);
      const diffMin = (now - timeIn) / (1000 * 60);

      if (diffMin < 5) {
        return res.status(400).json({
          error: "Please wait at least 5 minutes before checking out.",
        });
      }

      const newStatus = rows[0].status === "Incomplete" ? "Present" : "Late";

      await db.execute(
        "UPDATE attendance SET timeOut = ?, status = ? WHERE id = ?",
        [now, newStatus, rows[0].id]
      );

      return res.json({ message: "Checked out successfully.", staff });

      //  ✅ If already checked in and checked out → Disallow
    } else if (rows.length > 0 && rows[0].timeOut) {
      return res
        .status(400)
        .json({ error: "Attendance already marked for today" });
    } else {
      // Clock-in case
      const status = nowTime <= latestCheckIn ? "Incomplete" : "Late";
      if (nowTime > latestCheckIn && !allowLate) {
        return res.status(400).json({ error: "Check-in time has passed." });
      } else if (nowTime < latestCheckIn && allowLate) {
        status = "Late";
        console.log(nowTime, latestCheckIn, allowLate);
      }

      await db.execute(
        "INSERT INTO attendance (staffId, fullname, timeIn, status) VALUES (?, ?, ?, ?)",
        [staffId, staff.fullname, now, status]
      );

      await db.execute(
        "INSERT INTO notifications (message, type) VALUES (?, ?)",
        [`Attendance marked for ${staff.fullname}`, "attendance"]
      );

      return res.json({ message: "Checked in successfully.", staff });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to record attendance" });
  }
});

// DELETE staff
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute("DELETE FROM attendance WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete attendance" });
  }
});

router.get("/summary/today", async (req, res) => {
  try {
    // Fetch summary (this part remains the same)
    const [rows] = await db.execute(`
   SELECT status, COUNT(*) as count
   FROM attendance
   WHERE DATE(timeIn) = CURDATE() OR status = 'Absent' -- Include 'Absent' records created by the cron job
 GROUP BY status
  `);

    const summary = {
      present: 0,
      late: 0,
      absent: 0,
    };

    rows.forEach((row) => {
      const key = row.status?.toLowerCase();
      if (summary.hasOwnProperty(key)) {
        summary[key] = row.count;
      }
    });

    res.json(summary);
  } catch (err) {
    console.error("Summary fetch error:", err);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
});

export default router;

import express from "express";
const router = express.Router();
import db from "../db.js";

// Helper: respond consistently
function errorRes(res, code, message) {
  return res.status(code).json({ error: message });
}

// ================================
// CHECK IF STAFF ID EXISTS
// ================================
router.get("/staff/check/:staffId", async (req, res) => {
  try {
    const { staffId } = req.params;

    const [staff] = await db.query(
      "SELECT staffId FROM staffs WHERE staffId = ?",
      [staffId]
    );

    return res.json({ exists: staff.length > 0 });
  } catch (err) {
    console.error("CHECK STAFF ERROR:", err);
    return errorRes(res, 500, "Server error while checking staff ID");
  }
});

// ================================
// SUBMIT COMMENT (STAFF)
// ================================
router.post("/", async (req, res) => {
  try {
    const { staffId, comment } = req.body;

    if (!staffId || !comment) {
      return errorRes(res, 400, "Staff ID and comment are required");
    }

    // Validate staff ID is string (since VARCHAR in DB)
    if (typeof staffId !== "string") {
      return errorRes(res, 400, "Invalid staff ID format");
    }

    const [staff] = await db.query("SELECT * FROM staffs WHERE staffId = ?", [
      staffId,
    ]);

    if (staff.length === 0) {
      return errorRes(res, 404, "Invalid Staff ID");
    }

    const today = new Date().toISOString().split("T")[0];

    const [attendance] = await db.query(
      "SELECT * FROM attendance WHERE staffId = ? AND date = ?",
      [staffId, today]
    );

    if (attendance.length === 0) {
      return errorRes(res, 400, "You must check in before writing a comment.");
    }

    if (attendance[0].comment) {
      return errorRes(res, 400, "You have already written a comment today.");
    }

    // Accept comments only from 8 AM to 5 PM
    const hour = new Date().getHours();
    if (hour < 8 || hour > 17) {
      return errorRes(
        res,
        400,
        "Comments can only be written during working hours (8 AM - 5 PM)."
      );
    }

    // Save comment to attendance
    await db.query("UPDATE attendance SET comment = ? WHERE id = ?", [
      comment,
      attendance[0].id,
    ]);

    // Insert into admin inbox
    await db.query(
      "INSERT INTO inbox (attendanceId, staffId, comment, status) VALUES (?, ?, ?, ?)",
      [attendance[0].id, staffId, comment, "pending"]
    );

    // Optional: save notification
    await db.query("INSERT INTO notifications (type, message) VALUES (?, ?)", [
      "comment",
      `New comment from Staff ID ${staffId}`,
    ]);

    return res.json({ message: "Comment submitted successfully" });
  } catch (err) {
    console.error("COMMENT SUBMIT ERROR:", err);
    return errorRes(res, 500, "Server error submitting comment");
  }
});

// ================================
// GET PENDING COMMENTS
// ================================
router.get("/pending", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        i.id AS inboxId,
        i.attendanceId,
        i.staffId,
        s.fullname AS staffName,
        a.date,
        a.status AS originalStatus,
        i.comment,
        i.status AS commentStatus,
        i.adminFeedback,
        i.createdAt
      FROM inbox i
      INNER JOIN staffs s ON s.staffId = i.staffId
      INNER JOIN attendance a ON a.id = i.attendanceId
      WHERE i.status = 'pending'
      ORDER BY i.createdAt DESC
    `);

    return res.json(rows);
  } catch (err) {
    console.error("PENDING FETCH ERROR:", err);
    return errorRes(res, 500, "Failed to fetch pending comments");
  }
});

// ================================
// GET A COMMENT BY ATTENDANCE ID
// ================================
router.get("/:attendanceId", async (req, res) => {
  try {
    const { attendanceId } = req.params;

    const [rows] = await db.query(
      `
      SELECT a.*, s.fullname AS staffName
      FROM attendance a
      JOIN staffs s ON s.staffId = a.staffId
      WHERE a.id = ?
      LIMIT 1
      `,
      [attendanceId]
    );

    if (!rows.length) {
      return errorRes(res, 404, "Attendance record not found");
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error("FETCH COMMENT ERROR:", err);
    return errorRes(res, 500, "Failed to fetch comment details");
  }
});

// ================================
// GET INBOX ENTRY (FULL DETAILS)
// ================================
router.get("/inbox/:inboxId", async (req, res) => {
  try {
    const { inboxId } = req.params;

    const [rows] = await db.query(
      `
      SELECT 
        i.*,
        s.fullname AS staffName,
        a.date,
        a.status AS attendanceStatus
      FROM inbox i
      JOIN staffs s ON s.staffId = i.staffId
      JOIN attendance a ON a.id = i.attendanceId
      WHERE i.id = ?
      LIMIT 1
      `,
      [inboxId]
    );

    if (!rows.length) {
      return errorRes(res, 404, "Inbox entry not found");
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error("FETCH INBOX ERROR:", err);
    return errorRes(res, 500, "Failed to fetch inbox entry");
  }
});

// ================================
// REVIEW COMMENT (ADMIN)
// ================================
router.put("/review/:inboxId", async (req, res) => {
  try {
    const { inboxId } = req.params;
    const { action, feedback } = req.body;

    if (!["approve", "reject"].includes(action)) {
      return errorRes(res, 400, "Invalid action type");
    }

    if (feedback && typeof feedback !== "string") {
      return errorRes(res, 400, "Feedback must be a string");
    }

    const [inboxRows] = await db.query("SELECT * FROM inbox WHERE id = ?", [
      inboxId,
    ]);

    if (!inboxRows.length) {
      return errorRes(res, 404, "Inbox entry not found");
    }

    const inboxEntry = inboxRows[0];

    if (["approved", "rejected"].includes(inboxEntry.status)) {
      return errorRes(res, 400, `Comment already ${inboxEntry.status}`);
    }

    // Update inbox entry
    await db.query(
      "UPDATE inbox SET status = ?, adminFeedback = ?, updatedAt = NOW() WHERE id = ?",
      [
        action === "approve" ? "approved" : "rejected",
        feedback || null,
        inboxId,
      ]
    );

    //update attendance table with commentStatus and feedback
    await db.query(
      `UPDATE attendance SET commentStatus = ?, adminFeedback = ? WHERE id = ?`,
      [
        action === "approve" ? "approved" : "rejected",
        feedback || null,
        inboxEntry.attendanceId,
      ]
    );

    // If approved → update attendance status
    if (action === "approve") {
      await db.query(
        "UPDATE attendance SET comment = ?, status = ? WHERE id = ?",
        [inboxEntry.comment, "Present", inboxEntry.attendanceId]
      );
    }

    // If rejected -> update attendance commentstatus and adminFeedback
    if (action === "rejected") {
      await db.query(
        "UPDATE attendance SET comment = ?, commentStatus = ?, adminFeedback = ? WHERE id = ?",
        [
          inboxEntry.comment,
          inboxEntry.status,
          inboxEntry.adminFeedback,
          inboxEntry.attendanceId,
        ]
      );
    }

    const [updatedInbox] = await db.query("SELECT * FROM inbox WHERE id = ?", [
      inboxId,
    ]);

    return res.json({
      message: `Comment ${action}d successfully`,
      inbox: updatedInbox[0],
    });
  } catch (err) {
    console.error("REVIEW COMMENT ERROR:", err);
    return errorRes(res, 500, "Failed to review comment");
  }
});

export default router;

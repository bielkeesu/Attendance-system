import express from "express";
import bcrypt from "bcrypt";
import multer from "multer";

const router = express.Router();
import db from "../db.js";

// File upload setup for logo
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// ------------------------------
// GET Organization Settings
router.get("/organization", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM settings WHERE id = 1");
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

// ------------------------------
// UPDATE Organization Settings
router.put("/organization", upload.single("logo"), async (req, res) => {
  const { name, checkInTime, checkOutTime } = req.body;
  const logo = req.file ? req.file.filename : null;

  let query = "UPDATE settings SET name=?, checkInTime=?, checkOutTime=?";
  const values = [name, checkInTime, checkOutTime];

  if (logo) {
    query += ", logo=?";
    values.push(logo);
  }

  query += " WHERE id = 1";

  try {
    await db.query(query, values);
    const [updatedRows] = await db.query("SELECT * FROM settings WHERE id = 1");
    res.json(updatedRows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
});

// ------------------------------
// UPDATE Attendance Settings
router.put("/attendance", async (req, res) => {
  const {
    enableAttendance,
    earliestCheckIn,
    latestCheckIn,
    earliestCheckOut,
    latestCheckOut,
    allowLateCheckIn,
    defaultWorkHours,
  } = req.body;

  // Convert to 1 or 0
  const allowLate =
    allowLateCheckIn === "true" || allowLateCheckIn === true ? 1 : 0;

  const query = `
    UPDATE settings SET
      enableAttendance=?,
      earliestCheckIn=?,
      latestCheckIn=?,
      earliestCheckOut=?,
      latestCheckOut=?,
      allowLateCheckIn=?,
      defaultWorkHours=?
    WHERE id = 1
  `;

  try {
    await db.query(query, [
      enableAttendance,
      earliestCheckIn,
      latestCheckIn,
      earliestCheckOut,
      latestCheckOut,
      allowLate, // ✅ Fixed here
      defaultWorkHours,
    ]);
    const [updatedRows] = await db.query("SELECT * FROM settings WHERE id = 1");
    res.json(updatedRows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update attendance settings" });
  }
});

// ------------------------------
// UPDATE Admin Profile

router.put("/profile", async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM admin LIMIT 1");
    const admin = rows[0];

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // If changing password
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, admin.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid current password" });
      }

      const hashed = await bcrypt.hash(newPassword, 10);

      await db.query("UPDATE admin SET email = ?, password = ? WHERE id = ?", [
        email,
        hashed,
        admin.id,
      ]);

      // Optional: also update settings table if needed
      await db.query(
        "UPDATE settings SET email = ?, password = ? WHERE id = 1",
        [email, hashed]
      );
    } else {
      // Only update email
      await db.query("UPDATE admin SET email = ? WHERE id = ?", [
        email,
        admin.id,
      ]);

      // Optional: also update settings table if needed
      await db.query("UPDATE settings SET email = ? WHERE id = 1", [email]);
    }

    return res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Profile update error:", err);
    return res.status(500).json({ error: "Failed to update profile" });
  }
});

export default router;

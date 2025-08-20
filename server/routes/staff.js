import express from "express";
const router = express.Router();
import db from "../db.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// GET all staff
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM staffs");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching staffs:", err);
    res.status(500).json({ error: "Failed to fetch staffs" });
  }
});

// GET single staff by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute("SELECT * FROM staffs WHERE id = ?", [id]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Staff not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch staff" });
  }
});

// POST create new staff
router.post("/", upload.single("image"), async (req, res) => {
  const { staffId, fullname, officeNo, phoneNo } = req.body;
  const imageUrl = req.file ? req.file.filename : null;

  try {
    const [result] = await db.execute(
      "INSERT INTO staffs (staffId, fullname, officeNo, imageUrl, phoneNo) VALUES (?, ?, ?, ?, ?)",
      [staffId, fullname, officeNo, imageUrl, phoneNo]
    );

    await db.execute(
      "INSERT INTO notifications (message, type) VALUES (?, ?)",
      [`New staff added: ${fullname}`, "staff"]
    );

    const [newStaff] = await db.execute("SELECT * FROM staffs WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json(newStaff[0]);
  } catch (err) {
    console.error(err); // Show error details for debugging
    res.status(500).json({ error: "Failed to add staff" });
  }
});

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Convert import.meta.url for __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.put("/:id", upload.single("image"), async (req, res) => {
  const id = req.params.id; // ✅ Fix here
  const { staffId, fullname, officeNo, phoneNo } = req.body;

  try {
    // Fetch current staff to get old image
    const [existingRows] = await db.execute(
      "SELECT * FROM staffs WHERE id = ?",
      [id]
    );

    if (existingRows.length === 0)
      return res.status(404).json({ error: "Staff not found" });

    let imageUrl = existingRows[0].imageUrl;

    if (req.file) {
      // Delete old image file if exists
      const oldPath = path.join(
        __dirname,
        "..",
        "uploads",
        path.basename(imageUrl)
      );
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

      // Set new image path
      imageUrl = req.file.filename;
    }

    await db.execute(
      "UPDATE staffs SET staffId = ?, fullname = ?, officeNo = ?, imageUrl = ?, phoneNo = ? WHERE id = ?",
      [staffId, fullname, officeNo, imageUrl, phoneNo, id]
    );

    const [updated] = await db.execute("SELECT * FROM staffs WHERE id = ?", [
      id,
    ]);
    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update staff" });
  }
});

// DELETE staff
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute("DELETE FROM staffs WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete staff" });
  }
});

export default router;

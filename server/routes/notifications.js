import express from "express";
const router = express.Router();
import db from "../db.js";

// GET all notifications
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM notifications ORDER BY created_at DESC LIMIT 10"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

//Marks as Read
router.put("/mark-read/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute("UPDATE notifications SET is_read = TRUE WHERE id = ?", [
      id,
    ]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark as read" });
  }
});

//Clear notifications
router.delete("/clear", async (req, res) => {
  try {
    await db.execute("DELETE FROM notifications");
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear notifications" });
  }
});

export default router;

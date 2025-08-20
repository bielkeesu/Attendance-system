// routes/healthRoute.js
import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Run a simple query to test DB connectivity
    await db.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    // console.error("Health check failed:", error.message);
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
      details: error.message,
    });
  }
});

export default router;

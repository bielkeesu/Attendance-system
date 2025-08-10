import express from "express";
import cors from "cors";
import cron from "node-cron";
import staffRoutes from "./routes/staff.js";
import notificationRoutes from "./routes/notifications.js";
import settingsRoutes from "./routes/settings.js";
import attendanceRoutes from "./routes/attendance.js";
import { markAbsentStaff } from "./services/attendanceAutomation.js";
import authRoutes from "./routes/authController.js";
import verifyToken from "./middleware/authMiddleware.js";
import getSettings from "./routes/settingsController.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
dotenv.config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// // Required to get __dirname in ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Serve static files from the dist folder
// app.use(express.static(path.join(__dirname, "dist")));

app.use("/api/staff", staffRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/auth", authRoutes);
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Attendance System API is running");
});

// Fallback to index.html for React routes
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "dist", "index.html"));
// });

// Example: Run daily at 17:05 (05:50 PM)
cron.schedule(
  "00 17 * * *",
  async () => {
    const settings = await getSettings();
    if (!settings) {
      console.error("⚠️ No settings found. Skipping absent marking.");
      return;
    }
    console.log("Running daily attendance finalization job...");
    await markAbsentStaff(settings);
  },
  {
    timezone: "Africa/Lagos",
  }
);

// Start server
app.listen(port, () => console.log("Server running on http://localhost:5000"));

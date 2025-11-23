import express from "express";
import cors from "cors";
import cron from "node-cron";
import staffRoutes from "./routes/staff.js";
import notificationRoutes from "./routes/notifications.js";
import settingsRoutes from "./routes/settings.js";
import attendanceRoutes from "./routes/attendance.js";
import commentRoutes from "./routes/comment.js";
import { markAbsentStaff } from "./services/attendanceAutomation.js";
import authRoutes from "./routes/authController.js";
import verifyToken from "./middleware/authMiddleware.js";
import getSettings from "./routes/settingsController.js";
import dotenv from "dotenv";

const app = express();
dotenv.config();

const port = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://attendance-system-zeta-nine.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// app.use(
//   cors({
//     origin:"https://attendance-system-zeta-nine.vercel.app",
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     credentials: true, // if you need cookies/auth
//   })
// );

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is healthy 🚀" });
});

app.use("/api/staff", staffRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/auth", authRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/comment", commentRoutes);

app.get("/", (req, res) => {
  res.send("Attendance System API is running");
});

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
app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);

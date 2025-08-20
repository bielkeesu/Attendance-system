// markAbsentStaff.js
import cron from "node-cron";
import dayjs from "dayjs";
import getSettings from "../routes/settingsController.js";
import db from "../db.js";

const markAbsentStaff = async (settings) => {
  try {
    const now = dayjs(); // current time
    const currentDate = now.format("YYYY-MM-DD");

    // ✅ Validate earliestCheckIn (must match HH:mm:ss)
    if (
      !settings.earliestCheckIn ||
      !/^\d{2}:\d{2}(:\d{2})?$/.test(settings.earliestCheckIn)
    ) {
      console.error(
        "❌ Invalid or missing earliestCheckIn format (expected HH:mm or HH:mm:ss):",
        settings.earliestCheckIn
      );
      return;
    }

    // ✅ Validate defaultWorkHours
    const workHours = Number(settings.defaultWorkHours);
    if (isNaN(workHours) || workHours <= 0) {
      console.error(
        "❌ Invalid or missing defaultWorkHours:",
        settings.defaultWorkHours
      );
      return;
    }

    // Parse check-in hour and minute
    const [checkInHour, checkInMin] = settings.earliestCheckIn
      .split(":")
      .map((t) => Number(t));

    const cutoffTime = dayjs()
      .hour(checkInHour)
      .minute(checkInMin)
      .second(0)
      .add(workHours, "hour");

    if (now.isBefore(cutoffTime)) {
      console.log(
        "⏳ Too early to mark absent. Waiting until after work hours."
      );
      return;
    }

    // 🔍 Get all staff
    const [allStaff] = await db.execute("SELECT staffId, fullname FROM staffs");

    // 🧾 Get staff who already checked in today
    const [checkedInToday] = await db.execute(
      "SELECT DISTINCT staffId FROM attendance WHERE DATE(timeIn) = ?",
      [currentDate]
    );

    const checkedInStaffIds = checkedInToday.map((row) => row.staffId);

    // 🛑 Find staff who did NOT check in
    const absentStaff = allStaff.filter(
      (staff) => !checkedInStaffIds.includes(staff.staffId)
    );

    for (const staff of absentStaff) {
      await db.execute(
        "INSERT INTO attendance (staffId, fullname, date, timeIn, timeOut, status) VALUES (?, ?, ?, NULL, NULL, ?)",
        [staff.staffId, staff.fullname, currentDate, "Absent"]
      );

      await db.execute(
        "INSERT INTO notifications (message, type) VALUES (?, ?)",
        [`${staff.fullname} marked as Absent`, "attendance"]
      );
    }

    console.log("✅ Absent staff successfully marked.");
  } catch (err) {
    console.error("❌ Error marking absent staff:", err.message);
  }
};

export { markAbsentStaff };

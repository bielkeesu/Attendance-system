import db from "../db.js"; // ✅ Import DB connection

export default async function fetchSettingsFromDB() {
  try {
    const [settings] = await db.query("SELECT * FROM settings LIMIT 1");
    return settings[0]; // ✅ Return first row
  } catch (err) {
    console.error("Error fetching settings from DB:", err);
    return null;
  }
}

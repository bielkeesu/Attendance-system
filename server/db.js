import mysql from "mysql2/promise";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

let db;

try {
  db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      ca: fs.readFileSync("ca.pem"),
    },
  });

  // Test connection immediately
  (async () => {
    try {
      const connection = await db.getConnection();
      console.log("✅ Database connected successfully");
      connection.release();
    } catch (err) {
      console.error("❌ Database connection failed:", err.message);
    }
  })();
} catch (err) {
  console.error("❌ Database initialization error:", err.message);
}

export default db;

// import mysql from "mysql2/promise";
// import fs from "fs";
// import dotenv from "dotenv";
// dotenv.config();

// const db = mysql.createPool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// export default db;

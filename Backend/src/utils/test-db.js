const mysql = require("mysql2/promise");
require("dotenv").config();

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "neigeetsoleil_v4",
      port: process.env.DB_PORT || 3306,
    });

    const [rows] = await connection.execute("SELECT NOW()");
    console.log("✅ CONNECTED! Date from DB:", rows[0]);
    await connection.end();
  } catch (err) {
    console.error("❌ ERROR DB CONNECTION:", err.message);
  }
})();

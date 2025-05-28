const mysql = require("mysql2/promise");
require("dotenv").config();

// DEBUG: Δείξε τι περιέχει το .env
console.log("🌍 ENV Loaded:");
console.log("  HOST:", process.env.DB_HOST);
console.log("  USER:", process.env.DB_USER);
console.log("  PASSWORD:", process.env.DB_PASSWORD === "" ? "(vide)" : "(défini)");
console.log("  NAME:", process.env.DB_NAME);
console.log("  PORT:", process.env.DB_PORT);

const dbConnection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT) || 3306,
});

module.exports = dbConnection;


/*const mysql = require("mysql2/promise"); // Utilise le module mysql2 pour Node.js

const dbConnection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "0000",
    database: "NeigeEtSoleil_V4",
    port: 3307,
});

module.exports = dbConnection;
*/
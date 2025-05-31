const mysql = require("mysql2/promise"); // Utilise le module mysql2 pour Node.js

const dbConnection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "0000",
    database: "NeigeEtSoleil_V4",
    port: 3307,
});

module.exports = dbConnection;

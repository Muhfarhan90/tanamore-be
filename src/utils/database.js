const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "192.168.1.27",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "pekan53144", // Sesuaikan dengan password MySQL Anda
  database: process.env.DB_NAME || "tanamore",
  port: process.env.DB_PORT || 3306, // Sesuaikan dengan port MySQL Anda
});

module.exports = pool;

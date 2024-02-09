const mysql = require("mysql2");

// MySQL 연결 설정
const connection = mysql.createConnection({
    // host: "1.243.246.15",
    // user: "root",
    // password: "1234",
    // database: "ezteam2",
    // port: 5005,

    host: "192.168.45.188",
    user: "root",
    password: "1234",
    database: "ezteam2",
    port: 5005,
  });

  module.exports = connection;
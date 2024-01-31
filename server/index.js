const express = require('express');
const cors = require('cors');
const mysql = require("mysql2");

const app = express();
const port = 8000;
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CORS 설정
app.use(cors({ origin: 'http://localhost:3000' }));

// MySQL 연결 설정
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "1234",
  database: "ezteam2",
});

// MySQL 연결
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + connection.threadId);
});

app.get("/", (req, res) => res.send(`Hell'o World!`));


// 곽별이 -------------------------------










// 김민규 -------------------------------










// 김연진 -------------------------------










// 김지수 -------------------------------










// 상호형 -------------------------------










// 이기현 -------------------------------










// 이주호 -------------------------------










// 김민호 -------------------------------










// 전윤호 -------------------------------

app.listen(port, () => console.log(`port${port}`));
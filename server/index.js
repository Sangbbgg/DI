const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const port = 8000;
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CORS 설정
app.use(cors({ origin: "http://localhost:3000" }));

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

// orders 테이블이 존재하지 않을 경우 생성 쿼리문
const createOrdersTableQuery = `CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orderNumber VARCHAR(40) NOT NULL,
  userId INT NOT NULL,
  productCode VARCHAR(40) NOT NULL,
  status VARCHAR(20) DEFAULT "주문완료",
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  name VARCHAR(100) NOT NULL,
  zipcode VARCHAR(10),
  addr VARCHAR(255) NOT NULL,
  addrDetail VARCHAR(255),
  phoneNumber VARCHAR(20) NOT NULL,
  reqMessage VARCHAR(255),
  count INT NOT NULL,
  totalCount INT NOT NULL,
  totalAmount INT NOT NULL,
  payment VARCHAR(20) NOT NULL,
  refundText VARCHAR(255),
  usePoint INT DEFAULT 0,
  imageURL VARCHAR(600)
)`;

connection.query(createOrdersTableQuery); // orders 테이블 생성

// DB order 테이블에 사용자의 주문서 등록
app.post("/reqOrder", async (req, res, next) => {
  try {
    const { orderSheet } = req.body;

    orderSheet.map(async (article) => {
      console.log(article);
      const data = [
        article.orderNumber,
        article.userId,
        article.productCode,
        article.name,
        article.addr,
        article.phoneNumber,
        article.reqMessage,
        article.count,
        article.totalCount,
        article.totalAmount,
        article.payment,
        article.usePoint,
        article.imageURL,
      ];

      await db.query(
        "INSERT INTO orders (orderNumber, userId, productCode, name, addr, phoneNumber, reqMessage, count, totalCount, totalAmount, payment, usePoint,imageURL) VALUES (?)",
        [data]
      );
    });

    return res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 오더시트에서 사용자 정보 조회
app.get("/ordersheet", async (req, res, next) => {
  try {
    const { userId } = req.query;
    const [userData] = await db.query(
      "SELECT id, name, phoneNumber, address, point FROM user WHERE id = ?",
      [userId]
    );
    return res.send(userData);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 이주호 -------------------------------

// 김민호 -------------------------------

// 전윤호 -------------------------------

app.listen(port, () => console.log(`port${port}`));

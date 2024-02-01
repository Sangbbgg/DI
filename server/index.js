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

// products테이블의 데이터를 /shop 경로로 전달
app.get("/shop", (req,res) => {
  const sqlQuery = "SELECT * FROM PRSHOP.PRODUCTS;";
  connection.query(sqlQuery, (err, result) => {
      res.send(result);
  })
})
// review 테이블의 데이터를 /review 경로로 전달
app.get("/review", (req,res) => {
  const sqlQuery = "SELECT * FROM PRSHOP.REVIEW;";
  connection.query(sqlQuery, (err, result) => {
      res.send(result);
  })
})

// question 테이블의 데이터를 /question 경로로 전달
app.get("/question", (req,res) => {
  const sqlQuery = "SELECT * FROM PRSHOP.QUESTION;";
  connection.query(sqlQuery, (err, result) => {
      res.send(result);
  })
})

// 클라이언트의 req (response,questionid)을 받아 question 테이블의 해당 questionid의 response 컬럼값을 req.body.response로 업데이트
app.put("/question", (req, res) => {
  const response = req.body.response;
  const questionid = req.body.questionid;   
  const sqlQuery = "UPDATE PRSHOP.QUESTION SET response = ? WHERE questionid = ?;"
  connection.query(sqlQuery, [response, questionid], (err, result) => {
      if (err) {
          console.error("Database error:", err);
          res.status(500).send("Internal Server Error");
      } else {
          console.log("Database update successful");  
          res.send(result);
          console.log(response, questionid)
      }
  })
})

app.listen(port, () => console.log(`port${port}`));

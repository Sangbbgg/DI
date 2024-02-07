const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const port = 8000;
const bodyParser = require("body-parser");

// 상호형 -------------------------------
const carbonFootprintRouter = require("./Routes/CarbonFootprint");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CORS 설정
app.use(cors({ origin: "http://localhost:3000" }));

// MySQL 연결 설정
const connection = mysql.createConnection({
  // host: "127.0.0.1",
  // user: "root",
  // password: "1234",
  // database: "ezteam2",
  // 외부 데이터 베이스 MySQL
  host: "1.243.246.15",
  user: "root",
  password: "1234",
  database: "ezteam2",
  port: 5005,
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
app.use("/api/carbonFootprint", carbonFootprintRouter);
// 이기현 -------------------------------

// 배포 준비시 사용 예정  ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
// dotenv 환경설정
// dotenv.config();

// const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

const base = "https://api-m.sandbox.paypal.com"; // 페이팔 api 주소

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

// 여기서부터 Paypal API 채용 코드  ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
// 현재는 PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET 데이터 값이 없어 오류가 나므로 모두 주석처리
// paypal API 인증 토큰 발급
// const generateAccessToken = async () => {
//   try {
//     if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
//       throw new Error("MISSING_API_CREDENTIALS");
//     }

//     // 인증키 암호화
//     const auth = Buffer.from(
//       PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET
//     ).toString("base64");

//     // paypal 서버에 데이터 전송 및 응답
//     const response = await fetch(`${base}/v1/oauth2/token`, {
//       method: "POST",
//       body: "grant_type=client_credentials",
//       headers: {
//         Authorization: `Basic ${auth}`,
//       },
//     });

//     const data = await response.json();
//     return data.access_token;
//   } catch (error) {
//     console.error("Failed to generate Access Token:", error);
//   }
// };

// /**
//  * Create an order to start the transaction.
//  * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
//  */
// const createOrder = async (cart) => {
//   // use the cart information passed from the front-end to calculate the purchase unit details
//   console.log(
//     "shopping cart information passed from the frontend createOrder() callback:",
//     cart
//   );

//   let sumAmount = 0;
//   const accessToken = await generateAccessToken(); // accessToken 발급받기
//   const url = `${base}/v2/checkout/orders`;

//   cart.map((item) => (sumAmount += item.price * item.count));
//   sumAmount = Math.ceil(sumAmount / 1332.7); // 1332.7 달러환율을 의미

//   // paypal 청구서 정보
//   const payload = {
//     intent: "CAPTURE",
//     purchase_units: [
//       {
//         amount: {
//           currency_code: "USD",
//           value: sumAmount,
//         },
//       },
//     ],
//   };

//   // paypal 서버에 청구서 동봉하여 데이터 전송 및 응답
//   const response = await fetch(url, {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${accessToken}`,
//       // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
//       // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
//       // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
//       // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
//       // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
//     },
//     method: "POST",
//     body: JSON.stringify(payload),
//   });

//   return handleResponse(response);
// };

// /**
//  * Capture payment for the created order to complete the transaction.
//  * @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
//  */
// const captureOrder = async (orderID) => {
//   const accessToken = await generateAccessToken();
//   const url = `${base}/v2/checkout/orders/${orderID}/capture`;

//   const response = await fetch(url, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${accessToken}`,
//       // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
//       // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
//       // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
//       // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
//       // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
//     },
//   });

//   return handleResponse(response);
// };

// // 응답받은 데이터를 json() 변환
// async function handleResponse(response) {
//   try {
//     const jsonResponse = await response.json();
//     return {
//       jsonResponse,
//       httpStatusCode: response.status,
//     };
//   } catch (err) {
//     const errorMessage = await response.text();
//     throw new Error(errorMessage);
//   }
// }

// server.post("/orders", async (req, res) => {
//   try {
//     // use the cart information passed from the front-end to calculate the order amount detals
//     const { cart } = req.body;
//     const { jsonResponse, httpStatusCode } = await createOrder(cart);
//     res.status(httpStatusCode).json(jsonResponse);
//   } catch (error) {
//     console.error("Failed to create order:", error);
//     res.status(500).json({ error: "Failed to create order." });
//   }
// });

// server.post("/orders/:orderID/capture", async (req, res) => {
//   try {
//     const { orderID } = req.params;
//     const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
//     res.status(httpStatusCode).json(jsonResponse);
//   } catch (error) {
//     console.error("Failed to create order:", error);
//     res.status(500).json({ error: "Failed to capture order." });
//   }
// });
// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

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
app.get("/shop", (req, res) => {
  const sqlQuery = "SELECT * FROM PRSHOP.PRODUCTS;";
  connection.query(sqlQuery, (err, result) => {
    res.send(result);
  });
});
// review 테이블의 데이터를 /review 경로로 전달
app.get("/review", (req, res) => {
  const sqlQuery = "SELECT * FROM PRSHOP.REVIEW;";
  connection.query(sqlQuery, (err, result) => {
    res.send(result);
  });
});

// question 테이블의 데이터를 /question 경로로 전달
app.get("/question", (req, res) => {
  const sqlQuery = "SELECT * FROM PRSHOP.QUESTION;";
  connection.query(sqlQuery, (err, result) => {
    res.send(result);
  });
});

// 클라이언트의 req (response,questionid)을 받아 question 테이블의 해당 questionid의 response 컬럼값을 req.body.response로 업데이트
app.put("/question", (req, res) => {
  const response = req.body.response;
  const questionid = req.body.questionid;
  const sqlQuery =
    "UPDATE PRSHOP.QUESTION SET response = ? WHERE questionid = ?;";
  connection.query(sqlQuery, [response, questionid], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      res.status(500).send("Internal Server Error");
    } else {
      console.log("Database update successful");
      res.send(result);
      console.log(response, questionid);
    }
  });
});

app.listen(port, () => console.log(`port${port}`));

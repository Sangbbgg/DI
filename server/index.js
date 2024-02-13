const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const mysqlPromise = require("mysql2/promise");
const bcrypt = require("bcrypt");
const session = require("express-session");//0213 김민호 세션 추가
const MySQLStore= require('express-mysql-session')(session);//0213 김민호 

// 이기현_추가 코드 ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

// chatGPT 설명
// mysql2/promise:
// 프로미스 기반의 API를 사용합니다.
// 쿼리를 수행한 결과가 프로미스로 반환되어 .then() 및 .catch()를 사용하여 처리할 수 있습니다.

// 저는 "mysql2/promise" 모듈을 사용하였기에 코드를 취합하는 과정에서 문제가 발생합니다.
// 그러므로 다른 변수 이름(mysqlPromise)으로 해당 모듈을 사용해서,
// MySQL 연결을 추가 설정함으로써 문제를 해결하였습니다.

// 밑에 MySQL 연결 설정 문단에서 주석을 확인해주십시오.

// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

const app = express();
const port = 8000;
const bodyParser = require("body-parser");

// 상호형 -------------------------------
const carbonFootprintRouter = require("./Routes/CarbonFootprint");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CORS 설정
app.use(cors({ origin: "http://localhost:3000" }));

// 이기현_추가 주석 ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

// 현재 MySQL 연결 설정이 각각 connection, PromiseConnection 이름으로 되어있습니다,
// chatGPT 의 답변에 따르면, 현재의 코드는 문제가 없다고 하며,
// 실제로 목 데이터를 넣고 사용한 결과, 별다른 문제점은 발견되지 않았습니다.
// const mysql = require("mysql2") 기반으로 모듈을 사용한 분은 connection 사용하시고,
// 저처럼 require("mysql2/promise") 기반으로 모듈을 사용한 분은 PromiseConnection 을
// 사용하시기 바랍니다.

// 문제가 발생할 경우 제게도 알려주세요!

// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

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

  // host: "192.168.45.188",
  // user: "root",
  // password: "1234",
  // database: "ezteam2",
  // port: 5005,
});

// 프로미스 기반 MySQL 연결 설정
const PromiseConnection = mysqlPromise.createPool({
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

const PAYPAL_CLIENT_ID =
  "AZEh01o-yVFl957KTW72L1B3LiPyGN5Z5IJV2xTcDEfE3pBsbwt59kPiqvUbBmAacAtEmo0t9x0mzRdT";
const PAYPAL_CLIENT_SECRET =
  "EJGeViT1jFj1g2V1Gtn2DM_M5DbVbn-HkGF9PNZ4x-Zy4fNB5KF067kt0NMjMZ8OE23FH3xAhdXj5dvb";

const base = "https://api-m.sandbox.paypal.com"; // 페이팔 api 주소

// orders 테이블이 존재하지 않을 경우 생성 쿼리문
// FOREIGN KEY 추가
const createOrdersTableQuery = `CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orderNumber VARCHAR(40) NOT NULL,
  userId INT NOT NULL,
  FOREIGN KEY (userId) REFERENCES login(userNumber),
  productCode VARCHAR(40) NOT NULL,
  status VARCHAR(20) DEFAULT "주문완료",
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  orderName VARCHAR(100) NOT NULL,
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
);`;

connection.query(createOrdersTableQuery); // orders 테이블 생성

// 여기서부터 Paypal API 채용 코드  ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
// 현재는 PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET 데이터 값이 없어 오류가 나므로 모두 주석처리
// paypal API 인증 토큰 발급
const generateAccessToken = async () => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }

    // 인증키 암호화
    const auth = Buffer.from(
      PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET
    ).toString("base64");

    // paypal 서버에 데이터 전송 및 응답
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
  }
};

/**
 * Create an order to start the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
const createOrder = async (cart) => {
  // use the cart information passed from the front-end to calculate the purchase unit details
  console.log(
    "shopping cart information passed from the frontend createOrder() callback:",
    cart
  );

  let sumAmount = 0;
  const accessToken = await generateAccessToken(); // accessToken 발급받기
  const url = `${base}/v2/checkout/orders`;

  cart.map((item) => (sumAmount += item.price * item.count));
  sumAmount = Math.ceil(sumAmount / 1332.7); // 1332.7 달러환율을 의미

  // paypal 청구서 정보
  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: sumAmount,
        },
      },
    ],
  };

  // paypal 서버에 청구서 동봉하여 데이터 전송 및 응답
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

/**
 * Capture payment for the created order to complete the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
 */
const captureOrder = async (orderID) => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderID}/capture`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
  });

  return handleResponse(response);
};

// 응답받은 데이터를 json() 변환
async function handleResponse(response) {
  try {
    const jsonResponse = await response.json();
    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}

app.post("/orders", async (req, res) => {
  try {
    // use the cart information passed from the front-end to calculate the order amount detals
    const { cart } = req.body;
    const { jsonResponse, httpStatusCode } = await createOrder(cart);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
});

app.post("/orders/:orderID/capture", async (req, res) => {
  try {
    const { orderID } = req.params;
    const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
});
// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

// DB order 테이블에 사용자의 주문서 등록
app.post("/reqOrder", async (req, res, next) => {
  try {
    const { orderSheet } = req.body;
    const query =
      "INSERT INTO orders (orderNumber, userId, productCode, orderName, addr, phoneNumber, reqMessage, count, totalCount, totalAmount, payment, usePoint) VALUES (?)";

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
        // article.imageURL,
      ];

      await PromiseConnection.query(query, [data]);
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
    console.log(userId);
    const [userData] = await PromiseConnection.query(
      "SELECT username, phoneNumber, address, userNumber FROM login WHERE userNumber = ?",
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
//-------------------------------개인 회원번호---------------------------------------------
const usedUserNumbers = new Set(); // 중복 방지를 위한 Set

async function generateUserid() {
  const min = 100000;
  const max = 199999;
  let randomUserNumber = Math.floor(Math.random() * (max - min + 1) + min);

  // 중복 체크
  while (usedUserNumbers.has(randomUserNumber)) {
    randomUserNumber = Math.floor(Math.random() * (max - min + 1) + min);
  }

  // 중복이 없으면 Set에 추가
  usedUserNumbers.add(randomUserNumber);

  return randomUserNumber;
}
//-------------------------------기업 회원번호---------------------------------------------
const usedCorporateUserNumbers = new Set(); // 중복 방지를 위한 Set

async function generateCorporateUserid() {
  const min = 200000; // 예시로 200000부터 시작하도록 설정
  const max = 299999; // 예시로 299999까지 범위 설정
  let randomCorporateUserNumber = Math.floor(Math.random() * (max - min + 1) + min);

  // 중복 체크
  while (usedCorporateUserNumbers.has(randomCorporateUserNumber)) {
    randomCorporateUserNumber = Math.floor(Math.random() * (max - min + 1) + min);
  }

  // 중복이 없으면 Set에 추가
  usedCorporateUserNumbers.add(randomCorporateUserNumber);

  return randomCorporateUserNumber;
}
//-------------------------------로그인-----------------------------------------------

//-------------------------------익스플로스 세션 0213------------------------------------
const sessionStore = new MySQLStore({
  expiration: 3600000, // 세션의 유효시간 (1시간)
  createDatabaseTable: true, // 세션 테이블을 자동으로 생성
  schema: {
    tableName: 'sessions', // 세션 테이블의 이름
    columnNames: {
      session_id: 'session_id', // 세션 ID를 저장하는 열의 이름
      expires: 'expires', // 세션 만료 시간을 저장하는 열의 이름
      data: 'data', // 세션 데이터를 저장하는 열의 이름
    },
  },
}, connection);

app.use(session({
  secret: 'secretKey', // 랜덤하고 안전한 문자열로 바꾸세요.
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    maxAge: 3600000,
    httpOnly: true,
  },
}));
//-------------------------------익스플로스 세션 0213------------------------------------

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 이메일을 사용하여 데이터베이스에서 사용자를 찾습니다.
    connection.query(
      "SELECT * FROM user WHERE email = ?",
      [email],
      async (err, result) => {
        if (err) {
          console.error("서버에서 에러 발생:", err);
          res.status(500).send({ success: false, message: "서버 에러 발생" });
        } else {
          if (result.length > 0) {
            const isPasswordMatch = await bcrypt.compare(
              password,
              result[0].password
            );
            if (isPasswordMatch) {
            // 0213 김민호 세션스토리 초기화 확인
            if (!req.session) {
              req.session = {};
            }
            //세션데이터 저장(새로운 데이터 추가시 이부분 수정)
            req.session.usertype = result[0].usertype;//0213 김민호 익스플로우 세션기능 추가
            req.session.userid = result[0].userid;//0213 김민호 익스플로우 세션기능 추가

              res.send({ success: true, message: "로그인 성공", data: result });
            } else {
              res.send({
                success: false,
                message: "비밀번호가 일치하지 않습니다.",
              });
            }
          } else {
            res.send({ success: false, message: "유저 정보가 없습니다." });
          }
        }
      }
    );
  } catch (error) {
    console.error("비밀번호 비교 중 오류:", error);
    res.status(500).send({ success: false, message: "서버 에러 발생" });
  }
});
//-------------------------------회원가입----------------------------------------------
app.post("/regester", async (req, res) => {
  // 클라이언트에서 받은 요청의 body에서 필요한 정보를 추출합니다.
  const { username, password, email, address, detailedaddress, phonenumber, usertype: clientUsertype } = req.body;

  try {
    // 비밀번호를 해시화합니다.
    const hashedPassword = await bcrypt.hash(password, 10);

    // 회원번호를 생성합니다. (6자리)
    const userid = await generateUserid();

    // 클라이언트에서 받은 usertype을 서버에서 사용하는 usertype으로 변환합니다.
    const usertypeNumber = {
      personal: 1, // 개인
      business: 2, // 기업
      organization: 3, // 단체
    };

    const serverUsertype = usertypeNumber[clientUsertype];

    // MySQL 쿼리를 작성하여 회원 정보를 데이터베이스에 삽입합니다.
    const sql =
      "INSERT INTO user (userid, username, email, password, address, detailedaddress, phonenumber, usertype) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    connection.query(
      sql,
      [userid, username, email, hashedPassword, address, detailedaddress, phonenumber, serverUsertype],
      (err, result) => {
        if (err) {
          // 쿼리 실행 중 에러가 발생한 경우 에러를 처리합니다.
          console.error("MySQL에 데이터 삽입 중 오류:", err);
          return res.status(500).json({
            success: false,
            message: "회원가입 중 오류가 발생했습니다.",
            error: err.message,
          });
        }
        // 회원가입이 성공한 경우 응답을 클라이언트에게 보냅니다.
        console.log("사용자가 성공적으로 등록됨");
        return res.status(200).json({
          success: true,
          message: "사용자가 성공적으로 등록됨",
          usertype: serverUsertype,
        });
      }
    );
  } catch (error) {
    // 회원가입 중 다른 내부적인 오류가 발생한 경우 에러를 처리합니다.
    console.error("회원가입 중 오류:", error);
    return res.status(500).json({
      success: false,
      message: "내부 서버 오류",
      details: error.message,
    });
  }
});
// 전윤호 -------------------------------

// products테이블의 데이터를 /shop 경로로 전달
app.get("/shop", (req, res) => {
  const sqlQuery = "SELECT * FROM ezteam2.sample_product;"; // <<테스트용 추가 코드_이기현
  // const sqlQuery = "SELECT * FROM PRSHOP.PRODUCTS;"; << 원본
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

// const express = require('express'); // 웹 프레임워크 - 서버를 만들고, 라우팅을 돕고, 미들웨어를 추가 가능하게 해줌
// const mysql = require('mysql2'); // MySQL과 상호 작용하기 위한 모듈
// const cors = require('cors'); // 서로 다른 출처 간의 데이터 공유 미들웨어
// const util = require('util'); // 유틸리티 함수 제공 내장 모듈, 콜백 기반의 함수를 프로미스 기반으로 변환
// const { exec } = require('child_process'); // child_process : 외부 프로세스 생성 및 제어


// const server = express();
// const port = 8081;

// server.use(cors());

// // MySQL 연결 설정
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '1234',
//   database: 'news'
// });

// // exec 함수에 Promise를 적용
// const execPromise = util.promisify(exec);

// // localhost:8081로 접속하면
// server.get("/", async (req, res) => {
//   try {
//     // "python NewsAPI.py" 실행
//     await execPromise('python NewsAPI.py');
//     // 실행되면 출력
//     res.send("Python 스크립트가 실행되었습니다.");
//   } catch (error) {
//     console.error(`오류: ${error.message}`);
//     res.status(500).send("내부 서버 오류");
//   }
// });

// // localhost:8081/news로 접속하면
// server.get("/news", (req, res) => {
//   // MySQL에서 뉴스 데이터를 가져와서 응답
//   db.query(
//     // sql의 pubDate 값이 날짜형식이므로 문자형식으로 변환
//     "SELECT image_url, title, content, url, DATE_FORMAT(pubDate, '%Y-%m-%d %H:%i:%s') AS pubDate FROM news",
//     (err, results) => {
//       if (err) {
//         console.error("MySQL에서 뉴스데이터 가져오기 중 오류:", err);
//         res.status(500).send("Internal Server Error");
//         return;
//       }
//       res.json(results);
//     }
//   );
// });

// server.listen(port, () => {
//   console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
// });

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const util = require("util");
const { exec } = require("child_process");

const server = express();
const port = 8081;

server.use(cors());
server.use(express.json()); // JSON 파싱을 위한 미들웨어 추가

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "news",
});

const execPromise = util.promisify(exec);

server.post("/likes", (req, res) => {
  const { newsId, isLiked } = req.body;
  db.query(
    "INSERT INTO likes (newsId, isLiked) VALUES (?, ?)",
    [newsId, isLiked],
    (err, results) => {
      if (err) {
        console.error("좋아요 데이터 저장 중 오류:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.json({ success: true });
    }
  );
});

server.post("/views", (req, res) => {
  const { newsId, clickCount } = req.body;
  db.query(
    "UPDATE news SET clickCount = ? WHERE newsId = ?",
    [clickCount, newsId],
    (err, results) => {
      if (err) {
        console.error("조회수 데이터 저장 중 오류:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.json({ success: true });
    }
  );
});

server.get("/", async (req, res) => {
  try {
    await execPromise("python NewsAPI.py");
    res.send("Python 스크립트가 실행되었습니다.");
  } catch (error) {
    console.error(`오류: ${error.message}`);
    res.status(500).send("내부 서버 오류");
  }
});

server.get("/news", (req, res) => {
  db.query(
    "SELECT idx, image_url, title, content, url, DATE_FORMAT(pubDate, '%Y-%m-%d %H:%i:%s') AS pubDate FROM news",
    (err, results) => {
      if (err) {
        console.error("MySQL에서 뉴스데이터 가져오기 중 오류:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.json(results);
    }
  );
});

server.listen(port, () => {
  console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});
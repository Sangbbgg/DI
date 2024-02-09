const express = require("express");
const router = express.Router();
const connection = require("../db");

router.get("/", async (req, res) => {
  // MySQL에서 데이터를 가져와 JSON 형식으로 응답

  // 첫 번째 쿼리: carbon_footprint에서 데이터 가져오기
  const carbonFootprint = new Promise((resolve, reject) => {
    connection.query("SELECT * FROM carbon_footprint;", (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
  const carbonFootprintData = await carbonFootprint;

  // 두 번째 쿼리: calculation_advice에서 데이터 가져오기
  const calculationAdvice = new Promise((resolve, reject) => {
    connection.query(
      "SELECT a.name, b.advice_text, b.savings_value FROM calculation_category as a join calculation_advice as b ON a.id = b.category_id;",
      (err, results) => {
        if (err) reject(err);
        else resolve(results);
      }
    );
  });
  const calculationAdviceData = await calculationAdvice;

  // 두 쿼리의 결과를 합쳐서 응답
  res.json({
    carbonFootprintData,
    calculationAdviceData,
  });
});
// 해당 월의 데이터 존재 여부를 확인하는 라우트
router.get("/check/:userId/:date", async (req, res) => {
  const { userId, date } = req.params;
  const yearMonth = date.slice(0, 7); // 'YYYY-MM' 형식으로 변환

  // 해당 월의 첫 날과 마지막 날을 계산
  const startDate = `${yearMonth}-01`;
  const endDate = new Date(yearMonth);
  endDate.setMonth(endDate.getMonth() + 1);
  endDate.setDate(0);
  const lastDay = endDate.getDate();
  const endDateStr = `${yearMonth}-${lastDay}`;

  console.log(`Checking data for user ${userId} between ${startDate} and ${endDateStr}`);

  try {
    const query = `
        SELECT * FROM user_calculation 
        WHERE user_id = ? 
        AND calculation_month BETWEEN ? AND ?;
      `;

    console.log(`Executing query: ${query}`);
    console.log(`With parameters: userId=${userId}, startDate=${startDate}, endDateStr=${endDateStr}`);

    connection.query(query, [userId, startDate, endDateStr], (err, results) => {
      if (err) {
        console.error("Query error:", err);
        return res.status(500).send("Error querying the database");
      }

      if (results.length > 0) {
        console.log(`Found data for user ${userId} in the specified month.`);
        res.json({ hasData: true, data: results[0] });
      } else {
        console.log(`No data found for user ${userId} in the specified month.`);
        res.json({ hasData: false });
      }
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send("Server error");
  }
});

// POST 라우트 추가
router.post("/", async (req, res) => {
  const { userId, calculationMonth, electricity, gas, water, transportation, waste, total } = req.body;

  const insertQuery =
    "INSERT INTO user_calculation (user_id, calculation_month, electricity, gas, water, transportation, waste, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?);";

  connection.query(
    insertQuery,
    [userId, calculationMonth, electricity, gas, water, transportation, waste, total],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ message: "Error saving data to the database", error: err.message });
      }
      res.status(201).send({ message: "Data saved successfully", data: req.body });
    }
  );
});
module.exports = router;

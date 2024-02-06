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
    connection.query("SELECT a.name, b.advice_text, b.savings_value FROM calculation_category as a join calculation_advice as b ON a.id = b.category_id;", (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
  const calculationAdviceData = await calculationAdvice;

  // 두 쿼리의 결과를 합쳐서 응답
  res.json({
    carbonFootprintData,
    calculationAdviceData,
  });
});

module.exports = router;

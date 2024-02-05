const express = require("express");
const router = express.Router();
const connection = require("../db");
router.get("/", (req, res) => {
  // MySQL에서 데이터를 가져와 JSON 형식으로 응답
  connection.query("select * from carbon_footprint;", (err, results) => {
    if (err) {
      console.error("Error executing MySQL query: " + err.stack);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    res.json(results);
  });
});

module.exports = router;

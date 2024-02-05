import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

function Result({ resultData }) {
  console.log("계산결과 : ",resultData)
  // 객체를 배열로 변환
  const resultData2 = Object.entries(resultData)
    .filter(([key]) => key !== "total") // "total" 키는 제외
    .map(([name, uv]) => ({
      name, // 키 이름을 'name'으로
      uv: parseFloat(uv), // 문자열 값을 숫자로 변환하여 'uv'로
    }));

  return (
    <div>
      <section className="household_two_step">
        <p>결과 페이지</p>
      </section>

      <BarChart width={600} height={300} data={resultData2}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="uv" fill="#8884d8" />
      </BarChart>
    </div>
  );
}

export default Result;

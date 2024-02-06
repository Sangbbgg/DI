import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

function Result({ resultData }) {
  // 개발 데이터---------------------------------------------------------------------
  const moclData1 = {
    // 평균 데이터
    electricity: 32.5,
    gas: 38.9,
    water: 1.6,
    transportation: 270.8,
    waste: 0.6,
    total: 344.4,
  };
  const moclData2 = {
    electricity: {
      "하루 1시간은 에어컨 대신 선풍기로!": 3.2,
      "세탁은 모아서 해도 잘 된답니다.": 0.6,
      "전기밥솥 보온기능은 전기먹는 하마": 5.9,
      "냉장실은 60% 채우면 효율이 최고": 1,
      "컴퓨터 절전프로그램사용": 1.6,
      "TV 시청 줄이고 가족과 대화 늘리고!": 1.8,
    },
    gas: {
      "겨울철 난방온도는 20˚C가 적당해요": 14.6,
      "보일러 사용시간 1시간만 줄여요": 28.3,
    },
    water: {
      "절수기로 물낭비를 쉽게 막아요.": 3.9,
      "물을 받아서 사용해요.(설거지, 양치할때)": 0.4,
      "짧게 샤워하는 그대가 진정한 멋쟁이!": 0.6,
    },
    transportation: {
      "도보와 자전거로 건강도 UP!": 2.1,
      "1주일에 한번쯤은 대중교통 어때요?": 39.1,
      "경제속도는 60~80km/h, 연비 최고!": 5.5,
      "불필요한 짐은 트렁크에서 OUT!": 4.7,
      "타이어 공기압 체크, 연료비 DOWN!": 6.9,
      "실시간 네비게이션 더 빠른 길로 GO!": 32.6,
    },
    waste: {
      "재활용이 가능한 유리병, 캔 등 분리배출해요": 7.3,
      "먹을만큼 만들고 쓰레기를 20% 줄여봐요!": 7.3,
    },
  };
  // -------------------------------------------------------------------------------

  console.log("계산결과 : ", resultData);
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

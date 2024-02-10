import React, { useState, useEffect } from "react";
import PiChart from "./Result/piChartData";
import BarChart from "./Result/barChart";
import { useNavigate } from "react-router-dom";

function Result({ initialData, resultData, userData }) {
  const navigate = useNavigate();
  const [barChatData, setBarChatData] = useState([]);

  const hasResultData = resultData && resultData.calculation_month;

  // console.log("유저 결과 :", userData);
  console.log("추천 실천과제:", initialData);
  console.log("resultData:", resultData);
  // const userId = 104716;

  const averageData = {
    // 평균 데이터
    electricity: 32.5,
    gas: 38.9,
    water: 1.6,
    transportation: 270.8,
    waste: 0.6,
    total: 344.4,
  };

  const labels = {
    electricity: "전기",
    gas: "가스",
    water: "수도",
    transportation: "교통",
    waste: "폐기물",
  };

  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF9752", "#FF8042"];
  // useEffect를 컴포넌트 최상위 수준으로 이동
  useEffect(() => {
    const convertToChartData = (resultData, averageData, labels, colors) => {
      return Object.keys(labels).map((key, index) => ({
        name: labels[key],
        user: parseFloat(resultData[key]),
        average: averageData[key],
        color: colors[index],
      }));
    };

    if (resultData && Object.keys(resultData).length > 0) {
      const data = convertToChartData(resultData, averageData, labels, colors);
      setBarChatData(data); // 상태 업데이트 함수를 올바르게 호출
    }
  }, [resultData]);

  // 객체를 배열로 변환
  function convertDataToObject(resultData) {
    // resultData가 유효하지 않은 경우, 빈 객체로 처리
    if (!resultData || typeof resultData !== "object") {
      console.error("Invalid or undefined resultData:", resultData);
      return [];
    }

    const result = [];
    for (const [key, value] of Object.entries(resultData)) {
      if (key !== "total" && labels[key]) {
        result.push({
          name: labels[key],
          value: parseFloat(value),
        });
      }
    }

    return result;
  }
  const data = convertDataToObject(resultData);

  // 탄소계산기 다시하기 이벤트 핸들러
  const onClickCarbonFootprint = () => {
    // confirm 대화상자를 표시하고 사용자의 응답을 변수에 저장
    const userConfirmed = window.confirm("작성된 데이터가 초기화 됩니다. 계속하시겠습니까?");

    // 사용자가 '확인'을 클릭했을 때의 로직
    if (userConfirmed) {
      window.location.href = "/carbonfootprint";
      // 첫 페이지로 리플레시하는 로직
      navigate("/carbonfootprint");
    }
    // 사용자가 '취소'를 클릭했을 때는 아무것도 하지 않음
  };

  const onSaveClick = async () => {
    const calculationMonth = new Date().toISOString().slice(0, 10); // 현재 날짜를 'YYYY-MM-DD' 형식으로 설정
    const postData = {
      userId: userData.userNumber,
      electricity: resultData.electricity,
      gas: resultData.gas,
      water: resultData.water,
      transportation: resultData.transportation,
      waste: resultData.waste,
      total: resultData.total,
      calculationMonth: calculationMonth,
    };

    try {
      const response = await fetch("http://localhost:8000/api/carbonFootprint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Failed to save data");
      }

      // 데이터 저장 성공 후 알림 표시
      alert("데이터가 성공적으로 저장되었습니다. 메인 페이지로 이동합니다.");
      // 메인 페이지로 리다이렉트
      navigate("/"); // 또는 React Router를 사용하는 경우: history.push('/');
    } catch (error) {
      console.error("Error saving data: " + error.message);
      alert("데이터 저장에 실패했습니다.");
    }
  };

  return (
    <div>
      <section className="household_two_step">
        <p>결과 페이지</p>
      </section>
      <div>
        <div>
          <p>사용량 분석</p>
        </div>
        <div style={{ width: "100%" }}>
          <PiChart data={data} />
          <div>
            <div>
              <div>
                <h2>결과안내</h2>
                <p>{userData.userName}님의 이산화탄소(CO₂) 발생량 통계입니다.</p>
              </div>
              <p>
                {userData.userName} 가정은 이산화탄소 배출량은 총 {resultData.total}kg 이며, 비슷한 다른 가정 평균{" "}
                {averageData.total}kg 보다 약 {((resultData.total / averageData.total) * 100 - 100).toFixed(1)}% 더 많이
                배출하고 있습니다. 아래의 그래프를 보고 어느 부분에서 이산화탄소를 많이 발생하고 있는지 비교해 보세요.
              </p>
              {!hasResultData && (
                <>
                  <button onClick={onClickCarbonFootprint}>탄소계산기 다시하기</button>
                  <button onClick={onSaveClick}>저장</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="barChart-container">
        {barChatData.map((data, index) => (
          <div key={index} className="barChart">
            <BarChart barChatData={[data]} /> {/* 이 부분을 수정했습니다. */}
          </div>
        ))}
      </div>

      <div>
        <div>
          <p>실천 목표</p>
        </div>
        <div style={{ width: "100%" }}>
          <h2>우리집 실천목표! 생활 속에서 실천가능한 목표를 선택해주세요.</h2>
        </div>
        <ul>
          {Object.keys(labels).map((key) => (
            <li key={key}>{labels[key]}
            <div>1</div></li>
            
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Result;

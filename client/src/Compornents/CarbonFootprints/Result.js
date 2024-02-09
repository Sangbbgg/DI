import React from "react";
import ChartForm from "./Result/chartData";
import { useNavigate } from "react-router-dom";

function Result({ resultData }) {
  const navigate = useNavigate();
  // 개발 데이터---------------------------------------------------------------------
  // 사용자 ID 및 기타 데이터 준비
  // const userId = sessionStorage.getItem('userId'); // 예를 들어 세션에서 사용자 ID를 가져옵니다.
  const userId = 100001; // 예를 들어 세션에서 사용자 ID를 가져옵니다.

  const moclData1 = {
    // 평균 데이터
    electricity: 32.5,
    gas: 38.9,
    water: 1.6,
    transportation: 270.8,
    waste: 0.6,
    total: 344.4,
  };
  // console.log(calculationAdviceData);

  // const moclData2 = {
  //   electricity: {
  //     "하루 1시간은 에어컨 대신 선풍기로!": 3.2,
  //     "세탁은 모아서 해도 잘 된답니다.": 0.6,
  //     "전기밥솥 보온기능은 전기먹는 하마": 5.9,
  //     "냉장실은 60% 채우면 효율이 최고": 1,
  //     "컴퓨터 절전프로그램사용": 1.6,
  //     "TV 시청 줄이고 가족과 대화 늘리고!": 1.8,
  //   },
  //   gas: {
  //     "겨울철 난방온도는 20˚C가 적당해요": 14.6,
  //     "보일러 사용시간 1시간만 줄여요": 28.3,
  //   },
  //   water: {
  //     "절수기로 물낭비를 쉽게 막아요.": 3.9,
  //     "물을 받아서 사용해요.(설거지, 양치할때)": 0.4,
  //     "짧게 샤워하는 그대가 진정한 멋쟁이!": 0.6,
  //   },
  //   transportation: {
  //     "도보와 자전거로 건강도 UP!": 2.1,
  //     "1주일에 한번쯤은 대중교통 어때요?": 39.1,
  //     "경제속도는 60~80km/h, 연비 최고!": 5.5,
  //     "불필요한 짐은 트렁크에서 OUT!": 4.7,
  //     "타이어 공기압 체크, 연료비 DOWN!": 6.9,
  //     "실시간 네비게이션 더 빠른 길로 GO!": 32.6,
  //   },
  //   waste: {
  //     "재활용이 가능한 유리병, 캔 등 분리배출해요": 7.3,
  //     "먹을만큼 만들고 쓰레기를 20% 줄여봐요!": 7.3,
  //   },
  // };

  // -------------------------------------------------------------------------------
  // 객체를 배열로 변환
  function convertDataToObject(resultData) {
    // resultData가 유효하지 않은 경우, 빈 객체로 처리
    if (!resultData || typeof resultData !== 'object') {
      console.error('Invalid or undefined resultData:', resultData);
      return [];
    }
  
    const labels = {
      electricity: "전기",
      gas: "가스",
      water: "수도",
      transportation: "교통",
      waste: "폐기물",
    };
  
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
  console.log(data);

  // console.log("토탈 : ", resultData.total);
  console.log("resultData : ", resultData);
  console.log("moclData1 : ", moclData1);

  // 탄소계산기 다시하기 이벤트 핸들러
  const onClickCarbonFootprint = () => {
    // confirm 대화상자를 표시하고 사용자의 응답을 변수에 저장
    const userConfirmed = window.confirm("작성된 데이터가 초기화 됩니다. 계속하시겠습니까?");

    // 사용자가 '확인'을 클릭했을 때의 로직
    if (userConfirmed) {
      window.location.href = '/carbonfootprint';
      // 첫 페이지로 리플레시하는 로직
      navigate("/carbonfootprint");
    }
    // 사용자가 '취소'를 클릭했을 때는 아무것도 하지 않음
  };

  const onSaveClick = async () => {
    const calculationMonth = new Date().toISOString().slice(0, 10); // 현재 날짜를 'YYYY-MM-DD' 형식으로 설정
    const postData = {
      userId: userId,
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
        <div style={{ width: "100%", height: 400 }}>
          <ChartForm data={data} />
          <div>
            <div>
              <div>
                <h2>결과안내</h2>
                <p>{"user이름"}님의 이산화탄소(CO₂) 발생량 통계입니다.</p>
              </div>
              <p>
                {"user이름"} 가정은 이산화탄소 배출량은 총 {resultData.total}kg 이며, 비슷한 다른 가정 평균{" "}
                {moclData1.total}kg 보다 약 {((resultData.total / moclData1.total) * 100 - 100).toFixed(1)}% 더 많이
                배출하고 있습니다. 아래의 그래프를 보고 어느 부분에서 이산화탄소를 많이 발생하고 있는지 비교해 보세요.
              </p>
              <button onClick={onClickCarbonFootprint}>탄소계산기 다시하기</button>
              <button onClick={onSaveClick}>저장</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Result;

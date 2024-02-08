import React from "react";
import ChartForm from "./Result/chartData";

function Result({ resultData, calculationAdviceData }) {
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
    const labels = {
      // 키와 한글 이름 매핑
      electricity: "전기",
      gas: "가스",
      water: "수도",
      transportation: "교통",
      waste: "폐기물",
    };

    // 데이터 변환을 위한 배열 생성
    const result = [];

    // resultData 객체의 각 키와 값을 순회하여 변환
    for (const [key, value] of Object.entries(resultData)) {
      // 'total' 키는 변환에서 제외
      if (key !== "total" && labels[key]) {
        // labels에 정의된 키만 변환
        result.push({
          name: labels[key], // 매핑된 한글 이름 사용
          value: parseFloat(value), // 문자열 값을 숫자로 변환
        });
      }
    }

    return result;
  }
  const data = convertDataToObject(resultData);
  console.log(data);

  console.log("토탈 : ", resultData.total);
  console.log("resultData : ", resultData);
  console.log("moclData1 : ", moclData1);

  // 탄소계산기 다시하기 이벤트 핸들러
  const onClickCarbonFootprint = () => {
    // confirm 대화상자를 표시하고 사용자의 응답을 변수에 저장
    const userConfirmed = window.confirm("작성된 데이터가 초기화 됩니다. 계속하시겠습니까?");

    // 사용자가 '확인'을 클릭했을 때의 로직
    if (userConfirmed) {
      // 첫 페이지로 리플레시하는 로직
      // navigate 함수 대신 window.location을 사용하여 페이지를 리플레시
      window.location.href = "/carbonfootprint";
    }
    // 사용자가 '취소'를 클릭했을 때는 아무것도 하지 않음
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
                {"user이름"} 가정은 이산화탄소 배출량은 총 {resultData.total}kg 이며, 비슷한 다른 가정 평균 {moclData1.total}kg 보다 약 {((resultData.total / moclData1.total) * 100 - 100).toFixed(1)}%
                더 많이 배출하고 있습니다. 아래의 그래프를 보고 어느 부분에서 이산화탄소를 많이 발생하고 있는지 비교해 보세요.
              </p>
              <button onClick={onClickCarbonFootprint}>탄소계산기 다시하기</button>
              <button>저장</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Result;

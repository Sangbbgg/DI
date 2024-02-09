import React, { useState, useEffect } from "react";
// 내부 컴포넌트 분류---------------------------------------
import Consumption from "../Compornents/CarbonFootprints/Consumption";
import Result from "../Compornents/CarbonFootprints/Result";
import Practice from "../Compornents/CarbonFootprints/Practice";
// ---------------------------------------------------------

function CarbonFootprint() {
  // 사용자 ID 및 기타 데이터 준비
  // const userId = sessionStorage.getItem('userId'); // 예를 들어 세션에서 사용자 ID를 가져옵니다.
  const userId = 100001; // 예를 들어 세션에서 사용자 ID를 가져옵니다.

  const [data, setData] = useState(null); // 전체 데이터 담을 공간
  const [loading, setLoading] = useState(true); // 데이터 로딩 확인
  const [activeTab, setActiveTab] = useState("consumption"); // 탭 핸들링
  const [consumptionData, setConsumptionData] = useState({
    electricity: "",
    gas: "",
    water: "",
    transportation: "",
    radioOption: "0",
    waste: "",
    kg: "",
    l: "",
  });
  // console.log(data[0].username)
  // console.log("세션:", sessionStorage.loggedIn);
  // 계산 결과
  const [resultData, setResultData] = useState({});

  useEffect(() => {
    const checkCurrentMonthDataAndFetch = async () => {
      // 현재 날짜 'YYYY-MM-DD'
      const currentDate = new Date().toISOString().slice(0, 10);
      // 사용자 ID 가져오기 (예시로 sessionStorage에서 가져옴, 실제 사용 시 적절한 방식으로 수정 필요)
      // const userId = sessionStorage.getItem("userId");

      try {
        // 현재 달에 대한 데이터가 있는지 확인
        const checkResponse = await fetch(`http://localhost:8000/api/carbonFootprint/check/${userId}/${currentDate}`);
        if (!checkResponse.ok) {
          throw new Error("Failed to check current month data");
        }
        const checkResult = await checkResponse.json();
        console.log(checkResponse);
        if (checkResult.hasData) {
          // 이번 달 데이터가 존재하면, Result 컴포넌트로 이동 및 데이터 설정
          setData(checkResult.data);

          setLoading(false);
          setActiveTab("result");
        } else {
          // 이번 달 데이터가 없으면, 전체 데이터 로딩
          const fetchResponse = await fetch("http://localhost:8000/api/carbonFootprint");
          if (!fetchResponse.ok) {
            throw new Error("Failed to fetch data");
          }
          const fetchResult = await fetchResponse.json();
          setData(fetchResult);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error: " + error.message);
      }
    };

    checkCurrentMonthDataAndFetch();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleTabChange = (tabName) => {
    // setActiveTab(tabName);
    if ((tabName === "result" || tabName === "practice") && !resultData) {
      alert("제출하기 완료하신 후에 결과확인하실 수 있습니다.");
    } else {
      setActiveTab(tabName);
    }
  };

  const handleResultSubmit = (resultData, inputData) => {
    setResultData(resultData);
    setConsumptionData(inputData);
    setActiveTab("result");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "consumption":
        return (
          <Consumption
            data={data.carbonFootprintData}
            inputData={consumptionData}
            onResultSubmit={handleResultSubmit}
          />
        );
      case "result":
        return <Result resultData={resultData} calculationAdviceData={data.calculationAdviceData} />;
      case "practice":
        return <Practice />;
      default:
        return <Consumption data={data} inputData={consumptionData} onResultSubmit={handleResultSubmit} />;
    }
  };

  return (
    <div style={{ width: 600, margin: "0 auto" }}>
      <ul>
        <li onClick={() => handleTabChange("consumption")}>계산하기</li>
        <li onClick={() => handleTabChange("result")}>결과보기</li>
        <li onClick={() => handleTabChange("practice")}>생활속 실천방안</li>
      </ul>

      <div>{renderContent()}</div>
    </div>
  );
}

export default CarbonFootprint;

import React, { useState, useEffect } from "react";
// 내부 컴포넌트 분류---------------------------------------
import Consumption from "../Compornents/CarbonFootprints/Consumption";
import Result from "../Compornents/CarbonFootprints/Result";
import Practice from "../Compornents/CarbonFootprints/Practice";
// ---------------------------------------------------------

function CarbonFootprint() {
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
  
  // 계산 결과
  const [resultData, setResultData] = useState(null);

  useEffect(() => {
    // 서버 데이터 요청
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/carbonFootprint");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: " + error.message);
      }
    };

    fetchData();
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

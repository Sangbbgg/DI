import React, { useEffect, useState } from "react";
import { evaluate } from "mathjs";
function Consumption({ data }) {
  const [consumption, setConsumption] = useState({
    electricity: "",
    gas: "",
    water: "",
    transportation: "",
    radioOption: "0",
    waste: "",
    kg: "",
    l: "",
  });

  // 개발용 data
  const mockData = {
    electricity: 7,
    gas: 7,
    water: 7,
    transportation: 7,
    radioOption: "2", //0~3사이 4가지
    waste: 7, //kg, l 값중 어디에라도 입력된 값이 여기에 같이 입력된다.
    kg: "",
    l: 7,
  };

  const [co2Emission, setCo2Emission] = useState({
    electricity: 0,
    gas: 0,
    water: 0,
    transportation: 0,
    waste: 0,
  });

  // 데이터 가공
  const transformCostFormula = (data, parentCategoryName) => {
    let result = {};
    // 부모 카테고리의 ID 찾기
    const parentCategory = data.find(
      (item) => item.category_name === parentCategoryName
    );

    if (parentCategory) {
      // 해당 부모 카테고리 ID를 parent_category_id로 가지는 자식들 찾기
      const childCategories = data.filter(
        (item) => item.parent_category_id === parentCategory.id
      );

      if (childCategories.length > 0) {
        // 자식 데이터가 있는 경우, 각 자식 데이터의 category_name과 cost_formula 처리
        childCategories.forEach((child) => {
          // 문자열 형태의 수식을 그대로 유지
          result[
            child.category_name ? child.category_name : child.category_name
          ] = child.cost_formula;
        });
      } else {
        // 자식 데이터가 없는 경우, 부모 카테고리 정보만 포함
        result[parentCategoryName] = parentCategory.cost_formula;
      }
    }

    return result;
  };

  useEffect(() => {
    const electricityCost = transformCostFormula(data, "electricity");
    const gasCost = transformCostFormula(data, "gas");
    const waterCost = transformCostFormula(data, "water");
    const transportationCost = transformCostFormula(data, "transportation");
    const wasteCost = transformCostFormula(data, "waste");

    let transportationValue = 0;
    let wasteValue = 0;

    // Transportation 계산
    if (mockData.radioOption !== "3") {
      const [val1, val2] = Object.values(transportationCost)
        [mockData.radioOption].split(" * ")
        .map(Number);
      transportationValue = (mockData.transportation / val1) * val2;
    } else transportationValue = 0;

    // Waste 계산
    if (mockData.kg !== "") {
      wasteValue = mockData.kg * wasteCost["kg"];
    } else if (mockData.l !== "") {
      wasteValue = mockData.l * parseFloat(wasteCost["l"]);
    }

    setCo2Emission({
      electricity: parseFloat(
        mockData.electricity * electricityCost.electricity
      ).toFixed(1),
      gas: parseFloat(mockData.gas * gasCost.gas).toFixed(1),
      water: parseFloat(mockData.water * waterCost.water).toFixed(1),
      transportation: transportationValue.toFixed(1),
      waste: wasteValue,
    });
  }, []);
  console.log("결과값", co2Emission);
  console.log(
    "electricity:3.3 gas:15.2 water:1.7 transportation:1.2 waste:0.7  "
  );
  console.log("넘겨 받은 data", data);

  return <div></div>;
}

export default Consumption;

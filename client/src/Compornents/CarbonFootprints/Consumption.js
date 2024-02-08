import React, { useEffect, useState } from "react";

function Consumption({ data, inputData, onResultSubmit }) {
  const [consumption, setConsumption] = useState(inputData);
  // --------------------------------------------------------------------------------------
  // 개발용 data
  const mockData = {
    electricity: 10,
    gas: 11,
    water: 111,
    transportation: 111,
    radioOption: 2, //0~3사이 4가지
    waste: 111, //kg, l 값중 어디에라도 입력된 값이 여기에 같이 입력된다.
    kg: "",
    l: 111,
  };

  useEffect(() => {
    const log = () => {
      // console.log("입력 데이터 : ", consumption); //입력데이터 확인
      console.log("계산결과 데이터 : ", co2Emission); //결과 저장 확인
      console.log("계산결과 데이터 : ", Object.values(co2Emission)); //결과 저장 확인
    };
    log();
  }, [consumption]);
  // --------------------------------------------------------------------------------------

  // 계산 결과
  const [co2Emission, setCo2Emission] = useState({
    electricity: 0,
    gas: 0,
    water: 0,
    transportation: 0,
    waste: 0,
    total: 0,
  });

  // 데이터 가공
  const transformCostFormula = (data, parentCategoryName) => {
    let result = {};
    // 부모 카테고리의 ID 찾기
    const parentCategory = data.find((item) => item.category_name === parentCategoryName);

    if (parentCategory) {
      // 해당 부모 카테고리 ID를 parent_category_id로 가지는 자식들 찾기
      const childCategories = data.filter((item) => item.parent_category_id === parentCategory.id);

      if (childCategories.length > 0) {
        // 자식 데이터가 있는 경우, 각 자식 데이터의 category_name과 cost_formula 처리
        childCategories.forEach((child) => {
          // 문자열 형태의 수식을 그대로 유지
          result[child.category_name ? child.category_name : child.category_name] = child.cost_formula;
        });
      } else {
        // 자식 데이터가 없는 경우, 부모 카테고리 정보만 포함
        result[parentCategoryName] = parentCategory.cost_formula;
      }
    }

    return result;
  };

  // 입력값 계산 로직
  useEffect(() => {
    // 개발용
    // const handleData = mockData;
    // 실제 데이터
    const handleData = consumption;
    
    const getCostFormula = (costObj, key) => Object.values(costObj)[key] ?? "0";

    const electricityCost = transformCostFormula(data, "electricity");
    const gasCost = transformCostFormula(data, "gas");
    const waterCost = transformCostFormula(data, "water");
    const transportationCost = transformCostFormula(data, "transportation");
    const wasteCost = transformCostFormula(data, "waste");
    let transportationEmission = 0;
    let wasteEmission = 0;

    // Transportation 계산
    if (handleData.radioOption !== "3") {
      const formula = getCostFormula(transportationCost, handleData.radioOption);
      const [val1, val2] = formula.split(" * ").map(Number);
      transportationEmission = (handleData.transportation / val1) * val2;
    } else transportationEmission = 0;

    // Waste 계산
    if (handleData.kg !== "") {
      wasteEmission = handleData.kg * parseFloat(wasteCost["kg"]);
    } else if (handleData.l !== "") {
      const [val1, val2] = Object.values(wasteCost["l"].split(" * ").map(Number));
      wasteEmission = handleData.l * val1 * val2;
    }

    // 각 카테고리별 CO2 배출량 계산 함수
    const calculateEmission = (quantity, cost) => parseFloat(quantity * cost);
    // 개별 값 계산
    const electricityEmission = calculateEmission(handleData.electricity, electricityCost["electricity"]);
    const gasEmission = calculateEmission(handleData.gas, gasCost["gas"]);
    const waterEmission = calculateEmission(handleData.water, waterCost["water"]);
    // Total 계산
    const totalEmission = electricityEmission + gasEmission + waterEmission + transportationEmission + wasteEmission;

    setCo2Emission({
      electricity: electricityEmission.toFixed(1),
      gas: gasEmission.toFixed(1),
      water: waterEmission.toFixed(1),
      transportation: transportationEmission.toFixed(1),
      waste: wasteEmission.toFixed(1),
      total: totalEmission.toFixed(1),
    });
  }, [consumption]);

  // Result Data전달
  const handleSubmit = () => {
    // CO2 배출량 계산 로직
    const hasValidEmission = Object.values(co2Emission).some((value) => value !== "0.0");

    if (!hasValidEmission) {
      // 모든 값이 0이거나 co2Emission 값이 없는 경우
      alert("모든 사용량을 입력해 주세요");
      return; // 함수 실행을 여기서 중단
    }

    const resultData = co2Emission; // 계산된 결과 데이터
    onResultSubmit(resultData, consumption);
  };

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setConsumption({ ...consumption, [name]: value });
  };

  // 교통 부분의 라디오 버튼 변경 핸들러
  const handleTransportChange = (e) => {
    const { value } = e.target;
    if (value === transportationOptions.length.toString()) {
      // 추가 옵션 선택 시
      // 기본값 설정 또는 특별한 처리
      setConsumption({
        ...consumption,
        radioOption: value,
        transportation: "0",
      }); // 예시: "0"으로 설정
    } else {
      setConsumption({
        ...consumption,
        radioOption: value,
        transportation: "",
      }); // 라디오 버튼 선택 시 입력 필드 초기화
    }
  };

  // parent_category_id가 4인 데이터 필터링 및 정렬
  const transportationOptions = data.filter((item) => item.parent_category_id === 4).sort((a, b) => a.id - b.id);

  return (
    <div>
      {/* parent_category_id가 null인 항목 렌더링 */}
      {data
        .filter((item) => item.parent_category_id === null)
        .map((item) => (
          <div key={item.id}>
            <div>{item.label}</div>

            {/* 교통 부분 라디오 버튼 구현 */}
            {item.category_name === "transportation" &&
              transportationOptions.map((option, idx) => (
                <div key={option.id}>
                  <input
                    type="radio"
                    name="radioOption"
                    value={idx} // ID를 0부터 시작하는 값으로 설정
                    checked={consumption.radioOption === `${idx}`}
                    onChange={handleTransportChange}
                  />
                  {option.sublabel}
                </div>
              ))}

            {/* 교통 부분 추가 라디오 버튼 */}
            {item.category_name === "transportation" && (
              <div>
                <input
                  type="radio"
                  name="radioOption"
                  value={transportationOptions.length.toString()} // 별도의 라디오 버튼 값
                  checked={consumption.radioOption === transportationOptions.length.toString()}
                  onChange={handleTransportChange}
                />
                추가 옵션
              </div>
            )}

            {/* unit이 있고 category_name이 "waste"가 아닌 경우에만 입력 필드 생성 */}
            {item.unit && item.category_name !== "waste" && (
              <input
                type="number"
                name={item.category_name}
                placeholder="숫자 입력..."
                value={consumption[item.category_name]}
                onChange={handleChange}
                disabled={item.category_name === "transportation" && consumption.radioOption === "3"} // 네 번째 라디오 버튼 선택 시 비활성화
              />
            )}

            {/* 폐기물 관련 입력 필드 구현 */}
            {item.category_name === "waste" &&
              data
                .filter((subItem) => subItem.parent_category_id === item.id)
                .map((subItem) => (
                  <div key={subItem.id}>
                    <input
                      type="number"
                      name={subItem.category_name}
                      placeholder={"숫자 입력..."}
                      value={consumption[subItem.category_name]}
                      onChange={(e) => {
                        // 선택된 폐기물 입력값 설정 및 다른 필드 초기화
                        const newConsumption = {
                          ...consumption,
                          kg: subItem.category_name === "kg" ? e.target.value : "",
                          l: subItem.category_name === "l" ? e.target.value : "",
                          [subItem.category_name]: e.target.value,
                        };
                        setConsumption(newConsumption);
                      }}
                    />
                    {subItem.unit}
                  </div>
                ))}

            {/* 각 구역 마지막 부분에 출력값 입력 필드 추가 */}
            <input
              type="text"
              placeholder="출력값"
              value={co2Emission[item.category_name]} // 예시로 입력값을 그대로 출력; 실제 로직에 따라 변경 필요
              readOnly
            />
          </div>
        ))}

      <div>
        <button onClick={handleSubmit}>제출하기</button>
      </div>
    </div>
  );
}

export default Consumption;

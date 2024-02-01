import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import LocalCartList from "./LocalCartList";

// import "./Cart.css";

// 아래는 취합하는 과정에서 필요할지도 모를 코드를 주석처리 한 것입니다.

// const ProductDetail = () => {
//   const [productData, setProductData] = useState([]); // 불러온 상품 데이터를 상태 저장
//   const [countValue, setCountValue] = useState(1); // 구매 수량 상태 저장

//   const params = useParams(); //url 파라미터값 가져오기

//   const { id } = params; // 경로 파라미터 값에서 id 값만을 분해 구조 할당

//   const orderType = "single_order"; // 결제하기를 선택할 경우, 개별 결제로 인식하게끔 선언

//   // 서버에 상품 정보 요청
//   useEffect(() => {
//     // 파라미터를 담은 경로로 서버에 상품 데이터 요청
//     axios.get(`/${id}`).then((data) => {
//       setProductData(data.data[0]); // productData 저장값 갱신
//     });
//   }, []);

//   // 로컬 스토리지 장바구니 담는 과정
//   const onClickInputCart = (e) => {
//     // (...)

//     // cart 배열에 넣되, 수량(count)과 상품 선택 여부 옵션(isCheck)까지 추가한다.
//     cart.push({ ...productData, count: countValue, isCheck: false });
//   };

//   return (
//     <div>
//       <button>장바구니</button>
//       <hr></hr>
//       <img src={productData.imageURL} />
//       <hr></hr>
//       <p>
//         브랜드 : <b>{productData.brand}</b>
//       </p>
//       <p>상품명 : {productData.productName}</p>
//       <p>
//         구매 수량: <input type="number" value={countValue} />
//       </p>
//       <p>판매가 : {productData.price}원</p>
//       <p>총 상품 금액 : {productData.price * countValue}원</p>
//       <p>
//         <button
//           className="btnInputCart"
//           value={productData.productCode}
//           onClick={onClickInputCart}
//         >
//           로컬스토리지용 장바구니
//         </button>
//         <Link
//           to="/ordersheet"
//           state={{ ...productData, count: countValue, orderType: orderType }}
//         >
//           <button className="btnOrder">주문/결제하기</button>
//         </Link>
//       </p>
//       <hr></hr>
//       <img src={productData.detailImg} />
//       <hr></hr>
//     </div>
//   );
// };

const Cart = () => {
  const [cartList, setCartList] = useState([]); // 유저의 장바구니 데이터 상태
  const [cartReset, setCartReset] = useState(0); // 장바구니 상태 갱신 핸들러
  const navigate = useNavigate();

  // 모든 상품 또는 선택한 상품들에 대한 결제하기 버튼을 누를 시,
  // "/orderSheet" 경로로 전달할 데이터를 규정
  const orderType = {
    allOrder: "all_order",
    selectOrder: "select_order",
  };

  //체크박스 false 상태로 초기화
  function resetAllCheckboxes() {
    // checkboxes 변수에 클래스 네임이 ".item_checkbox "로 지정된 모든 태그를 담는다.
    // 간략히 말하면, 체크박스 태그들을 넣음.
    const checkboxes = document.querySelectorAll(".item_checkbox");

    // checkboxes에 저장된 체크박스 태그 요소들을 forEach()를 통해 하나씩 순회하면서, 체크 상태를 false로 전환
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
  }

  // 마운트 과정에서 장바구니 데이터를 가져오는 메소드
  useEffect(() => {
    setCartReset(0);
    resetAllCheckboxes();
    // 로컬 스토리지의 데이터를 json 파일로 가져온다
    const carts = JSON.parse(localStorage.getItem("cart"));
    setCartList(carts);
  }, [cartReset]);

  // 상품 페이지 이동 핸들러
  const onClickGoShop = () => {
    navigate("/shop");
  };

  // 장바구니 아이템 상품 체크상태 업데이트
  const cartListUpdate = (id) => {
    // isCheckItems 변수에 cartList 배열 요소를 하나씩 담되,
    // 체크박스에 체크된 요소만은 isCheck 값을 전환하여 반환한다.
    const isCheckItems = cartList.map((item) => {
      if (item.id == id) item.isCheck = !item.isCheck;
      return item;
    });

    setCartList(isCheckItems);
  };

  //  체크박스 선택한 상품 삭제
  const cartSelectDelete = () => {
    // cartList 배열을 한 요소씩 순회하면서 item.isCheck == true,
    // 즉 체크박스에 체크된 요소가 하나라도 있는지 확인한다.
    // 없다면 undefined으로 값을 반환된다.
    const checkItem = cartList.find((item) => item.isCheck == true);

    if (checkItem === undefined) alert("선택한 항목이 없습니다.");
    else if (window.confirm("선택한 상품들을 장바구니에서 삭제하시겠습니까?")) {
      // filter()를 사용하여, 체크된 상품을 제외한 요소만들 filterItem 변수에 담는다.
      const filterItem = cartList.filter((item) => item.isCheck == false);

      // 로컬 스토리지 갱신
      localStorage.setItem("cart", JSON.stringify(filterItem));
      setCartReset(1); // 페이지 리렌더링 유도(useEffect 재가동)
    }
  };

  // 전체 상품 선택 (체크박스 전부 TRUE 전환)
  const allCheckedTrueItem = () => {
    // checkboxes 변수에 클래스 네임이 ".item_checkbox "로 지정된 모든 태그를 담는다.
    // 간략히 말하면, 체크박스 태그들을 넣음.
    const checkboxes = document.querySelectorAll(".item_checkbox");

    // checkboxes에 저장된 체크박스 태그 요소들을 forEach()를 통해 하나씩 순회하면서, 체크 상태를 true로 전환.
    checkboxes.forEach((checkbox) => {
      checkbox.checked = true; // 또는 false
    });

    // 이어서 cartList 배열 요소를 모두 순회하며 체크 속성(isCheck)값을 true로 바꿔준다.
    const isCheckItems = cartList.map((item) => {
      item.isCheck = true;
      return item;
    });
    setCartList(isCheckItems); // 바뀐 배열을 setCartList 상태로 저장 및 리렌더링
  };

  // 전체 상품 선택 해제 (체크박스 전부 FALSE 전환)
  const allCheckedFalseItem = () => {
    // checkboxes 변수에 클래스 네임이 ".item_checkbox "로 지정된 모든 태그를 담는다.
    // 간략히 말하면, 체크박스 태그들을 넣음.
    const checkboxes = document.querySelectorAll(".item_checkbox");

    // checkboxes에 저장된 체크박스 태그 요소들을 forEach()를 통해 하나씩 순회하면서, 체크 상태를 해제한다.
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });

    // 이어서 cartList 배열 요소를 모두 순회하며 체크 속성(isCheck)값을 false로 바꿔준다.
    const isCheckItems = cartList.map((item) => {
      item.isCheck = false;
      return item;
    });
    setCartList(isCheckItems); // 바뀐 배열을 setCartList 상태로 저장 및 리렌더링
  };

  //  선택한 상품만 주문하기 버튼
  const onClcikSelectOrder = () => {
    // cartList 배열을 한 요소씩 순회하면서 item.isCheck == true,
    // 즉 체크박스에 체크된 요소가 하나라도 있는지 확인한다.
    // 없다면 undefined으로 값을 반환된다.
    const checkItem = cartList.find((item) => item.isCheck == true);

    if (checkItem === undefined) alert("선택한 항목이 없습니다.");
    else {
      // cartList 배열의 요소 하나씩 순회하면서 item.isCheck == true,
      // 즉 체크된 요소만을  filterItem에 반환한다(담는다).
      const filterItem = cartList.filter((item) => item.isCheck == true);
      // "selectCart" 라는 별개의 로컬 스토리지 생성한 후 담는다.
      localStorage.setItem("selectCart", JSON.stringify(filterItem));
    }
  };

  return (
    <div>
      <button>◁ 샵으로 돌아가기</button>
      <hr></hr>
      <h1>장바구니</h1>
      <hr></hr>
      <button onClick={allCheckedTrueItem}>전체 선택</button>
      <button onClick={allCheckedFalseItem}>전체 선택 해제</button>
      <button onClick={cartSelectDelete}>선택한 상품 삭제</button>
      <hr></hr>
      <LocalCartList
        cartList={cartList}
        setCartReset={setCartReset}
        cartListUpdate={cartListUpdate}
      />
      <hr></hr>
      {/* Link를 클릭 시, 전달할 prop 데이터로 state 값을 넘겨주게끔 함 */}
      <Link to="/ordersheet" state={{ orderType: orderType.allOrder }}>
        <button className="btnOrder">모든 상품 주문하기</button>
      </Link>
      <Link to="/ordersheet" state={{ orderType: orderType.selectOrder }}>
        <button className="btnOrder" onClick={onClcikSelectOrder}>
          선택한 상품만 주문하기
        </button>
      </Link>
    </div>
  );
};

export default Cart;

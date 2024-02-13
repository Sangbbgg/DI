import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react"; //useNavigate 추가

import Modal from "react-modal"; // 팝업 라이브러리

import axios from "axios";

import "../Styles/Ordersheet.css";
import PopupPaypalContent from "../Compornents/Shop/PopupPaypalContent";

const Ordersheet = () => {
  const [userInfo, setUserInfo] = useState([]); // 로그인된 사용자 상세 정보를 저장하기 위한 상태값
  const [nameInfo, setNameInfo] = useState(""); // input 태그의 이름 정보 상태 저장
  const [phoneNumberInfo, setPhoneNumberInfo] = useState(""); // input 태그의 연락처 정보 상태 저장
  const [addressInfo, setAddressInfo] = useState(""); // input 태그의 주소 정보 상태 저장
  const [messageInfo, setMessageInfo] = useState(""); // input 태그의 배송요청사항 정보 상태 저장
  const [paymentType, setPaymentType] = useState(""); // input 태그의 결제수단 정보 상태 저장
  const [usePoint, setUsePoint] = useState(0); // input 태그의 포인트 사용량 정보 상태 저장, 초기값 0
  const [userCart, setUserCart] = useState([]); // 주문할 상품들에 대한 데이터 저장소
  const [isModalOpen, setModalOpen] = useState(false); // paypal 결제 팝업창 표시 여부

  const navigate = useNavigate();

  const location = useLocation(); // <Link> prop으로 전달 받은 데이터를 사용하기 위한 훅스

  // <Link> prop으로 전달 받은 데이터를 사용하기 위해 변수에 저장
  // orderTypeData은 개별 구매, 선택 상품 구매, 모든 상품 구매 중 하나의 주문형식 값을 가져오는 데 사용

  const deliveryFeeFreeAmount = 2000000; // 주문금액에 따른 배송비 포함여부 한계선

  // useEffect() 페이지의 마운트 과정에서 실행된다.
  // 1. orderType 에 주문형식을 가져오고, id 에 사용자의 고유 id 값을 가져온다.
  // 2. axios => 사용자의 id 를 토대로 서버 DB에 사용자 정보를 요청하여
  //    응답받은 데이터를  setUserInfo() 릍 통해 저장한다.
  //    주문자 배송지 정보, 포인트 보유량 등에 활용하기 위해 요청함.
  // 3. switch => orderType, 즉 주문 형식에 따라 사용자에게 보여줄 상품들의 리스트를 설정한다.
  useEffect(() => {
    if (!location.state) {
      alert("잘못된 접근입니다!");
      return navigate("/shop");
    } else {
      const orderTypeData = location.state;
      const { orderType } = orderTypeData;

      // 브라우저 스토리지에서 사용자 정보를 가져옴.
      // 로그인 구현 여부에 따라 추후 수정 필요
      const getUserData = JSON.parse(sessionStorage.getItem("userData"));
      const { userNumber } = { ...getUserData };
      console.log(userNumber);

      // 사용자의 기본 정보를 불러오는 부분, 로그인 구현 후 추후 검토 필요
      axios
        .get("http://localhost:8000/ordersheet", {
          params: { userId: userNumber },
        })
        .then((data) => setUserInfo(data.data[0]));

      switch (orderType) {
        case "single_order":
          return setUserCart([orderTypeData]);
        case "select_order": {
          const cartProducts = JSON.parse(sessionStorage.getItem("selectCart"));
          return setUserCart(cartProducts);
        }
        case "all_order": {
          const cartProducts = JSON.parse(localStorage.getItem("baskets"));
          return setUserCart(cartProducts);
        }
        default: {
          const cartProducts = JSON.parse(localStorage.getItem("baskets"));
          return setUserCart(cartProducts);
        }
      }
    }
  }, []);
  // [], 빈 배열을 넣음으로써 페이지 마운트 과정 중 한번만 실행되게끔 함.

  // 총 상품 금액을 구하는 메소드
  const totalProductAmount = () => {
    let sumAmount = 0;
    userCart.map((item) => (sumAmount += item.price * item.count));
    return sumAmount;
  };

  // "주문자 정보 가져오기" 버튼 핸들러, 각 상태에 사용자 정보를 저장하고 갱신함.
  const onClickLoadRecipient = () => {
    setNameInfo(userInfo.username);
    setPhoneNumberInfo(userInfo.phoneNumber);
    setAddressInfo(userInfo.address);
  };

  // 포인트 사용량 핸들러
  // const onChangeUsePoint = (e) => {
  //   // 입력된 값이 보유한 포인트에 비해 많을 경우 경고창을 호출하며, 0으로 초기화한다.
  //   if (e.target.value > userInfo.point) {
  //     alert("보유 금액 이상 사용은 불가능 합니다.");
  //     setUsePoint(0);
  //   } else setUsePoint(e.target.value);
  // };

  // "전액 사용" 버튼 핸들러
  // const onClcikAllUsePoint = () => {
  //   setUsePoint(userInfo.point);
  // };

  // 배송비 산출 메소드
  const deliveryFee = () => {
    const totalAmount = totalProductAmount();
    if (totalAmount > deliveryFeeFreeAmount) return 0;
    else return 3000;
  };

  // 결제수단 paypal 버튼을 클릭하면 팝업창 발생
  // 입력 필수 사항인 배송지 정보가 누락되면 return 한다.
  const openPaypalModal = () => {
    if (!nameInfo || !phoneNumberInfo || !addressInfo) {
      alert("배송지 입력은 필수 사항입니다.");
      return;
    }
    setPaymentType("페이팔 결제");
    setModalOpen(true);
  };

  // 팝업창 닫기 핸들러
  const closeModal = () => {
    setModalOpen(false);
  };

  // 서버측에 주문서를 DB에 등록하는 메소드
  const submitOrdersheet = () => {
    // 현재 시간과 날짜를 구하는 내장 객체
    const date = new Date();

    // createOrderNumber에는 주문번호를 생성한다.
    const createOrderNumber =
      String(userInfo.userNumber) + // 로그인 정보 필요
      String(date.getFullYear()) +
      String(date.getMonth() + 1) +
      String(date.getDate()) +
      String(date.getHours()) +
      String(date.getMinutes()) +
      String(date.getSeconds()) +
      "-" +
      String(userCart[0].id);

    // 서버에 전달할 데이터를 담을 변수 배열 설정
    const reqOrderSheet = [];

    // userCart(주문 상품들의 정보가 들어있는 배열)
    // forEach()를 통해 요소(상품) 마다 name, addr 등의 키:값을 추가한 후,
    // 그 요소를 reqOrderSheet 배열에 저장한다.
    userCart.forEach((data) => {
      reqOrderSheet.push({
        ...data,
        orderNumber: createOrderNumber,
        userId: userInfo.userNumber, //로그인 정보 필요
        productCode: data.id,
        name: nameInfo,
        addr: addressInfo,
        phoneNumber: phoneNumberInfo,
        reqMessage: messageInfo,
        totalCount: userCart.length,
        totalAmount: totalProductAmount() - deliveryFee() - usePoint,
        payment: paymentType,
        usePoint: usePoint,
        // imageURL,
      });
    });

    // 서버에 엔드포인트 "/reqOrder" 로 POST 요청,
    // 전달할 데이터는 orderSheet 이름의 reqOrderSheet 객체 변수
    axios
      .post("http://localhost:8000/reqOrder", { orderSheet: reqOrderSheet })
      // 서버에서 성공적으로 실행되었다면, 다음 then() 코드가 실행된다.
      .then(() => {
        // 브라우저 스토리지에 저장된 장바구니 데이터에서 주문한 상품을 제외하는 과정

        // 로컬 스토리지에 "baskets" 데이터를 로드하여, getCartList 변수에 저장함.
        const getCartList = JSON.parse(localStorage.getItem("baskets"));
        const orderProductCode = [];

        // orderProductCode 배열 변수에, 주문한 상품에 대한 id만을 담는다.
        userCart.forEach((product) => orderProductCode.push(product.id));

        // getCartList 배열에 상품 요소들을 순회하며,
        // 그 상품 요소들의 id가 orderProductCode 내에 해당 id 값이 존재한다면,
        // 그 상품 요소만을 제외하고, 배열을 재구성하여 반환한다.
        const updateCartList = getCartList.filter((product) => {
          if (orderProductCode.indexOf(product.id) < 0) return product;
        });

        // 필터링된 요소들을 다시 "baskets" 로컬 스토리지에 재저장한다.
        localStorage.setItem("baskets", JSON.stringify(updateCartList));
        alert("주문이 완료되었습니다.");
        sessionStorage.removeItem("selectCart");
        navigate("/shop");
      });
  };

  return (
    <div>
      <h1>주문/결제 페이지</h1>
      <hr></hr>
      <div className="ordersheet_contanier">
        <div className="order_detail_box">
          <form>
            <h2>배송지</h2>
            <hr></hr>
            <div>
              <input
                type="button"
                value={"주문자 정보 가져오기"}
                onClick={onClickLoadRecipient}
              />
              <p></p>
              <label for="full_name">수령인 이름: </label>
              <input
                className="inputArea txtbox"
                type="text"
                id="full_name"
                name="full_name"
                value={nameInfo}
                onChange={(e) => setNameInfo(e.target.value)}
                required
              ></input>
              <p></p>
              <label for="full_name">수령인 연락처: </label>
              <input
                className="inputArea txtbox"
                type="tel"
                id="tel"
                name="tel"
                value={phoneNumberInfo}
                placeholder="000-0000-0000"
                onChange={(e) => setPhoneNumberInfo(e.target.value)}
                required
              ></input>
              <p></p>
              <label for="address">배송 주소: </label>
              <textarea
                className="inputArea txtbox"
                id="address"
                name="address"
                value={addressInfo}
                onChange={(e) => setAddressInfo(e.target.value)}
                required
              ></textarea>
              <p></p>* 주소지 확인 : {addressInfo}
              <p></p>
              <label for="req">배송 요청 사항: </label>
              <textarea
                className="inputArea"
                id="req"
                value={messageInfo}
                name="req"
                onChange={(e) => setMessageInfo(e.target.value)}
              ></textarea>
            </div>
            <hr></hr>
            <h2>주문 상품</h2>
            <hr></hr>
            <div className="order_product_box">
              {userCart.map((product) => (
                <div key={product.id}>
                  {/* 주문 예정인 상품을 클릭할 경우, 해당 상품의 상세 페이지를 새창으로 출력한다. */}
                  <Link to={`/product/${product.id}`} target="_blank">
                    <div className="order_itemBox">
                      <div className="order_item">
                        <img
                          src={
                            "https://onlyeco.co.kr/web/product/big/202011/5024dcdeb85c03cfa7467e0897d9781d.jpg"
                          }
                          width={150}
                          height={150}
                        />
                      </div>
                      <div className="order_item">
                        <p>{product.name}</p>
                        <p>주문 수량 : {product.count} 개</p>
                        <p>
                          {(product.price * product.count).toLocaleString()} 원
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
              <hr></hr>총 주문 상품 금액 :{" "}
              {totalProductAmount().toLocaleString()} 원<hr></hr>
              <h2>
                <b>빵끗 포인트</b> 보유 :{" "}
                <b>
                  {userInfo && userInfo.point
                    ? userInfo.point.toLocaleString()
                    : 0}
                </b>{" "}
                원
              </h2>
              <hr></hr>
              사용 :{" "}
              <input
                type="number"
                value={usePoint}
                // onChange={onChangeUsePoint}
              />{" "}
              원{"  "}
              <input
                type="button"
                // onClick={onClcikAllUsePoint}
                value={"전액 사용"}
              />
              <hr></hr>
              <h2>주문 내용을 확인하였으며, 정보 제공 등에 동의합니다.</h2>
              <hr></hr>
              <h2>결제 수단 선택</h2>
              <hr></hr>
              <input type="button" onClick={openPaypalModal} value={"Paypal"} />
            </div>
          </form>
          <hr></hr>
        </div>
        <div className="payment_detail_box">
          <h2>결제 상세</h2>
          <hr></hr>
          <h2>
            주문 금액 :{" "}
            {(totalProductAmount() - deliveryFee() - usePoint).toLocaleString()}{" "}
            원
          </h2>
          + 상품 금액: {totalProductAmount().toLocaleString()} 원<p></p>+ 배송비
          : {deliveryFee().toLocaleString()} 원<p></p>+ 포인트 :{" "}
          {usePoint.toLocaleString()}원<p></p>(*) 총 주문 상품 금액이 2백만원
          이상일 경우, 배송비는 무료입니다.
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="팝업창"
      >
        <PopupPaypalContent
          onClose={closeModal}
          submitOrdersheet={submitOrdersheet}
          userCart={userCart}
        />
      </Modal>
    </div>
  );
};

export default Ordersheet;

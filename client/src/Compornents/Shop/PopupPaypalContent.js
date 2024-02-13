import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";

// * 페이팔 가상 결제 정보
// Generic Name
// 4005519200000004
// 09/2025
// 567

// sb-43xagx29080090@personal.example.com
// l,28@SXn

const MY_PAYPAL_KEY = "페이팔 client-id";

function Message({ content }) {
  return <p>{content}</p>;
}

// 팝업으로 띄울 컴포넌트
const PopupPaypalContent = ({ onClose, submitOrdersheet, userCart }) => {
  // 페이팔 유효성 체크 및 속성 설정
  const initialOptions = {
    "client-id": MY_PAYPAL_KEY,
    "enable-funding": "card", // 카드 결제 옵션만 가져오기
    "disable-funding": "paylater,venmo", // 정기 구독 결제 비활성화
    "data-sdk-integration-source": "integrationbuilder_sc",
  };

  const [message, setMessage] = useState("");

  // 페이팔 주문생성 createOrder 이벤트 핸들러, 버튼 클릭시 작동
  const createOrder = async () => {
    try {
      const response = await fetch("http://localhost:8000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // use the "body" param to optionally pass additional order information
        // like product ids and quantities
        body: JSON.stringify({
          cart: userCart, // 주문 상품 데이터 전달
        }),
      });

      const orderData = await response.json();

      if (orderData.id) {
        return orderData.id;
      } else {
        const errorDetail = orderData?.details?.[0];
        const errorMessage = errorDetail
          ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
          : JSON.stringify(orderData);

        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error(error);
      setMessage(`Could not initiate PayPal Checkout...${error}`);
    }
  };

  // 결제 요청 및 확정시 작동
  const onApprove = async (data, actions) => {
    try {
      const response = await fetch(
        `http://localhost:8000/orders/${data.orderID}/capture`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const orderData = await response.json();
      // Three cases to handle:
      //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
      //   (2) Other non-recoverable errors -> Show a failure message
      //   (3) Successful transaction -> Show confirmation or thank you message

      const errorDetail = orderData?.details?.[0];

      if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
        // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
        // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
        return actions.restart();
      } else if (errorDetail) {
        // (2) Other non-recoverable errors -> Show a failure message
        throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
      } else {
        // 이 부분이 결제가 성사되었을 경우 실행할 코드문
        // (3) Successful transaction -> Show confirmation or thank you message
        // Or go to another URL:  actions.redirect('thank_you.html');
        const transaction = orderData.purchase_units[0].payments.captures[0];
        setMessage(
          `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`
        );
        console.log(
          "Capture result",
          orderData,
          JSON.stringify(orderData, null, 2)
        );
        submitOrdersheet(); // DB에 주문서 등록하기
        onClose(); // 팝업창을 닫는다.
      }
    } catch (error) {
      console.error(error);
      setMessage(`Sorry, your transaction could not be processed...${error}`);
    }
  };

  return (
    <div>
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={{
            shape: "rect",
            layout: "vertical",
          }}
          // createOrder 이벤트 핸들러, 버튼 클릭시 작동
          createOrder={createOrder}
          // 결제 요청 및 확정시 작동
          onApprove={onApprove}
        />
      </PayPalScriptProvider>
      <Message content={message} />
      <button onClick={onClose}>닫기</button>
    </div>
  );
};

export default PopupPaypalContent;

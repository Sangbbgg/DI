import { useNavigate } from "react-router-dom";

const LocalCartList = ({ cartList, setCartReset, cartListUpdate }) => {
  const navigate = useNavigate();

  const deliveryFeeFreeAmount = 2000000; // 주문금액에 따른 배송비 포함여부 한계선

  // 수량 1 감소 메소드_로컬 스토리지 "baskets"와 연동
  const onClickCountDecrease = (count, id) => {
    // 더 이상 수량을 감소할 수 없을 경우 함수를 return 으로 강제 종료
    if (count == 1) {
      return;
    } else {
      const countInt = count - 1;
      // 로컬 스토리지의 데이터를 json 파일로 가져온다
      const carts = JSON.parse(localStorage.getItem("baskets"));

      // map()로 carts 배열을 순회하면서 대상 상품(요소)를 찾으면 수량을 정정함.
      carts.map((data) => {
        if (id == data.id) {
          data.count = countInt;
        }
      });
      // "baskets" 키 이름으로 로컬 스토리지 (재)설정
      localStorage.setItem("baskets", JSON.stringify(carts));
      setCartReset(1); // useEffect 유도(리렌더링)
    }
  };

  // 수량 1 증가 메소드_로컬 스토리지 "baskets"와 연동
  const onClickCountIncrease = (e) => {
    const countInt = Number(e.target.value) + 1;
    const carts = JSON.parse(localStorage.getItem("baskets"));
    carts.map((data) => {
      if (e.target.id == data.id) {
        data.count = countInt;
      }
    });
    localStorage.setItem("baskets", JSON.stringify(carts));
    setCartReset(1);
  };

  // 수량 직접 수정 메소드_로컬 스토리지 "baskets"와 연동
  const onClickDirectUpdate = (e) => {
    const countInt = Number(window.prompt("수량을 입력해주세요."));

    if (!countInt || countInt <= 0) {
      // 문자를 입력하거나 0 혹은 음수를 입력했을 경우, 강제 종료.
      return alert("올바른 값을 입력해주세요.");
    }
    const carts = JSON.parse(localStorage.getItem("baskets"));
    carts.map((data) => {
      if (e.target.id == data.id) {
        data.count = countInt;
      }
    });
    localStorage.setItem("baskets", JSON.stringify(carts));
    setCartReset(1);
  };

  // 삭제 구현 메소드
  const onClickDelete = (e) => {
    // window.confirm()으로 확인창을 호출, 확인을 선택할 경우 True, 아닐경우 false 값을 반환
    if (window.confirm("선택한 상품을 장바구니에서 삭제하시겠습니까?")) {
      const carts = JSON.parse(localStorage.getItem("baskets"));
      // filter() 함수를 사용하여 carts 요소 중 삭제할 대상 요소만을 제외하여 배열을 재구성 및 반환.
      const filterItem = carts.filter(
        (item) => Number(e.target.value) !== item.id
      );
      // "baskets" 키 이름으로 로컬 스토리지 (재)설정
      localStorage.setItem("baskets", JSON.stringify(filterItem));
      setCartReset(1);
    }
  };

  // 총 상품 금액을 구하는 메소드
  const totalAmount = () => {
    let sumAmount = 0;
    // map() 함수를 사용하여 cartList 배열 요소를 순회하며
    // 수량과 개별 가격을 곱한 값을 sumCount에 더하면서 저장
    cartList.map((item) => (sumAmount += item.price * item.count));
    return sumAmount;
  };

  // 선택 상품들의 총 금액을 구하는 메소드
  const selectTotalAmount = () => {
    let sumAmount = 0;
    cartList.map((item) => {
      if (item.isCheck == true) sumAmount += item.price * item.count;
    });
    return sumAmount;
  };

  // 모든 상품들에 대한 배송비를 구하는 메소드
  // 아래 선택한 상품에 대한 배송비를 구하는 메소드와 합칠 수 있으나 귀찮아서 skip
  const allDeliveryFee = () => {
    const totalAmount = totalAmount();
    if (totalAmount > deliveryFeeFreeAmount) return 0;
    else return 3000;
  };

  // 선택한 상품들에 대한 배송비를 구하는 메소드
  const selectDeliveryFee = () => {
    const totalAmount = selectTotalAmount();
    if (totalAmount > deliveryFeeFreeAmount) return 0;
    else return 3000;
  };

  // 상품 페이지 이동 핸들러
  const onClickGoShop = () => {
    navigate("/shop");
  };

  // 체크상태 변경에 대한 데이터 수정 핸들러, "Cart.js" 에서 처리됨.
  const onCheckItemHandler = (id) => {
    cartListUpdate(id);
  };

  return (
    <div>
      {cartList.length == 0 && (
        <div>
          <h2>장바구니에 담긴 상품이 없습니다.</h2>
          <button>쇼핑하러 가기</button>
        </div>
      )}
      {cartList &&
        cartList.map((item) => (
          <div className="cart_container">
            <div>
              {/* 체크박스 */}
              <input
                className="item_checkbox"
                onChange={() => {
                  onCheckItemHandler(item.id);
                }}
                type="checkbox"
              />
            </div>
            <div>
              <img
                src={
                  "https://onlyeco.co.kr/web/product/big/202011/5024dcdeb85c03cfa7467e0897d9781d.jpg"
                }
                width={100}
                height={100}
              />
            </div>
            <div className="item_text">
              <b>{item.name}</b>
              <p>{item.price}원</p>
            </div>
            <div>
              수량:
              <p>
                <button
                  onClick={() => onClickCountDecrease(item.count, item.id)}
                >
                  -
                </button>
                {item.count}
                <button
                  value={item.count}
                  id={item.id}
                  onClick={onClickCountIncrease}
                >
                  +
                </button>
              </p>
              <p>
                <button
                  id={item.id}
                  value={item.count}
                  onClick={onClickDirectUpdate}
                >
                  직접 수정
                </button>
              </p>
            </div>
            <div>
              상품금액
              <p>{item.price * item.count}원</p>
            </div>
            <button key={item.id} value={item.id} onClick={onClickDelete}>
              삭제
            </button>
          </div>
        ))}
      <hr></hr>
      <h1>
        총 상품 금액 : {totalAmount()} 원 + 배송비 {allDeliveryFee()}원 = 총
        주문 금액 : {totalAmount() + allDeliveryFee()} 원
      </h1>
      <h2>
        선택한 상품 금액 : {selectTotalAmount()} 원 + 배송비{" "}
        {selectDeliveryFee()}원 = 총 주문 금액 :{" "}
        {selectTotalAmount() + selectDeliveryFee()} 원
      </h2>
    </div>
  );
};

export default LocalCartList;

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./shop.module.css";
import Paging from "../components/Paging";

const Shop = () => {
  // const sessionPage = window.sessionStorage.getItem('page');
  // produts에 db 데이터 저장하기 위해 useState 사용
  // products에는 상품데이터들을 저장할 겁니다
  const [products, setProducts] = useState([
    {
      id: "",
      name: "",
      description: "",
      price: "",
    },
  ]);
  // react-js-pagination을 통한 페이지네이션 관련 변수들입니다
  // count = 상품아이템 개수입니다
  // page = 현재페이지
  // currentPosts = 현재 페이지에서 보이는 상품들
  // postPerPage = 한 페이지에 보이는 상품들 개수
  // indexOfLastPost = 한 페이지의 마지막 상품의 index
  // inodexOfFirstPost = 한 페이지의 첫번째 상품의 index
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [currentPosts, setCurrentPosts] = useState(0);
  const postPerPage = 10;
  const indexOfLastPost = page * postPerPage;
  const indexOfFirstPost = indexOfLastPost - postPerPage;
  const navigate = useNavigate();

  useEffect(() => {
    // 서버단 8000번 shop 페이지에 있는 데이터를 읽기 위해 axios 사용,
    // 비동기작업을 위해 async await
    // inputData에 우리가 필요한 데이터 id,name,description,price를 map 메서드로 뽑습니다
    // setProducts를 사용해서 products의 state를 inputData로 변경해줍니다
    // 상품리스트만을 구현한다면 이 과정 이후 return에 map 메서드로 구현하면 됩니다
    // 상품리스트 만드는 이 과정은 marvel 과제물이랑 비슷하니까 참고하십셔
    async function resData() {
      const responces = await axios.get("http://localhost:8000/shop", {});
      const inputData = await responces.data.map((responce) => ({
        id: responce.productCode,
        name: responce.productName,
        description: responce.productDescription,
        price: responce.buyPrice,
      }));
      setProducts(inputData);
      setCount(inputData.length);
    }
    resData();
  }, []);

  // 현재 페이지에서 보이는 상품들은 상품들의 데이터인 products를 그 페이지의 첫 상품의 index부터 마지막 상품의 index까지 잘라서 보여주는 겁니다 그래서 slice
  // page와 products에 따라 다시 렌더링돼야하므로 의존성배열엔 page와 products를 넣어줬습니다
  useEffect(() => {
    setCurrentPosts(products.slice(indexOfFirstPost, indexOfLastPost));
  }, [page, products]);

  // useEffect(() => {
  //     window.sessionStorage.setItem('page', page);
  // }, [page])

  // page변화 핸들링할 함수
  const handleChangePage = (page) => {
    const newUrl = `/page=${page}`;
    navigate(newUrl);
    setPage(page);
  };

  // 상품리스트 낮은 가격순, 높은 가격순 정렬 코드
  // 정렬된 sortedProd를 products와 currentposts 값으로 넣어 정렬된 상품리스트를 만듭니다
  // diary 과제물에서 diarylist 파일 참고했습니다
  const sortLowerPrice = () => {
    const sortedProd = [...products].sort((a, b) => a.price - b.price);
    setProducts(sortedProd);
    setCurrentPosts(sortedProd.slice(indexOfFirstPost, indexOfLastPost));
  };

  const sortHigherPrice = () => {
    const sortedProd = [...products].sort((a, b) => b.price - a.price);
    setProducts(sortedProd);
    setCurrentPosts(sortedProd.slice(indexOfFirstPost, indexOfLastPost));
  };

  const onClickBasket = (product) => {
    // const baskets = JSON.parse(localStorage.getItem("baskets")) || [];
    // baskets.push({name: product.name, prcie: product.price});

    // localStorage.setItem("baskets", JSON.stringify(baskets));

    // baskets이 없으면 생성하고, 존재하면 불러오기
    if (localStorage.baskets === undefined) {
      localStorage.setItem("baskets", JSON.stringify([]));
    }
    const baskets = JSON.parse(localStorage.getItem("baskets"));

    // 장바구니에 이미 저장한 상품이라면 경고문구
    let isExist = false;
    baskets.forEach((item) => {
      if (product.id === item.id) isExist = true;
    });
    if (isExist) {
      alert("이미 장바구니에 담으셨습니다.");
      return;
    }

    // * -- 이기현_ 추가 코드--
    // 장바구니 데이터로 활용하기 위하여, 로컬 스토러지에 담는 과정에서
    // count, isCheck 키를 추가 부여하였습니다.
    // 각 키값은 상품의 수량과 체크박스가 변동되는 데 쓰입니다.
    // baskets.push(product); << 원본
    // ----
    baskets.push({ ...product, count: 1, isCheck: false }); //  << 추가 코드_이기현
    localStorage.setItem("baskets", JSON.stringify(baskets));
  };

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className={styles.shopcon}>
      <button onClick={goHome}>홈</button>
      <Link to={"/shop/basket"}>
        <img src={"../img/basket.png"} alt="basket" />
      </Link>
      <Link to={"/shop/lowerprice"}>
        <button onClick={sortLowerPrice}>낮은 가격순</button>
      </Link>
      <button onClick={sortHigherPrice}>높은 가격순</button>
      <div className={styles.container}>
        <div className={styles.itemlist}>
          {/* 받은 데이터를 map함수로 화면에 렌더링 */}
          {/* map 메서드가 데이터 호출되기 전에 먼저 실행되어 오류가 발생할 수 있다. 따라서 map 함수 에러나면 '&&' 때려박아보셈 */}
          {/* 상품리스트만을 구현하고자 한다면 currentPosts 자리에 products를 작성하면 됩니다 */}
          {currentPosts &&
            currentPosts.map((product) => (
              <div key={product.id} className={styles.proditem}>
                <ul>
                  <Link to={`/shop/${product.id}`}>
                    <img
                      src={
                        "https://onlyeco.co.kr/web/product/big/202011/5024dcdeb85c03cfa7467e0897d9781d.jpg"
                      }
                      className={styles.itemimg}
                      alt="이미지"
                    />
                  </Link>
                  <li>{product.name}</li>
                  <li>{product.price}</li>
                  <button onClick={() => onClickBasket(product)}>
                    장바구니 추가
                  </button>
                </ul>
              </div>
            ))}
        </div>
        <Paging page={page} count={count} handleChangePage={handleChangePage} />
      </div>
    </div>
  );
};

export default Shop;

// 장바구니 -> localstorage로 구현
// : db활용한 경우에 비해 휘발성이라 디바이스, 브라우저가 바뀔 경우 장바구니 데이터 소멸
// but 클라이언트와 서버 간의 전체트래픽과 낭비되는 대역폭의 양을 줄일 수 있음. 서버 부담 완화

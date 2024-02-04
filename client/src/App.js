// import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./Compornents/Main";
import Header from "./Compornents/Header";
import Footer from "./Compornents/Footer";
import CarbonFootprint from "./view/CarbonFootprint";

// 이기현(임시) ------------------
// import Cart from "./component/Cart"; // 이기현_장바구니 컴포넌트
import Cart from "./view/Cart"; // 이기현_장바구니 컴포넌트
// import Ordersheet from "./component/Ordersheet"; // 이기현_오더시트 컴포넌트
import Ordersheet from "./view/Ordersheet"; // 이기현_오더시트 컴포넌트
//-------------------------

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          {/* <Route exact path="/" element={<Main />}/>
          라우팅 View Page작성 구역*/}
          {/* Main Page */}
          <Route exact path="/" element={<Main />} />
          {/* 곽별이 */}
          {/* 김민규 */}
          {/* 김연진 */}
          {/* 김지수 */}
          {/* 상호형 */}
          <Route exact path="/CarbonFootprint" element={<CarbonFootprint />} />
          {/* 이기현 */}
          <Route path="/cart" element={<Cart />} />
          {/* "/" 로컬 장바구니 페이지 라우팅 */}
          <Route path="/ordersheet" element={<Ordersheet />} />
          {/* "/" 주문서 작성 페이지 라우팅 */}
          {/* 이주호 */}
          {/* 김민호 */}
          {/* 전윤호 */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

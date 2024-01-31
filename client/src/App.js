// import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./Compornents/Main";
import Header from "./Compornents/Header";
import Footer from "./Compornents/Footer";
import CarbonFootprint from "./view/CarbonFootprint";

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

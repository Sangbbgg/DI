import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  // 페이지가 로드될 때 로그인 상태를 확인하고 상태를 업데이트
  useEffect(() => {
    const storedLoggedIn = sessionStorage.getItem("loggedIn");
    if (storedLoggedIn) {
      setLoggedIn(true);
    }
  }, [setLoggedIn]);

  // 로그아웃 시 세션 스토리지에서 로그인 상태 제거
  const handleLogout = () => {
    sessionStorage.removeItem("loggedIn");
    sessionStorage.removeItem("userData"); //0210 상호형 추가
    setLoggedIn(false);
    navigate("/"); //0210 상호형 추가
  };

  return (
    <div>
      Header입니다.
      {loggedIn ? (
        <>
          <button className="LoginBtn" onClick={handleLogout}>
            로그아웃
          </button>
          <button>
            <Link to="/modify">정보 수정</Link>
          </button>
        </>
      ) : (
        // 로그아웃 상태일 때 로그인과 회원가입 버튼 표시
        <>
          <button className="LoginBtn">
            <Link to="/Login">로그인</Link>
          </button>
          <button>
            <Link to="/Regester">회원가입</Link>
          </button>
          <br />
        </>
      )}
      {/* 20240213 테스트 추가_이기현 */}
      <button>
        <Link to="/cart">장바구니</Link>
      </button>
      <button>
        <Link to="/shop">상점</Link>
      </button>
      {/* ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ이기현 */}
    </div>
  );
}

export default Header;

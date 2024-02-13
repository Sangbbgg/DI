import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const [loggedIn, setLoggedIn] = useState(false);

  // 페이지가 로드될 때 로그인 상태를 확인
  useEffect(() => {
    const storedLoggedIn = sessionStorage.getItem('loggedIn');
    setLoggedIn(storedLoggedIn ? true : false);
  }, []);

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
        </>
      ) : (
        // 로그아웃 상태일 때 로그인과 회원가입 버튼 표시
        <>
          <button className="LoginBtn">
            <Link to="/Login">로그인</Link>
          </button>
          <button>
<<<<<<< HEAD
            <Link to='/Regester'>회원가입</Link>
=======
            <Link to="/Regester">회원가입</Link>
>>>>>>> efc5124062be42b3d4a118bf51b4b506c3efefac
          </button>
          <br />
        </>
      )}
    </div>
  );
}

<<<<<<< HEAD
export default Header;
=======
export default Header;
>>>>>>> efc5124062be42b3d4a118bf51b4b506c3efefac

import React, { useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

//로그인 페이지 상태 변화 함수
function LoginPage() {
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loginStatus,setloginStatus]= useState('');



  
  const LoginPageJs = () => {
    console.log('LoginPageJs 함수 호출됨');
  
    // 로그인 요청 구현
    axios.post('http://localhost:8000/login', {
      email: email,
      password: password,
    })
    .then(response => {
      console.log('서버 응답:', response);
      if (response.data.success) {
        const userData={
          userNumber:response.data.data[0].userNumber,
          userName:response.data.data[0].username,
        }
        sessionStorage.setItem('loggedIn', true);
        sessionStorage.setItem('userData',JSON.stringify(userData) ); // 0210 상호형 추가 세션에 userNumber,username추가
        navigate('/');
        window.location.reload(); //0210 상호형 추가 페이지를강제로 리로드
      } else {
        // 로그인 실패 시 처리
        console.log('로그인 실패:', response.data);
        setloginStatus('로그인 실패: '+ response.data.message);
      }
    })
  };
  
  return (
    <div className="login-page">
      <div className="form">
        <form className="login-form">
          <input
            id="id"
            type="text"
            placeholder="아이디"
            value={email}
            onChange={(e) => setemail(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button className="Btn" onClick={(e) => 
            { e.preventDefault(); console.log('버튼 클릭됨'); LoginPageJs() ; }}>
            로그인
          </button>
          <div>
            <Link to="/Regester">회원가입 필요하십니까?</Link>
          </div>
          {loginStatus && <div>{loginStatus}</div>}
        </form>
      </div>
    </div>
  );
}

export default LoginPage
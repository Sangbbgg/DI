import { Link } from "react-router-dom";
import React, { useState } from "react";
import DaumPostcode from "react-daum-postcode";
import { handlePostcode } from "../Handle/Postcodehandle";
import axios from 'axios';

function Regester() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch,setPasswordMatch] = useState(true);
  const [openPostcode, setOpenPostcode] = useState(false);
  const [address, setAddress] = useState('');
  const [Detailedaddress, setDetailedaddress] = useState('');
  const [phoneNumber, setphoneNumber] = useState('');

  const handle = handlePostcode(openPostcode, setOpenPostcode, setAddress);


  const handleRegesterClick = () => {
    if (!username || !email || !password || !confirmPassword || !address) {
      alert('정보를 모두 입력해주세요!');
      return;
    }
  
    if (!email) {
      alert('이메일을 입력해주세요!');
      return;
    }
    // if (!email.includes('@')) {
    //   alert('이메일을 입력해주세요!');
    //   return;
    // }
  
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      setPasswordMatch(false);
      return;
    }
  
    // if (password.length < 10 || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    //   alert('비밀번호는 최소 10글자 이상이어야 하며, 특수문자를 포함해야 합니다.');
    //   return;
    // }
  
// 클라이언트에서 서버로 회원가입 요청
axios.post('http://localhost:5005/regester', {
  username,
  password,
  email,
  address,
  Detailedaddress,
  phoneNumber,
  usertype: 'personal'
})
  .then(response => {
    console.log('서버 응답:', response.data);
    alert('회원가입이 완료되었습니다.');
    if (response.data.userType === 1) {
      // 개인 사용자 처리
    } 
    window.location.href = '/'; // 홈 페이지 또는 다른 페이지로 리디렉션
  })
  .catch(error => {
    if (error.response) {
      // 서버가 응답한 상태 코드가 2xx가 아닌 경우
      console.error('서버 응답 오류:', error.response.status, error.response.data);
    } else if (error.request) {
      // 서버로 요청이 전송되었지만 응답이 없는 경우
      console.error('서버 응답이 없음:', error.request);
    } else {
      // 요청을 설정하는 중에 에러가 발생한 경우
      console.error('요청 설정 중 오류:', error.message);
    }
    alert('서버와의 통신 중 오류가 발생했습니다.');
  });
  };
  

  return (
    <div>
      <input
        type="text"
        placeholder="사용자명"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br/>

      <input
        type="password"
        placeholder="비밀번호 확인"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <br />

      <input
        type="text"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />

       <input
        type="text"
        placeholder="핸드폰번호"
        value={phoneNumber}
        onChange={(e) => setphoneNumber(e.target.value)}
      />

      <br />
      <input
        type="text"
        placeholder="주소"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
    
      <button onClick={handle.clickButton}>선택</button>
      {openPostcode && (
        <DaumPostcode
          onComplete={handle.selectAddress}
          autoClose={false}
          defaultQuery=""
        />
      )}
      <br/>
      <input
        type="text"
        placeholder="상세주소"
        value={Detailedaddress}
        onChange={(e) => setDetailedaddress(e.target.value)}
      />
      <br/>
      <button className="RegesterBtn" onClick={handleRegesterClick}>
        가입완료
      </button>
      <div>
        <Link to="/login">로그인창</Link>
      </div>
    </div>
  );
}

export default Regester; 
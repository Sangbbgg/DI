﻿# 탄소중립 BBANG끗 PROJECT

    ezenac K-디지털 Class(AWS클라우드 활용 지능형 웹서비스 풀스택개발)
    Team2 : 곽별이, 김민규, 김연진, 김지수, 상호형, 이기현, 이주호, 김민호, 전윤호

## 기본 개발 기본설정

    React port:3000,
    node.js port:8000,
    서버 실행 명령어 : npm start
    -> node.js, react 동시 서버 구동

## git 명령어 목록

    1. 폴더생성 ex) tanso
    2. 폴더 내부 터미널(Git Bash) open
    3. git clone https://github.com/Sangbbgg/ezAWS_TeamSceond.git .    -> 맨뒤에 .을 붙이는건 폴더를 추가 생성하지 않고 현재 열려진 디렉토리에 Git 파일들을 내려받는 다는 뜻.
    3-1. npm i    -> node.js 패키지 설치
    3-2. cd client    -> client 디렉토리 이동
    3-3. npm i    -> react 패키지 설치
    3-5. cd ..    -> 프로젝트 디렉토리로 이동

    코드 작성

    4. git add .    -> 변경 사항 전체 add
    5. git commit -m "log기록"    -> 코드 작성/변경/수정 등 변경사항을 간략요약 하여 작성
    ----------------------------------------------------------
    6. git branch -M main    -> 중요! 기존 실습때 브랜치명이 서로 달라서 오류를 격었었음.
       => 이 코드는 내 업로드 마스터 브랜치를 main으로 변경하는 코드
       ! 한번만 실행하면됨 or 코드 작성 환경이 바뀌었을때 실행
    ----------------------------------------------------------
    7. git push origin main    -> 완료
       * 코드 작성 전 or push할 변동내용을없을때 주기적으로
    8. git pull
       명령어로 원격 repositorie의 내용을 최신화 할 것.

## 이기현

    2024-02-07 수정 및 추가 사항
    - "/ordersheet" 에서 Paypal API 를 도입하였습니다.
    - 클라이언트 측 pakage.json 파일에 구현하는데 필요한 라이브러리 2개("@paypal/react-paypal-js", "react-modal")를 등록하였습니다.
    - 새로운 컴포넌트 파일(PopupPaypalContent.js)을 추가하였습니다.
    - Style 폴더에 css 기본 파일을 추가하였습니다. 꼭 필요한 파일은 아닙니다.
    - 전윤호님의 Shop.js 파일에서 제 파일 연동이 되도록 일부분을 수정하였습니다.
    - Cart, LocalCartList, Ordersheet 각각의 파일에서 사소한 버그픽스 및 원활한 데이터 전달을 위하여 수정하였습니다.
    - server 측 index.js 파일에 Paypal API 코드를 추가하였습니다.(불필요한 서버 구동 오류를 방지하기 위해 실행은 막아두었습니다.);

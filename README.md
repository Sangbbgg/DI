# 탄소중립 BBANG끗 PROJECT
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
    3. git clone https://github.com/Sangbbgg/ezAWS_TeamSceond.git .
    -> 맨뒤에 .을 붙이는건 폴더를 추가 생성하지 않고 현재 열려진 디렉토리에 Git 파일들을 내려받는 다는 뜻.
    3-1. npm i 
    -> 라이브러리 install

    코드 작성

    4. git add .
    -> 변경 사항 전체 add
    5. git commit -m "log기록"
    -> 코드 작성/변경/수정 등 변경사항을 간략요약 하여 작성
    ----------------------------------------------------------
    6. git branch -M main
    -> 중요! 기존 실습때 브랜치명이 서로 달라서 오류를 격었었음.
    => 이 코드는 내 업로드 마스터 브랜치를 main으로 변경하는 코드
    ! 한번만 실행하면됨 or 코드 작성 환경이 바뀌었을때 실행
    ----------------------------------------------------------
    7. git push origin main
    -> 완료

     * 코드 작성 전 or push할 변동내용을없을때
     주기적으로 
     8. git pull 
     명령어로 원격 repositorie의 내용을 최신화 할 것.

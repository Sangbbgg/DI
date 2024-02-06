use ezteam2;

-- 계산기 공식 테이블
CREATE TABLE carbon_footprint (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category_name VARCHAR(255) ,
  label VARCHAR(255) ,
  sublabel VARCHAR(255) , 
  unit VARCHAR(10) NOT NULL,
  cost_formula VARCHAR(255) NOT NULL,
  parent_category_id INT,
  FOREIGN KEY (parent_category_id) REFERENCES carbon_footprint(id) ON DELETE SET NULL
);

-- 계산기 공식 추가
INSERT INTO carbon_footprint (category_name, label, sublabel, unit, cost_formula, parent_category_id)
VALUES
  ('electricity','전기',  null, 'kWh', '0.4781', NULL),
  ('gas','가스',  null, '㎥', '2.176', NULL),
  ('water','수도',  null, '㎥', '0.237', NULL),
  ('transportation','교통',  null, 'km', '', NULL),
  ('gasoline', null, '휘발유', '', '16.04 * 2.097', 4),
  ('diesel', null, '경유', '', '15.35 * 2.582', 4),
  ('lpg', null, 'LPG', '', '11.06 * 1.868', 4),
  ('waste','폐기물',  null, '', '', NULL),
  ('kg',  null, '', 'kg', '0.5573', 8),
  ('l',  null, '', 'L', '0.171 * 0.5573', 8);

-- 유저 계산 결과 저장 테이블
CREATE TABLE user_calculation (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  calculation_month DATE NOT NULL,
  electricity DECIMAL(10, 1) NOT NULL,
  gas DECIMAL(10, 1) NOT NULL,
  water DECIMAL(10, 1) NOT NULL,
  transportation DECIMAL(10, 1) NOT NULL,
  waste DECIMAL(10, 1) NOT NULL,
  total DECIMAL(10, 1) NOT NULL,
  UNIQUE KEY user_month_unique (user_id, calculation_month),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 카테고리 테이블 생성
CREATE TABLE calculation_category (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- 조언 테이블 생성
CREATE TABLE calculation_advice (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT,
  advice_text TEXT NOT NULL,
  savings_value DECIMAL(5, 2) NOT NULL,
  FOREIGN KEY (category_id) REFERENCES category(id)
);

-- 계산기 카테고리 추가
INSERT INTO calculation_category (name) VALUES
  ('electricity'),
  ('gas'),
  ('water'),
  ('transportation'),
  ('waste');

-- 전기 카테고리의 조언 추가
INSERT INTO advice (category_id, advice_text, savings_value) VALUES
  (1, '하루 1시간은 에어컨 대신 선풍기로!', 3.2),
  (1, '세탁은 모아서 해도 잘 된답니다.', 0.6),
  (1, '전기밥솥 보온기능은 전기먹는 하마', 5.9),
  (1, '냉장실은 60% 채우면 효율이 최고', 1),
  (1, '컴퓨터 절전프로그램사용', 1.6),
  (1, 'TV 시청 줄이고 가족과 대화 늘리고!', 1.8);

-- 가스 카테고리의 조언 추가
INSERT INTO advice (category_id, advice_text, savings_value) VALUES
  (2, '겨울철 난방온도는 20˚C가 적당해요', 14.6),
  (2, '보일러 사용시간 1시간만 줄여요', 28.3);

-- 수도 카테고리의 조언 추가
INSERT INTO advice (category_id, advice_text, savings_value) VALUES
  (3, '절수기로 물낭비를 쉽게 막아요.', 3.9),
  (3, '물을 받아서 사용해요.(설거지, 양치할때)', 0.4),
  (3, '짧게 샤워하는 그대가 진정한 멋쟁이!', 0.6);

-- 교통 카테고리의 조언 추가
INSERT INTO advice (category_id, advice_text, savings_value) VALUES
  (4, '도보와 자전거로 건강도 UP!', 2.1),
  (4, '1주일에 한번쯤은 대중교통 어때요?', 39.1),
  (4, '경제속도는 60~80km/h, 연비 최고!', 5.5),
  (4, '불필요한 짐은 트렁크에서 OUT!', 4.7),
  (4, '타이어 공기압 체크, 연료비 DOWN!', 6.9),
  (4, '실시간 네비게이션 더 빠른 길로 GO!', 32.6);

-- 폐기물 카테고리의 조언 추가
INSERT INTO advice (category_id, advice_text, savings_value) VALUES
  (5, '재활용이 가능한 유리병, 캔 등 분리배출해요', 7.3),
  (5, '먹을만큼 만들고 쓰레기를 20% 줄여봐요!', 7.3);

-- 계산 공식 획득 쿼리
SELECT * FROM carbon_footprint;
-- 목표치 선택값 획득 쿼리
SELECT a.name, b.advice_text, b.savings_value FROM calculation_category as a join calculation_advice as b ON a.id = b.category_id;
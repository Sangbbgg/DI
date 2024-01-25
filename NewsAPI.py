import requests # HTTP 요청 / 웹 페이지의 HTML 내용을 가져오거나 API로부터 데이터 요청 가능
from bs4 import BeautifulSoup # HTML 문서 파싱(분석, 원하는 데이터 가져옴) 및 검색
import pymysql # MySQL과 상호 작용
import json # JSON형식 데이터 파싱 및 생성[내장]
import re # 정규표현식을 사용 할 수 있게 해줌[내장]
import os  # 운영 체제와 상호 작용(디렉토리 및 파일 관리, 경로 조작, 실행 등)[내장]
from datetime import datetime

# 네이버 검색 API 설정
naver_client_id = 'uS5Xhb8JblGILCKjdY3Q' # API 클라이언트 ID
naver_client_secret = '2igmkuhnfS' # API 클라이언트 SECRET
news_url = 'https://openapi.naver.com/v1/search/news.json'
query = '탄소중립' # 검색어 지정

# 네이버 검색 API 호출
headers = {'X-Naver-Client-Id': naver_client_id, 'X-Naver-Client-Secret': naver_client_secret}
# query : 검색어, display : 한 번에 표시할 검색 결과 개수(기본값 10. 최댓값 100), sort : (sim 정확도순 내림차순(기본값), date 날짜 내림차순)
params = {'query': query, 'display': 50, 'sort': 'date'}
response = requests.get(news_url, headers=headers, params=params)
result = response.json()

# MySQL 연결 설정
db = pymysql.connect(host='localhost', user='root', password='1234', database='news') # 사용 DB 지정
cursor = db.cursor() # DB와 연결된 커서 객체 생성

# 테이블 생성
create_table_query = '''
CREATE TABLE IF NOT EXISTS news (
    idx INT AUTO_INCREMENT PRIMARY KEY,
    image_url VARCHAR(255),
    title VARCHAR(255),
    content TEXT,
    url VARCHAR(255),
    pubDate DATETIME
);
'''
cursor.execute(create_table_query) # SQL 쿼리 실행

# JSON 파일명 지정
json_filename = 'news_data.json'

# 기존 JSON 파일이 이미 존재하는 경우
if os.path.exists(json_filename): # os.path.exists() : 해당 경로에 파일 존재 유무 확인[BOOLEAN] 
    try:
        # 기존 JSON 파일 읽기
        # json_filename : 변수의 경로, 'r' : 읽기 모드
        with open(json_filename, 'r', encoding='utf-8') as existing_file:
            # JSON파일의 내용 읽고 파이썬 객체로 변환 후 변수에 저장
            existing_data = json.load(existing_file)
        # existing_data에 'items'키가 있가 있고 아이템이 있다면 마지막[-1] 아이템의 'idx'값을 변수에 저장
        last_idx = existing_data['items'][-1]['idx'] if existing_data['items'] else 0
    # 에러 등 예외 발생 시 아래 실행
    except Exception as e:
        print(f'기존 JSON 파일 읽기 오류: {e}')
        existing_data = {'items': []}
        last_idx = 0
# JSON 파일이 없는 경우 새로 만듦
else:
    existing_data = {'items': []}
    last_idx = 0
  
idx = last_idx + 1
NoImage = 'data:image/png;base64,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'

# 데이터 삽입
for item in result['items']:
    url = item['link']
    pubDate_str = item['pubDate']  # 기존 문자열 형식의 날짜
    pubDate_str = re.sub(r'\s\+\d{4}$', '', pubDate_str) # 날짜의 문자열에 있는 +0900 없애기
    
    pubDate = datetime.strptime(pubDate_str, "%a, %d %b %Y %H:%M:%S")  # 날짜 문자열을 datetime 객체로 변환
    
    url_pattern = re.compile(r'^https://n\.news\.naver\.com/mnews/article/.*') # 추출할 기사 url 정규표현식 지정
    
    if idx - last_idx <= 10:
        if url_pattern.match(url):
            # url값의 HTTP GET 요청 후 응답을 변수에 저장
            response_article = requests.get(url)
            # .text: 응답받은 값 텍스트로 추출 / 'html.parser': Python 내장 HTML 파서
            soup = BeautifulSoup(response_article.text, 'html.parser')

            # 기사 본문 제목 가져오기
            title_tag = soup.find('h2', {'id': 'title_area'}) # h2 태그의 id 값이 title_area인 것 찾아서 변수에 저장
            # title_tag가 존재하면 텍스트화 시키고 좌우 공백 제거한 값을 title에 저장 title_tag가 없으면 item['title'] 저장
            title = title_tag.text.strip() if title_tag else item['title']

            # 기사 본문 텍스트 가져오기
            article_tag = soup.find('article', {'id': 'dic_area'})
            content = article_tag.text.strip() if article_tag else 'No Content'

            # 기사 본문 이미지 가져오기
            img_tag = soup.find('img', {'id': 'img1'})
            # img_tag가 존재하고 'data-src' 속성이 있다면
            if img_tag and 'data-src' in img_tag.attrs:
                image_url = img_tag['data-src'] # img_tag의 data-src 속성값을 변수에 저장
            else:
                image_url = NoImage

            # 데이터 삽입 쿼리 실행
            insert_query = "INSERT INTO news (image_url, title, content, url, pubDate) VALUES (%s, %s, %s, %s, %s);" # %s는 쿼리 실행시 값 지정
            cursor.execute(insert_query, (image_url, title, content, url, pubDate)) # SQL 쿼리 실행

            # JSON 데이터 추가
            existing_data['items'].append({'idx': idx, 'title': title, 'content': content, 'url': url, 'thumbnail': image_url, 'date': pubDate})
            idx += 1
        else:
            continue
    else:
        break

# DB 변경사항 저장
db.commit()

# 커서 및 연결 종료
cursor.close()
db.close()

# JSON 파일로 저장
# 'news_data.json' : 파일명, 'w' : 쓰기 모드, json_file에 할당
with open('news_data.json', 'w', encoding='utf-8') as json_file:
    # ensure_ascii=False : ASCII 이외 문자도 모두 포함하여 저장, indent : 들여쓰기에 사용할 공백 수
    json.dump(existing_data, json_file, ensure_ascii=False, indent=4, default=str)
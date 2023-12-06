// spinner.js 모듈에서 'createSpinner' 함수를 가져옵니다.
import { createSpinner } from "./spinner.js";

// 최신 뉴스 아이템을 생성하는 함수입니다.
function createLatestNewsElement(article) {
  const { title, link } = article; // 구조 분해 할당을 사용해 article 객체에서 title과 link를 추출합니다.

  const listItem = document.createElement('li'); // 새로운 리스트 아이템(li 태그)을 생성합니다.
  const anchor = document.createElement('a'); // 새로운 앵커(a 태그)를 생성합니다.
  
  anchor.setAttribute('href', link);// 앵커에 href 속성을 설정하여 링크를 지정합니다.
  anchor.textContent = title; // 앵커의 텍스트 내용을 뉴스 제목으로 설정합니다.

  listItem.className = 'latest-news-item'; // 리스트 아이템에 클래스를 추가합니다.
  listItem.append(anchor); // 앵커를 리스트 아이템에 추가합니다.

  return listItem; // 완성된 리스트 아이템을 반환합니다.
}

// 상위 뉴스 아이템을 생성하는 함수입니다.
function createTopNewsElement(article) {
  const { title, summary, link, thumbnailImage } = article; // 구조 분해 할당을 사용해 article 객체에서 여러 속성을 추출합니다.

  const anchor = document.createElement('a'); // 새로운 앵커를 생성합니다.
  anchor.setAttribute('href', link); // 앵커에 href 속성을 설정합니다.
  anchor.innerHTML = `
    <article class="news">
      <div class="information">
        <h3 class="title">${title}</h3>
        <p class="description">${summary}</p>
      </div>
      <div class="thumbnail-area">
        <img src="${thumbnailImage}" alt="thumbnail" class="thumbnail" />
      </div>
    </article>`;
  // 앵커의 내부 HTML을 설정하여 뉴스 아이템의 구조를 구성합니다.

  return anchor; // 완성된 앵커를 반환합니다.
}

// 위 function createTopNewsElement(article) 코드는 웹 페이지에 표시될 상위 뉴스 항목을 생성하는 함수 createTopNewsElement를 정의하고 있습니다. 
// 각 뉴스 아이템은 article 객체로부터 정보를 받아와서 HTML 요소로 변환합니다.

// function createTopNewsElement(article) {...}: 이 함수는 article 객체를 인자로 받아 이를 기반으로 HTML 요소를 생성합니다.

// const { title, summary, link, thumbnailImage } = article;: 
// 여기서 구조 분해 할당을 사용하여 article 객체에서 title, summary, link, thumbnailImage라는 네 가지 속성을 추출합니다.

// title: 뉴스 기사의 제목입니다.
// summary: 뉴스 기사의 요약 내용입니다.
// link: 뉴스 기사의 원문 링크입니다.
// thumbnailImage: 뉴스 기사와 관련된 썸네일 이미지의 URL입니다.
// const anchor = document.createElement('a');: 새로운 앵커(<a>) 요소를 생성합니다. 이 앵커는 전체 뉴스 아이템을 감싸는 역할을 합니다.

// anchor.setAttribute('href', link);: 앵커 요소에 href 속성을 설정하여, 클릭 시 사용자가 link에 지정된 URL로 이동하도록 합니다.

// anchor.innerHTML = ...;`: 여기서는 앵커 요소의 내부 HTML을 설정합니다. 이 HTML 구조는 다음과 같은 구성 요소를 포함합니다:

// <article class="news">...</article>: 뉴스 아이템을 나타내는 <article> 요소로, 클래스로 news를 가집니다.
// <div class="information">...</div>: 뉴스 제목과 요약을 담는 컨테이너입니다.
// <h3 class="title">${title}</h3>: 뉴스 제목을 표시하는 부분입니다.
// <p class="description">${summary}</p>: 뉴스의 요약 내용을 표시하는 부분입니다.
// <div class="thumbnail-area">...</div>: 썸네일 이미지를 담는 컨테이너입니다.
// <img src="${thumbnailImage}" alt="thumbnail" class="thumbnail" />: 실제 썸네일 이미지를 나타내는 <img> 요소입니다.
// return anchor;: 함수는 완성된 앵커 요소를 반환합니다. 이 요소는 나중에 웹 페이지에 동적으로 추가될 것입니다.



// 상위 뉴스를 렌더링하는 함수입니다.
function renderTopNews() {
  const articleSection = document.getElementById('topNewsList'); // 상위 뉴스 섹션을 찾습니다.

  createSpinner(articleSection); // 스피너를 생성하여 로딩 중임을 표시합니다.

  setTimeout(() => {
    fetch('./data/top.json') // 상위 뉴스 데이터를 fetch로 비동기적으로 가져옵니다.
      .then((res) => res.json()) // 응답을 JSON 형식으로 변환합니다.
      .then((data) => {
        const { articles } = data; // 구조 분해 할당으로 articles 배열을 추출합니다.
        const articleList = articles.map((article) =>
          createTopNewsElement(article)
        ); // 각 기사에 대해 상위 뉴스 요소를 생성합니다.

        articleSection.append(...articleList); // 생성된 요소들을 섹션에 추가합니다.
      })
      .finally(() => {
        hideSpinner(articleSection); // 로딩이 끝나면 스피너를 숨깁니다.
      });
  }, 1500); // 1.5초 후에 이 작업을 시작합니다.
}

// 최신 뉴스를 렌더링하는 함수입니다.
function renderLatestNews() {
  const latestNewsList = document.querySelector('.latest-news-list'); // 최신 뉴스 리스트를 찾습니다.

  createSpinner(latestNewsList); // 스피너 생성

  setTimeout(() => {
    fetch('./data/latest.json') // 최신 뉴스 데이터를 fetch로 가져옵니다.
      .then((res) => res.json()) // 응답을 JSON으로 변환합니다.
      .then((data) => {
        const { articles } = data; // 구조 분해 할당으로 articles 배열을 추출합니다.
        const articleList = articles.map((article) =>
          createLatestNewsElement(article)
        ); // 각 기사에 대해 최신 뉴스 요소를 생성합니다.
        
        latestNewsList.append(...articleList); // 생성된 요소들을 리스트에 추가합니다.
      })
      .finally(() => {
        hideSpinner(latestNewsList); // 로딩이 끝나면 스피너를 숨깁니다.
      });
  }, 1500); // 1.5초 후에 이 작업을 시작합니다.
}
// 스피너를 숨기는 함수입니다.
function hideSpinner(parent) {
  const spinnerArea = parent.querySelector('.spinner-area'); // 스피너가 있는 영역을 찾습니다.
  spinnerArea.style.display = 'none'; // 스피너를 숨깁니다.
}

// DOM이 완전히 로드되면 실행됩니다.
document.addEventListener('DOMContentLoaded', () => {
  renderTopNews(); // 상위 뉴스 렌더링 함수 실행
  renderLatestNews(); // 최신 뉴스 렌더링 함수 실행
});


// 이 코드는 웹 페이지의 상위 뉴스 섹션과 최신 뉴스 섹션에 각각의 뉴스 아이템을 동적으로 추가합니다. 
// 뉴스 데이터는 JSON 파일로부터 비동기적으로 가져옵니다. 이 과정에서 스피너(로딩 인디케이터)를 사용하여 데이터 로딩 중임을 사용자에게 시각적으로 표시합니다. 
// 데이터 로딩이 완료되면, 스피너는 숨겨지고, 각 뉴스 아이템이 페이지에 추가됩니다.
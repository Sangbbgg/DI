import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "react-js-pagination";
import "./App.css";

const articlesPerPage = 10;

const sortNews = (news, sortBy) => {
  return [...news].sort((a, b) => {
    const dateA = new Date(a.pubDate);
    const dateB = new Date(b.pubDate);

    if (sortBy === "latest") {
      return dateB - dateA;
    } else if (sortBy === "oldest") {
      return dateA - dateB;
    }
    return 0;
  });
};

function NewsItem({ item }) {
  const [clickCount, setClickCount] = useState(0); // 조회수
  const [isLiked, setIsLiked] = useState(false); // 좋아요

  const handleClick = () => {
    setClickCount(clickCount + 1);

    // 서버에 조회수 정보 전송
    axios
      .post("http://localhost:8081/views", {
        newsId: [item.idx],
        clickCount: clickCount + 1,
      })
      .then((response) => console.log(response.data))
      .catch((error) => console.error(error));

    // 링크 열기
    window.open(item.url, "_blank");
  };

  const handleLikeClick = () => {
    setIsLiked((prevIsLiked) => !prevIsLiked);

    // 서버에 좋아요 정보 전송
    axios
      .post("http://localhost:8081/likes", {
        newsId: [item.idx],
        isLiked: !isLiked,
      })
      .then((response) => {
        console.log(response.data); // 성공적으로 서버에 전송된 경우의 처리
      })
      .catch((error) => console.error(error));
  };

  return (
    <li key={item.idx}>
      <img
        src={item.image_url}
        width={100}
        height={100}
        alt="News Thumbnail"
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      />
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
      >
        {item.title}
      </a>
      {clickCount > 0 && (
        <span style={{ marginLeft: "30px" }}>조회수 : {clickCount}</span>
      )}
      <button onClick={handleLikeClick} style={{ marginLeft: "10px" }}>
        {isLiked ? "❤️" : "🤍"}
      </button>
      <p>{item.pubDate}</p>
    </li>
  );
}

function App() {
  const [news, setNews] = useState([]);
  const [page, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    axios
      .get("http://localhost:8081/news")
      .then((response) => {
        const initialSortedNews = sortNews(response.data, "latest");
        setNews(initialSortedNews);
      })
      .catch((error) => console.error(error));
  }, []);



  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    const newSortBy = e.target.value;
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  const handleSearchButtonClick = () => {
    axios
      .get("http://localhost:8081/news")
      .then((response) => {
        let updatedNews = response.data;

        if (searchTerm) {
          updatedNews = updatedNews.filter((item) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        const sortedNews = sortNews(updatedNews, sortBy);
        setNews(sortedNews);
        setCurrentPage(1);
      })
      .catch((error) => console.error(error));
  };

  const handleLogoClick = () => {
    // 초기화면으로 돌아가는 작업 수행
    axios
      .get("http://localhost:8081/news")
      .then((response) => {
        const initialSortedNews = sortNews(response.data, "latest");
        setNews(initialSortedNews);
        setCurrentPage(1);
        setSearchTerm("");
        setSortBy("latest");
      })
      .catch((error) => console.error(error));
  };

  const indexOfLastArticle = page * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = news
    ? sortNews(news, sortBy).slice(indexOfFirstArticle, indexOfLastArticle)
    : [];

  return (
    <div>
      {/* h1 태그 클릭 시 초기화면으로 이동 */}
      <h1>
        <b onClick={handleLogoClick} style={{ cursor: "pointer" }}>
          Top 10 News
        </b>
      </h1>
      <div>
        {/* 검색 기능 추가 */}
        <input
          type="text"
          placeholder="뉴스 검색"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {/* 검색 버튼 추가 */}
        <button onClick={handleSearchButtonClick}>검색</button>
      </div>
      {/* 정렬 기능 추가 */}
      <select value={sortBy} onChange={handleSortChange}>
        <option value="latest">최신순</option>
        <option value="oldest">오래된순</option>
      </select>
      <ul>
        {currentArticles.map((item) => (
          <NewsItem key={item.idx} item={item} />
        ))}
      </ul>
      <Pagination
        activePage={page}
        itemsCountPerPage={articlesPerPage}
        totalItemsCount={news.length}
        pageRangeDisplayed={5}
        prevPageText={"‹"}
        nextPageText={"›"}
        onChange={handlePageChange}
      />
    </div>
  );
}

export default App;
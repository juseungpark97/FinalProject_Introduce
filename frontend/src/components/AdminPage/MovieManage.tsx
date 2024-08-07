import React, { useState } from 'react';
import styles from '../../pages/AdminPage/css/DashboardPage.module.css';
import Pagination from './Pagination'; // Pagination 컴포넌트를 import 합니다.

interface Movie {
  id: number;
  title: string;
  genre: string;
  actors: string;
  director: string;
  duration: string;
  releaseDate: string;
  views: string;
  rating: string;
}

const moviesData: Movie[] = [
  { id: 1, title: 'testtitle', genre: '호러', actors: '배우1, 배우2, 배우3', director: '감독1', duration: '200분', releaseDate: '2020.01.01', views: '8000회', rating: '5.0/5.0' },
  // 추가적인 영화 데이터들...
];

export default function MovieManage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    console.log("검색어:", searchTerm);
  };

  // 검색어에 따른 필터링된 영화 목록
  const filteredMovies = moviesData.filter(
    (movie) => movie.title.includes(searchTerm)
  );

  // 페이지네이션을 위한 현재 페이지의 영화 데이터 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMovies.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className={styles.tableContainer}>
      <div className={styles.headerContainer}>
        <h1 className={styles.movimanage}>영화 관리</h1>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="영화제목"
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
          <button onClick={handleSearchClick} className={styles.searchButton}>검색</button>
        </div>
      </div>
      <div>
        <table className={styles.tg}>
          <colgroup>
            <col style={{ width: "100px" }} />
            <col style={{ width: "300px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "300px" }} />
            <col style={{ width: "250px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "110px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "100px" }} />
          </colgroup>
          <thead>
            <tr id={styles.firstrow}>
              <th>영화번호</th>
              <th>제목</th>
              <th>장르</th>
              <th>출연배우</th>
              <th>감독</th>
              <th>상영시간</th>
              <th>등록일자</th>
              <th>조회수</th>
              <th>평점</th>
              <th>삭제하기</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((movie) => (
              <tr key={movie.id}>
                <td>{movie.id}</td>
                <td>{movie.title}</td>
                <td>{movie.genre}</td>
                <td>{movie.actors}</td>
                <td>{movie.director}</td>
                <td>{movie.duration}</td>
                <td>{movie.releaseDate}</td>
                <td>{movie.views}</td>
                <td>{movie.rating}</td>
                <td><button>delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={filteredMovies.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
}
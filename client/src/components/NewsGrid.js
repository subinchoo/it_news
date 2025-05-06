import React from "react";
import "./NewsGrid.css";

function NewsGrid({ articles, notes, onNoteChange }) {
  return (
    <div className="grid">
      {articles
        .filter(
          (article) => article.image_url && article.image_url.trim() !== ""
        )
        .map((article, index) => (
          <div className="card" key={index}>
            <img
              src={article.image_url}
              alt="article_image"
              onError={(e) => {
                e.target.onerror = null; // 무한 루프 방지
                e.target.src = "/default-news.jpg"; // 기본 이미지로 대체
              }}
            />

            <h3>{article.title}</h3>
            <p>{article.description}</p>
            <a href={article.link} target="_blank" rel="noreferrer">
              Original News →
            </a>

            <div className="note-box">
              <textarea
                value={notes[article.link] || ""}
                onChange={(e) => onNoteChange(article.link, e.target.value)}
                placeholder="📝 Notes"
              />
            </div>
          </div>
        ))}
    </div>
  );
}

export default NewsGrid;

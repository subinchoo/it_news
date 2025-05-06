import React from "react";
import "./MainArticle.css";

function MainArticle({ article }) {
  if (!article) return null;

  return (
    <div className="main-article">
      <img src={article.image_url} alt="Main News" />
      <div className="main-text">
        <h2>{article.title}</h2>
        <p>{article.description}</p>
        <a href={article.link} target="_blank" rel="noreferrer">
          Detail →
        </a>
      </div>
    </div>
  );
}

export default MainArticle;

import React, { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import MainArticle from "./components/MainArticle";
import NewsGrid from "./components/NewsGrid";
import "./App.css";

function App() {
  const [dateFilter, setDateFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [articles, setArticles] = useState([]);
  const [mainArticle, setMainArticle] = useState(null);
  const [category, setCategory] = useState("technology");
  const [visibleCount, setVisibleCount] = useState(6);
  const [darkMode, setDarkMode] = useState(false);
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("notes");
    return saved ? JSON.parse(saved) : {};
  });

  const validArticles = useMemo(() => {
    const now = new Date();

    const getDaysDiff = (dateStr) => {
      const date = new Date(dateStr);
      const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
      return diff;
    };

    return (articles || [])
      .filter((a) => a.image_url && a.image_url.trim() !== "")
      .filter((a) => {
        if (dateFilter === "all") return true;
        const days = getDaysDiff(a.pubDate);
        return (
          (dateFilter === "today" && days === 0) ||
          (dateFilter === "3days" && days <= 3) ||
          (dateFilter === "7days" && days <= 7)
        );
      })
      .filter((a) => {
        if (sourceFilter === "all") return true;
        return a.source_id === sourceFilter;
      });
  }, [articles, dateFilter, sourceFilter]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const handleNoteChange = (link, value) => {
    const updated = { ...notes, [link]: value };
    setNotes(updated);
    localStorage.setItem("notes", JSON.stringify(updated));
  };

  useEffect(() => {
    fetch(`/api/news?category=${category}`)
      .then((res) => res.json())
      .then((data) => {
        const list = data.results || data.articles || [];
        setMainArticle(list[0]);
        setArticles(list.slice(1));
        setVisibleCount(6);
      })
      .catch((err) => console.error("failed to load:", err));
  }, [category]);

  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored === "true") setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

  return (
    <div className={`container ${darkMode ? "dark" : ""}`}>
      <Header
        title="IT News"
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
      />

      <div className="filters">
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          <option value="all">All Dates</option>
          <option value="today">Today</option>
          <option value="3days">Last 3 Days</option>
          <option value="7days">Last 7 Days</option>
        </select>

        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
        >
          <option value="all">All Sources</option>
          <option value="bbc">BBC</option>
          <option value="cnn">CNN</option>
          <option value="the-verge">The Verge</option>
        </select>
      </div>

      <MainArticle article={mainArticle} />

      <NewsGrid
        articles={validArticles.slice(0, visibleCount)}
        notes={notes}
        onNoteChange={handleNoteChange}
      />

      {visibleCount < validArticles.length && (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <button onClick={handleLoadMore} className="load-more-btn">
            more +
          </button>
        </div>
      )}
    </div>
  );
}

export default App;

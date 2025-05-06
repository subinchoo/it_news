import React from "react";
import "./Header.css";

function Header({ title, toggleDarkMode, darkMode }) {
  return (
    <header className="header">
      <h1 className="title">{title}</h1>
      <div className="right-header">
        <button onClick={toggleDarkMode} className="toggle-dark-btn">
          {darkMode ? "🌞 Light" : "🌙 Dark"}
        </button>
      </div>
    </header>
  );
}

export default Header;

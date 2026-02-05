import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";


export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          JapanEasy
        </Link>

        <div className="nav-links">
          <Link to="/" className="nav-item">Home</Link>
          <Link to="/levels" className="nav-item">JLPT Preparation</Link>
          <Link to="/favorites" className="nav-item">⭐ Favorites</Link>
        </div>
      </div>
    </nav>
  );
}

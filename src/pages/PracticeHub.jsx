import React from "react";
import { useParams, Link } from "react-router-dom";

export default function PracticeHub() {
  const { levelCode } = useParams();

  return (
    <div className="container">
      <h1 style={{ marginBottom: 6 }}>
        {levelCode} Sample Questions
      </h1>

      <p className="muted" style={{ marginBottom: 24 }}>
        Choose a practice type to test your understanding.
      </p>

      <div className="levels-grid">
        <Link
          to={`/levels/${levelCode}/practice/vocab`}
          className="level-card"
        >
          <h3>📝 Vocab Practice</h3>
        </Link>

        <Link
          to={`/levels/${levelCode}/practice/grammar`}
          className="level-card"
        >
          <h3>📘 Grammar Practice</h3>
        </Link>

        <Link
          to={`/levels/${levelCode}/practice/reading`}
          className="level-card"
        >
          <h3>📖 Reading Practice</h3>
          <p className="muted">
          </p>
        </Link>
      </div>

      <div style={{ marginTop: 20 }}>
        <Link to="/levels" className="muted">
          ← Back to JLPT Levels
        </Link>
      </div>
    </div>
  );
}

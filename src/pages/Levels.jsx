// src/pages/Levels.jsx
import React from "react";
// src/pages/Levels.jsx
import "./levels.css";

import { Link } from "react-router-dom";

const LEVELS = [
  { code: "N5", title: "JLPT N5", subtitle: "Beginner — basic survival Japanese" },
  { code: "N4", title: "JLPT N4", subtitle: "Elementary — more verbs & grammar" },
  { code: "N3", title: "JLPT N3", subtitle: "Intermediate — reading & listening" },
];

// ---------- Progress Helper ----------
function getLevelProgress(level) {
  try {
    const progress = JSON.parse(localStorage.getItem("progress")) || {};
    const totals = JSON.parse(localStorage.getItem("totals")) || {};

    const vocabViewed = progress.vocab?.[level]?.length || 0;
    const kanjiViewed = progress.kanji?.[level]?.length || 0;
    const grammarViewed = progress.grammar?.[level]?.length || 0;

    const vocabTotal = totals.vocab?.[level] || 0;
    const kanjiTotal = totals.kanji?.[level] || 0;
    const grammarTotal = totals.grammar?.[level] || 0;

    const viewed = vocabViewed + kanjiViewed + grammarViewed;
    const total = vocabTotal + kanjiTotal + grammarTotal;

    if (!total) return 0;
    return Math.min(100, Math.round((viewed / total) * 100));
  } catch {
    return 0;
  }
}

// ---------- Icons ----------
function Icon({ name, size = 22 }) {
  if (name === "vocab") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7 9h10M7 13h10" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
  if (name === "kanji") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 5h16M4 12h16M4 19h16" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 5v14" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 4v16M6 10h12M6 14h12" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

// ---------- Page ----------
export default function Levels() {
  return (
    <div className="container">
      <div className="hero" style={{ marginBottom: 24 }}>
        <h1>JLPT Levels</h1>
        <p className="lead">
          Track your learning progress across vocabulary, kanji and grammar.
        </p>
      </div>

      <div className="levels-grid">
        {LEVELS.map(level => {
          const progress = getLevelProgress(level.code);

          return (
            <div key={level.code} className="level-card">
              {/* Header */}
              <div className="level-card-head">
                <div className="level-badge">{level.code}</div>
                <div>
                  <div className="level-title">{level.title}</div>
                  <div className="level-sub">{level.subtitle}</div>
                </div>
              </div>

              {/* Progress */}
              <div style={{ marginTop: 12 }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  color: "#6b7280"
                }}>
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>

                <div style={{
                  height: 6,
                  background: "#e5e7eb",
                  borderRadius: 999,
                  overflow: "hidden",
                  marginTop: 4
                }}>
                  <div style={{
                    width: `${progress}%`,
                    height: "100%",
                    background:
                      progress >= 80 ? "#16a34a" :
                      progress >= 40 ? "#2563eb" :
                      "#9ca3af",
                    transition: "width 0.3s ease"
                  }} />
                </div>
              </div>

              {/* Actions */}
              <div className="level-card-body">
                <Link to={`/levels/${level.code}/vocab`} className="level-action">
                  <div style={{ display: "flex", gap: 12 }}>
                    <Icon name="vocab" />
                    <div>
                      <strong>Vocab</strong>
                      <div className="muted">Words & readings</div>
                    </div>
                  </div>
                  <span className="chev">›</span>
                </Link>

                <Link to={`/levels/${level.code}/kanji`} className="level-action">
                  <div style={{ display: "flex", gap: 12 }}>
                    <Icon name="kanji" />
                    <div>
                      <strong>Kanji</strong>
                      <div className="muted">On / Kun readings</div>
                    </div>
                  </div>
                  <span className="chev">›</span>
                </Link>

                <Link to={`/levels/${level.code}/grammar`} className="level-action">
                  <div style={{ display: "flex", gap: 12 }}>
                    <Icon name="grammar" />
                    <div>
                      <strong>Grammar</strong>
                      <div className="muted">Structures & examples</div>
                    </div>
                  </div>
                  <span className="chev">›</span>
                </Link>
                
                <Link to={`/levels/${level.code}/practice`} className="level-action">
                  <div style={{ display: "flex", gap: 12 }}>
                    <span style={{ fontSize: 18 }}></span>
                    <div>
                      <strong>Sample Questions</strong>
                      <div className="muted">Practice & self-check</div>
                    </div>
                  </div>
                  <span className="chev">›</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 20, color: "#6b7280" }}>
        Tip: Progress updates automatically as you view lessons.
      </div>
    </div>
  );
}

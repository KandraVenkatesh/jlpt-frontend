import React, { useState } from "react";
import { useParams } from "react-router-dom";
import n5ReadingPractice from "../../data/practice/n5_reading";
import n4ReadingPractice from "../../data/practice/n4_reading";
import n3ReadingPractice from "../../data/practice/n3_reading";
import "./reading.css";

/* =========================
   Helper: flatten JLPT-style questions
   ========================= */
function getAllQuestions(set) {
  if (!set) return [];

  let all = [];
  Object.keys(set).forEach(key => {
    if (key.startsWith("mondai") && Array.isArray(set[key])) {
      all = all.concat(set[key]);
    }
  });
  return all;
}

export default function ReadingPractice() {
  const { levelCode } = useParams();

  /* ✅ FIX: choose data by level */
  const readingData =
  levelCode === "N3" ? n3ReadingPractice :
  levelCode === "N4" ? n4ReadingPractice :
  n5ReadingPractice;


  const [activeSet, setActiveSet] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function startSet(set) {
    setActiveSet(set);
    setAnswers({});
    setSubmitted(false);
  }

  function handleSelect(qid, option) {
    setAnswers(prev => ({ ...prev, [qid]: option }));
  }

  function handleSubmit() {
    setSubmitted(true);
  }

  function score() {
    const questions = getAllQuestions(activeSet);
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.answer) correct++;
    });
    return `${correct} / ${questions.length}`;
  }

  /* =========================SET SELECTION SCREEN
     ========================= */
  if (!activeSet) {
    return (
      <div className="reading-page">
        <h1>{levelCode} Reading Practice</h1>
        <p className="muted">Choose a set to start</p>

        <div className="set-grid">
          {readingData.map(set => (
            <div
              key={set.setId}
              className="set-card"
              onClick={() => startSet(set)}
            >
              <h3>{set.title}</h3>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const questions = getAllQuestions(activeSet);
  const mondaiKeys = Object.keys(activeSet)
    .filter(k => k.startsWith("mondai"))
    .sort();

  /* =========================
     PRACTICE SCREEN
     ========================= */
  return (
    <div className="reading-page">
      <button className="back-btn" onClick={() => setActiveSet(null)}>
        ← Back to sets
      </button>

      <h1>{levelCode} Reading Practice</h1>
      <h2>{activeSet.title}</h2>

      <section className="passages-and-questions">
        {activeSet.passages?.map((p, idx) => {
          const mondaiKey = mondaiKeys[idx];
          const mondaiQuestions = activeSet[mondaiKey] || [];

          return (
            <div key={p.id} className="passage-with-questions">
              <div className="passage-block">
                <h3 className="passage-title">{p.title}</h3>
                <pre className="passage-text">{p.text}</pre>
              </div>

              <div className="mondai-section">
                <h4 className="mondai-title">
                  問題 {mondaiKey?.replace("mondai", "")}
                </h4>

                {mondaiQuestions.map(q => (
                  <div key={q.id} className="question-card">
                    <div className="question-text">
                      <strong>{q.number}.</strong> {q.question}
                    </div>

                    <div className="options">
                      {q.options.map(opt => (
                        <label key={opt} className="option">
                          <input
                            type="radio"
                            name={`q-${q.id}`}
                            disabled={submitted}
                            checked={answers[q.id] === opt}
                            onChange={() => handleSelect(q.id, opt)}
                          />
                          <div className="option-box">
                            {opt}

                            {submitted && opt === q.answer && (
                              <span className="correct-mark">✔</span>
                            )}
                            {submitted && opt === answers[q.id] && opt !== q.answer && (
                              <span className="wrong-mark">✖</span>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {!submitted && (
        <button className="submit-btn" onClick={handleSubmit}>
          Submit Answers
        </button>
      )}

      {submitted && (
        <div className="result-box">
          <strong>Your Score:</strong> {score()}
        </div>
      )}
    </div>
  );
}

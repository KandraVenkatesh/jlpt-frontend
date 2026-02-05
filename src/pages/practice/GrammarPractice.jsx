// src/pages/practice/GrammarPractice.jsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./grammarPractice.css";

import n5GrammarPractice from "../../data/practice/n5_grammar";
import n4GrammarPractice from "../../data/practice/n4_grammar";
import n3GrammarPractice from "../../data/practice/n3_grammar";
// later:
// import n3GrammarPractice from "../../data/practice/n3_grammar";

export default function GrammarPractice() {
  const { levelCode } = useParams();

  let sets = [];
  if (levelCode === "N5") sets = n5GrammarPractice;
  if (levelCode === "N4") sets = n4GrammarPractice;
  if( levelCode === "N3") { sets = n3GrammarPractice; }

  const [activeSet, setActiveSet] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function handleSelect(qid, option) {
    if (submitted) return; // lock after submit
    setAnswers(prev => ({ ...prev, [qid]: option }));
  }

  function handleSubmit() {
    setSubmitted(true);
  }

  function resetSet() {
    setAnswers({});
    setSubmitted(false);
    setActiveSet(null);
  }

  function calculateScore() {
    if (!activeSet) return { correct: 0, total: 0 };
    let correct = 0;
    activeSet.questions.forEach(q => {
      if (answers[q.id] === q.answer) correct++;
    });
    return { correct, total: activeSet.questions.length };
  }

  if (!sets.length) {
    return <div className="grammar-page">No grammar practice available for {levelCode}</div>;
  }

  return (
    <div className="grammar-page">
      <h1 className="text-2xl font-bold mb-4">
        {levelCode} Grammar Practice
      </h1>

      {/* STEP 1: SET LIST */}
      {!activeSet && (
        <div className="space-y-4">
          {sets.map(set => (
            <button
              key={set.setId}
              onClick={() => setActiveSet(set)}
              className="block w-full text-left question-card"
            >
              <strong>{set.title}</strong>
              <div className="text-sm text-gray-600">
                {set.questions.length} questions
              </div>
            </button>
          ))}
        </div>
      )}

      {/* STEP 2: QUESTIONS */}
      {activeSet && (
        <div>
          <button
            onClick={resetSet}
            className="mb-4 text-blue-600"
          >
            ← Back to sets
          </button>

          <h2 className="text-xl font-semibold mb-4">
            {activeSet.title}
          </h2>

          <div className="space-y-6">
            {activeSet.questions.map((q, idx) => {
              const userAnswer = answers[q.id];
              const isCorrect = userAnswer === q.answer;

              return (
                <div key={q.id} className="question-card">
                  <div className="question-text">
                    {idx + 1}. {q.question}
                  </div>

                  <div>
                    {q.options.map(opt => (
                      <label key={opt} className="option">
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          value={opt}
                          checked={userAnswer === opt}
                          onChange={() => handleSelect(q.id, opt)}
                          disabled={submitted}
                        />
                        <div className="option-box">
                          <div className="whitespace-pre-wrap break-words">
                            {opt}
                            {submitted && opt === q.answer && (
                              <span className="ml-2 text-green-600">✔</span>
                            )}
                            {submitted && opt === userAnswer && opt !== q.answer && (
                              <span className="ml-2 text-red-600">✖</span>
                            )}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* SUBMIT BUTTON */}
          {!submitted && (
            <button
              onClick={handleSubmit}
              className="submit-btn"
            >
              Submit Answers
            </button>
          )}

          {/* RESULT */}
          {submitted && (() => {
            const { correct, total } = calculateScore();
            return (
              <div className="result-box">
                <div className="big">Score: <strong>{correct} / {total}</strong></div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

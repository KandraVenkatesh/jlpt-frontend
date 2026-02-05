import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./vocabPractice.css";

import n5VocabPractice from "../../data/practice/n5_vocab";
import n4VocabPractice from "../../data/practice/n4_vocab";
import n3VocabPractice from "../../data/practice/n3_vocab";

export default function VocabPractice() {
  const { levelCode } = useParams();

  let sets = [];
  if (levelCode === "N5") sets = n5VocabPractice;
  if (levelCode === "N4") sets = n4VocabPractice;
  if (levelCode === "N3") sets = n3VocabPractice;

  const [activeSet, setActiveSet] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function selectOption(questionId, option) {
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  }

  function submitTest() {
    setSubmitted(true);
  }

  function reset() {
    setActiveSet(null);
    setAnswers({});
    setSubmitted(false);
  }

  function calculateScore() {
    let correct = 0;
    activeSet.questions.forEach(q => {
      if (answers[q.id] === q.answer) correct++;
    });
    return correct;
  }

  // -------------------- UI --------------------

  // 1️⃣ Show SETS
  if (!activeSet) {
    return (
      <div className="vocab-page">
        <h1 className="text-2xl font-bold mb-4">
          {levelCode} Vocabulary Practice
        </h1>

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
      </div>
    );
  }

  // 2️⃣ Show RESULT
  if (submitted) {
    const score = calculateScore();

    return (
      <div className="vocab-page">
        <h2 className="text-xl font-bold mb-4">Result – {activeSet.title}</h2>

        <div className="mb-4">
          <div className="result-box">
            <div className="big">Score: <strong>{score} / {activeSet.questions.length}</strong></div>
          </div>
        </div>

        <div className="space-y-4">
          {activeSet.questions.map(q => {
            const userAns = answers[q.id];
            const correct = userAns === q.answer;
            return (
              <div key={q.id} className={`result-box ${correct ? 'correct' : 'wrong'}`}>
                <div className="font-medium mb-2">{q.question}</div>
                <div>
                  Your answer: <strong style={{ color: correct ? 'green' : 'red' }}>{userAns || 'Not answered'}</strong>
                </div>
                {!correct && (
                  <div className="text-green-700">Correct answer: {q.answer}</div>
                )}
              </div>
            );
          })}
        </div>

        <button onClick={reset} className="mt-6 px-4 py-2 border rounded">Back to Sets</button>
      </div>
    );
  }

  // 3️⃣ Show QUESTIONS
  return (
    <div className="vocab-page">
      <h2 className="text-xl font-bold mb-4">{activeSet.title}</h2>

      {activeSet.questions.map((q, idx) => {
        const userAnswer = answers[q.id];
        const isCorrect = userAnswer === q.answer;

        return (
          <div key={q.id} className="question-card">
            <div className="question-text">
              {idx + 1}. {q.question}
            </div>

            {q.options.map(opt => (
              <label key={opt} className="option">
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  value={opt}
                  checked={userAnswer === opt}
                  onChange={() => selectOption(q.id, opt)}
                  disabled={submitted}
                />
                <div className="option-box">
                  {opt}

                  {submitted && opt === q.answer && (
                    <span className="correct-mark">✔</span>
                  )}
                  {submitted && opt === userAnswer && opt !== q.answer && (
                    <span className="wrong-mark">✖</span>
                  )}
                </div>
              </label>
            ))}
          </div>
        );
      })}

      {!submitted && (
        <button onClick={submitTest} className="submit-btn">
          Submit Answers
        </button>
      )}

      {submitted && (
        <div className="result-box">
          <div className="big">
            Score: <strong>{calculateScore()} / {activeSet.questions.length}</strong>
          </div>
        </div>
      )}
    </div>
  );
}

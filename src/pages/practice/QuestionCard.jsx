import React from "react";

export default function QuestionCard({
  question,
  selected,
  onSelect,
  showResult
}) {
  return (
    <div className="question-card">
      <div className="question-title">
        {question.question}
      </div>

      <div className="options">
        {question.options.map(opt => {
          const isCorrect = opt === question.answer;
          const isSelected = opt === selected;

          return (
            <label
              key={opt}
              className={`option 
                ${showResult && isCorrect ? "correct" : ""}
                ${showResult && isSelected && !isCorrect ? "wrong" : ""}
              `}
            >
              <input
                type="radio"
                name={`q-${question.id}`}
                value={opt}
                disabled={showResult}
                checked={isSelected || false}
                onChange={() => onSelect(question.id, opt)}
              />
              {opt}
            </label>
          );
        })}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { getFavorites } from "../utils/favorites";

export default function Favorites() {
  const [tab, setTab] = useState("vocab"); // vocab | kanji
  const [level, setLevel] = useState("ALL");
  const [vocab, setVocab] = useState([]);
  const [kanji, setKanji] = useState([]);

  useEffect(() => {
    setVocab(getFavorites("vocab"));
    setKanji(getFavorites("kanji"));
  }, []);

  function filterByLevel(items) {
    if (level === "ALL") return items;
    return items.filter(x => x.jlptLevel === level);
  }

  const activeItems =
    tab === "vocab"
      ? filterByLevel(vocab)
      : filterByLevel(kanji);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">⭐ Favorites</h1>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <button onClick={() => setTab("vocab")}>
          📘 Vocab ({vocab.length})
        </button>
        <button onClick={() => setTab("kanji")}>
          漢 Kanji ({kanji.length})
        </button>
      </div>

      {/* Level Filter */}
      <div style={{ marginBottom: 16 }}>
        <select value={level} onChange={e => setLevel(e.target.value)}>
          <option value="ALL">All levels</option>
          <option value="N5">N5</option>
          <option value="N4">N4</option>
          <option value="N3">N3</option>
        </select>
      </div>

      {/* List */}
      {activeItems.length === 0 && (
        <div>No favorites found.</div>
      )}

      <ul style={{ display: "grid", gap: 12 }}>
        {activeItems.map(item => (
          <li key={item.id} className="p-3 border rounded">
            {tab === "vocab" ? (
              <>
                <div className="text-lg font-medium">
                  {item.word} ({item.reading})
                </div>
                {item.romaji && <div>Romaji: {item.romaji}</div>}
                <div>{item.meaning_en}</div>
              </>
            ) : (
              <>
                <div className="text-3xl font-bold">{item.kanji}</div>
                <div>{item.meaning_en}</div>
                <div className="text-sm text-gray-600">
                  On: {item.onyomi || "—"} | Kun: {item.kunyomi || "—"}
                </div>
              </>
            )}
            <div className="text-xs text-gray-500 mt-1">
              Level: {item.jlptLevel}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

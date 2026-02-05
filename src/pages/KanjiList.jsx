import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFavorites, toggleFavorite } from "../utils/favorites";

export default function KanjiList() {
  const { levelCode } = useParams();
  const API = import.meta.env.VITE_API_URL;


  const [kanji, setKanji] = useState([]);
  const [favorites, setFavorites] = useState(() => getFavorites("kanji"));

  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // 🔁 LOAD KANJI
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      try {
        const url = new URL(`${API}/kanji`);
        url.searchParams.set("level", levelCode);
        url.searchParams.set("page", page);
        url.searchParams.set("limit", limit);
        if (query) url.searchParams.set("q", query);

        const res = await fetch(url.toString(), { signal: controller.signal });
        const data = await res.json();

        setKanji(data.items || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } catch (e) {
        if (e.name !== "AbortError") console.error(e);
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [levelCode, page, limit, query]);

  // ⭐ FAVORITE HANDLER (FIX)
  function onToggleFavorite(item) {
    const updated = toggleFavorite("kanji", item);
    setFavorites(updated); // 🔥 forces re-render immediately
  }

  function isFav(id) {
    return favorites.some(f => f.id === id);
  }

  function goto(p) {
    p = Math.max(1, Math.min(totalPages, p));
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-2xl font-bold">{levelCode} Kanji</h1>
          <p className="text-sm text-gray-600">
            Page {page} of {totalPages} — {total} kanji
          </p>
        </div>

        <div className="flex gap-2">
          <input
            placeholder="Search kanji / meaning..."
            value={query}
            onChange={e => { setQuery(e.target.value); setPage(1); }}
            className="p-2 border rounded"
          />
          <select
            value={limit}
            onChange={e => { setLimit(+e.target.value); setPage(1); }}
            className="p-2 border rounded"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={40}>40</option>
          </select>
        </div>
      </div>

      {loading && <div>Loading...</div>}
      {!loading && kanji.length === 0 && <div>No Kanji found.</div>}

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {kanji.map(k => (
          <div key={k.id} className="p-4 border rounded bg-white shadow-sm">
            <div className="flex justify-between items-start">
              <div className="text-4xl font-bold">{k.kanji}</div>

              {/* ⭐ FAVORITE BUTTON */}
              <button
                onClick={() => onToggleFavorite(k)}
                style={{
                  fontSize: "22px",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  color: isFav(k.id) ? "#facc15" : "#9ca3af",
                  transition: "transform 0.15s ease",
                }}
                onMouseDown={e => e.currentTarget.style.transform = "scale(1.2)"}
                onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
              >
                {isFav(k.id) ? "⭐" : "☆"}
              </button>
            </div>

            <div className="mt-2 text-sm"><b>Meaning:</b> {k.meaning_en}</div>
            <div className="text-sm"><b>On:</b> {k.onyomi || "—"}</div>
            <div className="text-sm"><b>Kun:</b> {k.kunyomi || "—"}</div>

            {k.example && (
              <div className="text-sm text-indigo-700 mt-2">
                <b>Example:</b> {k.example}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between mt-6">
        <button onClick={() => goto(1)} disabled={page === 1}>First</button>
        <button onClick={() => goto(page - 1)} disabled={page === 1}>Prev</button>

        <span>Page {page} / {totalPages}</span>

        <button onClick={() => goto(page + 1)} disabled={page === totalPages}>Next</button>
        <button onClick={() => goto(totalPages)} disabled={page === totalPages}>Last</button>
      </div>
    </div>
  );
}

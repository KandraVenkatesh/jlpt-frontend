import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function GrammarList() {
  const { levelCode } = useParams();
  const API = import.meta.env.VITE_API_URL;


  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(
          `${API}/grammar?level=${levelCode}&page=${page}&limit=${limit}`
        );
        const j = await res.json();

        setItems(j.items || []);
        setTotal(j.total || 0);
        setTotalPages(j.totalPages || 1);
      } catch (err) {
        console.error(err);
        setItems([]);
      }
      setLoading(false);
    }

    load();
  }, [levelCode, page, limit]);

  function goto(p) {
    if (p < 1) p = 1;
    if (p > totalPages) p = totalPages;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-baseline">
        <h1 className="text-2xl font-bold">{levelCode} Grammar</h1>
        <div className="text-sm text-gray-600">
          Page {page} of {totalPages} — {total} items
        </div>
      </div>

      {loading && <div>Loading...</div>}

      {!loading && items.length === 0 && (
        <div>No grammar points found.</div>
      )}

      <ul className="space-y-4">
        {items.map((g) => (
          <li key={g.id} className="p-4 border rounded bg-white">
            <div className="flex justify-between">
              <div>
                <div className="text-xl font-semibold">{g.grammar}</div>

                <div className="text-sm text-gray-700 mt-1">
                  <strong>Meaning:</strong> {g.meaning_en}
                </div>

                {g.structure && (
                  <div className="text-sm text-gray-700 mt-1">
                    <strong>Structure:</strong> {g.structure}
                  </div>
                )}

                {g.explanation && (
                  <div className="text-sm text-gray-700 mt-1">
                    <strong>Explanation:</strong> {g.explanation}
                  </div>
                )}

                {g.example && (
                  <div className="text-sm text-indigo-700 mt-2">
                    <strong>Example:</strong> {g.example}
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-500">{g.jlptLevel}</div>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="flex gap-2">
          <button
            onClick={() => goto(1)}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            First
          </button>
          <button
            onClick={() => goto(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span>Page</span>
          <input
            type="number"
            className="w-16 border rounded p-1"
            value={page}
            onChange={(e) => goto(Number(e.target.value))}
            min="1"
            max={totalPages}
          />
          <span>of {totalPages}</span>
        </div>

        <div className="flex gap-3">
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="p-1 border rounded"
          >
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>

          <button
            onClick={() => goto(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
          <button
            onClick={() => goto(totalPages)}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
}

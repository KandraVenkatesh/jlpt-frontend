// src/pages/VocabList.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFavorites, isFavorite as isFavoriteUtil, toggleFavorite as toggleFavoriteUtil } from '../utils/favorites';
import { markViewed } from '../utils/progress';

export default function VocabList(){
  const { levelCode } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const API = import.meta.env.VITE_API_URL;


  // favorites state (keeps local copy to trigger re-renders)
  const [favorites, setFavorites] = useState(() => getFavorites('vocab'));

  // normalize a single item (ensures romaji and other fields exist)
  function normalizeItem(x) {
    return {
      id: x.id,
      word: x.word || '',
      reading: x.reading || '',
      romaji: x.romaji || x.romanji || x.translit || '',
      meaning_en: x.meaning_en || x.meaning || '',
      exampleSentence: x.exampleSentence || x.example || x.example_sentence || '',
      jlptLevel: x.jlptLevel || x.level || (levelCode || 'N5'),
      ...x
    };
  }

  // normalize incoming server payload to an array of items
  function normalizeResponse(j) {
    if (!j) return { items: [], total: 0, totalPages: 1, page: 1, limit };

    // if server returned an array directly, map & normalize it
    if (Array.isArray(j)) {
      const normalized = j.map(normalizeItem);
      return {
        items: normalized,
        total: normalized.length,
        totalPages: Math.max(1, Math.ceil(normalized.length / limit)),
        page,
        limit
      };
    }

    // expected { items, page, total, totalPages, limit } shape
    const itemsRaw = j.items || j;
    const normalized = (itemsRaw || []).map(normalizeItem);
    return {
      items: normalized,
      total: j.total || normalized.length,
      totalPages: j.totalPages || Math.max(1, Math.ceil((j.total || normalized.length) / (j.limit || limit))),
      page: j.page || page,
      limit: j.limit || limit
    };
  }

  function isFavorite(id) {
    return isFavoriteUtil('vocab', id);
  }

  function toggleFavorite(item) {
    const updated = toggleFavoriteUtil('vocab', item);
    setFavorites(updated);
  }

  useEffect(()=> {
    async function load(){
      setLoading(true);
      try {
        const res = await fetch(`${API}/vocab?level=${encodeURIComponent(levelCode)}&page=${page}&limit=${limit}`);
        const j = await res.json();
        const out = normalizeResponse(j);

        setItems(out.items || []);
        setTotal(out.total || 0);
        setTotalPages(out.totalPages || 1);
        // keep page in sync (only if returned)
        if (out.page) setPage(out.page);
      } catch(e){
        console.error(e);
        setItems([]);
        setTotal(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelCode, page, limit]);

  // mark viewed progress for items when they change
  useEffect(() => {
    if (!items || items.length === 0) return;

    items.forEach(v => {
      if (v.id && v.jlptLevel) {
        markViewed("vocab", v.jlptLevel, v.id);
      }
    });
  }, [items]);

  function goto(p){
    if (p < 1) p = 1;
    if (p > totalPages) p = totalPages;
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div>
      <div className="flex items-baseline justify-between mb-4">
        <h1 className="text-2xl font-bold">{levelCode} Vocabulary</h1>
        <div className="text-sm text-gray-600">Showing page {page} of {totalPages} — {total} words</div>
      </div>

      {loading && <div>Loading...</div>}

      {!loading && items.length === 0 && <div>No vocab found.</div>}

      <ul className="space-y-3 mb-6">
        {items.map(v => (
          
          <li key={v.id} className="p-3 border rounded bg-white dark:bg-[#071a2b]/70">
            <div className="flex justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="text-lg font-medium truncate">
                  {v.word} <span className="text-sm text-gray-600 dark:text-gray-300">({v.reading || '—'})</span>
                  <div className="mt-3">
                  <button
                    onClick={() => toggleFavorite(v)}
                    className="text-lg"
                    title="Save"
                  >
                    {isFavorite(v.id) ? "⭐" : "☆"}
                  </button>
                </div>
                </div>
                

                {/* Romaji (if available) */}
                {v.romaji ? (
                  <div className="text-sm text-gray-500 truncate">
                    Romaji: <span className="font-medium text-gray-700 dark:text-gray-200">{v.romaji}</span>
                  </div>
                ) : null}

                <div className="text-sm text-gray-700 dark:text-gray-200 mt-1">{v.meaning_en}</div>

                { (v.exampleSentence || v.example || v.example_sentence) && (
                  <div className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">
                    <strong>Example:</strong> {v.exampleSentence || v.example || v.example_sentence}
                  </div>
                )}
                
              </div>

              <div className="flex-shrink-0 ml-4 text-right">
                <div className="text-xs text-gray-500">{v.jlptLevel}</div>
                
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          <button onClick={()=>goto(1)} disabled={page===1} className="px-3 py-1 border rounded disabled:opacity-50">First</button>
          <button onClick={()=>goto(page-1)} disabled={page===1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
        </div>

        <div className="flex items-center gap-2">
          <span>Page</span>
          <input
            type="number"
            value={page}
            onChange={e => goto(Number(e.target.value || 1))}
            className="w-16 p-1 border rounded"
            min={1}
            max={totalPages}
          />
          <span>of {totalPages}</span>
        </div>

        <div className="flex gap-3">
          <select value={limit} onChange={e => { setLimit(Number(e.target.value)); setPage(1); }} className="p-1 border rounded">
            <option value={10}>10 / page </option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
          </select>
          <button onClick={()=>goto(page+1)} disabled={page===totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
          <button onClick={()=>goto(totalPages)} disabled={page===totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Last</button>
        </div>
      </div>
    </div>
  );
}

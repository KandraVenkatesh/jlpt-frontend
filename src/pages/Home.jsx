import React, { useEffect, useState, useRef } from 'react';
import About from '../components/About';
import './levels.css';

export default function Home() {
  const [vocab, setVocab] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    word: '',
    reading: '',
    romaji: '',
    meaning_en: '',
    jlptLevel: 'N5'
  });
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState('ALL'); // ALL, N5, N4, N3
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const API = 'http://localhost:5000/api';
  const MAX_INITIAL = 0;

  const debounceRef = useRef(null);

  // -------------------------
  // Helper
  // -------------------------
  function normalizeVocab(data) {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return data.items || [];
  }

  // -------------------------
  // Fetch vocab
  // -------------------------
  async function fetchVocab({ q = '', lvl = 'ALL' } = {}) {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (q && q.trim() !== '') params.set('q', q.trim());
      if (lvl && lvl !== 'ALL') params.set('level', lvl);

      const url =
        `${API}/vocab` +
        (params.toString() ? `?${params.toString()}` : '');

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch');

      const data = await res.json();
      setVocab(normalizeVocab(data));
    } catch (e) {
      console.error(e);
      setError('Unable to load vocab — try again.');
    } finally {
      setLoading(false);
    }
  }

  // -------------------------
  // Initial load
  // -------------------------
  useEffect(() => {
    fetchVocab({ q: '', lvl: 'ALL' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------
  // Debounced search
  // -------------------------
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setShowAll(false);
      fetchVocab({ q: query, lvl: level });
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, level]);

  function clearFilters() {
    setQuery('');
    setLevel('ALL');
  }

  const isFiltered =
    (query && query.trim() !== '') || (level && level !== 'ALL');

  const itemsToRender = isFiltered
    ? vocab
    : showAll
    ? vocab
    : vocab.slice(0, MAX_INITIAL);

  // -------------------------
  // UI
  // -------------------------
  return (
    <div className="space-y-6">

      {/* =========================
         SEARCH & FILTER
         ========================= */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <h2 className="text-xl font-semibold" style={{ marginBottom: 10 }}>
            Search & Filter Vocabulary
          </h2>

          <input
            placeholder="Search word, reading, meaning..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="p-2 border rounded"
            style={{
              width: '60%',
              padding: '12px 16px',
              borderRadius: '12px',
              fontSize: '16px',
              marginBottom: '12px'
            }}
          />

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 12,
              marginTop: 10
            }}
          >
            <button
              onClick={() => setLevel('ALL')}
              className="btn-small"
              style={{
                borderColor:
                  level === 'ALL' ? 'rgba(37,99,235,0.45)' : undefined
              }}
            >
              All
            </button>

            <button
              onClick={() => setLevel('N5')}
              className="btn-small"
              style={{
                borderColor:
                  level === 'N5' ? 'rgba(37,99,235,0.45)' : undefined
              }}
            >
              N5
            </button>

            <button
              onClick={() => setLevel('N4')}
              className="btn-small"
              style={{
                borderColor:
                  level === 'N4' ? 'rgba(37,99,235,0.45)' : undefined
              }}
            >
              N4
            </button>

            <button
              onClick={() => setLevel('N3')}
              className="btn-small"
              style={{
                borderColor:
                  level === 'N3' ? 'rgba(37,99,235,0.45)' : undefined
              }}
            >
              N3
            </button>

            <button onClick={clearFilters} className="btn-small">
              Clear
            </button>
          </div>
        </div>

        {error && <div className="muted">{error}</div>}
        {loading && <div>Loading...</div>}
        {!loading && vocab.length === 0 && <div>No vocab found.</div>}

        <ul className="space-y-3">
          {itemsToRender.map(v => (
            <li key={v.id} className="p-3 border rounded">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 12
                }}
              >
                <div>
                  <div className="text-lg font-medium">
                    {v.word}{' '}
                    <span className="text-sm text-gray-600">
                      ({v.reading})
                    </span>
                  </div>
                  <div className="text-sm text-gray-700">
                    {v.meaning_en}
                  </div>
                  <div className="text-xs text-gray-500">
                    Level: {v.jlptLevel}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* =========================
         ABOUT SECTION (HOME ONLY)
         ========================= */}
      <About />

    </div>
  );
}

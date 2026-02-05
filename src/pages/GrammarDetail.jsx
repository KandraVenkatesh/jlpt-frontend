// src/pages/GrammarDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
const API = 'http://localhost:5000/api';

export default function GrammarDetail(){
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`${API}/grammar?page=1&limit=1&q=&id=${id}`); // server doesn't support id filter by default, fallback:
        // if the server doesn't accept id param, get level N5 with large limit and find item
        const j = await res.json();
        let arr = Array.isArray(j) ? j : (j.items || []);
        // try find by id
        let found = arr.find(x => String(x.id) === String(id));
        if (!found) {
          // fallback: fetch combined and search (small cost)
          const r2 = await fetch(`${API}/grammar?limit=1000`);
          const j2 = await r2.json();
          const arr2 = Array.isArray(j2) ? j2 : (j2.items || []);
          found = arr2.find(x => String(x.id) === String(id));
        }
        setItem(found || null);
      } catch(e) {
        console.error(e);
        setItem(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!item) return <div className="muted">Grammar not found.</div>;

  return (
    <div className="space-y-4">
      <Link to={`/levels/${item.jlptLevel || 'N5'}`} className="text-sm underline">← Back</Link>

      <div className="app-card p-6">
        <h1 className="text-2xl font-bold">{item.grammar}</h1>
        <div className="text-sm muted mt-1">{item.meaning_en}</div>

        <div className="mt-4">
          <h3 className="font-semibold">Structure / Explanation</h3>
          <p className="mt-1">{item.structure || item.explanation || '—'}</p>
        </div>

        {item.example && (
          <div className="mt-4">
            <h3 className="font-semibold">Example</h3>
            <p className="mt-1 text-indigo-600">{item.example}</p>
          </div>
        )}

        <div className="mt-4 text-xs muted">Level: {item.jlptLevel}</div>
      </div>
    </div>
  );
}

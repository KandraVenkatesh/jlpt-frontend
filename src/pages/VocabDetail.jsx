import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function VocabDetail(){
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const API = import.meta.env.VITE_API_URL;


  useEffect(()=>{
    async function load(){
      setLoading(true);
      try{
        const res = await fetch(`${API}/vocab`);
        const arr = await res.json();
        const found = arr.find(x => String(x.id) === String(id));
        setItem(found || null);
      }catch(e){
        console.error(e);
      }finally{
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!item) return <div className="muted">Vocabulary not found.</div>;

  return (
    <div>
      <Link to={`/levels/${item.jlptLevel}`} className="btn-small">Back</Link>
      <h1 className="text-2xl font-bold" style={{marginTop:12}}>{item.word}</h1>
      <div className="muted" style={{marginTop:6}}>{item.reading}</div>
      <p style={{marginTop:12}}>{item.meaning_en}</p>

      {item.exampleSentence && (
        <div style={{marginTop:12}}>
          <div className="text-sm font-semibold">Example</div>
          <div className="muted">{item.exampleSentence}</div>
        </div>
      )}
    </div>
  );
}

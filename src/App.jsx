  import React, { useEffect } from 'react';
  import { Routes, Route } from 'react-router-dom';
  import Favorites from "./pages/Favorites";
  import NavBar from './components/NavBar';
  import PracticeHub from "./pages/PracticeHub";
  import VocabPractice from "./pages/practice/VocabPractice";
  import GrammarPractice from "./pages/practice/GrammarPractice";
  import ReadingPractice from "./pages/practice/ReadingPractice";


  // pages
  import GrammarDetail from './pages/GrammarDetail';
  import Home from './pages/Home';
  import Levels from './pages/Levels';
  import VocabList from './pages/VocabList';
  import VocabDetail from './pages/VocabDetail';
  import KanjiList from './pages/KanjiList';
  import GrammarList from './pages/GrammarList';

  import { initTotals } from './utils/initTotals';

  export default function App(){
    useEffect(() => {
      initTotals();
    }, []);
    return (
      <div className="min-h-screen">
        <header className="bg-white shadow p-4">
          <div className="max-w-4xl mx-auto">
            <NavBar />
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/levels" element={<Levels />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/levels/:levelCode/practice" element={<PracticeHub />} />

            {/* level-specific pages */}
            <Route path="/levels/:levelCode/vocab" element={<VocabList />} />
            <Route path="/levels/:levelCode/kanji" element={<KanjiList />} />
            <Route path="/levels/:levelCode/grammar" element={<GrammarList />} />
            <Route
              path="/levels/:levelCode/practice/vocab"
              element={<VocabPractice />}
            />

            <Route
              path="/levels/:levelCode/practice/grammar"
              element={<GrammarPractice />}
            />

            <Route
              path="/levels/:levelCode/practice/reading"
              element={<ReadingPractice />}
            />
            <Route path="/grammar/:id" element={<GrammarDetail />} />
            {/* for backward compatibility if you click an old link */}
            <Route path="/levels/:levelCode" element={<VocabList />} />

            {/* vocab detail */}
            <Route path="/vocab/:id" element={<VocabDetail />} />

            {/* fallback */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </div>
    );
  }

// src/components/About.jsx
import { Link } from "react-router-dom";

import React from 'react';
import './About.css';

export default function About() {
  return (
    <>
      <style>{`
        .about-author {
          text-align: center;
          margin-top: 3rem;
          font-size: 0.95rem;
          color: #666;
        }

        .about-social {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 1rem;
          padding-bottom: 2rem;
        }

        .about-social a {
          color: #0066cc;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .about-social a:hover {
          color: #004499;
          text-decoration: underline;
        }
      `}</style>

      <section className="about-root" aria-labelledby="about-heading">
        <div className="about-inner">
          <div className="about-left">
            <div className="about-badge">日</div>
          </div>

          <div className="about-right">
            <h2 id="about-heading" className="about-title">About Japaneasy</h2>
            <p className="about-lead">
              Japaneasy helps you prepare for the JLPT with focused vocabulary, kanji and grammar lessons.
              Short examples, clear readings and paginated lists make study calm and effective.
            </p>

            <div className="about-grid">
              <div className="about-item">
                <h3>Curated content</h3>
                <p>Vocabulary and kanji are grouped by JLPT level (N5–N3). Each item includes reading, romaji, meaning and example sentences.</p>
              </div>

              <div className="about-item">
                <h3>Practice features</h3>
                <p>Paginated lists, search & filters, and quick quizzes help you drill efficiently.</p>
              </div>

              <div className="about-item">
                <h3>Progress-friendly</h3>
                <p>Small pages, clear navigation and level-based cards let you focus on just the right amount of content.</p>
              </div>
            </div>

            <div className="about-cta">
              <Link to="/levels" className="about-cta-button">Start learning — Open levels</Link>
              <span className="about-note">Free, offline seed data; expand with your own vocab later.</span>
            </div>
          </div>
        </div>

        <p className="about-author">Created by Kandra Venkatesh</p>
        <div className="about-social">
          <a href="https://github.com/KandraVenkatesh" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://linkedin.com/in/kandra-venkatesh-702250184" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </section>
    </>
  );
}
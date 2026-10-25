import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Playground from './pages/Playground.jsx';
import Learn from './pages/Learn.jsx';
import Examples from './pages/Examples.jsx';
import LanguageReference from './pages/LanguageReference.jsx';
import About from './pages/About.jsx';

import { getStoredTheme, saveStoredTheme } from './utils/storage.js';
import './styles/global.css';
import './styles/components.css';
import './styles/pages.css';

export default function App() {
  const [theme, setTheme] = useState(() => getStoredTheme('dark'));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    saveStoredTheme(theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar theme={theme} onToggleTheme={handleToggleTheme} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/examples" element={<Examples />} />
            <Route path="/reference" element={<LanguageReference />} />
            <Route path="/about" element={<About />} />
            {/* Catch-all route redirects to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

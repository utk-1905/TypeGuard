import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Terminal, BookOpen, Layers, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-brand-title">
              <ShieldCheck size={20} className="text-purple" />
              <span>TypeGuard</span>
            </div>
            <p className="footer-brand-desc">
              Static Type Checking System for a Mini Programming Language.
              An interactive compiler playground designed for education and verification.
            </p>
            <div className="footer-tagline">
              <span>Write. Analyze. Understand.</span>
            </div>
          </div>

          <div className="footer-nav-col">
            <h4>Compiler Stages</h4>
            <ul>
              <li><Link to="/playground">Lexical Analysis (Scanner)</Link></li>
              <li><Link to="/playground">Syntax Analysis (Parser)</Link></li>
              <li><Link to="/playground">AST Hierarchy</Link></li>
              <li><Link to="/playground">Symbol Table Generation</Link></li>
              <li><Link to="/playground">Static Type Checking</Link></li>
            </ul>
          </div>

          <div className="footer-nav-col">
            <h4>Learning & Docs</h4>
            <ul>
              <li><Link to="/learn">Compiler Theory Guide</Link></li>
              <li><Link to="/examples">Curated Preset Programs</Link></li>
              <li><Link to="/reference">Mini Language Grammar</Link></li>
              <li><Link to="/reference">Type Compatibility Matrix</Link></li>
              <li><Link to="/about">Academic Project Info</Link></li>
            </ul>
          </div>

          <div className="footer-nav-col">
            <h4>Academic Info</h4>
            <ul>
              <li><strong>Subject:</strong> Compiler Design (Sem 7)</li>
              <li><strong>Project:</strong> CD Mini Project</li>
              <li><strong>Engine:</strong> Pure Client-Side JavaScript</li>
              <li><strong>Verification:</strong> 25 Automated Vitest Cases</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} TypeGuard. Built for Compiler Design Mini Project.</p>
          <div className="footer-links">
            <Link to="/reference">Grammar Spec v1.0</Link>
            <span>•</span>
            <Link to="/about">System Architecture</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

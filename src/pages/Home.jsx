import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Play,
  Layers,
  Search,
  GitBranch,
  Database,
  AlertTriangle,
  ArrowRight,
  Terminal,
  CheckCircle2,
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function Home() {
  const steps = [
    { num: '01', title: 'Write Source Code', desc: 'Enter programs in our custom typed mini-language with int, float, string, and bool variables.' },
    { num: '02', title: 'Scan Lexical Tokens', desc: 'The lexer tokenizes characters into keywords, identifiers, literals, and operators with exact line and column coordinates.' },
    { num: '03', title: 'Validate Syntax (AST)', desc: 'A recursive-descent parser validates statement grammar and constructs a hierarchical Abstract Syntax Tree.' },
    { num: '04', title: 'Construct Symbol Table', desc: 'Tracks identifier scopes, declared types, initialization status, and simulated memory offsets.' },
    { num: '05', title: 'Check Static Types', desc: 'Applies rigorous semantic rules to ensure operand compatibility, valid assignments, and type safety before execution.' },
    { num: '06', title: 'Review Diagnostics', desc: 'Inspect comprehensive diagnostics with error codes, expected vs actual types, and actionable fix suggestions.' }
  ];

  const features = [
    {
      icon: Search,
      title: 'Lexical Analysis',
      desc: 'Transforms raw code into structured tokens with lexeme, type category, line, and column coordinates.'
    },
    {
      icon: GitBranch,
      title: 'Syntax Analysis & AST',
      desc: 'Validates language grammar, enforces operator precedence, and builds an Abstract Syntax Tree.'
    },
    {
      icon: Database,
      title: 'Scoped Symbol Table',
      desc: 'Registers identifiers, tracks declared types, enforces single-declaration rules, and calculates memory layouts.'
    },
    {
      icon: ShieldCheck,
      title: 'Static Type Checking',
      desc: 'Identifies incompatible types, invalid arithmetic, illegal logical operands, and undeclared variables before runtime.'
    },
    {
      icon: AlertTriangle,
      title: 'Educational Diagnostics',
      desc: 'Provides student-friendly explanations of why each type violation occurred, paired with precise location markers.'
    },
    {
      icon: Layers,
      title: 'Compiler Pipeline Visualizer',
      desc: 'Follow the compilation journey across each stage, from source code to Intermediate Three-Address Code.'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-badge">
            <Sparkles size={14} className="text-purple" />
            <span>Compiler Design Mini Project • Sem 7</span>
          </div>

          <h1 className="hero-title">
            TypeGuard
          </h1>
          <h2 className="hero-tagline">
            Write. Analyze. Understand.
          </h2>

          <p className="hero-description">
            An interactive static type-checking playground that helps you understand how a compiler analyzes source code, builds symbol tables, and detects type errors before execution.
          </p>

          <div className="hero-cta-group">
            <Link to="/playground" className="btn btn-primary btn-lg">
              <Play size={18} />
              <span>Open Playground</span>
            </Link>
            <Link to="/examples" className="btn btn-secondary btn-lg">
              <Layers size={18} />
              <span>Explore Examples</span>
            </Link>
          </div>

          {/* Hero Visual: Interactive Compiler Preview */}
          <div className="hero-preview-window">
            <div className="preview-window-header">
              <div className="window-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <span className="window-title font-mono">typeguard-interactive-preview.tg</span>
              <span className="badge badge-success text-xs font-mono">Status: Type-Safe</span>
            </div>

            <div className="preview-window-body">
              <div className="preview-code-pane font-mono">
                <div className="preview-line"><span className="ln">1</span><span className="keyword">int</span> <span className="id">score</span> = <span className="num">90</span>;</div>
                <div className="preview-line"><span className="ln">2</span><span className="keyword">int</span> <span className="id">bonus</span> = <span className="num">10</span>;</div>
                <div className="preview-line"><span className="ln">3</span><span className="keyword">int</span> <span className="id">total</span> = <span className="id">score</span> + <span className="id">bonus</span>;</div>
                <div className="preview-line"><span className="ln">4</span></div>
                <div className="preview-line"><span className="ln">5</span><span className="keyword">string</span> <span className="id">user</span> = <span className="str">"Utkarsh"</span>;</div>
                <div className="preview-line"><span className="ln">6</span><span className="keyword">print</span>(<span className="id">user</span>);</div>
                <div className="preview-line"><span className="ln">7</span><span className="keyword">print</span>(<span className="id">total</span>);</div>
              </div>

              <div className="preview-result-pane">
                <div className="preview-card">
                  <div className="preview-card-header">
                    <ShieldCheck size={16} className="text-success" />
                    <span>Type Inference Trace</span>
                  </div>
                  <div className="preview-infer-item font-mono">
                    <span>score + bonus</span>
                    <span className="badge badge-success text-xs">int</span>
                  </div>
                  <div className="preview-infer-item font-mono">
                    <span>print(total)</span>
                    <span className="badge badge-success text-xs">void</span>
                  </div>
                </div>

                <div className="preview-card">
                  <div className="preview-card-header">
                    <Database size={16} className="text-accent" />
                    <span>Symbol Table Snapshot</span>
                  </div>
                  <div className="preview-symbol-item font-mono">
                    <span className="text-accent">score</span>
                    <span className="text-muted">: int (+0B)</span>
                  </div>
                  <div className="preview-symbol-item font-mono">
                    <span className="text-accent">user</span>
                    <span className="text-muted">: string (+8B)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="section-container">
        <div className="section-header text-center">
          <span className="section-subtitle">Comprehensive Compiler Analysis</span>
          <h2 className="section-title">Built Ground-Up for Technical Understanding</h2>
          <p className="section-desc">
            TypeGuard executes genuine compiler algorithms in your browser. Every token, AST node, symbol entry, and diagnostic is derived directly from user source code.
          </p>
        </div>

        <div className="features-grid">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="feature-card">
                <div className="feature-icon-wrapper">
                  <Icon size={22} className="feature-icon" />
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="section-container section-secondary">
        <div className="section-header text-center">
          <span className="section-subtitle">Compiler Architecture</span>
          <h2 className="section-title">How TypeGuard Analyzes Your Code</h2>
          <p className="section-desc">
            A step-by-step walk-through of the six stages that transform raw characters into statically verified programs.
          </p>
        </div>

        <div className="steps-grid">
          {steps.map((s) => (
            <div key={s.num} className="step-card">
              <span className="step-number font-mono">{s.num}</span>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Project Purpose & Educational Callout */}
      <section className="section-container">
        <div className="purpose-card">
          <div className="purpose-content">
            <span className="purpose-badge">Educational Objective</span>
            <h2>Demystifying Semantic Analysis & Type Systems</h2>
            <p>
              In traditional Compiler Design coursework, students study lexical scanning, context-free grammars, and syntax-directed definitions (SDD) in textbooks. TypeGuard bridges theory and practice by turning abstract type rules into an interactive developer experience where every error is accompanied by its theoretical rule and actionable fix.
            </p>
            <div className="purpose-actions">
              <Link to="/learn" className="btn btn-secondary">
                <BookOpen size={16} />
                <span>Read Compiler Theory Guide</span>
              </Link>
              <Link to="/reference" className="btn btn-outline">
                <span>View Language Grammar</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta-section">
        <div className="cta-container text-center">
          <h2>Ready to experiment with static type checking?</h2>
          <p>Load preset programs, trigger intentional type mismatches, and inspect the real-time symbol table.</p>
          <Link to="/playground" className="btn btn-primary btn-lg">
            <Play size={18} />
            <span>Launch TypeGuard Playground</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

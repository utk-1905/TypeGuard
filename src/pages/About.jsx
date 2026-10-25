import React from 'react';
import {
  ShieldCheck,
  User,
  GraduationCap,
  Building,
  Terminal,
  Cpu,
  CheckCircle2,
  FileCode,
  Layers,
  Sparkles
} from 'lucide-react';

export default function About() {
  return (
    <div className="about-page section-container">
      {/* Header */}
      <div className="page-header text-center">
        <span className="section-subtitle">Academic Mini Project • Sem 7</span>
        <h1 className="page-title">About TypeGuard</h1>
        <p className="page-desc">
          Static Type Checking System for a Mini Programming Language — A browser-based interactive compiler architecture developed for the Compiler Design course.
        </p>
      </div>

      {/* Academic & Student Details Card */}
      <section className="about-section">
        <div className="student-profile-card panel">
          <div className="profile-header">
            <div className="profile-icon-wrapper">
              <GraduationCap size={28} className="text-purple" />
            </div>
            <div>
              <h2 className="profile-title">Academic Credentials & Submission Details</h2>
              <span className="text-secondary text-sm">Compiler Design Course Project Submission</span>
            </div>
          </div>

          <div className="profile-details-grid">
            <div className="profile-details-grid">
              {/* Student 1 */}
              <div className="profile-item">
                <span className="profile-label">Student Developer 1</span>
                <span className="profile-val font-semibold text-primary">
                  Utkarsh Sharma
                </span>
              </div>

              <div className="profile-item">
                <span className="profile-label">Enrollment Number</span>
                <span className="profile-val font-mono">202307020109</span>
              </div>

              <div className="profile-item">
                <span className="profile-label">KU ID</span>
                <span className="profile-val font-mono font-bold text-accent">
                  23BTAI55
                </span>
              </div>

              {/* Student 2 */}
              <div className="profile-item">
                <span className="profile-label">Student Developer 2</span>
                <span className="profile-val font-semibold text-primary">
                  Shaurya Agarwal
                </span>
              </div>

              <div className="profile-item">
                <span className="profile-label">Enrollment Number</span>
                <span className="profile-val font-mono">202307020110</span>
              </div>

              <div className="profile-item">
                <span className="profile-label">KU ID</span>
                <span className="profile-val font-mono font-bold text-accent">
                  23BTAI56
                </span>
              </div>

              {/* Student 3 */}
              <div className="profile-item">
                <span className="profile-label">Student Developer 3</span>
                <span className="profile-val font-semibold text-primary">
                  Poojan Shihora
                </span>
              </div>

              <div className="profile-item">
                <span className="profile-label">Enrollment Number</span>
                <span className="profile-val font-mono">202307020111</span>
              </div>

              <div className="profile-item">
                <span className="profile-label">KU ID</span>
                <span className="profile-val font-mono font-bold text-accent">
                  23BTAI57
                </span>
              </div>

              {/* Academic Details */}
              <div className="profile-item">
                <span className="profile-label">Academic Program & Semester</span>
                <span className="profile-val">B.Tech AIML • Semester 7</span>
              </div>

              <div className="profile-item">
                <span className="profile-label">Course Subject</span>
                <span className="profile-val font-semibold">
                  Compiler Design (Theory & Lab)
                </span>
              </div>

              <div className="profile-item">
                <span className="profile-label">Faculty Project Guide</span>
                <span className="profile-val">Neha Minocha</span>
              </div>

              <div className="profile-item">
                <span className="profile-label">Department & University</span>
                <span className="profile-val">
                  AIML Department
                  <br />
                  Unitedworld Institute of Technology
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Overview & Problem Statement */}
      <section className="about-section">
        <div className="about-two-col">
          <div className="about-text-card panel">
            <h3 className="section-heading">Problem Statement</h3>
            <p>
              In traditional software development, dynamically typed languages often allow subtle type mismatches to go undetected until code paths are executed in production, causing runtime crashes and unpredictable state mutations.
            </p>
            <p className="mt-2">
              Furthermore, computer science students frequently find compiler theory abstract when studied solely through textbook diagrams. There is a strong need for an interactive pedagogical tool that makes lexical analysis, AST construction, symbol tables, and static semantic checks transparent and actionable.
            </p>
          </div>

          <div className="about-text-card panel">
            <h3 className="section-heading">Primary Objectives</h3>
            <ul className="bullet-list">
              <li>Design a custom strongly typed mini-programming language with primitive types (<code>int</code>, <code>float</code>, <code>string</code>, <code>bool</code>).</li>
              <li>Implement a complete compiler frontend: lexer, recursive-descent parser, AST builder, symbol table, and static type checker.</li>
              <li>Provide an interactive IDE playground with real-time token inspections, symbol tables, and visual expression inference traces.</li>
              <li>Formulate student-friendly diagnostics explaining the theoretical basis of each error with suggested fixes.</li>
              <li>Validate compiler engine correctness with 25 automated Vitest test cases.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* System Architecture & Technology Stack */}
      <section className="about-section">
        <h2 className="section-title">System Architecture & Technology Stack</h2>
        <div className="tech-stack-grid">
          <div className="tech-card panel">
            <div className="tech-icon-wrapper">
              <Cpu size={24} className="text-purple" />
            </div>
            <h4>Compiler Core Engine</h4>
            <p className="text-secondary text-xs mt-1">
              Pure client-side JavaScript implementation featuring modular Lexer, Parser, AST Generator, Scoped Symbol Table, and Semantic Type Checker.
            </p>
          </div>

          <div className="tech-card panel">
            <div className="tech-icon-wrapper">
              <Layers size={24} className="text-accent" />
            </div>
            <h4>Frontend UI Architecture</h4>
            <p className="text-secondary text-xs mt-1">
              Built with React 19 and Vite 6 for rapid HMR and sub-second builds. Styled with a dark-first developer theme and custom scrollbars.
            </p>
          </div>

          <div className="tech-card panel">
            <div className="tech-icon-wrapper">
              <Terminal size={24} className="text-success" />
            </div>
            <h4>Testing & Verification</h4>
            <p className="text-secondary text-xs mt-1">
              Vitest test suite covering 25 formal compiler criteria: keywords, identifiers, literals, operator precedence, type mismatches, and undeclared identifiers.
            </p>
          </div>
        </div>
      </section>

      {/* Future Enhancements */}
      <section className="about-section">
        <div className="future-card panel">
          <h3 className="section-heading">Future Enhancements</h3>
          <div className="future-grid">
            <div className="future-item">
              <CheckCircle2 size={16} className="text-purple" />
              <span>User-defined function prototypes and multi-parameter arity validation</span>
            </div>
            <div className="future-item">
              <CheckCircle2 size={16} className="text-purple" />
              <span>Hierarchical nested block scoping with lexical shadowing analysis</span>
            </div>
            <div className="future-item">
              <CheckCircle2 size={16} className="text-purple" />
              <span>Array and compound data types (e.g. <code>int[]</code> with bounds checks)</span>
            </div>
            <div className="future-item">
              <CheckCircle2 size={16} className="text-purple" />
              <span>Control-flow graph (CFG) generation and dead code detection</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

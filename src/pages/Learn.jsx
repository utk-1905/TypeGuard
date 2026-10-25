import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Search,
  GitBranch,
  Layers,
  Database,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Play,
  ArrowRight
} from 'lucide-react';

export default function Learn() {
  const navigate = useNavigate();

  // Interactive Prediction Challenges State
  const [revealedAnswers, setRevealedAnswers] = useState({});

  const challenges = [
    {
      id: 'quiz-1',
      question: 'Will this program pass static type checking?',
      code: `int count = 10;
string label = "Items: ";
string summary = label + count;`,
      expected: 'INVALID',
      explanation: 'In TypeGuard Mini, the binary + operator is overloaded strictly for string + string concatenation or numeric arithmetic (int + int, float + float). Adding an integer directly to a string without explicit conversion causes a TYPE002 Type Error.'
    },
    {
      id: 'quiz-2',
      question: 'Is this assignment valid in TypeGuard?',
      code: `float ratio = 3.14;
int rounded = ratio;`,
      expected: 'INVALID',
      explanation: 'Assigning a float to an int requires narrowing coercion which can cause precision loss. In static type systems, implicit narrowing is prohibited, triggering a TYPE001 Type Error (cannot assign float to int).'
    },
    {
      id: 'quiz-3',
      question: 'Is this expression type-safe?',
      code: `int a = 15;
int b = 20;
bool isGreater = a > b;`,
      expected: 'VALID',
      explanation: 'Comparing two numeric values with relational operator > produces a boolean result type, which matches the declared type of isGreater (bool).'
    }
  ];

  const handleToggleAnswer = (id) => {
    setRevealedAnswers(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleTestInPlayground = (code, title) => {
    navigate('/playground', { state: { code, title } });
  };

  return (
    <div className="learn-page section-container">
      {/* Page Header */}
      <div className="page-header text-center">
        <span className="section-subtitle">Compiler Design Fundamentals</span>
        <h1 className="page-title">Educational Compiler Theory Guide</h1>
        <p className="page-desc">
          Learn how compilers analyze programming languages, transform characters into abstract syntax trees, and enforce semantic type safety before code execution.
        </p>
      </div>

      {/* Guide Content Sections */}
      <div className="learn-grid">
        {/* Section 1: What is a Compiler */}
        <section className="learn-card panel">
          <div className="learn-card-header">
            <span className="learn-step-badge font-mono">Concept 01</span>
            <h2>What is a Compiler?</h2>
          </div>
          <div className="learn-card-body">
            <p>
              A <strong>compiler</strong> is a specialized software program that translates computer code written in a high-level source language into another target language (such as machine instructions, bytecode, or another programming language) while validating syntax and semantics.
            </p>
            <p className="mt-2">
              Unlike interpreters that execute code line-by-line during runtime, compilers analyze the entire structure of the program beforehand, ensuring that errors are caught before deployment or execution.
            </p>
          </div>
        </section>

        {/* Section 2: Lexical Analysis */}
        <section className="learn-card panel">
          <div className="learn-card-header">
            <span className="learn-step-badge font-mono">Concept 02</span>
            <h2>Lexical Analysis (Scanner / Tokenizer)</h2>
          </div>
          <div className="learn-card-body">
            <p>
              The first phase of a compiler is <strong>lexical analysis</strong>. The scanner reads the source program as a stream of raw ASCII/Unicode characters and groups them into meaningful minimal syntactic units called <strong>tokens</strong>.
            </p>
            <div className="example-box font-mono mt-3">
              <span className="text-secondary text-xs">Source Code:</span>
              <div className="text-primary font-bold">int total = 100;</div>
              <span className="text-secondary text-xs mt-2 block">Tokens Produced:</span>
              <div className="tokens-preview-list">
                <span className="badge badge-purple">[TYPE, "int"]</span>
                <span className="badge badge-neutral">[IDENTIFIER, "total"]</span>
                <span className="badge badge-purple">[ASSIGN, "="]</span>
                <span className="badge badge-success">[INT_LITERAL, "100"]</span>
                <span className="badge badge-neutral">[SEMICOLON, ";"]</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Syntax Analysis */}
        <section className="learn-card panel">
          <div className="learn-card-header">
            <span className="learn-step-badge font-mono">Concept 03</span>
            <h2>Syntax Analysis (Parser)</h2>
          </div>
          <div className="learn-card-body">
            <p>
              The <strong>parser</strong> checks whether the sequence of tokens conforms to the formal grammatical rules of the programming language (defined via Context-Free Grammars or EBNF).
            </p>
            <p className="mt-2">
              TypeGuard implements a <em>recursive-descent predictive parser</em> with precedence climbing for arithmetic and logical operators. If a statement violates grammar (such as a missing semicolon or unexpected token), the parser generates a syntax diagnostic with line and column markers.
            </p>
          </div>
        </section>

        {/* Section 4: Abstract Syntax Tree */}
        <section className="learn-card panel">
          <div className="learn-card-header">
            <span className="learn-step-badge font-mono">Concept 04</span>
            <h2>Abstract Syntax Tree (AST)</h2>
          </div>
          <div className="learn-card-body">
            <p>
              An <strong>Abstract Syntax Tree (AST)</strong> is a hierarchical tree representation of the abstract syntactic structure of source code. Each interior node denotes an operation (such as addition or assignment), while leaf nodes represent operands (identifiers or literals).
            </p>
            <div className="example-box font-mono mt-3">
              <span className="text-secondary text-xs">Expression: (10 + 20) * 2</span>
              <pre className="text-accent text-xs mt-1">
{`BinaryExpression [*]
├── BinaryExpression [+]
│   ├── IntegerLiteral [10]
│   └── IntegerLiteral [20]
└── IntegerLiteral [2]`}
              </pre>
            </div>
          </div>
        </section>

        {/* Section 5: Scoped Symbol Table */}
        <section className="learn-card panel">
          <div className="learn-card-header">
            <span className="learn-step-badge font-mono">Concept 05</span>
            <h2>The Symbol Table</h2>
          </div>
          <div className="learn-card-body">
            <p>
              The <strong>symbol table</strong> is a central data structure maintained throughout translation. It records information about source program identifiers, such as declared data types, scope level, initial values, and memory offsets.
            </p>
            <p className="mt-2">
              During type checking, the compiler queries the symbol table to confirm that identifiers are declared and to look up their assigned types.
            </p>
          </div>
        </section>

        {/* Section 6: Static Type Checking */}
        <section className="learn-card panel">
          <div className="learn-card-header">
            <span className="learn-step-badge font-mono">Concept 06</span>
            <h2>Static Type Checking & Semantic Analysis</h2>
          </div>
          <div className="learn-card-body">
            <p>
              <strong>Static type checking</strong> is the process of verifying and enforcing type constraints at compile time rather than during program execution.
            </p>
            <p className="mt-2">
              It guarantees type safety: for example, ensuring that a string cannot be assigned to an integer variable, and that operators like <code>+</code> or <code>&&</code> are only invoked on compatible data types.
            </p>
          </div>
        </section>
      </div>

      {/* Static vs Dynamic Type Checking Comparison */}
      <section className="comparison-section mt-8">
        <div className="section-header text-center">
          <span className="section-subtitle">Comparative Study</span>
          <h2>Static vs. Dynamic Type Checking</h2>
          <p className="section-desc">Key differences between compile-time and runtime type verification.</p>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Static Type Checking (e.g. TypeGuard, C, Java, Rust)</th>
                <th>Dynamic Type Checking (e.g. Python, JavaScript, Ruby)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Verification Time</strong></td>
                <td>At compile time (before execution)</td>
                <td>At runtime (as statements execute)</td>
              </tr>
              <tr>
                <td><strong>Error Detection</strong></td>
                <td>Catches type errors immediately during compilation</td>
                <td>Errors only surface when faulty code path is reached</td>
              </tr>
              <tr>
                <td><strong>Variable Typing</strong></td>
                <td>Bound to a fixed type (e.g., <code>int count;</code>)</td>
                <td>Variables hold references; types belong to values</td>
              </tr>
              <tr>
                <td><strong>Execution Speed</strong></td>
                <td>Faster execution; no runtime type tags or lookups</td>
                <td>Slight overhead for runtime type checks and boxing</td>
              </tr>
              <tr>
                <td><strong>Tooling & IDE</strong></td>
                <td>Instant autocomplete, refactoring, and linting</td>
                <td>Requires dynamic analysis or external annotations</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Interactive Exercises Section */}
      <section className="interactive-exercises-section mt-8">
        <div className="section-header text-center">
          <span className="section-subtitle">Test Your Knowledge</span>
          <h2>Interactive Type Checking Exercises</h2>
          <p className="section-desc">
            Predict whether these programs pass static type checking, reveal the theoretical explanation, and test them live in the Playground.
          </p>
        </div>

        <div className="challenges-grid">
          {challenges.map((ch) => {
            const isRevealed = revealedAnswers[ch.id];

            return (
              <div key={ch.id} className="challenge-card panel">
                <div className="challenge-header">
                  <HelpCircle size={18} className="text-purple" />
                  <h4>{ch.question}</h4>
                </div>

                <pre className="challenge-code font-mono">
                  {ch.code}
                </pre>

                <div className="challenge-actions">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleToggleAnswer(ch.id)}
                  >
                    {isRevealed ? 'Hide Explanation' : 'Reveal Answer'}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => handleTestInPlayground(ch.code, ch.question)}
                  >
                    <Play size={14} />
                    <span>Test in Playground</span>
                  </button>
                </div>

                {isRevealed && (
                  <div className="challenge-reveal-box fade-in">
                    <div className="reveal-badge-row">
                      <span className={`badge ${ch.expected === 'VALID' ? 'badge-success' : 'badge-error'}`}>
                        Expected Outcome: {ch.expected}
                      </span>
                    </div>
                    <p className="reveal-text">{ch.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

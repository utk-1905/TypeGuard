import React from 'react';
import { FileCode, Layers, ShieldCheck, AlertCircle, HelpCircle } from 'lucide-react';
import {
  GRAMMAR_EBNF,
  OPERATOR_PRECEDENCE,
  DIAGNOSTIC_CODES,
  LANGUAGE_LIMITATIONS
} from '../compiler/languageSpec.js';

export default function LanguageReference() {
  const compatibilityMatrix = [
    { op: '+ (Add)', t1: 'int', t2: 'int', result: 'int', valid: true, note: 'Integer addition' },
    { op: '+ (Add)', t1: 'float', t2: 'float', result: 'float', valid: true, note: 'Floating-point addition' },
    { op: '+ (Add)', t1: 'int', t2: 'float', result: 'float', valid: true, note: 'Implicit numeric widening' },
    { op: '+ (Concat)', t1: 'string', t2: 'string', result: 'string', valid: true, note: 'String concatenation' },
    { op: '+ (Add)', t1: 'int', t2: 'string', result: 'TYPE002 Error', valid: false, note: 'Incompatible operand types' },
    { op: '- (Sub)', t1: 'int', t2: 'int', result: 'int', valid: true, note: 'Integer subtraction' },
    { op: '* (Mul)', t1: 'int', t2: 'int', result: 'int', valid: true, note: 'Integer multiplication' },
    { op: '/ (Div)', t1: 'int', t2: 'int', result: 'int', valid: true, note: 'Integer division' },
    { op: '/ (Div)', t1: 'float', t2: 'float', result: 'float', valid: true, note: 'Float division' },
    { op: '<, <=, >, >=', t1: 'numeric', t2: 'numeric', result: 'bool', valid: true, note: 'Relational order comparison' },
    { op: '==, !=', t1: 'T', t2: 'T', result: 'bool', valid: true, note: 'Equality check between same types' },
    { op: '==, !=', t1: 'string', t2: 'int', result: 'TYPE004 Error', valid: false, note: 'Cannot compare string to number' },
    { op: '&&, ||', t1: 'bool', t2: 'bool', result: 'bool', valid: true, note: 'Logical boolean evaluation' },
    { op: '&&, ||', t1: 'int', t2: 'bool', result: 'TYPE003 Error', valid: false, note: 'Requires boolean operands' },
    { op: '! (Unary NOT)', t1: 'bool', t2: '—', result: 'bool', valid: true, note: 'Inverts boolean truth value' },
    { op: '- (Unary Neg)', t1: 'numeric', t2: '—', result: 'numeric', valid: true, note: 'Negates numeric value' }
  ];

  return (
    <div className="reference-page section-container">
      {/* Header */}
      <div className="page-header text-center">
        <span className="section-subtitle">Technical Specification</span>
        <h1 className="page-title">TypeGuard Mini Language Reference</h1>
        <p className="page-desc">
          Formal syntax specifications, grammar definitions, operator precedence tables, and static semantic rules for the TypeGuard Mini compiler.
        </p>
      </div>

      {/* 1. Data Types */}
      <section className="reference-section">
        <h2 className="section-title">1. Primitive Data Types</h2>
        <div className="types-grid">
          <div className="type-card panel">
            <span className="badge badge-purple font-mono">int</span>
            <h3>32-Bit Signed Integer</h3>
            <p>Whole numbers without decimal points. Examples: <code>0</code>, <code>42</code>, <code>-10</code>.</p>
          </div>

          <div className="type-card panel">
            <span className="badge badge-cyan font-mono">float</span>
            <h3>64-Bit Floating-Point</h3>
            <p>Real numbers containing a decimal fraction. Examples: <code>3.14</code>, <code>0.05</code>, <code>-2.5</code>.</p>
          </div>

          <div className="type-card panel">
            <span className="badge badge-warning font-mono">string</span>
            <h3>Textual String</h3>
            <p>Sequences of characters enclosed in double or single quotes. Examples: <code>"Utkarsh"</code>, <code>'TypeGuard'</code>.</p>
          </div>

          <div className="type-card panel">
            <span className="badge badge-success font-mono">bool</span>
            <h3>Boolean Logical Value</h3>
            <p>Logical truth states represented by the keywords <code>true</code> and <code>false</code>.</p>
          </div>
        </div>
      </section>

      {/* 2. Grammar (EBNF) */}
      <section className="reference-section">
        <h2 className="section-title">2. Context-Free Grammar (EBNF)</h2>
        <div className="grammar-card panel">
          <pre className="grammar-code-block font-mono">
            {GRAMMAR_EBNF.trim()}
          </pre>
        </div>
      </section>

      {/* 3. Operator Precedence */}
      <section className="reference-section">
        <h2 className="section-title">3. Operator Precedence & Associativity</h2>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Precedence</th>
                <th>Operators</th>
                <th>Category</th>
                <th>Associativity</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-mono">6 (Highest)</td>
                <td><code className="font-bold text-accent">* / %</code></td>
                <td>Multiplicative Arithmetic</td>
                <td>Left-to-Right</td>
              </tr>
              <tr>
                <td className="font-mono">5</td>
                <td><code className="font-bold text-accent">+ -</code></td>
                <td>Additive Arithmetic / String Concat</td>
                <td>Left-to-Right</td>
              </tr>
              <tr>
                <td className="font-mono">4</td>
                <td><code className="font-bold text-accent">&lt; &lt;= &gt; &gt;=</code></td>
                <td>Relational Comparison</td>
                <td>Left-to-Right</td>
              </tr>
              <tr>
                <td className="font-mono">3</td>
                <td><code className="font-bold text-accent">== !=</code></td>
                <td>Equality Comparison</td>
                <td>Left-to-Right</td>
              </tr>
              <tr>
                <td className="font-mono">2</td>
                <td><code className="font-bold text-accent">&amp;&amp;</code></td>
                <td>Logical AND</td>
                <td>Left-to-Right</td>
              </tr>
              <tr>
                <td className="font-mono">1 (Lowest)</td>
                <td><code className="font-bold text-accent">||</code></td>
                <td>Logical OR</td>
                <td>Left-to-Right</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Type Compatibility Matrix */}
      <section className="reference-section">
        <h2 className="section-title">4. Static Type Compatibility Matrix</h2>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Operation</th>
                <th>Left Operand</th>
                <th>Right Operand</th>
                <th>Result / Status</th>
                <th>Validity</th>
                <th>Semantics</th>
              </tr>
            </thead>
            <tbody>
              {compatibilityMatrix.map((item, idx) => (
                <tr key={idx}>
                  <td><code>{item.op}</code></td>
                  <td className="font-mono">{item.t1}</td>
                  <td className="font-mono">{item.t2}</td>
                  <td>
                    <span className={`badge ${item.valid ? 'badge-success' : 'badge-error'} font-mono`}>
                      {item.result}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${item.valid ? 'badge-success' : 'badge-error'}`}>
                      {item.valid ? 'Valid' : 'Rejected'}
                    </span>
                  </td>
                  <td className="text-secondary text-xs">{item.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Diagnostics Reference */}
      <section className="reference-section">
        <h2 className="section-title">5. Diagnostic Error Codes Reference</h2>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Category</th>
                <th>Severity</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(DIAGNOSTIC_CODES).map((d) => (
                <tr key={d.code}>
                  <td className="font-mono font-bold text-accent">{d.code}</td>
                  <td>{d.category}</td>
                  <td>
                    <span className={`badge ${d.severity === 'error' ? 'badge-error' : 'badge-warning'}`}>
                      {d.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="text-secondary">{d.title || d.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. Documented Language Limitations */}
      <section className="reference-section">
        <h2 className="section-title">6. Language Scope & Scope Limitations</h2>
        <div className="limitations-card panel">
          <p className="text-secondary mb-3">
            To maintain strict correctness and deep educational inspection suitable for a semester project presentation, TypeGuard Mini intentionally bounds language scope to core procedural constructs:
          </p>
          <ul className="limitations-list">
            {LANGUAGE_LIMITATIONS.map((limit, idx) => (
              <li key={idx} className="limitation-item">
                <span className="bullet text-muted">•</span>
                <span>{limit}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

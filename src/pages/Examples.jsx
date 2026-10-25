import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Play, CheckCircle2, AlertTriangle, Filter, ArrowRight } from 'lucide-react';
import { EXAMPLES, EXAMPLE_CATEGORIES } from '../data/examples.js';

export default function Examples() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredExamples = EXAMPLES.filter(ex =>
    selectedCategory === 'All' || ex.category === selectedCategory
  );

  const handleOpenInPlayground = (example) => {
    navigate('/playground', {
      state: {
        code: example.code,
        title: example.title
      }
    });
  };

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'Introductory':
      case 'Beginner':
        return 'badge-success';
      case 'Fundamental':
      case 'Intermediate':
        return 'badge-purple';
      case 'Advanced':
        return 'badge-cyan';
      default:
        return 'badge-neutral';
    }
  };

  return (
    <div className="examples-page section-container">
      {/* Page Header */}
      <div className="page-header text-center">
        <span className="section-subtitle">Curated Demonstrations</span>
        <h1 className="page-title">Compiler Test Programs & Examples</h1>
        <p className="page-desc">
          Explore sample programs designed to demonstrate every phase of TypeGuard: from type-safe arithmetic to syntax errors, duplicate declarations, and incompatible type assignments.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="category-filter-pills">
        {EXAMPLE_CATEGORIES.map(category => (
          <button
            key={category}
            type="button"
            className={`filter-pill ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Examples Grid */}
      <div className="examples-grid">
        {filteredExamples.map(example => {
          const isValidCategory = example.category === 'Valid Programs';

          return (
            <div key={example.id} className="example-card panel">
              <div className="example-card-header">
                <div className="example-badge-group">
                  <span className={`badge ${isValidCategory ? 'badge-success' : 'badge-warning'} text-xs`}>
                    {example.category}
                  </span>
                  <span className={`badge ${getDifficultyBadge(example.difficulty)} text-xs`}>
                    {example.difficulty}
                  </span>
                </div>
                <h3 className="example-card-title">{example.title}</h3>
                <p className="example-card-desc">{example.description}</p>
              </div>

              {/* Code Snippet Box */}
              <div className="example-code-wrapper font-mono">
                <pre>{example.code}</pre>
              </div>

              {/* Expected Learning Outcome */}
              <div className="example-outcome-box">
                <span className="outcome-label font-semibold text-xs text-accent">Expected Learning Outcome:</span>
                <p className="outcome-text text-secondary text-xs">{example.outcome}</p>
              </div>

              {/* Action Button */}
              <div className="example-card-footer">
                <button
                  type="button"
                  className="btn btn-primary btn-sm w-full"
                  onClick={() => handleOpenInPlayground(example)}
                >
                  <Play size={14} />
                  <span>Open in Playground</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

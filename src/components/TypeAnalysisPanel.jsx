import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, XCircle, Search, Filter } from 'lucide-react';

export default function TypeAnalysisPanel({ typeInferences = [], symbolTable = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredInferences = typeInferences.filter(item => {
    const matchesSearch = item.expression.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.inferredType.toLowerCase().includes(searchTerm.toLowerCase());
    const isError = item.inferredType === 'Type Error' || item.status.startsWith('Error');
    const matchesStatus = statusFilter === 'ALL' ||
                          (statusFilter === 'VALID' && !isError) ||
                          (statusFilter === 'ERROR' && isError);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="type-analysis-panel">
      {/* Controls Bar */}
      <div className="panel-controls-bar">
        <div className="search-input-wrapper">
          <Search size={14} className="search-icon" />
          <input
            type="text"
            className="filter-input"
            placeholder="Search expressions or inferred types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-select-wrapper">
          <Filter size={14} className="filter-icon" />
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Expressions ({typeInferences.length})</option>
            <option value="VALID">Valid Inferences</option>
            <option value="ERROR">Type Errors</option>
          </select>
        </div>
      </div>

      {/* Visual Inferences List */}
      {typeInferences.length === 0 ? (
        <div className="empty-panel-state">
          <p>No expressions evaluated yet. Run <strong>Check Program</strong> to analyze.</p>
        </div>
      ) : filteredInferences.length === 0 ? (
        <div className="empty-panel-state">
          <p>No expression inferences match your search criteria.</p>
        </div>
      ) : (
        <div className="inference-cards-list">
          {filteredInferences.map((item, idx) => {
            const isError = item.inferredType === 'Type Error' || item.status.startsWith('Error');

            return (
              <div
                key={idx}
                className={`inference-card ${isError ? 'inference-card-error' : 'inference-card-success'}`}
              >
                <div className="inference-main">
                  <div className="inference-expr-group">
                    <span className="font-mono text-muted text-xs">Line {item.line}</span>
                    <code className="inference-expr font-mono">{item.expression}</code>
                  </div>

                  <ArrowRight size={16} className={isError ? 'text-error' : 'text-accent'} />

                  <div className="inference-type-badge-group">
                    {isError ? (
                      <span className="badge badge-error">
                        <XCircle size={12} /> Type Error
                      </span>
                    ) : (
                      <span className="badge badge-success font-mono font-bold">
                        <CheckCircle2 size={12} /> {item.inferredType}
                      </span>
                    )}
                  </div>
                </div>

                <div className="inference-status-footer">
                  <span className={`text-xs ${isError ? 'text-error' : 'text-secondary'}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

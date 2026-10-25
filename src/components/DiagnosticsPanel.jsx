import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, ArrowRight, CornerDownRight, Filter } from 'lucide-react';

export default function DiagnosticsPanel({ diagnostics = [], onJumpToLine }) {
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const filteredDiagnostics = diagnostics.filter(d => {
    if (severityFilter === 'ERROR') return d.severity === 'error';
    if (severityFilter === 'WARNING') return d.severity === 'warning';
    return true;
  });

  const errorCount = diagnostics.filter(d => d.severity === 'error').length;
  const warningCount = diagnostics.filter(d => d.severity === 'warning').length;

  if (diagnostics.length === 0) {
    return (
      <div className="empty-panel-state empty-diagnostics-success">
        <CheckCircle2 size={48} className="text-success" />
        <h3 className="text-success">Zero Compile Errors</h3>
        <p>The source code strictly conforms to all lexical, syntax, and static type rules defined in TypeGuard.</p>
      </div>
    );
  }

  return (
    <div className="diagnostics-panel">
      {/* Controls Bar */}
      <div className="panel-controls-bar">
        <div className="diagnostic-counts-summary">
          <span className="badge badge-error">
            <AlertCircle size={12} /> {errorCount} Error{errorCount === 1 ? '' : 's'}
          </span>
          <span className="badge badge-warning">
            <AlertTriangle size={12} /> {warningCount} Warning{warningCount === 1 ? '' : 's'}
          </span>
        </div>

        <div className="filter-select-wrapper ml-auto">
          <Filter size={14} className="filter-icon" />
          <select
            className="filter-select"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
          >
            <option value="ALL">All ({diagnostics.length})</option>
            <option value="ERROR">Errors Only ({errorCount})</option>
            <option value="WARNING">Warnings Only ({warningCount})</option>
          </select>
        </div>
      </div>

      {/* Diagnostics Cards List */}
      <div className="diagnostics-list">
        {filteredDiagnostics.map((diag, index) => {
          const isError = diag.severity === 'error';

          return (
            <div
              key={index}
              className={`diagnostic-card ${isError ? 'diagnostic-card-error' : 'diagnostic-card-warning'}`}
            >
              <div className="diagnostic-header">
                <div className="diagnostic-badge-group">
                  <span className={`badge ${isError ? 'badge-error' : 'badge-warning'}`}>
                    {diag.code || 'ERR'}
                  </span>
                  <span className="badge badge-neutral text-xs">{diag.category}</span>
                </div>

                <button
                  type="button"
                  className="jump-line-btn"
                  onClick={() => onJumpToLine(diag.line)}
                  title={`Jump to Line ${diag.line}, Column ${diag.col} in editor`}
                >
                  <span>Line {diag.line}:{diag.col}</span>
                  <ArrowRight size={12} />
                </button>
              </div>

              <div className="diagnostic-body">
                <p className="diagnostic-message">{diag.message}</p>

                {(diag.expectedType || diag.actualType) && (
                  <div className="type-diff-box font-mono">
                    {diag.expectedType && (
                      <div className="type-diff-row">
                        <span className="text-secondary text-xs">Expected:</span>
                        <span className="badge badge-success text-xs">{diag.expectedType}</span>
                      </div>
                    )}
                    {diag.actualType && (
                      <div className="type-diff-row">
                        <span className="text-secondary text-xs">Received:</span>
                        <span className="badge badge-error text-xs">{diag.actualType}</span>
                      </div>
                    )}
                  </div>
                )}

                {diag.explanation && (
                  <div className="diagnostic-explanation">
                    <span className="expl-label">Why:</span>
                    <span className="expl-text">{diag.explanation}</span>
                  </div>
                )}

                {diag.suggestion && (
                  <div className="diagnostic-suggestion">
                    <CornerDownRight size={14} className="text-accent flex-shrink-0" />
                    <div>
                      <span className="suggestion-label text-accent font-semibold">Suggested Fix: </span>
                      <span className="suggestion-text">{diag.suggestion}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

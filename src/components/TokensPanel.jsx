import React, { useState } from 'react';
import { Search, Filter, Hash, Download } from 'lucide-react';
import { downloadFile } from '../utils/reportExport.js';

export default function TokensPanel({ tokens = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const nonEofTokens = tokens.filter(t => t.type !== 'EOF');

  const filteredTokens = nonEofTokens.filter(t => {
    const matchesSearch = t.lexeme.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || t.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const uniqueTypes = Array.from(new Set(nonEofTokens.map(t => t.type)));

  const handleDownloadCsv = () => {
    if (nonEofTokens.length === 0) return;
    const headers = ['Index', 'Lexeme', 'Token Type', 'Line', 'Column', 'Start', 'End'];
    const rows = nonEofTokens.map((t, idx) => [
      idx + 1,
      `"${t.lexeme.replace(/"/g, '""')}"`,
      t.type,
      t.line,
      t.col,
      t.start,
      t.end
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadFile(csv, `typeguard-tokens-${Date.now()}.csv`, 'text/csv');
  };

  const getBadgeClass = (type) => {
    switch (type) {
      case 'TYPE': return 'badge-purple';
      case 'KEYWORD': return 'badge-cyan';
      case 'IDENTIFIER': return 'badge-neutral';
      case 'INT_LITERAL':
      case 'FLOAT_LITERAL': return 'badge-success';
      case 'STRING_LITERAL': return 'badge-warning';
      case 'BOOL_LITERAL': return 'badge-cyan';
      case 'OPERATOR': return 'badge-purple';
      case 'ASSIGN': return 'badge-purple';
      default: return 'badge-neutral';
    }
  };

  return (
    <div className="tokens-panel">
      {/* Controls Bar */}
      <div className="panel-controls-bar">
        <div className="search-input-wrapper">
          <Search size={14} className="search-icon" />
          <input
            type="text"
            className="filter-input"
            placeholder="Search lexeme or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-select-wrapper">
          <Filter size={14} className="filter-icon" />
          <select
            className="filter-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="ALL">All Types ({nonEofTokens.length})</option>
            {uniqueTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="btn btn-outline btn-sm ml-auto"
          onClick={handleDownloadCsv}
          disabled={nonEofTokens.length === 0}
          title="Export tokens to CSV"
        >
          <Download size={14} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Tokens Table */}
      {filteredTokens.length === 0 ? (
        <div className="empty-panel-state">
          <Hash size={36} className="text-muted" />
          <p>No tokens match your search criteria.</p>
        </div>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>#</th>
                <th>Lexeme</th>
                <th>Token Type</th>
                <th>Line</th>
                <th>Column</th>
                <th>Span</th>
              </tr>
            </thead>
            <tbody>
              {filteredTokens.map((token, idx) => (
                <tr key={idx}>
                  <td className="text-muted font-mono">{idx + 1}</td>
                  <td>
                    <code className="token-lexeme-code">{token.lexeme}</code>
                  </td>
                  <td>
                    <span className={`badge ${getBadgeClass(token.type)}`}>
                      {token.type}
                    </span>
                  </td>
                  <td className="font-mono text-secondary">{token.line}</td>
                  <td className="font-mono text-secondary">{token.col}</td>
                  <td className="font-mono text-muted text-xs">
                    [{token.start}..{token.end}]
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

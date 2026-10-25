import React, { useState } from 'react';
import { Database, Search, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { downloadSymbolTableCsv } from '../utils/reportExport.js';

export default function SymbolTablePanel({ symbolTable = [] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSymbols = symbolTable.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="symbol-table-panel">
      {/* Controls Bar */}
      <div className="panel-controls-bar">
        <div className="search-input-wrapper">
          <Search size={14} className="search-icon" />
          <input
            type="text"
            className="filter-input"
            placeholder="Search variables by name or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="btn btn-outline btn-sm ml-auto"
          onClick={() => downloadSymbolTableCsv(symbolTable)}
          disabled={symbolTable.length === 0}
          title="Export symbol table to CSV"
        >
          <Download size={14} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Table Area */}
      {symbolTable.length === 0 ? (
        <div className="empty-panel-state">
          <Database size={36} className="text-muted" />
          <p>No variables declared in this program.</p>
          <span className="text-muted text-xs">Variables declared via 'int', 'float', 'string', or 'bool' will appear here.</span>
        </div>
      ) : filteredSymbols.length === 0 ? (
        <div className="empty-panel-state">
          <Search size={36} className="text-muted" />
          <p>No variables match '{searchTerm}'.</p>
        </div>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Variable</th>
                <th>Declared Type</th>
                <th>Initial Value</th>
                <th>Line</th>
                <th>Scope</th>
                <th>Initialized?</th>
                <th>Memory Offset</th>
              </tr>
            </thead>
            <tbody>
              {filteredSymbols.map((sym) => (
                <tr key={sym.name}>
                  <td>
                    <span className="symbol-name font-mono font-bold text-accent">
                      {sym.name}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${sym.type === 'int' ? 'badge-purple' : sym.type === 'float' ? 'badge-cyan' : sym.type === 'string' ? 'badge-warning' : 'badge-success'}`}>
                      {sym.type}
                    </span>
                  </td>
                  <td>
                    <code className="symbol-value-code font-mono">
                      {sym.initialValue}
                    </code>
                  </td>
                  <td className="font-mono text-secondary">{sym.line}</td>
                  <td>
                    <span className="badge badge-neutral text-xs">
                      {sym.scope}
                    </span>
                  </td>
                  <td>
                    {sym.isInitialized ? (
                      <span className="badge badge-success text-xs">
                        <CheckCircle2 size={12} /> Initialized
                      </span>
                    ) : (
                      <span className="badge badge-warning text-xs">
                        <AlertCircle size={12} /> Uninitialized
                      </span>
                    )}
                  </td>
                  <td className="font-mono text-muted text-xs">
                    +{sym.memoryOffset} bytes
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

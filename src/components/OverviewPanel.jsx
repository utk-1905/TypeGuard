import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  FileCode,
  Layers,
  Database,
  CheckCircle2,
  ArrowRight,
  Download
} from 'lucide-react';
import { downloadFile, generateMarkdownReport, downloadJsonReport } from '../utils/reportExport.js';

export default function OverviewPanel({ analysis, onSelectTab }) {
  if (!analysis) {
    return (
      <div className="empty-panel-state">
        <FileCode size={40} className="text-muted" />
        <h3>No Analysis Yet</h3>
        <p>Write your program in the editor and click <strong>Check Program</strong> to run the compiler pipeline.</p>
      </div>
    );
  }

  const { success, stats, stages, diagnostics } = analysis;

  return (
    <div className="overview-panel">
      {/* Top Banner Status */}
      <div className={`status-banner ${success ? 'status-banner-success' : 'status-banner-error'}`}>
        <div className="status-banner-content">
          <div className="status-banner-icon">
            {success ? <ShieldCheck size={28} /> : <XCircle size={28} />}
          </div>
          <div>
            <h3 className="status-banner-title">
              {success ? 'Static Type Checking Passed' : 'Static Type Checking Failed'}
            </h3>
            <p className="status-banner-desc">
              {success
                ? 'All variable types, operand compatibility rules, and expressions have been verified by TypeGuard.'
                : `Detected ${stats.errorCount} error${stats.errorCount === 1 ? '' : 's'} preventing type-safe execution. See Diagnostics tab for details.`}
            </p>
          </div>
        </div>

        <div className="status-banner-actions">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              const md = generateMarkdownReport(analysis);
              downloadFile(md, `typeguard-report-${Date.now()}.md`, 'text/markdown');
            }}
          >
            <Download size={14} />
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <span className="metric-label">Tokens</span>
          <span className="metric-value">{stats.tokenCount}</span>
          <span className="metric-sub">Lexical symbols</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Variables</span>
          <span className="metric-value">{stats.declarationCount}</span>
          <span className="metric-sub">In symbol table</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Syntax Status</span>
          <span className={`metric-value ${stages.parser.status === 'passed' ? 'text-success' : 'text-error'}`}>
            {stats.syntaxStatus}
          </span>
          <span className="metric-sub">{stages.parser.detail || 'Parser status'}</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Type Status</span>
          <span className={`metric-value ${stages.typeChecker.status === 'passed' ? 'text-success' : (stages.typeChecker.status === 'skipped' ? 'text-muted' : 'text-error')}`}>
            {stats.typeStatus}
          </span>
          <span className="metric-sub">{stages.typeChecker.detail || 'Type status'}</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Errors</span>
          <span className={`metric-value ${stats.errorCount > 0 ? 'text-error' : 'text-success'}`}>
            {stats.errorCount}
          </span>
          <span className="metric-sub">Blocking errors</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Warnings</span>
          <span className={`metric-value ${stats.warningCount > 0 ? 'text-warning' : 'text-muted'}`}>
            {stats.warningCount}
          </span>
          <span className="metric-sub">Code warnings</span>
        </div>
      </div>

      {/* Compiler Stages Summary List */}
      <div className="panel-section">
        <h4 className="section-title">Compiler Stage Progression</h4>
        <div className="stages-summary-list">
          {Object.entries(stages).map(([key, stage]) => {
            let statusBadge = <span className="badge badge-neutral">Not Run</span>;
            if (stage.status === 'passed') {
              statusBadge = <span className="badge badge-success">Passed</span>;
            } else if (stage.status === 'failed') {
              statusBadge = <span className="badge badge-error">Failed</span>;
            } else if (stage.status === 'skipped') {
              statusBadge = <span className="badge badge-neutral">Skipped</span>;
            }

            return (
              <div key={key} className="stage-summary-item">
                <div className="stage-info">
                  <span className="stage-name">{stage.name}</span>
                  <span className="stage-desc">{stage.detail || stage.description}</span>
                </div>
                {statusBadge}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="quick-nav-grid">
        <button
          type="button"
          className="quick-nav-card"
          onClick={() => onSelectTab('diagnostics')}
        >
          <div className="quick-nav-icon">
            <AlertTriangle size={18} className="text-warning" />
          </div>
          <div className="quick-nav-text">
            <h5>View Diagnostics ({diagnostics.length})</h5>
            <p>Detailed error explanations, line numbers, and suggestions</p>
          </div>
          <ArrowRight size={16} className="quick-nav-arrow" />
        </button>

        <button
          type="button"
          className="quick-nav-card"
          onClick={() => onSelectTab('symbolTable')}
        >
          <div className="quick-nav-icon">
            <Database size={18} className="text-accent" />
          </div>
          <div className="quick-nav-text">
            <h5>Inspect Symbol Table ({stats.declarationCount})</h5>
            <p>Explore variable types, declaration lines, and memory offsets</p>
          </div>
          <ArrowRight size={16} className="quick-nav-arrow" />
        </button>
      </div>
    </div>
  );
}

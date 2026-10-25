import React, { useState } from 'react';
import {
  FileText,
  Search,
  GitBranch,
  Layers,
  Database,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowDown,
  Terminal,
  Code
} from 'lucide-react';

export default function PipelinePanel({ stages, ast, intermediateCode, onSelectTab }) {
  const [selectedStageKey, setSelectedStageKey] = useState('typeChecker');

  if (!stages) {
    return (
      <div className="empty-panel-state">
        <p>No compiler stages executed yet. Click <strong>Check Program</strong> to run.</p>
      </div>
    );
  }

  const stageKeys = [
    { key: 'source', icon: FileText, tab: null },
    { key: 'lexer', icon: Search, tab: 'tokens' },
    { key: 'parser', icon: GitBranch, tab: 'overview' },
    { key: 'ast', icon: Layers, tab: 'overview' },
    { key: 'symbolTable', icon: Database, tab: 'symbolTable' },
    { key: 'typeChecker', icon: ShieldCheck, tab: 'typeAnalysis' },
    { key: 'finalReport', icon: CheckCircle2, tab: 'overview' }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed':
        return <CheckCircle2 size={16} className="text-success" />;
      case 'failed':
        return <XCircle size={16} className="text-error" />;
      default:
        return <Clock size={16} className="text-muted" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'passed':
        return <span className="badge badge-success text-xs">Passed</span>;
      case 'failed':
        return <span className="badge badge-error text-xs">Failed</span>;
      case 'skipped':
        return <span className="badge badge-neutral text-xs">Skipped</span>;
      default:
        return <span className="badge badge-neutral text-xs">Not Run</span>;
    }
  };

  return (
    <div className="pipeline-panel">
      {/* Pipeline Connected Nodes Flow */}
      <div className="pipeline-flow-container">
        {stageKeys.map((item, index) => {
          const stage = stages[item.key] || { name: item.key, status: 'not-started', detail: '' };
          const Icon = item.icon;
          const isSelected = selectedStageKey === item.key;

          return (
            <React.Fragment key={item.key}>
              <div
                className={`pipeline-node-card ${stage.status} ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedStageKey(item.key);
                  if (item.tab && onSelectTab) {
                    // onSelectTab(item.tab);
                  }
                }}
              >
                <div className="pipeline-node-header">
                  <div className="node-icon-wrapper">
                    <Icon size={18} />
                  </div>
                  <span className="node-step-num font-mono">Stage 0{index + 1}</span>
                  {getStatusIcon(stage.status)}
                </div>

                <div className="pipeline-node-info">
                  <h5 className="node-title">{stage.name}</h5>
                  <p className="node-desc">{stage.detail || stage.description}</p>
                </div>

                <div className="pipeline-node-footer">
                  {getStatusBadge(stage.status)}
                </div>
              </div>

              {index < stageKeys.length - 1 && (
                <div className="pipeline-connector">
                  <ArrowDown size={14} className="connector-arrow" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Stage Detail Inspector */}
      <div className="pipeline-detail-box">
        {selectedStageKey === 'ast' && ast && (
          <div className="ast-inspector-box">
            <div className="inspector-header">
              <Layers size={16} className="text-purple" />
              <h4>Abstract Syntax Tree (AST) Hierarchy</h4>
            </div>
            <pre className="ast-code-block font-mono">
              {JSON.stringify(ast, null, 2)}
            </pre>
          </div>
        )}

        {selectedStageKey === 'typeChecker' && intermediateCode && intermediateCode.instructions.length > 0 && (
          <div className="tac-inspector-box">
            <div className="inspector-header">
              <Terminal size={16} className="text-accent" />
              <h4>Three-Address Code (TAC) - Intermediate Representation</h4>
            </div>
            <p className="text-secondary text-xs mb-2">
              Generated following successful static type validation of the Abstract Syntax Tree:
            </p>
            <div className="tac-instructions-list font-mono">
              {intermediateCode.instructions.map((code, idx) => (
                <div key={idx} className="tac-line">
                  <span className="tac-line-num">{idx + 1}:</span>
                  <code>{code}</code>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedStageKey !== 'ast' && !(selectedStageKey === 'typeChecker' && intermediateCode?.instructions?.length > 0) && (
          <div className="stage-info-detail-box">
            <h4>{stages[selectedStageKey]?.name}</h4>
            <p className="text-secondary mb-3">{stages[selectedStageKey]?.description}</p>
            <div className="detail-status-row">
              <span className="text-muted text-xs">Current Execution Status:</span>
              {getStatusBadge(stages[selectedStageKey]?.status)}
            </div>
            <p className="detail-detail-text font-mono text-xs mt-2">
              {stages[selectedStageKey]?.detail || 'No additional log messages recorded for this stage.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

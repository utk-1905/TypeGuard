import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Play,
  RotateCcw,
  Eraser,
  FileText,
  Search,
  Database,
  ShieldCheck,
  AlertTriangle,
  Layers,
  Download,
  FolderOpen,
  ChevronDown
} from 'lucide-react';

import CodeEditor from '../components/CodeEditor.jsx';
import OverviewPanel from '../components/OverviewPanel.jsx';
import TokensPanel from '../components/TokensPanel.jsx';
import SymbolTablePanel from '../components/SymbolTablePanel.jsx';
import TypeAnalysisPanel from '../components/TypeAnalysisPanel.jsx';
import DiagnosticsPanel from '../components/DiagnosticsPanel.jsx';
import PipelinePanel from '../components/PipelinePanel.jsx';

import { analyze } from '../compiler/analyze.js';
import { EXAMPLES } from '../data/examples.js';
import { getStoredCode, saveStoredCode, clearStoredCode } from '../utils/storage.js';
import { generateMarkdownReport, downloadFile, downloadJsonReport } from '../utils/reportExport.js';

const DEFAULT_CODE = `int age = 20;
float height = 5.8;
string name = "Utkarsh";
bool isStudent = true;

int score = 90;
int bonus = 10;
int total = score + bonus;

print(name);
print(total);`;

export default function Playground() {
  const location = useLocation();

  // Load code from router state (if opened from Examples page) or localStorage, or default
  const [code, setCode] = useState(() => {
    if (location.state && location.state.code) {
      return location.state.code;
    }
    return getStoredCode(DEFAULT_CODE);
  });

  const [programName, setProgramName] = useState(() => {
    if (location.state && location.state.title) {
      return location.state.title;
    }
    return 'TypeGuard Reference Program';
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [activeErrorLine, setActiveErrorLine] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [exampleDropdownOpen, setExampleDropdownOpen] = useState(false);

  const saveTimeoutRef = useRef(null);

  // Show temporary toast message
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Run compiler analysis
  const runAnalysis = (sourceToAnalyze = code) => {
    try {
      const result = analyze(sourceToAnalyze);
      setAnalysisResult(result);

      if (result.success) {
        showToast('✓ Program passed static type checking!');
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#8B5CF6', '#22D3EE', '#22C55E']
          });
        } catch (e) {
          // ignore if canvas not supported
        }
      } else {
        showToast(`⚠ ${result.stats.errorCount} error(s) detected.`);
      }
    } catch (err) {
      console.error('Compiler execution error:', err);
      showToast('Unexpected compiler error during analysis.');
    }
  };

  // Save code changes to localStorage with debouncing
  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveStoredCode(newCode);
    }, 600);
  };

  // Load selected preset example
  const handleSelectExample = (example) => {
    setCode(example.code);
    setProgramName(example.title);
    saveStoredCode(example.code);
    setExampleDropdownOpen(false);
    showToast(`Loaded "${example.title}"`);
    runAnalysis(example.code);
  };

  // Reset to default sample code
  const handleResetCode = () => {
    if (code !== DEFAULT_CODE) {
      const confirmed = window.confirm('Reset code to the default reference program? Any unsaved edits will be lost.');
      if (!confirmed) return;
    }
    setCode(DEFAULT_CODE);
    setProgramName('TypeGuard Reference Program');
    clearStoredCode();
    showToast('Code reset to default reference program.');
    runAnalysis(DEFAULT_CODE);
  };

  // Clear analysis output
  const handleClearOutput = () => {
    setAnalysisResult(null);
    setActiveErrorLine(null);
    showToast('Analysis output cleared.');
  };

  // Jump to specific error line in editor
  const handleJumpToLine = (line) => {
    setActiveErrorLine(line);
    showToast(`Focused Line ${line} in editor.`);
  };

  // Auto-analyze initial code on first render
  useEffect(() => {
    runAnalysis(code);
  }, []);

  // Compute error lines for gutter highlighting
  const errorLines = analysisResult?.diagnostics
    ?.filter(d => d.severity === 'error')
    ?.map(d => d.line) || [];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText, count: null },
    { id: 'tokens', label: 'Tokens', icon: Search, count: analysisResult?.stats?.tokenCount },
    { id: 'symbolTable', label: 'Symbol Table', icon: Database, count: analysisResult?.stats?.declarationCount },
    { id: 'typeAnalysis', label: 'Type Analysis', icon: ShieldCheck, count: analysisResult?.typeInferences?.length },
    { id: 'diagnostics', label: 'Diagnostics', icon: AlertTriangle, count: analysisResult?.stats?.diagnosticCount, isError: analysisResult?.stats?.errorCount > 0 },
    { id: 'pipeline', label: 'Pipeline', icon: Layers, count: null }
  ];

  return (
    <div className="playground-page">
      {/* Top Toolbar */}
      <div className="playground-toolbar">
        <div className="toolbar-left">
          <div className="program-title-box">
            <span className="program-label">Active Program:</span>
            <span className="program-title font-mono font-semibold">{programName}</span>
          </div>
        </div>

        <div className="toolbar-center">
          {/* Main Action: Check Program */}
          <button
            type="button"
            className="btn btn-primary btn-run"
            onClick={() => runAnalysis(code)}
            title="Execute compiler pipeline (Ctrl+Enter)"
          >
            <Play size={16} fill="currentColor" />
            <span>Check Program</span>
          </button>

          {/* Example Loader Dropdown */}
          <div className="dropdown-container">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setExampleDropdownOpen(!exampleDropdownOpen)}
              title="Load a preset example program"
            >
              <FolderOpen size={14} />
              <span>Load Example</span>
              <ChevronDown size={14} />
            </button>

            {exampleDropdownOpen && (
              <div className="example-dropdown-menu">
                <div className="dropdown-header">Preset Programs</div>
                {EXAMPLES.map(ex => (
                  <button
                    key={ex.id}
                    type="button"
                    className="dropdown-item"
                    onClick={() => handleSelectExample(ex)}
                  >
                    <span className="dropdown-item-title">{ex.title}</span>
                    <span className="dropdown-item-cat">{ex.category}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reset Code */}
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={handleResetCode}
            title="Reset code to default"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>

          {/* Clear Output */}
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={handleClearOutput}
            title="Clear compiler output panels"
          >
            <Eraser size={14} />
            <span>Clear Output</span>
          </button>
        </div>

        <div className="toolbar-right">
          {/* Download Report Button */}
          {analysisResult && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                const md = generateMarkdownReport(analysisResult);
                downloadFile(md, `typeguard-report-${Date.now()}.md`, 'text/markdown');
                showToast('Report downloaded as Markdown.');
              }}
              title="Download detailed compiler report"
            >
              <Download size={14} />
              <span>Export Report</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace: Split Pane Layout */}
      <div className="playground-workspace">
        {/* Left Pane: Code Editor */}
        <div className="editor-pane">
          <CodeEditor
            code={code}
            onChange={handleCodeChange}
            onRun={() => runAnalysis(code)}
            errorLines={errorLines}
            activeLine={activeErrorLine}
          />
        </div>

        {/* Right Pane: Analysis Results & Tabs */}
        <div className="results-pane panel">
          {/* Tab Navigation Header */}
          <div className="results-tabs-bar">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`result-tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                  {tab.count !== null && tab.count !== undefined && (
                    <span className={`tab-count-badge ${tab.isError ? 'count-error' : ''}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content Panel */}
          <div className="results-tab-content">
            {activeTab === 'overview' && (
              <OverviewPanel
                analysis={analysisResult}
                onSelectTab={(tabId) => setActiveTab(tabId)}
              />
            )}

            {activeTab === 'tokens' && (
              <TokensPanel tokens={analysisResult?.tokens || []} />
            )}

            {activeTab === 'symbolTable' && (
              <SymbolTablePanel symbolTable={analysisResult?.symbolTable || []} />
            )}

            {activeTab === 'typeAnalysis' && (
              <TypeAnalysisPanel
                typeInferences={analysisResult?.typeInferences || []}
                symbolTable={analysisResult?.symbolTable || []}
              />
            )}

            {activeTab === 'diagnostics' && (
              <DiagnosticsPanel
                diagnostics={analysisResult?.diagnostics || []}
                onJumpToLine={handleJumpToLine}
              />
            )}

            {activeTab === 'pipeline' && (
              <PipelinePanel
                stages={analysisResult?.stages}
                ast={analysisResult?.ast}
                intermediateCode={analysisResult?.intermediateCode}
                onSelectTab={(tabId) => setActiveTab(tabId)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="toast-notification">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

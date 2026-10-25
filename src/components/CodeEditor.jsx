import React, { useRef, useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Copy, Check } from 'lucide-react';

export default function CodeEditor({
  code,
  onChange,
  onRun,
  errorLines = [],
  activeLine = null
}) {
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  const lines = code.split('\n');
  const lineCount = Math.max(lines.length, 1);

  // Sync scroll between textarea and line numbers
  const handleScroll = (e) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.target.scrollTop;
    }
  };

  // Track cursor position
  const updateCursorPosition = () => {
    if (!textareaRef.current) return;
    const text = textareaRef.current.value;
    const selStart = textareaRef.current.selectionStart;
    const textBefore = text.substring(0, selStart);
    const lineNum = textBefore.split('\n').length;
    const lastNewline = textBefore.lastIndexOf('\n');
    const colNum = lastNewline === -1 ? selStart + 1 : selStart - lastNewline;
    setCursorPos({ line: lineNum, col: colNum });
  };

  // Keyboard shortcuts and indentation
  const handleKeyDown = (e) => {
    // Ctrl+Enter or Cmd+Enter to run compiler
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun();
      return;
    }

    // Tab indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      onChange(newCode);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
        updateCursorPosition();
      }, 0);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Scroll to activeLine if requested by diagnostic click
  useEffect(() => {
    if (activeLine && textareaRef.current) {
      const lineIndex = activeLine - 1;
      const linesArr = code.split('\n');
      let charPos = 0;
      for (let i = 0; i < lineIndex && i < linesArr.length; i++) {
        charPos += linesArr[i].length + 1;
      }
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(charPos, charPos + (linesArr[lineIndex]?.length || 0));
      updateCursorPosition();
    }
  }, [activeLine, code]);

  return (
    <div className="code-editor-wrapper">
      {/* Editor Top Bar */}
      <div className="editor-top-bar">
        <div className="editor-title-group">
          <span className="editor-file-badge">source.tg</span>
          <span className="editor-lang-tag">TypeGuard Mini v1.0</span>
        </div>
        <div className="editor-actions">
          <button
            type="button"
            className="editor-btn"
            onClick={handleCopy}
            title="Copy code to clipboard"
          >
            {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="editor-main-container">
        {/* Line Numbers & Error Gutters */}
        <div ref={lineNumbersRef} className="editor-gutter">
          {Array.from({ length: lineCount }, (_, i) => {
            const lineNum = i + 1;
            const hasError = errorLines.includes(lineNum);
            const isCursorLine = cursorPos.line === lineNum;

            return (
              <div
                key={lineNum}
                className={`gutter-line ${hasError ? 'error-gutter' : ''} ${isCursorLine ? 'active-gutter' : ''}`}
                title={hasError ? `Error on line ${lineNum}` : `Line ${lineNum}`}
              >
                {hasError ? (
                  <AlertCircle size={11} className="gutter-error-icon" />
                ) : (
                  <span className="gutter-num">{lineNum}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          className="editor-textarea"
          value={code}
          onChange={(e) => {
            onChange(e.target.value);
            updateCursorPosition();
          }}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          onKeyUp={updateCursorPosition}
          onClick={updateCursorPosition}
          onSelect={updateCursorPosition}
          spellCheck="false"
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          placeholder="Write TypeGuard code here..."
        />
      </div>

      {/* Editor Status Bar */}
      <div className="editor-status-bar">
        <div className="status-group-left">
          <span className="status-item">Ln {cursorPos.line}, Col {cursorPos.col}</span>
          <span className="status-divider">•</span>
          <span className="status-item">{lineCount} lines</span>
          <span className="status-divider">•</span>
          <span className="status-item">{code.length} chars</span>
        </div>
        <div className="status-group-right">
          <span className="status-shortcut-hint">Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to analyze</span>
        </div>
      </div>
    </div>
  );
}

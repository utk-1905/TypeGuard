/**
 * TypeGuard - Diagnostic System
 * Compiler Design Mini Project: Static Type Checking System
 */

export const DiagnosticSeverity = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

export const DiagnosticCategory = {
  LEXICAL: 'Lexical Error',
  SYNTAX: 'Syntax Error',
  TYPE: 'Type Error',
  UNDECLARED: 'Undeclared Variable',
  DUPLICATE: 'Duplicate Declaration',
  WARNING: 'Warning'
};

export function createDiagnostic({
  code,
  type,
  category = DiagnosticCategory.TYPE,
  severity = DiagnosticSeverity.ERROR,
  message,
  line = 1,
  col = 1,
  start = 0,
  end = 0,
  expectedType = null,
  actualType = null,
  explanation = '',
  suggestion = ''
}) {
  return {
    code,
    type,
    category,
    severity,
    message,
    line,
    col,
    start,
    end,
    expectedType,
    actualType,
    explanation,
    suggestion
  };
}

export function sortDiagnostics(diagnostics) {
  return [...diagnostics].sort((a, b) => {
    if (a.line !== b.line) return a.line - b.line;
    return a.col - b.col;
  });
}

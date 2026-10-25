/**
 * TypeGuard - Master Compiler Pipeline Orchestrator
 * Coordinates Lexical Analysis, Syntax Parsing, AST, Symbol Table, and Static Type Checking
 */

import { tokenize } from './lexer.js';
import { parse } from './parser.js';
import { SymbolTable } from './symbolTable.js';
import { checkTypes } from './typeChecker.js';
import { sortDiagnostics } from './diagnostics.js';
import { generateThreeAddressCode } from './intermediateCode.js';

export function analyze(sourceCode) {
  const lines = sourceCode.split('\n');
  const lineCount = lines.length;

  const stages = {
    source: {
      name: 'Source Code',
      description: 'Raw program input loaded',
      status: 'passed',
      detail: `${lineCount} line${lineCount === 1 ? '' : 's'}, ${sourceCode.length} characters`
    },
    lexer: {
      name: 'Lexical Analysis',
      description: 'Token generation and character scanning',
      status: 'not-started',
      detail: ''
    },
    parser: {
      name: 'Syntax Analysis',
      description: 'Grammar validation and statement parsing',
      status: 'not-started',
      detail: ''
    },
    ast: {
      name: 'AST Construction',
      description: 'Abstract Syntax Tree node hierarchy',
      status: 'not-started',
      detail: ''
    },
    symbolTable: {
      name: 'Symbol Table Construction',
      description: 'Identifier registration, type mapping, and scope tracking',
      status: 'not-started',
      detail: ''
    },
    typeChecker: {
      name: 'Static Type Checking',
      description: 'Semantic verification, type compatibility, and operand validation',
      status: 'not-started',
      detail: ''
    },
    finalReport: {
      name: 'Final Report',
      description: 'Compilation diagnostics summary',
      status: 'not-started',
      detail: ''
    }
  };

  let allDiagnostics = [];
  let tokens = [];
  let ast = null;
  const symbolTable = new SymbolTable('global');
  let typeInferences = [];
  let intermediateCode = { instructions: [], quadruples: [] };

  // Step 1: Lexical Analysis
  const lexResult = tokenize(sourceCode);
  tokens = lexResult.tokens;
  const lexicalErrors = lexResult.errors;

  if (lexicalErrors.length > 0) {
    allDiagnostics.push(...lexicalErrors);
    stages.lexer.status = 'failed';
    stages.lexer.detail = `Detected ${lexicalErrors.length} lexical error${lexicalErrors.length === 1 ? '' : 's'}`;
  } else {
    stages.lexer.status = 'passed';
    const nonEofTokens = tokens.filter(t => t.type !== 'EOF');
    stages.lexer.detail = `Generated ${nonEofTokens.length} token${nonEofTokens.length === 1 ? '' : 's'}`;
  }

  // If there are fatal lexical errors (e.g. invalid characters), we can still attempt parsing
  // but if lexical analysis failed completely, we flag the pipeline.
  
  // Step 2: Syntax Analysis & AST Construction
  const parseResult = parse(tokens);
  const syntaxErrors = parseResult.errors;

  if (syntaxErrors.length > 0) {
    allDiagnostics.push(...syntaxErrors);
    stages.parser.status = 'failed';
    stages.parser.detail = `Detected ${syntaxErrors.length} syntax error${syntaxErrors.length === 1 ? '' : 's'}`;
    stages.ast.status = 'failed';
    stages.ast.detail = 'AST generation incomplete due to syntax errors';

    // Skip semantic stages safely
    stages.symbolTable.status = 'skipped';
    stages.symbolTable.detail = 'Skipped because syntax analysis failed';
    stages.typeChecker.status = 'skipped';
    stages.typeChecker.detail = 'Skipped because valid AST was not produced';
    stages.finalReport.status = 'failed';
    stages.finalReport.detail = 'Compilation failed during syntax analysis';
  } else {
    ast = parseResult.ast;
    stages.parser.status = 'passed';
    stages.parser.detail = `Parsed ${ast.body.length} statement${ast.body.length === 1 ? '' : 's'} successfully`;
    stages.ast.status = 'passed';
    stages.ast.detail = `Generated AST root with ${ast.body.length} top-level nodes`;

    // Step 3 & 4: Symbol Table & Static Type Checking
    const typeResult = checkTypes(ast, symbolTable);
    allDiagnostics.push(...typeResult.diagnostics);
    typeInferences = typeResult.typeInferences;

    const typeErrors = typeResult.diagnostics.filter(d => d.severity === 'error');
    const typeWarnings = typeResult.diagnostics.filter(d => d.severity === 'warning');

    const totalSymbols = symbolTable.getAll().length;
    stages.symbolTable.status = 'passed';
    stages.symbolTable.detail = `Registered ${totalSymbols} symbol${totalSymbols === 1 ? '' : 's'} in global scope`;

    if (typeErrors.length > 0) {
      stages.typeChecker.status = 'failed';
      stages.typeChecker.detail = `Found ${typeErrors.length} static type error${typeErrors.length === 1 ? '' : 's'}`;
      stages.finalReport.status = 'failed';
      stages.finalReport.detail = 'Static type checking failed';
    } else {
      stages.typeChecker.status = 'passed';
      stages.typeChecker.detail = typeWarnings.length > 0
        ? `Passed with ${typeWarnings.length} warning${typeWarnings.length === 1 ? '' : 's'}`
        : 'All expressions and assignments are type-safe';

      stages.finalReport.status = 'passed';
      stages.finalReport.detail = 'Program successfully verified by TypeGuard';

      // Generate Three-Address Code (TAC) for successful programs
      intermediateCode = generateThreeAddressCode(ast);
    }
  }

  // Sort diagnostics by line and column
  allDiagnostics = sortDiagnostics(allDiagnostics);

  const errorCount = allDiagnostics.filter(d => d.severity === 'error').length;
  const warningCount = allDiagnostics.filter(d => d.severity === 'warning').length;
  const success = errorCount === 0;

  const nonEofTokenCount = tokens.filter(t => t.type !== 'EOF').length;
  const declarationCount = symbolTable.getAll().length;

  return {
    success,
    sourceCode,
    tokens,
    ast,
    symbolTable: symbolTable.getAll(),
    typeInferences,
    intermediateCode,
    diagnostics: allDiagnostics,
    stages,
    stats: {
      tokenCount: nonEofTokenCount,
      declarationCount,
      diagnosticCount: allDiagnostics.length,
      errorCount,
      warningCount,
      lineCount,
      syntaxStatus: stages.parser.status === 'passed' ? 'Valid' : 'Errors Found',
      typeStatus: stages.typeChecker.status === 'passed' ? 'Type Safe' : (stages.typeChecker.status === 'skipped' ? 'Skipped' : 'Type Errors')
    }
  };
}

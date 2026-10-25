/**
 * TypeGuard - Automated Test Suite for Compiler Engine
 * Vitest tests verifying all 25 compiler criteria from project specification
 */

import { describe, it, expect } from 'vitest';
import { tokenize, TokenType } from '../lexer.js';
import { parse } from '../parser.js';
import { analyze } from '../analyze.js';

describe('TypeGuard Compiler Engine', () => {
  // 1. Recognition of keywords
  it('1. should recognize all language keywords correctly', () => {
    const code = 'int float string bool print';
    const { tokens } = tokenize(code);
    expect(tokens[0].type).toBe(TokenType.TYPE);
    expect(tokens[0].value).toBe('int');
    expect(tokens[1].type).toBe(TokenType.TYPE);
    expect(tokens[1].value).toBe('float');
    expect(tokens[2].type).toBe(TokenType.TYPE);
    expect(tokens[2].value).toBe('string');
    expect(tokens[3].type).toBe(TokenType.TYPE);
    expect(tokens[3].value).toBe('bool');
    expect(tokens[4].type).toBe(TokenType.KEYWORD);
    expect(tokens[4].value).toBe('print');
  });

  // 2. Recognition of identifiers
  it('2. should recognize identifiers starting with letters and underscores', () => {
    const code = 'myVar _score count2 total_sum';
    const { tokens } = tokenize(code);
    expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
    expect(tokens[0].value).toBe('myVar');
    expect(tokens[1].type).toBe(TokenType.IDENTIFIER);
    expect(tokens[1].value).toBe('_score');
    expect(tokens[2].type).toBe(TokenType.IDENTIFIER);
    expect(tokens[2].value).toBe('count2');
    expect(tokens[3].type).toBe(TokenType.IDENTIFIER);
    expect(tokens[3].value).toBe('total_sum');
  });

  // 3. Integer literals
  it('3. should tokenize integer literals correctly', () => {
    const code = '42 0 9999';
    const { tokens } = tokenize(code);
    expect(tokens[0].type).toBe(TokenType.INT_LITERAL);
    expect(tokens[0].value).toBe(42);
    expect(tokens[1].type).toBe(TokenType.INT_LITERAL);
    expect(tokens[1].value).toBe(0);
    expect(tokens[2].type).toBe(TokenType.INT_LITERAL);
    expect(tokens[2].value).toBe(9999);
  });

  // 4. Floating-point literals
  it('4. should tokenize floating-point literals correctly', () => {
    const code = '3.14 0.05 99.9';
    const { tokens } = tokenize(code);
    expect(tokens[0].type).toBe(TokenType.FLOAT_LITERAL);
    expect(tokens[0].value).toBeCloseTo(3.14);
    expect(tokens[1].type).toBe(TokenType.FLOAT_LITERAL);
    expect(tokens[1].value).toBeCloseTo(0.05);
  });

  // 5. String literals
  it('5. should tokenize string literals with escape sequences', () => {
    const code = '"Hello World" "Line\\nBreak"';
    const { tokens } = tokenize(code);
    expect(tokens[0].type).toBe(TokenType.STRING_LITERAL);
    expect(tokens[0].value).toBe('Hello World');
    expect(tokens[1].type).toBe(TokenType.STRING_LITERAL);
    expect(tokens[1].value).toBe('Line\nBreak');
  });

  // 6. Boolean literals
  it('6. should tokenize true and false as boolean literals', () => {
    const code = 'true false';
    const { tokens } = tokenize(code);
    expect(tokens[0].type).toBe(TokenType.BOOL_LITERAL);
    expect(tokens[0].value).toBe(true);
    expect(tokens[1].type).toBe(TokenType.BOOL_LITERAL);
    expect(tokens[1].value).toBe(false);
  });

  // 7. Invalid characters
  it('7. should report lexical error for unrecognized characters', () => {
    const code = 'int a = @;';
    const { errors } = tokenize(code);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].code).toBe('LEX001');
    expect(errors[0].message).toContain('@');
  });

  // 8. Valid variable declarations
  it('8. should successfully parse valid declarations with and without init', () => {
    const code = `
      int a;
      float b = 2.5;
      string c = "text";
      bool d = true;
    `;
    const res = analyze(code);
    expect(res.success).toBe(true);
    expect(res.symbolTable.length).toBe(4);
  });

  // 9. Missing semicolons
  it('9. should report syntax error when semicolon is missing', () => {
    const code = 'int a = 10\nprint(a);';
    const res = analyze(code);
    expect(res.success).toBe(false);
    expect(res.diagnostics.some(d => d.code === 'SYN001' && d.message.includes(';'))).toBe(true);
    expect(res.stages.parser.status).toBe('failed');
  });

  // 10. Invalid expression syntax
  it('10. should report syntax error on malformed expressions', () => {
    const code = 'int a = 10 + * 5;';
    const res = analyze(code);
    expect(res.success).toBe(false);
    expect(res.stages.parser.status).toBe('failed');
  });

  // 11. Operator precedence
  it('11. should respect operator precedence in AST construction (* over +)', () => {
    const code = 'int a = 10 + 20 * 3;';
    const { tokens } = tokenize(code);
    const { ast } = parse(tokens);
    const initExpr = ast.body[0].initExpr;
    // Top operator should be '+'
    expect(initExpr.operator).toBe('+');
    expect(initExpr.left.value).toBe(10);
    // Right subtree should be '20 * 3'
    expect(initExpr.right.operator).toBe('*');
    expect(initExpr.right.left.value).toBe(20);
    expect(initExpr.right.right.value).toBe(3);
  });

  // 12. Valid integer arithmetic
  it('12. should validate integer arithmetic operations correctly', () => {
    const code = `
      int a = 10;
      int b = 20;
      int c = a + b * 2 - 5 / 1;
    `;
    const res = analyze(code);
    expect(res.success).toBe(true);
    expect(res.stats.errorCount).toBe(0);
  });

  // 13. Valid floating-point arithmetic
  it('13. should validate float arithmetic and promotion', () => {
    const code = `
      float x = 3.5;
      float y = x + 1.5;
      float z = x + 2; // int promoted to float
    `;
    const res = analyze(code);
    expect(res.success).toBe(true);
  });

  // 14. Valid Boolean expressions
  it('14. should validate boolean logical operators &&, ||, !', () => {
    const code = `
      bool a = true;
      bool b = false;
      bool c = a && !b || (a == b);
    `;
    const res = analyze(code);
    expect(res.success).toBe(true);
  });

  // 15. Incompatible assignments
  it('15. should reject assigning string to int variable', () => {
    const code = 'int age = "twenty";';
    const res = analyze(code);
    expect(res.success).toBe(false);
    expect(res.diagnostics.some(d => d.code === 'TYPE001')).toBe(true);
  });

  // 16. Invalid mixed-type arithmetic
  it('16. should reject adding int and string or bool', () => {
    const code = `
      int a = 10;
      string s = "test";
      int res = a + s;
    `;
    const res = analyze(code);
    expect(res.success).toBe(false);
    expect(res.diagnostics.some(d => d.code === 'TYPE002')).toBe(true);
  });

  // 17. Undeclared variables
  it('17. should report error for undeclared variable usage', () => {
    const code = 'int total = marks + 10;';
    const res = analyze(code);
    expect(res.success).toBe(false);
    const err = res.diagnostics.find(d => d.code === 'NAME001');
    expect(err).toBeDefined();
    expect(err.message).toContain('marks');
  });

  // 18. Duplicate declarations
  it('18. should report error when redeclaring the same variable', () => {
    const code = `
      int score = 80;
      int score = 90;
    `;
    const res = analyze(code);
    expect(res.success).toBe(false);
    expect(res.diagnostics.some(d => d.code === 'DECL001')).toBe(true);
  });

  // 19. Comparison expressions
  it('19. should validate comparisons and produce boolean type', () => {
    const code = `
      int a = 15;
      int b = 20;
      bool result = a < b;
      bool eq = a == b;
    `;
    const res = analyze(code);
    expect(res.success).toBe(true);
  });

  // 20. Parenthesized expressions
  it('20. should respect parenthesized grouping: (a + b) * c', () => {
    const code = 'int res = (10 + 20) * 2;';
    const res = analyze(code);
    expect(res.success).toBe(true);
    const { ast } = parse(tokenize(code).tokens);
    const initExpr = ast.body[0].initExpr;
    expect(initExpr.operator).toBe('*');
    expect(initExpr.left.operator).toBe('+');
  });

  // 21. Print statements
  it('21. should parse and type-check print statements', () => {
    const code = `
      string name = "Utkarsh";
      print(name);
      print(10 + 20);
    `;
    const res = analyze(code);
    expect(res.success).toBe(true);
  });

  // 22. Correct token line and column information
  it('22. should track precise line and column numbers for tokens', () => {
    const code = 'int age = 20;\nfloat height = 5.8;';
    const { tokens } = tokenize(code);
    expect(tokens[0].line).toBe(1);
    expect(tokens[0].col).toBe(1);
    const floatToken = tokens.find(t => t.value === 'float');
    expect(floatToken.line).toBe(2);
    expect(floatToken.col).toBe(1);
  });

  // 23. Accurate diagnostic locations
  it('23. should pinpoint the exact line and column of type errors', () => {
    const code = 'int x = 10;\nx = "bad";';
    const res = analyze(code);
    const err = res.diagnostics.find(d => d.code === 'TYPE001');
    expect(err).toBeDefined();
    expect(err.line).toBe(2);
  });

  // 24. Invalid source code must not be reported as a successful program
  it('24. should never mark invalid code as successful', () => {
    const code = 'int x = true + "hello";';
    const res = analyze(code);
    expect(res.success).toBe(false);
    expect(res.stages.typeChecker.status).toBe('failed');
    expect(res.stages.finalReport.status).toBe('failed');
  });

  // 25. Valid programs must not receive false-positive type errors
  it('25. should pass the standard reference program without false positives', () => {
    const code = `
      int age = 20;
      float height = 5.8;
      string name = "Utkarsh";
      bool isStudent = true;

      int score = 90;
      int bonus = 10;
      int total = score + bonus;

      print(name);
      print(total);
    `;
    const res = analyze(code);
    expect(res.success).toBe(true);
    expect(res.diagnostics.filter(d => d.severity === 'error').length).toBe(0);
    expect(res.stages.lexer.status).toBe('passed');
    expect(res.stages.parser.status).toBe('passed');
    expect(res.stages.symbolTable.status).toBe('passed');
    expect(res.stages.typeChecker.status).toBe('passed');
  });
});

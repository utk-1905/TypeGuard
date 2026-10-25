/**
 * TypeGuard - Syntax Analyzer (Parser)
 * Recursive-descent parser with operator precedence and error recovery
 */

import { TokenType } from './lexer.js';
import {
  ASTNodeType,
  createProgram,
  createVariableDeclaration,
  createAssignment,
  createPrintStatement,
  createBinaryExpression,
  createUnaryExpression,
  createIdentifier,
  createLiteral
} from './ast.js';

export function parse(tokens) {
  let current = 0;
  const errors = [];

  function isAtEnd() {
    return peek().type === TokenType.EOF;
  }

  function peek() {
    return tokens[current] || { type: TokenType.EOF, lexeme: 'EOF', line: 1, col: 1 };
  }

  function previous() {
    return tokens[current - 1];
  }

  function advance() {
    if (!isAtEnd()) current++;
    return previous();
  }

  function check(type, value = null) {
    if (isAtEnd()) return false;
    if (peek().type !== type) return false;
    if (value !== null && peek().value !== value) return false;
    return true;
  }

  function match(...types) {
    for (const type of types) {
      if (check(type)) {
        advance();
        return true;
      }
    }
    return false;
  }

  function consume(type, message, suggestion = '') {
    if (check(type)) return advance();

    const token = peek();
    const error = {
      code: 'SYN001',
      type: 'Syntax Error',
      category: 'Syntax Error',
      severity: 'error',
      message: `${message}. Found '${token.lexeme}' instead.`,
      line: token.line,
      col: token.col,
      start: token.start,
      end: token.end,
      explanation: `The parser encountered an unexpected token '${token.lexeme}' where '${type}' was expected.`,
      suggestion: suggestion || `Ensure the statement follows the language syntax.`
    };
    errors.push(error);
    throw error;
  }

  function synchronize() {
    advance();
    while (!isAtEnd()) {
      if (previous().type === TokenType.SEMICOLON) return;

      switch (peek().type) {
        case TokenType.TYPE:
        case TokenType.KEYWORD:
          return;
        default:
          break;
      }
      advance();
    }
  }

  // Expression Parsing with Precedence Climbing / Recursive Descent
  function parseExpression() {
    return parseLogicalOr();
  }

  function parseLogicalOr() {
    let expr = parseLogicalAnd();

    while (check(TokenType.OPERATOR, '||')) {
      const opToken = advance();
      const right = parseLogicalAnd();
      expr = createBinaryExpression(expr, opToken.value, right, {
        line: opToken.line,
        col: opToken.col
      });
    }

    return expr;
  }

  function parseLogicalAnd() {
    let expr = parseEquality();

    while (check(TokenType.OPERATOR, '&&')) {
      const opToken = advance();
      const right = parseEquality();
      expr = createBinaryExpression(expr, opToken.value, right, {
        line: opToken.line,
        col: opToken.col
      });
    }

    return expr;
  }

  function parseEquality() {
    let expr = parseComparison();

    while (check(TokenType.OPERATOR, '==') || check(TokenType.OPERATOR, '!=')) {
      const opToken = advance();
      const right = parseComparison();
      expr = createBinaryExpression(expr, opToken.value, right, {
        line: opToken.line,
        col: opToken.col
      });
    }

    return expr;
  }

  function parseComparison() {
    let expr = parseAdditive();

    while (
      check(TokenType.OPERATOR, '<') ||
      check(TokenType.OPERATOR, '<=') ||
      check(TokenType.OPERATOR, '>') ||
      check(TokenType.OPERATOR, '>=')
    ) {
      const opToken = advance();
      const right = parseAdditive();
      expr = createBinaryExpression(expr, opToken.value, right, {
        line: opToken.line,
        col: opToken.col
      });
    }

    return expr;
  }

  function parseAdditive() {
    let expr = parseMultiplicative();

    while (check(TokenType.OPERATOR, '+') || check(TokenType.OPERATOR, '-')) {
      const opToken = advance();
      const right = parseMultiplicative();
      expr = createBinaryExpression(expr, opToken.value, right, {
        line: opToken.line,
        col: opToken.col
      });
    }

    return expr;
  }

  function parseMultiplicative() {
    let expr = parseUnary();

    while (
      check(TokenType.OPERATOR, '*') ||
      check(TokenType.OPERATOR, '/') ||
      check(TokenType.OPERATOR, '%')
    ) {
      const opToken = advance();
      const right = parseUnary();
      expr = createBinaryExpression(expr, opToken.value, right, {
        line: opToken.line,
        col: opToken.col
      });
    }

    return expr;
  }

  function parseUnary() {
    if (
      check(TokenType.OPERATOR, '!') ||
      check(TokenType.OPERATOR, '-') ||
      check(TokenType.OPERATOR, '+')
    ) {
      const opToken = advance();
      const argument = parseUnary();
      return createUnaryExpression(opToken.value, argument, {
        line: opToken.line,
        col: opToken.col
      });
    }

    return parsePrimary();
  }

  function parsePrimary() {
    const token = peek();

    // Integer Literal
    if (match(TokenType.INT_LITERAL)) {
      return createLiteral(ASTNodeType.INTEGER_LITERAL, previous().value, previous().lexeme, {
        line: previous().line,
        col: previous().col
      });
    }

    // Float Literal
    if (match(TokenType.FLOAT_LITERAL)) {
      return createLiteral(ASTNodeType.FLOAT_LITERAL, previous().value, previous().lexeme, {
        line: previous().line,
        col: previous().col
      });
    }

    // String Literal
    if (match(TokenType.STRING_LITERAL)) {
      return createLiteral(ASTNodeType.STRING_LITERAL, previous().value, previous().lexeme, {
        line: previous().line,
        col: previous().col
      });
    }

    // Boolean Literal
    if (match(TokenType.BOOL_LITERAL)) {
      return createLiteral(ASTNodeType.BOOLEAN_LITERAL, previous().value, previous().lexeme, {
        line: previous().line,
        col: previous().col
      });
    }

    // Identifier
    if (match(TokenType.IDENTIFIER)) {
      return createIdentifier(previous().value, {
        line: previous().line,
        col: previous().col
      });
    }

    // Parenthesized expression: '(' expression ')'
    if (match(TokenType.LPAREN)) {
      const lparenToken = previous();
      const expr = parseExpression();
      consume(TokenType.RPAREN, "Expected closing ')' after expression", "Add a closing parenthesis ')' to complete the expression.");
      return expr;
    }

    // Syntax error in primary expression
    const errorToken = advance();
    const error = {
      code: 'SYN001',
      type: 'Syntax Error',
      category: 'Syntax Error',
      severity: 'error',
      message: `Expected expression. Found '${errorToken.lexeme}'`,
      line: errorToken.line,
      col: errorToken.col,
      start: errorToken.start,
      end: errorToken.end,
      explanation: `A valid expression (such as an identifier, number, string, or boolean) was expected here.`,
      suggestion: 'Provide a valid identifier or literal value.'
    };
    errors.push(error);
    throw error;
  }

  // Statements
  function parseDeclaration() {
    const typeToken = advance(); // consumes 'int', 'float', 'string', 'bool'
    const idToken = consume(TokenType.IDENTIFIER, "Expected variable name after type", "Provide an identifier name, e.g., 'int count;'");
    
    let initExpr = null;
    if (match(TokenType.ASSIGN)) {
      initExpr = parseExpression();
    }

    consume(TokenType.SEMICOLON, "Expected ';' after variable declaration", "Add a semicolon ';' at the end of the statement.");

    return createVariableDeclaration(typeToken.value, idToken.value, initExpr, {
      line: typeToken.line,
      col: typeToken.col
    });
  }

  function parseAssignment() {
    const idToken = advance(); // consumes identifier
    consume(TokenType.ASSIGN, "Expected '=' in assignment statement", "Use '=' to assign a value to the variable.");
    const valueExpr = parseExpression();
    consume(TokenType.SEMICOLON, "Expected ';' after assignment", "Add a semicolon ';' at the end of the statement.");

    return createAssignment(idToken.value, valueExpr, {
      line: idToken.line,
      col: idToken.col
    });
  }

  function parsePrintStatement() {
    const printToken = advance(); // consumes 'print'
    consume(TokenType.LPAREN, "Expected '(' after 'print'", "Call print with parentheses, e.g., 'print(x);'");
    const expr = parseExpression();
    consume(TokenType.RPAREN, "Expected ')' after print argument", "Close the print statement with ')'");
    consume(TokenType.SEMICOLON, "Expected ';' after print statement", "Add a semicolon ';' at the end of the statement.");

    return createPrintStatement(expr, {
      line: printToken.line,
      col: printToken.col
    });
  }

  function parseStatement() {
    if (check(TokenType.TYPE)) {
      return parseDeclaration();
    }
    if (check(TokenType.KEYWORD, 'print')) {
      return parsePrintStatement();
    }
    if (check(TokenType.IDENTIFIER)) {
      return parseAssignment();
    }

    // Unexpected statement start
    const token = advance();
    const error = {
      code: 'SYN001',
      type: 'Syntax Error',
      category: 'Syntax Error',
      severity: 'error',
      message: `Unexpected token '${token.lexeme}' at start of statement`,
      line: token.line,
      col: token.col,
      start: token.start,
      end: token.end,
      explanation: `Statements in TypeGuard must be variable declarations (e.g. 'int x = 5;'), assignments ('x = 10;'), or print statements ('print(x);').`,
      suggestion: `Check the statement syntax or remove '${token.lexeme}'.`
    };
    errors.push(error);
    throw error;
  }

  const statements = [];

  while (!isAtEnd()) {
    try {
      statements.push(parseStatement());
    } catch (err) {
      synchronize();
    }
  }

  const program = createProgram(statements, { line: 1, col: 1 });

  return {
    ast: errors.length === 0 ? program : null,
    partialAst: program,
    errors
  };
}

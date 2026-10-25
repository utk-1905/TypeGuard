/**
 * TypeGuard - Abstract Syntax Tree (AST) Node Definitions
 * Compiler Design Mini Project
 */

export const ASTNodeType = {
  PROGRAM: 'Program',
  VARIABLE_DECLARATION: 'VariableDeclaration',
  ASSIGNMENT: 'Assignment',
  PRINT_STATEMENT: 'PrintStatement',
  BINARY_EXPRESSION: 'BinaryExpression',
  UNARY_EXPRESSION: 'UnaryExpression',
  IDENTIFIER: 'Identifier',
  INTEGER_LITERAL: 'IntegerLiteral',
  FLOAT_LITERAL: 'FloatLiteral',
  STRING_LITERAL: 'StringLiteral',
  BOOLEAN_LITERAL: 'BooleanLiteral'
};

export function createProgram(body = [], loc = { line: 1, col: 1 }) {
  return {
    type: ASTNodeType.PROGRAM,
    body,
    loc
  };
}

export function createVariableDeclaration(varType, id, initExpr = null, loc = { line: 1, col: 1 }) {
  return {
    type: ASTNodeType.VARIABLE_DECLARATION,
    varType,
    id,
    initExpr,
    loc
  };
}

export function createAssignment(id, valueExpr, loc = { line: 1, col: 1 }) {
  return {
    type: ASTNodeType.ASSIGNMENT,
    id,
    valueExpr,
    loc
  };
}

export function createPrintStatement(expr, loc = { line: 1, col: 1 }) {
  return {
    type: ASTNodeType.PRINT_STATEMENT,
    expr,
    loc
  };
}

export function createBinaryExpression(left, operator, right, loc = { line: 1, col: 1 }) {
  return {
    type: ASTNodeType.BINARY_EXPRESSION,
    left,
    operator,
    right,
    loc
  };
}

export function createUnaryExpression(operator, argument, loc = { line: 1, col: 1 }) {
  return {
    type: ASTNodeType.UNARY_EXPRESSION,
    operator,
    argument,
    loc
  };
}

export function createIdentifier(name, loc = { line: 1, col: 1 }) {
  return {
    type: ASTNodeType.IDENTIFIER,
    name,
    loc
  };
}

export function createLiteral(literalType, value, raw, loc = { line: 1, col: 1 }) {
  return {
    type: literalType,
    value,
    raw,
    loc
  };
}

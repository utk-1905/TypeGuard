/**
 * TypeGuard - Language Specification & Configuration
 * Mini Programming Language for Static Type Checking
 */

export const LANGUAGE_NAME = 'TypeGuard Mini';
export const VERSION = '1.0.0';

export const DATA_TYPES = {
  INT: 'int',
  FLOAT: 'float',
  STRING: 'string',
  BOOL: 'bool',
  UNKNOWN: 'unknown',
  VOID: 'void'
};

export const KEYWORDS = [
  'int',
  'float',
  'string',
  'bool',
  'true',
  'false',
  'print'
];

export const OPERATOR_PRECEDENCE = {
  // Logical OR
  '||': { precedence: 1, associativity: 'left', category: 'logical' },
  // Logical AND
  '&&': { precedence: 2, associativity: 'left', category: 'logical' },
  // Equality
  '==': { precedence: 3, associativity: 'left', category: 'equality' },
  '!=': { precedence: 3, associativity: 'left', category: 'equality' },
  // Comparison
  '<': { precedence: 4, associativity: 'left', category: 'comparison' },
  '<=': { precedence: 4, associativity: 'left', category: 'comparison' },
  '>': { precedence: 4, associativity: 'left', category: 'comparison' },
  '>=': { precedence: 4, associativity: 'left', category: 'comparison' },
  // Additive
  '+': { precedence: 5, associativity: 'left', category: 'arithmetic' },
  '-': { precedence: 5, associativity: 'left', category: 'arithmetic' },
  // Multiplicative
  '*': { precedence: 6, associativity: 'left', category: 'arithmetic' },
  '/': { precedence: 6, associativity: 'left', category: 'arithmetic' },
  '%': { precedence: 6, associativity: 'left', category: 'arithmetic' }
};

export const UNARY_OPERATORS = {
  '!': { category: 'logical', operandType: DATA_TYPES.BOOL, resultType: DATA_TYPES.BOOL },
  '-': { category: 'arithmetic', operandType: 'numeric', resultType: 'same' },
  '+': { category: 'arithmetic', operandType: 'numeric', resultType: 'same' }
};

export const DIAGNOSTIC_CODES = {
  LEX001: { code: 'LEX001', category: 'Lexical Error', severity: 'error' },
  SYN001: { code: 'SYN001', category: 'Syntax Error', severity: 'error' },
  TYPE001: { code: 'TYPE001', category: 'Type Error', severity: 'error', title: 'Incompatible Assignment' },
  TYPE002: { code: 'TYPE002', category: 'Type Error', severity: 'error', title: 'Invalid Operand Types' },
  TYPE003: { code: 'TYPE003', category: 'Type Error', severity: 'error', title: 'Invalid Boolean Expression' },
  TYPE004: { code: 'TYPE004', category: 'Type Error', severity: 'error', title: 'Invalid Comparison' },
  NAME001: { code: 'NAME001', category: 'Undeclared Variable', severity: 'error', title: 'Identifier Not Declared' },
  DECL001: { code: 'DECL001', category: 'Duplicate Declaration', severity: 'error', title: 'Variable Already Declared' },
  WARN001: { code: 'WARN001', category: 'Warning', severity: 'warning', title: 'Uninitialized Variable Read' }
};

export const GRAMMAR_EBNF = `
program          ::= statement* EOF
statement        ::= declaration | assignment | printStatement
declaration      ::= type IDENTIFIER ("=" expression)? ";"
assignment       ::= IDENTIFIER "=" expression ";"
printStatement   ::= "print" "(" expression ")" ";"
type             ::= "int" | "float" | "string" | "bool"

expression       ::= logicalOr
logicalOr        ::= logicalAnd ("||" logicalAnd)*
logicalAnd       ::= equality ("&&" equality)*
equality         ::= comparison (("==" | "!=") comparison)*
comparison       ::= additive (("<" | "<=" | ">" | ">=") additive)*
additive         ::= multiplicative (("+" | "-") multiplicative)*
multiplicative   ::= unary (("*" | "/" | "%") unary)*
unary            ::= ("!" | "-" | "+") unary | primary
primary          ::= IDENTIFIER | literal | "(" expression ")"
literal          ::= INT_LITERAL | FLOAT_LITERAL | STRING_LITERAL | BOOL_LITERAL
`;

export const LANGUAGE_LIMITATIONS = [
  'User-defined functions and subroutines (planned for future versions).',
  'Block scoping / nested scopes (current version uses single lexical global scope).',
  'Conditional branching (if/else) and iteration loops (while/for).',
  'Compound data structures (arrays, structs, classes, pointers).',
  'Implicit narrowing casts (e.g. float to int is disallowed without explicit syntax).'
];

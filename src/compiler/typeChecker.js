/**
 * TypeGuard - Static Semantic Analyzer & Type Checker
 * Compiler Design Mini Project: Static Type Checking System
 */

import { ASTNodeType } from './ast.js';
import { DATA_TYPES } from './languageSpec.js';

export function stringifyNode(node) {
  if (!node) return '';
  switch (node.type) {
    case ASTNodeType.INTEGER_LITERAL:
    case ASTNodeType.FLOAT_LITERAL:
    case ASTNodeType.STRING_LITERAL:
    case ASTNodeType.BOOLEAN_LITERAL:
      return node.raw !== undefined ? String(node.raw) : String(node.value);
    case ASTNodeType.IDENTIFIER:
      return node.name;
    case ASTNodeType.UNARY_EXPRESSION:
      return `${node.operator}${stringifyNode(node.argument)}`;
    case ASTNodeType.BINARY_EXPRESSION:
      return `${stringifyNode(node.left)} ${node.operator} ${stringifyNode(node.right)}`;
    default:
      return '';
  }
}

export function checkTypes(ast, symbolTable) {
  const diagnostics = [];
  const typeInferences = [];

  if (!ast || !ast.body) {
    return { diagnostics, typeInferences };
  }

  // Type compatibility check: can 'sourceType' be assigned to 'targetType'?
  function isTypeCompatible(targetType, sourceType) {
    if (targetType === sourceType) return true;
    // Allow implicit widening from int to float
    if (targetType === DATA_TYPES.FLOAT && sourceType === DATA_TYPES.INT) return true;
    return false;
  }

  // Infer and validate expression types recursively
  function inferExpressionType(expr) {
    if (!expr) return DATA_TYPES.UNKNOWN;

    const exprStr = stringifyNode(expr);
    const loc = expr.loc || { line: 1, col: 1 };

    switch (expr.type) {
      case ASTNodeType.INTEGER_LITERAL: {
        const result = {
          expression: exprStr,
          inferredType: DATA_TYPES.INT,
          status: 'Valid',
          line: loc.line,
          col: loc.col
        };
        typeInferences.push(result);
        return DATA_TYPES.INT;
      }

      case ASTNodeType.FLOAT_LITERAL: {
        const result = {
          expression: exprStr,
          inferredType: DATA_TYPES.FLOAT,
          status: 'Valid',
          line: loc.line,
          col: loc.col
        };
        typeInferences.push(result);
        return DATA_TYPES.FLOAT;
      }

      case ASTNodeType.STRING_LITERAL: {
        const result = {
          expression: exprStr,
          inferredType: DATA_TYPES.STRING,
          status: 'Valid',
          line: loc.line,
          col: loc.col
        };
        typeInferences.push(result);
        return DATA_TYPES.STRING;
      }

      case ASTNodeType.BOOLEAN_LITERAL: {
        const result = {
          expression: exprStr,
          inferredType: DATA_TYPES.BOOL,
          status: 'Valid',
          line: loc.line,
          col: loc.col
        };
        typeInferences.push(result);
        return DATA_TYPES.BOOL;
      }

      case ASTNodeType.IDENTIFIER: {
        const symbol = symbolTable.lookup(expr.name);
        if (!symbol) {
          diagnostics.push({
            code: 'NAME001',
            type: 'Undeclared Variable',
            category: 'Undeclared Variable',
            severity: 'error',
            message: `Variable '${expr.name}' is used before it has been declared.`,
            line: loc.line,
            col: loc.col,
            explanation: `The identifier '${expr.name}' was not found in the symbol table. In TypeGuard, every variable must be declared with a type before being referenced.`,
            suggestion: `Declare '${expr.name}' before this line, e.g., 'int ${expr.name} = 0;' or check for typos.`
          });

          typeInferences.push({
            expression: exprStr,
            inferredType: 'Type Error',
            status: `Error: Undeclared variable '${expr.name}'`,
            line: loc.line,
            col: loc.col
          });

          return DATA_TYPES.UNKNOWN;
        }

        symbolTable.recordReference(expr.name, loc.line);

        if (!symbol.isInitialized) {
          diagnostics.push({
            code: 'WARN001',
            type: 'Warning',
            category: 'Warning',
            severity: 'warning',
            message: `Variable '${expr.name}' is read before being initialized.`,
            line: loc.line,
            col: loc.col,
            explanation: `The variable '${expr.name}' was declared on line ${symbol.line} without an initial value, and is being read before any assignment.`,
            suggestion: `Initialize '${expr.name}' with a value before reading it.`
          });
        }

        typeInferences.push({
          expression: exprStr,
          inferredType: symbol.type,
          status: 'Valid',
          line: loc.line,
          col: loc.col
        });

        return symbol.type;
      }

      case ASTNodeType.UNARY_EXPRESSION: {
        const argType = inferExpressionType(expr.argument);

        if (argType === DATA_TYPES.UNKNOWN) {
          return DATA_TYPES.UNKNOWN;
        }

        if (expr.operator === '!') {
          if (argType !== DATA_TYPES.BOOL) {
            diagnostics.push({
              code: 'TYPE003',
              type: 'Type Error',
              category: 'Type Error',
              severity: 'error',
              message: `Operator '!' requires a boolean operand. Found '${argType}'.`,
              line: loc.line,
              col: loc.col,
              expectedType: DATA_TYPES.BOOL,
              actualType: argType,
              explanation: `Logical NOT (!) only operates on boolean expressions (true or false).`,
              suggestion: `Ensure the operand evaluates to a bool, or use comparison operators.`
            });

            typeInferences.push({
              expression: exprStr,
              inferredType: 'Type Error',
              status: `Error: '!' requires bool, got ${argType}`,
              line: loc.line,
              col: loc.col
            });

            return DATA_TYPES.UNKNOWN;
          }

          typeInferences.push({
            expression: exprStr,
            inferredType: DATA_TYPES.BOOL,
            status: 'Valid',
            line: loc.line,
            col: loc.col
          });

          return DATA_TYPES.BOOL;
        }

        if (expr.operator === '+' || expr.operator === '-') {
          if (argType !== DATA_TYPES.INT && argType !== DATA_TYPES.FLOAT) {
            diagnostics.push({
              code: 'TYPE002',
              type: 'Type Error',
              category: 'Type Error',
              severity: 'error',
              message: `Unary operator '${expr.operator}' requires a numeric operand ('int' or 'float'). Found '${argType}'.`,
              line: loc.line,
              col: loc.col,
              expectedType: 'int | float',
              actualType: argType,
              explanation: `Unary arithmetic operators (+, -) cannot be applied to strings or booleans.`,
              suggestion: `Apply '${expr.operator}' only to integer or float expressions.`
            });

            typeInferences.push({
              expression: exprStr,
              inferredType: 'Type Error',
              status: `Error: '${expr.operator}' requires numeric operand, got ${argType}`,
              line: loc.line,
              col: loc.col
            });

            return DATA_TYPES.UNKNOWN;
          }

          typeInferences.push({
            expression: exprStr,
            inferredType: argType,
            status: 'Valid',
            line: loc.line,
            col: loc.col
          });

          return argType;
        }

        return DATA_TYPES.UNKNOWN;
      }

      case ASTNodeType.BINARY_EXPRESSION: {
        const leftType = inferExpressionType(expr.left);
        const rightType = inferExpressionType(expr.right);
        const op = expr.operator;

        if (leftType === DATA_TYPES.UNKNOWN || rightType === DATA_TYPES.UNKNOWN) {
          return DATA_TYPES.UNKNOWN;
        }

        // Arithmetic Operators: +, -, *, /, %
        if (['+', '-', '*', '/', '%'].includes(op)) {
          // Special case: string concatenation with '+'
          if (op === '+' && leftType === DATA_TYPES.STRING && rightType === DATA_TYPES.STRING) {
            typeInferences.push({
              expression: exprStr,
              inferredType: DATA_TYPES.STRING,
              status: 'Valid (String Concatenation)',
              line: loc.line,
              col: loc.col
            });
            return DATA_TYPES.STRING;
          }

          const isLeftNumeric = leftType === DATA_TYPES.INT || leftType === DATA_TYPES.FLOAT;
          const isRightNumeric = rightType === DATA_TYPES.INT || rightType === DATA_TYPES.FLOAT;

          if (!isLeftNumeric || !isRightNumeric) {
            diagnostics.push({
              code: 'TYPE002',
              type: 'Type Error',
              category: 'Type Error',
              severity: 'error',
              message: `Incompatible operands for arithmetic operator '${op}': cannot operate on '${leftType}' and '${rightType}'.`,
              line: loc.line,
              col: loc.col,
              expectedType: 'numeric (int or float)',
              actualType: `${leftType}, ${rightType}`,
              explanation: `Arithmetic operator '${op}' is defined for numeric operands (int, float), but received '${leftType}' and '${rightType}'.`,
              suggestion: `Ensure both operands are numbers, or convert values before calculation.`
            });

            typeInferences.push({
              expression: exprStr,
              inferredType: 'Type Error',
              status: `Error: Cannot apply '${op}' to '${leftType}' and '${rightType}'`,
              line: loc.line,
              col: loc.col
            });

            return DATA_TYPES.UNKNOWN;
          }

          // If either operand is float, result promotes to float
          const resultType = (leftType === DATA_TYPES.FLOAT || rightType === DATA_TYPES.FLOAT)
            ? DATA_TYPES.FLOAT
            : DATA_TYPES.INT;

          typeInferences.push({
            expression: exprStr,
            inferredType: resultType,
            status: 'Valid',
            line: loc.line,
            col: loc.col
          });

          return resultType;
        }

        // Comparison Operators: <, <=, >, >=
        if (['<', '<=', '>', '>='].includes(op)) {
          const isLeftNumeric = leftType === DATA_TYPES.INT || leftType === DATA_TYPES.FLOAT;
          const isRightNumeric = rightType === DATA_TYPES.INT || rightType === DATA_TYPES.FLOAT;

          if (!isLeftNumeric || !isRightNumeric) {
            diagnostics.push({
              code: 'TYPE004',
              type: 'Type Error',
              category: 'Type Error',
              severity: 'error',
              message: `Relational operator '${op}' requires numeric operands. Found '${leftType}' and '${rightType}'.`,
              line: loc.line,
              col: loc.col,
              expectedType: 'int | float',
              actualType: `${leftType}, ${rightType}`,
              explanation: `Ordered comparisons (<, <=, >, >=) are only valid between numeric values.`,
              suggestion: `Compare numeric expressions or check variable types.`
            });

            typeInferences.push({
              expression: exprStr,
              inferredType: 'Type Error',
              status: `Error: Relational '${op}' requires numeric operands`,
              line: loc.line,
              col: loc.col
            });

            return DATA_TYPES.UNKNOWN;
          }

          typeInferences.push({
            expression: exprStr,
            inferredType: DATA_TYPES.BOOL,
            status: 'Valid',
            line: loc.line,
            col: loc.col
          });

          return DATA_TYPES.BOOL;
        }

        // Equality Operators: ==, !=
        if (['==', '!='].includes(op)) {
          // Allow equality between two numerics, two strings, or two bools
          const bothNumeric = (leftType === DATA_TYPES.INT || leftType === DATA_TYPES.FLOAT) &&
                              (rightType === DATA_TYPES.INT || rightType === DATA_TYPES.FLOAT);
          const bothString = leftType === DATA_TYPES.STRING && rightType === DATA_TYPES.STRING;
          const bothBool = leftType === DATA_TYPES.BOOL && rightType === DATA_TYPES.BOOL;

          if (!bothNumeric && !bothString && !bothBool) {
            diagnostics.push({
              code: 'TYPE004',
              type: 'Type Error',
              category: 'Type Error',
              severity: 'error',
              message: `Cannot compare incompatible types '${leftType}' and '${rightType}' with '${op}'.`,
              line: loc.line,
              col: loc.col,
              expectedType: `compatible with ${leftType}`,
              actualType: rightType,
              explanation: `Equality comparisons require operands of comparable types (e.g. numeric with numeric, string with string, bool with bool).`,
              suggestion: `Ensure both sides of '${op}' evaluate to compatible data types.`
            });

            typeInferences.push({
              expression: exprStr,
              inferredType: 'Type Error',
              status: `Error: Incompatible types '${leftType}' and '${rightType}' for '${op}'`,
              line: loc.line,
              col: loc.col
            });

            return DATA_TYPES.UNKNOWN;
          }

          typeInferences.push({
            expression: exprStr,
            inferredType: DATA_TYPES.BOOL,
            status: 'Valid',
            line: loc.line,
            col: loc.col
          });

          return DATA_TYPES.BOOL;
        }

        // Logical Operators: &&, ||
        if (['&&', '||'].includes(op)) {
          if (leftType !== DATA_TYPES.BOOL || rightType !== DATA_TYPES.BOOL) {
            diagnostics.push({
              code: 'TYPE003',
              type: 'Type Error',
              category: 'Type Error',
              severity: 'error',
              message: `Logical operator '${op}' requires boolean operands. Found '${leftType}' and '${rightType}'.`,
              line: loc.line,
              col: loc.col,
              expectedType: DATA_TYPES.BOOL,
              actualType: `${leftType}, ${rightType}`,
              explanation: `Logical operators (&&, ||) only accept boolean operands (true or false).`,
              suggestion: `Ensure both sides evaluate to bool, using comparisons if necessary.`
            });

            typeInferences.push({
              expression: exprStr,
              inferredType: 'Type Error',
              status: `Error: '${op}' requires bool operands, got '${leftType}' and '${rightType}'`,
              line: loc.line,
              col: loc.col
            });

            return DATA_TYPES.UNKNOWN;
          }

          typeInferences.push({
            expression: exprStr,
            inferredType: DATA_TYPES.BOOL,
            status: 'Valid',
            line: loc.line,
            col: loc.col
          });

          return DATA_TYPES.BOOL;
        }

        return DATA_TYPES.UNKNOWN;
      }

      default:
        return DATA_TYPES.UNKNOWN;
    }
  }

  // Check all statements in AST body
  for (const stmt of ast.body) {
    if (!stmt) continue;

    switch (stmt.type) {
      case ASTNodeType.VARIABLE_DECLARATION: {
        const { varType, id, initExpr, loc } = stmt;

        // Check for duplicate declarations
        const initialValStr = initExpr ? stringifyNode(initExpr) : null;
        const defined = symbolTable.define({
          name: id,
          type: varType,
          initialValue: initialValStr,
          isInitialized: initExpr !== null,
          line: loc.line,
          col: loc.col
        });

        if (!defined) {
          const existing = symbolTable.lookup(id);
          diagnostics.push({
            code: 'DECL001',
            type: 'Duplicate Declaration',
            category: 'Duplicate Declaration',
            severity: 'error',
            message: `Variable '${id}' has already been declared in this scope (first declared at line ${existing ? existing.line : 'unknown'}).`,
            line: loc.line,
            col: loc.col,
            explanation: `TypeGuard uses static scope rules where redeclaring the same identifier in the same scope is prohibited.`,
            suggestion: `Remove the duplicate declaration or rename the variable.`
          });
        }

        // If there's an initializer expression, check its type
        if (initExpr) {
          const exprType = inferExpressionType(initExpr);

          if (exprType !== DATA_TYPES.UNKNOWN && !isTypeCompatible(varType, exprType)) {
            diagnostics.push({
              code: 'TYPE001',
              type: 'Type Error',
              category: 'Type Error',
              severity: 'error',
              message: `Cannot assign a value of type '${exprType}' to a variable of type '${varType}'.`,
              line: loc.line,
              col: loc.col,
              expectedType: varType,
              actualType: exprType,
              explanation: `Static type safety rule: A variable declared as '${varType}' can only be initialized with an expression of type '${varType}'.`,
              suggestion: `Change the initial value to a valid '${varType}', or change the variable's declared type.`
            });
          }
        }
        break;
      }

      case ASTNodeType.ASSIGNMENT: {
        const { id, valueExpr, loc } = stmt;
        const symbol = symbolTable.lookup(id);

        if (!symbol) {
          diagnostics.push({
            code: 'NAME001',
            type: 'Undeclared Variable',
            category: 'Undeclared Variable',
            severity: 'error',
            message: `Cannot assign to variable '${id}' because it has not been declared.`,
            line: loc.line,
            col: loc.col,
            explanation: `In TypeGuard Mini, you must declare a variable with its data type before assigning values to it.`,
            suggestion: `Declare '${id}' with a type before assigning to it, e.g., 'int ${id};'`
          });

          // Still check the value expression for inner errors
          inferExpressionType(valueExpr);
        } else {
          symbolTable.recordReference(id, loc.line);
          const exprType = inferExpressionType(valueExpr);

          if (exprType !== DATA_TYPES.UNKNOWN && !isTypeCompatible(symbol.type, exprType)) {
            diagnostics.push({
              code: 'TYPE001',
              type: 'Type Error',
              category: 'Type Error',
              severity: 'error',
              message: `Cannot assign a value of type '${exprType}' to variable '${id}' of type '${symbol.type}'.`,
              line: loc.line,
              col: loc.col,
              expectedType: symbol.type,
              actualType: exprType,
              explanation: `Variable '${id}' was declared as '${symbol.type}' on line ${symbol.line}. Assigning a '${exprType}' violates static type checking.`,
              suggestion: `Provide an expression that evaluates to '${symbol.type}', or modify the variable's declared type.`
            });
          } else if (exprType !== DATA_TYPES.UNKNOWN) {
            symbolTable.markInitialized(id);
          }
        }
        break;
      }

      case ASTNodeType.PRINT_STATEMENT: {
        const { expr } = stmt;
        inferExpressionType(expr);
        break;
      }

      default:
        break;
    }
  }

  return { diagnostics, typeInferences };
}

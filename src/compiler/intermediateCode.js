/**
 * TypeGuard - Intermediate Code Generator (Three-Address Code & Quadruples)
 * Compiler Design Mini Project
 */

import { ASTNodeType } from './ast.js';

export function generateThreeAddressCode(ast) {
  if (!ast || !ast.body) return { instructions: [], quadruples: [] };

  const instructions = [];
  const quadruples = [];
  let tempCount = 0;

  function newTemp() {
    return `t${tempCount++}`;
  }

  function emit(op, arg1, arg2, result, text) {
    quadruples.push({ op, arg1, arg2, result });
    instructions.push(text);
  }

  function generateExpr(expr) {
    if (!expr) return '';

    switch (expr.type) {
      case ASTNodeType.INTEGER_LITERAL:
      case ASTNodeType.FLOAT_LITERAL:
      case ASTNodeType.STRING_LITERAL:
      case ASTNodeType.BOOLEAN_LITERAL:
        return expr.raw !== undefined ? expr.raw : String(expr.value);

      case ASTNodeType.IDENTIFIER:
        return expr.name;

      case ASTNodeType.UNARY_EXPRESSION: {
        const arg = generateExpr(expr.argument);
        const t = newTemp();
        emit(expr.operator, arg, '', t, `${t} = ${expr.operator}${arg}`);
        return t;
      }

      case ASTNodeType.BINARY_EXPRESSION: {
        const left = generateExpr(expr.left);
        const right = generateExpr(expr.right);
        const t = newTemp();
        emit(expr.operator, left, right, t, `${t} = ${left} ${expr.operator} ${right}`);
        return t;
      }

      default:
        return '';
    }
  }

  for (const stmt of ast.body) {
    if (!stmt) continue;

    switch (stmt.type) {
      case ASTNodeType.VARIABLE_DECLARATION: {
        if (stmt.initExpr) {
          const val = generateExpr(stmt.initExpr);
          emit('=', val, '', stmt.id, `${stmt.id} = ${val}`);
        }
        break;
      }

      case ASTNodeType.ASSIGNMENT: {
        const val = generateExpr(stmt.valueExpr);
        emit('=', val, '', stmt.id, `${stmt.id} = ${val}`);
        break;
      }

      case ASTNodeType.PRINT_STATEMENT: {
        const val = generateExpr(stmt.expr);
        emit('print', val, '', '', `print ${val}`);
        break;
      }

      default:
        break;
    }
  }

  return { instructions, quadruples };
}

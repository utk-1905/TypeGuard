/**
 * TypeGuard - Lexical Analyzer (Scanner / Tokenizer)
 * Compiler Design Mini Project: Static Type Checking System
 */

export const TokenType = {
  // Types & Keywords
  TYPE: 'TYPE',
  KEYWORD: 'KEYWORD',
  
  // Literals
  INT_LITERAL: 'INT_LITERAL',
  FLOAT_LITERAL: 'FLOAT_LITERAL',
  STRING_LITERAL: 'STRING_LITERAL',
  BOOL_LITERAL: 'BOOL_LITERAL',

  // Identifiers
  IDENTIFIER: 'IDENTIFIER',

  // Operators
  OPERATOR: 'OPERATOR',
  ASSIGN: 'ASSIGN',

  // Delimiters
  LPAREN: 'LPAREN',
  RPAREN: 'RPAREN',
  SEMICOLON: 'SEMICOLON',

  // Special
  EOF: 'EOF',
  ERROR: 'ERROR'
};

const TYPE_KEYWORDS = new Set(['int', 'float', 'string', 'bool']);
const OTHER_KEYWORDS = new Set(['print']);

export function tokenize(sourceCode) {
  const tokens = [];
  const errors = [];
  let line = 1;
  let col = 1;
  let i = 0;
  const len = sourceCode.length;

  while (i < len) {
    const char = sourceCode[i];

    // Newlines
    if (char === '\n') {
      line++;
      col = 1;
      i++;
      continue;
    }

    // Carriage returns
    if (char === '\r') {
      i++;
      continue;
    }

    // Whitespace
    if (char === ' ' || char === '\t') {
      col++;
      i++;
      continue;
    }

    // Comments
    if (char === '/' && i + 1 < len) {
      if (sourceCode[i + 1] === '/') {
        // Line comment
        while (i < len && sourceCode[i] !== '\n') {
          i++;
        }
        continue;
      } else if (sourceCode[i + 1] === '*') {
        // Block comment
        const startLine = line;
        const startCol = col;
        const startIdx = i;
        i += 2;
        col += 2;
        let closed = false;
        while (i + 1 < len) {
          if (sourceCode[i] === '\n') {
            line++;
            col = 1;
            i++;
          } else if (sourceCode[i] === '*' && sourceCode[i + 1] === '/') {
            i += 2;
            col += 2;
            closed = true;
            break;
          } else {
            i++;
            col++;
          }
        }
        if (!closed) {
          errors.push({
            code: 'LEX001',
            type: 'Lexical Error',
            category: 'Lexical Error',
            severity: 'error',
            message: 'Unterminated block comment /* ... */',
            line: startLine,
            col: startCol,
            start: startIdx,
            end: len,
            explanation: 'Multi-line comments must be closed with */ before the end of the file.',
            suggestion: 'Add */ to close the comment.'
          });
        }
        continue;
      }
    }

    const startLine = line;
    const startCol = col;
    const startIdx = i;

    // String literals
    if (char === '"' || char === "'") {
      const quoteChar = char;
      let strVal = '';
      i++;
      col++;
      let closed = false;

      while (i < len) {
        const c = sourceCode[i];
        if (c === '\n') {
          errors.push({
            code: 'LEX001',
            type: 'Lexical Error',
            category: 'Lexical Error',
            severity: 'error',
            message: 'Unterminated string literal (newline before closing quote)',
            line: startLine,
            col: startCol,
            start: startIdx,
            end: i,
            explanation: 'String literals cannot span multiple lines without an escape sequence.',
            suggestion: `Close the string with ${quoteChar} before the newline.`
          });
          break;
        }
        if (c === '\\' && i + 1 < len) {
          const next = sourceCode[i + 1];
          if (next === 'n') strVal += '\n';
          else if (next === 't') strVal += '\t';
          else if (next === '\\') strVal += '\\';
          else if (next === quoteChar) strVal += quoteChar;
          else strVal += next;
          i += 2;
          col += 2;
        } else if (c === quoteChar) {
          i++;
          col++;
          closed = true;
          break;
        } else {
          strVal += c;
          i++;
          col++;
        }
      }

      if (closed) {
        tokens.push({
          type: TokenType.STRING_LITERAL,
          value: strVal,
          lexeme: `"${strVal}"`,
          line: startLine,
          col: startCol,
          start: startIdx,
          end: i
        });
      } else if (!errors.some(e => e.line === startLine && e.col === startCol)) {
        errors.push({
          code: 'LEX001',
          type: 'Lexical Error',
          category: 'Lexical Error',
          severity: 'error',
          message: 'Unterminated string literal at end of file',
          line: startLine,
          col: startCol,
          start: startIdx,
          end: len,
          explanation: `String starting at line ${startLine}, col ${startCol} was never closed.`,
          suggestion: `Add closing ${quoteChar} at the end of the string.`
        });
      }
      continue;
    }

    // Number literals (int and float)
    if (/[0-9]/.test(char)) {
      let numStr = '';
      let isFloat = false;

      while (i < len && /[0-9]/.test(sourceCode[i])) {
        numStr += sourceCode[i];
        i++;
        col++;
      }

      // Check for float dot followed by digits
      if (i < len && sourceCode[i] === '.' && i + 1 < len && /[0-9]/.test(sourceCode[i + 1])) {
        isFloat = true;
        numStr += '.';
        i++;
        col++;
        while (i < len && /[0-9]/.test(sourceCode[i])) {
          numStr += sourceCode[i];
          i++;
          col++;
        }
      }

      tokens.push({
        type: isFloat ? TokenType.FLOAT_LITERAL : TokenType.INT_LITERAL,
        value: isFloat ? parseFloat(numStr) : parseInt(numStr, 10),
        lexeme: numStr,
        line: startLine,
        col: startCol,
        start: startIdx,
        end: i
      });
      continue;
    }

    // Identifiers and Keywords
    if (/[a-zA-Z_]/.test(char)) {
      let ident = '';
      while (i < len && /[a-zA-Z0-9_]/.test(sourceCode[i])) {
        ident += sourceCode[i];
        i++;
        col++;
      }

      if (ident === 'true' || ident === 'false') {
        tokens.push({
          type: TokenType.BOOL_LITERAL,
          value: ident === 'true',
          lexeme: ident,
          line: startLine,
          col: startCol,
          start: startIdx,
          end: i
        });
      } else if (TYPE_KEYWORDS.has(ident)) {
        tokens.push({
          type: TokenType.TYPE,
          value: ident,
          lexeme: ident,
          line: startLine,
          col: startCol,
          start: startIdx,
          end: i
        });
      } else if (OTHER_KEYWORDS.has(ident)) {
        tokens.push({
          type: TokenType.KEYWORD,
          value: ident,
          lexeme: ident,
          line: startLine,
          col: startCol,
          start: startIdx,
          end: i
        });
      } else {
        tokens.push({
          type: TokenType.IDENTIFIER,
          value: ident,
          lexeme: ident,
          line: startLine,
          col: startCol,
          start: startIdx,
          end: i
        });
      }
      continue;
    }

    // Two-character operators (==, !=, <=, >=, &&, ||)
    const twoChar = sourceCode.slice(i, i + 2);
    if (['==', '!=', '<=', '>=', '&&', '||'].includes(twoChar)) {
      tokens.push({
        type: TokenType.OPERATOR,
        value: twoChar,
        lexeme: twoChar,
        line: startLine,
        col: startCol,
        start: startIdx,
        end: i + 2
      });
      i += 2;
      col += 2;
      continue;
    }

    // Single-character assignment (=)
    if (char === '=') {
      tokens.push({
        type: TokenType.ASSIGN,
        value: '=',
        lexeme: '=',
        line: startLine,
        col: startCol,
        start: startIdx,
        end: i + 1
      });
      i++;
      col++;
      continue;
    }

    // Single-character operators (+, -, *, /, %, <, >, !)
    if (['+', '-', '*', '/', '%', '<', '>', '!'].includes(char)) {
      tokens.push({
        type: TokenType.OPERATOR,
        value: char,
        lexeme: char,
        line: startLine,
        col: startCol,
        start: startIdx,
        end: i + 1
      });
      i++;
      col++;
      continue;
    }

    // Delimiters
    if (char === ';') {
      tokens.push({
        type: TokenType.SEMICOLON,
        value: ';',
        lexeme: ';',
        line: startLine,
        col: startCol,
        start: startIdx,
        end: i + 1
      });
      i++;
      col++;
      continue;
    }
    if (char === '(') {
      tokens.push({
        type: TokenType.LPAREN,
        value: '(',
        lexeme: '(',
        line: startLine,
        col: startCol,
        start: startIdx,
        end: i + 1
      });
      i++;
      col++;
      continue;
    }
    if (char === ')') {
      tokens.push({
        type: TokenType.RPAREN,
        value: ')',
        lexeme: ')',
        line: startLine,
        col: startCol,
        start: startIdx,
        end: i + 1
      });
      i++;
      col++;
      continue;
    }

    // Unrecognized character
    errors.push({
      code: 'LEX001',
      type: 'Lexical Error',
      category: 'Lexical Error',
      severity: 'error',
      message: `Invalid or unrecognized character '${char}' (ASCII: ${char.charCodeAt(0)})`,
      line: startLine,
      col: startCol,
      start: startIdx,
      end: i + 1,
      explanation: `The character '${char}' is not a valid token or operator in TypeGuard Mini.`,
      suggestion: 'Remove or replace this character.'
    });
    i++;
    col++;
  }

  tokens.push({
    type: TokenType.EOF,
    value: 'EOF',
    lexeme: 'EOF',
    line,
    col,
    start: len,
    end: len
  });

  return { tokens, errors };
}

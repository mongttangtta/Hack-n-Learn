export type TokenType = 'keyword' | 'string' | 'number' | 'comment' | 'function' | 'plain';

interface Token {
  type: TokenType;
  content: string;
}

const commonKeywords = new Set([
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
  'import', 'export', 'default', 'class', 'extends', 'implements', 'interface',
  'type', 'from', 'try', 'catch', 'finally', 'throw', 'new', 'this', 'async', 'await',
  'def', 'print', 'elif', 'None', 'True', 'False',
  'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'INSERT', 'INTO', 'VALUES', 'UPDATE',
  'DELETE', 'DROP', 'TABLE', 'UNION', 'ALL', 'ORDER', 'BY', 'LIMIT', 'OFFSET',
  'create', 'table', 'primary', 'key', 'autoincrement', 'text', 'integer',
  'null', 'not',
  'unique'
]);

const isKeyword = (word: string) => commonKeywords.has(word) || commonKeywords.has(word.toUpperCase());

export function highlightCode(code: string): Token[] {
  const tokens: Token[] = [];
  let current = 0;

  while (current < code.length) {
    const char = code[current];

    // Handle Comments
    // // or --
    if (current + 1 < code.length) {
      const next = code[current + 1];
      if ((char === '/' && next === '/') || (char === '-' && next === '-')) {
        let end = code.indexOf('\n', current);
        if (end === -1) end = code.length;
        tokens.push({ type: 'comment', content: code.slice(current, end) });
        current = end;
        continue;
      }
      // /* block comment */
      if (char === '/' && next === '*') {
        let end = code.indexOf('*/', current + 2);
        if (end === -1) end = code.length;
        else end += 2;
        tokens.push({ type: 'comment', content: code.slice(current, end) });
        current = end;
        continue;
      }
    }
    // Python/Shell style # comment
    if (char === '#') {
      let end = code.indexOf('\n', current);
      if (end === -1) end = code.length;
      tokens.push({ type: 'comment', content: code.slice(current, end) });
      current = end;
      continue;
    }

    // Handle Strings
    if (char === '"' || char === "'" || char === '`') {
      const quote = char;
      let end = current + 1;
      while (end < code.length) {
        if (code[end] === quote && code[end - 1] !== '\\') {
          end++;
          break;
        }
        end++;
      }
      tokens.push({ type: 'string', content: code.slice(current, end) });
      current = end;
      continue;
    }

    // Handle Numbers
    if (/[0-9]/.test(char)) {
      let end = current + 1;
      while (end < code.length && /[0-9.]/.test(code[end])) {
        end++;
      }
      tokens.push({ type: 'number', content: code.slice(current, end) });
      current = end;
      continue;
    }

    // Handle Words (Keywords, Functions, Identifiers)
    if (/[a-zA-Z_]/.test(char)) {
      let end = current + 1;
      while (end < code.length && /[a-zA-Z0-9_]/.test(code[end])) {
        end++;
      }
      const word = code.slice(current, end);
      
      // Check for function call: word followed by (
      let isFunc = false;
      let lookahead = end;
      while (lookahead < code.length && /\s/.test(code[lookahead])) lookahead++;
      if (code[lookahead] === '(') {
        isFunc = true;
      }

      if (isKeyword(word)) {
        tokens.push({ type: 'keyword', content: word });
      } else if (isFunc) {
        tokens.push({ type: 'function', content: word });
      } else {
        tokens.push({ type: 'plain', content: word });
      }
      current = end;
      continue;
    }

    // Handle Whitespace and Operators
    tokens.push({ type: 'plain', content: char });
    current++;
  }

  return tokens;
}

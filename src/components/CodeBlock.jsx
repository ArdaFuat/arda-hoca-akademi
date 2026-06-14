import { useMemo } from 'react';

const PYTHON_KEYWORDS = new Set([
  'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else',
  'except', 'False', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'None',
  'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'True', 'try', 'while', 'with', 'yield'
]);

const BUILTINS = new Set([
  'print', 'input', 'range', 'len', 'int', 'float', 'str', 'bool', 'list', 'dict', 'set', 'tuple',
  'sum', 'min', 'max', 'open', 'type', 'enumerate', 'zip', 'super', 'self'
]);

function tokenize(line) {
  const tokens = [];
  const regex = /(#.*$)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_][A-Za-z0-9_]*\b)|([+\-*/%=<>!&|^~]+)|([(){}\[\],.:;])/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ text: line.slice(lastIndex, match.index), className: 'syntax-plain' });
    }

    const text = match[0];
    let className = 'syntax-plain';
    if (match[1]) className = 'syntax-comment';
    else if (match[2]) className = 'syntax-string';
    else if (match[3]) className = 'syntax-number';
    else if (match[4]) {
      if (PYTHON_KEYWORDS.has(text)) className = 'syntax-keyword';
      else if (BUILTINS.has(text)) className = 'syntax-builtin';
      else className = 'syntax-variable';
    } else if (match[5]) className = 'syntax-operator';
    else if (match[6]) className = 'syntax-punctuation';

    tokens.push({ text, className });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < line.length) tokens.push({ text: line.slice(lastIndex), className: 'syntax-plain' });
  return tokens;
}

function getLines(code) {
  const normalized = String(code || '').replace(/\r\n/g, '\n');
  return normalized.length ? normalized.split('\n') : [''];
}

export function CodeBlock({ code = '', title = 'main.py', language = 'python', compact = false }) {
  const lines = useMemo(() => getLines(code), [code]);

  return (
    <div className={`vscode-card ${compact ? 'compact' : ''}`}>
      <div className="vscode-titlebar">
        <div className="vscode-dots" aria-hidden="true">
          <span></span><span></span><span></span>
        </div>
        <span className="vscode-file">{title}</span>
        <span className="vscode-lang">{language}</span>
      </div>
      <div className="vscode-code" role="region" aria-label={`${title} kod bloğu`}>
        {lines.map((line, index) => (
          <div className="vscode-line" key={`${index}-${line}`}>
            <span className="vscode-line-number">{index + 1}</span>
            <span className="vscode-line-code">
              {tokenize(line).map((token, tokenIndex) => (
                <span className={token.className} key={tokenIndex}>{token.text || ' '}</span>
              ))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CodeEditor({ value, onChange, rows = 10, placeholder = 'Kodunu buraya yaz...', title = 'main.py' }) {
  const lineCount = Math.max(rows, getLines(value).length);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  function handleKeyDown(event) {
    if (event.key !== 'Tab') return;
    event.preventDefault();
    const textarea = event.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const nextValue = `${value.slice(0, start)}    ${value.slice(end)}`;
    onChange(nextValue);
    requestAnimationFrame(() => {
      textarea.selectionStart = textarea.selectionEnd = start + 4;
    });
  }

  return (
    <div className="vscode-editor-card">
      <div className="vscode-titlebar">
        <div className="vscode-dots" aria-hidden="true">
          <span></span><span></span><span></span>
        </div>
        <span className="vscode-file">{title}</span>
        <span className="vscode-lang">editable</span>
      </div>
      <div className="vscode-editor-shell">
        <div className="vscode-editor-gutter" aria-hidden="true">
          {lineNumbers.map((number) => <span key={number}>{number}</span>)}
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={rows}
          spellCheck="false"
          wrap="off"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

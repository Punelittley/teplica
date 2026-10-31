const fs = require('fs');

function stripJsComments(code) {
  let result = '';
  let i = 0;
  const n = code.length;
  let inString = false;
  let stringChar = '';
  let inRegex = false;
  let inBlockComment = false;
  let inLineComment = false;

  while (i < n) {
    const c = code[i];
    const next = code[i + 1];

    if (inLineComment) {
      if (c === '\n') {
        inLineComment = false;
        result += c;
      }
      i++;
      continue;
    }

    if (inBlockComment) {
      if (c === '*' && next === '/') {
        inBlockComment = false;
        i += 2;
      } else {
        i++;
      }
      continue;
    }

    if (inString) {
      result += c;
      if (c === '\\') {
        result += next || '';
        i += 2;
        continue;
      }
      if (c === stringChar) {
        inString = false;
      }
      i++;
      continue;
    }

    if (inRegex) {
      result += c;
      if (c === '\\') {
        result += next || '';
        i += 2;
        continue;
      }
      if (c === '/') {
        inRegex = false;
      }
      i++;
      continue;
    }

    if (c === '"' || c === "'" || c === '`') {
      inString = true;
      stringChar = c;
      result += c;
      i++;
      continue;
    }

    if (c === '/' && next === '/') {
      inLineComment = true;
      i += 2;
      continue;
    }

    if (c === '/' && next === '*') {
      inBlockComment = true;
      i += 2;
      continue;
    }

    if (c === '/') {
      const prevNonWhitespace = result.trimEnd().slice(-1);
      if (/[\(\[,:=!&|;?\{\}]/.test(prevNonWhitespace) || /(return|case|delete|typeof|void)$/.test(result.trimEnd())) {
        inRegex = true;
        result += c;
        i++;
        continue;
      }
    }

    result += c;
    i++;
  }

  return result;
}

['assets/js/main.js', 'admin/admin.js'].forEach(f => {
  const original = fs.readFileSync(f, 'utf8');
  const stripped = stripJsComments(original);
  const outPath = 'scratch/' + f.replace(/[\/\\]/g, '_');
  fs.writeFileSync(outPath, stripped, 'utf8');
  console.log(f, 'Original:', original.length, 'Stripped:', stripped.length);
});

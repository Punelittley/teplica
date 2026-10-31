const fs = require('fs');
const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
let errors = 0;
htmlFiles.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  const matches = c.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi);
  if (matches) {
    matches.forEach((m, idx) => {
      const raw = m.replace(/<\/?script[^>]*>/gi, '').trim();
      try {
        JSON.parse(raw);
      } catch (e) {
        console.error('JSON-LD parse error in', f, 'block', idx, e.message);
        errors++;
      }
    });
  }
});
if (errors === 0) {
  console.log('All JSON-LD blocks across all HTML files are 100% valid JSON!');
}

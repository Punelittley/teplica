const fs = require('fs');

const code = fs.readFileSync('assets/js/catalog-data.js', 'utf8');
try {
  eval(code + '\nconsole.log("SUCCESS! Company name:", DEFAULT_CONFIG.company.name); console.log("Pricing items:", Object.keys(DEFAULT_CONFIG.pricing));');
} catch (e) {
  console.error('Eval error:', e);
  process.exit(1);
}

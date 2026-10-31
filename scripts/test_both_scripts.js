const fs = require('fs');

const catCode = fs.readFileSync('assets/js/catalog-data.js', 'utf8');
const mainCode = fs.readFileSync('assets/js/main.js', 'utf8');

// Mock DOM
global.window = global;
global.document = {
  addEventListener: () => {},
  querySelector: () => null,
  querySelectorAll: () => [],
  getElementById: () => null,
  documentElement: { style: {} }
};
global.localStorage = { getItem: () => null, setItem: () => {} };

try {
  eval(catCode);
  eval(mainCode);
  console.log('BOTH SCRIPTS EVALUATED COMPLETELY AND CLEANLY!');
} catch (e) {
  console.error('FAILED:', e);
  process.exit(1);
}

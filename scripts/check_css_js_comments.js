const fs = require('fs');
const files = [
  'assets/css/style.css',
  'assets/fonts/fonts.css',
  'admin/admin.css',
  'assets/js/main.js',
  'assets/js/catalog-data.js',
  'admin/admin.js'
];
files.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  const hasBlock = /\/\*[\s\S]*?\*\//.test(c);
  console.log(f, 'Has block comments:', hasBlock);
});

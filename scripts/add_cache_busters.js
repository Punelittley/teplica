const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
files.forEach(f => {
  let html = fs.readFileSync(f, 'utf8');
  let original = html;
  html = html.replace(/assets\/js\/catalog-data\.js(?:\?v=[\d\.]+)?/g, 'assets/js/catalog-data.js?v=2.5');
  html = html.replace(/assets\/js\/main\.js(?:\?v=[\d\.]+)?/g, 'assets/js/main.js?v=2.5');
  html = html.replace(/assets\/css\/style\.css(?:\?v=[\d\.]+)?/g, 'assets/css/style.css?v=2.5');
  if (html !== original) {
    fs.writeFileSync(f, html, 'utf8');
    console.log('Cache buster added to:', f);
  }
});

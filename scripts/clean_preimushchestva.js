const fs = require('fs');

let html = fs.readFileSync('preimushchestva.html', 'utf8');

// 1. Remove the bento-hero-grid with the oversized green plank and duplicates
const bentoStart = '<!-- ==========================================\n           1. BENTO GRID: Ключевой блок преимуществ';
const bentoEnd = '<!-- ==========================================\n           2. ИНЖЕНЕРНЫЕ СТАНДАРТЫ ЗАВОДА (С ФОТО)';

let startIndex = html.indexOf(bentoStart);
if (startIndex === -1) {
  startIndex = html.indexOf('<div class="bento-hero-grid">');
}
const endIndex = html.indexOf(bentoEnd);

if (startIndex !== -1 && endIndex !== -1) {
  html = html.substring(0, startIndex) + html.substring(endIndex);
  console.log('Removed duplicate bento-hero-grid and green plank from preimushchestva.html');
}

// 2. Remove emoji ⚠️ on line 344
html = html.replace(/<span style="font-size: 1\.5rem;">⚠️<\/span>/g, '<span style="color: #dc3545; font-size: 1.2rem; font-weight: 800;">✕ Риск</span>');

fs.writeFileSync('preimushchestva.html', html, 'utf8');
console.log('preimushchestva.html updated successfully');

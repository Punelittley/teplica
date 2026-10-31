const fs = require('fs');
const path = require('path');

const targetRepo = 'C:/Users/Nikolay/Desktop/teplica';
if (fs.existsSync(targetRepo)) {
  const files = [
    'index.html',
    'arochnye.html',
    'kaplevidnye.html',
    'domikom.html',
    'gryadki.html',
    'polikarbonat.html',
    'dostavka-sborka.html',
    'nashi-raboty.html',
    'otzyvy.html',
    'kontakty.html',
    'preimushchestva.html',
    'admin-gate-x79kd4.html',
    'admin/index.html',
    'admin/admin.css',
    'admin/admin.js',
    'assets/css/style.css',
    'assets/fonts/fonts.css',
    'assets/js/main.js',
    'assets/js/catalog-data.js',
    'robots.txt',
    'sitemap.xml'
  ];

  files.forEach(f => {
    const src = f;
    const dest = path.join(targetRepo, f);
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(src, dest);
    console.log('Synced:', f);
  });
}

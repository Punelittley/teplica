const fs = require('fs');
const path = require('path');

// 1. Обновляем database.json
const dbPath = path.join(__dirname, '..', 'database.json');
let db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
db.database.pricing.arch['10m'] = { name: '3х10 метров', price: 38500, oldPrice: 43000 };
db.database.pricing.foundation.timber10 = { name: 'Фундамент из бруса 100х100 (для 10м)', price: 9000 };
db.database.pricing.assembly['10m'] = { name: 'Профессиональная сборка 10м', price: 8000 };
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('database.json updated for 3x10');

// 2. Обновляем catalog-data.js
const catPath = path.join(__dirname, '..', 'assets', 'js', 'catalog-data.js');
let cat = fs.readFileSync(catPath, 'utf8');

if (!cat.includes('timber10')) {
  cat = cat.replace(
    /"timber8": \{ name: "Фундамент из бруса 100х100 \(для 8м\)", price: \d+ \}/,
    '"timber8": { name: "Фундамент из бруса 100х100 (для 8м)", price: 7500 },\n      "timber10": { name: "Фундамент из бруса 100х100 (для 10м)", price: 9000 }'
  );
}
if (!cat.includes('"10m": { name: "Профессиональная сборка 10м"')) {
  cat = cat.replace(
    /"8m": \{ name: "Профессиональная сборка 8м", price: \d+ \}/,
    '"8m": { name: "Профессиональная сборка 8м", price: 7500 },\n      "10m": { name: "Профессиональная сборка 10м", price: 8000 }'
  );
}

fs.writeFileSync(catPath, cat, 'utf8');
console.log('catalog-data.js updated for 3x10');

// 3. Обновляем arochnye.html
const archFile = path.join(__dirname, '..', 'arochnye.html');
let html = fs.readFileSync(archFile, 'utf8');

// Добавляем фото 3х10 в галерею
const thumbs3x10 = `            <div class="prod-thumb-item " data-idx="10" data-src="assets/images/products/arch_3x10/1.jpg" title="Арочная теплица 3х10 фасад на участке">
              <img src="assets/images/products/arch_3x10/1.jpg" alt="Арочная теплица 3х10 фасад на участке" loading="lazy">
            </div>
            <div class="prod-thumb-item " data-idx="11" data-src="assets/images/products/arch_3x10/2.jpg" title="Внутри длинной теплицы 3х10: грядки и простор">
              <img src="assets/images/products/arch_3x10/2.jpg" alt="Внутри длинной теплицы 3х10: грядки и простор" loading="lazy">
            </div>
            <div class="prod-thumb-item " data-idx="12" data-src="assets/images/products/arch_3x10/3.jpg" title="Теплица 3х10 вид сбоку">
              <img src="assets/images/products/arch_3x10/3.jpg" alt="Теплица 3х10 вид сбоку" loading="lazy">
            </div>`;

html = html.replace(/<div class="prod-thumb-item " data-idx="10"[\s\S]*?<div class="prod-thumb-item " data-idx="13"/,
  `${thumbs3x10}\n            <div class="prod-thumb-item " data-idx="13"`
);

// Обновляем строку опций в таблице характеристик
html = html.replace(
  /<tr><td>Дополнительные опции<\/td><td>.*?<\/td><\/tr>/,
  '<tr><td>Дополнительные опции</td><td>Усиленный шаг дуг 0.65 м (от 2 250 до 3 750 ₽), краб-система (от 1 500 до 2 500 ₽), фундамент из бруса (от 6 000 до 9 000 ₽), сборка (от 6 000 до 8 000 ₽)</td></tr>'
);

fs.writeFileSync(archFile, html, 'utf8');
console.log('arochnye.html updated for 3x10');

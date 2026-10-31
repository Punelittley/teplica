const fs = require('fs');
const path = require('path');

// 1. Обновляем catalog-data.js (DEFAULT_PRODUCTS)
const catPath = path.join(__dirname, '..', 'assets', 'js', 'catalog-data.js');
let cat = fs.readFileSync(catPath, 'utf8');

cat = cat.replace(
  /\{\s*id:\s*"prod-1"[\s\S]*?description:\s*"[^"]*"\s*\}/,
  `{
    id: "prod-1",
    category: "arch",
    name: "Арочная теплица 3×4 м",
    price: 25500,
    oldPrice: 28500,
    size: "3х4...3х10 м",
    badge: "Хит продаж",
    badgeType: "hit",
    image: "assets/images/products/arch_3x4/1.jpg",
    description: "Оцинкованный каркас 30×20 мм (труба на ребро, сталь 1.0 мм). Поликарбонат 4 мм (520 г/м²), 2 двери с укосами, 2 форточки и вся фурнитура в комплекте."
  }`
);
fs.writeFileSync(catPath, cat, 'utf8');
console.log('catalog-data.js prod-1 updated');

// 2. Обновляем arochnye.html галерею
const archFile = path.join(__dirname, '..', 'arochnye.html');
let html = fs.readFileSync(archFile, 'utf8');

// Добавляем фото 3х4 в начало списка миниатюр после 3х6
const thumbs3x4 = `            <div class="prod-thumb-item " data-idx="5" data-src="assets/images/products/arch_3x4/1.jpg" title="Арочная теплица 3х4 на участке">
              <img src="assets/images/products/arch_3x4/1.jpg" alt="Арочная теплица 3х4 на участке" loading="lazy">
            </div>
            <div class="prod-thumb-item " data-idx="6" data-src="assets/images/products/arch_3x4/2.jpg" title="Теплица 3х4 вид сбоку">
              <img src="assets/images/products/arch_3x4/2.jpg" alt="Теплица 3х4 вид сбоку" loading="lazy">
            </div>
            <div class="prod-thumb-item " data-idx="7" data-src="assets/images/products/arch_3x4/3.jpg" title="Теплица 3х4 на брусе 100х100">
              <img src="assets/images/products/arch_3x4/3.jpg" alt="Теплица 3х4 на брусе 100х100" loading="lazy">
            </div>
            <div class="prod-thumb-item " data-idx="8" data-src="assets/images/products/arch_3x4/4.jpg" title="Фасад 3х4 с открытой дверью">
              <img src="assets/images/products/arch_3x4/4.jpg" alt="Фасад 3х4 с открытой дверью" loading="lazy">
            </div>
            <div class="prod-thumb-item " data-idx="9" data-src="assets/images/products/arch_3x4/5.jpg" title="Теплица 3х4 на огороде">
              <img src="assets/images/products/arch_3x4/5.jpg" alt="Теплица 3х4 на огороде" loading="lazy">
            </div>`;

html = html.replace(/<div class="prod-thumb-item " data-idx="5"[\s\S]*?<div class="prod-thumb-item " data-idx="10"/,
  `${thumbs3x4}\n            <div class="prod-thumb-item " data-idx="10"`
);

// Добавляем упоминание бесплатного хранения до конца лета в блок преимуществ
html = html.replace(/Бесплатное хранение до лета/g, 'Бесплатное хранение до конца лета');
html = html.replace(/до 31\.06\.2026 г\./g, 'до 31 августа 2026 г.');

fs.writeFileSync(archFile, html, 'utf8');
console.log('arochnye.html updated with 3x4 photos and storage note');

const fs = require('fs');
const path = require('path');

// 1. Обновляем database.json
const dbPath = path.join(__dirname, '..', 'database.json');
let db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
db.database.pricing.arch['6m'] = { name: '3х6 метров', price: 29500, oldPrice: 33000 };
db.database.pricing.foundation.timber6 = { name: 'Фундамент из бруса 100х100 (для 6м)', price: 6500 };
db.database.pricing.assembly['6m'] = { name: 'Профессиональная сборка 6м', price: 7000 };
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('database.json updated for 3x6');

// 2. Обновляем catalog-data.js
const catPath = path.join(__dirname, '..', 'assets', 'js', 'catalog-data.js');
let cat = fs.readFileSync(catPath, 'utf8');
cat = cat.replace(/"timber6":\s*\{\s*name:\s*"Фундамент из бруса 100х100 \(для 6м\)",\s*price:\s*\d+\s*\}/, '"timber6": { name: "Фундамент из бруса 100х100 (для 6м)", price: 6500 }');
cat = cat.replace(/"6m":\s*\{\s*name:\s*"Профессиональная сборка 6м",\s*price:\s*\d+\s*\}/, '"6m": { name: "Профессиональная сборка 6м", price: 7000 }');
fs.writeFileSync(catPath, cat, 'utf8');
console.log('catalog-data.js updated for 3x6');

// 3. Обновляем arochnye.html
const archFile = path.join(__dirname, '..', 'arochnye.html');
let html = fs.readFileSync(archFile, 'utf8');

// Главное фото — реальное фото 3х6
html = html.replace(
  /<img src="assets\/images\/products\/p1\/2\.jpg" alt=".*?" class="prod-main-img" id="archMainImg">/,
  '<img src="assets/images/products/arch_3x6/1.jpg" alt="Арочная теплица 3х6" class="prod-main-img" id="archMainImg">'
);

// Первые 4 миниатюры — новые фото 3х6, затем фото 3х8
const newThumbs = `            <div class="prod-thumb-item active" data-idx="0" data-src="assets/images/products/arch_3x6/1.jpg" title="Арочная теплица 3х6 фасад на брусе">
              <img src="assets/images/products/arch_3x6/1.jpg" alt="Арочная теплица 3х6 фасад на брусе" loading="lazy">
            </div>
            <div class="prod-thumb-item " data-idx="1" data-src="assets/images/products/arch_3x6/2.jpg" title="Вид внутри теплицы 3х6: подготовленный грунт и дуги">
              <img src="assets/images/products/arch_3x6/2.jpg" alt="Вид внутри теплицы 3х6: подготовленный грунт и дуги" loading="lazy">
            </div>
            <div class="prod-thumb-item " data-idx="2" data-src="assets/images/products/arch_3x6/3.jpg" title="Теплица 3х6 на участке с грядками">
              <img src="assets/images/products/arch_3x6/3.jpg" alt="Теплица 3х6 на участке с грядками" loading="lazy">
            </div>
            <div class="prod-thumb-item " data-idx="3" data-src="assets/images/products/arch_3x6/4.jpg" title="Теплица 3х6 на солнце, форточка открыта">
              <img src="assets/images/products/arch_3x6/4.jpg" alt="Теплица 3х6 на солнце, форточка открыта" loading="lazy">
            </div>
            <div class="prod-thumb-item " data-idx="4" data-src="assets/images/products/p1/arch_3x8.jpg" title="Арочная теплица 3х8 на фундаменте">
              <img src="assets/images/products/p1/arch_3x8.jpg" alt="Арочная теплица 3х8 на фундаменте" loading="lazy">
            </div>`;

html = html.replace(/<div class="prod-thumbs-strip" id="archThumbs">[\s\S]*?<div class="prod-thumb-item " data-idx="2"/,
  `<div class="prod-thumbs-strip" id="archThumbs">\n${newThumbs}\n            <div class="prod-thumb-item " data-idx="5"`
);

// Описание и опции в блоке
html = html.replace(/Поликарбонат 4 мм:<\/strong> плотность 0\.52 кг\/м²/, 'Поликарбонат 4 мм:</strong> плотность 520 г/м² (0.52 кг/м²)');
html = html.replace(/<td>Опции для 8м<\/td>/g, '<td>Дополнительные опции</td>');

fs.writeFileSync(archFile, html, 'utf8');
console.log('arochnye.html updated with 3x6 photos and options');

// 4. Обновляем index.html — карточка Арочная 3х6
const indexFile = path.join(__dirname, '..', 'index.html');
let indexHtml = fs.readFileSync(indexFile, 'utf8');
indexHtml = indexHtml.replace(/src="assets\/images\/products\/p1\/2\.jpg"/, 'src="assets/images/products/arch_3x6/1.jpg"');
fs.writeFileSync(indexFile, indexHtml, 'utf8');
console.log('index.html updated with arch_3x6/1.jpg');

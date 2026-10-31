const fs = require('fs');
const path = require('path');

// 1. Обновление database.json
const dbPath = path.join(__dirname, '..', 'database.json');
let db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
let p = db.database.pricing;

p.arch['4m'] = { name: '3х4 метра', price: 25500, oldPrice: 28500 };
p.arch['6m'] = { name: '3х6 метров', price: 29500, oldPrice: 33000 };
p.arch['8m'] = { name: '3х8 метров', price: 34200, oldPrice: 38500 };
p.arch['10m'] = { name: '3х10 метров', price: 38500, oldPrice: 43000 };

p.drop['4m'] = { name: '3х4 метра', price: 26500, oldPrice: 29900 };
p.drop['6m'] = { name: '3х6 метров', price: 32500, oldPrice: 36500 };
p.drop['8m'] = { name: '3х8 метров', price: 38500, oldPrice: 43500 };

p.poly.prem4.price = 3500;
p.poly.prem6.price = 4700;

p.foundation.timber4.price = 6000;
p.foundation.timber6.price = 6000;
p.foundation.timber8.price = 7500;

p.beds = {
  set3x4: { name: 'Комплект грядок в теплицу 3х4 м (3 ряда)', price: 6000, oldPrice: 7200 },
  set3x6: { name: 'Комплект грядок в теплицу 3х6 м (3 ряда)', price: 9500, oldPrice: 11000 }
};

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('database.json updated with VK prices');

// 2. arochnye.html
const archFile = path.join(__dirname, '..', 'arochnye.html');
let archHtml = fs.readFileSync(archFile, 'utf8');
archHtml = archHtml.replace(/window\.archPricingTable\s*=\s*\{[\s\S]*?\};/, 
  'window.archPricingTable = {"4m":{"name":"3х4 метра","price":25500,"oldPrice":28500},"6m":{"name":"3х6 метров","price":29500,"oldPrice":33000},"8m":{"name":"3х8 метров","price":34200,"oldPrice":38500},"10m":{"name":"3х10 метров","price":38500,"oldPrice":43000}};'
);
archHtml = archHtml.replace(/id="archPriceVal">.*?<\/span>/, 'id="archPriceVal">29 500 ₽</span>');
archHtml = archHtml.replace(/id="archOldPriceVal">.*?<\/span>/, 'id="archOldPriceVal">33 000 ₽</span>');
archHtml = archHtml.replace(/data-subject="Заказ: Арочные теплицы 3х6м \(от .*?\)"/, 'data-subject="Заказ: Арочные теплицы 3х6м (29 500 ₽)"');

// Таблица цен в arochnye.html
archHtml = archHtml.replace(/<td>21 900 ₽<\/td>/g, '<td>25 500 ₽</td>');
archHtml = archHtml.replace(/<td>26 900 ₽<\/td>/g, '<td>29 500 ₽</td>');
archHtml = archHtml.replace(/<td>32 400 ₽<\/td>/g, '<td>34 200 ₽</td>');
archHtml = archHtml.replace(/<td>37 900 ₽<\/td>/g, '<td>38 500 ₽</td>');
archHtml = archHtml.replace(/<td>24 400 ₽<\/td>/g, '<td>28 000 ₽</td>');
archHtml = archHtml.replace(/<td>29 400 ₽<\/td>/g, '<td>32 000 ₽</td>');
archHtml = archHtml.replace(/<td>34 900 ₽<\/td>/g, '<td>36 700 ₽</td>');
archHtml = archHtml.replace(/<td>40 400 ₽<\/td>/g, '<td>41 000 ₽</td>');

fs.writeFileSync(archFile, archHtml, 'utf8');
console.log('arochnye.html updated');

// 3. kaplevidnye.html
const dropFile = path.join(__dirname, '..', 'kaplevidnye.html');
let dropHtml = fs.readFileSync(dropFile, 'utf8');
dropHtml = dropHtml.replace(/window\.dropPricingTable\s*=\s*\{[\s\S]*?\};/, 
  'window.dropPricingTable = {"4m":{"name":"3х4 метра","price":26500,"oldPrice":29900},"6m":{"name":"3х6 метров","price":32500,"oldPrice":36500},"8m":{"name":"3х8 метров","price":38500,"oldPrice":43500},"10m":{"name":"3х10 метров","price":44500,"oldPrice":50500}};'
);
dropHtml = dropHtml.replace(/id="dropPriceVal">.*?<\/span>/, 'id="dropPriceVal">32 500 ₽</span>');
dropHtml = dropHtml.replace(/id="dropOldPriceVal">.*?<\/span>/, 'id="dropOldPriceVal">36 500 ₽</span>');
dropHtml = dropHtml.replace(/<td>24 900 ₽<\/td>/g, '<td>26 500 ₽</td>');
dropHtml = dropHtml.replace(/<td>30 900 ₽<\/td>/g, '<td>32 500 ₽</td>');
dropHtml = dropHtml.replace(/<td>37 400 ₽<\/td>/g, '<td>38 500 ₽</td>');
dropHtml = dropHtml.replace(/<td>43 900 ₽<\/td>/g, '<td>44 500 ₽</td>');

fs.writeFileSync(dropFile, dropHtml, 'utf8');
console.log('kaplevidnye.html updated');

// 4. gryadki.html
const gryadkiFile = path.join(__dirname, '..', 'gryadki.html');
let gryadkiHtml = fs.readFileSync(gryadkiFile, 'utf8');
gryadkiHtml = gryadkiHtml.replace(/от 1 250 ₽/g, 'от 1 550 ₽');
gryadkiHtml = gryadkiHtml.replace(/<span>Для теплицы 3х6 м \(3 ряда\):<\/span>\s*<strong[^>]*>от 7 800 ₽<\/strong>/,
  '<span>Для теплицы 3х6 м (3 ряда):</span>\n                <strong style="color: #1b4332; font-size: 1.05rem;">9 500 ₽</strong>'
);
gryadkiHtml = gryadkiHtml.replace(/<span>Для теплицы 3х4 м \(3 ряда\):<\/span>\s*<strong[^>]*>от 6 000 ₽<\/strong>/,
  '<span>Для теплицы 3х4 м (3 ряда):</span>\n                <strong style="color: #1b4332; font-size: 1.05rem;">6 000 ₽</strong>'
);
fs.writeFileSync(gryadkiFile, gryadkiHtml, 'utf8');
console.log('gryadki.html updated');

// 5. polikarbonat.html
const polyFile = path.join(__dirname, '..', 'polikarbonat.html');
let polyHtml = fs.readFileSync(polyFile, 'utf8');
polyHtml = polyHtml.replace(/2 790 ₽/g, '3 500 ₽');
polyHtml = polyHtml.replace(/3 290 ₽/g, '3 500 ₽');
polyHtml = polyHtml.replace(/4 690 ₽/g, '4 700 ₽');
fs.writeFileSync(polyFile, polyHtml, 'utf8');
console.log('polikarbonat.html updated');

console.log('All files updated successfully with VK prices!');

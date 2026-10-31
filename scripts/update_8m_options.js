const fs = require('fs');

let db = JSON.parse(fs.readFileSync('database.json', 'utf8'));
let p = db.database.pricing;
p.assembly['8m'] = { name: 'Профессиональная сборка 8м', price: 7500 };
p.foundation.timber8 = { name: 'Фундамент из бруса 100х100 (для 8м)', price: 7500 };
fs.writeFileSync('database.json', JSON.stringify(db, null, 2), 'utf8');

let cat = fs.readFileSync('assets/js/catalog-data.js', 'utf8');
cat = cat.replace(/"8m":\s*\{\s*name:\s*"Профессиональная сборка 8м",\s*price:\s*\d+\s*\}/, '"8m": { name: "Профессиональная сборка 8м", price: 7500 }');
cat = cat.replace(/"timber8":\s*\{\s*name:\s*"Фундамент из бруса 100х100 \(для 8м\)",\s*price:\s*\d+\s*\}/, '"timber8": { name: "Фундамент из бруса 100х100 (для 8м)", price: 7500 }');
fs.writeFileSync('assets/js/catalog-data.js', cat, 'utf8');

console.log('assembly 8m and foundation 8m updated to 7500');

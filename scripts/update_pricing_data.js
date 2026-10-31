const fs = require('fs');

// 1. Update database.json
const db = JSON.parse(fs.readFileSync('database.json', 'utf8'));
if (!db.database.pricing) db.database.pricing = {};

db.database.pricing.house = {
  "4m": { "name": "3х4 метра", "price": 27900, "oldPrice": 30900 },
  "6m": { "name": "3х6 метров", "price": 34900, "oldPrice": 38900 },
  "8m": { "name": "3х8 метров", "price": 41900, "oldPrice": 46900 },
  "10m": { "name": "3х10 метров", "price": 48900, "oldPrice": 54900 }
};

db.database.pricing.tape = {
  "name": "Стяжная оцинкованная лента (комплект)",
  "price": 1800,
  "oldPrice": 2400
};

fs.writeFileSync('database.json', JSON.stringify(db, null, 2), 'utf8');
console.log('database.json updated');

// 2. Update catalog-data.js
let cd = fs.readFileSync('assets/js/catalog-data.js', 'utf8');

if (!cd.includes('house: {')) {
  cd = cd.replace(
    /drop:\s*\{[\s\S]*?\},/,
    `drop: {
      "4m": { name: "3х4 метра", price: 24900, oldPrice: 27900 },
      "6m": { name: "3х6 метров", price: 30900, oldPrice: 34900 },
      "8m": { name: "3х8 метров", price: 37400, oldPrice: 42500 }
    },
    house: {
      "4m": { name: "3х4 метра", price: 27900, oldPrice: 30900 },
      "6m": { name: "3х6 метров", price: 34900, oldPrice: 38900 },
      "8m": { name: "3х8 метров", price: 41900, oldPrice: 46900 },
      "10m": { name: "3х10 метров", price: 48900, oldPrice: 54900 }
    },`
  );
}

if (!cd.includes('tape: {')) {
  cd = cd.replace(
    /delivery:\s*\{[\s\S]*?\}\s*\}/,
    `delivery: {
      baseYar: 1500,
      perKm: 40
    },
    tape: {
      name: "Стяжная оцинкованная лента",
      price: 1800,
      oldPrice: 2400
    },
    beds: {
      set2: {
        name: "Комплект оцинкованных грядок (2 ряда)",
        price: 4500,
        oldPrice: 5500
      }
    },
    autovent: {
      name: "Автопроветриватель форточки (термопривод)",
      price: 2400,
      oldPrice: 2900
    }
  }`
  );
}

fs.writeFileSync('assets/js/catalog-data.js', cd, 'utf8');
console.log('catalog-data.js updated');

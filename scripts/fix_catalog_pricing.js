const fs = require('fs');

let s = fs.readFileSync('assets/js/catalog-data.js', 'utf8');

const pStart = s.indexOf('  pricing: {');
const pEnd = s.indexOf('  products: DEFAULT_PRODUCTS');

if (pStart === -1 || pEnd === -1) {
  console.error('Could not locate pricing bounds in catalog-data.js');
  process.exit(1);
}

const cleanPricing = `  pricing: {
    arch: {
      "4m": { name: "3х4 метра", price: 21900, oldPrice: 24500 },
      "6m": { name: "3х6 метров", price: 26900, oldPrice: 30500 },
      "8m": { name: "3х8 метров", price: 32400, oldPrice: 36800 },
      "10m": { name: "3х10 метров", price: 37900, oldPrice: 42900 }
    },
    drop: {
      "4m": { name: "3х4 метра", price: 24900, oldPrice: 27900 },
      "6m": { name: "3х6 метров", price: 30900, oldPrice: 34900 },
      "8m": { name: "3х8 метров", price: 37400, oldPrice: 42500 }
    },
    house: {
      "4m": { name: "3х4 метра", price: 27900, oldPrice: 30900 },
      "6m": { name: "3х6 метров", price: 34900, oldPrice: 38900 },
      "8m": { name: "3х8 метров", price: 41900, oldPrice: 46900 },
      "10m": { name: "3х10 метров", price: 48900, oldPrice: 54900 }
    },
    step: {
      "100": { name: "Шаг 1 метр", price: 0 },
      "65": { name: "Усиленный шаг 0.65 м", price: 2500 }
    },
    poly: {
      "eco4": { name: "Поликарбонат 4 мм Стандарт (с УФ)", price: 0 },
      "prem4": { name: "Поликарбонат 4 мм Премиум повышенной плотности", price: 3200 },
      "prem6": { name: "Поликарбонат 6 мм Усиленный (для круглого года)", price: 6500 }
    },
    foundation: {
      "ground": { name: "Грунтозацепы (в комплекте)", price: 0 },
      "timber4": { name: "Фундамент из бруса 100х100 (для 4м)", price: 3800 },
      "timber6": { name: "Фундамент из бруса 100х100 (для 6м)", price: 4900 },
      "timber8": { name: "Фундамент из бруса 100х100 (для 8м)", price: 6200 }
    },
    assembly: {
      "none": { name: "Соберу сам (инструкция в комплекте)", price: 0 },
      "4m": { name: "Профессиональная сборка 4м", price: 4000 },
      "6m": { name: "Профессиональная сборка 6м", price: 5000 },
      "8m": { name: "Профессиональная сборка 8м", price: 6000 }
    },
    delivery: {
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
  },\n`;

s = s.substring(0, pStart) + cleanPricing + s.substring(pEnd);
fs.writeFileSync('assets/js/catalog-data.js', s, 'utf8');
console.log('Cleaned and restored pricing in catalog-data.js');

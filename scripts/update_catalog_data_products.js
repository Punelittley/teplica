const fs = require('fs');
let s = fs.readFileSync('assets/js/catalog-data.js', 'utf8');

s = s.replace(/\{\s*id:\s*"prod-7"[\s\S]*?description:\s*"[^"]*"\s*\}/, 
`{
    id: "prod-7",
    category: "drop",
    name: "Теплица «Капелька» 3 м",
    price: 26500,
    oldPrice: 29900,
    size: "3х4...3х10 м",
    badge: "Снегосброс",
    badgeType: "hit",
    image: "assets/images/products/kapelka/1.jpg",
    description: "Оцинкованный профиль 30×20 мм, заострённая крыша — снег скатывается сам. 2 двери, 2 форточки и поликарбонат 4 мм с УФ-защитой."
  }`
);

s = s.replace(/\{\s*id:\s*"prod-8"[\s\S]*?description:\s*"[^"]*"\s*\}/,
`{
    id: "prod-8",
    category: "beds",
    name: "Оцинкованные грядки для теплиц",
    price: 1550,
    oldPrice: 2000,
    size: "высота 20 см",
    badge: "Удобно",
    badgeType: "hit",
    image: "assets/images/products/p8/1.jpg",
    description: "Завальцованные безопасные края, толстая сталь с цинковым покрытием. Земля не осыпается, спина не устает."
  }`
);

fs.writeFileSync('assets/js/catalog-data.js', s, 'utf8');
console.log('catalog-data.js updated with prod-7 and prod-8');

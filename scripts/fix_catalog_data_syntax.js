const fs = require('fs');
let s = fs.readFileSync('assets/js/catalog-data.js', 'utf8');

// Normalize line endings temporarily or use regex
s = s.replace(/\s+"6m":\s*\{\s*name:\s*"3х6 метров",\s*price:\s*30900,\s*oldPrice:\s*34900\s*\},\s*"8m":\s*\{\s*name:\s*"3х8 метров",\s*price:\s*37400,\s*oldPrice:\s*42500\s*\}\s*\},/g, '');

fs.writeFileSync('assets/js/catalog-data.js', s, 'utf8');
console.log('Fixed catalog-data.js');

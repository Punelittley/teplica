const fs = require('fs');
const path = require('path');

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'admin-gate-x79kd4.html');

console.log('Auditing HTML files for SEO and comments:');
htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const title = (content.match(/<title>([\s\S]*?)<\/title>/i) || [])[1];
  const desc = (content.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) || [])[1];
  const canonical = (content.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i) || [])[1];
  const h1s = content.match(/<h1[\s\S]*?<\/h1>/gi) || [];
  const ogTitle = (content.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i) || [])[1];
  const schema = content.includes('application/ld+json');
  const htmlComments = (content.match(/<!--[\s\S]*?-->/g) || []).length;

  console.log(`\n=== ${file} ===`);
  console.log(`Title: ${title ? title.trim() : 'MISSING'}`);
  console.log(`Description: ${desc ? desc.substring(0, 70) + '...' : 'MISSING'}`);
  console.log(`Canonical: ${canonical || 'MISSING'}`);
  console.log(`H1 count: ${h1s.length}`);
  console.log(`OG Title: ${ogTitle || 'MISSING'}`);
  console.log(`Schema.org: ${schema}`);
  console.log(`HTML comments count: ${htmlComments}`);
});

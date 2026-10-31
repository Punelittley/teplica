const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  content = content.replace(/<a href="kontakty\.html" class="nav-link">Контакты<\/a>/g, '<a href="kontakty.html" class="nav-link">Выставочная площадка</a>');
  content = content.replace(/<a href="kontakty\.html" class="nav-link active">Контакты<\/a>/g, '<a href="kontakty.html" class="nav-link active">Выставочная площадка</a>');
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated nav in:', file);
  }
});

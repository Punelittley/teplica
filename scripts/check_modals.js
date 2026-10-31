const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const m = content.match(/<div class="modal-box">([\s\S]*?)<\/form>/);
  if (m) {
    const hasGalina = content.includes('Галина Сергеевна');
    const hasSpecialist = content.includes('Специалист подробно ответит');
    const hasMasterWait = content.includes('Жду звонка мастера');
    console.log(`${f}: modal found | Galina: ${hasGalina} | Specialist: ${hasSpecialist} | MasterWait: ${hasMasterWait}`);
  } else {
    console.log(`${f}: NO modal-box`);
  }
});

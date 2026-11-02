const fs = require('fs');

const files = [
  'index.html', 'arochnye.html', 'domikom.html', 'kaplevidnye.html',
  'gryadki.html', 'polikarbonat.html', 'dostavka-sborka.html',
  'nashi-raboty.html', 'preimushchestva.html', 'otzyvy.html', 'kontakty.html'
];

let allPassed = true;

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const hasMainJs = content.includes('assets/js/main.js');
  const hasCatalogData = content.includes('assets/js/catalog-data.js');
  const hasModal = content.includes('modalOverlay');
  const hasLeadForm = content.includes('js-lead-form');
  const hasPhoneInput = content.includes('name="phone"');
  const hasNameInput = content.includes('name="name"');
  const hasSubjectInput = content.includes('id="modalSubject"');
  const hasLeadTypeInput = content.includes('id="modalLeadType"');
  const hasModalTitle = content.includes('id="modalTitle"');
  const hasModalSubtitle = content.includes('id="modalSubtitle"');
  const hasModalClose = content.includes('id="modalCloseBtn"');
  const modalButtonsCount = (content.match(/data-open-modal/g) || []).length;
  const leadFormsCount = (content.match(/class="[^"]*js-lead-form/g) || []).length;

  const ok = hasCatalogData && hasMainJs && hasModal && hasLeadForm && hasPhoneInput && hasNameInput && hasSubjectInput && hasLeadTypeInput && hasModalTitle && hasModalSubtitle && hasModalClose;
  if (!ok) allPassed = false;

  console.log(`${f}: [${ok ? 'PASS' : 'FAIL'}] - Forms: ${leadFormsCount}, Modal trigger buttons: ${modalButtonsCount}`);
});

console.log('Overall forms audit passed:', allPassed);

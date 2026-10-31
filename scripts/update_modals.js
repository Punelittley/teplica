const fs = require('fs');
const path = require('path');

const files = [
  'index.html',
  'arochnye.html',
  'kaplevidnye.html',
  'domikom.html',
  'dostavka-sborka.html',
  'gryadki.html',
  'kontakty.html',
  'nashi-raboty.html',
  'otzyvy.html',
  'polikarbonat.html',
  'preimushchestva.html'
];

const standardModal = `  <!-- Модальное окно заявки / звонка мастера -->
  <div class="modal-overlay" id="modalOverlay">
    <div class="modal-box">
      <button class="modal-close-btn" id="modalCloseBtn" aria-label="Закрыть">&times;</button>
      <h3 style="font-size: 1.45rem; font-weight: 800; color: var(--color-primary-dark); margin-bottom: 8px;" id="modalTitle">
        Заказать звонок мастера
      </h3>
      <p style="font-size: 0.92rem; color: var(--color-text-muted); margin-bottom: 20px;" id="modalSubtitle">
        Специалист подробно ответит на все вопросы
      </p>
      <form class="js-lead-form">
        <input type="hidden" name="subject" id="modalSubject" value="Заказ звонка мастера">
        <input type="hidden" name="lead_type" id="modalLeadType" value="callback">
        <div class="form-group">
          <label class="form-label">Ваше имя:</label>
          <input type="text" name="name" class="form-input" placeholder="Например: Галина Сергеевна" required>
        </div>
        <div class="form-group">
          <label class="form-label">Телефон для связи:</label>
          <input type="tel" name="phone" class="form-input" placeholder="+7 (___) ___-__-__" required>
        </div>
        <div class="form-group">
          <label class="form-label">Пожелания или вопрос (необязательно):</label>
          <textarea name="comment" class="form-textarea" rows="3" placeholder="Например: перезвоните во второй половине дня, интересует арочная теплица 3х6"></textarea>
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;">
          Жду звонка мастера →
        </button>
        <div style="font-size: 0.78rem; color: var(--color-text-muted); text-align: center; margin-top: 10px;">
          Конфиденциальность гарантируется. Ваши данные никогда не передаются третьим лицам.
        </div>
      </form>
    </div>
  </div>`;

files.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${file}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Регулярное выражение для поиска всего блока modalOverlay
  const modalRegex = /<!--[^\n]*?[Мм]одальн[^\n]*?-->[\s\S]*?<div class="modal-overlay" id="modalOverlay">[\s\S]*?<\/div>\s*<\/div>|<div class="modal-overlay" id="modalOverlay">[\s\S]*?<\/div>\s*<\/div>/;
  
  if (modalRegex.test(content)) {
    content = content.replace(modalRegex, standardModal);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated modal in ${file}`);
  } else {
    console.warn(`Could not find modal in ${file}`);
  }
});

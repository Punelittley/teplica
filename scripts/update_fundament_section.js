const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'dostavka-sborka.html');
let html = fs.readFileSync(filePath, 'utf8');

// 1. Заменяем фото в галерее
html = html.replace('src="assets/images/products/p6/2.jpg"', 'src="assets/images/products/fundament/1.jpg"');

// 2. Добавляем отдельный блок фундамента из бруса с id="brus"
const fundamentSection = `      <!-- ФУНДАМЕНТ ПОД ТЕПЛИЦУ ИЗ БРУСА 100х100 -->
      <section id="brus" style="margin-bottom: 50px; background: #ffffff; border: 1.5px solid #d8f3dc; border-radius: 24px; padding: 36px 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.03);">
        <div style="font-size: 0.85rem; font-weight: 800; color: #2d6a4f; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">Дополнительная заводская опция</div>
        <h2 style="font-size: 1.65rem; font-weight: 800; color: #1b4332; margin-bottom: 12px;">Фундамент под теплицу из бруса 100×100</h2>
        <p style="font-size: 1rem; color: #2d3748; line-height: 1.6; margin-bottom: 24px; max-width: 900px;">
          Основание изготавливается из деревянного бруса сечением 100×100 мм под размеры любой теплицы: 3×4, 3×6, 3×8, 3×10 м. Брус пропитывается невымываемым антисептиком, защищающим древесину от влаги, гниения и прямого контакта с сырым грунтом.
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 30px;">
          <div style="background: #f8faf8; border: 1px solid #e1ece4; border-radius: 16px; padding: 20px;">
            <div style="font-weight: 800; color: #1b4332; font-size: 1.05rem; margin-bottom: 6px;">Идеальный лазерный уровень</div>
            <div style="font-size: 0.92rem; color: #4a5568; line-height: 1.5;">Создает жесткое основание под каркас, компенсирует неровности рельефа. Двери и форточки открываются без перекосов.</div>
          </div>
          <div style="background: #f8faf8; border: 1px solid #e1ece4; border-radius: 16px; padding: 20px;">
            <div style="font-weight: 800; color: #1b4332; font-size: 1.05rem; margin-bottom: 6px;">Защита от сдвига и ветра</div>
            <div style="font-size: 0.92rem; color: #4a5568; line-height: 1.5;">Каркас крепится к брусу болтами через металлические уголки, а не просто стоит на грунте — теплицу не сорвет ветром.</div>
          </div>
          <div style="background: #f8faf8; border: 1px solid #e1ece4; border-radius: 16px; padding: 20px;">
            <div style="font-weight: 800; color: #1b4332; font-size: 1.05rem; margin-bottom: 6px;">+10 см высоты и лучший микроклимат</div>
            <div style="font-size: 0.92rem; color: #4a5568; line-height: 1.5;">Теплица приподнимается над землей, объем воздуха внутри увеличивается, а нижняя обвязка защищена от сырости.</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: center; background: #f0f7f2; border-radius: 18px; padding: 24px;" class="del-steps-grid">
          <div>
            <h3 style="font-size: 1.25rem; font-weight: 800; color: #1b4332; margin-bottom: 12px;">Стоимость фундамента из бруса 100×100:</h3>
            <ul style="list-style: none; padding: 0; margin: 0 0 18px; display: flex; flex-direction: column; gap: 8px; font-size: 0.95rem;">
              <li style="display: flex; justify-content: space-between; border-bottom: 1px dashed #c3decb; padding-bottom: 4px;">
                <span>Фундамент под теплицу 3×4 м:</span>
                <strong style="color: #1b4332;">6 000 ₽</strong>
              </li>
              <li style="display: flex; justify-content: space-between; border-bottom: 1px dashed #c3decb; padding-bottom: 4px;">
                <span>Фундамент под теплицу 3×6 м:</span>
                <strong style="color: #1b4332;">6 500 ₽</strong>
              </li>
              <li style="display: flex; justify-content: space-between; border-bottom: 1px dashed #c3decb; padding-bottom: 4px;">
                <span>Фундамент под теплицу 3×8 м:</span>
                <strong style="color: #1b4332;">7 500 ₽</strong>
              </li>
              <li style="display: flex; justify-content: space-between; border-bottom: 1px dashed #c3decb; padding-bottom: 4px;">
                <span>Фундамент под теплицу 3×10 м:</span>
                <strong style="color: #1b4332;">9 000 ₽</strong>
              </li>
            </ul>
            <button type="button" class="btn btn-primary" data-open-modal data-title="Заказать теплицу с фундаментом" data-subtitle="Подберем нужный размер бруса и рассчитаем стоимость с доставкой" data-subject="Заказ: Фундамент под теплицу из бруса">
              Заказать теплицу с фундаментом →
            </button>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <img src="assets/images/products/fundament/1.jpg" alt="Фундамент для теплиц из бруса 100х100" style="width: 100%; height: 160px; object-fit: cover; border-radius: 12px;">
            <img src="assets/images/products/fundament/4.jpg" alt="Уголок и болтовое крепление каркаса теплицы к брусу" style="width: 100%; height: 160px; object-fit: cover; border-radius: 12px;">
          </div>
        </div>
      </section>`;

html = html.replace('<!-- Фотогалерея реальных работ -->', `${fundamentSection}\n\n      <!-- Фотогалерея реальных работ -->`);

fs.writeFileSync(filePath, html, 'utf8');
console.log('dostavka-sborka.html updated with rich fundament section');

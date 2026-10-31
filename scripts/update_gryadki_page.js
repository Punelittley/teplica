const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'gryadki.html');
let html = fs.readFileSync(filePath, 'utf8');

// 1. Заменяем фото в карточках
html = html.replace('src="assets/images/products/p7/clean_gryadki.jpg"', 'src="assets/images/products/gryadki/2.jpg"');
html = html.replace('src="assets/images/products/p8/clean_p8.png"', 'src="assets/images/products/gryadki/1.jpg"');

// 2. Убираем случайные эмодзи
html = html.replace(/<span style="font-size: 1\.5rem;">🪵<\/span>/g, '');

// 3. Добавляем подробную таблицу с официальным прайсом на грядки
const priceTableSection = `      <!-- ОФИЦИАЛЬНЫЙ ПРАЙС-ЛИСТ НА ОЦИНКОВАННЫЕ ГРЯДКИ ПО РАЗМЕРАМ -->
      <div class="prod-details-box" style="margin-bottom: 50px; background: #ffffff; border: 1.5px solid #d8f3dc; border-radius: 24px; padding: 32px;">
        <div style="font-size: 0.85rem; font-weight: 800; color: #2d6a4f; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">Точный прайс завода</div>
        <h2 style="font-size: 1.5rem; font-weight: 800; color: #1b4332; margin-bottom: 8px;">Прайс на оцинкованные грядки</h2>
        <p style="font-size: 0.95rem; color: #556b62; margin-bottom: 24px;">Размеры указаны: длина × ширина × высота борта. Через каждый метр установлена перемычка для жесткости. Поставляются в удобной компактной коробке.</p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 28px; margin-bottom: 28px;">
          
          <!-- Борт 150 мм -->
          <div style="background: #f8faf8; border: 1.5px solid #e1ece4; border-radius: 18px; padding: 22px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
              <h3 style="font-size: 1.25rem; font-weight: 800; color: #1b4332; margin: 0;">Высота борта 150 мм</h3>
              <span style="background: #e8f5e9; color: #2e7d32; font-size: 0.8rem; font-weight: 700; padding: 4px 10px; border-radius: 999px;">Компакт</span>
            </div>
            <table class="pricing-table" style="width: 100%; font-size: 0.92rem;">
              <thead>
                <tr>
                  <th style="padding: 8px 12px; text-align: left;">Размер (Д × Ш × В)</th>
                  <th style="padding: 8px 12px; text-align: right;">Цена</th>
                  <th style="padding: 8px 12px; text-align: center;">Заказ</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>3000 × 800 × 150 мм</td><td style="text-align: right; font-weight: 700; color: #1b4332;">1 700 ₽</td><td style="text-align: center;"><button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.8rem;" data-open-modal data-subject="Грядка 3000х800х150 (1 700 ₽)">Заказать</button></td></tr>
                <tr><td>4000 × 800 × 150 мм</td><td style="text-align: right; font-weight: 700; color: #1b4332;">2 100 ₽</td><td style="text-align: center;"><button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.8rem;" data-open-modal data-subject="Грядка 4000х800х150 (2 100 ₽)">Заказать</button></td></tr>
                <tr><td>5000 × 800 × 150 мм</td><td style="text-align: right; font-weight: 700; color: #1b4332;">2 490 ₽</td><td style="text-align: center;"><button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.8rem;" data-open-modal data-subject="Грядка 5000х800х150 (2 490 ₽)">Заказать</button></td></tr>
                <tr><td>3000 × 1000 × 150 мм</td><td style="text-align: right; font-weight: 700; color: #1b4332;">1 780 ₽</td><td style="text-align: center;"><button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.8rem;" data-open-modal data-subject="Грядка 3000х1000х150 (1 780 ₽)">Заказать</button></td></tr>
                <tr><td>4000 × 1000 × 150 мм</td><td style="text-align: right; font-weight: 700; color: #1b4332;">2 200 ₽</td><td style="text-align: center;"><button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.8rem;" data-open-modal data-subject="Грядка 4000х1000х150 (2 200 ₽)">Заказать</button></td></tr>
                <tr><td>5000 × 1000 × 150 мм</td><td style="text-align: right; font-weight: 700; color: #1b4332;">2 580 ₽</td><td style="text-align: center;"><button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.8rem;" data-open-modal data-subject="Грядка 5000х1000х150 (2 580 ₽)">Заказать</button></td></tr>
              </tbody>
            </table>
          </div>

          <!-- Борт 200 мм -->
          <div style="background: #f8faf8; border: 1.5px solid #e1ece4; border-radius: 18px; padding: 22px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
              <h3 style="font-size: 1.25rem; font-weight: 800; color: #1b4332; margin: 0;">Высота борта 200 мм</h3>
              <span style="background: #e8f5e9; color: #2e7d32; font-size: 0.8rem; font-weight: 700; padding: 4px 10px; border-radius: 999px;">Хит продаж</span>
            </div>
            <table class="pricing-table" style="width: 100%; font-size: 0.92rem;">
              <thead>
                <tr>
                  <th style="padding: 8px 12px; text-align: left;">Размер (Д × Ш × В)</th>
                  <th style="padding: 8px 12px; text-align: right;">Цена</th>
                  <th style="padding: 8px 12px; text-align: center;">Заказ</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>2000 × 800 × 200 мм</td><td style="text-align: right; font-weight: 700; color: #1b4332;">1 550 ₽</td><td style="text-align: center;"><button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.8rem;" data-open-modal data-subject="Грядка 2000х800х200 (1 550 ₽)">Заказать</button></td></tr>
                <tr><td>3000 × 800 × 200 мм</td><td style="text-align: right; font-weight: 700; color: #1b4332;">2 000 ₽</td><td style="text-align: center;"><button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.8rem;" data-open-modal data-subject="Грядка 3000х800х200 (2 000 ₽)">Заказать</button></td></tr>
                <tr><td>4000 × 800 × 200 мм</td><td style="text-align: right; font-weight: 700; color: #1b4332;">2 500 ₽</td><td style="text-align: center;"><button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.8rem;" data-open-modal data-subject="Грядка 4000х800х200 (2 500 ₽)">Заказать</button></td></tr>
                <tr><td>5000 × 800 × 200 мм</td><td style="text-align: right; font-weight: 700; color: #1b4332;">2 950 ₽</td><td style="text-align: center;"><button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.8rem;" data-open-modal data-subject="Грядка 5000х800х200 (2 950 ₽)">Заказать</button></td></tr>
                <tr><td>2000 × 1000 × 200 мм</td><td style="text-align: right; font-weight: 700; color: #1b4332;">1 640 ₽</td><td style="text-align: center;"><button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.8rem;" data-open-modal data-subject="Грядка 2000х1000х200 (1 640 ₽)">Заказать</button></td></tr>
                <tr><td>3000 × 1000 × 200 мм</td><td style="text-align: right; font-weight: 700; color: #1b4332;">2 090 ₽</td><td style="text-align: center;"><button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.8rem;" data-open-modal data-subject="Грядка 3000х1000х200 (2 090 ₽)">Заказать</button></td></tr>
                <tr><td>4000 × 1000 × 200 мм</td><td style="text-align: right; font-weight: 700; color: #1b4332;">2 590 ₽</td><td style="text-align: center;"><button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.8rem;" data-open-modal data-subject="Грядка 4000х1000х200 (2 590 ₽)">Заказать</button></td></tr>
                <tr><td>5000 × 1000 × 200 мм</td><td style="text-align: right; font-weight: 700; color: #1b4332;">3 140 ₽</td><td style="text-align: center;"><button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.8rem;" data-open-modal data-subject="Грядка 5000х1000х200 (3 140 ₽)">Заказать</button></td></tr>
              </tbody>
            </table>
          </div>

        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; background: #f0f7f2; border-radius: 14px; padding: 18px; text-align: center;">
          <div>
            <strong>Легко собираются</strong>
            <p style="font-size: 0.88rem; color: #556b62; margin: 4px 0 0;">Без сложного инструмента, за 10–15 минут</p>
          </div>
          <div>
            <strong>Перемычка через метр</strong>
            <p style="font-size: 0.88rem; color: #556b62; margin: 4px 0 0;">Предотвращает распирание грунтом</p>
          </div>
          <div>
            <strong>Компактная коробка</strong>
            <p style="font-size: 0.88rem; color: #556b62; margin: 4px 0 0;">Помещается в багажник любого легкового авто</p>
          </div>
        </div>

      </div>`;

html = html.replace('<!-- ==========================================\n           СРАВНЕНИЕ: ДЕРЕВЯННЫЕ ГРЯДКИ VS ОЦИНКОВКА', `${priceTableSection}\n\n      <!-- ==========================================\n           СРАВНЕНИЕ: ДЕРЕВЯННЫЕ ГРЯДКИ VS ОЦИНКОВКА`);

fs.writeFileSync(filePath, html, 'utf8');
console.log('gryadki.html updated with complete price table and photos');

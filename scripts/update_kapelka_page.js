const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'kaplevidnye.html');
let html = fs.readFileSync(filePath, 'utf8');

// 1. Обновляем главное фото
html = html.replace(
  /<img src="assets\/images\/products\/p2\/3\.jpg" alt=".*?" class="prod-main-img" id="dropMainImg">/,
  '<img src="assets/images/products/kapelka/1.jpg" alt="Теплица Капелька" class="prod-main-img" id="dropMainImg">'
);

// 2. Первые 5 миниатюр - новые реальные фото
const newThumbs = `            <div class="prod-thumb-item active" data-idx="0" data-src="assets/images/products/kapelka/1.jpg" title="Теплица Капелька 3 м фасад с коньком">
              <img src="assets/images/products/kapelka/1.jpg" alt="Теплица Капелька 3 м фасад с коньком" loading="lazy">
            </div>
            <div class="prod-thumb-item " data-idx="1" data-src="assets/images/products/kapelka/2.jpg" title="Стрельчатый свод и скат для снега">
              <img src="assets/images/products/kapelka/2.jpg" alt="Стрельчатый свод и скат для снега" loading="lazy">
            </div>
            <div class="prod-thumb-item " data-idx="2" data-src="assets/images/products/kapelka/3.jpg" title="Широкая входная дверь и форточка">
              <img src="assets/images/products/kapelka/3.jpg" alt="Широкая входная дверь и форточка" loading="lazy">
            </div>
            <div class="prod-thumb-item " data-idx="3" data-src="assets/images/products/kapelka/4.jpg" title="Вид изнутри: термопривод и жесткий торец">
              <img src="assets/images/products/kapelka/4.jpg" alt="Вид изнутри: термопривод и жесткий торец" loading="lazy">
            </div>
            <div class="prod-thumb-item " data-idx="4" data-src="assets/images/products/kapelka/5.jpg" title="Теплица Капелька на участке с открытыми дверями">
              <img src="assets/images/products/kapelka/5.jpg" alt="Теплица Капелька на участке с открытыми дверями" loading="lazy">
            </div>`;

html = html.replace(/<div class="prod-thumbs-strip" id="dropThumbs">[\s\S]*?<div class="prod-thumb-item " data-idx="5"/, 
  `<div class="prod-thumbs-strip" id="dropThumbs">\n${newThumbs}\n            <div class="prod-thumb-item " data-idx="5"`
);

// 3. Заголовок товара
html = html.replace(
  /<h1 class="prod-title">.*?<\/h1>/,
  '<h1 class="prod-title">Теплица «Капелька» 3 м (оцинкованный профиль 30×20 мм, снегосброс)</h1>'
);

// 4. Цена по умолчанию (3х4 м = 26 500 ₽)
html = html.replace(/id="dropPriceVal">.*?<\/span>/, 'id="dropPriceVal">26 500 ₽</span>');
html = html.replace(/id="dropOldPriceVal">.*?<\/span>/, 'id="dropOldPriceVal">29 900 ₽</span>');

// Сделать активной кнопку 3х4 м
html = html.replace(
  /<button type="button" class="prod-select-btn" data-drop-length="4m">3 × 4 м<\/button>\s*<button type="button" class="prod-select-btn active" data-drop-length="6m">3 × 6 м \(Хит\)<\/button>/,
  '<button type="button" class="prod-select-btn active" data-drop-length="4m">3 × 4 м (Хит)</button>\n              <button type="button" class="prod-select-btn" data-drop-length="6m">3 × 6 м</button>'
);

// Кнопка быстрого заказа
html = html.replace(
  /data-subject="Заказ: Каплевидные теплицы.*?"/,
  'data-subject="Заказ: Теплица Капелька 3х4м (26 500 ₽)"'
);

// 5. Ключевые параметры в правой колонке
const newSpecsBullets = `          <ul class="prod-specs-bullets">
            <li><strong>Снегосброс:</strong> заострённая крыша — мокрый снег скатывается сам, чистить не нужно</li>
            <li><strong>Каркас 30×20 мм:</strong> оцинкованная труба с двусторонней защитой от коррозии на 15+ лет</li>
            <li><strong>Цельносварные торцы:</strong> повышенная жесткость конструкции при ветрах и морозах</li>
            <li><strong>2 двери и 2 форточки:</strong> идеальный воздухообмен для дружного урожая</li>
            <li><strong>Полный комплект:</strong> поликарбонат 4 мм с УФ-защитой, петли, двухсторонние ручки, крепеж</li>
          </ul>`;

html = html.replace(/<ul class="prod-specs-bullets">[\s\S]*?<\/ul>/, newSpecsBullets);

// 6. Блок подробного сжатого описания от производителя
const descSection = `      <!-- СОКРАЩЕННОЕ ОПИСАНИЕ И ПРЕИМУЩЕСТВА «КАПЕЛЬКИ» -->
      <div class="prod-details-box" style="margin-bottom: 35px; background: #ffffff; border: 1.5px solid #d8f3dc; border-radius: 20px; padding: 28px 32px;">
        <div style="font-size: 0.85rem; font-weight: 800; color: #2d6a4f; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">Преимущества конструкции</div>
        <h2 style="font-size: 1.45rem; font-weight: 800; color: #1b4332; margin-bottom: 14px;">«Капелька» — теплица, которая переживёт любую зиму</h2>
        <p style="font-size: 1rem; color: #2d3748; line-height: 1.6; margin-bottom: 20px;">
          Забудьте о переживаниях за теплицу под тяжестью сугробов. Заострённый конёк и стрельчатая геометрия формы «Капелька» гарантируют естественный сход снега без вашего участия, а увеличенная высота 2.30 м даёт максимум простора для подвязки высокорослых томатов и огурцов.
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px; margin-bottom: 22px;">
          <div style="background: #f8faf8; border: 1px solid #e1ece4; border-radius: 14px; padding: 18px;">
            <div style="font-weight: 800; color: #1b4332; font-size: 1.05rem; margin-bottom: 6px;">Заострённая крыша — снег скатывается сам</div>
            <div style="font-size: 0.92rem; color: #4a5568; line-height: 1.5;">Снег не накапливается и не давит на каркас. Зимой больше не нужно выезжать на дачу с лопатой.</div>
          </div>
          <div style="background: #f8faf8; border: 1px solid #e1ece4; border-radius: 14px; padding: 18px;">
            <div style="font-weight: 800; color: #1b4332; font-size: 1.05rem; margin-bottom: 6px;">Двойная оцинковка — не ржавеет годами</div>
            <div style="font-size: 0.92rem; color: #4a5568; line-height: 1.5;">Профиль 30×20 мм оцинкован с двух сторон. Никакой ржавчины и подкрашивания — поставили и забыли.</div>
          </div>
          <div style="background: #f8faf8; border: 1px solid #e1ece4; border-radius: 14px; padding: 18px;">
            <div style="font-weight: 800; color: #1b4332; font-size: 1.05rem; margin-bottom: 6px;">Цельносварные торцы — монолитная прочность</div>
            <div style="font-size: 0.92rem; color: #4a5568; line-height: 1.5;">Заводская сварка торцов предотвращает перекосы от ветра и подвижек грунта в морозы.</div>
          </div>
          <div style="background: #f8faf8; border: 1px solid #e1ece4; border-radius: 14px; padding: 18px;">
            <div style="font-weight: 800; color: #1b4332; font-size: 1.05rem; margin-bottom: 6px;">2 двери и 2 большие форточки</div>
            <div style="font-size: 0.92rem; color: #4a5568; line-height: 1.5;">Обеспечивают сквозное дыхание. Растения не преют в жару, сохраняя здоровую завязь без болезней.</div>
          </div>
          <div style="background: #f8faf8; border: 1px solid #e1ece4; border-radius: 14px; padding: 18px;">
            <div style="font-weight: 800; color: #1b4332; font-size: 1.05rem; margin-bottom: 6px;">Всё включено в базовую цену</div>
            <div style="font-size: 0.92rem; color: #4a5568; line-height: 1.5;">Поликарбонат 4 мм с УФ-слоем, двухсторонние ручки, петли, задвижки и фурнитура — без скрытых доплат.</div>
          </div>
          <div style="background: #f8faf8; border: 1px solid #e1ece4; border-radius: 14px; padding: 18px;">
            <div style="font-weight: 800; color: #1b4332; font-size: 1.05rem; margin-bottom: 6px;">0 ₽ предоплаты и доставка на участок</div>
            <div style="font-size: 0.92rem; color: #4a5568; line-height: 1.5;">Привозим собственным автотранспортом. Вы принимаете комплект на участке, проверяете — и только потом оплачиваете.</div>
          </div>
        </div>
      </div>`;

// Вставляем блок описания перед таблицей характеристик
html = html.replace('<!-- ХАРАКТЕРИСТИКИ И КОМПЛЕКТАЦИЯ -->', `${descSection}\n\n      <!-- ХАРАКТЕРИСТИКИ И КОМПЛЕКТАЦИЯ -->`);

// 7. Обновляем таблицу характеристик
const newSpecsTable = `<table class="prod-table-specs">
            <tbody>
              <tr><td>Форма</td><td>Капелька (стрельчатый свод, снег скатывается сам)</td></tr>
              <tr><td>Каркас</td><td>Оцинкованный профиль 30×20 мм (двойная оцинковка)</td></tr>
              <tr><td>Ширина</td><td>3.0 метра</td></tr>
              <tr><td>Высота</td><td>2.30 метра (удобно для высокорослых культур)</td></tr>
              <tr><td>Длина</td><td>4 м (в наличии 4, 6, 8, 10 м)</td></tr>
              <tr><td>Шаг дуг</td><td>1.0 м (стандарт) или 0.65 м (усиленный)</td></tr>
              <tr><td>Соединение</td><td>Болтовое / краб-система</td></tr>
              <tr><td>Двери и форточки</td><td>2 двери и 2 большие форточки в противоположных торцах</td></tr>
              <tr><td>Покрытие</td><td>Сотовый поликарбонат 4 мм с надежной УФ-защитой</td></tr>
              <tr><td>Комплектация</td><td>Каркас, поликарбонат, ручки, петли, саморезы, фурнитура</td></tr>
              <tr><td>Оплата и доставка</td><td>0 ₽ предоплаты, доставка по Ярославской, Ивановской, Костромской, Московской обл.</td></tr>
            </tbody>
          </table>`;

html = html.replace(/<table class="prod-table-specs">[\s\S]*?<\/table>/, newSpecsTable);

fs.writeFileSync(filePath, html, 'utf8');
console.log('kaplevidnye.html fully updated with user photos, shortened text and specs!');

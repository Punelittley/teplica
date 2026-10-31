const fs = require('fs');
const path = require('path');

const archFile = path.join(__dirname, '..', 'arochnye.html');
let html = fs.readFileSync(archFile, 'utf8');

// 1. Добавляем реальное фото 3х8 в миниатюры
html = html.replace(
  '<div class="prod-thumb-item active" data-idx="0" data-src="assets/images/products/p1/2.jpg" title="Арочная теплица 3х6 на брусе">',
  `<div class="prod-thumb-item active" data-idx="0" data-src="assets/images/products/p1/arch_3x8.jpg" title="Арочная теплица 3х8 м на фундаменте">
              <img src="assets/images/products/p1/arch_3x8.jpg" alt="Арочная теплица 3х8 м на фундаменте" loading="lazy">
            </div>
            <div class="prod-thumb-item " data-idx="1" data-src="assets/images/products/p1/2.jpg" title="Арочная теплица 3х6 на брусе">`
);
// Убираем старую последнюю миниатюру p1/1.jpg с текстом
html = html.replace(/<div class="prod-thumb-item " data-idx="19" data-src="assets\/images\/products\/p1\/1\.jpg"[\s\S]*?<\/div>\s*<\/div>/, '</div>');

// 2. Обновляем буллеты под конфигуратором
const newArchBullets = `          <ul class="prod-specs-bullets">
            <li><strong>Каркас 30×20 мм:</strong> труба прокатана на ребро для максимальной жесткости, сталь 1.0 мм</li>
            <li><strong>Двухсторонняя оцинковка:</strong> защита от коррозии, срок службы каркаса не менее 15 лет</li>
            <li><strong>Двери с укосами:</strong> усиленная конструкция исключает провисание и перекосы створок</li>
            <li><strong>2 двери + 2 форточки:</strong> сквозное проветривание, ручки, ветровые крючки и фиксаторы в комплекте</li>
            <li><strong>Поликарбонат 4 мм:</strong> плотность 0.52 кг/м² с заводской защитой от ультрафиолета</li>
          </ul>`;
html = html.replace(/<ul class="prod-specs-bullets">[\s\S]*?<\/ul>/, newArchBullets);

// 3. Добавляем блок подробного описания арочной теплицы 3х8
const descSection = `      <!-- ОПИСАНИЕ И ПРЕИМУЩЕСТВА АРОЧНОЙ ТЕПЛИЦЫ -->
      <div class="prod-details-box" style="margin-bottom: 35px; background: #ffffff; border: 1.5px solid #d8f3dc; border-radius: 20px; padding: 28px 32px;">
        <div style="font-size: 0.85rem; font-weight: 800; color: #2d6a4f; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">От производителя</div>
        <h2 style="font-size: 1.45rem; font-weight: 800; color: #1b4332; margin-bottom: 14px;">Арочная теплица 3х8 м из оцинкованной трубы ГОСТ</h2>
        <p style="font-size: 1rem; color: #2d3748; line-height: 1.6; margin-bottom: 20px;">
          Надёжная и долговечная арочная теплица от завода-производителя для огорода, рассады и раннего богатого урожая. Каркас изготовлен из трубы 30×20 мм, прокатанной на ребро — такая геометрия дает максимальное сопротивление ветровым и снеговым нагрузкам в межсезонье.
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px; margin-bottom: 22px;">
          <div style="background: #f8faf8; border: 1px solid #e1ece4; border-radius: 14px; padding: 18px;">
            <div style="font-weight: 800; color: #1b4332; font-size: 1.05rem; margin-bottom: 6px;">Профиль 30×20 мм на ребро</div>
            <div style="font-size: 0.92rem; color: #4a5568; line-height: 1.5;">Честная толщина металла 1.0 мм. Основание 30×20 мм с двухсторонней оцинковкой. Срок службы не менее 15 лет.</div>
          </div>
          <div style="background: #f8faf8; border: 1px solid #e1ece4; border-radius: 14px; padding: 18px;">
            <div style="font-weight: 800; color: #1b4332; font-size: 1.05rem; margin-bottom: 6px;">Двери с укосами от перекосов</div>
            <div style="font-size: 0.92rem; color: #4a5568; line-height: 1.5;">Специальные диагональные укосы на дверях защищают створки от провисания даже после многолетней эксплуатации.</div>
          </div>
          <div style="background: #f8faf8; border: 1px solid #e1ece4; border-radius: 14px; padding: 18px;">
            <div style="font-weight: 800; color: #1b4332; font-size: 1.05rem; margin-bottom: 6px;">Плотный поликарбонат 0.52 кг/м²</div>
            <div style="font-size: 0.92rem; color: #4a5568; line-height: 1.5;">Листы сотового поликарбоната 4 мм с надежной УФ-защитой. Прекрасно пропускает солнечный свет и удерживает тепло.</div>
          </div>
          <div style="background: #f8faf8; border: 1px solid #e1ece4; border-radius: 14px; padding: 18px;">
            <div style="font-weight: 800; color: #1b4332; font-size: 1.05rem; margin-bottom: 6px;">Полный монтажный комплект</div>
            <div style="font-size: 0.92rem; color: #4a5568; line-height: 1.5;">2 двери, 2 форточки, двухсторонние ручки, ветровые крючки, дверные фиксаторы и все метизы для сборки в комплекте.</div>
          </div>
          <div style="background: #f8faf8; border: 1px solid #e1ece4; border-radius: 14px; padding: 18px;">
            <div style="font-weight: 800; color: #1b4332; font-size: 1.05rem; margin-bottom: 6px;">Бесплатное хранение до лета</div>
            <div style="font-size: 0.92rem; color: #4a5568; line-height: 1.5;">Зафиксируйте цену сегодня — бесплатное хранение на складе до 31.06.2026 г. с доставкой к удобной вам дате.</div>
          </div>
          <div style="background: #f8faf8; border: 1px solid #e1ece4; border-radius: 14px; padding: 18px;">
            <div style="font-weight: 800; color: #1b4332; font-size: 1.05rem; margin-bottom: 6px;">0 ₽ предоплаты</div>
            <div style="font-size: 0.92rem; color: #4a5568; line-height: 1.5;">Доставка спецтранспортом по Ярославской, Ивановской и Костромской областям. Оплата строго по факту на участке.</div>
          </div>
        </div>
      </div>`;

html = html.replace('<!-- ХАРАКТЕРИСТИКИ И КОМПЛЕКТАЦИЯ -->', `${descSection}\n\n      <!-- ХАРАКТЕРИСТИКИ И КОМПЛЕКТАЦИЯ -->`);

// 4. Обновляем таблицу характеристик
const newSpecsTable = `<table class="prod-table-specs">
            <tbody>
              <tr><td>Форма</td><td>Арочная классическая</td></tr>
              <tr><td>Ширина</td><td>3.0 метра</td></tr>
              <tr><td>Высота</td><td>2.10 метра</td></tr>
              <tr><td>Длина</td><td>8 метров (также в наличии 4, 6, 10 м)</td></tr>
              <tr><td>Профиль каркаса</td><td>Оцинкованная труба 30×20 мм (прокатана на ребро)</td></tr>
              <tr><td>Толщина стали</td><td>Честные 1.0 мм (двухсторонняя оцинковка)</td></tr>
              <tr><td>Основание</td><td>Профиль 30×20 мм</td></tr>
              <tr><td>Шаг между дугами</td><td>1.0 м (стандарт) или 0.65 м (усиленный, +3 000 ₽)</td></tr>
              <tr><td>Двери и форточки</td><td>2 двери с укосами от провисания + 2 форточки</td></tr>
              <tr><td>Покрытие</td><td>Сотовый поликарбонат 4 мм (плотность 0.52 кг/м² с УФ-защитой)</td></tr>
              <tr><td>Фурнитура в комплекте</td><td>Ручки, ветровые крючки, фиксаторы дверей, метизы для сборки</td></tr>
              <tr><td>Дополнительные опции</td><td>Краб-система (2 000 ₽), фундамент из бруса 8м (7 500 ₽), сборка 8м (7 500 ₽)</td></tr>
              <tr><td>Срок службы</td><td>Не менее 15 лет</td></tr>
            </tbody>
          </table>`;

html = html.replace(/<table class="prod-table-specs">[\s\S]*?<\/table>/, newSpecsTable);

fs.writeFileSync(archFile, html, 'utf8');
console.log('arochnye.html updated with 3x8 details and photo!');

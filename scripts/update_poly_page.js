const fs = require('fs');

let html = fs.readFileSync('polikarbonat.html', 'utf8');

// Replace the 3 cards in poly-types-grid with large 1:1 photos and rich descriptions
const oldGridStart = '<div class="poly-types-grid">';
const oldGridEnd = '<!-- КОМПЛЕКТУЮЩИЕ: ТЕРМОШАЙБЫ И ЛЕНТА ОЦИНКОВАННАЯ -->';

const startIndex = html.indexOf(oldGridStart);
const endIndex = html.indexOf(oldGridEnd);

if (startIndex !== -1 && endIndex !== -1) {
  const newGrid = `<div class="poly-types-grid">
        <!-- 1. Оптимальный 4 мм -->
        <div class="poly-type-card" data-aos="fade-up" data-aos-delay="100" style="display:flex; flex-direction:column; background:#fff; border:1.5px solid #e1ece4; border-radius:20px; overflow:hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.05);">
          <div style="width: 100%; aspect-ratio: 1 / 1; overflow: hidden; background: #eef4f0; position: relative;">
            <img src="assets/images/products/p5/2.jpg" alt="Поликарбонат Оптимальный 4 мм" style="width: 100%; height: 100%; object-fit: cover;">
            <span style="position: absolute; top: 12px; left: 12px; background: #1b4332; color: #fff; font-size: 0.75rem; font-weight: 800; padding: 4px 12px; border-radius: 999px; text-transform: uppercase;">Хит • Стандарт</span>
          </div>
          <div class="poly-type-header" style="padding: 18px 20px 10px;">
            <h3 class="poly-type-title" style="margin: 0; font-size: 1.35rem; color: #1b4332;">Оптимальный 4 мм</h3>
            <div style="font-size: 0.85rem; color: #556b62; margin-top: 4px;">Первичное сырье Sabic / Bayer • ГОСТ</div>
          </div>
          <div class="poly-type-price-strip" style="padding: 0 20px 14px;">
            <span class="poly-type-price-num" style="font-size: 1.6rem; font-weight: 900; color: #1b4332;">2 790 ₽</span>
            <span class="poly-type-price-unit" style="font-size: 0.85rem; color: #6c757d;">за лист 2.1 × 6.0 м</span>
          </div>
          <div class="poly-type-body" style="padding: 0 20px 22px; display: flex; flex-direction: column; flex-grow: 1;">
            <ul class="poly-spec-table" style="margin-bottom: 16px;">
              <li><span>Толщина:</span> <strong>4 мм (сотовый)</strong></li>
              <li><span>Плотность:</span> <strong>0.60 кг/м² (честный вес)</strong></li>
              <li><span>УФ-слой:</span> <strong>40 микрон (соэкструзия)</strong></li>
              <li><span>Светопропускание:</span> <strong>82% (мягкий свет)</strong></li>
              <li><span>Гарантия завода:</span> <strong>10 лет</strong></li>
            </ul>
            <p style="font-size: 0.9rem; color: #495057; line-height: 1.5; margin: 0 0 18px; flex-grow: 1;">
              Классический надежный поликарбонат для дачных теплиц. Соэкструзионный молекулярный слой надежно защищает полимер от разрушения солнцем, а томаты и перцы — от ультрафиолетовых ожогов.
            </p>
            <button type="button" class="btn btn-primary" style="width: 100%; padding: 12px;" data-open-modal data-title="Заказ: Поликарбонат Оптимальный 4 мм" data-subtitle="Цена: 2 790 ₽ за лист 2100х6000 мм. Доставка по звонку без предоплаты" data-subject="Заказ: Поликарбонат Оптимальный 4 мм (2 790 ₽)">
              Заказать лист 2.1×6 м →
            </button>
          </div>
        </div>

        <!-- 2. Экологический "Фито" 4 мм -->
        <div class="poly-type-card" data-aos="fade-up" data-aos-delay="200" style="display:flex; flex-direction:column; background:#fff; border:2px solid #2d6a4f; border-radius:20px; overflow:hidden; box-shadow: 0 12px 32px rgba(45,106,79,0.14);">
          <div style="width: 100%; aspect-ratio: 1 / 1; overflow: hidden; background: #edf7ef; position: relative;">
            <img src="assets/images/products/p5/3.jpg" alt="Поликарбонат Экологический Фито 4 мм" style="width: 100%; height: 100%; object-fit: cover;">
            <span style="position: absolute; top: 12px; left: 12px; background: #2d6a4f; color: #fff; font-size: 0.75rem; font-weight: 800; padding: 4px 12px; border-radius: 999px; text-transform: uppercase;">Для богатого урожая</span>
          </div>
          <div class="poly-type-header" style="padding: 18px 20px 10px; background: #f4faf5;">
            <h3 class="poly-type-title" style="margin: 0; font-size: 1.35rem; color: #1b4332;">Экологический «Фито» 4 мм</h3>
            <div style="font-size: 0.85rem; color: #2d6a4f; font-weight: 700; margin-top: 4px;">С био-спектром фотосинтеза</div>
          </div>
          <div class="poly-type-price-strip" style="padding: 10px 20px 14px; background: #f4faf5;">
            <span class="poly-type-price-num" style="font-size: 1.6rem; font-weight: 900; color: #2d6a4f;">3 290 ₽</span>
            <span class="poly-type-price-unit" style="font-size: 0.85rem; color: #6c757d;">за лист 2.1 × 6.0 м</span>
          </div>
          <div class="poly-type-body" style="padding: 14px 20px 22px; display: flex; flex-direction: column; flex-grow: 1;">
            <ul class="poly-spec-table" style="margin-bottom: 16px;">
              <li><span>Толщина:</span> <strong>4 мм (Фито-формула)</strong></li>
              <li><span>Плотность:</span> <strong>0.65 кг/м² (увеличенная)</strong></li>
              <li><span>УФ-слой:</span> <strong>45 мкм + фито-стабилизатор</strong></li>
              <li><span>Спектр:</span> <strong>Преобразует лучи в красный спектр</strong></li>
              <li><span>Гарантия завода:</span> <strong>12 лет</strong></li>
            </ul>
            <p style="font-size: 0.9rem; color: #495057; line-height: 1.5; margin: 0 0 18px; flex-grow: 1;">
              Разработка для северных регионов: специальная добавка превращает жесткий ультрафиолет в полезный для растений красно-оранжевый спектр, ускоряя созревание томатов и огурцов на 2–3 недели.
            </p>
            <button type="button" class="btn-red-action" style="width: 100%; padding: 12px; font-size: 0.95rem;" data-open-modal data-title="Заказ: Поликарбонат Экологический Фито 4 мм" data-subtitle="Цена: 3 290 ₽ за лист 2100х6000 мм. Доставка по звонку без предоплаты" data-subject="Заказ: Поликарбонат Экологический Фито 4 мм (3 290 ₽)">
              Заказать лист «Фито» →
            </button>
          </div>
        </div>

        <!-- 3. Максимальный 6 мм -->
        <div class="poly-type-card" data-aos="fade-up" data-aos-delay="300" style="display:flex; flex-direction:column; background:#fff; border:1.5px solid #e1ece4; border-radius:20px; overflow:hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.05);">
          <div style="width: 100%; aspect-ratio: 1 / 1; overflow: hidden; background: #eef4f0; position: relative;">
            <img src="assets/images/products/p6/1.jpg" alt="Поликарбонат Максимальный 6 мм" style="width: 100%; height: 100%; object-fit: cover;">
            <span style="position: absolute; top: 12px; left: 12px; background: #0077b6; color: #fff; font-size: 0.75rem; font-weight: 800; padding: 4px 12px; border-radius: 999px; text-transform: uppercase;">Зимний • Сверхпрочный</span>
          </div>
          <div class="poly-type-header" style="padding: 18px 20px 10px;">
            <h3 class="poly-type-title" style="margin: 0; font-size: 1.35rem; color: #1b4332;">Максимальный 6 мм</h3>
            <div style="font-size: 0.85rem; color: #556b62; margin-top: 4px;">Увеличенная толщина для круглого года</div>
          </div>
          <div class="poly-type-price-strip" style="padding: 0 20px 14px;">
            <span class="poly-type-price-num" style="font-size: 1.6rem; font-weight: 900; color: #1b4332;">4 690 ₽</span>
            <span class="poly-type-price-unit" style="font-size: 0.85rem; color: #6c757d;">за лист 2.1 × 6.0 м</span>
          </div>
          <div class="poly-type-body" style="padding: 0 20px 22px; display: flex; flex-direction: column; flex-grow: 1;">
            <ul class="poly-spec-table" style="margin-bottom: 16px;">
              <li><span>Толщина:</span> <strong>6 мм (жесткая сота)</strong></li>
              <li><span>Плотность:</span> <strong>1.05 кг/м² (высочайшая)</strong></li>
              <li><span>УФ-слой:</span> <strong>50 микрон (двойная защита)</strong></li>
              <li><span>Теплоизоляция:</span> <strong>Держит тепло в заморозки</strong></li>
              <li><span>Гарантия завода:</span> <strong>15 лет</strong></li>
            </ul>
            <p style="font-size: 0.9rem; color: #495057; line-height: 1.5; margin: 0 0 18px; flex-grow: 1;">
              Усиленный 6-миллиметровый сотовый лист выдерживает колоссальные снеговые нагрузки, падение толстых веток и удерживает тепло внутри теплицы при весенних заморозках до -7 °C.
            </p>
            <button type="button" class="btn btn-primary" style="width: 100%; padding: 12px;" data-open-modal data-title="Заказ: Поликарбонат Максимальный 6 мм" data-subtitle="Цена: 4 690 ₽ за лист 2100х6000 мм. Доставка по звонку без предоплаты" data-subject="Заказ: Поликарбонат Максимальный 6 мм (4 690 ₽)">
              Заказать лист 6 мм →
            </button>
          </div>
        </div>
      </div>\n\n      `;

  html = html.substring(0, startIndex) + newGrid + html.substring(endIndex);
  console.log('polikarbonat.html updated with 1:1 photos and rich details');
}

fs.writeFileSync('polikarbonat.html', html, 'utf8');

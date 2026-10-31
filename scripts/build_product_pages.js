const fs = require('fs');

const archPhotos = [
  { src: "assets/images/products/p1/2.jpg", title: "Арочная теплица 3х6 на брусе" },
  { src: "assets/images/products/p1/3.jpg", title: "Торец с широкой дверью и форточкой" },
  { src: "assets/images/products/p1/4.jpg", title: "Оцинкованный силовой каркас" },
  { src: "assets/images/products/p1/5.jpg", title: "Готовая теплица под ключ" },
  { src: "assets/images/products/p2/1.jpg", title: "Сборка каркаса на участке" },
  { src: "assets/images/products/p2/3.jpg", title: "Форточка для сквозного проветривания" },
  { src: "assets/images/products/p2/4.jpg", title: "Монтаж поликарбоната с УФ-защитой" },
  { src: "assets/images/products/p2/5.jpg", title: "Теплица на газоне в СНТ" },
  { src: "assets/images/products/p3/1.jpg", title: "Усиленный цельносварной торец" },
  { src: "assets/images/products/p3/2.jpg", title: "Двери и форточки в открытом виде" },
  { src: "assets/images/products/p3/3.jpg", title: "Труба ГОСТ Северсталь" },
  { src: "assets/images/products/p3/4.jpg", title: "Продольные оцинкованные стяжки" },
  { src: "assets/images/products/p4/1.jpg", title: "Доставка спецтранспортом завода" },
  { src: "assets/images/products/p4/2.jpg", title: "Разгрузка у калитки садовода" },
  { src: "assets/images/products/p5/1.jpg", title: "Сотовый поликарбонат Sabic 4 мм" },
  { src: "assets/images/products/p7/1.jpg", title: "Внутреннее пространство теплицы" },
  { src: "assets/images/products/p7/2.jpg", title: "Фундамент из антисептированного бруса" },
  { src: "assets/images/products/p9/1.jpg", title: "Оцинкованные грядки внутри теплицы" },
  { src: "assets/images/works/work_2_ustanovka.png", title: "Готовая арочная теплица с урожаем" },
  { src: "assets/images/products/p1/1.jpg", title: "Арочная теплица фасад на дачном участке" }
];

const dropPhotos = [
  { src: "assets/images/products/p2/3.jpg", title: "Каплевидная теплица Стрелка фасад на участке" },
  { src: "assets/images/products/p2/4.jpg", title: "Усиленная каплевидная теплица 3х4 м" },
  { src: "assets/images/products/p2/5.jpg", title: "Каплевидная теплица 3х8 м на брусе" },
  { src: "assets/images/products/p6/1.jpg", title: "Острый снегосбрасывающий конёк" },
  { src: "assets/images/products/p6/2.jpg", title: "Стрельчатый свод крупно" },
  { src: "assets/images/products/p6/3.jpg", title: "Торец и увеличенная высота 2.35 м" },
  { src: "assets/images/products/p1/3.jpg", title: "Коньковая форточка для микроклимата" },
  { src: "assets/images/products/p2/1.jpg", title: "Сборка стрельчатого каркаса" },
  { src: "assets/images/products/p3/1.jpg", title: "Цельносварные торцы завода" },
  { src: "assets/images/products/p3/2.jpg", title: "Дверной блок с ветровыми крючками" },
  { src: "assets/images/products/p3/3.jpg", title: "Коньковый силовой узел" },
  { src: "assets/images/products/p4/1.jpg", title: "Спецтранспорт с пирамидой" },
  { src: "assets/images/products/p4/3.jpg", title: "Стяжная оцинкованная лента" },
  { src: "assets/images/products/p5/1.jpg", title: "Поликарбонат с лазерным УФ-слоем" },
  { src: "assets/images/products/p5/2.jpg", title: "Структура сот поликарбоната" },
  { src: "assets/images/products/p7/1.jpg", title: "Простор для высокорослых томатов" },
  { src: "assets/images/products/p7/2.jpg", title: "Установка капельки на брус 100х100" },
  { src: "assets/images/products/p9/2.png", title: "Теплица с оцинкованными грядами" },
  { src: "assets/images/works/work_1_prodazha.png", title: "Склад готовой продукции" },
  { src: "assets/images/products/p1/5.jpg", title: "Готовая каплевидная теплица под ключ" }
];

const housePhotos = [
  { src: "assets/images/products/p7/2.jpg", title: "Прямостенная теплица Домиком фасад" },
  { src: "assets/images/products/p2/5.jpg", title: "Прямые вертикальные стены 1.7 м" },
  { src: "assets/images/products/p1/4.jpg", title: "Усиленные фермы двухскатной крыши" },
  { src: "assets/images/products/p3/2.jpg", title: "Входная группа и форточка" },
  { src: "assets/images/products/p3/3.jpg", title: "Оцинкованная труба ГОСТ" },
  { src: "assets/images/products/p1/1.jpg", title: "Вид теплицы Домиком на участке" },
  { src: "assets/images/products/p1/2.jpg", title: "Монтаж на фундамент из бруса 100х100" },
  { src: "assets/images/products/p2/1.jpg", title: "Сборка прямых стен по уровню" },
  { src: "assets/images/products/p2/4.jpg", title: "Монтаж поликарбоната на двухскатную крышу" },
  { src: "assets/images/products/p3/1.jpg", title: "Цельносварные торцы" },
  { src: "assets/images/products/p4/2.jpg", title: "Доставка спецрейсом завода" },
  { src: "assets/images/products/p4/3.jpg", title: "Комплект крепежа и фурнитуры" },
  { src: "assets/images/products/p5/1.jpg", title: "Поликарбонат сотовый Sabic 4 мм" },
  { src: "assets/images/products/p5/3.jpg", title: "Фито-поликарбонат для богатого урожая" },
  { src: "assets/images/products/p6/1.jpg", title: "Зимний поликарбонат 6 мм" },
  { src: "assets/images/products/p7/1.jpg", title: "100% полезного объема внутри" },
  { src: "assets/images/products/p8/1.jpg", title: "Посадка растений у самых стен" },
  { src: "assets/images/products/p9/1.jpg", title: "Оцинкованные грядки по периметру" },
  { src: "assets/images/works/work_2_ustanovka.png", title: "Сборка бригадой завода" },
  { src: "assets/images/products/p1/5.jpg", title: "Готовый Домик под ключ" }
];

function generatePageContent(cfg) {
  const thumbsHtml = cfg.photos.map((p, i) => `
            <div class="prod-thumb-item ${i === 0 ? 'active' : ''}" data-idx="${i}" data-src="${p.src}" title="${p.title}">
              <img src="${p.src}" alt="${p.title}" loading="lazy">
            </div>`).join('');

  return `
  <!-- Главный блок товара: ${cfg.name} -->
  <main class="catalog-page" style="padding-top: 32px; padding-bottom: 60px;">
    <div class="container">

      <!-- Хлебные крошки -->
      <div class="catalog-breadcrumb" style="margin-bottom: 20px;">
        <a href="index.html">Главная</a>
        <span>/</span>
        <a href="${cfg.file}">Теплицы</a>
        <span>/</span>
        <span style="color: #1b4332; font-weight: 700;">${cfg.name}</span>
      </div>

      <!-- КАРТОЧКА ТОВАРА ПО РЕФЕРЕНСУ (БОЛЬШОЕ ФОТО + 20 РАКУРСОВ В КРУГОВУЮ + КОНФИГУРАТОР) -->
      <section class="prod-hero-wrap">
        
        <!-- Левая колонка: Галерея с 20 фото вкруговую -->
        <div class="prod-gallery-col">
          <div class="prod-main-view">
            <img src="${cfg.photos[0].src}" alt="${cfg.name}" class="prod-main-img" id="${cfg.prefix}MainImg">
            <div class="prod-badge-overlay">
              <span class="prod-badge-pill hit">Хит завода</span>
              <span class="prod-badge-pill">0 ₽ предоплаты</span>
            </div>
            <button type="button" class="prod-nav-arrow prev" id="${cfg.prefix}PrevBtn" aria-label="Предыдущее фото">‹</button>
            <button type="button" class="prod-nav-arrow next" id="${cfg.prefix}NextBtn" aria-label="Следующее фото">›</button>
            <div class="prod-counter-pill" id="${cfg.prefix}Counter">1 / ${cfg.photos.length} • Листайте фото</div>
          </div>

          <div class="prod-thumbs-strip" id="${cfg.prefix}Thumbs">
            ${thumbsHtml}
          </div>
          <div style="font-size: 0.82rem; color: #6c757d; margin-top: 6px; text-align: center;">
            Кликните на любое из 20 фото для детального просмотра узлов, дверей, каркаса и готовых работ
          </div>
        </div>

        <!-- Правая колонка: Параметры, Конфигуратор и Быстрый заказ -->
        <div class="prod-info-col">
          <div class="prod-rating-row">
            <span class="prod-stars">★★★★★</span>
            <strong>4.9 / 5.0</strong>
            <span>(на основе 140+ установок в области)</span>
          </div>

          <h1 class="prod-title">${cfg.heroTitle}</h1>

          <!-- Блок динамической цены -->
          <div class="prod-price-box">
            <div>
              <div style="font-size: 0.82rem; color: #556b62; font-weight: 700; margin-bottom: 2px;">Заводская цена комплекта:</div>
              <div class="prod-price-main">
                <span class="prod-price-current" id="${cfg.prefix}PriceVal">${cfg.basePrice} ₽</span>
                <span class="prod-price-old" id="${cfg.prefix}OldPriceVal">${cfg.baseOldPrice} ₽</span>
              </div>
            </div>
            <span class="prod-price-badge">Скидка 20% до конца недели</span>
          </div>

          <!-- Конфигуратор 1: Длина теплицы -->
          <div class="prod-select-group">
            <label class="prod-select-label">1. Длина теплицы (ширина 3 метра):</label>
            <div class="prod-select-buttons">
              <button type="button" class="prod-select-btn" data-${cfg.prefix}-length="4m">3 × 4 м</button>
              <button type="button" class="prod-select-btn active" data-${cfg.prefix}-length="6m">3 × 6 м (Хит)</button>
              <button type="button" class="prod-select-btn" data-${cfg.prefix}-length="8m">3 × 8 м</button>
              <button type="button" class="prod-select-btn" data-${cfg.prefix}-length="10m">3 × 10 м</button>
            </div>
          </div>

          <!-- Конфигуратор 2: Шаг дуг (без двойной дуги!) -->
          <div class="prod-select-group">
            <label class="prod-select-label">2. Расстояние между дугами:</label>
            <div class="prod-select-buttons">
              <button type="button" class="prod-select-btn active" data-${cfg.prefix}-step="100">Стандарт (шаг 1 м)</button>
              <button type="button" class="prod-select-btn" data-${cfg.prefix}-step="65">Усиленная (шаг 0.65 м, +2 500 ₽)</button>
            </div>
          </div>

          <!-- Ключевые заводские параметры -->
          <ul class="prod-specs-bullets">
            <li><strong>Каркас:</strong> оцинкованная профильная труба ГОСТ с защитой от ржавчины</li>
            <li><strong>Торцы и двери:</strong> 2 широкие двери + 2 форточки в базовом комплекте</li>
            <li><strong>Высота теплицы:</strong> ${cfg.height} для комфортной работы в полный рост</li>
            <li><strong>Снеговая нагрузка:</strong> ${cfg.snowLoad}</li>
            <li><strong>Поликарбонат:</strong> сотовый лист с заводским лазерным УФ-слоем</li>
          </ul>

          <!-- Кнопка заказа -->
          <div class="prod-cta-row">
            <button type="button" class="prod-btn-primary" id="${cfg.prefix}OrderBtn" data-open-modal data-title="Заказ: ${cfg.name}" data-subtitle="Цена от производителя. Оплата строго по факту на участке (0 ₽ предоплаты)" data-subject="Заказ: ${cfg.name} 3х6м (от ${cfg.basePrice} ₽)">
              Заказать без предоплаты →
            </button>
            <div class="prod-trust-pills">
              <span class="prod-trust-pill">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                0 ₽ предоплаты
              </span>
              <span class="prod-trust-pill">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Сборка за 3–4 часа
              </span>
              <span class="prod-trust-pill">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Заводская гарантия
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- ПРЕИМУЩЕСТВА ФОРМЫ -->
      <div class="greenhouse-features-bar" style="margin-bottom: 35px;">
        ${cfg.featuresBarHtml}
      </div>

      <!-- ТАБЛИЦА СТОИМОСТИ ПО РАЗМЕРАМ (БЕЗ ДВОЙНОЙ ДУГИ) -->
      <div class="prod-details-box">
        <h2 class="prod-details-title">Прайс-лист на теплицы «${cfg.name}»</h2>
        <p style="color: #556b62; font-size: 0.95rem; margin: -10px 0 18px;">
          Цены указаны за полный готовый комплект с сотовым поликарбонатом 4 мм, фурнитурой и 0 ₽ предоплаты.
        </p>
        <div class="pricing-table-wrap">
          <table class="pricing-table">
            <thead>
              <tr>
                <th>Размер теплицы</th>
                <th>Стандарт (шаг 1 м)</th>
                <th>Усиленная (шаг 0.65 м)</th>
                <th>Действие</th>
              </tr>
            </thead>
            <tbody>
              ${cfg.pricingTableRows}
            </tbody>
          </table>
        </div>
      </div>

      <!-- ХАРАКТЕРИСТИКИ И КОМПЛЕКТАЦИЯ -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-bottom: 40px;" class="prod-specs-grid-2col">
        <!-- Левая колонка: Характеристики -->
        <div class="prod-details-box" style="margin-bottom: 0;">
          <h3 class="prod-details-title" style="font-size: 1.35rem;">Технические характеристики</h3>
          <table class="prod-table-specs">
            <tbody>
              <tr><td>Ширина</td><td>3.0 метра</td></tr>
              <tr><td>Высота</td><td>${cfg.height}</td></tr>
              <tr><td>Длина</td><td>4, 6, 8, 10 метров (удлинение кратно 2 м)</td></tr>
              <tr><td>Профиль каркаса</td><td>Оцинкованная труба ГОСТ Северсталь</td></tr>
              <tr><td>Цинковое покрытие</td><td>140 г/м² (горячее цинкование изнутри и снаружи)</td></tr>
              <tr><td>Шаг между дугами</td><td>1.0 м (стандарт) или 0.65 м (усиленный)</td></tr>
              <tr><td>Двери и форточки</td><td>2 двери и 2 форточки в противоположных торцах</td></tr>
              <tr><td>Снеговая стойкость</td><td>${cfg.snowLoad}</td></tr>
              <tr><td>Покрытие</td><td>Сотовый поликарбонат 4 мм / 6 мм с УФ-защитой</td></tr>
              <tr><td>Срок службы</td><td>15+ лет</td></tr>
            </tbody>
          </table>
        </div>

        <!-- Правая колонка: Комплектация «Все включено» -->
        <div class="prod-details-box" style="margin-bottom: 0;">
          <h3 class="prod-details-title" style="font-size: 1.35rem;">Комплектация «Все включено»</h3>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; font-size: 0.94rem; color: #333;">
            <li style="display:flex; gap:10px; align-items:flex-start;">
              <span style="color:#2d6a4f; font-weight:900;">•</span>
              <div><strong>Цельносварные торцы:</strong> сварены на кондукторе завода, исключают перекосы и ускоряют монтаж.</div>
            </li>
            <li style="display:flex; gap:10px; align-items:flex-start;">
              <span style="color:#2d6a4f; font-weight:900;">•</span>
              <div><strong>2 широкие двери и 2 форточки:</strong> обеспечивают сквозное проветривание без духоты и фитофторы.</div>
            </li>
            <li style="display:flex; gap:10px; align-items:flex-start;">
              <span style="color:#2d6a4f; font-weight:900;">•</span>
              <div><strong>Продольные стяжки:</strong> надежно связывают дуги в монолитный силовой пространственный каркас.</div>
            </li>
            <li style="display:flex; gap:10px; align-items:flex-start;">
              <span style="color:#2d6a4f; font-weight:900;">•</span>
              <div><strong>Сотовый поликарбонат с УФ-слоем:</strong> раскроен по ГОСТ, защищен заводской пленкой от повреждений.</div>
            </li>
            <li style="display:flex; gap:10px; align-items:flex-start;">
              <span style="color:#2d6a4f; font-weight:900;">•</span>
              <div><strong>Полный комплект фурнитуры:</strong> оцинкованные кровельные саморезы с прессшайбой, двусторонние ручки, ветровые крючки, задвижки.</div>
            </li>
            <li style="display:flex; gap:10px; align-items:flex-start;">
              <span style="color:#2d6a4f; font-weight:900;">•</span>
              <div><strong>Паспорт изделия и инструкция:</strong> подробное пошаговое руководство с иллюстрациями для самостоятельной сборки.</div>
            </li>
          </ul>
        </div>
      </div>

    </div>
  </main>

  <script>
    window.${cfg.prefix}PricingTable = ${JSON.stringify(cfg.pricingMap)};
  </script>
  `;
}

// 1. АРОЧНЫЕ ТЕПЛИЦЫ
const archConfig = {
  file: "arochnye.html",
  prefix: "arch",
  name: "Арочные теплицы",
  heroTitle: "Арочная теплица 3 м из оцинкованной трубы ГОСТ",
  basePrice: "26 900",
  baseOldPrice: "30 500",
  height: "2.10 метра",
  snowLoad: "до 240 кг/м² снега",
  photos: archPhotos,
  pricingMap: {
    "4m": { name: "3х4 метра", price: 21900, oldPrice: 24500 },
    "6m": { name: "3х6 метров", price: 26900, oldPrice: 30500 },
    "8m": { name: "3х8 метров", price: 32400, oldPrice: 36800 },
    "10m": { name: "3х10 метров", price: 37900, oldPrice: 42900 }
  },
  pricingTableRows: `
    <tr>
      <td><strong>3 × 4 метра</strong></td>
      <td>21 900 ₽</td>
      <td>24 400 ₽</td>
      <td><button class="btn btn-secondary" style="padding:6px 14px; font-size:0.85rem;" data-open-modal data-subject="Заказ 3х4 арочная">Заказать</button></td>
    </tr>
    <tr>
      <td><strong>3 × 6 метров (Хит)</strong></td>
      <td>26 900 ₽</td>
      <td>29 400 ₽</td>
      <td><button class="btn btn-secondary" style="padding:6px 14px; font-size:0.85rem;" data-open-modal data-subject="Заказ 3х6 арочная">Заказать</button></td>
    </tr>
    <tr>
      <td><strong>3 × 8 метров</strong></td>
      <td>32 400 ₽</td>
      <td>34 900 ₽</td>
      <td><button class="btn btn-secondary" style="padding:6px 14px; font-size:0.85rem;" data-open-modal data-subject="Заказ 3х8 арочная">Заказать</button></td>
    </tr>
    <tr>
      <td><strong>3 × 10 метров</strong></td>
      <td>37 900 ₽</td>
      <td>40 400 ₽</td>
      <td><button class="btn btn-secondary" style="padding:6px 14px; font-size:0.85rem;" data-open-modal data-subject="Заказ 3х10 арочная">Заказать</button></td>
    </tr>
  `,
  featuresBarHtml: `
    <div class="greenhouse-feature-pill">
      <div class="greenhouse-feature-pill-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg></div>
      <div><strong>Аэродинамика</strong><span>Обтекает шквалистый ветер</span></div>
    </div>
    <div class="greenhouse-feature-pill">
      <div class="greenhouse-feature-pill-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/></svg></div>
      <div><strong>Равномерный свет</strong><span>Солнце прогревает весь световой день</span></div>
    </div>
    <div class="greenhouse-feature-pill">
      <div class="greenhouse-feature-pill-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
      <div><strong>Труба ГОСТ</strong><span>Снеговая нагрузка до 240 кг/м²</span></div>
    </div>
    <div class="greenhouse-feature-pill">
      <div class="greenhouse-feature-pill-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
      <div><strong>Фабричная цена</strong><span>Честная стоимость без наценок посредников</span></div>
    </div>
  `
};

// 2. КАПЛЕВИДНЫЕ ТЕПЛИЦЫ
const dropConfig = {
  file: "kaplevidnye.html",
  prefix: "drop",
  name: "Каплевидные теплицы",
  heroTitle: "Каплевидная теплица «Стрелка» 3 м (снегосброс, высота 2.35 м)",
  basePrice: "30 900",
  baseOldPrice: "34 900",
  height: "2.35 метра",
  snowLoad: "до 320 кг/м² (снег скатывается сам)",
  photos: dropPhotos,
  pricingMap: {
    "4m": { name: "3х4 метра", price: 24900, oldPrice: 27900 },
    "6m": { name: "3х6 метров", price: 30900, oldPrice: 34900 },
    "8m": { name: "3х8 метров", price: 37400, oldPrice: 42500 },
    "10m": { name: "3х10 метров", price: 43900, oldPrice: 49900 }
  },
  pricingTableRows: `
    <tr>
      <td><strong>3 × 4 метра</strong></td>
      <td>24 900 ₽</td>
      <td>27 400 ₽</td>
      <td><button class="btn btn-secondary" style="padding:6px 14px; font-size:0.85rem;" data-open-modal data-subject="Заказ 3х4 капелька">Заказать</button></td>
    </tr>
    <tr>
      <td><strong>3 × 6 метров (Хит)</strong></td>
      <td>30 900 ₽</td>
      <td>33 400 ₽</td>
      <td><button class="btn btn-secondary" style="padding:6px 14px; font-size:0.85rem;" data-open-modal data-subject="Заказ 3х6 капелька">Заказать</button></td>
    </tr>
    <tr>
      <td><strong>3 × 8 метров</strong></td>
      <td>37 400 ₽</td>
      <td>39 900 ₽</td>
      <td><button class="btn btn-secondary" style="padding:6px 14px; font-size:0.85rem;" data-open-modal data-subject="Заказ 3х8 капелька">Заказать</button></td>
    </tr>
    <tr>
      <td><strong>3 × 10 метров</strong></td>
      <td>43 900 ₽</td>
      <td>46 400 ₽</td>
      <td><button class="btn btn-secondary" style="padding:6px 14px; font-size:0.85rem;" data-open-modal data-subject="Заказ 3х10 капелька">Заказать</button></td>
    </tr>
  `,
  featuresBarHtml: `
    <div class="greenhouse-feature-pill">
      <div class="greenhouse-feature-pill-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 22h20L12 2z"/></svg></div>
      <div><strong>Снегосброс</strong><span>Острый конёк не задерживает снег</span></div>
    </div>
    <div class="greenhouse-feature-pill">
      <div class="greenhouse-feature-pill-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
      <div><strong>Высота 2.35 м</strong><span>Простор для индетерминантных томатов</span></div>
    </div>
    <div class="greenhouse-feature-pill">
      <div class="greenhouse-feature-pill-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
      <div><strong>Усиленный конёк</strong><span>Оцинкованная планка по всему гребню</span></div>
    </div>
    <div class="greenhouse-feature-pill">
      <div class="greenhouse-feature-pill-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></div>
      <div><strong>0 ₽ предоплаты</strong><span>Оплата после сборки и осмотра</span></div>
    </div>
  `
};

// 3. ДОМИКОМ (ПРЯМОСТЕННЫЕ)
const houseConfig = {
  file: "domikom.html",
  prefix: "house",
  name: "Теплицы «Домиком»",
  heroTitle: "Прямостенная теплица «Домиком» 3 м (100% полезного объема)",
  basePrice: "34 900",
  baseOldPrice: "38 900",
  height: "2.15 метра (стены 1.7 м)",
  snowLoad: "до 280 кг/м²",
  photos: housePhotos,
  pricingMap: {
    "4m": { name: "3х4 метра", price: 27900, oldPrice: 30900 },
    "6m": { name: "3х6 метров", price: 34900, oldPrice: 38900 },
    "8m": { name: "3х8 метров", price: 41900, oldPrice: 46900 },
    "10m": { name: "3х10 метров", price: 48900, oldPrice: 54900 }
  },
  pricingTableRows: `
    <tr>
      <td><strong>3 × 4 метра</strong></td>
      <td>27 900 ₽</td>
      <td>30 400 ₽</td>
      <td><button class="btn btn-secondary" style="padding:6px 14px; font-size:0.85rem;" data-open-modal data-subject="Заказ 3х4 домиком">Заказать</button></td>
    </tr>
    <tr>
      <td><strong>3 × 6 метров (Хит)</strong></td>
      <td>34 900 ₽</td>
      <td>37 400 ₽</td>
      <td><button class="btn btn-secondary" style="padding:6px 14px; font-size:0.85rem;" data-open-modal data-subject="Заказ 3х6 домиком">Заказать</button></td>
    </tr>
    <tr>
      <td><strong>3 × 8 метров</strong></td>
      <td>41 900 ₽</td>
      <td>44 400 ₽</td>
      <td><button class="btn btn-secondary" style="padding:6px 14px; font-size:0.85rem;" data-open-modal data-subject="Заказ 3х8 домиком">Заказать</button></td>
    </tr>
    <tr>
      <td><strong>3 × 10 метров</strong></td>
      <td>48 900 ₽</td>
      <td>51 400 ₽</td>
      <td><button class="btn btn-secondary" style="padding:6px 14px; font-size:0.85rem;" data-open-modal data-subject="Заказ 3х10 домиком">Заказать</button></td>
    </tr>
  `,
  featuresBarHtml: `
    <div class="greenhouse-feature-pill">
      <div class="greenhouse-feature-pill-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg></div>
      <div><strong>Прямые стены 1.7 м</strong><span>Посадка растений вплотную к краям</span></div>
    </div>
    <div class="greenhouse-feature-pill">
      <div class="greenhouse-feature-pill-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></div>
      <div><strong>Двускатная крыша</strong><span>Эффективный естественный сход снега</span></div>
    </div>
    <div class="greenhouse-feature-pill">
      <div class="greenhouse-feature-pill-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
      <div><strong>Усиленные фермы</strong><span>Жесткая связка углов и перекрытий</span></div>
    </div>
    <div class="greenhouse-feature-pill">
      <div class="greenhouse-feature-pill-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></div>
      <div><strong>100% полезный объем</strong><span>Ходите в полный рост по всей теплице</span></div>
    </div>
  `
};

function updateProductPage(cfg) {
  let html = fs.readFileSync(cfg.file, 'utf8');

  // Add cache buster to scripts so user gets fresh version instantly
  html = html.replace(/assets\/js\/catalog-data\.js(?:\?v=[\d\.]+)?/g, 'assets/js/catalog-data.js?v=3.0');
  html = html.replace(/assets\/js\/main\.js(?:\?v=[\d\.]+)?/g, 'assets/js/main.js?v=3.0');
  html = html.replace(/assets\/css\/style\.css(?:\?v=[\d\.]+)?/g, 'assets/css/style.css?v=3.0');

  const headerEndTag = '</header>';
  const footerStartTag = '<!-- Подвал сайта -->';

  const headerPos = html.indexOf(headerEndTag);
  const footerPos = html.indexOf(footerStartTag);

  if (headerPos === -1 || footerPos === -1) {
    console.error('Could not find header or footer tags in', cfg.file);
    return;
  }

  const before = html.substring(0, headerPos + headerEndTag.length);
  const after = html.substring(footerPos);

  const newContent = generatePageContent(cfg);

  let updatedAfter = after;
  const scriptMarker = `<!-- Интерактивная галерея`;
  const scriptPos = updatedAfter.indexOf(scriptMarker);
  if (scriptPos !== -1) {
    const endBodyPos = updatedAfter.indexOf('</body>');
    updatedAfter = updatedAfter.substring(0, scriptPos) + updatedAfter.substring(endBodyPos);
  }

  let updatedBefore = before.replace('Богатырь', 'Усиленная 0.65м');

  const galleryClientScript = `
  <!-- Интерактивная галерея и конфигуратор ${cfg.name} -->
  <script>
    (function() {
      const mainImg = document.getElementById('${cfg.prefix}MainImg');
      const counter = document.getElementById('${cfg.prefix}Counter');
      const prevBtn = document.getElementById('${cfg.prefix}PrevBtn');
      const nextBtn = document.getElementById('${cfg.prefix}NextBtn');
      const thumbs = document.querySelectorAll('#${cfg.prefix}Thumbs .prod-thumb-item');
      if (!mainImg || !thumbs.length) return;

      let currentIdx = 0;
      const count = thumbs.length;

      function setSlide(idx) {
        if (idx < 0) idx = count - 1;
        if (idx >= count) idx = 0;
        currentIdx = idx;
        const targetThumb = thumbs[currentIdx];
        const src = targetThumb.getAttribute('data-src');
        mainImg.style.opacity = '0.4';
        setTimeout(() => {
          mainImg.src = src;
          mainImg.style.opacity = '1';
        }, 100);
        if (counter) counter.textContent = (currentIdx + 1) + ' / ' + count + ' • Листайте фото';
        thumbs.forEach((t, i) => t.classList.toggle('active', i === currentIdx));
        targetThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }

      thumbs.forEach((t, i) => {
        t.addEventListener('click', () => setSlide(i));
      });

      if (prevBtn) prevBtn.addEventListener('click', () => setSlide(currentIdx - 1));
      if (nextBtn) nextBtn.addEventListener('click', () => setSlide(currentIdx + 1));

      // Поддержка Touch Swipe для мобильных устройств
      let touchStartX = 0;
      let touchStartY = 0;
      const mainView = mainImg.closest('.prod-main-view');
      if (mainView) {
        mainView.addEventListener('touchstart', (e) => {
          touchStartX = e.changedTouches[0].clientX;
          touchStartY = e.changedTouches[0].clientY;
        }, { passive: true });
        mainView.addEventListener('touchend', (e) => {
          const diffX = touchStartX - e.changedTouches[0].clientX;
          const diffY = touchStartY - e.changedTouches[0].clientY;
          if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 35) {
            if (diffX > 0) setSlide(currentIdx + 1);
            else setSlide(currentIdx - 1);
          }
        }, { passive: true });
      }

      // Конфигуратор цен
      const priceEl = document.getElementById('${cfg.prefix}PriceVal');
      const oldPriceEl = document.getElementById('${cfg.prefix}OldPriceVal');
      const orderBtn = document.getElementById('${cfg.prefix}OrderBtn');
      const lengthBtns = document.querySelectorAll('[data-${cfg.prefix}-length]');
      const stepBtns = document.querySelectorAll('[data-${cfg.prefix}-step]');

      let currentLength = '6m';
      let currentStep = '100';

      const pricingTable = window.${cfg.prefix}PricingTable || {};

      function updatePrice() {
        const item = pricingTable[currentLength] || { price: 26900, oldPrice: 30500, name: '3х6 метров' };
        const stepAdd = currentStep === '65' ? 2500 : 0;
        const total = item.price + stepAdd;
        const totalOld = item.oldPrice + stepAdd;

        if (priceEl) priceEl.textContent = total.toLocaleString('ru-RU') + ' ₽';
        if (oldPriceEl) oldPriceEl.textContent = totalOld.toLocaleString('ru-RU') + ' ₽';
        if (orderBtn) {
          const stepName = currentStep === '65' ? 'шаг 0.65 м (усиленный)' : 'шаг 1 м';
          orderBtn.setAttribute('data-subject', 'Заказ: ${cfg.name} ' + item.name + ' (' + stepName + ') - ' + total.toLocaleString('ru-RU') + ' руб');
        }
      }

      lengthBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          lengthBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentLength = btn.getAttribute('data-${cfg.prefix}-length');
          updatePrice();
        });
      });

      stepBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          stepBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentStep = btn.getAttribute('data-${cfg.prefix}-step');
          updatePrice();
        });
      });

      updatePrice();
    })();
  </script>
</body>`;

  updatedAfter = updatedAfter.replace('</body>', galleryClientScript);

  const fullHtml = updatedBefore + '\n' + newContent + '\n' + updatedAfter;
  fs.writeFileSync(cfg.file, fullHtml, 'utf8');
  console.log('Successfully updated', cfg.file);
}

updateProductPage(archConfig);
updateProductPage(dropConfig);
updateProductPage(houseConfig);

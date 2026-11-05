
// ==========================================
// ЕДИНАЯ ВКЛАДКА: СТРАНИЦЫ И ФОТОГРАФИИ
// ==========================================

function onPageSelectorChange(pageKey) {
  renderPageEditor(pageKey);
  loadPagesTab(pageKey);
}
window.onPageSelectorChange = onPageSelectorChange;

function selectAndScrollToPage(pageKey) {
  const dropdown = document.getElementById("pageSelectorDropdown");
  if (dropdown) dropdown.value = pageKey;
  renderPageEditor(pageKey);
  loadPagesTab(pageKey);
  const container = document.getElementById("pageEditorContainer");
  if (container) container.scrollIntoView({ behavior: "smooth", block: "start" });
}
window.selectAndScrollToPage = selectAndScrollToPage;

function renderPageEditor(pageKey) {
  const container = document.getElementById("pageEditorContainer");
  const dropdown = document.getElementById("pageSelectorDropdown");
  const openBtn = document.getElementById("pageSelectorOpenBtn");
  if (dropdown && dropdown.value !== pageKey) dropdown.value = pageKey;

  const config = getSiteConfig();
  const pages = config.pages || (typeof DEFAULT_PAGES !== "undefined" ? DEFAULT_PAGES : {}) || {};
  const p = pages[pageKey] || {};

  if (openBtn) {
    openBtn.href = p.file || "index.html";
    openBtn.innerHTML = `<span>👁</span> Открыть «${p.name || "страницу"}» на сайте`;
  }

  if (!container) return;

  if (pageKey === "glavnaya") {
    const hp = config.homepagePhotos || (typeof DEFAULT_HOMEPAGE_PHOTOS !== "undefined" ? DEFAULT_HOMEPAGE_PHOTOS : {});
    container.innerHTML = `
      <div class="admin-card" style="border: 2px solid #2d6a4f; border-radius: 16px; padding: 22px; background: #fff; box-shadow: 0 4px 18px rgba(0,0,0,0.05);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; border-bottom: 1px solid #e2e8f0; padding-bottom: 14px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h2 style="font-size: 1.35rem; color: #1b4332; margin: 0 0 4px;">🏠 Фотографии и витрина главной страницы</h2>
            <p style="color: #64748b; font-size: 0.88rem; margin: 0;">Файл: <code>index.html</code> • Главная страница сайта</p>
          </div>
          <div style="display: flex; gap: 8px;">
            <button type="button" class="btn-admin btn-admin-primary" onclick="saveCurrentPageAndPublish('glavnaya')">🚀 Сохранить и опубликовать</button>
          </div>
        </div>

        <!-- 1. Главное фото в шапке (Hero) -->
        <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
          <h3 style="font-size: 1.05rem; color: #1b4332; margin: 0 0 4px;">1. Главная теплица (первый экран в шапке)</h3>
          <p style="color: #64748b; font-size: 0.84rem; margin: 0 0 12px;">Большое фото теплицы в самом верху рядом с заголовком «Ваш урожай начинается здесь!»</p>
          <div style="display: grid; grid-template-columns: 180px 1fr; gap: 16px; align-items: center;">
            <div style="height: 120px; border-radius: 8px; overflow: hidden; border: 1px solid #cbd5e1; background: #e2e8f0;">
              <img id="glav_hero_img" src="${hp.hero || 'assets/images/teplica.png'}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/images/teplica.png'">
            </div>
            <div>
              <label class="btn-admin btn-admin-light" style="display: inline-block; cursor: pointer; padding: 10px 16px; font-weight: 700; border-radius: 8px; margin-bottom: 8px;">
                📁 Загрузить с устройства (телефон/ПК)
                <input type="file" accept="image/*" style="display: none;" onchange="handleSinglePhotoUpload(this, 'glav_hero_img', 'glav_hero_url')">
              </label>
              <input type="text" id="glav_hero_url" class="form-input-admin" value="${hp.hero || 'assets/images/teplica.png'}" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.82rem;" oninput="document.getElementById('glav_hero_img').src = this.value">
            </div>
          </div>
        </div>

        <!-- 2. Три фото преимуществ -->
        <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
          <h3 style="font-size: 1.05rem; color: #1b4332; margin: 0 0 4px;">2. Фото в трёх карточках преимуществ</h3>
          <p style="color: #64748b; font-size: 0.84rem; margin: 0 0 14px;">Блок «Три главных преимущества наших теплиц» под шапкой</p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;">
            <div style="background: #fff; padding: 12px; border-radius: 10px; border: 1px solid #e2e8f0;">
              <div style="font-weight: 700; font-size: 0.86rem; color: #1b4332; margin-bottom: 6px;">1. Двери и форточки:</div>
              <div style="height: 110px; border-radius: 6px; overflow: hidden; margin-bottom: 8px; border: 1px solid #cbd5e1;">
                <img id="glav_feat1_img" src="${hp.feat1 || 'assets/images/products/p3/2.jpg'}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/images/products/p3/2.jpg'">
              </div>
              <label class="btn-admin btn-admin-light" style="display: block; text-align: center; cursor: pointer; padding: 6px; font-size: 0.78rem; font-weight: 700; border-radius: 6px; margin-bottom: 6px;">
                📁 Заменить фото
                <input type="file" accept="image/*" style="display: none;" onchange="handleSinglePhotoUpload(this, 'glav_feat1_img', 'glav_feat1_url')">
              </label>
              <input type="text" id="glav_feat1_url" class="form-input-admin" value="${hp.feat1 || 'assets/images/products/p3/2.jpg'}" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.78rem;" oninput="document.getElementById('glav_feat1_img').src = this.value">
            </div>

            <div style="background: #fff; padding: 12px; border-radius: 10px; border: 1px solid #e2e8f0;">
              <div style="font-weight: 700; font-size: 0.86rem; color: #1b4332; margin-bottom: 6px;">2. Поликарбонат с УФ:</div>
              <div style="height: 110px; border-radius: 6px; overflow: hidden; margin-bottom: 8px; border: 1px solid #cbd5e1;">
                <img id="glav_feat2_img" src="${hp.feat2 || 'assets/images/works/work_5_polikarbonat.png'}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/images/works/work_5_polikarbonat.png'">
              </div>
              <label class="btn-admin btn-admin-light" style="display: block; text-align: center; cursor: pointer; padding: 6px; font-size: 0.78rem; font-weight: 700; border-radius: 6px; margin-bottom: 6px;">
                📁 Заменить фото
                <input type="file" accept="image/*" style="display: none;" onchange="handleSinglePhotoUpload(this, 'glav_feat2_img', 'glav_feat2_url')">
              </label>
              <input type="text" id="glav_feat2_url" class="form-input-admin" value="${hp.feat2 || 'assets/images/works/work_5_polikarbonat.png'}" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.78rem;" oninput="document.getElementById('glav_feat2_img').src = this.value">
            </div>

            <div style="background: #fff; padding: 12px; border-radius: 10px; border: 1px solid #e2e8f0;">
              <div style="font-weight: 700; font-size: 0.86rem; color: #1b4332; margin-bottom: 6px;">3. Сборка и гарантия:</div>
              <div style="height: 110px; border-radius: 6px; overflow: hidden; margin-bottom: 8px; border: 1px solid #cbd5e1;">
                <img id="glav_feat3_img" src="${hp.feat3 || 'assets/images/works/work_2_ustanovka.png'}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/images/works/work_2_ustanovka.png'">
              </div>
              <label class="btn-admin btn-admin-light" style="display: block; text-align: center; cursor: pointer; padding: 6px; font-size: 0.78rem; font-weight: 700; border-radius: 6px; margin-bottom: 6px;">
                📁 Заменить фото
                <input type="file" accept="image/*" style="display: none;" onchange="handleSinglePhotoUpload(this, 'glav_feat3_img', 'glav_feat3_url')">
              </label>
              <input type="text" id="glav_feat3_url" class="form-input-admin" value="${hp.feat3 || 'assets/images/works/work_2_ustanovka.png'}" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.78rem;" oninput="document.getElementById('glav_feat3_img').src = this.value">
            </div>
          </div>
        </div>

        <!-- 3. Интерактивная витрина -->
        <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
          <h3 style="font-size: 1.05rem; color: #1b4332; margin: 0 0 4px;">3. Фото в интерактивной витрине теплиц</h3>
          <p style="color: #64748b; font-size: 0.84rem; margin: 0 0 14px;">Фотографии, показываемые при переключении кнопок в блоке витрины</p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;">
            <div style="background: #fff; padding: 12px; border-radius: 10px; border: 1px solid #e2e8f0;">
              <div style="font-weight: 700; font-size: 0.86rem; color: #1b4332; margin-bottom: 6px;">Арочная теплица:</div>
              <div style="height: 110px; border-radius: 6px; overflow: hidden; margin-bottom: 8px; border: 1px solid #cbd5e1;">
                <img id="glav_show_arch_img" src="${hp.showcaseArch || 'assets/images/products/p1/2.jpg'}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/images/products/p1/2.jpg'">
              </div>
              <label class="btn-admin btn-admin-light" style="display: block; text-align: center; cursor: pointer; padding: 6px; font-size: 0.78rem; font-weight: 700; border-radius: 6px; margin-bottom: 6px;">
                📁 Заменить фото
                <input type="file" accept="image/*" style="display: none;" onchange="handleSinglePhotoUpload(this, 'glav_show_arch_img', 'glav_show_arch_url')">
              </label>
              <input type="text" id="glav_show_arch_url" class="form-input-admin" value="${hp.showcaseArch || 'assets/images/products/p1/2.jpg'}" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.78rem;" oninput="document.getElementById('glav_show_arch_img').src = this.value">
            </div>

            <div style="background: #fff; padding: 12px; border-radius: 10px; border: 1px solid #e2e8f0;">
              <div style="font-weight: 700; font-size: 0.86rem; color: #1b4332; margin-bottom: 6px;">Каплевидная (Стрела):</div>
              <div style="height: 110px; border-radius: 6px; overflow: hidden; margin-bottom: 8px; border: 1px solid #cbd5e1;">
                <img id="glav_show_drop_img" src="${hp.showcaseDrop || 'assets/images/products/p6/1.jpg'}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/images/products/p6/1.jpg'">
              </div>
              <label class="btn-admin btn-admin-light" style="display: block; text-align: center; cursor: pointer; padding: 6px; font-size: 0.78rem; font-weight: 700; border-radius: 6px; margin-bottom: 6px;">
                📁 Заменить фото
                <input type="file" accept="image/*" style="display: none;" onchange="handleSinglePhotoUpload(this, 'glav_show_drop_img', 'glav_show_drop_url')">
              </label>
              <input type="text" id="glav_show_drop_url" class="form-input-admin" value="${hp.showcaseDrop || 'assets/images/products/p6/1.jpg'}" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.78rem;" oninput="document.getElementById('glav_show_drop_img').src = this.value">
            </div>

            <div style="background: #fff; padding: 12px; border-radius: 10px; border: 1px solid #e2e8f0;">
              <div style="font-weight: 700; font-size: 0.86rem; color: #1b4332; margin-bottom: 6px;">Теплица Домиком:</div>
              <div style="height: 110px; border-radius: 6px; overflow: hidden; margin-bottom: 8px; border: 1px solid #cbd5e1;">
                <img id="glav_show_house_img" src="${hp.showcaseHouse || 'assets/images/products/p2/5.jpg'}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/images/products/p2/5.jpg'">
              </div>
              <label class="btn-admin btn-admin-light" style="display: block; text-align: center; cursor: pointer; padding: 6px; font-size: 0.78rem; font-weight: 700; border-radius: 6px; margin-bottom: 6px;">
                📁 Заменить фото
                <input type="file" accept="image/*" style="display: none;" onchange="handleSinglePhotoUpload(this, 'glav_show_house_img', 'glav_show_house_url')">
              </label>
              <input type="text" id="glav_show_house_url" class="form-input-admin" value="${hp.showcaseHouse || 'assets/images/products/p2/5.jpg'}" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.78rem;" oninput="document.getElementById('glav_show_house_img').src = this.value">
            </div>
          </div>
        </div>

        <!-- 4. Тексты главной -->
        <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
          <h3 style="font-size: 1.05rem; color: #1b4332; margin: 0 0 14px;">4. Заголовки и тексты главной страницы</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px;">
            <div>
              <label style="display: block; font-weight: 700; font-size: 0.88rem; color: #1b4332; margin-bottom: 4px;">Главный заголовок H1:</label>
              <input type="text" id="glav_title" class="form-input-admin" value="${p.title || 'Теплицы от завода-производителя в Ярославле'}" style="width: 100%; padding: 9px; border: 1.5px solid #cbd5e1; border-radius: 8px;">
            </div>
            <div>
              <label style="display: block; font-weight: 700; font-size: 0.88rem; color: #1b4332; margin-bottom: 4px;">Бейдж акции:</label>
              <input type="text" id="glav_badge" class="form-input-admin" value="${p.badge || 'Акция сезона'}" style="width: 100%; padding: 9px; border: 1.5px solid #cbd5e1; border-radius: 8px;">
            </div>
            <div style="grid-column: 1 / -1;">
              <label style="display: block; font-weight: 700; font-size: 0.88rem; color: #1b4332; margin-bottom: 4px;">Подзаголовок / описание:</label>
              <textarea id="glav_desc" class="form-input-admin" rows="2" style="width: 100%; padding: 9px; border: 1.5px solid #cbd5e1; border-radius: 8px;">${p.description || ''}</textarea>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 12px; justify-content: flex-end; flex-wrap: wrap;">
          <button type="button" class="btn-admin btn-admin-primary" style="padding: 12px 24px; font-weight: 800;" onclick="saveCurrentPageAndPublish('glavnaya')">
            🚀 Сохранить и сразу опубликовать
          </button>
        </div>
      </div>
    `;
    return;
  }

  // РЕДАКТОР ДРУГИХ СТРАНИЦ САЙТА
  container.innerHTML = `
    <div class="admin-card" style="border: 2px solid #2d6a4f; border-radius: 16px; padding: 22px; background: #fff; box-shadow: 0 4px 18px rgba(0,0,0,0.05);">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; border-bottom: 1px solid #e2e8f0; padding-bottom: 14px; flex-wrap: wrap; gap: 10px;">
        <div>
          <h2 style="font-size: 1.35rem; color: #1b4332; margin: 0 0 4px;">📄 Редактирование: ${p.name || pageKey}</h2>
          <p style="color: #64748b; font-size: 0.88rem; margin: 0;">Файл: <code>${p.file || ''}</code> • Раздел: ${p.category || 'Страница'}</p>
        </div>
        <div style="display: flex; gap: 8px;">
          <button type="button" class="btn-admin btn-admin-primary" onclick="saveCurrentPageAndPublish('${pageKey}')">🚀 Сохранить и опубликовать</button>
        </div>
      </div>

      <!-- Главное фото / баннер страницы -->
      <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
        <h3 style="font-size: 1.05rem; color: #1b4332; margin: 0 0 4px;">🖼️ Главное фото / баннер страницы</h3>
        <p style="color: #64748b; font-size: 0.84rem; margin: 0 0 14px;">Отображается вверху страницы как основная иллюстрация или баннер</p>
        
        <div style="display: grid; grid-template-columns: 240px 1fr; gap: 18px; align-items: center;">
          <div style="height: 160px; border-radius: 10px; overflow: hidden; border: 1.5px solid #cbd5e1; background: #e2e8f0; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
            <img id="page_custom_img" src="${p.bannerImage || 'assets/images/teplica.png'}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/images/teplica.png'">
          </div>
          <div>
            <label class="btn-admin btn-admin-light" style="display: inline-block; cursor: pointer; padding: 12px 20px; font-weight: 800; border-radius: 8px; margin-bottom: 10px; background: #e2e8f0; color: #1b4332;">
              📁 Загрузить новое фото с телефона / ПК
              <input type="file" accept="image/*" style="display: none;" onchange="handleSinglePhotoUpload(this, 'page_custom_img', 'page_custom_url')">
            </label>
            <div style="font-size: 0.8rem; color: #64748b; margin-bottom: 6px;">Или укажите путь/ссылку на изображение:</div>
            <input type="text" id="page_custom_url" class="form-input-admin" value="${p.bannerImage || 'assets/images/teplica.png'}" style="width: 100%; padding: 9px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.85rem;" oninput="document.getElementById('page_custom_img').src = this.value">
          </div>
        </div>
      </div>

      <!-- Текстовые поля страницы -->
      <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
        <h3 style="font-size: 1.05rem; color: #1b4332; margin: 0 0 14px;">📝 Текст и заголовки страницы</h3>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px; margin-bottom: 14px;">
          <div style="grid-column: 1 / -1;">
            <label style="display: block; font-weight: 700; font-size: 0.88rem; color: #1b4332; margin-bottom: 4px;">Заголовок страницы (H1):</label>
            <input type="text" id="page_custom_title" class="form-input-admin" value="${p.title || ''}" style="width: 100%; padding: 10px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 0.95rem;">
          </div>
          <div>
            <label style="display: block; font-weight: 700; font-size: 0.88rem; color: #1b4332; margin-bottom: 4px;">Бейдж / Акция:</label>
            <input type="text" id="page_custom_badge" class="form-input-admin" value="${p.badge || ''}" style="width: 100%; padding: 9px; border: 1.5px solid #cbd5e1; border-radius: 8px;">
          </div>
          <div>
            <label style="display: block; font-weight: 700; font-size: 0.88rem; color: #1b4332; margin-bottom: 4px;">Текст цены / срока:</label>
            <input type="text" id="page_custom_price" class="form-input-admin" value="${p.priceText || ''}" style="width: 100%; padding: 9px; border: 1.5px solid #cbd5e1; border-radius: 8px;">
          </div>
          <div style="grid-column: 1 / -1;">
            <label style="display: block; font-weight: 700; font-size: 0.88rem; color: #1b4332; margin-bottom: 4px;">Описание / подзаголовок:</label>
            <textarea id="page_custom_desc" class="form-input-admin" rows="3" style="width: 100%; padding: 10px; border: 1.5px solid #cbd5e1; border-radius: 8px;">${p.description || ''}</textarea>
          </div>
        </div>
      </div>

      <div style="display: flex; gap: 12px; justify-content: flex-end; flex-wrap: wrap;">
        <button type="button" class="btn-admin btn-admin-primary" style="padding: 12px 24px; font-weight: 800;" onclick="saveCurrentPageAndPublish('${pageKey}')">
          🚀 Сохранить и сразу опубликовать
        </button>
      </div>
    </div>
  `;
}
window.renderPageEditor = renderPageEditor;

async function handleSinglePhotoUpload(input, imgId, urlInputId) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  const imgEl = document.getElementById(imgId);
  const urlEl = document.getElementById(urlInputId);

  try {
    if (typeof compressImageFile === "function") {
      const compressed = await compressImageFile(file, 1400, 0.84);
      if (imgEl) imgEl.src = compressed;
      if (urlEl) urlEl.value = compressed;
      return;
    }
  } catch(e) {
    console.warn("Compression fallback:", e);
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    if (imgEl) imgEl.src = e.target.result;
    if (urlEl) urlEl.value = e.target.result;
  };
  reader.readAsDataURL(file);
}
window.handleSinglePhotoUpload = handleSinglePhotoUpload;

async function saveCurrentPageAndPublish(pageKey) {
  const config = getSiteConfig();
  if (!config.pages) config.pages = { ...(typeof DEFAULT_PAGES !== "undefined" ? DEFAULT_PAGES : {}) };

  if (pageKey === "glavnaya") {
    if (!config.homepagePhotos) config.homepagePhotos = {};
    const heroVal = document.getElementById("glav_hero_url")?.value;
    const feat1Val = document.getElementById("glav_feat1_url")?.value;
    const feat2Val = document.getElementById("glav_feat2_url")?.value;
    const feat3Val = document.getElementById("glav_feat3_url")?.value;
    const archVal = document.getElementById("glav_show_arch_url")?.value;
    const dropVal = document.getElementById("glav_show_drop_url")?.value;
    const houseVal = document.getElementById("glav_show_house_url")?.value;

    if (heroVal) config.homepagePhotos.hero = heroVal;
    if (feat1Val) config.homepagePhotos.feat1 = feat1Val;
    if (feat2Val) config.homepagePhotos.feat2 = feat2Val;
    if (feat3Val) config.homepagePhotos.feat3 = feat3Val;
    if (archVal) config.homepagePhotos.showcaseArch = archVal;
    if (dropVal) config.homepagePhotos.showcaseDrop = dropVal;
    if (houseVal) config.homepagePhotos.showcaseHouse = houseVal;

    const p = config.pages["glavnaya"] || {};
    p.title = document.getElementById("glav_title")?.value || p.title;
    p.badge = document.getElementById("glav_badge")?.value || p.badge;
    p.description = document.getElementById("glav_desc")?.value || p.description;
    if (heroVal) p.bannerImage = heroVal;
    config.pages["glavnaya"] = p;
  } else {
    const p = config.pages[pageKey] || {};
    p.title = document.getElementById("page_custom_title")?.value || p.title;
    p.badge = document.getElementById("page_custom_badge")?.value || p.badge;
    p.priceText = document.getElementById("page_custom_price")?.value || p.priceText;
    p.description = document.getElementById("page_custom_desc")?.value || p.description;
    const imgVal = document.getElementById("page_custom_url")?.value;
    if (imgVal) p.bannerImage = imgVal;
    config.pages[pageKey] = p;
  }

  saveSiteConfig(config);
  loadPagesTab(pageKey);
  showAdminToast("Изменения страницы сохранены!", "Опубликовать на сайт", () => publishToGithub("toast"));
  await publishToGithub("pages");
}
window.saveCurrentPageAndPublish = saveCurrentPageAndPublish;

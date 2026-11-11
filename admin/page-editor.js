
// ==========================================
// ЕДИНАЯ ВКЛАДКА: СТРАНИЦЫ, ФОТО И ВИДЕО
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

  // 1. ГЛАВНАЯ СТРАНИЦА
  if (pageKey === "glavnaya") {
    const hp = config.homepagePhotos || (typeof DEFAULT_HOMEPAGE_PHOTOS !== "undefined" ? DEFAULT_HOMEPAGE_PHOTOS : {});
    container.innerHTML = `
      <div class="admin-card" style="border: 2px solid #2d6a4f; border-radius: 16px; padding: 20px; background: #fff; box-shadow: 0 4px 18px rgba(0,0,0,0.05); box-sizing: border-box; max-width: 100%;">
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
        <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 16px; margin-bottom: 20px; box-sizing: border-box;">
          <h3 style="font-size: 1.05rem; color: #1b4332; margin: 0 0 4px;">1. Главная теплица (первый экран в шапке)</h3>
          <p style="color: #64748b; font-size: 0.84rem; margin: 0 0 12px;">Большое фото теплицы в самом верху рядом с заголовком «Ваш урожай начинается здесь!»</p>
          <div class="page-banner-grid">
            <div class="banner-preview-box" style="height: 140px; border-radius: 8px; overflow: hidden; border: 1px solid #cbd5e1; background: #e2e8f0;">
              <img id="glav_hero_img" src="${hp.hero || 'assets/images/teplica.png'}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/images/teplica.png'">
            </div>
            <div style="min-width: 0;">
              <label class="btn-admin btn-admin-light" style="display: block; width: 100%; text-align: center; cursor: pointer; padding: 10px 14px; font-weight: 700; border-radius: 8px; margin-bottom: 8px; box-sizing: border-box;">
                📁 Загрузить с устройства (телефон/ПК)
                <input type="file" accept="image/*" style="display: none;" onchange="handleSinglePhotoUpload(this, 'glav_hero_img', 'glav_hero_url')">
              </label>
              <input type="text" id="glav_hero_url" class="form-input-admin" value="${hp.hero || 'assets/images/teplica.png'}" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.82rem; box-sizing: border-box;" oninput="document.getElementById('glav_hero_img').src = this.value">
            </div>
          </div>
        </div>

        <!-- 2. Три фото преимуществ -->
        <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 16px; margin-bottom: 20px; box-sizing: border-box;">
          <h3 style="font-size: 1.05rem; color: #1b4332; margin: 0 0 4px;">2. Фото в трёх карточках преимуществ</h3>
          <p style="color: #64748b; font-size: 0.84rem; margin: 0 0 14px;">Блок «Три главных преимущества наших теплиц» под шапкой</p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px;">
            <div style="background: #fff; padding: 12px; border-radius: 10px; border: 1px solid #e2e8f0; box-sizing: border-box;">
              <div style="font-weight: 700; font-size: 0.86rem; color: #1b4332; margin-bottom: 6px;">1. Двери и форточки:</div>
              <div style="height: 110px; border-radius: 6px; overflow: hidden; margin-bottom: 8px; border: 1px solid #cbd5e1;">
                <img id="glav_feat1_img" src="${hp.feat1 || 'assets/images/products/p3/2.jpg'}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/images/products/p3/2.jpg'">
              </div>
              <label class="btn-admin btn-admin-light" style="display: block; width: 100%; text-align: center; cursor: pointer; padding: 6px; font-size: 0.78rem; font-weight: 700; border-radius: 6px; margin-bottom: 6px; box-sizing: border-box;">
                📁 Заменить фото
                <input type="file" accept="image/*" style="display: none;" onchange="handleSinglePhotoUpload(this, 'glav_feat1_img', 'glav_feat1_url')">
              </label>
              <input type="text" id="glav_feat1_url" class="form-input-admin" value="${hp.feat1 || 'assets/images/products/p3/2.jpg'}" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.78rem; box-sizing: border-box;" oninput="document.getElementById('glav_feat1_img').src = this.value">
            </div>

            <div style="background: #fff; padding: 12px; border-radius: 10px; border: 1px solid #e2e8f0; box-sizing: border-box;">
              <div style="font-weight: 700; font-size: 0.86rem; color: #1b4332; margin-bottom: 6px;">2. Поликарбонат с УФ:</div>
              <div style="height: 110px; border-radius: 6px; overflow: hidden; margin-bottom: 8px; border: 1px solid #cbd5e1;">
                <img id="glav_feat2_img" src="${hp.feat2 || 'assets/images/works/work_5_polikarbonat.png'}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/images/works/work_5_polikarbonat.png'">
              </div>
              <label class="btn-admin btn-admin-light" style="display: block; width: 100%; text-align: center; cursor: pointer; padding: 6px; font-size: 0.78rem; font-weight: 700; border-radius: 6px; margin-bottom: 6px; box-sizing: border-box;">
                📁 Заменить фото
                <input type="file" accept="image/*" style="display: none;" onchange="handleSinglePhotoUpload(this, 'glav_feat2_img', 'glav_feat2_url')">
              </label>
              <input type="text" id="glav_feat2_url" class="form-input-admin" value="${hp.feat2 || 'assets/images/works/work_5_polikarbonat.png'}" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.78rem; box-sizing: border-box;" oninput="document.getElementById('glav_feat2_img').src = this.value">
            </div>

            <div style="background: #fff; padding: 12px; border-radius: 10px; border: 1px solid #e2e8f0; box-sizing: border-box;">
              <div style="font-weight: 700; font-size: 0.86rem; color: #1b4332; margin-bottom: 6px;">3. Сборка и гарантия:</div>
              <div style="height: 110px; border-radius: 6px; overflow: hidden; margin-bottom: 8px; border: 1px solid #cbd5e1;">
                <img id="glav_feat3_img" src="${hp.feat3 || 'assets/images/works/work_2_ustanovka.png'}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/images/works/work_2_ustanovka.png'">
              </div>
              <label class="btn-admin btn-admin-light" style="display: block; width: 100%; text-align: center; cursor: pointer; padding: 6px; font-size: 0.78rem; font-weight: 700; border-radius: 6px; margin-bottom: 6px; box-sizing: border-box;">
                📁 Заменить фото
                <input type="file" accept="image/*" style="display: none;" onchange="handleSinglePhotoUpload(this, 'glav_feat3_img', 'glav_feat3_url')">
              </label>
              <input type="text" id="glav_feat3_url" class="form-input-admin" value="${hp.feat3 || 'assets/images/works/work_2_ustanovka.png'}" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.78rem; box-sizing: border-box;" oninput="document.getElementById('glav_feat3_img').src = this.value">
            </div>
          </div>
        </div>

        <!-- 3. Интерактивная витрина -->
        <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 16px; margin-bottom: 20px; box-sizing: border-box;">
          <h3 style="font-size: 1.05rem; color: #1b4332; margin: 0 0 4px;">3. Фото в интерактивной витрине теплиц</h3>
          <p style="color: #64748b; font-size: 0.84rem; margin: 0 0 14px;">Фотографии, показываемые при переключении кнопок в блоке витрины</p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px;">
            <div style="background: #fff; padding: 12px; border-radius: 10px; border: 1px solid #e2e8f0; box-sizing: border-box;">
              <div style="font-weight: 700; font-size: 0.86rem; color: #1b4332; margin-bottom: 6px;">Арочная теплица:</div>
              <div style="height: 110px; border-radius: 6px; overflow: hidden; margin-bottom: 8px; border: 1px solid #cbd5e1;">
                <img id="glav_show_arch_img" src="${hp.showcaseArch || 'assets/images/products/p1/2.jpg'}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/images/products/p1/2.jpg'">
              </div>
              <label class="btn-admin btn-admin-light" style="display: block; width: 100%; text-align: center; cursor: pointer; padding: 6px; font-size: 0.78rem; font-weight: 700; border-radius: 6px; margin-bottom: 6px; box-sizing: border-box;">
                📁 Заменить фото
                <input type="file" accept="image/*" style="display: none;" onchange="handleSinglePhotoUpload(this, 'glav_show_arch_img', 'glav_show_arch_url')">
              </label>
              <input type="text" id="glav_show_arch_url" class="form-input-admin" value="${hp.showcaseArch || 'assets/images/products/p1/2.jpg'}" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.78rem; box-sizing: border-box;" oninput="document.getElementById('glav_show_arch_img').src = this.value">
            </div>

            <div style="background: #fff; padding: 12px; border-radius: 10px; border: 1px solid #e2e8f0; box-sizing: border-box;">
              <div style="font-weight: 700; font-size: 0.86rem; color: #1b4332; margin-bottom: 6px;">Каплевидная (Стрела):</div>
              <div style="height: 110px; border-radius: 6px; overflow: hidden; margin-bottom: 8px; border: 1px solid #cbd5e1;">
                <img id="glav_show_drop_img" src="${hp.showcaseDrop || 'assets/images/products/p6/1.jpg'}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/images/products/p6/1.jpg'">
              </div>
              <label class="btn-admin btn-admin-light" style="display: block; width: 100%; text-align: center; cursor: pointer; padding: 6px; font-size: 0.78rem; font-weight: 700; border-radius: 6px; margin-bottom: 6px; box-sizing: border-box;">
                📁 Заменить фото
                <input type="file" accept="image/*" style="display: none;" onchange="handleSinglePhotoUpload(this, 'glav_show_drop_img', 'glav_show_drop_url')">
              </label>
              <input type="text" id="glav_show_drop_url" class="form-input-admin" value="${hp.showcaseDrop || 'assets/images/products/p6/1.jpg'}" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.78rem; box-sizing: border-box;" oninput="document.getElementById('glav_show_drop_img').src = this.value">
            </div>

            <div style="background: #fff; padding: 12px; border-radius: 10px; border: 1px solid #e2e8f0; box-sizing: border-box;">
              <div style="font-weight: 700; font-size: 0.86rem; color: #1b4332; margin-bottom: 6px;">Теплица Домиком:</div>
              <div style="height: 110px; border-radius: 6px; overflow: hidden; margin-bottom: 8px; border: 1px solid #cbd5e1;">
                <img id="glav_show_house_img" src="${hp.showcaseHouse || 'assets/images/products/p2/5.jpg'}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/images/products/p2/5.jpg'">
              </div>
              <label class="btn-admin btn-admin-light" style="display: block; width: 100%; text-align: center; cursor: pointer; padding: 6px; font-size: 0.78rem; font-weight: 700; border-radius: 6px; margin-bottom: 6px; box-sizing: border-box;">
                📁 Заменить фото
                <input type="file" accept="image/*" style="display: none;" onchange="handleSinglePhotoUpload(this, 'glav_show_house_img', 'glav_show_house_url')">
              </label>
              <input type="text" id="glav_show_house_url" class="form-input-admin" value="${hp.showcaseHouse || 'assets/images/products/p2/5.jpg'}" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.78rem; box-sizing: border-box;" oninput="document.getElementById('glav_show_house_img').src = this.value">
            </div>
          </div>
        </div>

        <!-- 4. Тексты главной -->
        <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 16px; margin-bottom: 20px; box-sizing: border-box;">
          <h3 style="font-size: 1.05rem; color: #1b4332; margin: 0 0 14px;">4. Заголовки и тексты главной страницы</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px;">
            <div>
              <label style="display: block; font-weight: 700; font-size: 0.88rem; color: #1b4332; margin-bottom: 4px;">Главный заголовок H1:</label>
              <input type="text" id="glav_title" class="form-input-admin" value="${p.title || 'Теплицы от завода-производителя в Ярославле'}" style="width: 100%; padding: 9px; border: 1.5px solid #cbd5e1; border-radius: 8px; box-sizing: border-box;">
            </div>
            <div>
              <label style="display: block; font-weight: 700; font-size: 0.88rem; color: #1b4332; margin-bottom: 4px;">Бейдж акции:</label>
              <input type="text" id="glav_badge" class="form-input-admin" value="${p.badge || 'Акция сезона'}" style="width: 100%; padding: 9px; border: 1.5px solid #cbd5e1; border-radius: 8px; box-sizing: border-box;">
            </div>
            <div style="grid-column: 1 / -1;">
              <label style="display: block; font-weight: 700; font-size: 0.88rem; color: #1b4332; margin-bottom: 4px;">Подзаголовок / описание:</label>
              <textarea id="glav_desc" class="form-input-admin" rows="2" style="width: 100%; padding: 9px; border: 1.5px solid #cbd5e1; border-radius: 8px; box-sizing: border-box;">${p.description || ''}</textarea>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 12px; justify-content: flex-end; flex-wrap: wrap;">
          <button type="button" class="btn-admin btn-admin-primary" style="padding: 12px 24px; font-weight: 800; width: 100%;" onclick="saveCurrentPageAndPublish('glavnaya')">
            🚀 Сохранить и сразу опубликовать
          </button>
        </div>
      </div>
    `;
    return;
  }

  // 2. РЕДАКТОР ЛЮБОЙ ДРУГОЙ СТРАНИЦЫ (Арочные, Капелька, Домиком и т.д.)
  const defaultGal = (typeof DEFAULT_GALLERIES !== "undefined" && DEFAULT_GALLERIES[pageKey]) ? DEFAULT_GALLERIES[pageKey] : [];
  window.currentEditingGallery = (Array.isArray(p.gallery) && p.gallery.length) ? [...p.gallery] : (defaultGal.length ? [...defaultGal] : (p.bannerImage ? [p.bannerImage] : []));
  window.currentEditingPageKey = pageKey;

  const isVideoSupported = (pageKey === "arochnye" || pageKey === "kaplevidnye" || pageKey === "domikom");
  const videoCountLabel = pageKey === "arochnye" ? "Два видеообзора (Арочные)" : (pageKey === "kaplevidnye" ? "Одно или два видео (Капелька)" : "Видеообзоры");

  container.innerHTML = `
    <div class="admin-card" style="border: 2px solid #2d6a4f; border-radius: 16px; padding: 20px; background: #fff; box-shadow: 0 4px 18px rgba(0,0,0,0.05); box-sizing: border-box; max-width: 100%;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; border-bottom: 1px solid #e2e8f0; padding-bottom: 14px; flex-wrap: wrap; gap: 10px;">
        <div>
          <h2 style="font-size: 1.35rem; color: #1b4332; margin: 0 0 4px;">📄 Редактирование: ${p.name || pageKey}</h2>
          <p style="color: #64748b; font-size: 0.88rem; margin: 0;">Файл: <code>${p.file || ''}</code> • Раздел: ${p.category || 'Страница'}</p>
        </div>
        <div style="display: flex; gap: 8px;">
          <button type="button" class="btn-admin btn-admin-primary" onclick="saveCurrentPageAndPublish('${pageKey}')">🚀 Сохранить и опубликовать</button>
        </div>
      </div>

      <!-- Главное фото обложки (синхронизировано с фото #1 в галерее) -->
      <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 16px; margin-bottom: 20px; box-sizing: border-box;">
        <h3 style="font-size: 1.05rem; color: #1b4332; margin: 0 0 4px;">🖼️ Главное фото (обложка карточки)</h3>
        <p style="color: #64748b; font-size: 0.84rem; margin: 0 0 14px;">Отображается первым большим баннером на сайте. Всегда автоматически совпадает с <b>Фото #1 (★ ОБЛОЖКА)</b> из галереи ниже.</p>
        
        <div class="page-banner-grid">
          <div class="banner-preview-box" style="height: 150px; border-radius: 10px; overflow: hidden; border: 1.5px solid #cbd5e1; background: #e2e8f0; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
            <img id="page_custom_img" src="${(window.currentEditingGallery && window.currentEditingGallery[0]) || p.bannerImage || 'assets/images/teplica.png'}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/images/teplica.png'">
          </div>
          <div style="min-width: 0; display: flex; flex-direction: column; justify-content: center;">
            <label class="btn-admin btn-admin-primary" style="display: block; width: 100%; text-align: center; cursor: pointer; padding: 12px 14px; font-weight: 800; border-radius: 8px; margin-bottom: 8px; box-sizing: border-box;">
              📁 Загрузить новое фото сразу на обложку (#1)
              <input type="file" accept="image/*" style="display: none;" onchange="handleCoverPhotoUpload(this)">
            </label>
            <div style="font-size: 0.78rem; color: #64748b;">
              💡 Либо загрузите снимки в галерею ниже и стрелочками <b>⬅️ ➡️</b> переместите желаемое фото на 1-ю позицию.
            </div>
            <input type="hidden" id="page_custom_url" value="${(window.currentEditingGallery && window.currentEditingGallery[0]) || p.bannerImage || 'assets/images/teplica.png'}">
          </div>
        </div>
      </div>

      <!-- БЛОК ВСЕХ ФОТОГРАФИЙ КАРТОЧКИ ТОВАРА (ГАЛЕРЕЯ) -->
      <div style="background: #f8fafc; border: 2px solid #2d6a4f; border-radius: 12px; padding: 16px; margin-bottom: 20px; box-sizing: border-box;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 10px;">
          <div>
            <h3 style="font-size: 1.08rem; color: #1b4332; margin: 0 0 4px; display: flex; align-items: center; gap: 8px;">
              <span>📸</span> Фотогалерея карточки товара (<span id="galleryCountBadge">${window.currentEditingGallery ? window.currentEditingGallery.length : 0}</span> фото)
            </h3>
            <p style="color: #64748b; font-size: 0.82rem; margin: 0;">
              Все фотографии, которые покупатели листают в карточке теплицы. Первое фото (#1) — главное на обложке. Переставляйте стрелочками или удаляйте.
            </p>
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <label class="btn-admin btn-admin-primary" style="margin: 0; cursor: pointer; padding: 10px 14px; font-size: 0.88rem; font-weight: 800; display: inline-flex; align-items: center; gap: 6px;">
              <span>➕</span> Добавить фото с телефона / ПК
              <input type="file" accept="image/*" multiple style="display: none;" onchange="onGalleryUploadFiles(this)">
            </label>
            <button type="button" class="btn-admin btn-admin-light" onclick="onGalleryAddUrlPrompt()" style="padding: 10px 14px; font-size: 0.88rem; font-weight: 700;">
              🔗 По ссылке
            </button>
          </div>
        </div>

        <div id="galleryItemsGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 12px; margin-top: 14px;"></div>
      </div>

      <!-- БЛОК ЗАГРУЗКИ КОРОТКИХ ВИДЕО -->
      <div style="background: #f8fafc; border: 1.5px solid #52b788; border-radius: 12px; padding: 16px; margin-bottom: 20px; box-sizing: border-box;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; flex-wrap: wrap; gap: 6px;">
          <h3 style="font-size: 1.05rem; color: #1b4332; margin: 0;">🎬 Короткие видеообзоры теплицы (${videoCountLabel})</h3>
          <span style="font-size: 0.74rem; font-weight: 800; color: #2d6a4f; background: #d8f3dc; padding: 2px 8px; border-radius: 999px;">mp4 / YouTube / VK</span>
        </div>
        <p style="color: #64748b; font-size: 0.84rem; margin: 0 0 14px;">
          Загрузите короткое видео с телефона/ПК (MP4/WebM до 20 МБ) или вставьте ссылку на YouTube / Rutube / VK Видео. Видео появится на странице отдельным красивым блоком.
        </p>

        ${(() => {
          window.uploadedPageVideos = window.uploadedPageVideos || {};
          const isV1File = (p.video1 || '').startsWith('data:video/');
          const isV2File = (p.video2 || '').startsWith('data:video/');
          window.uploadedPageVideos[1] = isV1File ? p.video1 : '';
          window.uploadedPageVideos[2] = isV2File ? p.video2 : '';
          const v1Url = isV1File ? '' : (p.video1 || '');
          const v2Url = isV2File ? '' : (p.video2 || '');
          const v1Size = isV1File ? (Math.round((p.video1.length * 0.75 / 1024 / 1024) * 10) / 10 || 0.5) : 0;
          const v2Size = isV2File ? (Math.round((p.video2.length * 0.75 / 1024 / 1024) * 10) / 10 || 0.5) : 0;

          return `
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px;">
            <!-- ВИДЕО 1 -->
            <div style="background: #fff; border: 1px solid #cbd5e1; border-radius: 10px; padding: 14px; box-sizing: border-box;">
              <div style="font-weight: 800; color: #1b4332; font-size: 0.9rem; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
                <span>📹</span> Видео 1 (основной обзор)
              </div>
              <label class="btn-admin btn-admin-light" style="display: block; width: 100%; text-align: center; cursor: pointer; padding: 9px; font-size: 0.82rem; font-weight: 700; border-radius: 8px; margin-bottom: 8px; box-sizing: border-box; background: #eef2f5;">
                📁 Загрузить видеофайл с устройства
                <input type="file" accept="video/mp4,video/webm,video/quicktime" style="display: none;" onchange="handleSingleVideoUpload(this, 1)">
              </label>

              <div id="page_video_file_badge_1" style="${isV1File ? 'display: flex;' : 'display: none;'} align-items: center; justify-content: space-between; background: #ecfdf5; border: 1.5px solid #6ee7b7; border-radius: 8px; padding: 8px 12px; margin-bottom: 8px;">
                <span style="font-size: 0.8rem; font-weight: 700; color: #065f46;">📁 Загружен видеофайл (<span id="page_video_size_1">${v1Size}</span> МБ)</span>
                <button type="button" class="btn-admin" style="padding: 3px 8px; font-size: 0.75rem; background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; border-radius: 4px;" onclick="clearUploadedVideo(1)">✕ Удалить</button>
              </div>

              <div style="font-size: 0.78rem; color: #64748b; margin-bottom: 4px;">Или ссылка (YouTube / VK / MP4):</div>
              <input type="text" id="page_video_url_1" class="form-input-admin" value="${v1Url}" placeholder="https://vk.ru/clip-... или YouTube" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.82rem; box-sizing: border-box;" oninput="updateVideoPreview(1)">
              <div id="page_video_preview_1" style="margin-top: 8px; font-size: 0.76rem; color: #2d6a4f; font-weight: 700;">
                ${(p.video1) ? '✓ Видео настроено' : 'Видео не загружено'}
              </div>
            </div>

            <!-- ВИДЕО 2 -->
            <div style="background: #fff; border: 1px solid #cbd5e1; border-radius: 10px; padding: 14px; box-sizing: border-box;">
              <div style="font-weight: 800; color: #1b4332; font-size: 0.9rem; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
                <span>📹</span> Видео 2 (дополнительный обзор)
              </div>
              <label class="btn-admin btn-admin-light" style="display: block; width: 100%; text-align: center; cursor: pointer; padding: 9px; font-size: 0.82rem; font-weight: 700; border-radius: 8px; margin-bottom: 8px; box-sizing: border-box; background: #eef2f5;">
                📁 Загрузить видеофайл с устройства
                <input type="file" accept="video/mp4,video/webm,video/quicktime" style="display: none;" onchange="handleSingleVideoUpload(this, 2)">
              </label>

              <div id="page_video_file_badge_2" style="${isV2File ? 'display: flex;' : 'display: none;'} align-items: center; justify-content: space-between; background: #ecfdf5; border: 1.5px solid #6ee7b7; border-radius: 8px; padding: 8px 12px; margin-bottom: 8px;">
                <span style="font-size: 0.8rem; font-weight: 700; color: #065f46;">📁 Загружен видеофайл (<span id="page_video_size_2">${v2Size}</span> МБ)</span>
                <button type="button" class="btn-admin" style="padding: 3px 8px; font-size: 0.75rem; background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; border-radius: 4px;" onclick="clearUploadedVideo(2)">✕ Удалить</button>
              </div>

              <div style="font-size: 0.78rem; color: #64748b; margin-bottom: 4px;">Или ссылка (YouTube / VK / MP4):</div>
              <input type="text" id="page_video_url_2" class="form-input-admin" value="${v2Url}" placeholder="https://vk.ru/clip-... или YouTube" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.82rem; box-sizing: border-box;" oninput="updateVideoPreview(2)">
              <div id="page_video_preview_2" style="margin-top: 8px; font-size: 0.76rem; color: #2d6a4f; font-weight: 700;">
                ${(p.video2) ? '✓ Видео настроено' : 'Видео не загружено'}
              </div>
            </div>
          </div>`;
        })()}</div>

      <!-- Текстовые поля страницы -->
      <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 16px; margin-bottom: 20px; box-sizing: border-box;">
        <h3 style="font-size: 1.05rem; color: #1b4332; margin: 0 0 14px;">📝 Текст и заголовки страницы</h3>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px; margin-bottom: 14px;">
          <div style="grid-column: 1 / -1;">
            <label style="display: block; font-weight: 700; font-size: 0.88rem; color: #1b4332; margin-bottom: 4px;">Заголовок страницы (H1):</label>
            <input type="text" id="page_custom_title" class="form-input-admin" value="${p.title || ''}" style="width: 100%; padding: 10px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 0.95rem; box-sizing: border-box;">
          </div>
          <div>
            <label style="display: block; font-weight: 700; font-size: 0.88rem; color: #1b4332; margin-bottom: 4px;">Бейдж / Акция:</label>
            <input type="text" id="page_custom_badge" class="form-input-admin" value="${p.badge || ''}" style="width: 100%; padding: 9px; border: 1.5px solid #cbd5e1; border-radius: 8px; box-sizing: border-box;">
          </div>
          <div>
            <label style="display: block; font-weight: 700; font-size: 0.88rem; color: #1b4332; margin-bottom: 4px;">Текст цены / срока:</label>
            <input type="text" id="page_custom_price" class="form-input-admin" value="${p.priceText || ''}" style="width: 100%; padding: 9px; border: 1.5px solid #cbd5e1; border-radius: 8px; box-sizing: border-box;">
          </div>
          <div style="grid-column: 1 / -1;">
            <label style="display: block; font-weight: 700; font-size: 0.88rem; color: #1b4332; margin-bottom: 4px;">Описание / подзаголовок:</label>
            <textarea id="page_custom_desc" class="form-input-admin" rows="3" style="width: 100%; padding: 10px; border: 1.5px solid #cbd5e1; border-radius: 8px; box-sizing: border-box;">${p.description || ''}</textarea>
          </div>
        </div>
      </div>

      <div style="display: flex; gap: 12px; justify-content: flex-end; flex-wrap: wrap;">
        <button type="button" class="btn-admin btn-admin-primary" style="padding: 12px 24px; font-weight: 800; width: 100%;" onclick="saveCurrentPageAndPublish('${pageKey}')">
          🚀 Сохранить и сразу опубликовать
        </button>
      </div>
    </div>
  `;

  renderGalleryGridItems();
}
window.renderPageEditor = renderPageEditor;

function clearUploadedVideo(num) {
  window.uploadedPageVideos = window.uploadedPageVideos || {};
  window.uploadedPageVideos[num] = '';
  const badge = document.getElementById('page_video_file_badge_' + num);
  if (badge) badge.style.display = 'none';
  updateVideoPreview(num);
}
window.clearUploadedVideo = clearUploadedVideo;

function updateVideoPreview(num) {
  const urlInput = document.getElementById('page_video_url_' + num);
  const preview = document.getElementById('page_video_preview_' + num);
  if (!preview) return;
  const val = (urlInput?.value || '').trim();
  const hasFile = window.uploadedPageVideos && window.uploadedPageVideos[num];
  if (val) {
    preview.innerHTML = '✓ Ссылка настроена: ' + (val.length > 35 ? val.slice(0, 35) + '...' : val);
    preview.style.color = '#2d6a4f';
  } else if (hasFile) {
    preview.innerHTML = '✓ Видеофайл настроен';
    preview.style.color = '#2d6a4f';
  } else {
    preview.innerHTML = 'Видео не загружено';
    preview.style.color = '#64748b';
  }
}
window.updateVideoPreview = updateVideoPreview;

async function handleSingleVideoUpload(input, num) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  const previewEl = document.getElementById('page_video_preview_' + num);
  const badgeEl = document.getElementById('page_video_file_badge_' + num);
  const sizeEl = document.getElementById('page_video_size_' + num);
  const urlInput = document.getElementById('page_video_url_' + num);

  if (file.size > 25 * 1024 * 1024) {
    alert('⚠️ Размер видео превышает 25 МБ. Для длинных роликов рекомендуется использовать ссылку на YouTube или VK Видео.');
    return;
  }

  if (previewEl) previewEl.innerHTML = '⏳ Обработка видеофайла...';

  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    window.uploadedPageVideos = window.uploadedPageVideos || {};
    window.uploadedPageVideos[num] = dataUrl;
    if (urlInput) urlInput.value = '';
    const mb = Math.round(file.size / 1024 / 1024 * 10) / 10 || 0.1;
    if (sizeEl) sizeEl.textContent = mb;
    if (badgeEl) badgeEl.style.display = 'flex';
    if (previewEl) {
      previewEl.innerHTML = `✅ Видео загружено (${mb} МБ)`;
      previewEl.style.color = '#2d6a4f';
    }
  };
  reader.readAsDataURL(file);
}
window.handleSingleVideoUpload = handleSingleVideoUpload;

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


function renderGalleryGridItems() {
  const grid = document.getElementById("galleryItemsGrid");
  const countBadge = document.getElementById("galleryCountBadge");
  if (!grid) return;

  const list = window.currentEditingGallery || [];
  if (countBadge) countBadge.textContent = list.length;

  if (list.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 24px; text-align: center; color: #64748b; background: #fff; border: 1.5px dashed #cbd5e1; border-radius: 10px;">
        В галерее пока нет фото. Нажмите <b>«➕ Добавить фото с телефона / ПК»</b>, чтобы загрузить первые снимки теплицы.
      </div>
    `;
    return;
  }

  grid.innerHTML = list.map((src, idx) => {
    const isFirst = idx === 0;
    const isLast = idx === list.length - 1;
    return `
      <div class="gallery-photo-card" style="background: #fff; border: 2px solid ${isFirst ? '#2d6a4f' : '#cbd5e1'}; border-radius: 10px; overflow: hidden; display: flex; flex-direction: column; position: relative; box-shadow: 0 2px 8px rgba(0,0,0,0.06); box-sizing: border-box;">
        ${isFirst ? 
          '<div style="position: absolute; top: 6px; left: 6px; background: #2d6a4f; color: #fff; font-size: 0.68rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; z-index: 2; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">★ ОБЛОЖКА</div>' : 
          `<div style="position: absolute; top: 6px; left: 6px; background: rgba(15,23,42,0.75); color: #fff; font-size: 0.72rem; font-weight: 700; padding: 2px 6px; border-radius: 4px; z-index: 2;">#${idx + 1}</div>`
        }
        <div style="width: 100%; height: 110px; background: #e2e8f0; overflow: hidden; position: relative;">
          <img src="${src}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/images/teplica.png'" loading="lazy">
        </div>
        <div style="padding: 6px 4px; background: #f8fafc; border-top: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; gap: 4px;">
          <button type="button" class="btn-admin btn-admin-light" title="Переместить левее (выше)" ${isFirst ? 'disabled style="opacity: 0.3; padding: 4px 6px; font-size: 0.85rem;"' : 'style="padding: 4px 6px; font-size: 0.85rem;"'} onclick="moveGalleryPhoto(${idx}, -1)">
            ⬅️
          </button>
          <button type="button" class="btn-admin btn-admin-light" title="Переместить правее (ниже)" ${isLast ? 'disabled style="opacity: 0.3; padding: 4px 6px; font-size: 0.85rem;"' : 'style="padding: 4px 6px; font-size: 0.85rem;"'} onclick="moveGalleryPhoto(${idx}, 1)">
            ➡️
          </button>
          <button type="button" class="btn-admin btn-admin-danger" title="Удалить это фото" style="padding: 4px 8px; font-size: 0.85rem; background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5;" onclick="deleteGalleryPhoto(${idx})">
            🗑
          </button>
        </div>
      </div>
    `;
  }).join("");
}
window.renderGalleryGridItems = renderGalleryGridItems;

function moveGalleryPhoto(idx, delta) {
  if (!window.currentEditingGallery) return;
  const list = window.currentEditingGallery;
  const targetIdx = idx + delta;
  if (targetIdx < 0 || targetIdx >= list.length) return;

  const temp = list[idx];
  list[idx] = list[targetIdx];
  list[targetIdx] = temp;

  // Всегда синхронизируем обложку с первым фото
  const mainBannerImg = document.getElementById("page_custom_img");
  const mainBannerUrl = document.getElementById("page_custom_url");
  const newCover = list[0] || 'assets/images/teplica.png';
  if (mainBannerImg) mainBannerImg.src = newCover;
  if (mainBannerUrl) mainBannerUrl.value = newCover;

  renderGalleryGridItems();
}
window.moveGalleryPhoto = moveGalleryPhoto;

function deleteGalleryPhoto(idx) {
  if (!window.currentEditingGallery) return;
  const list = window.currentEditingGallery;
  if (idx < 0 || idx >= list.length) return;

  if (confirm(`Удалить фото #${idx + 1} из галереи?`)) {
    list.splice(idx, 1);
    // Всегда синхронизируем обложку с первым фото
    const mainBannerImg = document.getElementById("page_custom_img");
    const mainBannerUrl = document.getElementById("page_custom_url");
    const newCover = list[0] || 'assets/images/teplica.png';
    if (mainBannerImg) mainBannerImg.src = newCover;
    if (mainBannerUrl) mainBannerUrl.value = newCover;

    renderGalleryGridItems();
  }
}
window.deleteGalleryPhoto = deleteGalleryPhoto;

async function handleCoverPhotoUpload(input) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  if (!window.currentEditingGallery) window.currentEditingGallery = [];

  let newUrl = null;
  try {
    if (typeof compressImageFile === "function") {
      newUrl = await compressImageFile(file, 1400, 0.84);
    }
  } catch(e) {}
  if (!newUrl) {
    newUrl = await new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.onerror = rej;
      r.readAsDataURL(file);
    });
  }

  // Вставляем фото на ПЕРВУЮ позицию (обложка карточки)
  window.currentEditingGallery.unshift(newUrl);

  const mainBannerImg = document.getElementById("page_custom_img");
  const mainBannerUrl = document.getElementById("page_custom_url");
  if (mainBannerImg) mainBannerImg.src = newUrl;
  if (mainBannerUrl) mainBannerUrl.value = newUrl;

  input.value = "";
  renderGalleryGridItems();
}
window.handleCoverPhotoUpload = handleCoverPhotoUpload;

async function onGalleryUploadFiles(input) {
  if (!input.files || !input.files.length) return;
  if (!window.currentEditingGallery) window.currentEditingGallery = [];

  const files = Array.from(input.files);
  const statusBadge = document.getElementById("galleryCountBadge");
  if (statusBadge) statusBadge.textContent = "⏳ Сжатие...";

  for (const file of files) {
    try {
      if (typeof compressImageFile === "function") {
        const compressed = await compressImageFile(file, 1200, 0.82);
        window.currentEditingGallery.push(compressed);
      } else {
        const dUrl = await new Promise((res, rej) => {
          const r = new FileReader();
          r.onload = () => res(r.result);
          r.onerror = rej;
          r.readAsDataURL(file);
        });
        window.currentEditingGallery.push(dUrl);
      }
    } catch(e) {
      console.warn("Upload file error:", e);
    }
  }

  // Обновим баннер обложки, если он был стандартным
  if (window.currentEditingGallery.length && !document.getElementById("page_custom_url")?.value) {
    const mainBannerImg = document.getElementById("page_custom_img");
    const mainBannerUrl = document.getElementById("page_custom_url");
    if (mainBannerImg) mainBannerImg.src = window.currentEditingGallery[0];
    if (mainBannerUrl) mainBannerUrl.value = window.currentEditingGallery[0];
  }

  input.value = "";
  renderGalleryGridItems();
}
window.onGalleryUploadFiles = onGalleryUploadFiles;

function onGalleryAddUrlPrompt() {
  const url = prompt("Введите ссылку на фото (URL или assets/images/...):");
  if (url && url.trim()) {
    if (!window.currentEditingGallery) window.currentEditingGallery = [];
    window.currentEditingGallery.push(url.trim());
    renderGalleryGridItems();
  }
}
window.onGalleryAddUrlPrompt = onGalleryAddUrlPrompt;

// Функция синхронизации текущей редактируемой страницы в config.pages
function syncCurrentPageToConfig(targetKey = null) {
  const pageKey = targetKey || window.currentEditingPageKey || document.getElementById("pageSelectorDropdown")?.value || "glavnaya";
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
    const titleEl = document.getElementById("glav_title");
    if (titleEl) p.title = titleEl.value;
    const badgeEl = document.getElementById("glav_badge");
    if (badgeEl) p.badge = badgeEl.value;
    const descEl = document.getElementById("glav_desc");
    if (descEl) p.description = descEl.value;
    if (heroVal) p.bannerImage = heroVal;
    config.pages["glavnaya"] = p;
  } else {
    const p = config.pages[pageKey] || {};
    const titleEl = document.getElementById("page_custom_title");
    if (titleEl) p.title = titleEl.value.trim();
    const badgeEl = document.getElementById("page_custom_badge");
    if (badgeEl) p.badge = badgeEl.value.trim();
    const priceEl = document.getElementById("page_custom_price");
    if (priceEl) p.priceText = priceEl.value.trim();
    const descEl = document.getElementById("page_custom_desc");
    if (descEl) p.description = descEl.value.trim();
    const imgVal = document.getElementById("page_custom_url")?.value;

    // Сохранение фотогалереи: берем массив из памяти
    if (Array.isArray(window.currentEditingGallery) && window.currentEditingPageKey === pageKey) {
      p.gallery = [...window.currentEditingGallery];
    }
    // Главная обложка товара ВСЕГДА строго совпадает с первым фото (#1) галереи!
    if (Array.isArray(p.gallery) && p.gallery.length > 0) {
      p.bannerImage = p.gallery[0];
    } else if (imgVal) {
      p.bannerImage = imgVal;
    }

    // Сохранение видео
    const v1Url = document.getElementById("page_video_url_1")?.value.trim() || "";
    const v2Url = document.getElementById("page_video_url_2")?.value.trim() || "";
    const v1File = (window.uploadedPageVideos && window.uploadedPageVideos[1]) || "";
    const v2File = (window.uploadedPageVideos && window.uploadedPageVideos[2]) || "";
    p.video1 = v1Url || v1File || "";
    p.video2 = v2Url || v2File || "";

    config.pages[pageKey] = p;
  }

  saveSiteConfig(config);
  return config;
}
window.syncCurrentPageToConfig = syncCurrentPageToConfig;

async function saveCurrentPageAndPublish(pageKey) {
  syncCurrentPageToConfig(pageKey);
  await publishToGithub("pages");
}
window.saveCurrentPageAndPublish = saveCurrentPageAndPublish;

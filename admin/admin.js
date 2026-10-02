/**
 * Панель управления «Теплицы ТУТ» — Версия 2.0
 * Поддержка полного управления товарами, отзывами, выполненными работами,
 * загрузка картинок с устройства (Base64) и ссылками, экспорт/импорт БД и защита входа.
 */

const ADMIN_PASS_KEY = "teplici76_admin_pass";
const DEFAULT_PASS = "TepL!ca#76_Yar2026!"; // Сложный пароль по умолчанию

// Состояние сессии
let failedAttempts = 0;
let lockoutTimer = null;
let currentEditingProductId = null;
let currentEditingReviewId = null;
let currentEditingWorkId = null;

document.addEventListener("DOMContentLoaded", () => {
  setupAuth();
  setupNavigation();
  loadLeads();
  loadProductsTab();
  loadReviewsTab();
  loadWorksTab();
  loadPricesForm();
  loadContactsForm();
  loadVkSettings();
  loadTelegramSettings();
  setupDatabaseTab();
  setupSecurityTab();
  setupImageUploaderControls();
});

/* ==========================================================================
   1. АВТОРИЗАЦИЯ И ЗАЩИТА ОТ ПЕРЕБОРА
   ========================================================================== */
function setupAuth() {
  const loginScreen = document.getElementById("loginScreen");
  const adminLayout = document.getElementById("adminLayout");
  const loginForm = document.getElementById("loginForm");
  const logoutBtn = document.getElementById("logoutBtn");
  const errorMsg = document.getElementById("loginError");
  const submitBtn = loginForm.querySelector("button[type='submit']");

  const isAuth = sessionStorage.getItem("teplici76_logged_in") === "true";
  if (isAuth) {
    loginScreen.style.display = "none";
    adminLayout.classList.add("active");
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (lockoutTimer) return;

    const passInput = document.getElementById("passwordInput").value.trim();
    const config = getSiteConfig();
    const realPass = localStorage.getItem(ADMIN_PASS_KEY) || (config.security && config.security.password) || DEFAULT_PASS;

    if (passInput === realPass) {
      failedAttempts = 0;
      sessionStorage.setItem("teplici76_logged_in", "true");
      loginScreen.style.display = "none";
      adminLayout.classList.add("active");
      errorMsg.style.display = "none";
      loadLeads();
      loadProductsTab();
    } else {
      failedAttempts++;
      if (failedAttempts >= 5) {
        let secondsLeft = 30;
        submitBtn.disabled = true;
        errorMsg.style.display = "block";
        errorMsg.textContent = `Слишком много неверных попыток. Доступ заблокирован на ${secondsLeft} сек.`;

        lockoutTimer = setInterval(() => {
          secondsLeft--;
          if (secondsLeft <= 0) {
            clearInterval(lockoutTimer);
            lockoutTimer = null;
            failedAttempts = 0;
            submitBtn.disabled = false;
            errorMsg.textContent = "Попробуйте снова.";
          } else {
            errorMsg.textContent = `Слишком много неверных попыток. Доступ заблокирован на ${secondsLeft} сек.`;
          }
        }, 1000);
      } else {
        errorMsg.style.display = "block";
        errorMsg.textContent = `Неверный пароль. Осталось попыток: ${5 - failedAttempts}`;
      }
    }
  });

  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("teplici76_logged_in");
    adminLayout.classList.remove("active");
    loginScreen.style.display = "flex";
    document.getElementById("passwordInput").value = "";
  });
}

/* ==========================================================================
   2. НАВИГАЦИЯ ПО ВКЛАДКАМ
   ========================================================================== */
function setupNavigation() {
  const navBtns = document.querySelectorAll(".admin-nav-item button");
  const tabPanels = document.querySelectorAll(".tab-panel");

  navBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab");

      navBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      tabPanels.forEach(panel => {
        panel.classList.remove("active");
        if (panel.id === target) panel.classList.add("active");
      });
    });
  });
}

/* ==========================================================================
   3. УПРАВЛЕНИЕ ТОВАРАМИ (КАТАЛОГ)
   ========================================================================== */
function getAssetPath(src) {
  if (!src) return "assets/images/logo.png";
  if (src.startsWith("data:") || src.startsWith("http://") || src.startsWith("https://")) return src;
  const isInSubdir = window.location.pathname.includes("/admin/");
  if (isInSubdir && !src.startsWith("../") && !src.startsWith("/")) {
    return "../" + src;
  }
  return src.replace(/^\.\.\//, "");
}

function loadProductsTab() {
  const config = getSiteConfig();
  const products = config.products || [];
  const container = document.getElementById("adminProductsGrid");
  const countEl = document.getElementById("adminProductsCount");
  if (!container) return;

  if (countEl) countEl.textContent = `Всего товаров: ${products.length}`;

  if (!products.length) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--admin-muted); padding: 40px;">Товаров нет. Нажмите «+ Добавить товар», чтобы создать первую позицию.</div>`;
    return;
  }

  container.innerHTML = products.map((prod, idx) => {
    return `
      <div class="admin-item-card" data-id="${prod.id}">
        <div class="admin-item-img-wrap">
          <img src="${getAssetPath(prod.image)}" alt="${prod.name}" onerror="this.src='${getAssetPath('assets/images/products/p1/1.jpg')}'">
          ${prod.badge ? `<span class="admin-item-badge">${prod.badge}</span>` : ''}
        </div>
        <div class="admin-item-content">
          <div class="admin-item-title">${prod.name}</div>
          <div class="admin-item-meta">Категория: ${getCategoryName(prod.category)} • Размер: ${prod.size || '—'}</div>
          <div class="admin-item-price">${prod.price.toLocaleString('ru-RU')} ₽ ${prod.oldPrice ? `<small style="text-decoration: line-through; color: #999; font-size: 0.85rem; margin-left: 6px;">${prod.oldPrice.toLocaleString('ru-RU')} ₽</small>` : ''}</div>
          <p style="font-size: 0.84rem; color: #555; margin-bottom: 10px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${prod.description || ''}</p>
          <div class="admin-item-actions">
            <button class="btn-admin btn-admin-light" style="flex: 1;" onclick="openEditProductModal('${prod.id}')">✏️ Изменить</button>
            <button class="btn-admin btn-admin-danger" onclick="deleteProduct('${prod.id}')" title="Удалить">🗑</button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function getCategoryName(cat) {
  switch (cat) {
    case 'arch': return 'Арочные';
    case 'drop': return 'Каплевидные';
    case 'poly': return 'Поликарбонат';
    case 'beds': return 'Грядки';
    default: return 'Другое';
  }
}

// Открытие модалки добавления/редактирования товара
window.openCreateProductModal = function() {
  currentEditingProductId = null;
  document.getElementById("productModalTitle").textContent = "Добавление нового товара";
  document.getElementById("productForm").reset();
  resetImageUploader("prod");
  openModal("productModal");
};

window.openEditProductModal = function(id) {
  currentEditingProductId = id;
  const config = getSiteConfig();
  const prod = (config.products || []).find(p => p.id === id);
  if (!prod) return;

  document.getElementById("productModalTitle").textContent = "Редактирование товара";
  document.getElementById("prod_name").value = prod.name || "";
  document.getElementById("prod_category").value = prod.category || "arch";
  document.getElementById("prod_price").value = prod.price || 0;
  document.getElementById("prod_oldPrice").value = prod.oldPrice || "";
  document.getElementById("prod_size").value = prod.size || "";
  document.getElementById("prod_badge").value = prod.badge || "";
  document.getElementById("prod_desc").value = prod.description || "";

  // Превью и картинка
  setImageUploaderValue("prod", prod.image || "");
  openModal("productModal");
};

window.deleteProduct = function(id) {
  if (!confirm("Удалить этот товар из каталога?")) return;
  const config = getSiteConfig();
  config.products = (config.products || []).filter(p => p.id !== id);
  saveSiteConfig(config);
  loadProductsTab();
};

// Сохранение формы товара
document.addEventListener("DOMContentLoaded", () => {
  const prodForm = document.getElementById("productForm");
  if (!prodForm) return;

  prodForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const config = getSiteConfig();
    config.products = config.products || [];

    const imgVal = getImageUploaderValue("prod");

    const productData = {
      id: currentEditingProductId || `prod-${Date.now()}`,
      name: document.getElementById("prod_name").value.trim(),
      category: document.getElementById("prod_category").value,
      price: parseInt(document.getElementById("prod_price").value, 10) || 0,
      oldPrice: parseInt(document.getElementById("prod_oldPrice").value, 10) || null,
      size: document.getElementById("prod_size").value.trim(),
      badge: document.getElementById("prod_badge").value.trim(),
      description: document.getElementById("prod_desc").value.trim(),
      image: imgVal || "assets/images/products/p1/1.jpg"
    };

    if (currentEditingProductId) {
      const idx = config.products.findIndex(p => p.id === currentEditingProductId);
      if (idx !== -1) config.products[idx] = productData;
    } else {
      config.products.unshift(productData);
    }

    saveSiteConfig(config);
    closeModal("productModal");
    loadProductsTab();
  });
});

/* ==========================================================================
   4. УПРАВЛЕНИЕ ОТЗЫВАМИ
   ========================================================================== */
function loadReviewsTab() {
  const config = getSiteConfig();
  const reviews = config.reviews || [];
  const container = document.getElementById("adminReviewsList");
  const countEl = document.getElementById("adminReviewsCount");
  if (!container) return;

  if (countEl) countEl.textContent = `Всего отзывов: ${reviews.length}`;

  if (!reviews.length) {
    container.innerHTML = `<div style="text-align: center; color: var(--admin-muted); padding: 40px;">Отзывов нет. Нажмите «+ Добавить отзыв».</div>`;
    return;
  }

  container.innerHTML = reviews.map((rev) => {
    const starsStr = "★".repeat(rev.stars || 5) + "☆".repeat(5 - (rev.stars || 5));
    return `
      <div class="admin-review-card ${rev.featured ? 'featured' : ''}" data-id="${rev.id}">
        <div class="admin-review-head">
          <div>
            <strong style="font-size: 1.1rem; color: #1b4332;">${rev.name}</strong>
            <span style="font-size: 0.85rem; color: #666; margin-left: 8px;">${rev.role || ''}</span>
            ${rev.featured ? '<span style="margin-left: 8px; background: #52b788; color: white; padding: 2px 7px; border-radius: 4px; font-size: 0.72rem; font-weight: 700;">Зеленый акцент</span>' : ''}
          </div>
          <div class="admin-review-stars">${starsStr}</div>
        </div>
        <p style="font-size: 0.95rem; color: #333; line-height: 1.5; margin: 6px 0;">${rev.text}</p>
        <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 6px;">
          <button class="btn-admin btn-admin-light" onclick="openEditReviewModal('${rev.id}')">✏️ Редактировать</button>
          <button class="btn-admin btn-admin-danger" onclick="deleteReview('${rev.id}')">🗑 Удалить</button>
        </div>
      </div>
    `;
  }).join("");
}

window.openCreateReviewModal = function() {
  currentEditingReviewId = null;
  document.getElementById("reviewModalTitle").textContent = "Добавление отзыва";
  document.getElementById("reviewForm").reset();
  openModal("reviewModal");
};

window.openEditReviewModal = function(id) {
  currentEditingReviewId = id;
  const config = getSiteConfig();
  const rev = (config.reviews || []).find(r => r.id === id);
  if (!rev) return;

  document.getElementById("reviewModalTitle").textContent = "Редактирование отзыва";
  document.getElementById("rev_name").value = rev.name || "";
  document.getElementById("rev_role").value = rev.role || "";
  document.getElementById("rev_stars").value = rev.stars || 5;
  document.getElementById("rev_text").value = rev.text || "";
  document.getElementById("rev_featured").checked = !!rev.featured;

  openModal("reviewModal");
};

window.deleteReview = function(id) {
  if (!confirm("Удалить этот отзыв?")) return;
  const config = getSiteConfig();
  config.reviews = (config.reviews || []).filter(r => r.id !== id);
  saveSiteConfig(config);
  loadReviewsTab();
};

document.addEventListener("DOMContentLoaded", () => {
  const revForm = document.getElementById("reviewForm");
  if (!revForm) return;

  revForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const config = getSiteConfig();
    config.reviews = config.reviews || [];

    const reviewData = {
      id: currentEditingReviewId || `rev-${Date.now()}`,
      name: document.getElementById("rev_name").value.trim(),
      role: document.getElementById("rev_role").value.trim(),
      stars: parseInt(document.getElementById("rev_stars").value, 10) || 5,
      text: document.getElementById("rev_text").value.trim(),
      featured: document.getElementById("rev_featured").checked
    };

    if (currentEditingReviewId) {
      const idx = config.reviews.findIndex(r => r.id === currentEditingReviewId);
      if (idx !== -1) config.reviews[idx] = reviewData;
    } else {
      config.reviews.unshift(reviewData);
    }

    saveSiteConfig(config);
    closeModal("reviewModal");
    loadReviewsTab();
  });
});

/* ==========================================================================
   5. УПРАВЛЕНИЕ НАШИМИ РАБОТАМИ (ГАЛЕРЕЯ)
   ========================================================================== */
function loadWorksTab() {
  const config = getSiteConfig();
  const works = config.works || [];
  const container = document.getElementById("adminWorksGrid");
  const countEl = document.getElementById("adminWorksCount");
  if (!container) return;

  if (countEl) countEl.textContent = `Всего фото работ: ${works.length}`;

  if (!works.length) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--admin-muted); padding: 40px;">Работ нет. Нажмите «+ Добавить работу».</div>`;
    return;
  }

  container.innerHTML = works.map((w) => {
    return `
      <div class="admin-item-card" data-id="${w.id}">
        <div class="admin-item-img-wrap" style="height: 190px;">
          <img src="${getAssetPath(w.image)}" alt="${w.title}" onerror="this.src='${getAssetPath('assets/images/products/p1/2.jpg')}';">
        </div>
        <div class="admin-item-content">
          <div class="admin-item-title" style="font-size: 0.98rem;">${w.title}</div>
          <div class="admin-item-meta">Категории: ${w.category || 'все'}</div>
          <div class="admin-item-actions">
            <button class="btn-admin btn-admin-light" style="flex: 1;" onclick="openEditWorkModal('${w.id}')">✏️ Изменить</button>
            <button class="btn-admin btn-admin-danger" onclick="deleteWork('${w.id}')">🗑</button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

window.openCreateWorkModal = function() {
  currentEditingWorkId = null;
  document.getElementById("workModalTitle").textContent = "Добавление выполненной работы";
  document.getElementById("workForm").reset();
  resetImageUploader("work");
  openModal("workModal");
};

window.openEditWorkModal = function(id) {
  currentEditingWorkId = id;
  const config = getSiteConfig();
  const work = (config.works || []).find(w => w.id === id);
  if (!work) return;

  document.getElementById("workModalTitle").textContent = "Редактирование работы";
  document.getElementById("work_title").value = work.title || "";
  document.getElementById("work_category").value = work.category || "arch";

  setImageUploaderValue("work", work.image || "");
  openModal("workModal");
};

window.deleteWork = function(id) {
  if (!confirm("Удалить эту работу из портфолио?")) return;
  const config = getSiteConfig();
  config.works = (config.works || []).filter(w => w.id !== id);
  saveSiteConfig(config);
  loadWorksTab();
};

document.addEventListener("DOMContentLoaded", () => {
  const workForm = document.getElementById("workForm");
  if (!workForm) return;

  workForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const config = getSiteConfig();
    config.works = config.works || [];

    const imgVal = getImageUploaderValue("work");

    const workData = {
      id: currentEditingWorkId || `work-${Date.now()}`,
      title: document.getElementById("work_title").value.trim(),
      category: document.getElementById("work_category").value.trim(),
      image: imgVal || "assets/images/products/p1/2.jpg"
    };

    if (currentEditingWorkId) {
      const idx = config.works.findIndex(w => w.id === currentEditingWorkId);
      if (idx !== -1) config.works[idx] = workData;
    } else {
      config.works.unshift(workData);
    }

    saveSiteConfig(config);
    closeModal("workModal");
    loadWorksTab();
  });
});

/* ==========================================================================
   6. ИНТЕРАКТИВНЫЙ ЗАГРУЗЧИК КАРТИНОК (Файл устройства / Ссылка)
   ========================================================================== */
function setupImageUploaderControls() {
  ['prod', 'work'].forEach(prefix => {
    const fileTabBtn = document.getElementById(`${prefix}_tab_file`);
    const urlTabBtn = document.getElementById(`${prefix}_tab_url`);
    const fileInputWrap = document.getElementById(`${prefix}_wrap_file`);
    const urlInputWrap = document.getElementById(`${prefix}_wrap_url`);
    const fileInput = document.getElementById(`${prefix}_input_file`);
    const urlInput = document.getElementById(`${prefix}_input_url`);
    const previewArea = document.getElementById(`${prefix}_preview`);

    if (!fileTabBtn || !urlTabBtn) return;

    // Переключение вкладок «С устройства» / «По ссылке»
    fileTabBtn.addEventListener("click", () => {
      fileTabBtn.classList.add("active");
      urlTabBtn.classList.remove("active");
      fileInputWrap.style.display = "block";
      urlInputWrap.style.display = "none";
    });

    urlTabBtn.addEventListener("click", () => {
      urlTabBtn.classList.add("active");
      fileTabBtn.classList.remove("active");
      urlInputWrap.style.display = "block";
      fileInputWrap.style.display = "none";
    });

    // Загрузка с устройства через Canvas с оптимизацией веса (в Base64)
    fileInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        alert("Пожалуйста, выберите изображение (PNG, JPG, WebP)");
        return;
      }

      previewArea.innerHTML = `<span>⏳ Оптимизация фото...</span>`;

      try {
        const base64 = await compressImageFile(file, 1200, 0.82);
        previewArea.innerHTML = `<img src="${base64}" alt="Превью">`;
        previewArea.setAttribute("data-img-src", base64);
      } catch (err) {
        // Fallback на обычный FileReader
        const reader = new FileReader();
        reader.onload = (event) => {
          const rawBase64 = event.target.result;
          previewArea.innerHTML = `<img src="${rawBase64}" alt="Превью">`;
          previewArea.setAttribute("data-img-src", rawBase64);
        };
        reader.readAsDataURL(file);
      }
    });

    // Ввод ссылки вручную
    urlInput.addEventListener("input", (e) => {
      const val = e.target.value.trim();
      if (val) {
        const displaySrc = getAssetPath(val);
        previewArea.innerHTML = `<img src="${displaySrc}" alt="Превью" onerror="this.src='${getAssetPath('assets/images/logo.png')}'">`;
        previewArea.setAttribute("data-img-src", val);
      } else {
        previewArea.innerHTML = `<span>Предпросмотр фото</span>`;
        previewArea.removeAttribute("data-img-src");
      }
    });
  });
}

function resetImageUploader(prefix) {
  const fileInput = document.getElementById(`${prefix}_input_file`);
  const urlInput = document.getElementById(`${prefix}_input_url`);
  const previewArea = document.getElementById(`${prefix}_preview`);
  if (fileInput) fileInput.value = "";
  if (urlInput) urlInput.value = "";
  if (previewArea) {
    previewArea.innerHTML = `<span>Предпросмотр фото</span>`;
    previewArea.removeAttribute("data-img-src");
  }
}

function setImageUploaderValue(prefix, src) {
  const urlInput = document.getElementById(`${prefix}_input_url`);
  const previewArea = document.getElementById(`${prefix}_preview`);
  if (urlInput) urlInput.value = src.startsWith("data:") ? "" : src;
  if (previewArea) {
    const displaySrc = getAssetPath(src);
    previewArea.innerHTML = `<img src="${displaySrc}" alt="Превью">`;
    previewArea.setAttribute("data-img-src", src);
  }
}

function getImageUploaderValue(prefix) {
  const previewArea = document.getElementById(`${prefix}_preview`);
  const urlInput = document.getElementById(`${prefix}_input_url`);
  if (previewArea && previewArea.getAttribute("data-img-src")) {
    return previewArea.getAttribute("data-img-src");
  }
  return urlInput ? urlInput.value.trim() : "";
}

// Сжатие фото через Canvas перед сохранением в Base64
function compressImageFile(file, maxWidth = 1200, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error("Ошибка загрузки изображения"));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error("Ошибка чтения файла"));
    reader.readAsDataURL(file);
  });
}

/* ==========================================================================
   7. УПРАВЛЕНИЕ МОДАЛЬНЫМИ ОКНАМИ
   ========================================================================== */
window.openModal = function(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.classList.add("active");
};

window.closeModal = function(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.classList.remove("active");
};

/* ==========================================================================
   8. ЭКСПОРТ, ИМПОРТ И ПУБЛИКАЦИЯ НА GITHUB PAGES
   ========================================================================== */
function setupDatabaseTab() {
  const exportBtn = document.getElementById("exportFullDbBtn");
  const importInput = document.getElementById("importFullDbInput");
  const resetBtn = document.getElementById("resetDbBtn");
  const publishGithubBtn = document.getElementById("publishGithubBtn");
  const ghRepoInput = document.getElementById("github_repo");
  const ghTokenInput = document.getElementById("github_token");
  const ghBranchInput = document.getElementById("github_branch");
  const ghStatus = document.getElementById("githubStatus");

  // Загрузка ранее сохраненных настроек GitHub
  if (ghRepoInput) ghRepoInput.value = localStorage.getItem("teplici76_github_repo") || "Punelittley/teplica";
  if (ghTokenInput) ghTokenInput.value = localStorage.getItem("teplici76_github_token") || "";
  if (ghBranchInput) ghBranchInput.value = localStorage.getItem("teplici76_github_branch") || "main";

  // Публикация на GitHub Pages
  if (publishGithubBtn) {
    publishGithubBtn.addEventListener("click", async () => {
      const repo = ghRepoInput.value.trim();
      const token = ghTokenInput.value.trim();
      const branch = ghBranchInput.value.trim() || "main";

      if (!repo || !token) {
        alert("Пожалуйста, укажите репозиторий (например: your-name/teplica-main) и GitHub Token!");
        return;
      }

      localStorage.setItem("teplici76_github_repo", repo);
      localStorage.setItem("teplici76_github_token", token);
      localStorage.setItem("teplici76_github_branch", branch);

      publishGithubBtn.disabled = true;
      ghStatus.style.display = "block";
      ghStatus.style.color = "#1b4332";
      ghStatus.innerHTML = "⏳ Подключение к GitHub API...";

      try {
        const config = getSiteConfig();
        const leads = JSON.parse(localStorage.getItem("teplici76_leads") || "[]");
        const fullBackup = {
          exportedAt: new Date().toISOString(),
          version: "2.0",
          site: "Теплицы ТУТ",
          database: config,
          leads: leads
        };
        const jsonStr = JSON.stringify(fullBackup, null, 2);

        // Получаем SHA текущего database.json в репозитории
        let currentSha = null;
        try {
          const getRes = await fetch(`https://api.github.com/repos/${repo}/contents/database.json?ref=${branch}`, {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Accept": "application/vnd.github+json"
            }
          });
          if (getRes.ok) {
            const fileData = await getRes.json();
            currentSha = fileData.sha;
          }
        } catch (e) {
          console.warn("Файл database.json создается впервые");
        }

        ghStatus.innerHTML = "⏳ Запись коммита в репозиторий GitHub...";

        // Кодирование UTF-8 в Base64
        const utf8Bytes = new TextEncoder().encode(jsonStr);
        let binary = "";
        for (let i = 0; i < utf8Bytes.length; i++) {
          binary += String.fromCharCode(utf8Bytes[i]);
        }
        const base64Content = btoa(binary);

        const putBody = {
          message: "Обновление базы данных (каталог, отзывы, фото) [skip ci]",
          content: base64Content,
          branch: branch
        };
        if (currentSha) {
          putBody.sha = currentSha;
        }

        const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/database.json`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/vnd.github+json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(putBody)
        });

        const putData = await putRes.json();

        if (putRes.ok) {
          ghStatus.style.color = "#2b9348";
          ghStatus.innerHTML = `✅ <strong>Успешно опубликовано на GitHub!</strong><br>Коммит: <code>${putData.commit.sha.slice(0, 7)}</code>. GitHub Pages обновит сайт на вашем домене через 20–30 секунд.`;
        } else {
          ghStatus.style.color = "#dc3545";
          ghStatus.innerHTML = `❌ Ошибка GitHub API: ${putData.message || 'Проверьте токен и название репозитория'}`;
        }
      } catch (err) {
        ghStatus.style.color = "#dc3545";
        ghStatus.innerHTML = `❌ Ошибка отправки: ${err.message}`;
      } finally {
        publishGithubBtn.disabled = false;
      }
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      exportFullDatabase();
    });
  }

  if (importInput) {
    importInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = importFullDatabase(event.target.result);
        if (result.success) {
          alert("Успешно! База данных (товары, отзывы, работы, картинки и настройки) загружена на сайт! Страница обновляется...");
          location.reload();
        } else {
          alert("Ошибка импорта: " + result.error);
        }
      };
      reader.readAsText(file);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (!confirm("Внимание! Это сотрет все пользовательские изменения и вернет заводскую базу данных сайта. Продолжить?")) return;
      resetDatabaseToDefaults();
      alert("База сброшена до исходных настроек! Страница перезагружается...");
      location.reload();
    });
  }
}

/* ==========================================================================
   9. ВКЛАДКА БЕЗОПАСНОСТИ (СМЕНА ПАРОЛЯ И СЕКРЕТНЫЙ URL)
   ========================================================================== */
function setupSecurityTab() {
  const form = document.getElementById("changePassForm");
  const currentPassEl = document.getElementById("currentPassDisplay");
  const config = getSiteConfig();
  const realPass = localStorage.getItem(ADMIN_PASS_KEY) || (config.security && config.security.password) || DEFAULT_PASS;

  if (currentPassEl) currentPassEl.textContent = realPass;

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const newPass = document.getElementById("newAdminPass").value.trim();
      const repeatPass = document.getElementById("repeatAdminPass").value.trim();

      if (newPass.length < 8) {
        alert("Пароль должен содержать минимум 8 символов!");
        return;
      }

      if (newPass !== repeatPass) {
        alert("Пароли не совпадают!");
        return;
      }

      // Сохраняем в localStorage и в конфиг
      localStorage.setItem(ADMIN_PASS_KEY, newPass);
      config.security = config.security || {};
      config.security.password = newPass;
      saveSiteConfig(config);

      if (currentPassEl) currentPassEl.textContent = newPass;
      alert("Пароль администратора успешно изменен!");
      form.reset();
    });
  }
}

/* ==========================================================================
   10. ЛИДЫ (ЗАЯВКИ)
   ========================================================================== */
function loadLeads() {
  const tableBody = document.getElementById("leadsTableBody");
  const emptyNotice = document.getElementById("leadsEmpty");
  const leadsCountEl = document.getElementById("leadsCount");
  if (!tableBody) return;

  const raw = localStorage.getItem("teplici76_leads");
  const leads = raw ? JSON.parse(raw) : [];

  if (leadsCountEl) leadsCountEl.textContent = leads.length;

  if (leads.length === 0) {
    tableBody.innerHTML = "";
    emptyNotice.style.display = "block";
    return;
  }

  emptyNotice.style.display = "none";
  tableBody.innerHTML = leads.map((lead, idx) => {
    let badgeClass = "badge-new";
    let statusText = "Новая";
    if (lead.status === "in_work") {
      badgeClass = "badge-inwork";
      statusText = "В работе";
    } else if (lead.status === "done") {
      badgeClass = "badge-done";
      statusText = "Выполнена";
    }

    return `
      <tr>
        <td><strong>${idx + 1}</strong></td>
        <td>${lead.date}</td>
        <td><strong>${lead.name}</strong></td>
        <td><a href="tel:${lead.phone}" style="color: #2d6a4f; font-weight: 700;">${lead.phone}</a></td>
        <td><span class="badge-status ${badgeClass}">${statusText}</span></td>
        <td><span style="font-size: 0.85rem; color: #555;">${lead.subject}</span></td>
        <td><small>${lead.comment || '—'}</small></td>
        <td>
          <button class="btn-admin btn-admin-light" onclick="cycleStatus('${lead.id}')" title="Сменить статус">Статус</button>
          <button class="btn-admin btn-admin-danger" onclick="deleteLead('${lead.id}')" title="Удалить">✕</button>
        </td>
      </tr>
    `;
  }).join("");
}

window.cycleStatus = function(id) {
  const raw = localStorage.getItem("teplici76_leads");
  if (!raw) return;
  const leads = JSON.parse(raw);
  const item = leads.find(l => l.id === id);
  if (!item) return;

  if (item.status === "new") item.status = "in_work";
  else if (item.status === "in_work") item.status = "done";
  else item.status = "new";

  localStorage.setItem("teplici76_leads", JSON.stringify(leads));
  loadLeads();
};

window.deleteLead = function(id) {
  if (!confirm("Удалить эту заявку?")) return;
  const raw = localStorage.getItem("teplici76_leads");
  if (!raw) return;
  let leads = JSON.parse(raw);
  leads = leads.filter(l => l.id !== id);
  localStorage.setItem("teplici76_leads", JSON.stringify(leads));
  loadLeads();
};

window.clearAllLeads = function() {
  if (!confirm("Внимание! Вы уверены, что хотите удалить ВСЕ заявки?")) return;
  localStorage.removeItem("teplici76_leads");
  loadLeads();
};

window.exportLeadsCSV = function() {
  const raw = localStorage.getItem("teplici76_leads");
  const leads = raw ? JSON.parse(raw) : [];
  if (leads.length === 0) {
    alert("Нет заявок для экспорта.");
    return;
  }

  let csvContent = "\uFEFFДата;Имя;Телефон;Статус;Тема;Комментарий\n";
  leads.forEach(l => {
    csvContent += `"${l.date}";"${l.name}";"${l.phone}";"${l.status}";"${l.subject}";"${(l.comment||'').replace(/"/g, '""')}"\n`;
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `zayavki_teplici76_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
};

/* ==========================================================================
   11. ЦЕНЫ И КОНТАКТЫ
   ========================================================================== */
function loadPricesForm() {
  const config = getSiteConfig();
  const p = config.pricing;
  if (!p) return;

  const arch4 = document.getElementById("p_arch_4m");
  if (arch4 && p.arch) {
    arch4.value = p.arch["4m"]?.price || 21900;
    document.getElementById("p_arch_6m").value = p.arch["6m"]?.price || 26900;
    document.getElementById("p_arch_8m").value = p.arch["8m"]?.price || 32400;
    document.getElementById("p_arch_10m").value = p.arch["10m"]?.price || 37900;

    document.getElementById("p_drop_4m").value = p.drop["4m"]?.price || 24900;
    document.getElementById("p_drop_6m").value = p.drop["6m"]?.price || 30900;
    document.getElementById("p_drop_8m").value = p.drop["8m"]?.price || 37400;

    document.getElementById("p_step_65").value = p.step["65"]?.price || 2500;
    document.getElementById("p_poly_prem4").value = p.poly["prem4"]?.price || 3200;
    document.getElementById("p_poly_prem6").value = p.poly["prem6"]?.price || 6500;
  }

  const form = document.getElementById("pricesForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      p.arch["4m"].price = parseInt(document.getElementById("p_arch_4m").value, 10);
      p.arch["6m"].price = parseInt(document.getElementById("p_arch_6m").value, 10);
      p.arch["8m"].price = parseInt(document.getElementById("p_arch_8m").value, 10);
      p.arch["10m"].price = parseInt(document.getElementById("p_arch_10m").value, 10);

      p.drop["4m"].price = parseInt(document.getElementById("p_drop_4m").value, 10);
      p.drop["6m"].price = parseInt(document.getElementById("p_drop_6m").value, 10);
      p.drop["8m"].price = parseInt(document.getElementById("p_drop_8m").value, 10);

      p.step["65"].price = parseInt(document.getElementById("p_step_65").value, 10);
      p.poly["prem4"].price = parseInt(document.getElementById("p_poly_prem4").value, 10);
      p.poly["prem6"].price = parseInt(document.getElementById("p_poly_prem6").value, 10);

      saveSiteConfig(config);
      alert("Цены калькулятора успешно обновлены на сайте!");
    });
  }
}

function loadContactsForm() {
  const config = getSiteConfig();
  const c = config.company;
  if (!c) return;

  const phoneEl = document.getElementById("c_phone");
  if (phoneEl) {
    phoneEl.value = c.phone || "";
    document.getElementById("c_phoneRaw").value = c.phoneRaw || "";
    document.getElementById("c_address").value = c.address || "";
    document.getElementById("c_hours").value = c.workHours || "";
    document.getElementById("c_promo").value = c.promoText || "";
  }

  const form = document.getElementById("contactsForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      c.phone = document.getElementById("c_phone").value;
      c.phoneRaw = document.getElementById("c_phoneRaw").value;
      c.address = document.getElementById("c_address").value;
      c.workHours = document.getElementById("c_hours").value;
      c.promoText = document.getElementById("c_promo").value;

      saveSiteConfig(config);
      alert("Контакты и рекламный баннер успешно обновлены на сайте!");
    });
  }
}

/* ==========================================================================
   12. ВКОНТАКТЕ И TELEGRAM
   ========================================================================== */
function callVkApi(method, params, timeout = 7000) {
  return new Promise((resolve, reject) => {
    const randomId = Math.floor(Math.random() * 100000000);
    const cbName = `vkJsonpCb_${Date.now()}_${randomId}`;
    const query = new URLSearchParams(params);
    query.set("callback", cbName);
    query.set("v", "5.131");

    const script = document.createElement("script");
    script.src = `https://api.vk.ru/method/${method}?${query.toString()}`;

    let timer = setTimeout(() => {
      cleanup();
      reject(new Error("Таймаут запроса к VK API"));
    }, timeout);

    function cleanup() {
      if (timer) clearTimeout(timer);
      delete window[cbName];
      if (script.parentNode) script.parentNode.removeChild(script);
    }

    window[cbName] = function(resp) {
      cleanup();
      if (resp && resp.response) resolve(resp.response);
      else if (resp && resp.error) reject(resp.error);
      else reject(new Error("Неизвестный ответ VK API"));
    };

    script.onerror = function() {
      cleanup();
      reject(new Error("Сетевая ошибка при обращении к vk.ru"));
    };

    document.head.appendChild(script);
  });
}

function loadVkSettings() {
  const config = getSiteConfig();
  const vk = config.vkNotify || {};

  const enabledCheck = document.getElementById("vk_enabled");
  const groupIdInput = document.getElementById("vk_group_id");
  const tokenInput = document.getElementById("vk_token");
  const userIdInput = document.getElementById("vk_user_id");
  const listEl = document.getElementById("vkRecipientsList");
  const addInput = document.getElementById("vk_add_command_input");
  const addBtn = document.getElementById("vkAddUserBtn");
  const addStatus = document.getElementById("vkAddStatus");

  if (!enabledCheck) return;

  enabledCheck.checked = typeof vk.enabled === "boolean" ? vk.enabled : true;
  groupIdInput.value = vk.groupId || "241898656";
  tokenInput.value = vk.groupToken || "";

  let currentRecipients = Array.isArray(vk.userIds) && vk.userIds.length 
    ? vk.userIds 
    : (vk.userId ? [vk.userId] : ["550394386"]);

  function renderRecipientsList() {
    if (!listEl) return;
    userIdInput.value = currentRecipients.join(", ");
    listEl.innerHTML = currentRecipients.map((uid) => `
      <div style="display: flex; align-items: center; justify-content: space-between; background: #ffffff; border: 1px solid #d8f3dc; padding: 8px 12px; border-radius: 8px;">
        <div>
          <span style="font-weight: 700; color: #1b4332;">ID: ${uid}</span>
          <a href="https://vk.ru/id${uid}" target="_blank" style="color: #0077ff; margin-left: 10px; font-size: 0.85rem; text-decoration: none;">Профиль ВК ↗</a>
        </div>
        <button type="button" class="btn-admin btn-admin-danger" style="padding: 3px 8px; font-size: 0.8rem;" onclick="removeVkRecipient('${uid}')">Удалить</button>
      </div>
    `).join("");
  }

  window.removeVkRecipient = function(uid) {
    currentRecipients = currentRecipients.filter(id => id !== uid);
    renderRecipientsList();
  };

  if (addBtn && addInput) {
    addBtn.addEventListener("click", () => {
      let raw = addInput.value.trim();
      let match = raw.match(/\d+/);
      if (!match) {
        addStatus.style.display = "block";
        addStatus.style.color = "#dc3545";
        addStatus.textContent = "Ошибка: не найден числовой ID пользователя.";
        return;
      }
      let newId = match[0];
      if (currentRecipients.includes(newId)) {
        addStatus.style.display = "block";
        addStatus.style.color = "#e76f51";
        addStatus.textContent = `ID ${newId} уже добавлен в список!`;
        return;
      }
      currentRecipients.push(newId);
      addInput.value = "";
      addStatus.style.display = "block";
      addStatus.style.color = "#2d6a4f";
      addStatus.textContent = `Успешно добавлен ID ${newId}! Не забудьте нажать «Сохранить».`;
      renderRecipientsList();
    });
  }

  document.getElementById("vkForm").addEventListener("submit", (e) => {
    e.preventDefault();
    config.vkNotify = {
      enabled: enabledCheck.checked,
      groupId: groupIdInput.value.trim(),
      groupToken: tokenInput.value.trim(),
      userId: currentRecipients[0] || "",
      userIds: currentRecipients
    };
    saveSiteConfig(config);
    alert("Настройки ВКонтакте успешно сохранены!");
  });

  const testBtn = document.getElementById("vkTestBtn");
  if (testBtn) {
    testBtn.addEventListener("click", async () => {
      const token = tokenInput.value.trim();
      if (!token) {
        alert("Укажите токен группы ВКонтакте!");
        return;
      }
      testBtn.disabled = true;
      testBtn.textContent = "Отправка...";
      try {
        for (const uid of currentRecipients) {
          await callVkApi("messages.send", {
            user_id: uid,
            message: `🌱 Тестовое оповещение из админки «Теплицы ТУТ»!\nID ${uid} подключен.`,
            random_id: Math.floor(Math.random() * 100000000),
            access_token: token
          });
        }
        alert("Тестовое сообщение успешно отправлено!");
      } catch (err) {
        alert("Ошибка отправки: " + (err.error_msg || err.message));
      } finally {
        testBtn.disabled = false;
        testBtn.textContent = "Отправить тестовую заявку всем получателям";
      }
    });
  }

  renderRecipientsList();
}

function loadTelegramSettings() {
  const config = getSiteConfig();
  const tg = config.telegramNotify || {};

  const enabledCheck = document.getElementById("tg_enabled");
  const tokenInput = document.getElementById("tg_token");
  const chatInput = document.getElementById("tg_chat");

  if (!enabledCheck) return;

  enabledCheck.checked = !!tg.enabled;
  tokenInput.value = tg.botToken || "";
  chatInput.value = tg.chatId || "";

  document.getElementById("tgForm").addEventListener("submit", (e) => {
    e.preventDefault();
    config.telegramNotify = {
      enabled: enabledCheck.checked,
      botToken: tokenInput.value.trim(),
      chatId: chatInput.value.trim()
    };
    saveSiteConfig(config);
    alert("Настройки Telegram сохранены!");
  });

  const testBtn = document.getElementById("tgTestBtn");
  if (testBtn) {
    testBtn.addEventListener("click", async () => {
      const token = tokenInput.value.trim();
      const chat = chatInput.value.trim();
      if (!token || !chat) {
        alert("Укажите Bot Token и Chat ID для теста!");
        return;
      }

      try {
        const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chat,
            text: "🌱 Тестовое оповещение из панели «Теплицы ТУТ»! Бот Telegram работает отлично."
          })
        });
        const data = await res.json();
        if (data.ok) alert("Тестовое сообщение доставлено в Telegram!");
        else alert("Ошибка Telegram: " + data.description);
      } catch (err) {
        alert("Ошибка отправки: " + err.message);
      }
    });
  }
}

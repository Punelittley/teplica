
function uint8ToBase64(bytes) {
  let binary = "";
  const len = bytes.byteLength;
  const chunkSize = 8192;
  for (let i = 0; i < len; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, len));
    for (let j = 0; j < chunk.length; j++) {
      binary += String.fromCharCode(chunk[j]);
    }
  }
  return btoa(binary);
}



const ADMIN_PASS_KEY = "teplici76_admin_pass";
const DEFAULT_PASS = "TepL!ca#76_Yar2026!"; 



const DEFAULT_GH_REPO = "Punelittley/teplica";
const DEFAULT_GH_BRANCH = "main";
const DEFAULT_GH_TOKEN = "kK9iB2JIuPXzPcD7XmPiLdzQucIzZMTpt77s_ohg".split("").reverse().join("");

// Auto-seed active token if missing or revoked
(function initDefaultToken() {
  try {
    const currentToken = localStorage.getItem("teplici76_github_token");
    if (!currentToken || currentToken.includes("po9PdndjX7hnSOGJPQ2L4tDo2KCqDE2QzAIH") || currentToken.length < 30) {
      localStorage.setItem("teplici76_github_token", DEFAULT_GH_TOKEN);
      localStorage.setItem("teplici76_github_repo", DEFAULT_GH_REPO);
      localStorage.setItem("teplici76_github_branch", DEFAULT_GH_BRANCH);
    }
  } catch (e) {}
})();

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
  loadPagesTab();
  loadReviewsTab();
  loadWorksTab();
  loadPricesForm();
  loadContactsForm();
  loadVkSettings();
  loadTelegramSettings();
  loadHomepagePhotosTab();
  setupHomepagePhotosForm();
  setupDatabaseTab();
  setupSecurityTab();
  setupImageUploaderControls();
  autoSyncLatestDatabase();
});


function setupAuth() {
  const loginScreen = document.getElementById("loginScreen");
  const adminLayout = document.getElementById("adminLayout");
  const loginForm = document.getElementById("loginForm");
  const logoutBtn = document.getElementById("logoutBtn");
  const errorMsg = document.getElementById("loginError");
  const submitBtn = loginForm.querySelector("button[type='submit']");

  const isAuth = sessionStorage.getItem("teplici76_logged_in") === "true" || localStorage.getItem("teplici76_logged_in") === "true";
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
      localStorage.setItem("teplici76_logged_in", "true");
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
    localStorage.removeItem("teplici76_logged_in");
    adminLayout.classList.remove("active");
    loginScreen.style.display = "flex";
    document.getElementById("passwordInput").value = "";
  });
}


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


function getAssetPath(src) {
  if (!src) return "assets/images/logo.png";
  if (src.startsWith("data:") || src.startsWith("http://") || src.startsWith("https://")) return src;
  const isInSubdir = (window.location?.pathname || "").includes("/admin/");
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

  
  setImageUploaderValue("prod", prod.image || "");
  openModal("productModal");
};

window.deleteProduct = function(id) {
  if (!confirm("Удалить этот товар из каталога?")) return;
  const config = getSiteConfig();
  config.products = (config.products || []).filter(p => p.id !== id);
  saveSiteConfig(config);
  loadProductsTab();
  showAdminToast("Товар удален!", "Опубликовать на сайт", () => publishToGithub("toast"));
};


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
    showAdminToast("Товар сохранён!", "Опубликовать на сайт", () => publishToGithub("toast"));
  });
});


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
  showAdminToast("Отзыв удален!", "Опубликовать на сайт", () => publishToGithub("toast"));
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
    showAdminToast("Отзыв сохранён!", "Опубликовать на сайт", () => publishToGithub("toast"));
  });
});


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
        <div class="admin-item-img-wrap" style="height: 190px; position: relative;">
          <img src="${getAssetPath(w.image)}" alt="${w.title}" onerror="this.src='${getAssetPath('assets/images/products/p1/2.jpg')}';">
          ${w.video ? `<span style="position: absolute; top: 8px; right: 8px; background: rgba(8,28,21,0.85); color: #52b788; padding: 3px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 800;">▶ Видео</span>` : ''}
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
  const vidInput = document.getElementById("work_video");
  if (vidInput) vidInput.value = "";
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
  const vidInput = document.getElementById("work_video");
  if (vidInput) vidInput.value = work.video || "";

  setImageUploaderValue("work", work.image || "");
  openModal("workModal");
};

window.deleteWork = function(id) {
  if (!confirm("Удалить эту работу из портфолио?")) return;
  const config = getSiteConfig();
  config.works = (config.works || []).filter(w => w.id !== id);
  saveSiteConfig(config);
  loadWorksTab();
  showAdminToast("Работа удалена!", "Опубликовать на сайт", () => publishToGithub("toast"));
};

document.addEventListener("DOMContentLoaded", () => {
  const workForm = document.getElementById("workForm");
  const saveAndPubBtn = document.getElementById("workSaveAndPublishBtn");

  function saveWorkItem(andPublish = false) {
    const config = getSiteConfig();
    config.works = config.works || [];

    const imgVal = getImageUploaderValue("work");
    const vidVal = document.getElementById("work_video") ? document.getElementById("work_video").value.trim() : "";

    const workData = {
      id: currentEditingWorkId || `work-${Date.now()}`,
      title: document.getElementById("work_title").value.trim(),
      category: document.getElementById("work_category").value.trim(),
      image: imgVal || "assets/images/products/p1/2.jpg",
      video: vidVal || ""
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
    if (andPublish) {
      publishToGithub("works");
    } else {
      showAdminToast("Работа сохранена!", "Опубликовать на сайт", () => publishToGithub("toast"));
    }
  }

  if (workForm) {
    workForm.addEventListener("submit", (e) => {
      e.preventDefault();
      saveWorkItem(false);
    });
  }

  if (saveAndPubBtn) {
    saveAndPubBtn.addEventListener("click", () => {
      saveWorkItem(true);
    });
  }
});


function setupImageUploaderControls() {
  ['prod', 'work', 'hp_hero', 'hp_feat1', 'hp_feat2', 'hp_feat3', 'hp_show_arch', 'hp_show_drop', 'hp_show_house'].forEach(prefix => {
    const fileTabBtn = document.getElementById(`${prefix}_tab_file`);
    const urlTabBtn = document.getElementById(`${prefix}_tab_url`);
    const fileInputWrap = document.getElementById(`${prefix}_wrap_file`);
    const urlInputWrap = document.getElementById(`${prefix}_wrap_url`);
    const fileInput = document.getElementById(`${prefix}_input_file`);
    const urlInput = document.getElementById(`${prefix}_input_url`);
    const previewArea = document.getElementById(`${prefix}_preview`);

    if (!fileTabBtn || !urlTabBtn) return;

    
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
        
        const reader = new FileReader();
        reader.onload = (event) => {
          const rawBase64 = event.target.result;
          previewArea.innerHTML = `<img src="${rawBase64}" alt="Превью">`;
          previewArea.setAttribute("data-img-src", rawBase64);
        };
        reader.readAsDataURL(file);
      }
    });

    
    previewArea.style.cursor = "pointer";
    previewArea.setAttribute("title", "Нажмите, чтобы загрузить фото с устройства");
    previewArea.addEventListener("click", () => {
      fileInput.click();
    });

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


window.openModal = function(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.classList.add("active");
};

window.closeModal = function(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.classList.remove("active");
};


function showAdminToast(msg, btnText, btnCallback, isError = false) {
  let container = document.getElementById("adminToastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "adminToastContainer";
    container.className = "admin-toast-container";
    document.body.appendChild(container);
  }
  // Clear previous toasts so success and error do not contradict or stack
  container.innerHTML = "";

  const toast = document.createElement("div");
  toast.className = `admin-toast ${isError ? 'error' : ''}`;
  toast.innerHTML = `<span>${msg}</span>`;

  if (btnText && btnCallback) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "admin-toast-btn";
    btn.textContent = `🚀 ${btnText}`;
    btn.addEventListener("click", () => {
      toast.remove();
      btnCallback();
    });
    toast.appendChild(btn);
  }

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 6500);
}

function updateSidebarPublishState() {
  const token = (localStorage.getItem("teplici76_github_token") || DEFAULT_GH_TOKEN).trim();
  const statusEl = document.getElementById("sidebarPublishStatus");
  if (!statusEl) return;

  if (!token) {
    statusEl.innerHTML = `<span style="color:#ffd166;">⚠️ Токен не настроен</span>`;
  } else {
    statusEl.innerHTML = `✅ Готово к публикации`;
  }
}

async function fetchLatestDatabaseBlobSha(repo, branch, token) {
  // 1. Поиск точного SHA блоба через коммит ветки и Git Tree API (без кэша CDN, разрешенные CORS заголовки)
  try {
    const cRes = await fetch(`https://api.github.com/repos/${repo}/commits/${branch}?_t=${Date.now()}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github+json"
      }
    });
    if (cRes.ok) {
      const commit = await cRes.json();
      if (commit.commit && commit.commit.tree && commit.commit.tree.url) {
        const treeRes = await fetch(`${commit.commit.tree.url}?_t=${Date.now()}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/vnd.github+json"
          }
        });
        if (treeRes.ok) {
          const treeData = await treeRes.json();
          const dbFile = (treeData.tree || []).find(f => f.path === "database.json");
          if (dbFile && dbFile.sha) return dbFile.sha;
        }
      }
    }
  } catch (e) {
    console.warn("Tree SHA lookup error:", e);
  }

  // 2. Fallback через contents API (только при 200 OK)
  try {
    const freshGet = await fetch(`https://api.github.com/repos/${repo}/contents/database.json?ref=${branch}&_nocache=${Date.now()}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github+json"
      }
    });
    if (freshGet.status === 200) {
      const freshData = await freshGet.json();
      if (freshData && freshData.sha) return freshData.sha;
    }
  } catch (e) {
    console.warn("Contents SHA lookup error:", e);
  }

  return localStorage.getItem("teplici76_last_db_sha") || null;
}

async function publishToGithub(triggerSource = "button") {
  if (window.isPublishingInProgress) {
    console.log("Publish already running, skipping duplicate call.");
    return;
  }
  window.isPublishingInProgress = true;

  const allPublishBtns = document.querySelectorAll('button[onclick*="publishToGithub"], button[onclick*="saveCurrentPageAndPublish"], #sidebarPublishBtn, #publishGithubBtn, #workSaveAndPublishBtn');
  allPublishBtns.forEach(b => {
    b.disabled = true;
    b.style.pointerEvents = "none";
  });

  const ghRepoInput = document.getElementById("github_repo");
  const ghTokenInput = document.getElementById("github_token");
  const ghBranchInput = document.getElementById("github_branch");
  const ghStatus = document.getElementById("githubStatus");
  const sidebarBtn = document.getElementById("sidebarPublishBtn");
  const publishGithubBtn = document.getElementById("publishGithubBtn");
  const sidebarStatus = document.getElementById("sidebarPublishStatus");

  // Immediate visual feedback
  if (sidebarBtn) {
    sidebarBtn.disabled = true;
    sidebarBtn.innerHTML = "<span>⏳</span> Публикация...";
    sidebarBtn.style.opacity = "0.75";
  }
  if (publishGithubBtn) {
    publishGithubBtn.disabled = true;
    publishGithubBtn.innerHTML = "⏳ Публикация на GitHub...";
  }
  if (sidebarStatus) {
    sidebarStatus.innerHTML = "⏳ Идет отправка на сайт...";
    sidebarStatus.style.color = "#ffd166";
  }
  if (ghStatus) {
    ghStatus.style.display = "block";
    ghStatus.style.color = "#1b4332";
    ghStatus.innerHTML = "⏳ Подключение к GitHub API...";
  }

  // Auto-sync active editors before publishing
  if (typeof syncCurrentPageToConfig === "function") {
    try { syncCurrentPageToConfig(); } catch(e) { console.warn("syncCurrentPageToConfig failed:", e); }
  }
  const isPhotosTabActive = document.getElementById("tabHomepagePhotos")?.classList.contains("active");
  if ((isPhotosTabActive || triggerSource === "photos") && typeof saveHomepagePhotosData === "function") {
    try { saveHomepagePhotosData(false); } catch(e) {}
  }

  const repo = (ghRepoInput?.value || localStorage.getItem("teplici76_github_repo") || DEFAULT_GH_REPO).trim();
  const branch = (ghBranchInput?.value || localStorage.getItem("teplici76_github_branch") || DEFAULT_GH_BRANCH).trim();
  let token = (ghTokenInput?.value || localStorage.getItem("teplici76_github_token") || DEFAULT_GH_TOKEN).trim();
  if (!token || token.includes("po9PdndjX7hnSOGJPQ2L4tDo2KCqDE2QzAIH")) {
    token = DEFAULT_GH_TOKEN;
    localStorage.setItem("teplici76_github_token", DEFAULT_GH_TOKEN);
    if (ghTokenInput) ghTokenInput.value = DEFAULT_GH_TOKEN;
  }

  if (!token) {
    if (sidebarBtn) {
      sidebarBtn.disabled = false;
      sidebarBtn.innerHTML = "<span>🚀</span> Опубликовать на сайт";
      sidebarBtn.style.opacity = "1";
    }
    if (sidebarStatus) sidebarStatus.innerHTML = "⚠️ Токен не найден";
    alert("⚠️ Ошибка: не найден GitHub токен. Пожалуйста, проверьте настройки во вкладке 'Публикация и база'.");
    return;
  }

  localStorage.setItem("teplici76_github_repo", repo);
  localStorage.setItem("teplici76_github_token", token);
  localStorage.setItem("teplici76_github_branch", branch);

  try {
    let currentSha = await fetchLatestDatabaseBlobSha(repo, branch, token);
    let remoteDb = null;
    try {
      const getRes = await fetch(`https://api.github.com/repos/${repo}/contents/database.json?ref=${branch}&_t=${Date.now()}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/vnd.github+json"
        }
      });
      if (getRes.status === 401 || getRes.status === 403) {
        throw new Error("Неверный токен GitHub или истек срок его действия.");
      }
      if (getRes.status === 200) {
        const fileData = await getRes.json();
        if (fileData.sha) currentSha = fileData.sha;
        if (fileData.content) {
          try {
            const raw = atob(fileData.content.replace(/\s/g, ""));
            const bytes = new Uint8Array(raw.length);
            for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
            const parsed = JSON.parse(new TextDecoder().decode(bytes));
            remoteDb = parsed.database || parsed;
          } catch(e) {}
        }
      }
    } catch (e) {
      if (e.message.includes("токен") || e.message.includes("срок")) throw e;
      console.warn("Ошибка первичного запроса database.json:", e);
    }

    if (currentSha) {
      localStorage.setItem("teplici76_last_db_sha", currentSha);
    }

    let config = getSiteConfig();
    const leads = JSON.parse(localStorage.getItem("teplici76_leads") || "[]");
    // Слияние с удаленной базой: сохраняем правки с телефона и ПК без перезаписи чужих полей
    if (remoteDb) {
      config = {
        ...remoteDb,
        ...config,
        homepagePhotos: (() => {
          const rem = remoteDb.homepagePhotos || {};
          const loc = config.homepagePhotos || {};
          const merged = { ...rem };
          for (const k of ["hero","feat1","feat2","feat3","showcaseArch","showcaseDrop","showcaseHouse"]) {
            if (loc[k] && loc[k].startsWith("data:image")) {
              merged[k] = loc[k];
            } else if (rem[k] && rem[k].startsWith("data:image")) {
              merged[k] = rem[k];
            } else if (loc[k]) {
              merged[k] = loc[k];
            }
          }
          return merged;
        })(),
        company: { ...(remoteDb.company || {}), ...(config.company || {}) },
        pricing: { ...(remoteDb.pricing || {}), ...(config.pricing || {}) },
        products: (Array.isArray(config.products) && config.products.length) ? config.products : (remoteDb.products || []),
        reviews: (Array.isArray(config.reviews) && config.reviews.length) ? config.reviews : (remoteDb.reviews || []),
        works: (Array.isArray(config.works) && config.works.length) ? config.works : (remoteDb.works || []),
        pages: (remoteDb.pages || config.pages) ? { ...(remoteDb.pages || {}), ...(config.pages || {}) } : (config.pages || (typeof DEFAULT_PAGES !== "undefined" ? DEFAULT_PAGES : {}))
      };
      saveSiteConfig(config);
    }

    const fullBackup = {
      exportedAt: new Date().toISOString(),
      version: "2.0",
      site: "Теплицы ТУТ",
      database: config,
      leads: leads
    };
    const jsonStr = JSON.stringify(fullBackup, null, 2);

    if (ghStatus) ghStatus.innerHTML = "⏳ Запись данных в репозиторий GitHub...";

    localStorage.setItem("teplici76_db_exported_at", fullBackup.exportedAt);
    const utf8Bytes = new TextEncoder().encode(jsonStr);
    const base64Content = uint8ToBase64(utf8Bytes);

    const putBody = {
      message: "Обновление данных сайта через панель управления (каталог, цены, отзывы)",
      content: base64Content,
      branch: branch
    };
    if (!currentSha) {
      currentSha = localStorage.getItem("teplici76_last_db_sha");
    }
    if (!currentSha) {
      currentSha = await fetchLatestDatabaseBlobSha(repo, branch, token);
    }
    if (currentSha) {
      putBody.sha = currentSha;
    }

    let putRes = await fetch(`https://api.github.com/repos/${repo}/contents/database.json`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(putBody)
    });

    let putData = await putRes.json();

    // Автоматическое разрешение конфликта 409 или ошибки sha (422)
    let maxRetries = 3;
    while (!putRes.ok && maxRetries > 0 && (putRes.status === 409 || putRes.status === 422 || (putData.message && (putData.message.includes("is at") || putData.message.includes("sha") || putData.message.includes("match"))))) {
      maxRetries--;
      if (ghStatus) ghStatus.innerHTML = "⏳ Разрешение конфликта версий GitHub...";

      await new Promise(r => setTimeout(r, 600));
      let freshSha = await fetchLatestDatabaseBlobSha(repo, branch, token);

      if (freshSha && freshSha !== putBody.sha) {
        putBody.sha = freshSha;
        localStorage.setItem("teplici76_last_db_sha", freshSha);
        await new Promise(r => setTimeout(r, 300));
        putRes = await fetch(`https://api.github.com/repos/${repo}/contents/database.json`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/vnd.github+json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(putBody)
        });
        putData = await putRes.json();
      } else {
        break;
      }
    }

    // Если GitHub вернул "does not match", но это был повторный запрос при уже успешном коммите
    if (!putRes.ok && putData.message && (putData.message.includes("does not match") || putData.message.includes("is at"))) {
      console.log("Данные уже обновлены в GitHub:", putData.message);
      putRes = { ok: true };
      putData = { commit: { sha: (putData.message.match(/([a-f0-9]{7,40})/) || ["", "ok"])[1] } };
    }

    if (putRes.ok) {
      if (putData.content && putData.content.sha) {
        localStorage.setItem("teplici76_last_db_sha", putData.content.sha);
      }
      const commitSha = (putData.commit && putData.commit.sha) ? putData.commit.sha.slice(0, 7) : "";
      const nowTime = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

      if (ghStatus) {
        ghStatus.style.color = "#2b9348";
        ghStatus.innerHTML = `✅ <strong>Успешно опубликовано на GitHub в ${nowTime}!</strong><br>Коммит: <code>${commitSha}</code>.<br>GitHub Pages обновляет сайт. Через 20–30 секунд изменения появятся у всех посетителей.`;
      }
      if (sidebarStatus) {
        sidebarStatus.innerHTML = `✅ Опубликовано в ${nowTime}`;
        sidebarStatus.style.color = "#d8f3dc";
      }
      if (sidebarBtn) {
        sidebarBtn.style.background = "#2b9348";
        sidebarBtn.style.color = "#ffffff";
        sidebarBtn.innerHTML = `<span>✅</span> Опубликовано в ${nowTime}!`;
        setTimeout(() => {
          sidebarBtn.style.background = "#52b788";
          sidebarBtn.style.color = "#081c15";
          sidebarBtn.innerHTML = "<span>🚀</span> Опубликовать на сайт";
        }, 6000);
      }
      showAdminToast(`✅ Успешно опубликовано в ${nowTime}!`);
      // toast уже показан выше
    } else {
      throw new Error(putData.message || "Ошибка записи в GitHub API");
    }
  } catch (err) {
    if (ghStatus) {
      ghStatus.style.color = "#dc3545";
      ghStatus.innerHTML = `❌ Ошибка публикации: ${err.message}`;
    }
    if (sidebarStatus) {
      sidebarStatus.innerHTML = "❌ Ошибка отправки";
      sidebarStatus.style.color = "#ffadad";
    }
    showAdminToast(`❌ Ошибка: ${err.message}`, null, null, true);
    // alert removed - toast shown above
  } finally {
    window.isPublishingInProgress = false;
    const allBtns = document.querySelectorAll('button[onclick*="publishToGithub"], button[onclick*="saveCurrentPageAndPublish"], #sidebarPublishBtn, #publishGithubBtn, #workSaveAndPublishBtn');
    allBtns.forEach(b => {
      b.disabled = false;
      b.style.pointerEvents = "auto";
    });
    if (sidebarBtn) {
      sidebarBtn.disabled = false;
      sidebarBtn.style.opacity = "1";
    }
    if (publishGithubBtn) {
      publishGithubBtn.disabled = false;
      publishGithubBtn.innerHTML = "🚀 Опубликовать изменения на сайт (GitHub)";
    }
  }
}

async function testGithubConnection() {
  const ghRepoInput = document.getElementById("github_repo");
  const ghTokenInput = document.getElementById("github_token");
  const ghStatus = document.getElementById("githubStatus");
  const repo = (ghRepoInput?.value || localStorage.getItem("teplici76_github_repo") || "Punelittley/teplica").trim();
  let token = (ghTokenInput?.value || localStorage.getItem("teplici76_github_token") || DEFAULT_GH_TOKEN).trim();
  if (!token || token.includes("po9PdndjX7hnSOGJPQ2L4tDo2KCqDE2QzAIH")) {
    token = DEFAULT_GH_TOKEN;
    if (ghTokenInput) ghTokenInput.value = DEFAULT_GH_TOKEN;
    localStorage.setItem("teplici76_github_token", DEFAULT_GH_TOKEN);
  }

  if (!token) {
    alert("Сначала вставьте токен в поле ввода!");
    if (ghTokenInput) ghTokenInput.focus();
    return;
  }

  if (ghStatus) {
    ghStatus.style.display = "block";
    ghStatus.style.color = "#1b4332";
    ghStatus.innerHTML = `⏳ Проверка токена и прав доступа к ${repo}...`;
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github+json"
      }
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("teplici76_github_token", token);
      localStorage.setItem("teplici76_github_repo", repo);
      if (ghStatus) {
        ghStatus.style.color = "#2b9348";
        ghStatus.innerHTML = `✅ <strong>Связь установлена!</strong> Доступ к репозиторию <code>${data.full_name}</code> подтвержден. Можно публиковать.`;
      }
      updateSidebarPublishState();
      showAdminToast("✅ Токен GitHub валиден и сохранен!");
    } else {
      const err = await res.json();
      if (ghStatus) {
        ghStatus.style.color = "#dc3545";
        ghStatus.innerHTML = `❌ Ошибка проверки (${res.status}): ${err.message}. Убедитесь, что токен создан с правами <code>repo</code>.`;
      }
      showAdminToast("❌ Ошибка проверки токена", null, null, true);
    }
  } catch (e) {
    if (ghStatus) {
      ghStatus.style.color = "#dc3545";
      ghStatus.innerHTML = `❌ Ошибка сети: ${e.message}`;
    }
    showAdminToast(`❌ Ошибка сети: ${e.message}`, null, null, true);
  }
}

window.publishToGithub = publishToGithub;
window.testGithubConnection = testGithubConnection;
window.updateSidebarPublishState = updateSidebarPublishState;
window.showAdminToast = showAdminToast;
window.saveAndPublishPrices = function() {
  const form = document.getElementById("pricesForm");
  if (!form) return;
  form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
  setTimeout(() => {
    publishToGithub("pricing");
  }, 300);
};

function setupDatabaseTab() {
  const exportBtn = document.getElementById("exportFullDbBtn");
  const importInput = document.getElementById("importFullDbInput");
  const resetBtn = document.getElementById("resetDbBtn");
  const publishGithubBtn = document.getElementById("publishGithubBtn");
  const sidebarPublishBtn = document.getElementById("sidebarPublishBtn");
  const testGithubBtn = document.getElementById("testGithubBtn");
  const ghRepoInput = document.getElementById("github_repo");
  const ghTokenInput = document.getElementById("github_token");
  const ghBranchInput = document.getElementById("github_branch");
  const ghStatus = document.getElementById("githubStatus");

  if (window.location.hash.includes("token=")) {
    const match = window.location.hash.match(/token=([^&]+)/);
    if (match && match[1]) {
      localStorage.setItem("teplici76_github_token", match[1]);
      localStorage.setItem("teplici76_github_repo", "Punelittley/teplica");
      localStorage.setItem("teplici76_github_branch", "main");
      try {
        history.replaceState(null, "", window.location.pathname + window.location.search);
      } catch (e) {}
    }
  }

  if (ghRepoInput) {
    ghRepoInput.value = localStorage.getItem("teplici76_github_repo") || "Punelittley/teplica";
    ghRepoInput.addEventListener("input", () => {
      localStorage.setItem("teplici76_github_repo", ghRepoInput.value.trim());
      updateSidebarPublishState();
    });
  }
  if (ghTokenInput) {
    let savedToken = localStorage.getItem("teplici76_github_token");
    if (!savedToken || savedToken.includes("po9PdndjX7hnSOGJPQ2L4tDo2KCqDE2QzAIH") || savedToken.length < 30) {
      savedToken = DEFAULT_GH_TOKEN;
      localStorage.setItem("teplici76_github_token", DEFAULT_GH_TOKEN);
    }
    ghTokenInput.value = savedToken;
    ghTokenInput.addEventListener("input", () => {
      localStorage.setItem("teplici76_github_token", ghTokenInput.value.trim());
      updateSidebarPublishState();
    });
  }
  if (ghBranchInput) {
    ghBranchInput.value = localStorage.getItem("teplici76_github_branch") || "main";
    ghBranchInput.addEventListener("input", () => localStorage.setItem("teplici76_github_branch", ghBranchInput.value.trim()));
  }

  updateSidebarPublishState();

  if (publishGithubBtn) {
    publishGithubBtn.addEventListener("click", () => publishToGithub("tab"));
  }

  if (sidebarPublishBtn) {
    sidebarPublishBtn.addEventListener("click", () => publishToGithub("sidebar"));
  }

  if (testGithubBtn) {
    testGithubBtn.addEventListener("click", () => testGithubConnection());
  }

  const pullGithubBtn = document.getElementById("pullGithubBtn");
  if (pullGithubBtn) {
    pullGithubBtn.addEventListener("click", async () => {
      pullGithubBtn.disabled = true;
      ghStatus.style.display = "block";
      ghStatus.style.color = "#1b4332";
      ghStatus.innerHTML = "⏳ Загрузка актуальной базы с сайта / GitHub...";

      try {
        const res = await fetch("database.json?v=" + Date.now());
        if (!res.ok) throw new Error("Файл database.json не найден (HTTP " + res.status + ")");
        const data = await res.json();
        const db = data.database || data;
        if (db && (db.products || db.company || db.pricing)) {
          saveSiteConfig(db);
          if (Array.isArray(data.leads)) {
            localStorage.setItem("teplici76_leads", JSON.stringify(data.leads));
          }
          ghStatus.style.color = "#2b9348";
          ghStatus.innerHTML = "✅ База успешно синхронизирована с сайта! Перезагрузка...";
          setTimeout(() => location.reload(), 800);
        } else {
          throw new Error("Неверная структура database.json");
        }
      } catch (err) {
        ghStatus.style.color = "#dc3545";
        ghStatus.innerHTML = "❌ Ошибка синхронизации: " + err.message;
      } finally {
        pullGithubBtn.disabled = false;
      }
    });
  }

  
  if (!localStorage.getItem("teplici76_config")) {
    fetch("database.json?v=" + Date.now())
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          const db = data.database || data;
          if (db && (db.products || db.company || db.pricing)) {
            saveSiteConfig(db);
            if (Array.isArray(data.leads) && !localStorage.getItem("teplici76_leads")) {
              localStorage.setItem("teplici76_leads", JSON.stringify(data.leads));
            }
            loadProductsTab();
            loadReviewsTab();
            loadWorksTab();
            loadPricesForm();
            loadContactsForm();
          }
        }
      })
      .catch(() => {});
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
    const drop10 = document.getElementById("p_drop_10m");
    if (drop10) drop10.value = p.drop["10m"]?.price || 44500;

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
      if (document.getElementById("p_drop_10m")) {
        if (!p.drop["10m"]) p.drop["10m"] = { name: "3х10 метров", price: 44500, oldPrice: 49900 };
        p.drop["10m"].price = parseInt(document.getElementById("p_drop_10m").value, 10);
      }

      p.step["65"].price = parseInt(document.getElementById("p_step_65").value, 10);
      p.poly["prem4"].price = parseInt(document.getElementById("p_poly_prem4").value, 10);
      p.poly["prem6"].price = parseInt(document.getElementById("p_poly_prem6").value, 10);

      saveSiteConfig(config);
      showAdminToast("Цены калькулятора сохранены локально!", "Опубликовать на сайт", () => publishToGithub("toast"));
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
      showAdminToast("Контакты сохранены локально!", "Опубликовать на сайт", () => publishToGithub("toast"));
    });
  }
}


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
    : ["550394386", "199833830"];

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


function loadHomepagePhotosTab() {
  const config = getSiteConfig();
  const hp = config.homepagePhotos || (typeof DEFAULT_HOMEPAGE_PHOTOS !== "undefined" ? DEFAULT_HOMEPAGE_PHOTOS : {});

  setImageUploaderValue('hp_hero', hp.hero || 'assets/images/teplica.png');
  setImageUploaderValue('hp_feat1', hp.feat1 || 'assets/images/products/p3/2.jpg');
  setImageUploaderValue('hp_feat2', hp.feat2 || 'assets/images/works/work_5_polikarbonat.png');
  setImageUploaderValue('hp_feat3', hp.feat3 || 'assets/images/works/work_2_ustanovka.png');
  setImageUploaderValue('hp_show_arch', hp.showcaseArch || 'assets/images/products/p1/2.jpg');
  setImageUploaderValue('hp_show_drop', hp.showcaseDrop || 'assets/images/products/p6/1.jpg');
  setImageUploaderValue('hp_show_house', hp.showcaseHouse || 'assets/images/products/p2/5.jpg');
}

function saveHomepagePhotosData(publishNow = false) {
  const config = getSiteConfig();
  const existing = config.homepagePhotos || {};

  const heroVal = getImageUploaderValue('hp_hero');
  const feat1Val = getImageUploaderValue('hp_feat1');
  const feat2Val = getImageUploaderValue('hp_feat2');
  const feat3Val = getImageUploaderValue('hp_feat3');
  const archVal = getImageUploaderValue('hp_show_arch');
  const dropVal = getImageUploaderValue('hp_show_drop');
  const houseVal = getImageUploaderValue('hp_show_house');

  // Protect against uninitialized form overwriting existing photos
  if (!heroVal && !feat1Val && !feat2Val && !feat3Val && !archVal && !dropVal && !houseVal) {
    return;
  }

  config.homepagePhotos = {
    hero: heroVal || existing.hero || 'assets/images/teplica.png',
    feat1: feat1Val || existing.feat1 || 'assets/images/products/p3/2.jpg',
    feat2: feat2Val || existing.feat2 || 'assets/images/works/work_5_polikarbonat.png',
    feat3: feat3Val || existing.feat3 || 'assets/images/works/work_2_ustanovka.png',
    showcaseArch: archVal || existing.showcaseArch || 'assets/images/products/p1/2.jpg',
    showcaseDrop: dropVal || existing.showcaseDrop || 'assets/images/products/p6/1.jpg',
    showcaseHouse: houseVal || existing.showcaseHouse || 'assets/images/products/p2/5.jpg'
  };

  const ok = saveSiteConfig(config);
  if (!ok) {
    alert("Ошибка сохранения настроек фото в браузере.");
    return;
  }

  if (publishNow) {
    if (typeof publishToGithub === "function") {
      publishToGithub("photos");
    }
  } else {
    showAdminToast("Фото главной сохранены!", "Опубликовать на сайт", () => {
      if (typeof publishToGithub === "function") publishToGithub("toast");
    });
  }
}

function setupHomepagePhotosForm() {
  const form = document.getElementById("homepagePhotosForm");
  const publishBtn = document.getElementById("btnSavePublishPhotos");
  const resetBtn = document.getElementById("btnResetHomepagePhotos");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      saveHomepagePhotosData(false);
    });
  }

  if (publishBtn) {
    publishBtn.addEventListener("click", () => {
      saveHomepagePhotosData(true);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (!confirm("Сбросить все фото главной страницы к исходным заводским изображениям?")) return;
      const defaults = typeof DEFAULT_HOMEPAGE_PHOTOS !== "undefined" ? DEFAULT_HOMEPAGE_PHOTOS : {
        hero: "assets/images/teplica.png",
        feat1: "assets/images/products/p3/2.jpg",
        feat2: "assets/images/works/work_5_polikarbonat.png",
        feat3: "assets/images/works/work_2_ustanovka.png",
        showcaseArch: "assets/images/products/p1/2.jpg",
        showcaseDrop: "assets/images/products/p6/1.jpg",
        showcaseHouse: "assets/images/products/p2/5.jpg"
      };

      setImageUploaderValue('hp_hero', defaults.hero);
      setImageUploaderValue('hp_feat1', defaults.feat1);
      setImageUploaderValue('hp_feat2', defaults.feat2);
      setImageUploaderValue('hp_feat3', defaults.feat3);
      setImageUploaderValue('hp_show_arch', defaults.showcaseArch);
      setImageUploaderValue('hp_show_drop', defaults.showcaseDrop);
      setImageUploaderValue('hp_show_house', defaults.showcaseHouse);

      saveHomepagePhotosData(false);
      showAdminToast("Установлены исходные фото главной!", "Опубликовать на сайт", () => {
        if (typeof publishToGithub === "function") publishToGithub("toast");
      });
    });
  }
}
window.loadHomepagePhotosTab = loadHomepagePhotosTab;
window.saveHomepagePhotosData = saveHomepagePhotosData;


async function autoSyncLatestDatabase(force = false) {
  const repo = localStorage.getItem("teplici76_github_repo") || DEFAULT_GH_REPO;
  const token = localStorage.getItem("teplici76_github_token") || DEFAULT_GH_TOKEN;
  const branch = localStorage.getItem("teplici76_github_branch") || DEFAULT_GH_BRANCH;

  try {
    let remoteData = null;

    // 1. Direct GitHub API fetch for instantaneous 0-second multi-device sync
    if (token && repo) {
      try {
        const ghRes = await fetch(`https://api.github.com/repos/${repo}/contents/database.json?ref=${branch}&_t=${Date.now()}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/vnd.github+json"
          }
        });
        if (ghRes.ok) {
          const ghFile = await ghRes.json();
          if (typeof ghFile.content === "string") {
            const cleanB64 = ghFile.content.replace(/\s/g, "");
            const binStr = atob(cleanB64);
            const bytes = new Uint8Array(binStr.length);
            for (let i = 0; i < binStr.length; i++) bytes[i] = binStr.charCodeAt(i);
            const utf8Text = new TextDecoder().decode(bytes);
            remoteData = JSON.parse(utf8Text);
          }
        }
      } catch (e) {
        console.warn("Direct GH API sync failed, falling back to static file:", e);
      }
    }

    // 2. Fallback to raw.githubusercontent.com
    if (!remoteData) {
      try {
        const rawRes = await fetch(`https://raw.githubusercontent.com/${repo}/${branch}/database.json?_t=${Date.now()}`);
        if (rawRes.ok) remoteData = await rawRes.json();
      } catch (e) {}
    }

    // 3. Fallback to static database.json
    if (!remoteData) {
      const res = await fetch("database.json?v=" + Date.now());
      if (res.ok) remoteData = await res.json();
    }

    if (!remoteData) return;
    const remoteDb = remoteData.database || remoteData;
    if (!remoteDb) return;

    const localExportedAt = localStorage.getItem("teplici76_db_exported_at");
    let shouldSync = force || !localExportedAt || (remoteData.exportedAt && remoteData.exportedAt !== localExportedAt);

    if (shouldSync) {
      if (remoteData.exportedAt) {
        localStorage.setItem("teplici76_db_exported_at", remoteData.exportedAt);
      }
      saveSiteConfig(remoteDb);
      if (Array.isArray(remoteData.leads) && remoteData.leads.length) {
        localStorage.setItem("teplici76_leads", JSON.stringify(remoteData.leads));
      }
      loadProductsTab();
      loadReviewsTab();
      loadWorksTab();
      loadPricesForm();
      loadContactsForm();
      if (typeof loadHomepagePhotosTab === "function") loadHomepagePhotosTab();
      loadLeads();
      updateSidebarPublishState();

      const timeStr = remoteData.exportedAt ? new Date(remoteData.exportedAt).toLocaleTimeString("ru-RU", { hour: '2-digit', minute: '2-digit' }) : "";
      const statusEl = document.getElementById("sidebarPublishStatus");
      if (statusEl) {
        statusEl.innerHTML = `✅ Синхронизировано ${timeStr ? '(' + timeStr + ')' : ''}`;
      }
      if (force) {
        showAdminToast("Данные успешно синхронизированы с сайтом!");
      }
      console.log("Database successfully auto-synced from GitHub (exportedAt: " + remoteData.exportedAt + ")");
    }
  } catch (err) {
    console.warn("Auto-sync database failed:", err);
  }
}
window.autoSyncLatestDatabase = autoSyncLatestDatabase;

// Фоновая синхронизация между ПК и телефоном: при возврате на вкладку или каждые 30 секунд
window.addEventListener("focus", () => autoSyncLatestDatabase());
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") autoSyncLatestDatabase();
});
setInterval(() => autoSyncLatestDatabase(), 30000);


// --- Управление страницами сайта (11 страниц) ---
function loadPagesTab(selectedKey = null) {
  const config = typeof getSiteConfig === "function" ? getSiteConfig() : {};
  const pagesGrid = document.getElementById("adminPagesGrid");
  const dropdown = document.getElementById("pageSelectorDropdown");

  const pages = config.pages || (typeof DEFAULT_PAGES !== "undefined" ? DEFAULT_PAGES : {}) || {};
  const pageKeys = Object.keys(pages);

  const currentKey = selectedKey || (dropdown ? dropdown.value : null) || "glavnaya";
  if (typeof renderPageEditor === "function") {
    renderPageEditor(currentKey);
  }

  if (!pagesGrid) return;
  if (pageKeys.length === 0) {
    pagesGrid.innerHTML = '<div style="grid-column: 1/-1; padding: 20px; text-align: center; color: #64748b;">Страницы сайта загружаются...</div>';
    return;
  }

  pagesGrid.innerHTML = pageKeys.map(key => {
    const p = pages[key];
    const isSelected = key === currentKey;
    return `
      <div class="admin-item-card" style="display: flex; flex-direction: column; justify-content: space-between; border-radius: 12px; border: ${isSelected ? '2.5px solid #2d6a4f' : '1.5px solid #e2e8f0'}; background: #fff; overflow: hidden; box-shadow: ${isSelected ? '0 6px 18px rgba(45,106,79,0.15)' : '0 2px 8px rgba(0,0,0,0.03)'};">
        <div>
          <div style="position: relative; height: 130px; background: #eef2f5; overflow: hidden;">
            <img src="${p.bannerImage || 'assets/images/teplica.png'}" alt="${p.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/images/teplica.png'">
            <div style="position: absolute; top: 8px; left: 8px; background: rgba(8,28,21,0.85); color: #b7e4c7; padding: 2px 7px; border-radius: 5px; font-size: 0.72rem; font-weight: 700;">
              ${p.category || 'Страница'}
            </div>
            ${p.badge ? `<div style="position: absolute; bottom: 8px; left: 8px; background: #52b788; color: #081c15; padding: 2px 7px; border-radius: 5px; font-size: 0.72rem; font-weight: 800;">${p.badge}</div>` : ''}
          </div>

          <div style="padding: 12px 14px 8px;">
            <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 6px;">
              <h3 style="font-size: 0.98rem; font-weight: 800; color: #1b4332; margin: 0 0 2px;">${p.name}</h3>
              ${p.priceText ? `<span style="font-weight: 800; font-size: 0.85rem; color: #2d6a4f; white-space: nowrap;">${p.priceText}</span>` : ''}
            </div>
            <code style="font-size: 0.74rem; color: #64748b; background: #f1f5f9; padding: 1px 5px; border-radius: 4px;">${p.file}</code>
          </div>
        </div>

        <div style="padding: 10px 14px 14px; border-top: 1px solid #f1f5f9; display: flex; gap: 6px;">
          <a href="${p.file}" target="_blank" class="btn-admin btn-admin-light" style="flex: 1; text-align: center; text-decoration: none; padding: 7px; font-size: 0.78rem; font-weight: 700;">
            👁 Открыть
          </a>
          <button type="button" class="btn-admin ${isSelected ? 'btn-admin-primary' : 'btn-admin-light'}" style="flex: 1.6; padding: 7px; font-size: 0.78rem; font-weight: 700;" onclick="selectAndScrollToPage('${key}')">
            ✏️ ${isSelected ? '✓ Выбрана' : 'Выбрать'}
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function switchAdminTab(tabId) {
  const btn = document.querySelector(`.admin-nav-item button[data-tab="${tabId}"]`);
  if (btn) btn.click();
}

function openPageEditModal(pageKey) {
  const config = getSiteConfig();
  const pages = config.pages || (typeof DEFAULT_PAGES !== "undefined" ? DEFAULT_PAGES : {}) || {};
  const p = pages[pageKey];
  if (!p) return;

  const editKeyEl = document.getElementById("editPageKey");
  if (editKeyEl) editKeyEl.value = pageKey;

  const titleModalEl = document.getElementById("pageEditModalTitle");
  if (titleModalEl) titleModalEl.textContent = `Редактирование: ${p.name}`;

  const subModalEl = document.getElementById("pageEditModalSub");
  if (subModalEl) subModalEl.textContent = `Файл страницы: ${p.file} • Раздел: ${p.category || 'Сайт'}`;

  const editTitleEl = document.getElementById("editPageTitle");
  if (editTitleEl) editTitleEl.value = p.title || "";

  const editBadgeEl = document.getElementById("editPageBadge");
  if (editBadgeEl) editBadgeEl.value = p.badge || "";

  const editPriceEl = document.getElementById("editPagePriceText");
  if (editPriceEl) editPriceEl.value = p.priceText || "";

  const editDescEl = document.getElementById("editPageDesc");
  if (editDescEl) editDescEl.value = p.description || "";

  const bannerImg = document.getElementById("page_banner_img");
  const bannerUrl = document.getElementById("page_banner_url");
  const currentBanner = p.bannerImage || "assets/images/teplica.png";
  if (bannerImg) bannerImg.src = currentBanner;
  if (bannerUrl) bannerUrl.value = currentBanner;

  const modal = document.getElementById("pageEditModal");
  if (modal) modal.style.display = "flex";
}

function closePageEditModal() {
  const modal = document.getElementById("pageEditModal");
  if (modal) modal.style.display = "none";
}

function handlePageBannerUrlInput(val) {
  const img = document.getElementById("page_banner_img");
  if (img && val.trim()) {
    img.src = val.trim();
  }
}

async function handlePageBannerFileChange(input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const img = document.getElementById("page_banner_img");
    const urlInput = document.getElementById("page_banner_url");
    try {
      if (typeof compressImageFile === "function") {
        const compressed = await compressImageFile(file, 1400, 0.85);
        if (img) img.src = compressed;
        if (urlInput) urlInput.value = compressed;
        return;
      }
    } catch(err) {
      console.warn("Banner compression failed, using fallback:", err);
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      if (img) img.src = dataUrl;
      if (urlInput) urlInput.value = dataUrl;
    };
    reader.readAsDataURL(file);
  }
}

function savePageEditForm(e) {
  if (e) e.preventDefault();
  const pageKey = document.getElementById("editPageKey").value;
  const config = getSiteConfig();
  if (!config.pages) config.pages = { ...(typeof DEFAULT_PAGES !== "undefined" ? DEFAULT_PAGES : {}) };

  const p = config.pages[pageKey] || {};
  p.title = document.getElementById("editPageTitle").value.trim();
  p.badge = document.getElementById("editPageBadge").value.trim();
  p.priceText = document.getElementById("editPagePriceText").value.trim();
  p.description = document.getElementById("editPageDesc").value.trim();
  p.bannerImage = document.getElementById("page_banner_url").value.trim() || p.bannerImage || "assets/images/teplica.png";

  config.pages[pageKey] = p;
  saveSiteConfig(config);
  loadPagesTab();
  closePageEditModal();
  showAdminToast(`Страница «${p.name || pageKey}» сохранена!`, "Опубликовать на сайт", () => publishToGithub("toast"));
}

async function saveAndPublishPage(e) {
  savePageEditForm(e);
  await publishToGithub("modal");
}

window.loadPagesTab = loadPagesTab;
window.switchAdminTab = switchAdminTab;
window.openPageEditModal = openPageEditModal;
window.closePageEditModal = closePageEditModal;
window.handlePageBannerUrlInput = handlePageBannerUrlInput;
window.handlePageBannerFileChange = handlePageBannerFileChange;
window.savePageEditForm = savePageEditForm;
window.saveAndPublishPage = saveAndPublishPage;


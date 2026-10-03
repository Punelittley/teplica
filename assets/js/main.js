/**
 * Теплицы 76 — Основной скрипт интерактивности и калькулятора
 */

document.addEventListener("DOMContentLoaded", () => {
  const config = getSiteConfig();

  // 1. Применение настроек контактов
  applyCompanyContacts(config);

  // 2. Управление размером шрифта (для слабовидящих садоводов)
  setupFontSizeToggle();

  // 3. Мобильное меню
  setupMobileNav();

  // 4. Модальные окна
  setupModals();

  // 5. Интерактивный калькулятор
  setupCalculator(config);

  // 6. Обработка всех форм заявок
  setupForms(config);

  // 7. Плавные анимации при скролле
  initScrollAnimations();

  // 8. Слайдер готовых проектов
  setupModelsSlider();

  // 9. Счетчик "Успей к сезону"
  setupSeasonCountdown();

  // 10. Счетчик промо-акции со скидкой 20%
  setupCalcPromoCountdown();

  // 11. Умный FAQ чат-бот консультант
  setupFaqChatbot();

  // 12. Интерактивный витринный блок категорий и услуг
  initTabbedShowcase();

  // 13. Динамическая гидратация контента из БД (товары, отзывы, работы)
  renderDatabaseContent(config);

  // 14. Автоматическая подгрузка свежей базы database.json с GitHub Pages
  fetch("database.json?v=" + Date.now())
    .then(res => {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(data => {
      const db = data.database || data;
      if (db && (db.products || db.company || db.pricing)) {
        applyCompanyContacts(db);
        renderDatabaseContent(db);
      }
    })
    .catch(() => {
      // Работаем на встроенной/локальной конфигурации
    });

  // Слушатель событий обновления базы данных
  window.addEventListener("teplica:data-updated", (e) => {
    const updated = e.detail || getSiteConfig();
    applyCompanyContacts(updated);
    renderDatabaseContent(updated);
  });
});

// Обновление контактов в DOM
function applyCompanyContacts(config) {
  if (!config || !config.company) return;
  const phoneEls = document.querySelectorAll(".js-phone-text");
  phoneEls.forEach(el => el.textContent = config.company.phone);

  const phoneLinks = document.querySelectorAll(".js-phone-link");
  phoneLinks.forEach(el => el.href = `tel:${config.company.phoneRaw}`);

  const addrEls = document.querySelectorAll(".js-address-text");
  addrEls.forEach(el => el.textContent = config.company.address);

  const hoursEls = document.querySelectorAll(".js-hours-text");
  hoursEls.forEach(el => el.textContent = config.company.workHours);

  const promoEl = document.querySelector(".js-promo-text");
  if (promoEl && config.company.promoText) {
    promoEl.textContent = config.company.promoText;
  }
}

// Динамическое отображение данных из БД на всех страницах сайта
function renderDatabaseContent(config) {
  if (!config) return;

  // 1. Отзывы на странице otzyvy.html
  const testimonialsGrid = document.querySelector(".testimonials-cards-grid");
  if (testimonialsGrid && Array.isArray(config.reviews) && config.reviews.length) {
    const validReviews = config.reviews.filter(r => r.name && r.name.toLowerCase() !== "asd" && r.text && r.text.length > 5);
    testimonialsGrid.innerHTML = validReviews.map(rev => `
      <div class="testimonial-card ${rev.featured ? 'testimonial-card-featured' : ''}">
        <div class="testimonial-stars">${'★'.repeat(rev.stars || 5)}${'☆'.repeat(5 - (rev.stars || 5))}</div>
        <div class="testimonial-name">${rev.name}</div>
        <div class="testimonial-role">${rev.role || ''}</div>
        <div class="testimonial-quote-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
          </svg>
        </div>
        <p class="testimonial-body">${rev.text}</p>
      </div>
    `).join("");
  }

  // 2. Отзывы на главной странице index.html
  const indexReviewsGrid = document.querySelector(".reviews-grid");
  if (indexReviewsGrid && Array.isArray(config.reviews) && config.reviews.length) {
    const validReviews = config.reviews.filter(r => r.name && r.name.toLowerCase() !== "asd" && r.text && r.text.length > 5);
    const topReviews = validReviews.slice(0, 3);
    if (topReviews.length > 0) {
      indexReviewsGrid.innerHTML = topReviews.map((r, idx) => `
        <div class="review-item aos-animate" data-aos="fade-up" data-aos-delay="${(idx + 1) * 80}">
          <div class="review-item-stars">${'★'.repeat(r.stars || 5)}${'☆'.repeat(5 - (r.stars || 5))}</div>
          <p class="review-item-text">«${r.text}»</p>
          <div class="review-item-author">
            <div>
              <div class="review-item-name">${r.name}</div>
              <div class="review-item-city">${r.role || ''}</div>
            </div>
          </div>
        </div>
      `).join("");
    }
  }

  // 3. Наши работы на странице nashi-raboty.html
  const worksGrid = document.getElementById("worksGrid");
  if (worksGrid && Array.isArray(config.works) && config.works.length) {
    worksGrid.innerHTML = config.works.map(w => `
      <div class="works-item" data-category="${w.category || 'arch'}" data-src="${w.image}" data-title="${w.title}">
        <img src="${w.image}" alt="${w.title}" loading="lazy" onerror="this.src='assets/images/products/p1/2.jpg'">
      </div>
    `).join("");
  }

  // 4. Товары на страницах каталога (arochnye.html, kaplevidnye.html)
  const catalogGrid = document.querySelector(".catalog-grid");
  if (catalogGrid && Array.isArray(config.products) && config.products.length) {
    const isDrop = window.location.pathname.includes("kaplevidnye");
    const filtered = isDrop
      ? config.products.filter(p => p.category === "drop" || p.category === "poly" || p.category === "beds" || p.category === "other")
      : config.products.filter(p => p.category === "arch" || p.category === "poly" || p.category === "beds" || p.category === "other");

    if (filtered.length) {
      catalogGrid.innerHTML = filtered.map(prod => `
        <div class="cat-card js-product-card" data-product-id="${prod.id}">
          <img src="${prod.image}" alt="${prod.name}" class="cat-card-img" onerror="this.src='assets/images/products/p1/1.jpg'">
          ${prod.badge ? `<span class="cat-card-badge badge-${prod.badgeType || 'hit'}">${prod.badge}</span>` : ''}
          <div class="cat-card-dot" style="background:#52b788;"></div>
          <div class="cat-card-body">
            <div class="cat-card-info">
              <div class="cat-card-name">${prod.name}</div>
              <div class="cat-card-size">${prod.price ? 'от ' + prod.price.toLocaleString('ru-RU') + ' ₽' : ''} ${prod.size ? '• ' + prod.size : ''}</div>
            </div>
            <button class="cat-card-order-btn" title="Посмотреть фото и описание" aria-label="Подробнее">👁</button>
          </div>
        </div>
      `).join("");
    }
  }

  // Обновляем наблюдение за скролл-анимациями для новых элементов
  initScrollAnimations();
}

// Переключатель крупного шрифта
function setupFontSizeToggle() {
  const btn = document.getElementById("fontSizeToggleBtn");
  if (!btn) return;

  const searchIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>`;
  const isLarge = localStorage.getItem("teplici76_font_large") === "true";
  if (isLarge) {
    document.body.classList.add("font-large");
    btn.innerHTML = `${searchIcon} Обычный шрифт`;
  }

  btn.addEventListener("click", () => {
    const active = document.body.classList.toggle("font-large");
    localStorage.setItem("teplici76_font_large", active ? "true" : "false");
    btn.innerHTML = active ? `${searchIcon} Обычный шрифт` : `${searchIcon} Крупный шрифт`;
  });
}

// Мобильное меню
function setupMobileNav() {
  const toggleBtn = document.getElementById("mobileMenuBtn");
  const nav = document.getElementById("siteNav");
  if (!toggleBtn || !nav) return;

  toggleBtn.addEventListener("click", () => {
    nav.classList.toggle("mobile-open");
    toggleBtn.textContent = nav.classList.contains("mobile-open") ? "✕" : "☰";
  });
}

// Модальные окна
function setupModals() {
  const modalOverlay = document.getElementById("modalOverlay");
  const modalTitle = document.getElementById("modalTitle");
  const modalSubtitle = document.getElementById("modalSubtitle");
  const modalSubject = document.getElementById("modalSubject");
  const closeBtn = document.getElementById("modalCloseBtn");

  function openModal(title, subtitle, subject) {
    if (!modalOverlay) return;
    if (modalTitle) modalTitle.textContent = title || "Заказ консультации";
    if (modalSubtitle) modalSubtitle.textContent = subtitle || "Оставьте номер, мастер перезвонит в течение 10 минут";
    if (modalSubject) modalSubject.value = subject || "Общая заявка";
    modalOverlay.classList.add("active");
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove("active");
  }

  document.querySelectorAll("[data-open-modal]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const subject = btn.getAttribute("data-subject") || "Заявка с сайта";
      const title = btn.getAttribute("data-title") || "Заказать звонок мастера";
      const subtitle = btn.getAttribute("data-subtitle") || "Специалист подробно ответит на все вопросы";
      openModal(title, subtitle, subject);
    });
  });

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }
}

// Калькулятор теплиц
function setupCalculator(config) {
  const calcRoot = document.getElementById("greenhouseCalculator");
  if (!calcRoot) return;

  const state = {
    type: "arch",
    length: "6m",
    step: "100",
    poly: "eco4",
    timber: false,
    assembly: true
  };

  const typeBtns = calcRoot.querySelectorAll("[data-calc-type]");
  const lengthBtns = calcRoot.querySelectorAll("[data-calc-length]");
  const stepBtns = calcRoot.querySelectorAll("[data-calc-step]");
  const polyBtns = calcRoot.querySelectorAll("[data-calc-poly]");
  const timberCheckbox = document.getElementById("calcOptionTimber");
  const assemblyCheckbox = document.getElementById("calcOptionAssembly");

  const sumTotalEl = document.getElementById("calcSumTotal");
  const sumOldEl = document.getElementById("calcSumOld");
  const breakdownTypeEl = document.getElementById("calcBreakdownType");
  const breakdownSizeEl = document.getElementById("calcBreakdownSize");
  const breakdownStepEl = document.getElementById("calcBreakdownStep");
  const breakdownPolyEl = document.getElementById("calcBreakdownPoly");
  const breakdownExtraEl = document.getElementById("calcBreakdownExtra");
  const submitBtn = document.getElementById("calcSubmitBtn");

  function update() {
    const p = config.pricing;
    const typePricing = p[state.type] || p.arch;
    const baseItem = typePricing[state.length] || typePricing["6m"];

    let total = baseItem.price;
    let oldTotal = baseItem.oldPrice;

    // Шаг дуг
    const stepCost = p.step[state.step] ? p.step[state.step].price : 0;
    total += stepCost;
    oldTotal += stepCost;

    // Поликарбонат
    const polyCost = p.poly[state.poly] ? p.poly[state.poly].price : 0;
    total += polyCost;
    oldTotal += polyCost;

    // Брус
    let timberCost = 0;
    if (state.timber) {
      timberCost = p.foundation[`timber${state.length.replace('m','')}`]?.price || 4900;
      total += timberCost;
      oldTotal += timberCost;
    }

    // Сборка
    let assemblyCost = 0;
    if (state.assembly) {
      assemblyCost = p.assembly[state.length] ? p.assembly[state.length].price : 5000;
      total += assemblyCost;
      oldTotal += assemblyCost;
    }

    // Отображение
    if (sumTotalEl) sumTotalEl.textContent = `${total.toLocaleString("ru-RU")} ₽`;
    if (sumOldEl) sumOldEl.textContent = `${oldTotal.toLocaleString("ru-RU")} ₽`;

    if (breakdownTypeEl) {
      breakdownTypeEl.textContent = state.type === "arch" ? "Арочная теплица" : "Каплевидная теплица";
    }
    if (breakdownSizeEl) {
      breakdownSizeEl.textContent = baseItem.name;
    }
    if (breakdownStepEl) {
      breakdownStepEl.textContent = state.step === "100" ? "Шаг 1 метр" : "Шаг 0.65 м (усиленный)";
    }
    if (breakdownPolyEl) {
      breakdownPolyEl.textContent = p.poly[state.poly]?.name || "4 мм с УФ-защитой";
    }
    if (breakdownExtraEl) {
      const extras = [];
      if (state.timber) extras.push(`Брус (${timberCost} ₽)`);
      if (state.assembly) extras.push(`Сборка (${assemblyCost} ₽)`);
      breakdownExtraEl.textContent = extras.length ? extras.join(" + ") : "Без доп. услуг";
    }

    if (submitBtn) {
      const desc = `${state.type === "arch" ? "Арочная" : "Каплевидная"} ${baseItem.name}, поликарбонат ${p.poly[state.poly]?.name}, брус: ${state.timber ? 'Да' : 'Нет'}, сборка: ${state.assembly ? 'Да' : 'Нет'}. Итого: ${total} руб`;
      submitBtn.setAttribute("data-subject", `Расчет: ${desc}`);
    }
  }

  function setupBtnGroup(buttons, stateKey) {
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state[stateKey] = btn.getAttribute(`data-calc-${stateKey}`);
        update();
      });
    });
  }

  setupBtnGroup(typeBtns, "type");
  setupBtnGroup(lengthBtns, "length");
  setupBtnGroup(stepBtns, "step");
  setupBtnGroup(polyBtns, "poly");

  if (timberCheckbox) {
    timberCheckbox.addEventListener("change", (e) => {
      state.timber = e.target.checked;
      update();
    });
  }

  if (assemblyCheckbox) {
    assemblyCheckbox.addEventListener("change", (e) => {
      state.assembly = e.target.checked;
      update();
    });
  }

  update();
}

// Отправка форм (localStorage + опционально Telegram)
function setupForms(config) {
  document.querySelectorAll(".js-lead-form").forEach(form => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector("button[type='submit']");
      const originalText = submitBtn ? submitBtn.innerText : "Отправить";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = "Отправка...";
      }

      const formData = new FormData(form);
      const lead = {
        id: "lead_" + Date.now(),
        date: new Date().toLocaleString("ru-RU"),
        name: formData.get("name") || "Не указано",
        phone: formData.get("phone") || "",
        comment: formData.get("comment") || "",
        subject: formData.get("subject") || "Заявка с сайта",
        status: "new"
      };

      // Сохраняем в локальное хранилище
      saveLeadToStorage(lead);

      // Если настроен VK Bot сообщества (https://vk.ru/club241898656)
      const vkCfg = config.vkNotify || (typeof DEFAULT_CONFIG !== "undefined" ? DEFAULT_CONFIG.vkNotify : null);
      if (vkCfg && vkCfg.enabled !== false && (vkCfg.groupToken || (DEFAULT_CONFIG && DEFAULT_CONFIG.vkNotify && DEFAULT_CONFIG.vkNotify.groupToken))) {
        sendVkLeadNotification(vkCfg, lead);
      }

      // Если настроен Telegram Bot
      if (config.telegramNotify && config.telegramNotify.enabled && config.telegramNotify.botToken && config.telegramNotify.chatId) {
        try {
          const text = `🌱 *Новая заявка с сайта Теплицы 76*!\n` +
                       `👤 *Имя*: ${lead.name}\n` +
                       `📞 *Телефон*: ${lead.phone}\n` +
                       `📝 *Тема*: ${lead.subject}\n` +
                       `💬 *Комментарий*: ${lead.comment || 'нет'}\n` +
                       `⏰ *Дата*: ${lead.date}`;
          await fetch(`https://api.telegram.org/bot${config.telegramNotify.botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: config.telegramNotify.chatId,
              text: text,
              parse_mode: "Markdown"
            })
          });
        } catch (err) {
          console.warn("Telegram send failed", err);
        }
      }

      // Закрываем модалку если есть
      const modalOverlay = document.getElementById("modalOverlay");
      if (modalOverlay) modalOverlay.classList.remove("active");

      // Показываем уведомление
      showToast("Спасибо за доверие! Мы свяжемся с вами в течение 10 минут.");
      form.reset();

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = originalText;
      }
    });
  });
}

function saveLeadToStorage(lead) {
  try {
    const raw = localStorage.getItem("teplici76_leads");
    const leads = raw ? JSON.parse(raw) : [];
    leads.unshift(lead);
    localStorage.setItem("teplici76_leads", JSON.stringify(leads));
  } catch (e) {
    console.error("Storage error", e);
  }
}

// Отправка заявки в ЛС ВКонтакте через API группы (https://vk.ru/club241898656)
function sendVkLeadNotification(vkConfig, lead) {
  try {
    let ids = [];
    if (Array.isArray(vkConfig.userIds)) {
      ids = vkConfig.userIds;
    } else if (vkConfig.userIds) {
      ids = String(vkConfig.userIds).split(/[\s,;]+/).filter(Boolean);
    } else if (vkConfig.userId) {
      ids = String(vkConfig.userId).split(/[\s,;]+/).filter(Boolean);
    }
    // Фолбек на ID по умолчанию, если список пуст
    if (!ids.length && typeof DEFAULT_CONFIG !== "undefined" && DEFAULT_CONFIG.vkNotify && DEFAULT_CONFIG.vkNotify.userId) {
      ids = [DEFAULT_CONFIG.vkNotify.userId];
    }
    ids = Array.from(new Set(ids.map(id => String(id).trim()).filter(Boolean)));

    if (!ids.length) return;

    const token = vkConfig.groupToken || (typeof DEFAULT_CONFIG !== "undefined" && DEFAULT_CONFIG.vkNotify ? DEFAULT_CONFIG.vkNotify.groupToken : "");
    if (!token) return;

    const text = encodeURIComponent(
      `🌱 Новая заявка с сайта «Теплицы ТУТ»!\n` +
      `👤 Имя: ${lead.name}\n` +
      `📞 Телефон: ${lead.phone}\n` +
      `📝 Тема: ${lead.subject}\n` +
      `💬 Детали: ${lead.comment || 'нет'}\n` +
      `⏰ Дата: ${lead.date}`
    );

    console.log(`[VK Notify] Отправка заявки ${ids.length} получателям:`, ids);

    ids.forEach((uid, idx) => {
      setTimeout(() => {
        const randomId = Math.floor(Math.random() * 100000000);
        const cbName = `vkLeadCb_${Date.now()}_${randomId}`;
        const apiUrl = `https://api.vk.com/method/messages.send?user_id=${encodeURIComponent(uid)}&message=${text}&random_id=${randomId}&v=5.131&access_token=${encodeURIComponent(token)}`;
        const script = document.createElement("script");
        script.src = `${apiUrl}&callback=${cbName}`;

        window[cbName] = function(res) {
          if (res && res.error) {
            console.warn(`[VK Notify] Ошибка VK для ${uid}:`, res.error);
          } else {
            console.log(`[VK Notify] Успешно доставлено в ВК пользователю ${uid}:`, res);
          }
          script.remove();
          delete window[cbName];
        };

        // Фолбек при блокировке AdBlock'ом
        script.onerror = function() {
          console.warn(`[VK Notify] Скрипт заблокирован браузером/AdBlock для ${uid}. Пробуем альтернативный fetch...`);
          try {
            fetch(apiUrl, { mode: "no-cors", keepalive: true }).catch(() => {});
          } catch (e) {}
          if (window[cbName]) delete window[cbName];
          script.remove();
        };

        setTimeout(() => {
          if (window[cbName]) {
            delete window[cbName];
            script.remove();
          }
        }, 10000);

        document.head.appendChild(script);
      }, idx * 300);
    });
  } catch (err) {
    console.warn("[VK Notify] Исключение отправки:", err);
  }
}

function showToast(message) {
  let toast = document.getElementById("siteToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "siteToast";
    toast.className = "toast-msg";
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>✓</span> <span>${message}</span>`;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 4500);
}

// Плавные анимации появления при скроллинге
function initScrollAnimations() {
  if (!("IntersectionObserver" in window)) {
    // Фолбек для старых браузеров
    document.querySelectorAll("[data-aos]").forEach(el => el.classList.add("aos-animate"));
    return;
  }

  if (!window._teplicaAosObserver) {
    window._teplicaAosObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("aos-animate");
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: "0px 0px -20px 0px"
    });
  }

  document.querySelectorAll("[data-aos]:not(.aos-animate)").forEach(el => {
    window._teplicaAosObserver.observe(el);
  });
}

// Слайдер проектов
function setupModelsSlider() {
  const prevBtn = document.getElementById("modelsPrevBtn");
  const nextBtn = document.getElementById("modelsNextBtn");
  const track = document.getElementById("modelsTrack");
  if (!prevBtn || !nextBtn || !track) return;

  nextBtn.addEventListener("click", () => {
    track.scrollBy({ left: 372, behavior: "smooth" });
  });

  prevBtn.addEventListener("click", () => {
    track.scrollBy({ left: -372, behavior: "smooth" });
  });
}

// 9. Счетчик "Успей к сезону"
function setupSeasonCountdown() {
  const daysEl = document.getElementById("seasonDays");
  const hoursEl = document.getElementById("seasonHours");
  const minEl = document.getElementById("seasonMinutes");
  const secEl = document.getElementById("seasonSeconds");
  if (!daysEl || !hoursEl || !minEl || !secEl) return;

  function updateTimer() {
    const now = new Date();
    // Реалистичный скользящий цикл бронирования на фабричную партию (3.5 дня)
    // Всегда дает активный, стимулирующий дедлайн (1-3 дня) вместо нелепых 197 дней
    const cycleMs = 3.5 * 24 * 60 * 60 * 1000;
    const baseEpoch = new Date(now.getFullYear(), 0, 1).getTime();
    const elapsed = (now.getTime() - baseEpoch) % cycleMs;
    const diff = cycleMs - elapsed;

    if (diff <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minEl.textContent = "00";
      secEl.textContent = "00";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minEl.textContent = String(minutes).padStart(2, "0");
    secEl.textContent = String(seconds).padStart(2, "0");
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

// 10. Счетчик промо-акции "Скидка 20% и льготная доставка"
function setupCalcPromoCountdown() {
  const daysEl = document.getElementById("calcPromoDays");
  const hoursEl = document.getElementById("calcPromoHours");
  const minEl = document.getElementById("calcPromoMin");
  const secEl = document.getElementById("calcPromoSec");
  if (!daysEl || !hoursEl || !minEl || !secEl) return;

  function update() {
    const now = new Date();
    // 24-часовой скользящий цикл акции (до конца суток, 00 дней)
    const cycleMs = 24 * 60 * 60 * 1000;
    const baseEpoch = new Date(now.getFullYear(), 0, 1).getTime();
    const elapsed = (now.getTime() - baseEpoch) % cycleMs;
    const diff = cycleMs - elapsed;

    if (diff <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minEl.textContent = "00";
      secEl.textContent = "00";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minEl.textContent = String(minutes).padStart(2, "0");
    secEl.textContent = String(seconds).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}

// 11. Умный FAQ чат-бот консультант
function setupFaqChatbot() {
  let widget = document.getElementById("faqChatWidget");
  if (!widget) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `<!-- Виджет умного чат-бота (FAQ онлайн-помощник) -->
  <div class="faq-chat-widget" id="faqChatWidget">
    
    <!-- Окно чата -->
    <div class="faq-chat-window" id="faqChatWindow" aria-hidden="true">
      <div class="faq-chat-header">
        <div class="faq-chat-header-info">
          <div class="faq-chat-avatar">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="10" rx="2"/>
              <circle cx="12" cy="5" r="2"/>
              <path d="M12 7v4"/>
              <line x1="8" y1="16" x2="8.01" y2="16"/>
              <line x1="16" y1="16" x2="16.01" y2="16"/>
            </svg>
            <span class="faq-chat-status-dot" title="Онлайн"></span>
          </div>
          <div>
            <div class="faq-chat-title">Чат-бот • «Теплицы ТУТ»</div>
            <div class="faq-chat-subtitle">онлайн • отвечает мгновенно</div>
          </div>
        </div>
        <button type="button" class="faq-chat-close-btn" id="faqChatCloseBtn" aria-label="Закрыть чат">✕</button>
      </div>

      <!-- Контейнер сообщений -->
      <div class="faq-chat-body" id="faqChatBody">
        <div class="faq-chat-msg bot">
          <div class="faq-chat-bubble">
            Здравствуйте! Я бот-консультант завода «Теплицы ТУТ». Помогу с выбором модели, расчетом цены и доставкой по области. Чем могу помочь?
          </div>
          <span class="faq-chat-time">только что</span>
        </div>

        <div class="faq-chat-chips-label">Частые вопросы:</div>

        <!-- Быстрые вопросы (чипсы) -->
        <div class="faq-quick-chips" id="faqQuickChips">
          <button type="button" class="faq-chip" data-q="Сколько стоит доставка?">Доставка и тарифы</button>
          <button type="button" class="faq-chip" data-q="Нужна ли предоплата?">0 ₽ предоплаты</button>
          <button type="button" class="faq-chip" data-q="Какой поликарбонат выбрать?">Поликарбонат 4 или 6 мм</button>
          <button type="button" class="faq-chip" data-q="Выдержит ли теплица снег?">Снеговая нагрузка</button>
          <button type="button" class="faq-chip" data-q="Нужен ли фундамент из бруса?">Брус и фундамент</button>
          <button type="button" class="faq-chip" data-q="Сколько длится сборка?">Сборка за 3 часа</button>
          <button type="button" class="faq-chip" data-q="Какие цены на теплицы?">Цены и размеры</button>
          <button type="button" class="faq-chip" data-q="Где находится производство?">Где посмотреть</button>
        </div>
      </div>

      <!-- Строка ввода -->
      <form class="faq-chat-footer" id="faqChatForm">
        <input type="text" id="faqChatInput" class="faq-chat-input" placeholder="Напишите ваш вопрос..." autocomplete="off">
        <button type="submit" class="faq-chat-send-btn" id="faqChatSendBtn" aria-label="Отправить">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </form>
    </div>

    <!-- Плавающая круглая кнопка вызова -->
    <button type="button" class="faq-chat-trigger-btn" id="faqChatTriggerBtn" aria-label="Задать вопрос боту" title="Задать вопрос онлайн">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
      </svg>
      <span class="faq-chat-trigger-badge">1</span>
      <div class="faq-chat-tooltip">Задайте вопрос онлайн</div>
    </button>
  </div>`;
    document.body.appendChild(wrapper.firstElementChild);
    widget = document.getElementById("faqChatWidget");
  }

  const triggerBtn = document.getElementById("faqChatTriggerBtn");
  const chatWindow = document.getElementById("faqChatWindow");
  const closeBtn = document.getElementById("faqChatCloseBtn");
  const chatBody = document.getElementById("faqChatBody");
  const chatForm = document.getElementById("faqChatForm");
  const chatInput = document.getElementById("faqChatInput");
  const chipsContainer = document.getElementById("faqQuickChips");

  if (!widget || !triggerBtn || !chatWindow || !chatForm || !chatInput) return;

  // База знаний бота (вопросы, ключевые слова, ответы и действия)
  const knowledgeBase = [
    {
      keywords: ["доставк", "привез", "тариф", "яросл", "рыбинск", "тутаев", "ростов", "переславл", "углич", "данилов", "гаврилов", "костром", "иванов", "снт", "област", "километр", "км", "куда"],
      answer: "<strong>Доставка собственным спецтранспортом завода:</strong><br>• По Ярославлю и пригороду — от 1 500 ₽<br>• По Ярославской, Ивановской и Костромской областям — от 1 500 до 2 500 ₽.<br>• Привозим прямо до калитки вашего СНТ или участка!<br>• Срок: 1–2 дня или к нужной дате. <strong>0 ₽ предоплаты — расчет при получении!</strong>",
      action: { text: "Подробнее о доставке", link: "dostavka-sborka.html" }
    },
    {
      keywords: ["предоплат", "оплат", "деньг", "расчет", "картой", "наличн", "перевод", "договор", "чек"],
      answer: "<strong>Честные условия без риска:</strong><br>Мы работаем <strong>БЕЗ ПРЕДОПЛАТЫ (0 ₽)</strong>!<br>Вы рассчитываетесь с водителем или бригадой (наличными или переводом) строго по факту выгрузки и проверки всех элементов теплицы.",
    },
    {
      keywords: ["поликарбонат", "толщин", "4мм", "6мм", "4 мм", "6 мм", "уф", "солнц", "град", "желте", "пластик", "sabic", "bayer"],
      answer: "<strong>Какой поликарбонат выбрать:</strong><br>• <strong>4 мм с УФ-защитой (Стандарт / Премиум):</strong> оптимальный выбор для большинства дачных теплиц. Срок службы 10–12 лет, не мутнеет и выдерживает град.<br>• <strong>6 мм (Зимний / Сверхпрочный):</strong> для круглогодичного выращивания и повышенной теплоизоляции (до 15 лет гарантии).<br>Используем только первичное сырье Sabic и Bayer с защитой от выгорания!",
      action: { text: "Каталог поликарбоната", link: "polikarbonat.html" }
    },
    {
      keywords: ["снег", "зим", "нагрузк", "выдерж", "прочност", "слома", "рухнет", "дуг", "труб", "чистит", "подпорк"],
      answer: "<strong>Снеговая нагрузка и прочность:</strong><br>• Каркас из цельной оцинкованной трубы 20×20 или 40×20 мм выдерживает до <strong>180–240 кг/м²</strong> снега.<br>• Шаг дуг 0.65 м (усиленный) исключает провисание поликарбоната.<br>• А <strong>каплевидные теплицы</strong> вообще сбрасывают снег за счет острого конька — подпорки на зиму не требуются!",
      action: { text: "Каплевидные теплицы", link: "kaplevidnye.html" }
    },
    {
      keywords: ["фундамент", "брус", "сва", "грунтозацеп", "основан", "на что ставит", "пропитк", "антисептик"],
      answer: "<strong>Нужен ли фундамент?</strong><br>Мы рекомендуем установку на <strong>пропитанный антисептиком брус 100×100 мм</strong>. Он защищает каркас от влажной земли, выравнивает рельеф и надежно держит теплицу при сильных ветрах. Также возможен монтаж на оцинкованные сваи/грунтозацепы прямо в грунт.",
      action: { text: "Фундамент и монтаж", link: "dostavka-sborka.html#brus" }
    },
    {
      keywords: ["сборк", "монтаж", "собрат", "установк", "бригад", "время", "быстро", "скольк по времени", "мастер"],
      answer: "<strong>Сборка и монтаж:</strong><br>• Сборку производит штатная бригада мастеров с опытом от 5 лет.<br>• Время установки стандартной теплицы под ключ — всего <strong>3–4 часа</strong>!<br>• Оплата работы строго после того, как вы лично проверите открывание дверей и форточек.<br>• Если хотите собрать сами — в комплекте есть понятная инструкция и весь крепеж.",
      action: { text: "Услуги сборки", link: "dostavka-sborka.html#sborka" }
    },
    {
      keywords: ["цен", "стоимост", "прайс", "скольк стоит", "купит", "размер", "3х4", "3х6", "3х8", "3*4", "3*6", "3*8", "4 метр", "6 метр", "8 метр"],
      answer: "<strong>Цены на теплицы от завода:</strong><br>• <strong>3 × 4 м:</strong> от 18 900 ₽<br>• <strong>3 × 6 м:</strong> от 23 900 ₽ (Хит)<br>• <strong>3 × 8 м:</strong> от 28 900 ₽<br>В комплект входят: оцинкованный каркас, 2 двери, 2 форточки, фурнитура и поликарбонат с УФ-защитой.",
      action: { text: "Рассчитать в калькуляторе", link: "#calculator" }
    },
    {
      keywords: ["адрес", "где", "производств", "завод", "площадк", "самовывоз", "телефон", "посмотрет", "приехат", "режим", "работ"],
      answer: "<strong>Контакты и производство:</strong><br>• Ярославль, ул. Промышленная, д. 12.<br>• Телефон: <strong>+7 (4852) 123-45-67</strong><br>• Работаем ежедневно с 8:00 до 20:00 без выходных.<br>На нашей выставочной площадке можно лично потрогать каркас и убедиться в прочности металла!",
      action: { text: "Схема проезда", link: "kontakty.html" }
    },
    {
      keywords: ["скидк", "акци", "пенсионер", "дешевл", "подарок", "хранен"],
      answer: "<strong>Акции и спецпредложения:</strong><br>1. Скидка до 20% к началу сезона!<br>2. Специальная скидка для пенсионеров по удостоверению.<br>3. <strong>Бесплатное хранение</strong> купленной теплицы на сухом складе завода до дня, когда вам удобно её принять.",
      action: { text: "Забронировать по акции", modal: true }
    },
    {
      keywords: ["грядк", "оцинкован", "клумб", "бортик"],
      answer: "<strong>Оцинкованные грядки:</strong><br>Изготавливаем долговечные грядки высотой 20 см с завальцованными безопасными краями. Не ржавеют и служат от 15 лет. Ширина 0.65–1 м, длина от 2 до 8 метров. Идеально подходят в теплицу!",
      action: { text: "Каталог грядок", link: "gryadki.html" }
    },
    {
      keywords: ["привет", "здравствуй", "добрый день", "добрый вечер", "доброе утро"],
      answer: "Здравствуйте! Рад помочь вам. Чем я могу быть полезен? Могу рассказать о ценах на теплицы, поликарбонате, доставке по Ярославской области или помочь с расчетом размера."
    },
    {
      keywords: ["спасибо", "благодар", "отлично", "понятно", "супер", "хорошо"],
      answer: "Всегда пожалуйста! Рад был помочь. Если понадобится консультация инженера или захотите оформить доставку без предоплаты — обращайтесь в любое время!"
    },
    {
      keywords: ["человек", "менеджер", "оператор", "перезвон", "позвон", "связат", "живой", "номер"],
      answer: "Вы можете заказать обратный звонок мастера завода — он перезвонит в течение 10 минут и ответит на все детали!",
      action: { text: "Заказать звонок инженера", modal: true }
    }
  ];

  function toggleChat(open) {
    const isOpen = open !== undefined ? open : !chatWindow.classList.contains("active");
    if (isOpen) {
      chatWindow.classList.add("active");
      chatWindow.setAttribute("aria-hidden", "false");
      const badge = widget.querySelector(".faq-chat-trigger-badge");
      if (badge) badge.style.display = "none";
      const tooltip = widget.querySelector(".faq-chat-tooltip");
      if (tooltip) tooltip.style.display = "none";
      setTimeout(() => chatInput.focus(), 200);
    } else {
      chatWindow.classList.remove("active");
      chatWindow.setAttribute("aria-hidden", "true");
    }
  }

  triggerBtn.addEventListener("click", () => toggleChat());
  closeBtn.addEventListener("click", () => toggleChat(false));

  function appendMessage(text, sender = "bot", action = null) {
    const msgEl = document.createElement("div");
    msgEl.className = `faq-chat-msg ${sender}`;

    const bubbleEl = document.createElement("div");
    bubbleEl.className = "faq-chat-bubble";
    bubbleEl.innerHTML = text;

    msgEl.appendChild(bubbleEl);

    if (action) {
      const actionEl = document.createElement("a");
      actionEl.className = "faq-chat-action-btn";
      actionEl.innerHTML = `${action.text} →`;
      if (action.modal) {
        actionEl.href = "#";
        actionEl.addEventListener("click", (e) => {
          e.preventDefault();
          toggleChat(false);
          const modal = document.querySelector(".modal-overlay");
          if (modal) modal.classList.add("active");
        });
      } else {
        actionEl.href = action.link;
        if (action.link.startsWith("#")) {
          actionEl.addEventListener("click", () => toggleChat(false));
        }
      }
      msgEl.appendChild(actionEl);
    }

    const timeEl = document.createElement("div");
    timeEl.className = "faq-chat-time";
    const now = new Date();
    timeEl.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    msgEl.appendChild(timeEl);

    chatBody.appendChild(msgEl);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function showTypingIndicator() {
    const typingEl = document.createElement("div");
    typingEl.className = "faq-chat-typing";
    typingEl.id = "chatTypingIndicator";
    typingEl.innerHTML = "<span></span><span></span><span></span>";
    chatBody.appendChild(typingEl);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function removeTypingIndicator() {
    const el = document.getElementById("chatTypingIndicator");
    if (el) el.remove();
  }

  function handleUserQuery(query) {
    if (!query || !query.trim()) return;
    const cleanQ = query.trim();
    appendMessage(cleanQ, "user");

    showTypingIndicator();

    setTimeout(() => {
      removeTypingIndicator();
      const qLower = cleanQ.toLowerCase();

      // Поиск наилучшего совпадения по ключевым словам
      let bestMatch = null;
      let maxScore = 0;

      knowledgeBase.forEach(item => {
        let score = 0;
        item.keywords.forEach(kw => {
          if (qLower.includes(kw)) {
            score += kw.length;
          }
        });
        if (score > maxScore) {
          maxScore = score;
          bestMatch = item;
        }
      });

      if (bestMatch && maxScore > 0) {
        appendMessage(bestMatch.answer, "bot", bestMatch.action);
      } else {
        // Ответ при нераспознанном запросе
        appendMessage(
          "Спасибо за вопрос! Чтобы дать точный расчет под особенности вашего участка, я могу передать ваш вопрос нашему старшему мастеру производства. Оставьте номер телефона или позвоните нам прямо сейчас:",
          "bot",
          { text: "Связаться с мастером", modal: true }
        );
      }
    }, 450);
  }

  // Обработка клика по чипсам быстрых вопросов
  if (chipsContainer) {
    chipsContainer.addEventListener("click", (e) => {
      const chip = e.target.closest(".faq-chip");
      if (!chip) return;
      const question = chip.getAttribute("data-q") || chip.textContent;
      handleUserQuery(question);
    });
  }

  // Отправка формы
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = chatInput.value;
    chatInput.value = "";
    handleUserQuery(val);
  });
}

// 12. Интерактивный витринный блок (в стиле верстки пользователя)
function initTabbedShowcase() {
  const DATA = [
    { 
      tab: 'Теплицы', 
      items: [
        ['Арочные теплицы', 'Классическая надежная форма с оцинкованным каркасом 20х20 или 40х20. Выдерживает любые ветровые и снеговые нагрузки.', 'assets/images/2.png'],
        ['Каплевидные теплицы', 'Усиленный стрельчатый свод — снег сходит сам! Увеличенная высота 2.35 м для удобства ухода за высокорослыми томатами.', 'assets/images/mockup_kaplevidnaya.jpg'],
        ['Прямостенные теплицы', 'Максимум полезного объема для посадки вдоль стенок. Удобно ходить в полный рост по всей площади теплицы.', 'assets/images/greenhouse_arch.jpg'],
        ['Мини-парники', 'Компактные оцинкованные конструкции для зелени, перцев и ранней рассады с удобными откидными крышками.', 'assets/images/2kryg.png'] 
      ]
    },
    { 
      tab: 'Грядки и Оборудование', 
      items: [
        ['Оцинкованные грядки', 'Забота о здоровье спины. Высота бортов 15, 20 и 35 см. Безопасные завальцованные края, которые не режут руки.', 'assets/images/4.png'],
        ['Сотовый поликарбонат', 'Первичное сырье 4 мм и 6 мм повышенной плотности. Двойной слой защиты от УФ излучения предотвращает разрушение сотов.', 'assets/images/mockup_polycarb_detail.jpg'],
        ['Автопроветривание и полив', 'Автономные термоприводы открывают форточки при нагреве. Система капельного полива ухаживает за растениями без вас.', 'assets/images/3kryg.png'] 
      ]
    },
    { 
      tab: 'Услуги и Сервис', 
      items: [
        ['Доставка по области', 'Бережная доставка по Ярославлю, Рыбинску, Тутаеву, Угличу, Ростову, Переславлю и всем СНТ области в удобное время.', 'assets/images/teplica.png'],
        ['Сборка под ключ', 'Опытные бригады установят теплицу на фундамент из бруса 100х100 или грунтозацепы. Оплата только после вашей приемки.', 'assets/images/mockup_install.jpg'],
        ['Бесплатное хранение', 'Купите теплицу со скидкой прямо сейчас! Мы бесплатно сохраним её на сухом охраняемом складе завода до нужной даты выгрузки.', 'assets/images/hero_gardener.jpg'] 
      ]
    }
  ];

  const tabsEl = document.getElementById('tabs');
  const listEl = document.getElementById('list');
  const titleEl = document.getElementById('title');
  const descEl = document.getElementById('desc');
  const nextEl = document.getElementById('next');
  const ctaEl = document.getElementById('cta');
  const cardImgEl = document.getElementById('cardImg');

  if (!tabsEl || !listEl || !titleEl || !descEl) return;

  let tab = 0, item = 0, busy = false;

  function renderTabs() {
    tabsEl.innerHTML = '';
    DATA.forEach((d, i) => {
      const b = document.createElement('button');
      b.className = 'tab' + (i === tab ? ' active' : '');
      b.textContent = d.tab;
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', i === tab);
      b.onclick = () => { 
        if (i !== tab) { 
          tab = i; 
          item = 0; 
          renderTabs(); 
          renderList(); 
          show(); 
        } 
      };
      tabsEl.appendChild(b);
    });
  }

  function renderList() {
    listEl.innerHTML = '';
    DATA[tab].items.forEach((it, i) => {
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.textContent = it[0];
      b.className = i === item ? 'active' : '';
      b.style.animationDelay = (i * 70) + 'ms';
      li.className = 'in';
      li.style.animationDelay = (i * 70) + 'ms';
      b.onclick = () => select(i);
      li.appendChild(b);
      listEl.appendChild(li);
    });
  }

  function show() {
    const [t, d, img] = DATA[tab].items[item];
    if (titleEl) titleEl.textContent = t;
    if (descEl) descEl.textContent = d;
    if (cardImgEl) {
      cardImgEl.src = img || 'assets/images/2.png';
      cardImgEl.alt = t;
    }
  }

  function select(i) {
    if (busy || i === item) return;
    busy = true;
    titleEl.classList.add('out'); 
    descEl.classList.add('out');
    if (cardImgEl) cardImgEl.classList.add('out');

    setTimeout(() => {
      item = i;
      show();
      [...listEl.querySelectorAll('button')].forEach((b, k) => b.classList.toggle('active', k === item));
      titleEl.classList.remove('out'); 
      descEl.classList.remove('out');
      if (cardImgEl) cardImgEl.classList.remove('out');
      busy = false;
    }, 380);
  }

  if (nextEl) {
    nextEl.onclick = () => select((item + 1) % DATA[tab].items.length);
  }

  if (ctaEl) {
    ctaEl.onclick = (e) => {
      e.preventDefault();
      const modalOverlay = document.getElementById("modalOverlay");
      const modalTitle = document.getElementById("modalTitle");
      const modalSubtitle = document.getElementById("modalSubtitle");
      const modalSubject = document.getElementById("modalSubject");
      if (!modalOverlay) return;

      const currentItem = DATA[tab].items[item];
      const subject = `Заявка из каталога: ${DATA[tab].tab} — ${currentItem[0]}`;
      const title = "Рассчитать стоимость";
      const subtitle = "Остановите выбор на надежной теплице от завода";

      if (modalTitle) modalTitle.textContent = title;
      if (modalSubtitle) modalSubtitle.textContent = subtitle;
      if (modalSubject) modalSubject.value = subject;
      modalOverlay.classList.add("active");
    };
  }

  renderTabs(); 
  renderList(); 
  show();
}





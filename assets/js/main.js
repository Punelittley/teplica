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
});

// Обновление контактов в DOM
function applyCompanyContacts(config) {
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

// Переключатель крупного шрифта
function setupFontSizeToggle() {
  const btn = document.getElementById("fontSizeToggleBtn");
  if (!btn) return;

  const isLarge = localStorage.getItem("teplici76_font_large") === "true";
  if (isLarge) {
    document.body.classList.add("font-large");
    btn.innerHTML = `<span>🔍</span> Обычный шрифт`;
  }

  btn.addEventListener("click", () => {
    const active = document.body.classList.toggle("font-large");
    localStorage.setItem("teplici76_font_large", active ? "true" : "false");
    btn.innerHTML = active ? `<span>🔍</span> Обычный шрифт` : `<span>🔍</span> Крупный шрифт`;
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

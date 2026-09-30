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

// Плавные анимации появления при скроллинге
function initScrollAnimations() {
  if (!("IntersectionObserver" in window)) {
    // Фолбек для старых браузеров
    document.querySelectorAll("[data-aos]").forEach(el => el.classList.add("aos-animate"));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("aos-animate");
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -40px 0px"
  });

  document.querySelectorAll("[data-aos]").forEach(el => {
    observer.observe(el);
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
  const widget = document.getElementById("faqChatWidget");
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
      answer: "🚚 <strong>Доставка собственным спецтранспортом завода:</strong><br>• По Ярославлю и пригороду — от 1 500 ₽<br>• По Ярославской, Ивановской и Костромской областям — от 1 500 до 2 500 ₽.<br>• Привозим прямо до калитки вашего СНТ или участка!<br>• Срок: 1–2 дня или к нужной дате. <strong>0 ₽ предоплаты — расчет при получении!</strong>",
      action: { text: "Подробнее о доставке", link: "dostavka-sborka.html" }
    },
    {
      keywords: ["предоплат", "оплат", "деньг", "расчет", "картой", "наличн", "перевод", "договор", "чек"],
      answer: "💰 <strong>Честные условия без риска:</strong><br>Мы работаем <strong>БЕЗ ПРЕДОПЛАТЫ (0 ₽)</strong>!<br>Вы рассчитываетесь с водителем или бригадой (наличными или переводом) строго по факту выгрузки и проверки всех элементов теплицы.",
    },
    {
      keywords: ["поликарбонат", "толщин", "4мм", "6мм", "4 мм", "6 мм", "уф", "солнц", "град", "желте", "пластик", "sabic", "bayer"],
      answer: "☀️ <strong>Какой поликарбонат выбрать:</strong><br>• <strong>4 мм с УФ-защитой (Стандарт / Премиум):</strong> оптимальный выбор для большинства дачных теплиц. Срок службы 10–12 лет, не мутнеет и выдерживает град.<br>• <strong>6 мм (Зимний / Сверхпрочный):</strong> для круглогодичного выращивания и повышенной теплоизоляции (до 15 лет гарантии).<br>Используем только первичное сырье Sabic и Bayer с защитой от выгорания!",
      action: { text: "Каталог поликарбоната", link: "polikarbonat.html" }
    },
    {
      keywords: ["снег", "зим", "нагрузк", "выдерж", "прочност", "слома", "рухнет", "дуг", "труб", "чистит", "подпорк"],
      answer: "❄️ <strong>Снеговая нагрузка и прочность:</strong><br>• Каркас из цельной оцинкованной трубы 20×20 или 40×20 мм выдерживает до <strong>180–240 кг/м²</strong> снега.<br>• Шаг дуг 0.65 м (усиленный) исключает провисание поликарбоната.<br>• А <strong>каплевидные теплицы</strong> вообще сбрасывают снег за счет острого конька — подпорки на зиму не требуются!",
      action: { text: "Каплевидные теплицы", link: "kaplevidnye.html" }
    },
    {
      keywords: ["фундамент", "брус", "сва", "грунтозацеп", "основан", "на что ставит", "пропитк", "антисептик"],
      answer: "🪵 <strong>Нужен ли фундамент?</strong><br>Мы рекомендуем установку на <strong>пропитанный антисептиком брус 100×100 мм</strong>. Он защищает каркас от влажной земли, выравнивает рельеф и надежно держит теплицу при сильных ветрах. Также возможен монтаж на оцинкованные сваи/грунтозацепы прямо в грунт.",
      action: { text: "Фундамент и монтаж", link: "dostavka-sborka.html#brus" }
    },
    {
      keywords: ["сборк", "монтаж", "собрат", "установк", "бригад", "время", "быстро", "скольк по времени", "мастер"],
      answer: "🛠️ <strong>Сборка и монтаж:</strong><br>• Сборку производит штатная бригада мастеров с опытом от 5 лет.<br>• Время установки стандартной теплицы под ключ — всего <strong>3–4 часа</strong>!<br>• Оплата работы строго после того, как вы лично проверите открывание дверей и форточек.<br>• Если хотите собрать сами — в комплекте есть понятная инструкция и весь крепеж.",
      action: { text: "Услуги сборки", link: "dostavka-sborka.html#sborka" }
    },
    {
      keywords: ["цен", "стоимост", "прайс", "скольк стоит", "купит", "размер", "3х4", "3х6", "3х8", "3*4", "3*6", "3*8", "4 метр", "6 метр", "8 метр"],
      answer: "🏷️ <strong>Цены на теплицы от завода:</strong><br>• <strong>3 × 4 м:</strong> от 18 900 ₽<br>• <strong>3 × 6 м:</strong> от 23 900 ₽ (Хит)<br>• <strong>3 × 8 м:</strong> от 28 900 ₽<br>В комплект входят: оцинкованный каркас, 2 двери, 2 форточки, фурнитура и поликарбонат с УФ-защитой.",
      action: { text: "Рассчитать в калькуляторе", link: "#calculator" }
    },
    {
      keywords: ["адрес", "где", "производств", "завод", "площадк", "самовывоз", "телефон", "посмотрет", "приехат", "режим", "работ"],
      answer: "📍 <strong>Контакты и производство:</strong><br>• Ярославль, ул. Промышленная, д. 12.<br>• Телефон: <strong>+7 (4852) 123-45-67</strong><br>• Работаем ежедневно с 8:00 до 20:00 без выходных.<br>На нашей выставочной площадке можно лично потрогать каркас и убедиться в прочности металла!",
      action: { text: "Схема проезда", link: "kontakty.html" }
    },
    {
      keywords: ["скидк", "акци", "пенсионер", "дешевл", "подарок", "хранен"],
      answer: "🎁 <strong>Акции и спецпредложения:</strong><br>1. Скидка до 20% к началу сезона!<br>2. Специальная скидка для пенсионеров по удостоверению.<br>3. <strong>Бесплатное хранение</strong> купленной теплицы на сухом складе завода до дня, когда вам удобно её принять.",
      action: { text: "Забронировать по акции", modal: true }
    },
    {
      keywords: ["грядк", "оцинкован", "клумб", "бортик"],
      answer: "🌱 <strong>Оцинкованные грядки:</strong><br>Изготавливаем долговечные грядки высотой 20 см с завальцованными безопасными краями. Не ржавеют и служат от 15 лет. Ширина 0.65–1 м, длина от 2 до 8 метров. Идеально подходят в теплицу!",
      action: { text: "Каталог грядок", link: "gryadki.html" }
    },
    {
      keywords: ["привет", "здравствуй", "добрый день", "добрый вечер", "доброе утро"],
      answer: "Здравствуйте! 👋 Рад помочь вам. Чем я могу быть полезен? Могу рассказать о ценах на теплицы, поликарбонате, доставке по Ярославской области или помочь с расчетом размера."
    },
    {
      keywords: ["спасибо", "благодар", "отлично", "понятно", "супер", "хорошо"],
      answer: "Всегда пожалуйста! Рад был помочь. 😊 Если понадобится консультация инженера или захотите оформить доставку без предоплаты — обращайтесь в любое время!"
    },
    {
      keywords: ["человек", "менеджер", "оператор", "перезвон", "позвон", "связат", "живой", "номер"],
      answer: "📞 Вы можете заказать обратный звонок мастера завода — он перезвонит в течение 10 минут и ответит на все детали!",
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
          "Спасибо за вопрос! 🌿 Чтобы дать точный расчет под особенности вашего участка, я могу передать ваш вопрос нашему старшему мастеру производства. Оставьте номер телефона или позвоните нам прямо сейчас:",
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


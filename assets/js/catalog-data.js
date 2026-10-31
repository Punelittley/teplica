/**
 * Теплицы 76 — Единая база данных каталога, отзывов, выполненных работ и настроек
 * Поддерживает 100% автономную работу, экспорт/импорт базы данных в JSON (включая фото в Base64)
 */

const DEFAULT_PRODUCTS = [
  {
    id: "prod-1",
    category: "arch",
    name: "Арочная теплица 3×4 м",
    price: 25500,
    oldPrice: 28500,
    size: "3х4...3х10 м",
    badge: "Хит продаж",
    badgeType: "hit",
    image: "assets/images/products/arch_3x4/1.jpg",
    description: "Оцинкованный каркас 30×20 мм (труба на ребро, сталь 1.0 мм). Поликарбонат 4 мм (520 г/м²), 2 двери с укосами, 2 форточки и вся фурнитура в комплекте."
  },
  {
    id: "prod-2",
    category: "arch",
    name: "Сборка теплиц под ключ",
    price: 6500,
    oldPrice: 8000,
    size: "под ключ",
    badge: "Профессионально",
    badgeType: "pro",
    image: "assets/images/products/p2/1.jpg",
    description: "Монтаж опытными бригадами за 3-4 часа. Выставление по уровню, крепление к грунту или брусу."
  },
  {
    id: "prod-3",
    category: "arch",
    name: "Ремонт теплиц и замена поликарбоната",
    price: 6500,
    oldPrice: 9500,
    size: "замена СПК",
    badge: "Ремонт и замена",
    badgeType: "hit",
    image: "assets/images/products/p3/1.jpg",
    description: "Демонтаж старого разрушенного пластика, усиление каркаса и монтаж нового премиального поликарбоната с УФ-защитой."
  },
  {
    id: "prod-4",
    category: "other",
    name: "Доставка теплиц спецтранспортом",
    price: 1500,
    oldPrice: 2500,
    size: "по области",
    badge: "Доставка",
    badgeType: "pro",
    image: "assets/images/products/p4/1.jpg",
    description: "Бережная доставка прямо к калитке вашего СНТ на специально оборудованном автотранспорте."
  },
  {
    id: "prod-5",
    category: "poly",
    name: "Сотовый поликарбонат 4 мм Eurotek",
    price: 3500,
    oldPrice: 4200,
    size: "лист 2.1х6 м",
    badge: "В наличии • Eurotek",
    badgeType: "hit",
    image: "assets/images/products/poly/eurotek_4mm.jpg",
    description: "Сотовый поликарбонат 4 мм (плотность 0,52) с УФ-защитой. Не желтеет на солнце, высокая светопроницаемость. От 3 листов, гарантия 15 лет."
  },
  {
    id: "prod-6",
    category: "poly",
    name: "Сотовый поликарбонат 6 мм Eurotek",
    price: 4700,
    oldPrice: 5500,
    size: "лист 2.1х6 м",
    badge: "В наличии • Eurotek",
    badgeType: "pro",
    image: "assets/images/products/poly/eurotek_6mm.jpg",
    description: "Усиленный сотовый поликарбонат 6 мм Eurotek. Честная плотность, 15 лет гарантия, надежная УФ-защита, продажа от 3 листов."
  },
  {
    id: "prod-7",
    category: "drop",
    name: "Теплица «Капелька» 3 м",
    price: 26500,
    oldPrice: 29900,
    size: "3х4...3х10 м",
    badge: "Снегосброс",
    badgeType: "hit",
    image: "assets/images/products/kapelka/1.jpg",
    description: "Оцинкованный профиль 30×20 мм, заострённая крыша — снег скатывается сам. 2 двери, 2 форточки и поликарбонат 4 мм с УФ-защитой."
  },
  {
    id: "prod-8",
    category: "beds",
    name: "Оцинкованные грядки для теплиц",
    price: 1550,
    oldPrice: 2000,
    size: "высота 20 см",
    badge: "Удобно",
    badgeType: "hit",
    image: "assets/images/products/p8/1.jpg",
    description: "Завальцованные безопасные края, толстая сталь с цинковым покрытием. Земля не осыпается, спина не устает."
  }
];

const DEFAULT_REVIEWS = [
  {
    id: "rev-1",
    name: "Наталья Петровна",
    role: "г. Ярославль, СНТ «Садовод-1» • Арочная 3×6 м",
    stars: 5,
    featured: false,
    text: "Заказывали теплицу с усиленным шагом дуг и брусом 100×100. Бригада приехала вовремя, к обеду уже всё стояло ровно по уровню. Зиму пережила без единой подпорки, поликарбонат остался чистым и целым. Очень благодарны заводу!"
  },
  {
    id: "rev-2",
    name: "Виктор Ильич",
    role: "г. Тутаев, д. Борисоглеб • Каплевидная 3×6 м",
    stars: 5,
    featured: true,
    text: "Выбрали капельку из-за снежных зим — сугробы со скатов съезжают сами. Конструкция очень жёсткая, честная труба ГОСТ с горячим цинком. Ребята собрали быстро, весь мусор за собой убрали. Рекомендую завод всем соседям по даче!"
  },
  {
    id: "rev-3",
    name: "Сергей Николаевич",
    role: "г. Ростов Великий • Фермерская 3×10 м",
    stars: 5,
    featured: false,
    text: "Брал теплицу 10 метров для ранней высадки огурцов и рассады. Конструкция монолитная, дуги цельногнутые, оцинковка плотная. В мае выдержала шквалистый ветер — стоит как влитая, двери и форточки открываются легко."
  },
  {
    id: "rev-4",
    name: "Елена Михайловна",
    role: "г. Рыбинск, пос. Волжский • Арочная 3×8 м + Грядки",
    stars: 5,
    featured: false,
    text: "Взяли теплицу сразу с оцинкованными грядками в три ряда. Для пожилых людей это спасение: полоть удобно, спина не устает, вода не растекается. Первый урожай огурцов собрали на 3 недели раньше обычного срока!"
  },
  {
    id: "rev-5",
    name: "Михаил Юрьевич",
    role: "г. Переславль-Залесский • Каплевидная 3×4 м",
    stars: 5,
    featured: true,
    text: "Очень порадовало соединение краб-системой: поликарбонат ложится монолитно без провисаний и щелей, на ветру не вибрирует. Оплатил водителю на месте после полной проверки комплектации без предоплаты."
  },
  {
    id: "rev-6",
    name: "Светлана и Андрей",
    role: "Ярославский р-н, Григорьевское • Арочная 3×4 м",
    stars: 5,
    featured: false,
    text: "Покупали родителям на юбилей. Водитель аккуратно выгрузил, помог пересчитать все детали и проверить толщину дуг. Качество заводское, сварочные швы оцинкованы. Родители в восторге от подарка!"
  }
];

const DEFAULT_WORKS = [
  {
    id: "work-1",
    title: "Арочная усиленная теплица 3х4 м",
    category: "arch usil",
    image: "assets/images/products/p1/2.jpg"
  },
  {
    id: "work-2",
    title: "Теплица с поликарбонатом 4 мм Премиум",
    category: "arch timber",
    image: "assets/images/products/p1/3.jpg"
  },
  {
    id: "work-3",
    title: "Сборка теплицы на дачном участке",
    category: "arch",
    image: "assets/images/products/p1/4.jpg"
  },
  {
    id: "work-4",
    title: "Арочная теплица 3х8 м под ключ",
    category: "arch usil timber",
    image: "assets/images/products/p1/5.jpg"
  },
  {
    id: "work-5",
    title: "Каплевидная теплица на брусе 100х100",
    category: "drop timber",
    image: "assets/images/products/p2/2.jpg"
  },
  {
    id: "work-6",
    title: "Каплевидная теплица — снегосброс",
    category: "drop",
    image: "assets/images/products/p2/3.jpg"
  },
  {
    id: "work-7",
    title: "Усиленная каплевидная теплица 3х4 м",
    category: "drop usil",
    image: "assets/images/products/p2/4.jpg"
  },
  {
    id: "work-8",
    title: "Каплевидная теплица 3х8 м",
    category: "drop timber",
    image: "assets/images/products/p2/5.jpg"
  },
  {
    id: "work-9",
    title: "Теплица на участке в Ярославском районе",
    category: "arch usil timber",
    image: "assets/images/products/p3/2.jpg"
  },
  {
    id: "work-10",
    title: "Двойная дуга ферма 40х20 мм",
    category: "arch usil",
    image: "assets/images/products/p3/3.jpg"
  },
  {
    id: "work-11",
    title: "Сверхпрочная теплица 3х6 м",
    category: "arch usil timber",
    image: "assets/images/products/p3/4.jpg"
  }
];

const DEFAULT_CONFIG = {
  security: {
    // Надежный пароль по умолчанию (можно менять прямо в админке)
    password: "TepL!ca#76_Yar2026!"
  },
  company: {
    name: "Теплицы ТУТ",
    tagline: "С заботой о вашем урожае",
    phone: "+7 (4852) 123-45-67",
    phoneRaw: "+748521234567",
    phoneSecondary: "+7 (920) 140-50-60",
    workHours: "Ежедневно с 8:00 до 20:00",
    address: "г. Ярославль, ул. Промышленная, д. 12 (Выставочная площадка)",
    email: "info@teplici76.ru",
    vkUrl: "https://vk.ru/tepliciotproizvoditelya76",
    telegramUsername: "teplici76_yar",
    promoText: "Весенняя акция: бесплатное хранение теплицы на складе до начала сезона!"
  },
  pricing: {
    arch: {
      "4m": { name: "3х4 метра", price: 25500, oldPrice: 28500 },
      "6m": { name: "3х6 метров", price: 29500, oldPrice: 33000 },
      "8m": { name: "3х8 метров", price: 34200, oldPrice: 38500 },
      "10m": { name: "3х10 метров", price: 38500, oldPrice: 43000 }
    },
    drop: {
      "4m": { name: "3х4 метра", price: 26500, oldPrice: 29900 },
      "6m": { name: "3х6 метров", price: 32500, oldPrice: 36500 },
      "8m": { name: "3х8 метров", price: 38500, oldPrice: 43500 }
    },
    house: {
      "4m": { name: "3х4 метра", price: 29500, oldPrice: 33500 },
      "6m": { name: "3х6 метров", price: 36500, oldPrice: 41000 },
      "8m": { name: "3х8 метров", price: 43500, oldPrice: 48500 },
      "10m": { name: "3х10 метров", price: 50500, oldPrice: 56500 }
    },
    step: {
      "100": { name: "Шаг 1 метр", price: 0 },
      "65": { name: "Усиленный шаг 0.65 м", price: 2500 }
    },
    poly: {
      "eco4": { name: "Поликарбонат 4 мм Стандарт (с УФ)", price: 0 },
      "prem4": { name: "Поликарбонат 4 мм Премиум повышенной плотности", price: 3500 },
      "prem6": { name: "Поликарбонат 6 мм Усиленный (для круглого года)", price: 4700 }
    },
    foundation: {
      "ground": { name: "Грунтозацепы (в комплекте)", price: 0 },
      "timber4": { name: "Фундамент из бруса 100х100 (для 4м)", price: 6000 },
      "timber6": { name: "Фундамент из бруса 100х100 (для 6м)", price: 6500 },
      "timber8": { name: "Фундамент из бруса 100х100 (для 8м)", price: 7500 },
      "timber10": { name: "Фундамент из бруса 100х100 (для 10м)", price: 9000 }
    },
    assembly: {
      "none": { name: "Соберу сам (инструкция в комплекте)", price: 0 },
      "4m": { name: "Профессиональная сборка 4м", price: 4000 },
      "6m": { name: "Профессиональная сборка 6м", price: 7000 },
      "8m": { name: "Профессиональная сборка 8м", price: 7500 },
      "10m": { name: "Профессиональная сборка 10м", price: 8000 }
    },
    delivery: {
      baseYar: 1500,
      perKm: 40
    },
    tape: {
      name: "Стяжная оцинкованная лента",
      price: 1800,
      oldPrice: 2400
    },
    beds: {
      set3x4: {
        name: "Комплект грядок в теплицу 3х4 м (3 ряда)",
        price: 6000,
        oldPrice: 7200
      },
      set3x6: {
        name: "Комплект грядок в теплицу 3х6 м (3 ряда)",
        price: 9500,
        oldPrice: 11000
      }
    },
    autovent: {
      name: "Автопроветриватель форточки (термопривод)",
      price: 2400,
      oldPrice: 2900
    }
  },
  products: DEFAULT_PRODUCTS,
  reviews: DEFAULT_REVIEWS,
  works: DEFAULT_WORKS,
  vkNotify: {
    enabled: true,
    groupId: "241898656",
    groupToken: "vk1.a.xRWV8ieGHWaPOgj1-i0khjmtKvYXST0ETsbS9D-i0VlulXupgmBDJcN2TnGzLpux-p1pQTLEl6sa1OArZKdHc7IVL9hBpmW4u40G2u3m731-uT43jh0LFHucdqRhPN70MXWrRTECz-aJfowJUCdMpr7_Ja817EIO2n77upSKuLiAOj5CRJSZOIRxpC7mAnGhJkr-9CUQHdzbz67zPTBN2A",
    userId: "550394386",
    userIds: ["550394386"]
  },
  telegramNotify: {
    enabled: false,
    botToken: "",
    chatId: ""
  }
};

// Загрузка актуальной базы данных из localStorage или по умолчанию
function getSiteConfig() {
  try {
    const saved = localStorage.getItem("teplici76_config");
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_CONFIG,
        ...parsed,
        security: { ...DEFAULT_CONFIG.security, ...(parsed.security || {}) },
        company: { ...DEFAULT_CONFIG.company, ...(parsed.company || {}) },
        pricing: { ...DEFAULT_CONFIG.pricing, ...(parsed.pricing || {}) },
        products: Array.isArray(parsed.products) && parsed.products.length ? parsed.products : DEFAULT_PRODUCTS,
        reviews: Array.isArray(parsed.reviews) && parsed.reviews.length ? parsed.reviews : DEFAULT_REVIEWS,
        works: Array.isArray(parsed.works) && parsed.works.length ? parsed.works : DEFAULT_WORKS,
        vkNotify: {
          ...DEFAULT_CONFIG.vkNotify,
          ...(parsed.vkNotify || {}),
          groupToken: (parsed.vkNotify && parsed.vkNotify.groupToken) || DEFAULT_CONFIG.vkNotify.groupToken,
          groupId: (parsed.vkNotify && parsed.vkNotify.groupId) || DEFAULT_CONFIG.vkNotify.groupId,
          userId: (parsed.vkNotify && parsed.vkNotify.userId) || DEFAULT_CONFIG.vkNotify.userId,
          userIds: (parsed.vkNotify && parsed.vkNotify.userIds && parsed.vkNotify.userIds.length) ? parsed.vkNotify.userIds : DEFAULT_CONFIG.vkNotify.userIds,
          enabled: parsed.vkNotify && typeof parsed.vkNotify.enabled === "boolean" ? parsed.vkNotify.enabled : true
        },
        telegramNotify: { ...DEFAULT_CONFIG.telegramNotify, ...(parsed.telegramNotify || {}) }
      };
    }
  } catch (e) {
    console.error("Config load error", e);
  }
  return DEFAULT_CONFIG;
}

// Сохранение базы данных в localStorage
function saveSiteConfig(newConfig) {
  try {
    localStorage.setItem("teplici76_config", JSON.stringify(newConfig));
    // Оповещаем открытые вкладки или страницы
    window.dispatchEvent(new CustomEvent("teplica:data-updated", { detail: newConfig }));
    return true;
  } catch (e) {
    console.error("Config save error", e);
    return false;
  }
}

// Экспорт всей базы в JSON (включая картинки)
function exportFullDatabase() {
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
  const blob = new Blob([jsonStr], { type: "application/json;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const dateStr = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `teplica_full_database_${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Импорт базы из JSON строки
function importFullDatabase(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    const db = data.database || data;
    
    if (!db || (!db.company && !db.products && !db.pricing)) {
      throw new Error("Неверная структура файла базы данных");
    }

    // Сохраняем конфигурацию
    saveSiteConfig(db);

    // Если есть лиды в бэкапе
    if (Array.isArray(data.leads)) {
      localStorage.setItem("teplici76_leads", JSON.stringify(data.leads));
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// Сброс до начальных настроек
function resetDatabaseToDefaults() {
  localStorage.removeItem("teplici76_config");
  return DEFAULT_CONFIG;
}

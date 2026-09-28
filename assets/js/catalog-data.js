/**
 * Теплицы 76 — Данные каталога и настройки компании
 * Поддерживает редактирование через локальную панель администратора (/admin)
 */

const DEFAULT_CONFIG = {
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
  telegramNotify: {
    enabled: false,
    botToken: "",
    chatId: ""
  },
  pricing: {
    // Арочные
    arch: {
      "4m": { name: "3х4 метра", price: 21900, oldPrice: 24500 },
      "6m": { name: "3х6 метров", price: 26900, oldPrice: 30500 },
      "8m": { name: "3х8 метров", price: 32400, oldPrice: 36800 },
      "10m": { name: "3х10 метров", price: 37900, oldPrice: 42900 }
    },
    // Каплевидные
    drop: {
      "4m": { name: "3х4 метра", price: 24900, oldPrice: 27900 },
      "6m": { name: "3х6 метров", price: 30900, oldPrice: 34900 },
      "8m": { name: "3х8 метров", price: 37400, oldPrice: 42500 }
    },
    // Опции
    step: {
      "100": { name: "Шаг 1 метр", price: 0 },
      "65": { name: "Усиленный шаг 0.65 м", price: 2500 }
    },
    poly: {
      "eco4": { name: "Поликарбонат 4 мм Стандарт (с УФ)", price: 0 },
      "prem4": { name: "Поликарбонат 4 мм Премиум повышенной плотности", price: 3200 },
      "prem6": { name: "Поликарбонат 6 мм Усиленный (для круглого года)", price: 6500 }
    },
    foundation: {
      "ground": { name: "Грунтозацепы (в комплекте)", price: 0 },
      "timber4": { name: "Фундамент из бруса 100х100 (для 4м)", price: 3800 },
      "timber6": { name: "Фундамент из бруса 100х100 (для 6м)", price: 4900 },
      "timber8": { name: "Фундамент из бруса 100х100 (для 8м)", price: 6200 }
    },
    assembly: {
      "none": { name: "Соберу сам (инструкция в комплекте)", price: 0 },
      "4m": { name: "Профессиональная сборка 4м", price: 4000 },
      "6m": { name: "Профессиональная сборка 6м", price: 5000 },
      "8m": { name: "Профессиональная сборка 8м", price: 6000 }
    },
    delivery: {
      baseYar: 1500, // По Ярославлю
      perKm: 40 // За км от черты города
    }
  }
};

// Загрузка актуальных настроек из localStorage или по умолчанию
function getSiteConfig() {
  try {
    const saved = localStorage.getItem("teplici76_config");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Config load error", e);
  }
  return DEFAULT_CONFIG;
}

function saveSiteConfig(newConfig) {
  try {
    localStorage.setItem("teplici76_config", JSON.stringify(newConfig));
    return true;
  } catch (e) {
    console.error("Config save error", e);
    return false;
  }
}

/**
 * VK Бот для группы https://vk.ru/club241898656
 * Функции:
 * 1. Обработка команды /add <id> для добавления сотрудников/админов для получения заявок с сайта
 * 2. Проверка разрешений VK API (messages.isMessagesFromGroupAllowed)
 * 3. Команды /list, /del <id>, /test, /help
 * 4. Автоматические консультации клиентов по базе знаний теплиц (FAQ)
 * 5. Рассылка заявок всем авторизованным получателям
 */

const fs = require("fs");
const path = require("path");

// Основные настройки
const CONFIG = {
  groupId: "241898656",
  groupToken: "vk1.a.xRWV8ieGHWaPOgj1-i0khjmtKvYXST0ETsbS9D-i0VlulXupgmBDJcN2TnGzLpux-p1pQTLEl6sa1OArZKdHc7IVL9hBpmW4u40G2u3m731-uT43jh0LFHucdqRhPN70MXWrRTECz-aJfowJUCdMpr7_Ja817EIO2n77upSKuLiAOj5CRJSZOIRxpC7mAnGhJkr-9CUQHdzbz67zPTBN2A",
  primaryAdminId: "550394386", // Николай Макаров
  apiVersion: "5.131",
  storageFile: path.join(__dirname, "vk_subscribers.json")
};

// Загрузка / сохранение подписчиков на уведомления
function loadSubscribers() {
  try {
    if (fs.existsSync(CONFIG.storageFile)) {
      const data = JSON.parse(fs.readFileSync(CONFIG.storageFile, "utf8"));
      if (Array.isArray(data) && data.length) return Array.from(new Set(data.map(String)));
    }
  } catch (e) {
    console.error("Ошибка чтения подписчиков:", e.message);
  }
  return [CONFIG.primaryAdminId];
}

function saveSubscribers(list) {
  try {
    const clean = Array.from(new Set(list.map(String).filter(Boolean)));
    fs.writeFileSync(CONFIG.storageFile, JSON.stringify(clean, null, 2), "utf8");
    return true;
  } catch (e) {
    console.error("Ошибка сохранения подписчиков:", e.message);
    return false;
  }
}

let subscribers = loadSubscribers();
console.log(`[VK Bot] Запущен! Авторизованные получатели уведомлений: ${subscribers.join(", ")}`);

// Вызов VK API
async function vkApi(method, params = {}) {
  const urlParams = new URLSearchParams({
    v: CONFIG.apiVersion,
    access_token: CONFIG.groupToken,
    ...params
  });

  const res = await fetch(`https://api.vk.com/method/${method}`, {
    method: "POST",
    body: urlParams
  });
  const data = await res.json();
  if (data.error) {
    throw data.error;
  }
  return data.response;
}

// Отправка сообщения пользователю
async function sendMessage(userId, text) {
  const randomId = Math.floor(Math.random() * 100000000);
  return await vkApi("messages.send", {
    user_id: userId,
    message: text,
    random_id: randomId
  });
}

// Определение пользователя по ID / короткому имени / ссылке
async function resolveUser(input) {
  let clean = String(input).trim();
  clean = clean.replace(/^https?:\/\/(www\.)?vk\.(com|ru)\//i, "");
  clean = clean.replace(/^@/, "");
  clean = clean.replace(/^id(?=\d+$)/i, "");

  try {
    const res = await vkApi("users.get", { user_ids: clean });
    if (Array.isArray(res) && res[0]) {
      return res[0];
    }
  } catch (e) {}
  return null;
}

// Проверка, разрешил ли пользователь сообщения от сообщества
async function isAllowed(userId) {
  try {
    const res = await vkApi("messages.isMessagesFromGroupAllowed", {
      group_id: CONFIG.groupId,
      user_id: userId
    });
    return res && res.is_allowed === 1;
  } catch (e) {
    return false;
  }
}

// База знаний для умных ответов клиентам в чате ВК
const FAQ = [
  {
    keywords: ["доставк", "привез", "тариф", "яросл", "рыбинск", "тутаев", "ростов", "переславл", "углич", "данилов", "гаврилов", "костром", "иванов", "куда"],
    answer: "🚚 Доставка собственным автопарком завода:\n• По Ярославлю и пригороду — от 1 500 ₽\n• По области — от 1 500 до 2 500 ₽ прямо до калитки вашего СНТ или дачи.\n• Срок доставки: 1–2 дня или к нужной вам дате.\n• 0 ₽ предоплаты — оплата водителю строго при получении!"
  },
  {
    keywords: ["предоплат", "оплат", "деньг", "расчет", "картой", "наличн", "перевод"],
    answer: "🤝 Честные условия:\nМы работаем БЕЗ ПРЕДОПЛАТЫ (0 ₽)!\nВы рассчитываетесь с водителем или бригадой монтажников строго по факту выгрузки и проверки всех элементов теплицы."
  },
  {
    keywords: ["поликарбонат", "толщин", "4мм", "6мм", "4 мм", "6 мм", "уф", "солнц", "град"],
    answer: "🛡 Поликарбонат с защитой от ультрафиолета:\n• 4 мм Премиум: оптимальный выбор для большинства дачных теплиц. Срок службы 10–12 лет, не мутнеет и держит град.\n• 6 мм Зимний: для круглогодичного выращивания и повышенной теплоизоляции (до 15 лет службы).\nИспользуем только первичное сырье Sabic и Bayer!"
  },
  {
    keywords: ["снег", "зим", "нагрузк", "выдерж", "прочност", "слома", "рухнет", "дуг", "труб", "чистит"],
    answer: "❄️ Снеговая нагрузка и надежность:\n• Каркас из цельной оцинкованной трубы 20×20 или 40×20 мм выдерживает до 180–240 кг/м² снега.\n• Шаг дуг 0.65 м исключает провисание поликарбоната.\n• А каплевидные теплицы сбрасывают снег за счет острого конька — подпорки на зиму не требуются!"
  },
  {
    keywords: ["фундамент", "брус", "сва", "грунтозацеп", "основан"],
    answer: "🪵 Фундамент для теплицы:\nМы рекомендуем установку на пропитанный антисептиком брус 100×100 мм. Он защищает каркас от сырости земли и надежно держит теплицу при штормовом ветре. Также возможен монтаж на грунтозацепы прямо в грунт."
  },
  {
    keywords: ["сборк", "монтаж", "собрат", "установк", "мастер"],
    answer: "🔧 Сборка и установка:\n• Профессиональная бригада с опытом от 5 лет соберет теплицу под ключ всего за 3–4 часа!\n• Оплата работы монтажников — строго после того, как вы лично проверите двери и форточки.\n• Можно собрать и самому — в комплекте подробный паспорт и весь крепеж."
  },
  {
    keywords: ["цен", "стоимост", "прайс", "скольк стоит", "купит", "3х4", "3х6", "3х8", "3*4", "3*6", "3*8"],
    answer: "🏷 Цены на теплицы от завода «Теплицы ТУТ»:\n• 3 × 4 м — от 21 900 ₽\n• 3 × 6 м — от 26 900 ₽ (Хит продаж)\n• 3 × 8 м — от 32 400 ₽\nВ комплект входят: оцинкованный каркас, 2 двери, 2 форточки, фурнитура и поликарбонат с УФ-защитой."
  },
  {
    keywords: ["адрес", "где", "завод", "площадк", "телефон", "приехат"],
    answer: "📍 Производство и выставочная площадка:\nг. Ярославль, ул. Промышленная, д. 12.\nТелефон: +7 (4852) 123-45-67\nРаботаем ежедневно с 8:00 до 20:00 без выходных.\nПриезжайте посмотреть выставочные образцы и проверить прочность каркаса!"
  },
  {
    keywords: ["привет", "здравствуй", "добрый день", "добрый вечер", "доброе утро", "начать"],
    answer: "Здравствуйте! 👋 Рады приветствовать вас на заводе «Теплицы ТУТ»!\nЧем я могу помочь? Могу подсказать цены, условия доставки по Ярославской области, помочь выбрать поликарбонат или рассчитать размер теплицы."
  }
];

// Обработка входящего сообщения
async function handleMessage(msg) {
  const senderId = String(msg.from_id);
  const text = (msg.text || "").trim();
  const lowerText = text.toLowerCase();

  console.log(`[Сообщение] От id${senderId}: "${text}"`);

  // Проверяем, является ли отправитель администратором
  const isAdmin = subscribers.includes(senderId) || senderId === CONFIG.primaryAdminId;

  // 1. Команда /add <id>
  if (lowerText.startsWith("/add")) {
    if (!isAdmin) {
      await sendMessage(senderId, "⛔ У вас нет прав для добавления получателей. Обратитесь к главному администратору.");
      return;
    }

    const targetParam = text.replace(/^\/add\s*/i, "").trim();
    if (!targetParam) {
      await sendMessage(senderId, "ℹ️ Формат команды:\n/add <ID или ссылка>\nПример: /add 550394386 или /add younger_name");
      return;
    }

    const user = await resolveUser(targetParam);
    if (!user) {
      await sendMessage(senderId, `❌ Не удалось найти пользователя «${targetParam}» ВКонтакте. Проверьте ID.`);
      return;
    }

    const targetId = String(user.id);
    const fullName = `${user.first_name} ${user.last_name}`;

    if (!subscribers.includes(targetId)) {
      subscribers.push(targetId);
      saveSubscribers(subscribers);
    }

    const allowed = await isAllowed(targetId);
    if (allowed) {
      await sendMessage(
        senderId,
        `✅ Сотрудник ${fullName} (id${targetId}) успешно добавлен в список получателей заявок!\n` +
        `Уведомления разрешены — бот будет присылать ему новые заказы с сайта.`
      );
      // Оповестим самого добавленного пользователя
      try {
        await sendMessage(targetId, `🌱 Здравствуйте, ${user.first_name}! Вы успешно подключены к получению заявок с сайта «Теплицы ТУТ». Сюда будут приходить все новые заказы.`);
      } catch (e) {}
    } else {
      await sendMessage(
        senderId,
        `⚠️ Пользователь ${fullName} (id${targetId}) добавлен в список!\n\n` +
        `❗ ВАЖНО: Он еще НЕ написал боту в личные сообщения. По правилам безопасности ВК бот не может писать первым.\n` +
        `Попросите его перейти по ссылке: https://vk.me/club${CONFIG.groupId} и отправить любое сообщение (например, «Привет»), после чего доставка заработает.`
      );
    }
    return;
  }

  // 2. Команда /del <id>
  if (lowerText.startsWith("/del") || lowerText.startsWith("/remove")) {
    if (!isAdmin) return;
    const targetParam = text.replace(/^\/(del|remove)\s*/i, "").trim();
    const user = await resolveUser(targetParam);
    const targetId = user ? String(user.id) : targetParam.replace(/\D/g, "");

    if (!targetId || !subscribers.includes(targetId)) {
      await sendMessage(senderId, `Пользователь с ID ${targetId} не найден в списке получателей.`);
      return;
    }

    if (targetId === CONFIG.primaryAdminId) {
      await sendMessage(senderId, `⚠️ Нельзя удалить главного администратора (id${CONFIG.primaryAdminId}).`);
      return;
    }

    subscribers = subscribers.filter(id => id !== targetId);
    saveSubscribers(subscribers);
    await sendMessage(senderId, `🗑 Пользователь id${targetId} удален из списка получателей.`);
    return;
  }

  // 3. Команда /list
  if (lowerText === "/list" || lowerText === "/список") {
    if (!isAdmin) return;
    let reply = `📋 Список получателей уведомлений о заявках (${subscribers.length}):\n\n`;

    for (let i = 0; i < subscribers.length; i++) {
      const uid = subscribers[i];
      const user = await resolveUser(uid);
      const name = user ? `${user.first_name} ${user.last_name}` : `ID ${uid}`;
      const allowed = await isAllowed(uid);
      const statusIcon = allowed ? "✅ Разрешено" : "⚠️ Не написал боту";
      reply += `${i + 1}. [id${uid}|${name}] — ${statusIcon}\n`;
    }
    reply += `\nДобавить человека: /add <id>\nУдалить: /del <id>\nПроверить доставку: /test`;
    await sendMessage(senderId, reply);
    return;
  }

  // 4. Команда /test
  if (lowerText === "/test" || lowerText === "/тест") {
    if (!isAdmin) return;
    await sendMessage(senderId, `🚀 Отправляю тестовое уведомление всем получателям (${subscribers.length} чел.)...`);
    for (const uid of subscribers) {
      try {
        await sendMessage(uid, `🌱 Тестовое оповещение от бота «Теплицы ТУТ»!\nВаш ID (${uid}) авторизован для получения заявок с сайта.`);
      } catch (err) {
        console.warn(`Ошибка отправки id${uid}:`, err.message || err);
      }
    }
    await sendMessage(senderId, `✅ Тест завершен!`);
    return;
  }

  // 5. Команда /help
  if (lowerText === "/help" || lowerText === "/помощь" || lowerText === "/команды") {
    if (isAdmin) {
      await sendMessage(
        senderId,
        `🛠 Команды администратора бота:\n` +
        `• /add <id или ссылка> — добавить сотрудника для получения заявок\n` +
        `• /list — список всех подключенных получателей\n` +
        `• /del <id> — удалить сотрудника из рассылки\n` +
        `• /test — отправить тестовую заявку всем получателям\n\n` +
        `Обычным клиентам бот автоматически отвечает на частые вопросы о ценах, поликарбонате и доставке!`
      );
      return;
    }
  }

  // 6. Поиск ответа по FAQ для клиентов
  let bestMatch = null;
  let maxScore = 0;

  for (const item of FAQ) {
    let score = 0;
    for (const kw of item.keywords) {
      if (lowerText.includes(kw)) score += kw.length;
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && maxScore > 0) {
    await sendMessage(senderId, bestMatch.answer);
  } else {
    // Дефолтный вежливый ответ
    await sendMessage(
      senderId,
      `Спасибо за ваше сообщение! 😊\n\n` +
      `Я зафиксировал ваш вопрос и передал старшему мастеру производства. Он свяжется с вами в течение 10–15 минут.\n` +
      `Также вы можете позвонить нам напрямую на завод: +7 (4852) 123-45-67 (ежедневно с 8:00 до 20:00).`
    );

    // Оповещаем админов о новом вопросе клиента
    for (const uid of subscribers) {
      try {
        await sendMessage(
          uid,
          `💬 Новый вопрос от клиента в ВК!\n` +
          `👤 Клиент: https://vk.ru/id${senderId}\n` +
          `📝 Вопрос: "${text}"\n` +
          `Ответьте клиенту в диалоге сообщества!`
        );
      } catch (e) {}
    }
  }
}

// Запуск LongPoll цикла
async function startLongPoll() {
  console.log("[VK Bot] Подключение к LongPoll серверу ВКонтакте...");

  while (true) {
    try {
      // 1. Получаем данные LongPoll сервера
      const lp = await vkApi("groups.getLongPollServer", { group_id: CONFIG.groupId });
      let { server, key, ts } = lp;

      console.log("[VK Bot] Соединение с сервером VK установлено. Ожидание сообщений...");

      // 2. Цикл опроса
      while (true) {
        try {
          const pollUrl = `${server}?act=a_check&key=${key}&ts=${ts}&wait=25`;
          const res = await fetch(pollUrl);
          const data = await res.json();

          if (data.failed) {
            console.log(`[VK Bot] LongPoll error code ${data.failed}, обновляем ключ...`);
            if (data.failed === 1) {
              ts = data.ts;
            } else {
              break; // переподключение getLongPollServer
            }
          }

          if (data.ts) ts = data.ts;

          if (Array.isArray(data.updates)) {
            for (const update of data.updates) {
              if (update.type === "message_new" && update.object && update.object.message) {
                handleMessage(update.object.message).catch(err => {
                  console.error("Ошибка при обработке сообщения:", err);
                });
              }
            }
          }
        } catch (pollErr) {
          console.warn("[VK Bot] Ошибка соединения в цикле:", pollErr.message);
          await new Promise(r => setTimeout(r, 3000));
          break;
        }
      }
    } catch (err) {
      console.error("[VK Bot] Критическая ошибка LongPoll:", err.message || err);
      await new Promise(r => setTimeout(r, 5000));
    }
  }
}

startLongPoll();

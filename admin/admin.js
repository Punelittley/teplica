/**
 * Панель управления «Теплицы 76»
 * Автономно работает на GitHub Pages и любом хостинге без бэкенда
 */

const ADMIN_PASS_KEY = "teplici76_admin_pass";
const DEFAULT_PASS = "admin76";

document.addEventListener("DOMContentLoaded", () => {
  setupAuth();
  setupNavigation();
  loadLeads();
  loadPricesForm();
  loadContactsForm();
  loadVkSettings();
  loadTelegramSettings();
  setupExportImport();
});

// Авторизация
function setupAuth() {
  const loginScreen = document.getElementById("loginScreen");
  const adminLayout = document.getElementById("adminLayout");
  const loginForm = document.getElementById("loginForm");
  const logoutBtn = document.getElementById("logoutBtn");
  const errorMsg = document.getElementById("loginError");

  const isAuth = sessionStorage.getItem("teplici76_logged_in") === "true";
  if (isAuth) {
    loginScreen.style.display = "none";
    adminLayout.classList.add("active");
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const passInput = document.getElementById("passwordInput").value;
    const realPass = localStorage.getItem(ADMIN_PASS_KEY) || DEFAULT_PASS;

    if (passInput === realPass) {
      sessionStorage.setItem("teplici76_logged_in", "true");
      loginScreen.style.display = "none";
      adminLayout.classList.add("active");
      errorMsg.style.display = "none";
      loadLeads();
    } else {
      errorMsg.style.display = "block";
    }
  });

  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("teplici76_logged_in");
    adminLayout.classList.remove("active");
    loginScreen.style.display = "flex";
  });
}

// Навигация по вкладкам
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

// 1. Заявки (Лиды)
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

// Экспорт в Excel / CSV
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

// 2. Управление ценами
function loadPricesForm() {
  const config = getSiteConfig();
  const p = config.pricing;

  document.getElementById("p_arch_4m").value = p.arch["4m"].price;
  document.getElementById("p_arch_6m").value = p.arch["6m"].price;
  document.getElementById("p_arch_8m").value = p.arch["8m"].price;
  document.getElementById("p_arch_10m").value = p.arch["10m"].price;

  document.getElementById("p_drop_4m").value = p.drop["4m"].price;
  document.getElementById("p_drop_6m").value = p.drop["6m"].price;
  document.getElementById("p_drop_8m").value = p.drop["8m"].price;

  document.getElementById("p_step_65").value = p.step["65"].price;
  document.getElementById("p_poly_prem4").value = p.poly["prem4"].price;
  document.getElementById("p_poly_prem6").value = p.poly["prem6"].price;

  const form = document.getElementById("pricesForm");
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
    alert("Цены успешно сохранены и обновлены на сайте!");
  });
}

// 3. Контакты
function loadContactsForm() {
  const config = getSiteConfig();
  const c = config.company;

  document.getElementById("c_phone").value = c.phone;
  document.getElementById("c_phoneRaw").value = c.phoneRaw;
  document.getElementById("c_address").value = c.address;
  document.getElementById("c_hours").value = c.workHours;
  document.getElementById("c_promo").value = c.promoText;

  const form = document.getElementById("contactsForm");
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

// Хелпер вызова VK API через JSONP
function callVkApi(method, params, timeout = 7000) {
  return new Promise((resolve, reject) => {
    const randomId = Math.floor(Math.random() * 100000000);
    const cbName = `vkJsonpCb_${Date.now()}_${randomId}`;
    const query = new URLSearchParams(params);
    query.set("callback", cbName);
    query.set("v", "5.131");

    const script = document.createElement("script");
    script.src = `https://api.vk.com/method/${method}?${query.toString()}`;

    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("Таймаут запроса к ВКонтакте (проверьте интернет или блокировщики)"));
    }, timeout);

    function cleanup() {
      clearTimeout(timer);
      if (window[cbName]) delete window[cbName];
      if (script.parentNode) script.remove();
    }

    window[cbName] = function(res) {
      cleanup();
      if (res && res.response !== undefined) {
        resolve(res.response);
      } else if (res && res.error) {
        reject(res.error);
      } else {
        reject(new Error("Некорректный ответ от ВКонтакте"));
      }
    };

    script.onerror = function() {
      cleanup();
      reject(new Error("Не удалось загрузить скрипт VK API"));
    };

    document.head.appendChild(script);
  });
}

// 4. ВКонтакте бот (Группа https://vk.ru/club241898656)
function loadVkSettings() {
  const config = getSiteConfig();
  const vk = config.vkNotify || { enabled: true, groupId: "241898656", groupToken: "", userId: "550394386", userIds: ["550394386"] };

  const enabledCheck = document.getElementById("vk_enabled");
  const groupIdInput = document.getElementById("vk_group_id");
  const tokenInput = document.getElementById("vk_token");
  const userInput = document.getElementById("vk_user_id");
  const addCommandInput = document.getElementById("vk_add_command_input");
  const addUserBtn = document.getElementById("vkAddUserBtn");
  const addStatus = document.getElementById("vkAddStatus");
  const recipientsListEl = document.getElementById("vkRecipientsList");

  if (!enabledCheck || !tokenInput || !userInput) return;

  // Парсинг текущих ID получателей
  let currentRecipients = [];
  if (Array.isArray(vk.userIds) && vk.userIds.length > 0) {
    currentRecipients = vk.userIds.map(id => String(id).trim()).filter(Boolean);
  } else if (vk.userId) {
    currentRecipients = String(vk.userId).split(/[\s,;]+/).map(id => String(id).trim()).filter(Boolean);
  }
  if (!currentRecipients.length) {
    currentRecipients = ["550394386"];
  }
  // Убираем дубли
  currentRecipients = Array.from(new Set(currentRecipients));

  enabledCheck.checked = vk.enabled !== false;
  if (groupIdInput) groupIdInput.value = vk.groupId || "241898656";
  tokenInput.value = vk.groupToken || "";
  userInput.value = currentRecipients.join(", ");

  // Функция отрисовки списка получателей с проверкой прав
  async function renderRecipientsList() {
    if (!recipientsListEl) return;
    recipientsListEl.innerHTML = "";

    if (!currentRecipients.length) {
      recipientsListEl.innerHTML = '<div style="color: var(--admin-muted); font-size: 0.88rem; font-style: italic;">Список получателей пуст. Добавьте хотя бы одного человека через команду /add выше.</div>';
      return;
    }

    const token = tokenInput.value.trim();
    const groupId = (groupIdInput ? groupIdInput.value.trim() : "") || "241898656";

    for (const uid of currentRecipients) {
      const card = document.createElement("div");
      card.style.cssText = "display: flex; align-items: center; justify-content: space-between; background: #fff; border: 1px solid #d8f3dc; border-radius: 8px; padding: 10px 14px; gap: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);";

      const left = document.createElement("div");
      left.style.cssText = "display: flex; align-items: center; gap: 10px; flex-wrap: wrap;";

      const idLink = document.createElement("a");
      idLink.href = `https://vk.ru/id${uid}`;
      idLink.target = "_blank";
      idLink.rel = "noopener noreferrer";
      idLink.style.cssText = "font-weight: 700; color: #1b4332; text-decoration: underline; font-size: 0.95rem;";
      idLink.innerHTML = `👤 ID: ${uid}`;

      const badge = document.createElement("span");
      badge.style.cssText = "font-size: 0.8rem; padding: 3px 8px; border-radius: 12px; background: #e9ecef; color: #495057; font-weight: 500;";
      badge.textContent = "Проверка разрешения...";

      left.appendChild(idLink);
      left.appendChild(badge);

      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.innerHTML = "✕ Удалить";
      delBtn.style.cssText = "background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; border-radius: 6px; padding: 4px 10px; font-size: 0.82rem; cursor: pointer; font-weight: 600;";
      delBtn.addEventListener("click", () => {
        currentRecipients = currentRecipients.filter(id => id !== uid);
        userInput.value = currentRecipients.join(", ");
        saveCurrentConfig();
        renderRecipientsList();
      });

      card.appendChild(left);
      card.appendChild(delBtn);
      recipientsListEl.appendChild(card);

      // Фоновая проверка разрешений через VK API
      if (token && groupId) {
        callVkApi("messages.isMessagesFromGroupAllowed", {
          group_id: groupId,
          user_id: uid,
          access_token: token
        }).then(res => {
          if (res && res.is_allowed === 1) {
            badge.style.background = "#e8f5e9";
            badge.style.color = "#2e7d32";
            badge.innerHTML = "✅ Разрешено (получает заявки)";
          } else {
            badge.style.background = "#fff3e0";
            badge.style.color = "#d97706";
            badge.innerHTML = `⚠️ <a href="https://vk.me/club${groupId}" target="_blank" style="color: inherit; text-decoration: underline;">Нужно написать в лс группы vk.me/club${groupId}</a>`;
          }
        }).catch(() => {
          badge.style.background = "#f1f3f5";
          badge.style.color = "#6c757d";
          badge.textContent = "Статус неизвестен (проверьте токен)";
        });

        // Запрос имени пользователя
        callVkApi("users.get", {
          user_ids: uid,
          access_token: token
        }).then(res => {
          if (Array.isArray(res) && res[0]) {
            idLink.innerHTML = `👤 ${res[0].first_name} ${res[0].last_name} <span style="font-weight: 400; color: #666; font-size: 0.85rem;">(id${uid})</span>`;
          }
        }).catch(() => {});
      }
    }
  }

  function saveCurrentConfig() {
    config.vkNotify = {
      enabled: enabledCheck.checked,
      groupId: groupIdInput ? groupIdInput.value.trim() : "241898656",
      groupToken: tokenInput.value.trim(),
      userId: currentRecipients.join(", "),
      userIds: currentRecipients
    };
    saveSiteConfig(config);
  }

  // Обработчик команды /add
  async function executeAddCommand() {
    if (!addCommandInput) return;
    const rawVal = addCommandInput.value.trim();
    if (!rawVal) {
      if (addStatus) {
        addStatus.style.display = "block";
        addStatus.style.color = "#dc2626";
        addStatus.textContent = "Введите команду в формате /add <id_пользователя>";
      }
      return;
    }

    // Очистка ввода от команды /add, url, префиксов id, @
    let cleanVal = rawVal;
    if (cleanVal.toLowerCase().startsWith("/add")) {
      cleanVal = cleanVal.slice(4).trim();
    }
    cleanVal = cleanVal.replace(/^https?:\/\/(www\.)?vk\.(com|ru)\//i, "");
    cleanVal = cleanVal.replace(/^@/, "");

    if (!cleanVal) {
      if (addStatus) {
        addStatus.style.display = "block";
        addStatus.style.color = "#dc2626";
        addStatus.textContent = "Не указан ID пользователя.";
      }
      return;
    }

    const token = tokenInput.value.trim();
    const groupId = (groupIdInput ? groupIdInput.value.trim() : "") || "241898656";

    if (addStatus) {
      addStatus.style.display = "block";
      addStatus.style.color = "#2563eb";
      addStatus.textContent = "🔍 Поиск пользователя и проверка прав в VK...";
    }

    try {
      let resolvedId = cleanVal;
      let userName = "";

      if (token) {
        try {
          const userRes = await callVkApi("users.get", {
            user_ids: cleanVal,
            access_token: token
          });
          if (Array.isArray(userRes) && userRes.length > 0) {
            resolvedId = String(userRes[0].id);
            userName = `${userRes[0].first_name} ${userRes[0].last_name}`;
          }
        } catch (e) {
          console.warn("User lookup warning:", e);
        }
      }

      // Проверка на числовой ID
      if (!/^\d+$/.test(resolvedId)) {
        if (addStatus) {
          addStatus.style.color = "#dc2626";
          addStatus.textContent = `❌ Не удалось определить числовой ID для «${cleanVal}». Укажите числовой ID, например /add 550394386`;
        }
        return;
      }

      // Добавляем ID в список, если его там еще нет
      if (!currentRecipients.includes(resolvedId)) {
        currentRecipients.push(resolvedId);
        userInput.value = currentRecipients.join(", ");
        saveCurrentConfig();
      }

      addCommandInput.value = "";

      // Проверяем, разрешил ли пользователь сообщения от группы
      let isAllowed = false;
      if (token && groupId) {
        try {
          const checkRes = await callVkApi("messages.isMessagesFromGroupAllowed", {
            group_id: groupId,
            user_id: resolvedId,
            access_token: token
          });
          isAllowed = checkRes && checkRes.is_allowed === 1;
        } catch (e) {}
      }

      renderRecipientsList();

      if (addStatus) {
        addStatus.style.display = "block";
        const displayName = userName ? `${userName} (id${resolvedId})` : `ID ${resolvedId}`;
        if (isAllowed) {
          addStatus.style.color = "#16a34a";
          addStatus.innerHTML = `✅ <strong>${displayName}</strong> успешно добавлен! Сообщения группе разрешены — заявки будут приходить.`;
        } else {
          addStatus.style.color = "#d97706";
          addStatus.innerHTML = `⚠️ <strong>${displayName}</strong> добавлен в список получателей! Но по правилам безопасности ВК он <strong>должен первым написать любое слово в группу</strong> <a href="https://vk.me/club${groupId}" target="_blank" style="text-decoration:underline; font-weight:700;">vk.me/club${groupId}</a>, иначе ВК не разрешит доставку.`;
        }
      }
    } catch (err) {
      if (addStatus) {
        addStatus.style.color = "#dc2626";
        addStatus.textContent = `Ошибка: ${err.message || err}`;
      }
    }
  }

  if (addUserBtn) {
    addUserBtn.addEventListener("click", executeAddCommand);
  }
  if (addCommandInput) {
    addCommandInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        executeAddCommand();
      }
    });
  }

  // Ручное сохранение формы
  document.getElementById("vkForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const parsedIds = userInput.value
      .split(/[\s,;]+/)
      .map(id => String(id).trim())
      .filter(Boolean);
    currentRecipients = Array.from(new Set(parsedIds));
    userInput.value = currentRecipients.join(", ");
    saveCurrentConfig();
    renderRecipientsList();
    alert("Настройки ВКонтакте успешно сохранены!");
  });

  // Отправка тестовой заявки всем получателям
  document.getElementById("vkTestBtn").addEventListener("click", async () => {
    const token = tokenInput.value.trim();
    if (!token) {
      alert("Укажите токен группы ВКонтакте!");
      return;
    }
    if (!currentRecipients.length) {
      alert("Добавьте хотя бы одного получателя через /add!");
      return;
    }

    const testBtn = document.getElementById("vkTestBtn");
    testBtn.disabled = true;
    testBtn.textContent = "Отправка тестовых заявок...";

    let successCount = 0;
    let failCount = 0;
    const errors = [];

    for (const uid of currentRecipients) {
      const randomId = Math.floor(Math.random() * 100000000);
      const text = `🌱 Тестовое оповещение из админ-панели завода «Теплицы ТУТ»!\nГруппа https://vk.ru/club241898656 успешно подключена.\nВаш ID (${uid}) авторизован для получения заявок с сайта.`;

      try {
        await callVkApi("messages.send", {
          user_id: uid,
          message: text,
          random_id: randomId,
          access_token: token
        });
        successCount++;
      } catch (err) {
        failCount++;
        let errMsg = err.error_msg || err.message || "Ошибка";
        if (err.error_code === 901) {
          errMsg = `ID ${uid}: пользователь еще не написал в лс группы vk.me/club241898656 (ошибка 901)`;
        }
        errors.push(errMsg);
      }
      // Небольшая задержка между отправками
      await new Promise(r => setTimeout(r, 350));
    }

    testBtn.disabled = false;
    testBtn.textContent = "Отправить тестовую заявку всем получателям";

    if (failCount === 0) {
      alert(`Успешно! Тестовое сообщение доставлено всем получателям (${successCount} чел.).`);
    } else {
      alert(`Результат отправки:\nУспешно доставлено: ${successCount}\nОшибок: ${failCount}\n\nПодробности:\n${errors.join("\n")}`);
    }
  });

  // Первоначальная отрисовка
  renderRecipientsList();
}

// 5. Telegram
function loadTelegramSettings() {
  const config = getSiteConfig();
  const tg = config.telegramNotify || { enabled: false, botToken: "", chatId: "" };

  const enabledCheck = document.getElementById("tg_enabled");
  const tokenInput = document.getElementById("tg_token");
  const chatInput = document.getElementById("tg_chat");

  enabledCheck.checked = tg.enabled;
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

  document.getElementById("tgTestBtn").addEventListener("click", async () => {
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
          text: "🌱 Тестовое оповещение из админ-панели «Теплицы 76»! Интеграция работает успешно."
        })
      });
      const data = await res.json();
      if (data.ok) {
        alert("Успешно! Тестовое сообщение доставлено в Telegram.");
      } else {
        alert("Ошибка Telegram API: " + data.description);
      }
    } catch (err) {
      alert("Ошибка отправки: " + err.message);
    }
  });
}

// 5. Экспорт / Импорт
function setupExportImport() {
  document.getElementById("exportConfigBtn").addEventListener("click", () => {
    const config = getSiteConfig();
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "teplici76_config_backup.json";
    a.click();
  });

  document.getElementById("importConfigInput").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        saveSiteConfig(imported);
        alert("Конфигурация успешно загружена! Перезагрузка страницы...");
        location.reload();
      } catch (err) {
        alert("Неверный формат JSON файла.");
      }
    };
    reader.readAsText(file);
  });
}

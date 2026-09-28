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

// 4. Telegram
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

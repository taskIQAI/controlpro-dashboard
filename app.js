const STORAGE_KEY = "controlpro-state-v2";
const SHARE_KEY = "controlpro-share-config-v1";
const USERS_KEY = "controlpro-users-v1";
const SESSION_KEY = "controlpro-session-v1";

const config = {
  industries: ["Servicios", "Comercio", "Salud", "Industria", "Logistica", "Educacion"],
  areas: ["Ventas", "Operaciones", "Finanzas", "Atenci\u00f3n", "Producci\u00f3n", "Direcci\u00f3n"],
  stages: ["Prospecto", "Calificado", "Propuesta", "Aprobado", "En proceso", "Entregado", "Cobrado"]
};

const templates = {
  servicios: {
    industry: "Servicios",
    clients: ["Estudio Norte", "Grupo Delta", "Consultora Sur", "Clinica Central", "Agencia Prisma"],
    areas: ["Ventas", "Operaciones", "Finanzas", "Atenci\u00f3n"],
    stages: ["Prospecto", "Propuesta", "Aprobado", "En proceso", "Entregado", "Cobrado"]
  },
  comercio: {
    industry: "Comercio",
    clients: ["Sucursal Centro", "Mayorista Oeste", "Tienda Online", "Distribuidora Sur", "Local Norte"],
    areas: ["Ventas", "Operaciones", "Finanzas", "Atenci\u00f3n"],
    stages: ["Prospecto", "Aprobado", "En proceso", "Entregado", "Cobrado"]
  },
  salud: {
    industry: "Salud",
    clients: ["Paciente Particular", "Obra Social Uno", "Clinica Norte", "Centro Integral", "Empresa Salud"],
    areas: ["Atenci\u00f3n", "Operaciones", "Finanzas", "Direcci\u00f3n"],
    stages: ["Calificado", "Aprobado", "En proceso", "Entregado", "Cobrado"]
  },
  industria: {
    industry: "Industria",
    clients: ["Metalurgica Norte", "Planta Oeste", "Proveedor Delta", "Cliente Exportacion", "Linea Sur"],
    areas: ["Producci\u00f3n", "Operaciones", "Finanzas", "Ventas"],
    stages: ["Propuesta", "Aprobado", "En proceso", "Entregado", "Cobrado"]
  }
};

let session = loadSession();
let state = loadState();
let shareConfig = loadShareConfig();

const money = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0
});

const numberFormat = new Intl.NumberFormat("es-AR");

const el = {
  authScreen: document.querySelector("#authScreen"),
  appShell: document.querySelector("#appShell"),
  loginForm: document.querySelector("#loginForm"),
  registerForm: document.querySelector("#registerForm"),
  loginEmail: document.querySelector("#loginEmail"),
  loginPassword: document.querySelector("#loginPassword"),
  registerName: document.querySelector("#registerName"),
  registerEmail: document.querySelector("#registerEmail"),
  registerPassword: document.querySelector("#registerPassword"),
  registerCompany: document.querySelector("#registerCompany"),
  registerIndustry: document.querySelector("#registerIndustry"),
  accountEmail: document.querySelector("#accountEmail"),
  accountCompany: document.querySelector("#accountCompany"),
  companyBadge: document.querySelector("#companyBadge"),
  userBadge: document.querySelector("#userBadge"),
  periodFilter: document.querySelector("#periodFilter"),
  areaFilter: document.querySelector("#areaFilter"),
  industryFilter: document.querySelector("#industryFilter"),
  sidebarHealth: document.querySelector("#sidebarHealth"),
  revenueKpi: document.querySelector("#revenueKpi"),
  revenueTrend: document.querySelector("#revenueTrend"),
  marginKpi: document.querySelector("#marginKpi"),
  profitKpi: document.querySelector("#profitKpi"),
  processKpi: document.querySelector("#processKpi"),
  processTrend: document.querySelector("#processTrend"),
  clientsKpi: document.querySelector("#clientsKpi"),
  ticketKpi: document.querySelector("#ticketKpi"),
  revenueChart: document.querySelector("#revenueChart"),
  funnelChart: document.querySelector("#funnelChart"),
  areaChart: document.querySelector("#areaChart"),
  insightList: document.querySelector("#insightList"),
  recordsTable: document.querySelector("#recordsTable"),
  taskList: document.querySelector("#taskList"),
  searchInput: document.querySelector("#searchInput"),
  recordForm: document.querySelector("#recordForm"),
  taskForm: document.querySelector("#taskForm"),
  shareEmail: document.querySelector("#shareEmail"),
  sharePhone: document.querySelector("#sharePhone"),
  reportName: document.querySelector("#reportName"),
  shareMessage: document.querySelector("#shareMessage"),
  companyForm: document.querySelector("#companyForm"),
  companyNameInput: document.querySelector("#companyNameInput"),
  companyIndustryInput: document.querySelector("#companyIndustryInput"),
  companyTaxInput: document.querySelector("#companyTaxInput"),
  companyPlanInput: document.querySelector("#companyPlanInput"),
  toast: document.querySelector("#toast")
};

function loadState() {
  const saved = localStorage.getItem(scopedKey(STORAGE_KEY));
  if (saved) {
    try {
      return normalizeState(JSON.parse(saved));
    } catch (error) {
      localStorage.removeItem(scopedKey(STORAGE_KEY));
    }
  }

  return createTemplateState("servicios");
}

function normalizeState(input) {
  const records = Array.isArray(input.records) ? input.records : [];
  const tasks = Array.isArray(input.tasks) ? input.tasks : [];

  return {
    records: records.map((record) => ({
      ...record,
      industry: matchOption(record.industry, config.industries) || record.industry || "Servicios",
      area: matchOption(record.area, config.areas) || record.area || "Ventas",
      stage: matchOption(record.stage, config.stages) || record.stage || "Prospecto",
      amount: Number(record.amount) || 0,
      cost: Number(record.cost) || 0,
      target: Number(record.target) || 0
    })),
    tasks: tasks.map((task) => ({
      ...task,
      area: matchOption(task.area, config.areas) || task.area || "Ventas",
      priority: ["high", "medium", "low"].includes(task.priority) ? task.priority : "medium",
      done: Boolean(task.done)
    }))
  };
}

function saveState() {
  localStorage.setItem(scopedKey(STORAGE_KEY), JSON.stringify(state));
}

function loadShareConfig() {
  const saved = localStorage.getItem(scopedKey(SHARE_KEY));
  if (!saved) return defaultShareConfig();

  try {
    return { ...defaultShareConfig(), ...JSON.parse(saved) };
  } catch (error) {
    localStorage.removeItem(scopedKey(SHARE_KEY));
    return defaultShareConfig();
  }
}

function defaultShareConfig() {
  return {
    email: "",
    phone: "",
    reportName: "Reporte ControlPro",
    message: "Comparto el reporte actualizado para revision."
  };
}

function saveShareConfig() {
  shareConfig = {
    email: el.shareEmail.value.trim(),
    phone: el.sharePhone.value.trim(),
    reportName: el.reportName.value.trim() || "Reporte ControlPro",
    message: el.shareMessage.value.trim() || "Comparto el reporte actualizado para revision."
  };
  localStorage.setItem(scopedKey(SHARE_KEY), JSON.stringify(shareConfig));
}

function scopedKey(baseKey) {
  if (!session) return `${baseKey}:guest`;
  return `${baseKey}:${session.companyId}:${session.userId}`;
}

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch (error) {
    localStorage.removeItem(USERS_KEY);
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch (error) {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

function saveSession(nextSession) {
  session = nextSession;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function createTemplateState(templateName) {
  const template = templates[templateName] || templates.servicios;
  const today = new Date();
  const records = Array.from({ length: 24 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - index * 5);
    const amount = 280000 + index * 47000 + (index % 4) * 85000;
    const cost = Math.round(amount * (0.46 + (index % 3) * 0.07));

    return {
      id: crypto.randomUUID(),
      date: toInputDate(date),
      industry: template.industry,
      area: template.areas[index % template.areas.length],
      client: template.clients[index % template.clients.length],
      stage: template.stages[index % template.stages.length],
      owner: ["Sofia", "Diego", "Laura", "Rafael", "Micaela"][index % 5],
      amount,
      cost,
      target: Math.round(amount * (index % 2 === 0 ? 1.08 : 0.96)),
      next: ["Llamar", "Enviar propuesta", "Revisar entrega", "Confirmar pago"][index % 4]
    };
  });

  const tasks = [
    createTask("Revisar oportunidades sin pr\u00f3ximo paso", "Ventas", "Laura", "high", 1, false),
    createTask("Validar entregas pendientes", "Operaciones", "Diego", "medium", 3, false),
    createTask("Actualizar forecast semanal", "Finanzas", "Sofia", "medium", 5, true),
    createTask("Contactar clientes inactivos", "Atencion", "Rafael", "low", 7, false)
  ];

  return { records, tasks };
}

function createTask(title, area, owner, priority, daysFromNow, done) {
  const due = new Date();
  due.setDate(due.getDate() + daysFromNow);

  return {
    id: crypto.randomUUID(),
    title,
    area,
    owner,
    priority,
    due: toInputDate(due),
    done
  };
}

function toInputDate(date) {
  return date.toISOString().slice(0, 10);
}

function parseNumber(value) {
  const cleaned = String(value || "0").replace(/\./g, "").replace(",", ".");
  return Number(cleaned) || 0;
}

function init() {
  fillSelect(el.areaFilter, ["Todas", ...config.areas], ["all", ...config.areas]);
  fillSelect(el.industryFilter, ["Todos", ...config.industries], ["all", ...config.industries]);
  fillSelect(document.querySelector("#recordIndustry"), config.industries, config.industries);
  fillSelect(document.querySelector("#recordArea"), config.areas, config.areas);
  fillSelect(document.querySelector("#recordStage"), config.stages, config.stages);
  fillSelect(document.querySelector("#taskArea"), config.areas, config.areas);

  document.querySelector("#recordDate").value = toInputDate(new Date());
  document.querySelector("#taskDue").value = toInputDate(new Date());
  el.shareEmail.value = shareConfig.email;
  el.sharePhone.value = shareConfig.phone;
  el.reportName.value = shareConfig.reportName;
  el.shareMessage.value = shareConfig.message;
  applyCompanyConfig();

  bindEvents();
  updateSessionView();
}

function fillSelect(select, labels, values) {
  select.innerHTML = labels.map((label, index) => `<option value="${values[index]}">${label}</option>`).join("");
}

function bindEvents() {
  document.querySelectorAll(".auth-tab").forEach((button) => {
    button.addEventListener("click", () => setAuthTab(button.dataset.authTab));
  });

  el.loginForm.addEventListener("submit", loginWithEmail);
  el.registerForm.addEventListener("submit", registerWithEmail);
  document.querySelector("#googleDemo").addEventListener("click", loginWithGoogleDemo);
  document.querySelector("#logoutButton").addEventListener("click", logout);

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.section));
  });

  [el.periodFilter, el.areaFilter, el.industryFilter].forEach((input) => input.addEventListener("change", render));
  el.searchInput.addEventListener("input", renderRecordsTable);
  el.recordForm.addEventListener("submit", addRecord);
  el.taskForm.addEventListener("submit", addTask);

  document.querySelector("#clearRecords").addEventListener("click", clearRecords);
  document.querySelector("#clearTasks").addEventListener("click", clearTasks);
  document.querySelector("#seedData").addEventListener("click", () => loadTemplate("servicios"));
  document.querySelector("#csvFile").addEventListener("change", importCsv);
  document.querySelector("#downloadCsv").addEventListener("click", exportCsv);
  document.querySelector("#downloadJson").addEventListener("click", exportJson);
  document.querySelector("#downloadExcel").addEventListener("click", exportExcel);
  document.querySelector("#downloadReport").addEventListener("click", exportReportDocument);
  document.querySelector("#sendEmail").addEventListener("click", openEmailDraft);
  document.querySelector("#sendWhatsapp").addEventListener("click", openWhatsappDraft);
  document.querySelector("#shareForm").addEventListener("input", saveShareConfig);
  el.companyForm.addEventListener("submit", saveCompanyConfig);

  document.querySelectorAll(".template-card").forEach((button) => {
    button.addEventListener("click", () => loadTemplate(button.dataset.template));
  });

  el.recordsTable.addEventListener("click", (event) => {
    const id = event.target.dataset.deleteRecord;
    if (id) {
      state.records = state.records.filter((record) => record.id !== id);
      persistAndRender("Movimiento eliminado.");
    }
  });

  el.taskList.addEventListener("click", (event) => {
    const deleteId = event.target.dataset.deleteTask;
    if (deleteId) {
      state.tasks = state.tasks.filter((task) => task.id !== deleteId);
      persistAndRender("Tarea eliminada.");
    }
  });

  el.taskList.addEventListener("change", (event) => {
    const taskId = event.target.dataset.taskDone;
    if (taskId) {
      const task = state.tasks.find((item) => item.id === taskId);
      task.done = event.target.checked;
      persistAndRender(task.done ? "Tarea completada." : "Tarea reabierta.");
    }
  });
}

function setAuthTab(tab) {
  document.querySelectorAll(".auth-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.authTab === tab);
  });
  document.querySelectorAll(".auth-form").forEach((form) => {
    form.classList.toggle("active", form.id === `${tab}Form`);
  });
}

function loginWithEmail(event) {
  event.preventDefault();
  const email = normalizeEmail(el.loginEmail.value);
  const password = el.loginPassword.value;
  const user = loadUsers().find((item) => item.email === email && item.password === password);

  if (!user) {
    showToast("Email o contrase\u00f1a incorrectos.");
    return;
  }

  startSession(user);
  el.loginForm.reset();
  showToast("Sesion iniciada.");
}

function registerWithEmail(event) {
  event.preventDefault();
  const users = loadUsers();
  const email = normalizeEmail(el.registerEmail.value);

  if (users.some((user) => user.email === email)) {
    showToast("Ya existe una cuenta con ese email.");
    return;
  }

  const companyName = el.registerCompany.value.trim();
  const industry = el.registerIndustry.value;
  const user = {
    id: crypto.randomUUID(),
    name: el.registerName.value.trim(),
    email,
    password: el.registerPassword.value,
    provider: "email",
    companyId: crypto.randomUUID(),
    companyName,
    industry,
    taxId: "",
    plan: "starter",
    createdAt: new Date().toISOString()
  };

  users.push(user);
  saveUsers(users);
  startSession(user, industry);
  el.registerForm.reset();
  showToast("Cuenta creada.");
}

function loginWithGoogleDemo() {
  const users = loadUsers();
  let user = users.find((item) => item.provider === "google-demo");

  if (!user) {
    user = {
      id: crypto.randomUUID(),
      name: "Usuario Google Demo",
      email: "usuario.google.demo@controlpro.app",
      password: "",
      provider: "google-demo",
      companyId: crypto.randomUUID(),
      companyName: "Empresa Demo",
      industry: "Servicios",
      taxId: "",
      plan: "starter",
      createdAt: new Date().toISOString()
    };
    users.push(user);
    saveUsers(users);
  }

  startSession(user, user.industry);
  showToast("Sesion demo con Google iniciada.");
}

function startSession(user, preferredIndustry) {
  saveSession({
    userId: user.id,
    email: user.email,
    name: user.name,
    companyId: user.companyId,
    companyName: user.companyName,
    industry: user.industry,
    taxId: user.taxId || "",
    plan: user.plan || "starter",
    provider: user.provider
  });

  state = loadState();
  if (!localStorage.getItem(scopedKey(STORAGE_KEY)) && preferredIndustry) {
    state = createTemplateState(templateFromIndustry(preferredIndustry));
    saveState();
  }
  shareConfig = loadShareConfig();
  applyShareConfig();
  updateSessionView();
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
  session = null;
  state = loadState();
  shareConfig = loadShareConfig();
  updateSessionView();
  showToast("Sesion cerrada.");
}

function updateSessionView() {
  const authenticated = Boolean(session);
  el.authScreen.classList.toggle("is-hidden", authenticated);
  el.appShell.classList.toggle("is-hidden", !authenticated);

  if (!authenticated) {
    return;
  }

  el.accountEmail.textContent = session.email;
  el.accountCompany.textContent = session.companyName;
  el.companyBadge.textContent = session.companyName;
  el.userBadge.textContent = session.name;
  applyCompanyConfig();
  render();
}

function applyShareConfig() {
  el.shareEmail.value = shareConfig.email;
  el.sharePhone.value = shareConfig.phone;
  el.reportName.value = shareConfig.reportName;
  el.shareMessage.value = shareConfig.message;
}

function applyCompanyConfig() {
  if (!session) return;
  el.companyNameInput.value = session.companyName || "";
  el.companyIndustryInput.value = session.industry || "Servicios";
  el.companyTaxInput.value = session.taxId || "";
  el.companyPlanInput.value = session.plan || "starter";
}

function saveCompanyConfig(event) {
  event.preventDefault();
  if (!session) return;

  const nextCompany = {
    companyName: el.companyNameInput.value.trim(),
    industry: el.companyIndustryInput.value,
    taxId: el.companyTaxInput.value.trim(),
    plan: el.companyPlanInput.value
  };

  session = { ...session, ...nextCompany };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  const users = loadUsers().map((user) => {
    if (user.id !== session.userId) return user;
    return { ...user, ...nextCompany };
  });
  saveUsers(users);
  updateSessionView();
  showToast("Datos de empresa guardados.");
}

function templateFromIndustry(industry) {
  const key = normalizeText(industry);
  if (key === "comercio") return "comercio";
  if (key === "salud") return "salud";
  if (key === "industria") return "industria";
  return "servicios";
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function setView(view) {
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.section === view);
  });

  document.querySelectorAll(".section").forEach((section) => {
    section.classList.toggle("active", section.dataset.view === view);
  });
}

function addRecord(event) {
  event.preventDefault();
  const record = {
    id: crypto.randomUUID(),
    date: document.querySelector("#recordDate").value,
    industry: document.querySelector("#recordIndustry").value,
    area: document.querySelector("#recordArea").value,
    client: document.querySelector("#recordClient").value.trim(),
    stage: document.querySelector("#recordStage").value,
    owner: document.querySelector("#recordOwner").value.trim(),
    amount: parseNumber(document.querySelector("#recordAmount").value),
    cost: parseNumber(document.querySelector("#recordCost").value),
    target: parseNumber(document.querySelector("#recordTarget").value),
    next: document.querySelector("#recordNext").value.trim()
  };

  state.records.unshift(record);
  event.target.reset();
  document.querySelector("#recordDate").value = toInputDate(new Date());
  persistAndRender("Movimiento guardado.");
}

function addTask(event) {
  event.preventDefault();
  state.tasks.unshift({
    id: crypto.randomUUID(),
    title: document.querySelector("#taskTitle").value.trim(),
    area: document.querySelector("#taskArea").value,
    owner: document.querySelector("#taskOwner").value.trim(),
    priority: document.querySelector("#taskPriority").value,
    due: document.querySelector("#taskDue").value,
    done: false
  });
  event.target.reset();
  document.querySelector("#taskDue").value = toInputDate(new Date());
  persistAndRender("Tarea guardada.");
}

function clearRecords() {
  if (!state.records.length) return;
  state.records = [];
  persistAndRender("Datos vaciados.");
}

function clearTasks() {
  if (!state.tasks.length) return;
  state.tasks = [];
  persistAndRender("Tareas vaciadas.");
}

function loadTemplate(templateName) {
  state = createTemplateState(templateName);
  persistAndRender("Plantilla cargada.");
  setView("overview");
}

function persistAndRender(message) {
  saveState();
  render();
  showToast(message);
}

function getFilteredRecords() {
  const period = el.periodFilter.value;
  const area = el.areaFilter.value;
  const industry = el.industryFilter.value;
  const now = new Date();

  return state.records.filter((record) => {
    const recordDate = new Date(`${record.date}T00:00:00`);
    const days = Math.floor((now - recordDate) / 86400000);
    const matchesPeriod = period === "all" || days <= Number(period);
    const matchesArea = area === "all" || record.area === area;
    const matchesIndustry = industry === "all" || record.industry === industry;
    return matchesPeriod && matchesArea && matchesIndustry;
  });
}

function render() {
  const records = getFilteredRecords();
  renderKpis(records);
  renderRevenueChart(records);
  renderFunnel(records);
  renderAreaChart(records);
  renderInsights(records);
  renderRecordsTable();
  renderTasks();
}

function renderKpis(records) {
  const revenue = sum(records, "amount");
  const cost = sum(records, "cost");
  const profit = revenue - cost;
  const margin = revenue ? Math.round((profit / revenue) * 100) : 0;
  const target = sum(records, "target");
  const completion = target ? Math.round((revenue / target) * 100) : 0;
  const clients = new Set(records.map((record) => record.client)).size;
  const ticket = records.length ? Math.round(revenue / records.length) : 0;
  const openTasks = state.tasks.filter((task) => !task.done).length;
  const doneTasks = state.tasks.filter((task) => task.done).length;
  const taskRate = state.tasks.length ? Math.round((doneTasks / state.tasks.length) * 100) : 0;

  el.revenueKpi.textContent = money.format(revenue);
  el.revenueTrend.textContent = `${completion}% del objetivo filtrado`;
  el.marginKpi.textContent = `${margin}%`;
  el.profitKpi.textContent = `${money.format(profit)} de utilidad`;
  el.processKpi.textContent = `${taskRate}%`;
  el.processTrend.textContent = `${openTasks} tareas abiertas`;
  el.clientsKpi.textContent = numberFormat.format(clients);
  el.ticketKpi.textContent = `${money.format(ticket)} ticket promedio`;

  const health = taskRate >= 75 && completion >= 90 ? "Saludable" : taskRate >= 50 ? "En seguimiento" : "Cr\u00edtico";
  el.sidebarHealth.textContent = health;
}

function renderRevenueChart(records) {
  const grouped = groupByMonth(records).slice(-6);
  if (!grouped.length) {
    el.revenueChart.innerHTML = empty("Sin datos para graficar.");
    return;
  }

  const max = Math.max(...grouped.flatMap((item) => [item.amount, item.target]), 1);
  el.revenueChart.innerHTML = grouped.map((item) => {
    const actualHeight = Math.round((item.amount / max) * 100);
    const targetHeight = Math.round((item.target / max) * 100);
    return `
      <div class="bar-group" title="${item.label}: ${money.format(item.amount)} real / ${money.format(item.target)} objetivo">
        <div class="bars">
          <span class="bar actual" style="height:${actualHeight}%"></span>
          <span class="bar target" style="height:${targetHeight}%"></span>
        </div>
        <span class="bar-label">${item.label}</span>
      </div>
    `;
  }).join("");
}

function renderFunnel(records) {
  const totals = config.stages.map((stage) => ({
    label: stage,
    value: records.filter((record) => record.stage === stage).length
  })).filter((item) => item.value > 0);

  if (!totals.length) {
    el.funnelChart.innerHTML = empty("Sin etapas registradas.");
    return;
  }

  const max = Math.max(...totals.map((item) => item.value), 1);
  el.funnelChart.innerHTML = totals.map((item) => {
    const width = Math.round((item.value / max) * 100);
    return `
      <div class="funnel-row">
        <strong>${item.label}</strong>
        <div class="track"><div class="fill" style="width:${width}%"></div></div>
        <span>${item.value}</span>
      </div>
    `;
  }).join("");
}

function renderAreaChart(records) {
  const totals = config.areas.map((area) => ({
    label: area,
    value: sum(records.filter((record) => record.area === area), "amount")
  })).filter((item) => item.value > 0).sort((a, b) => b.value - a.value);

  if (!totals.length) {
    el.areaChart.innerHTML = empty("Sin actividad por \u00e1rea.");
    return;
  }

  const max = Math.max(...totals.map((item) => item.value), 1);
  el.areaChart.innerHTML = totals.map((item) => {
    const width = Math.round((item.value / max) * 100);
    return `
      <div class="horizontal-row">
        <div>
          <strong>${item.label}</strong>
          <span>${money.format(item.value)}</span>
        </div>
        <div class="track"><div class="fill alt" style="width:${width}%"></div></div>
      </div>
    `;
  }).join("");
}

function renderInsights(records) {
  const revenue = sum(records, "amount");
  const target = sum(records, "target");
  const overdue = state.tasks.filter((task) => !task.done && new Date(`${task.due}T00:00:00`) < startOfToday()).length;
  const openHigh = state.tasks.filter((task) => !task.done && task.priority === "high").length;
  const uncaptured = records.filter((record) => !["Cobrado", "Entregado"].includes(record.stage)).reduce((total, record) => total + record.amount, 0);
  const insights = [];

  if (target && revenue < target) insights.push(`Los ingresos est\u00e1n ${money.format(target - revenue)} por debajo del objetivo filtrado.`);
  if (overdue) insights.push(`${overdue} tareas est\u00e1n vencidas y requieren seguimiento.`);
  if (openHigh) insights.push(`${openHigh} tareas de prioridad alta siguen abiertas.`);
  if (uncaptured) insights.push(`${money.format(uncaptured)} siguen en etapas previas a entrega o cobro.`);
  if (!insights.length) insights.push("La operaci\u00f3n filtrada no muestra alertas cr\u00edticas.");

  el.insightList.innerHTML = insights.map((item) => `<div class="insight">${item}</div>`).join("");
}

function renderRecordsTable() {
  const search = el.searchInput.value.trim().toLowerCase();
  const records = getFilteredRecords().filter((record) => {
    const haystack = `${record.client} ${record.stage} ${record.owner} ${record.area} ${record.industry}`.toLowerCase();
    return haystack.includes(search);
  });

  if (!records.length) {
    el.recordsTable.innerHTML = `<tr><td class="empty-state" colspan="9">No hay movimientos con esos filtros.</td></tr>`;
    return;
  }

  el.recordsTable.innerHTML = records.map((record) => {
    const margin = record.amount ? Math.round(((record.amount - record.cost) / record.amount) * 100) : 0;
    return `
      <tr>
        <td>${formatDate(record.date)}</td>
        <td>${escapeHtml(record.industry)}</td>
        <td>${escapeHtml(record.area)}</td>
        <td><strong>${escapeHtml(record.client)}</strong><small>${escapeHtml(record.next || "Sin pr\u00f3ximo paso")}</small></td>
        <td><span class="status">${escapeHtml(record.stage)}</span></td>
        <td>${money.format(record.amount)}</td>
        <td>${margin}%</td>
        <td>${escapeHtml(record.owner)}</td>
        <td><button class="row-action" type="button" data-delete-record="${record.id}">Eliminar</button></td>
      </tr>
    `;
  }).join("");
}

function renderTasks() {
  const priorityLabel = { high: "Alta", medium: "Media", low: "Baja" };
  const sorted = [...state.tasks].sort((a, b) => Number(a.done) - Number(b.done) || new Date(a.due) - new Date(b.due));

  if (!sorted.length) {
    el.taskList.innerHTML = empty("Sin tareas registradas.");
    return;
  }

  el.taskList.innerHTML = sorted.map((task) => {
    const overdue = !task.done && new Date(`${task.due}T00:00:00`) < startOfToday();
    return `
      <div class="task ${task.done ? "done" : ""}">
        <input type="checkbox" ${task.done ? "checked" : ""} data-task-done="${task.id}">
        <span>
          <strong>${escapeHtml(task.title)}</strong>
          <span>${escapeHtml(task.area)} &middot; ${escapeHtml(task.owner)} &middot; vence ${formatDate(task.due)}</span>
        </span>
        <span class="badge ${task.priority}">${overdue ? "Vencida" : priorityLabel[task.priority]}</span>
        <button class="row-action" type="button" data-delete-task="${task.id}">Eliminar</button>
      </div>
    `;
  }).join("");
}

function importCsv(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const rows = parseCsv(reader.result);
    if (!rows.length) {
      showToast("El CSV no tiene datos v\u00e1lidos.");
      return;
    }

    state.records = rows.map((row) => ({
      id: crypto.randomUUID(),
      date: row.date || toInputDate(new Date()),
      industry: matchOption(row.industry, config.industries) || row.industry || "Servicios",
      area: matchOption(row.area, config.areas) || row.area || "Ventas",
      client: row.client || "Sin cliente",
      stage: matchOption(row.stage, config.stages) || row.stage || "Prospecto",
      owner: row.owner || "Equipo",
      amount: parseNumber(row.amount),
      cost: parseNumber(row.cost),
      target: parseNumber(row.target),
      next: row.next || ""
    }));
    event.target.value = "";
    persistAndRender("CSV importado.");
  };
  reader.readAsText(file);
}

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = splitCsvLine(lines[0]).map((header) => header.trim().toLowerCase());

  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    return headers.reduce((row, header, index) => {
      row[header] = values[index] || "";
      return row;
    }, {});
  });
}

function splitCsvLine(line) {
  const result = [];
  let current = "";
  let quoted = false;

  for (const char of line) {
    if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function exportCsv() {
  const headers = ["date", "industry", "area", "client", "stage", "owner", "amount", "cost", "target", "next"];
  const rows = state.records.map((record) => headers.map((key) => csvCell(record[key])).join(","));
  downloadFile("controlpro-datos.csv", [headers.join(","), ...rows].join("\n"), "text/csv");
}

function exportJson() {
  downloadFile("controlpro-backup.json", JSON.stringify(state, null, 2), "application/json");
}

function exportExcel() {
  saveShareConfig();
  const records = getFilteredRecords();
  const summary = buildSummary(records);
  const html = buildExcelWorkbook(records, summary);
  downloadFile(`${fileSafe(shareConfig.reportName)}.xls`, html, "application/vnd.ms-excel;charset=utf-8");
  showToast("Excel descargado.");
}

function exportReportDocument() {
  saveShareConfig();
  const records = getFilteredRecords();
  const summary = buildSummary(records);
  downloadFile(`${fileSafe(shareConfig.reportName)}.html`, buildReportHtml(records, summary), "text/html;charset=utf-8");
  showToast("Documento descargado.");
}

function openEmailDraft() {
  saveShareConfig();
  const records = getFilteredRecords();
  const summary = buildSummary(records);
  const subject = encodeURIComponent(shareConfig.reportName);
  const body = encodeURIComponent(buildShareText(summary, "mail"));
  const recipient = encodeURIComponent(shareConfig.email);
  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  showToast("Borrador de mail abierto.");
}

function openWhatsappDraft() {
  saveShareConfig();
  const records = getFilteredRecords();
  const summary = buildSummary(records);
  const phone = shareConfig.phone.replace(/[^\d]/g, "");
  const text = encodeURIComponent(buildShareText(summary, "whatsapp"));
  const url = phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
  window.open(url, "_blank", "noopener");
  showToast("WhatsApp abierto.");
}

function buildSummary(records) {
  const revenue = sum(records, "amount");
  const cost = sum(records, "cost");
  const profit = revenue - cost;
  const target = sum(records, "target");
  const margin = revenue ? Math.round((profit / revenue) * 100) : 0;
  const completion = target ? Math.round((revenue / target) * 100) : 0;
  const clients = new Set(records.map((record) => record.client)).size;
  const openTasks = state.tasks.filter((task) => !task.done).length;
  const overdueTasks = state.tasks.filter((task) => !task.done && new Date(`${task.due}T00:00:00`) < startOfToday()).length;

  return {
    generatedAt: new Date().toLocaleString("es-AR"),
    records: records.length,
    revenue,
    cost,
    profit,
    target,
    margin,
    completion,
    clients,
    openTasks,
    overdueTasks
  };
}

function buildShareText(summary, channel) {
  const lines = [
    shareConfig.message,
    "",
    `${shareConfig.reportName}`,
    `Generado: ${summary.generatedAt}`,
    `Ingresos: ${money.format(summary.revenue)}`,
    `Margen: ${summary.margin}% (${money.format(summary.profit)})`,
    `Cumplimiento objetivo: ${summary.completion}%`,
    `Clientes activos: ${summary.clients}`,
    `Tareas abiertas: ${summary.openTasks}`,
    `Tareas vencidas: ${summary.overdueTasks}`,
    "",
    channel === "mail"
      ? "El archivo Excel o documento HTML debe adjuntarse manualmente desde la descarga."
      : "El archivo Excel o documento HTML queda disponible para adjuntar manualmente."
  ];

  return lines.join("\n");
}

function buildExcelWorkbook(records, summary) {
  const rows = records.map((record) => {
    const margin = record.amount ? Math.round(((record.amount - record.cost) / record.amount) * 100) : 0;
    return `
      <tr>
        <td>${formatDate(record.date)}</td>
        <td>${escapeHtml(record.industry)}</td>
        <td>${escapeHtml(record.area)}</td>
        <td>${escapeHtml(record.client)}</td>
        <td>${escapeHtml(record.stage)}</td>
        <td>${escapeHtml(record.owner)}</td>
        <td>${record.amount}</td>
        <td>${record.cost}</td>
        <td>${record.target}</td>
        <td>${margin}%</td>
        <td>${escapeHtml(record.next)}</td>
      </tr>
    `;
  }).join("");

  return `
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #b7c3cc; padding: 8px; }
          th { background: #eef3f5; }
          .summary td:first-child { font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(shareConfig.reportName)}</h1>
        <table class="summary">
          <tr><td>Generado</td><td>${summary.generatedAt}</td></tr>
          <tr><td>Ingresos</td><td>${summary.revenue}</td></tr>
          <tr><td>Utilidad</td><td>${summary.profit}</td></tr>
          <tr><td>Margen</td><td>${summary.margin}%</td></tr>
          <tr><td>Cumplimiento</td><td>${summary.completion}%</td></tr>
          <tr><td>Clientes activos</td><td>${summary.clients}</td></tr>
          <tr><td>Tareas abiertas</td><td>${summary.openTasks}</td></tr>
        </table>
        <h2>Movimientos</h2>
        <table>
          <thead>
            <tr>
              <th>Fecha</th><th>Rubro</th><th>Area</th><th>Cliente</th><th>Etapa</th><th>Responsable</th>
              <th>Ingreso</th><th>Costo</th><th>Objetivo</th><th>Margen</th><th>Proximo paso</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </body>
    </html>
  `;
}

function buildReportHtml(records, summary) {
  const insights = [
    `Ingresos totales: ${money.format(summary.revenue)}`,
    `Margen estimado: ${summary.margin}%`,
    `Cumplimiento de objetivo: ${summary.completion}%`,
    `Clientes activos: ${summary.clients}`,
    `Tareas abiertas: ${summary.openTasks}`,
    `Tareas vencidas: ${summary.overdueTasks}`
  ];

  const rows = records.map((record) => `
    <tr>
      <td>${formatDate(record.date)}</td>
      <td>${escapeHtml(record.industry)}</td>
      <td>${escapeHtml(record.area)}</td>
      <td>${escapeHtml(record.client)}</td>
      <td>${escapeHtml(record.stage)}</td>
      <td>${money.format(record.amount)}</td>
      <td>${escapeHtml(record.owner)}</td>
    </tr>
  `).join("");

  return `
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8">
        <title>${escapeHtml(shareConfig.reportName)}</title>
        <style>
          body { color: #17202a; font-family: Arial, sans-serif; margin: 32px; }
          h1 { margin-bottom: 4px; }
          .meta { color: #667483; margin-top: 0; }
          .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 24px 0; }
          .card { border: 1px solid #dbe3e8; border-radius: 8px; padding: 14px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border-bottom: 1px solid #dbe3e8; padding: 10px; text-align: left; }
          th { background: #eef3f5; }
          @media print { body { margin: 18mm; } }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(shareConfig.reportName)}</h1>
        <p class="meta">Generado: ${summary.generatedAt}</p>
        <div class="grid">${insights.map((item) => `<div class="card">${item}</div>`).join("")}</div>
        <h2>Movimientos filtrados</h2>
        <table>
          <thead>
            <tr><th>Fecha</th><th>Rubro</th><th>Area</th><th>Cliente</th><th>Etapa</th><th>Ingreso</th><th>Responsable</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </body>
    </html>
  `;
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function fileSafe(value) {
  return String(value || "reporte-controlpro")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase() || "reporte-controlpro";
}

function csvCell(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function groupByMonth(records) {
  const map = new Map();
  records.forEach((record) => {
    const date = new Date(`${record.date}T00:00:00`);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const label = date.toLocaleDateString("es-AR", { month: "short" });
    const item = map.get(key) || { key, label, amount: 0, target: 0 };
    item.amount += record.amount;
    item.target += record.target;
    map.set(key, item);
  });

  return [...map.values()].sort((a, b) => a.key.localeCompare(b.key));
}

function sum(items, key) {
  return items.reduce((total, item) => total + (Number(item[key]) || 0), 0);
}

function matchOption(value, options) {
  const normalizedValue = normalizeText(value);
  return options.find((option) => normalizeText(option) === normalizedValue);
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatDate(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("es-AR");
}

function empty(text) {
  return `<div class="empty-state">${text}</div>`;
}

function showToast(message) {
  el.toast.textContent = message;
  el.toast.classList.add("visible");
  window.setTimeout(() => el.toast.classList.remove("visible"), 2200);
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

init();

const screens = document.querySelectorAll('.screen');
const tabs = document.querySelectorAll('.tab');
const loginBtn = document.getElementById('login-btn');
const roleSelector = document.getElementById('role-selector');
const activeRole = document.getElementById('active-role');
const dashboardCards = document.getElementById('dashboard-cards');
const productsList = document.getElementById('products-list');
const saleProduct = document.getElementById('sale-product');
const confirmSale = document.getElementById('confirm-sale');
const saleQty = document.getElementById('sale-qty');
const historyList = document.getElementById('history-list');
const alertsList = document.getElementById('alerts-list');
const profileCard = document.getElementById('profile-card');

const state = {
  role: 'owner',
  products: [
    { id: 1, name: 'Coca 1L', qty: 18, price: 500 },
    { id: 2, name: 'Sucre 1kg', qty: 7, price: 700 },
    { id: 3, name: 'Riz parfumé', qty: 32, price: 350 }
  ],
  history: [
    '09:15 — Produit “Riz parfumé” ajouté',
    '09:58 — Prix du sucre modifié par Propriétaire',
    '10:32 — 2 Coca vendus par Aïcha'
  ]
};

const dashboardByRole = {
  owner: [
    { label: 'Ventes du jour', value: '127 500 FCFA' },
    { label: 'Stock restant', value: '57 produits' },
    { label: 'Alertes ouvertes', value: '3 alertes' },
    { label: 'Activité vendeuse', value: '34 actions' }
  ],
  seller: [
    { label: 'Mes ventes', value: '42 000 FCFA' },
    { label: 'Produits à vendre', value: '57 produits' },
    { label: 'Objectif du jour', value: '70% atteint' },
    { label: 'Alertes stock', value: '2 alertes' }
  ]
};

function switchScreen(screenName) {
  screens.forEach((screen) => {
    screen.classList.toggle('active', screen.dataset.screen === screenName);
  });

  tabs.forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.screen === screenName);
  });
}

function renderDashboard() {
  dashboardCards.innerHTML = '';
  dashboardByRole[state.role].forEach((item) => {
    const el = document.createElement('article');
    el.className = 'kpi';
    el.innerHTML = `<small>${item.label}</small><strong>${item.value}</strong>`;
    dashboardCards.appendChild(el);
  });
}

function renderProducts() {
  productsList.innerHTML = '';
  saleProduct.innerHTML = '';

  state.products.forEach((product) => {
    const row = document.createElement('article');
    row.className = 'product-item';
    row.innerHTML = `
      <div>
        <strong>${product.name}</strong>
        <p class="muted">Prix: ${product.price} FCFA</p>
      </div>
      <div>
        <small class="muted">Stock</small>
        <div><strong>${product.qty}</strong></div>
      </div>
    `;
    productsList.appendChild(row);

    const option = document.createElement('option');
    option.value = String(product.id);
    option.textContent = `${product.name} (${product.qty} en stock)`;
    saleProduct.appendChild(option);
  });
}

function renderHistory() {
  historyList.innerHTML = '';
  [...state.history].reverse().forEach((entry) => {
    const li = document.createElement('li');
    li.textContent = entry;
    historyList.appendChild(li);
  });
}

function renderAlerts() {
  const lowStock = state.products.filter((p) => p.qty <= 8);
  alertsList.innerHTML = '';

  const items = [
    ...lowStock.map((p) => ({ type: 'warn', text: `Stock bas: ${p.name} (${p.qty} restants)` })),
    { type: 'danger', text: 'Activité suspecte: 7 modifications en 15 min' },
    { type: 'ok', text: 'Synchronisation cloud réussie' }
  ];

  items.forEach((item) => {
    const el = document.createElement('article');
    el.className = `alert-item ${item.type}`;
    el.textContent = item.text;
    alertsList.appendChild(el);
  });
}

function renderProfile() {
  const roleText = state.role === 'owner' ? 'Propriétaire' : 'Vendeuse';
  profileCard.innerHTML = `
    <p><strong>Nom:</strong> Aïcha Ndiaye</p>
    <p><strong>Rôle:</strong> ${roleText}</p>
    <p><strong>Activité du jour:</strong> ${state.history.length + 31} actions</p>
    <p><strong>Score de confiance:</strong> 92 / 100</p>
  `;
}

function hydrate() {
  renderDashboard();
  renderProducts();
  renderHistory();
  renderAlerts();
  renderProfile();
}

loginBtn.addEventListener('click', () => {
  state.role = roleSelector.value;
  activeRole.textContent = state.role === 'owner' ? 'Propriétaire' : 'Vendeuse';
  hydrate();
  switchScreen('dashboard');
});

tabs.forEach((tab) => {
  tab.addEventListener('click', () => switchScreen(tab.dataset.screen));
});

document.querySelectorAll('[data-screen-target]').forEach((btn) => {
  btn.addEventListener('click', () => switchScreen(btn.dataset.screenTarget));
});

confirmSale.addEventListener('click', () => {
  const product = state.products.find((p) => p.id === Number(saleProduct.value));
  const qty = Number(saleQty.value);

  if (!product || qty < 1) {
    return;
  }

  product.qty = Math.max(0, product.qty - qty);
  const now = new Date();
  const stamp = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  state.history.push(`${stamp} — ${qty} ${product.name} vendus par Aïcha`);

  document.getElementById('sale-feedback').textContent = `Vente enregistrée: ${qty} x ${product.name}`;

  hydrate();
});

hydrate();
switchScreen('login');

const user = requireAuth();
let editIndex = null;

if (user) {
  document.getElementById("welcome").innerText = "Bienvenue, " + user.name;
}

function storageKey() {
  return "transactions_" + user.email;
}

function budgetKey() {
  return "budget_" + user.email;
}

function profileKey() {
  return "profile_" + user.email;
}

function getTransactions() {
  return DB.get(storageKey(), []);
}

function saveTransactions(transactions) {
  DB.set(storageKey(), transactions);
}

function calculateTotals(transactions) {
  let income = 0;
  let expense = 0;
  let categoryTotals = {};

  transactions.forEach(t => {
    if (t.type === "income") income += t.amount;
    else {
      expense += t.amount;
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    }
  });

  return {
    income,
    expense,
    balance: income - expense,
    categoryTotals
  };
}

function addTransaction() {
  const desc = document.getElementById("description").value.trim();
  const amount = Number(document.getElementById("amount").value);
  const date = document.getElementById("date").value || new Date().toISOString().slice(0, 10);
  const category = document.getElementById("category").value;
  const type = document.getElementById("type").value;

  if (!desc || amount <= 0) {
    showToast("دخل description و montant صحيح");
    return;
  }

  const transactions = getTransactions();
  const transaction = { desc, amount, date, category, type };

  if (editIndex === null) {
    transactions.push(transaction);
    showToast("Transaction ajoutée");
  } else {
    transactions[editIndex] = transaction;
    editIndex = null;
    showToast("Transaction modifiée");
  }

  saveTransactions(transactions);
  clearForm();
  renderTransactions();
}

function clearForm() {
  document.getElementById("description").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("date").value = "";
}

function deleteTransaction(index) {
  if (!confirm("Bghiti tmsah had transaction?")) return;

  const transactions = getTransactions();
  transactions.splice(index, 1);
  saveTransactions(transactions);
  renderTransactions();
  showToast("Transaction supprimée");
}

function editTransaction(index) {
  const t = getTransactions()[index];

  document.getElementById("description").value = t.desc;
  document.getElementById("amount").value = t.amount;
  document.getElementById("date").value = t.date;
  document.getElementById("category").value = t.category;
  document.getElementById("type").value = t.type;

  editIndex = index;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderTransactions() {
  const transactions = getTransactions();
  const tbody = document.getElementById("transactionTable");
  const search = document.getElementById("search").value.toLowerCase();

  tbody.innerHTML = "";

  transactions.forEach((t, index) => {
    const text = `${t.desc} ${t.category} ${t.type} ${t.date}`.toLowerCase();
    if (!text.includes(search)) return;

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${t.date}</td>
      <td>${t.desc}</td>
      <td>${t.category}</td>
      <td>${t.type === "income" ? "Revenu" : "Dépense"}</td>
      <td class="${t.type === "income" ? "income-text" : "expense-text"}">
        ${t.type === "income" ? "+" : "-"}${t.amount} DH
      </td>
      <td>
        <button class="action-btn" onclick="editTransaction(${index})">✏️</button>
        <button class="action-btn" onclick="deleteTransaction(${index})">🗑️</button>
      </td>
    `;

    tbody.prepend(tr);
  });

  const totals = calculateTotals(transactions);
  document.getElementById("income").innerText = totals.income + " DH";
  document.getElementById("expense").innerText = totals.expense + " DH";
  document.getElementById("balance").innerText = totals.balance + " DH";

  updateBudgetLeft(totals.expense);
  updateCharts(totals.income, totals.expense, totals.categoryTotals);
}

function saveBudget() {
  const budget = Number(document.getElementById("monthlyBudget").value);

  if (budget <= 0) {
    showToast("دخل budget صحيح");
    return;
  }

  DB.set(budgetKey(), budget);
  renderTransactions();
  showToast("Budget sauvegardé");
}

function updateBudgetLeft(expense) {
  const budget = DB.get(budgetKey(), 0);
  document.getElementById("monthlyBudget").value = budget || "";
  document.getElementById("budgetLeft").innerText = (budget - expense) + " DH";

  if (budget > 0 && expense >= budget * 0.8 && expense < budget) {
    showToast("تنبيه: وصلتي لـ 80% من الميزانية");
  }

  if (budget > 0 && expense >= budget) {
    showToast("تنبيه: تعديتي الميزانية الشهرية");
  }
}

function saveProfile() {
  const profile = {
    name: document.getElementById("profileName").value.trim(),
    phone: document.getElementById("profilePhone").value.trim()
  };

  DB.set(profileKey(), profile);

  const users = DB.get("users", []);
  const index = users.findIndex(u => u.email === user.email);

  if (index !== -1) {
    users[index].name = profile.name || users[index].name;
    users[index].phone = profile.phone;
    DB.set("users", users);
    DB.set("currentUser", users[index]);
  }

  showToast("Profile sauvegardé");
}

function loadProfile() {
  const profile = DB.get(profileKey(), user);
  document.getElementById("profileName").value = profile.name || user.name || "";
  document.getElementById("profilePhone").value = profile.phone || "";
}

function showProfile() {
  document.getElementById("profileName").focus();
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 2500);
}

document.getElementById("themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("light");
  DB.set("theme", document.body.classList.contains("light") ? "light" : "dark");
});

function loadTheme() {
  if (DB.get("theme", "dark") === "light") {
    document.body.classList.add("light");
  }
}

loadTheme();
loadProfile();
renderTransactions();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

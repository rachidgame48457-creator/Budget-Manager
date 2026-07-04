const translations = {
  fr: {
    login_title: "Connexion",
    login_btn: "Se connecter",
    no_account: "Pas de compte ?",
    create_account: "Créer un compte",
    register_title: "Créer un compte",
    register_btn: "Créer compte",
    already_account: "Déjà inscrit ?",
    dashboard: "Dashboard",
    profile: "Profile",
    logout: "Logout",
    balance: "Solde",
    income: "Revenus",
    expense: "Dépenses",
    monthly_budget: "Budget mensuel",
    add_transaction: "Ajouter transaction",
    add_btn: "Ajouter / Modifier",
    settings: "Paramètres",
    save: "Sauvegarder",
    save_profile: "Sauvegarder profile",
    chart_income_expense: "Revenus / Dépenses",
    chart_category: "Dépenses par catégorie",
    history: "Historique",
    date: "Date",
    description: "Description",
    category: "Catégorie",
    type: "Type",
    amount: "Montant",
    actions: "Actions"
  },
  ar: {
    login_title: "تسجيل الدخول",
    login_btn: "دخول",
    no_account: "ما عندكش حساب؟",
    create_account: "صايب حساب",
    register_title: "إنشاء حساب",
    register_btn: "إنشاء الحساب",
    already_account: "عندك حساب؟",
    dashboard: "لوحة التحكم",
    profile: "الملف الشخصي",
    logout: "خروج",
    balance: "الرصيد",
    income: "المداخيل",
    expense: "المصاريف",
    monthly_budget: "الميزانية الشهرية",
    add_transaction: "إضافة عملية",
    add_btn: "إضافة / تعديل",
    settings: "الإعدادات",
    save: "حفظ",
    save_profile: "حفظ الملف",
    chart_income_expense: "المداخيل / المصاريف",
    chart_category: "المصاريف حسب النوع",
    history: "السجل",
    date: "التاريخ",
    description: "الوصف",
    category: "النوع",
    type: "الصنف",
    amount: "المبلغ",
    actions: "الإجراءات"
  }
};

function applyLanguage() {
  const lang = DB.get("lang", "fr");
  document.documentElement.lang = lang;
  document.body.dir = lang === "ar" ? "rtl" : "ltr";

  const select = document.getElementById("langSelect");
  if (select) select.value = lang;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (translations[lang][key]) el.innerText = translations[lang][key];
  });
}

function setLanguage(lang) {
  DB.set("lang", lang);
  applyLanguage();
}

document.addEventListener("DOMContentLoaded", applyLanguage);

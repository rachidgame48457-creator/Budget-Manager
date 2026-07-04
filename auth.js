function getUsers() {
  return DB.get("users", []);
}

function setUsers(users) {
  DB.set("users", users);
}

function register() {
  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim().toLowerCase();
  const password = document.getElementById("registerPassword").value;

  if (!name || !email || !password) {
    alert("Remplis tous les champs");
    return;
  }

  if (password.length < 4) {
    alert("Mot de passe khaso ykon 4 caractères au minimum");
    return;
  }

  const users = getUsers();

  if (users.find(u => u.email === email)) {
    alert("Had email deja kayn");
    return;
  }

  users.push({ name, email, password, phone: "" });
  setUsers(users);

  alert("Compte créé avec succès");
  window.location.href = "login.html";
}

function login() {
  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value;

  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    alert("Email ou mot de passe incorrect");
    return;
  }

  DB.set("currentUser", user);
  window.location.href = "dashboard.html";
}

function logout() {
  DB.remove("currentUser");
  window.location.href = "login.html";
}

function requireAuth() {
  const user = DB.get("currentUser", null);

  if (!user && window.location.pathname.includes("dashboard.html")) {
    window.location.href = "login.html";
    return null;
  }

  return user;
}

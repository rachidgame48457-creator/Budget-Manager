const CACHE_NAME = "budget-pro-v1";
const FILES_TO_CACHE = [
  "login.html",
  "register.html",
  "dashboard.html",
  "style.css",
  "dashboard.css",
  "firebase.js",
  "auth.js",
  "lang.js",
  "chart.js",
  "pdf.js",
  "excel.js",
  "app.js",
  "pwa.js",
  "manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

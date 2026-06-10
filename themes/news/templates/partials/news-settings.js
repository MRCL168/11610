/* ============================================================
   partials/news-settings.js — Penyusun data "news settings" (TEMA)
   Membaca config.profile.newsSettings dan mengembalikan objek yang
   sudah dinormalkan + diberi nilai fallback.

   Kontrak: hanya membaca data dari ctx (config/U), tidak ada
   akses filesystem / API.

   Struktur config.profile.newsSettings yang diharapkan:
   {
     "breakingNews": {
       "enabled": true,
       "label": "TERKINI",
       "items": ["Judul berita 1", "Judul berita 2"]
     },
     "heroSection": {
       "enabled": true,
       "count": 5,
       "title": "Berita Utama"
     },
     "categoryBlocks": [
       { "category": "Politik", "count": 4, "layout": "grid" },
       { "category": "Ekonomi", "count": 3, "layout": "magazine" }
     ]
   }
   ============================================================ */

function obj(v) {
  return v && typeof v === "object" && !Array.isArray(v) ? v : {};
}
function arr(v) {
  return Array.isArray(v) ? v : [];
}

// Tautan aman untuk URL internal maupun eksternal.
function navHref(U, url) {
  var u = String(url || "");
  if (!u) return "#";
  if (/^(https?:|mailto:|tel:|#)/i.test(u)) return u;
  return U.url(u);
}

function getNewsSettings(ctx) {
  var config = ctx.config || {};
  var p = obj(config.profile);
  var ns = obj(p.newsSettings);

  /* ---- Breaking news ticker ---- */
  var bnConfig = obj(ns.breakingNews);
  var bnEnabled = bnConfig.enabled !== false;
  var bnItems = arr(bnConfig.items)
    .map(function (s) { return String(s || "").trim(); })
    .filter(Boolean);
  var bnLabel = String(bnConfig.label || "TERKINI").trim();

  /* ---- Hero section ---- */
  var heroConfig = obj(ns.heroSection);
  var heroEnabled = heroConfig.enabled !== false;
  var heroCount = Math.max(1, parseInt(heroConfig.count || 5, 10));
  var heroTitle = String(heroConfig.title || "Berita Utama").trim();

  /* ---- Category blocks ---- */
  var catBlocks = arr(ns.categoryBlocks)
    .filter(function (b) { return b && String(b.category || "").trim(); })
    .map(function (b) {
      var layout = String(b.layout || "grid").toLowerCase();
      if (layout !== "magazine" && layout !== "list") layout = "grid";
      return {
        category: String(b.category).trim(),
        title: String(b.title || b.category).trim(),
        layout: layout,
        count: Math.max(1, parseInt(b.count || 4, 10))
      };
    });

  return {
    breakingNews: (bnEnabled && bnItems.length)
      ? { label: bnLabel, items: bnItems }
      : null,
    heroEnabled: heroEnabled,
    heroCount: heroCount,
    heroTitle: heroTitle,
    categoryBlocks: catBlocks
  };
}

module.exports = { getNewsSettings: getNewsSettings, navHref: navHref };

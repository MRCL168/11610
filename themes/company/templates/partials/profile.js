/* ============================================================
   partials/profile.js — Penyusun data "company profile" (TEMA)
   Membaca config.profile (opsional) dan mengembalikan objek yang
   sudah dinormalkan + diberi nilai fallback dari config dasar,
   sehingga beranda tetap rapi walau profile tidak diisi.

   Catatan kontrak: ini HANYA membaca data dari ctx (config/U).
   Tidak ada akses filesystem / API — itu urusan inti.
   ============================================================ */

// Tautan aman untuk URL internal (diawali basePath) maupun eksternal.
function navHref(U, url) {
  var u = String(url || "");
  if (!u) return "#";
  if (/^(https?:|mailto:|tel:|#)/i.test(u)) return u;
  return U.url(u);
}

function obj(v) {
  return v && typeof v === "object" && !Array.isArray(v) ? v : {};
}
function arr(v) {
  return Array.isArray(v) ? v : [];
}

function getProfile(ctx) {
  var config = ctx.config || {};
  var p = obj(config.profile);
  var social = obj(config.social);

  var defaultPrimaryUrl = social.email ? "mailto:" + social.email : "/about/";

  var pc = obj(p.primaryCta);
  var sc = obj(p.secondaryCta);
  var about = obj(p.about);
  var band = obj(p.ctaBand);
  var bandBtn = obj(band.button);

  var stats = arr(p.stats).filter(function (s) { return s && (s.value || s.label); });
  var services = arr(p.services).filter(function (s) { return s && (s.title || s.text); });
  var aboutPoints = arr(about.points).filter(Boolean);

  var hasAbout = !!(about.text || aboutPoints.length);
  var hasBand = !!(band.title || band.text);
  var hasSecondary = !!(sc.text || sc.url);

  return {
    eyebrow: p.eyebrow || "Selamat Datang",
    headline: p.headline || config.title || "",
    subheadline: p.subheadline || config.description || config.tagline || "",
    heroImage: p.heroImage || "",
    heroBackground: p.heroBackground || "",

    primaryCta: {
      text: pc.text || "Hubungi Kami",
      url: pc.url || defaultPrimaryUrl,
    },
    secondaryCta: hasSecondary ? { text: sc.text || "Selengkapnya", url: sc.url || "#" } : null,

    stats: stats,
    hasStats: stats.length >= 2,

    servicesTitle: p.servicesTitle || "Layanan Kami",
    servicesEyebrow: p.servicesEyebrow || "Apa yang kami lakukan",
    servicesIntro: p.servicesIntro || "",
    services: services,
    hasServices: services.length > 0,

    about: hasAbout
      ? {
          eyebrow: about.eyebrow || "Tentang Kami",
          title: about.title || "Mitra tepercaya untuk pertumbuhan Anda",
          text: about.text || "",
          image: about.image || "",
          points: aboutPoints,
        }
      : null,

    ctaBand: hasBand
      ? {
          title: band.title || "",
          text: band.text || "",
          button: { text: bandBtn.text || "Hubungi Kami", url: bandBtn.url || defaultPrimaryUrl },
        }
      : null,
  };
}

module.exports = { getProfile, navHref };

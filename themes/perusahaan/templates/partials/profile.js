/* ============================================================
   partials/profile.js — Penyusun data "profil perusahaan" (TEMA)
   Membaca ctx.themeContent (isi dari menu Sesuaikan), lalu MENGGABUNG
   dengan konten default bawaan (defaults.js, bertema GudangWEB) per
   field. Aturannya: nilai dari pengguna SELALU menang; bila kosong,
   dipakai nilai default agar tema langsung tampil utuh saat pertama
   diaktifkan.

   Kontrak emas: HANYA membaca data dari ctx (themeContent/config/U).
   TIDAK ada akses GitHub API / filesystem / routing — itu urusan inti.
   ============================================================ */

var D = require("./defaults");

function navHref(U, url) {
  var u = String(url || "");
  if (!u) return "#";
  if (/^(https?:|mailto:|tel:|#)/i.test(u)) return u;
  return U.url(u);
}

function obj(v) { return v && typeof v === "object" && !Array.isArray(v) ? v : {}; }
function arr(v) { return Array.isArray(v) ? v : []; }
function str(v) { return v == null ? "" : String(v); }

/* ---------- Sumber konten tema ----------
   Inti memetakan data tema aktif ke ctx.themeContent (juga di-mirror
   ke config.profile). Baca themeContent dulu; bila kosong, fallback ke
   config.profile. Diekspor agar sidebar.js memakai sumber yang sama. */
function getContent(ctx) {
  var c = obj(ctx.themeContent);
  if (Object.keys(c).length) return c;
  return obj((ctx.config || {}).profile);
}

// Normalkan satu slide (mendukung field datar dari Customizer).
function normSlide(s) {
  s = obj(s);
  return {
    image: str(s.image),
    kicker: str(s.kicker),
    title: str(s.title),
    subtitle: str(s.subtitle),
    primary: { text: str(s.btnText), url: str(s.btnUrl) },
    secondary: { text: str(s.btn2Text), url: str(s.btn2Url) }
  };
}

function getProfile(ctx) {
  var config = ctx.config || {};
  var c = getContent(ctx);
  var social = obj(config.social);
  var defaultPrimaryUrl = social.email ? "mailto:" + social.email : "/kontak/";

  /* -------- Hero slider (fallback ke default GudangWEB) -------- */
  var slidesSrc = arr(c.slides).filter(function (s) { return s && (s.title || s.subtitle || s.image); });
  if (!slidesSrc.length) slidesSrc = D.slides;
  var rawSlides = slidesSrc.map(normSlide);

  var heroAutoplay = c.heroAutoplay !== false; // default menyala
  var interval = parseInt(c.heroInterval, 10);
  if (!interval || isNaN(interval)) interval = D.heroInterval;
  interval = Math.max(3, Math.min(15, interval));

  /* -------- Statistik -------- */
  var stats = arr(c.stats).filter(function (s) { return s && (s.value || s.label); });
  if (!stats.length) stats = D.stats;

  /* -------- Profil / Tentang (gabung field dengan default) -------- */
  var aboutC = obj(c.about);
  var aboutPoints = arr(aboutC.points).filter(Boolean);
  if (!aboutPoints.length) aboutPoints = D.about.points;
  var about = {
    eyebrow: aboutC.eyebrow || D.about.eyebrow,
    title: aboutC.title || D.about.title,
    text: aboutC.text || D.about.text,
    image: aboutC.image || D.about.image,
    points: aboutPoints
  };

  /* -------- Layanan -------- */
  var services = arr(c.services)
    .filter(function (s) { return s && (s.title || s.text); })
    .map(function (s) { return { icon: s.icon || "spark", title: str(s.title), text: str(s.text), url: str(s.url) }; });
  if (!services.length) {
    services = D.services.map(function (s) { return { icon: s.icon, title: s.title, text: s.text, url: s.url }; });
  }

  /* -------- Berita / Wawasan -------- */
  var newsCount = parseInt(c.newsCount, 10);
  if (!newsCount || isNaN(newsCount)) newsCount = D.newsCount;
  newsCount = Math.max(1, Math.min(9, newsCount));
  var newsEnabled = c.newsEnabled !== false;

  /* -------- FAQ (beranda) -------- */
  var faqC = obj(c.faq);
  var faqEnabled = faqC.enabled !== false; // default tampil
  var faqItems = arr(faqC.items)
    .filter(function (f) { return f && f.q; })
    .map(function (f) { return { q: str(f.q), a: str(f.a) }; });
  if (!faqItems.length) faqItems = D.faq.items;
  var faq = (faqEnabled && faqItems.length)
    ? {
        eyebrow: faqC.eyebrow || D.faq.eyebrow,
        title: faqC.title || D.faq.title,
        intro: faqC.intro || D.faq.intro,
        items: faqItems
      }
    : null;

  /* -------- CTA Band -------- */
  var bandC = obj(c.ctaBand);
  var bandBtnC = obj(bandC.button);
  var ctaBand = {
    title: bandC.title || D.ctaBand.title,
    text: bandC.text || D.ctaBand.text,
    button: { text: bandBtnC.text || D.ctaBand.button.text, url: bandBtnC.url || D.ctaBand.button.url }
  };

  /* -------- Tombol CTA header -------- */
  var hcC = obj(c.headerCta);
  var headerCtaShow = hcC.show !== false && hcC.enabled !== false;
  var headerCta = {
    show: headerCtaShow,
    text: hcC.text || D.headerCta.text,
    url: hcC.url || D.headerCta.url
  };

  /* -------- Kontak + peta (gabung field dengan default) -------- */
  var ctC = obj(c.contact);
  var dC = D.contact;
  var contact = {
    eyebrow: ctC.eyebrow || dC.eyebrow,
    title: ctC.title || dC.title,
    intro: ctC.intro || dC.intro,
    address: ctC.address || dC.address,
    phone: ctC.phone || dC.phone,
    whatsapp: ctC.whatsapp || dC.whatsapp,
    email: ctC.email || dC.email,
    hours: ctC.hours || dC.hours,
    mapEmbed: ctC.mapEmbed || dC.mapEmbed,
    mapsUrl: ctC.mapsUrl || dC.mapsUrl
  };

  return {
    slides: rawSlides,
    heroAutoplay: heroAutoplay,
    heroInterval: interval,

    primaryCtaUrl: defaultPrimaryUrl,

    stats: stats,
    hasStats: stats.length >= 2,

    about: about,

    servicesEyebrow: c.servicesEyebrow || D.servicesEyebrow,
    servicesTitle: c.servicesTitle || D.servicesTitle,
    servicesIntro: c.servicesIntro || D.servicesIntro,
    services: services,
    hasServices: services.length > 0,

    newsEnabled: newsEnabled,
    newsEyebrow: c.newsEyebrow || D.newsEyebrow,
    newsTitle: c.newsTitle || D.newsTitle,
    newsIntro: c.newsIntro || D.newsIntro,
    newsCount: newsCount,

    ctaBand: ctaBand,
    headerCta: headerCta,
    contact: contact,
    faq: faq
  };
}

module.exports = { getProfile: getProfile, getContent: getContent, navHref: navHref, obj: obj, arr: arr, str: str };

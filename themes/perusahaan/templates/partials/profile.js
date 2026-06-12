/* ============================================================
   partials/profile.js — Penyusun data "profil perusahaan" (TEMA)
   Membaca ctx.themeContent (isi dari menu Sesuaikan) lalu
   mengembalikan objek yang sudah dinormalkan + diberi nilai
   fallback, sehingga beranda tetap rapi walau belum diisi.

   Kontrak emas: ini HANYA membaca data dari ctx (themeContent/
   config/U). TIDAK ada akses GitHub API / filesystem / routing —
   itu sepenuhnya urusan inti.
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
function str(v) {
  return v == null ? "" : String(v);
}

/* ---------- Sumber konten tema ----------
   Inti memetakan data tema aktif ke ctx.themeContent (juga di-mirror
   ke config.profile demi kompatibilitas). Baca themeContent dulu,
   fallback ke config.profile bila kosong. */
function getContent(ctx) {
  var c = obj(ctx.themeContent);
  if (Object.keys(c).length) return c;
  return obj((ctx.config || {}).profile);
}

function getProfile(ctx) {
  var config = ctx.config || {};
  var c = getContent(ctx);
  var social = obj(config.social);

  var defaultPrimaryUrl = social.email ? "mailto:" + social.email : "/kontak/";

  /* -------- Hero slider --------
     Tiap slide: { image, kicker, title, subtitle, btnText, btnUrl,
     btn2Text, btn2Url }. Bila daftar slide kosong, sintesis SATU slide
     dari headline/subheadline agar hero tetap tampil utuh. */
  var rawSlides = arr(c.slides)
    .map(function (s) {
      s = obj(s);
      return {
        image: str(s.image),
        kicker: str(s.kicker),
        title: str(s.title),
        subtitle: str(s.subtitle),
        primary: { text: str(s.btnText), url: str(s.btnUrl) },
        secondary: { text: str(s.btn2Text), url: str(s.btn2Url) },
      };
    })
    .filter(function (s) { return s.title || s.subtitle || s.image; });

  if (!rawSlides.length) {
    // Fallback satu slide dari field dasar (kompatibel data company lama).
    var pc = obj(c.primaryCta);
    var sc = obj(c.secondaryCta);
    rawSlides = [{
      image: str(c.heroBackground) || str(c.heroImage),
      kicker: str(c.eyebrow) || "Profil Perusahaan",
      title: str(c.headline) || str(config.title) || "Perusahaan Anda",
      subtitle: str(c.subheadline) || str(config.description) || str(config.tagline),
      primary: { text: str(pc.text) || "Hubungi Kami", url: str(pc.url) || defaultPrimaryUrl },
      secondary: { text: str(sc.text), url: str(sc.url) },
    }];
  }

  // Autoplay & interval slider (detik). Interval dibatasi 3–15 dtk.
  var heroAutoplay = c.heroAutoplay !== false; // default menyala
  var interval = parseInt(c.heroInterval, 10);
  if (!interval || isNaN(interval)) interval = 6;
  interval = Math.max(3, Math.min(15, interval));

  /* -------- Statistik -------- */
  var stats = arr(c.stats).filter(function (s) { return s && (s.value || s.label); });

  /* -------- Profil / Tentang -------- */
  var about = obj(c.about);
  var aboutPoints = arr(about.points).filter(Boolean);
  var hasAbout = !!(about.text || about.title || aboutPoints.length);

  /* -------- Layanan -------- */
  var services = arr(c.services)
    .filter(function (s) { return s && (s.title || s.text); })
    .map(function (s) {
      return { icon: s.icon || "spark", title: str(s.title), text: str(s.text), url: str(s.url) };
    });

  /* -------- Berita / Wawasan (memakai posts dari inti) -------- */
  var newsCount = parseInt(c.newsCount, 10);
  if (!newsCount || isNaN(newsCount)) newsCount = 3;
  newsCount = Math.max(1, Math.min(9, newsCount));
  var newsEnabled = c.newsEnabled !== false; // default tampil bila ada artikel

  /* -------- CTA Band -------- */
  var band = obj(c.ctaBand);
  var bandBtn = obj(band.button);
  var hasBand = !!(band.title || band.text);

  /* -------- Tombol CTA header -------- */
  var hc = obj(c.headerCta);
  var headerCtaShow = hc.show !== false && hc.enabled !== false;

  /* -------- Kontak + peta -------- */
  var ct = obj(c.contact);
  var contact = {
    eyebrow: str(ct.eyebrow) || "Kontak",
    title: str(ct.title) || "Hubungi Kami",
    intro: str(ct.intro),
    address: str(ct.address),
    phone: str(ct.phone),
    whatsapp: str(ct.whatsapp),
    email: str(ct.email),
    hours: str(ct.hours),
    mapEmbed: str(ct.mapEmbed),
    mapsUrl: str(ct.mapsUrl),
  };

  return {
    slides: rawSlides,
    heroAutoplay: heroAutoplay,
    heroInterval: interval,

    primaryCtaUrl: defaultPrimaryUrl,

    stats: stats,
    hasStats: stats.length >= 2,

    about: hasAbout
      ? {
          eyebrow: about.eyebrow || "Tentang Kami",
          title: about.title || "Mitra tepercaya untuk pertumbuhan Anda",
          text: about.text || "",
          image: about.image || "",
          points: aboutPoints,
        }
      : null,

    servicesEyebrow: c.servicesEyebrow || "Apa yang kami lakukan",
    servicesTitle: c.servicesTitle || "Layanan Kami",
    servicesIntro: c.servicesIntro || "",
    services: services,
    hasServices: services.length > 0,

    newsEnabled: newsEnabled,
    newsEyebrow: c.newsEyebrow || "Wawasan",
    newsTitle: c.newsTitle || "Berita & Artikel Terbaru",
    newsIntro: c.newsIntro || "",
    newsCount: newsCount,

    ctaBand: hasBand
      ? {
          title: band.title || "",
          text: band.text || "",
          button: { text: bandBtn.text || "Hubungi Kami", url: bandBtn.url || defaultPrimaryUrl },
        }
      : null,

    headerCta: {
      show: headerCtaShow,
      text: hc.text || "Hubungi Kami",
      url: hc.url || defaultPrimaryUrl,
    },

    contact: contact,
  };
}

module.exports = { getProfile, navHref, obj: obj, arr: arr, str: str };

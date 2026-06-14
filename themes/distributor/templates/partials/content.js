/* ============================================================
   partials/content.js — Penyusun data konten tema "Distributor" (TEMA)
   Membaca data Customizer (ctx.themeContent / ctx.config.profile) lalu
   mengembalikan objek yang sudah dinormalkan + diberi nilai fallback,
   sehingga halaman tetap rapi meski sebagian field belum diisi.

   Kontrak emas: file ini HANYA membaca data dari ctx (config/themeContent).
   Tidak ada akses GitHub API / filesystem / routing — itu urusan inti.

   Kunci field di sini WAJIB sinkron dengan `key` pada blok customize di
   theme.json (lihat CUSTOMIZER.md). Jalur bertitik (mis. "hero.title")
   pada skema disimpan sebagai objek bersarang dan dibaca di sini.
   ============================================================ */

/* ---------- Util kecil ---------- */
function obj(v) { return v && typeof v === "object" && !Array.isArray(v) ? v : {}; }
function arr(v) { return Array.isArray(v) ? v : []; }
function str(v) { return v == null ? "" : String(v); }
function bool(v, dflt) { return v === undefined || v === null ? !!dflt : v !== false; }

// Tautan aman untuk URL internal (diawali basePath) maupun eksternal/anchor.
function navHref(U, url) {
  var u = str(url);
  if (!u) return "#";
  if (/^(https?:|mailto:|tel:|#)/i.test(u)) return u;
  return U.url(u);
}

// Normalkan nomor telepon → hanya angka (untuk wa.me & tel:).
function digits(v) { return str(v).replace(/[^0-9]/g, ""); }

// Bangun tautan WhatsApp dengan pesan awal (text) yang sudah di-encode.
function waLink(number, text) {
  var n = digits(number);
  if (!n) return "";
  var base = "https://wa.me/" + n;
  return text ? base + "?text=" + encodeURIComponent(text) : base;
}

// Ambil sumber data konten tema: utamakan ctx.themeContent (rekomendasi inti),
// fallback ke ctx.config.profile (kompatibilitas dengan pola lama).
function source(ctx) {
  var tc = obj(ctx && ctx.themeContent);
  if (Object.keys(tc).length) return tc;
  return obj(ctx && ctx.config && ctx.config.profile);
}

/* ---------- Resolusi kontak terpusat ----------
   Prioritas: data Lokasi → data Sidebar → config.social.
   Dipakai kartu produk, sidebar, seksi lokasi, dan footer CTA. */
function resolveContact(ctx) {
  var c = source(ctx);
  var social = obj(ctx && ctx.config && ctx.config.social);
  var loc = obj(c.location);
  var sb = obj(c.sidebar);

  var phone = str(loc.phone || sb.phone || "");
  var whatsapp = str(loc.whatsapp || sb.whatsapp || "");
  var email = str(loc.email || sb.email || social.email || "");
  var address = str(loc.address || sb.address || "");
  return { phone: phone, whatsapp: whatsapp, email: email, address: address };
}

/* ---------- Pembaca utama: getContent(ctx) ----------
   Mengembalikan struktur lengkap untuk beranda + komponen tema. */
function getContent(ctx) {
  var config = obj(ctx && ctx.config);
  var c = source(ctx);

  var hero = obj(c.hero);
  var heroPrimary = obj(hero.primaryCta);
  var heroSecondary = obj(hero.secondaryCta);
  var heroSlides = arr(hero.slides)
    .map(function (s) { s = obj(s); return { image: str(s.image), alt: str(s.alt) }; })
    .filter(function (s) { return s.image; });

  var topbar = obj(c.topbar);

  var features = obj(c.features);
  var featureItems = arr(features.items)
    .map(function (f) { f = obj(f); return { icon: str(f.icon) || "box", title: str(f.title), text: str(f.text) }; })
    .filter(function (f) { return f.title || f.text; });

  var profile = obj(c.profile);
  var profilePoints = arr(profile.points).map(str).filter(Boolean);
  var profileBtn = obj(profile.button);

  var catalog = obj(c.catalog);
  var catCount = parseInt(catalog.count, 10);
  if (!(catCount > 0)) catCount = 6;
  var catCols = parseInt(catalog.columns, 10);
  if (!(catCols >= 2 && catCols <= 4)) catCols = 3;

  var location = obj(c.location);
  var cta = obj(c.cta);
  var ctaBtn = obj(cta.button);

  var hc = obj(c.headerCta);

  var contact = resolveContact(ctx);
  var defaultPrimaryUrl = contact.whatsapp
    ? waLink(contact.whatsapp, "Halo, saya ingin bertanya tentang produk Anda.")
    : (contact.email ? "mailto:" + contact.email : "/about/");

  return {
    /* --- Topbar (bar kontak tipis di atas header) --- */
    topbar: {
      enabled: bool(topbar.enabled, false),
      text: str(topbar.text),
      phone: str(topbar.phone || contact.phone),
      whatsapp: str(topbar.whatsapp || contact.whatsapp),
    },

    /* --- Hero (slider fullwidth + teks) --- */
    hero: {
      eyebrow: str(hero.eyebrow) || "Distributor Resmi",
      title: str(hero.title) || config.title || "Distributor & Supplier Terpercaya",
      subtitle: str(hero.subtitle) || config.description || config.tagline || "",
      slides: heroSlides,
      autoplay: bool(hero.autoplay, true),
      interval: (parseInt(hero.interval, 10) || 5),
      primaryCta: { text: str(heroPrimary.text) || "Lihat Katalog", url: heroPrimary.url || "#katalog" },
      secondaryCta: (heroSecondary.text || heroSecondary.url)
        ? { text: str(heroSecondary.text) || "Hubungi Kami", url: heroSecondary.url || defaultPrimaryUrl }
        : null,
    },

    /* --- Fitur / Keunggulan (ikon di samping kiri) --- */
    features: featureItems.length
      ? {
          eyebrow: str(features.eyebrow) || "Kenapa Memilih Kami",
          title: str(features.title) || "Keunggulan Layanan Distribusi Kami",
          intro: str(features.intro),
          items: featureItems,
        }
      : null,

    /* --- Profil Singkat + foto --- */
    profile: (profile.text || profilePoints.length || profile.image)
      ? {
          eyebrow: str(profile.eyebrow) || "Tentang Kami",
          title: str(profile.title) || "Mitra distribusi yang tumbuh bersama bisnis Anda",
          text: str(profile.text),
          image: str(profile.image),
          points: profilePoints,
          button: (profileBtn.text || profileBtn.url)
            ? { text: str(profileBtn.text) || "Selengkapnya", url: profileBtn.url || "/about/" }
            : null,
        }
      : null,

    /* --- Grid Produk / Katalog (data dari post) --- */
    catalog: {
      eyebrow: str(catalog.eyebrow) || "Katalog",
      title: str(catalog.title) || "Produk Unggulan Kami",
      intro: str(catalog.intro),
      count: catCount,
      columns: catCols,
      viewAllText: str(catalog.viewAllText) || "Lihat Semua Produk",
      viewAllUrl: catalog.viewAllUrl || "",
    },

    /* --- Lokasi + Kontak --- */
    location: {
      eyebrow: str(location.eyebrow) || "Kunjungi Kami",
      title: str(location.title) || "Lokasi & Kontak",
      text: str(location.text),
      address: str(location.address || contact.address),
      phone: str(location.phone || contact.phone),
      whatsapp: str(location.whatsapp || contact.whatsapp),
      email: str(location.email || contact.email),
      hours: str(location.hours),
      mapEmbed: str(location.mapEmbed),
      mapUrl: str(location.mapUrl),
    },

    /* --- CTA band penutup --- */
    cta: (cta.title || cta.text)
      ? {
          title: str(cta.title) || "Butuh penawaran harga grosir?",
          text: str(cta.text),
          button: { text: str(ctaBtn.text) || "Minta Penawaran", url: ctaBtn.url || defaultPrimaryUrl },
        }
      : null,

    /* --- Tombol CTA di header (disembunyikan di mobile via CSS) --- */
    headerCta: {
      show: bool(hc.show, true),
      text: str(hc.text) || "Hubungi Kami",
      url: hc.url || defaultPrimaryUrl,
    },

    // Disediakan agar template lain bisa langsung memakai hasil resolusi kontak.
    contact: contact,
    defaultPrimaryUrl: defaultPrimaryUrl,
  };
}

module.exports = {
  getContent: getContent,
  navHref: navHref,
  waLink: waLink,
  digits: digits,
  resolveContact: resolveContact,
  source: source,
};

/* ============================================================
   partials/property.js — Penyusun data tema Gitproperty (TEMA)
   Dua tugas, KEDUANYA murni membaca dari ctx (tanpa akses
   filesystem / API — itu urusan inti):

   1) getHome(ctx): membaca konten Customizer (ctx.themeContent /
      ctx.config.profile) lalu mengembalikan objek beranda yang sudah
      dinormalkan + diberi default + toggle tampil/sembunyi per seksi,
      DAN sudah memisahkan kumpulan post menjadi:
        - featured (Property Unggulan)
        - latest   (Property Terbaru)
        - news     (Berita)
      beserta daftar pilihan filter (tipe & lokasi) untuk pencarian.

   2) Helper properti: isProperty(), propData(), format harga, dll.

   KONVENSI FRONTMATTER POST PROPERTI (lihat README tema):
     properti: true            → menandai post sebagai listing properti
     unggulan: true            → tampil di Property Unggulan
     tipe_properti: "Rumah"    → Rumah | Tanah | Apartemen | Ruko | Villa | ...
     tipe_listing: "Dijual"    → Dijual | Disewa
     harga: 1250000000         → angka Rupiah (boleh string "1.250.000.000")
     harga_satuan: "/bulan"    → opsional, mis. untuk sewa
     lokasi: "Tangerang"       → kota / area (jadi pilihan filter)
     alamat: "Jl. ..."         → alamat lengkap (opsional)
     kamar_tidur: 3            → jumlah kamar tidur
     kamar_mandi: 2            → jumlah kamar mandi
     luas_bangunan: 90         → m²
     luas_tanah: 120           → m²
     carport: 1               → opsional
     sertifikat: "SHM"        → opsional
     maps: "https://..."      → opsional (tautan Google Maps)
     whatsapp: "62812..."     → opsional override kontak WA
   ============================================================ */

/* ---------- Util kecil ---------- */
function obj(v) { return v && typeof v === "object" && !Array.isArray(v) ? v : {}; }
function arr(v) { return Array.isArray(v) ? v : []; }
function str(v) { return v == null ? "" : String(v); }
function bool(v, dflt) { return v === undefined || v === null ? !!dflt : v !== false && v !== "false" && v !== 0; }
function intval(v, dflt) {
  var n = parseInt(v, 10);
  return isNaN(n) ? (dflt || 0) : n;
}

// Tautan aman untuk URL internal (diawali basePath) maupun eksternal.
function navHref(U, url) {
  var u = str(url);
  if (!u) return "#";
  if (/^(https?:|mailto:|tel:|#)/i.test(u)) return u;
  return U.url(u);
}

/* ---------- Harga ---------- */
// Ambil nilai numerik dari harga (number langsung, atau string dengan
// titik ribuan ala Indonesia "1.250.000.000" / "Rp 850.000.000").
function parsePrice(v) {
  if (typeof v === "number" && isFinite(v)) return v;
  var digits = str(v).replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

// Format penuh: 1250000000 → "Rp 1.250.000.000"
function formatPrice(n) {
  n = parsePrice(n);
  if (!n) return "";
  var s = String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return "Rp " + s;
}

// Format ringkas untuk kartu: 1250000000 → "Rp 1,25 M", 850000000 → "Rp 850 Jt".
function formatPriceShort(n) {
  n = parsePrice(n);
  if (!n) return "";
  function trim(x) { return String(x).replace(/\.0$/, "").replace(".", ","); }
  if (n >= 1000000000) return "Rp " + trim((Math.round((n / 1000000000) * 100) / 100)) + " M";
  if (n >= 1000000) return "Rp " + trim((Math.round((n / 1000000) * 10) / 10)) + " Jt";
  if (n >= 1000) return "Rp " + trim((Math.round((n / 1000) * 10) / 10)) + " Rb";
  return "Rp " + n;
}

/* ---------- Deteksi & data properti ---------- */
// Sebuah post dianggap "properti" bila ditandai properti:true ATAU memiliki harga.
function isProperty(post) {
  if (!post || !post.meta) return false;
  var m = post.meta;
  if (m.properti === true || m.properti === "true") return true;
  return parsePrice(m.harga) > 0;
}

// Normalkan field properti dari frontmatter post → objek siap render.
function propData(post) {
  var m = (post && post.meta) || {};
  var price = parsePrice(m.harga);
  return {
    listing: str(m.tipe_listing || "Dijual"),
    type: str(m.tipe_properti || ""),
    price: price,
    priceText: m.harga_text ? str(m.harga_text) : formatPrice(price),
    priceShort: m.harga_text ? str(m.harga_text) : formatPriceShort(price),
    satuan: str(m.harga_satuan || ""),
    lokasi: str(m.lokasi || ""),
    alamat: str(m.alamat || ""),
    beds: intval(m.kamar_tidur, 0),
    baths: intval(m.kamar_mandi, 0),
    building: intval(m.luas_bangunan, 0),
    land: intval(m.luas_tanah, 0),
    carport: intval(m.carport, 0),
    cert: str(m.sertifikat || ""),
    maps: str(m.maps || ""),
    whatsapp: str(m.whatsapp || ""),
    galeri: arr(m.galeri).filter(Boolean),
  };
}

/* ---------- Penyusun beranda ---------- */
function getHome(ctx) {
  var config = ctx.config || {};
  // Sumber konten: themeContent (baru) → fallback config.profile (mirror inti).
  var c = obj(ctx.themeContent && Object.keys(ctx.themeContent).length ? ctx.themeContent : config.profile);

  var hero = obj(c.hero);
  var search = obj(c.search);
  var featured = obj(c.featured);
  var latest = obj(c.latest);
  var news = obj(c.news);
  var cta = obj(c.cta);
  var ctaBtn = obj(cta.button);
  var contact = obj(c.contact);

  // Kontak (dipakai tombol CTA / WhatsApp). Fallback ke social.email.
  var social = obj(config.social);
  var waNumber = str(contact.whatsapp || config.whatsapp || "");

  /* -- Pisahkan kumpulan post menjadi properti vs berita -- */
  var all = arr(ctx.site && ctx.site.recentPosts);
  var allProps = all.filter(isProperty);
  var newsPosts = all.filter(function (p) { return !isProperty(p); });

  // Unggulan: yang ditandai unggulan; bila tak ada, ambil properti terbaru.
  var flagged = allProps.filter(function (p) { return p.meta.unggulan === true || p.meta.unggulan === "true"; });
  var featuredCount = intval(featured.count, 6) || 6;
  var featuredList = (flagged.length ? flagged : allProps).slice(0, featuredCount);
  var featuredSlugs = {};
  featuredList.forEach(function (p) { featuredSlugs[p.slug] = true; });

  // Terbaru: properti yang BUKAN unggulan (hindari duplikat), terbaru dulu.
  // Daftar PENUH dikirim ke template; pembatasan jumlah awal dilakukan saat
  // render (sisanya disembunyikan & bisa dibuka), agar pencarian tetap kaya.
  var latestPool = allProps.filter(function (p) { return !featuredSlugs[p.slug]; });
  var latestCount = intval(latest.count, 6) || 6;

  // Pilihan filter pencarian — diturunkan dari data nyata (tipe & lokasi unik).
  var typeSet = {}, locSet = {};
  allProps.forEach(function (p) {
    var d = propData(p);
    if (d.type) typeSet[d.type] = true;
    if (d.lokasi) locSet[d.lokasi] = true;
  });
  function keys(o) { return Object.keys(o).sort(function (a, b) { return a.localeCompare(b); }); }

  return {
    hero: {
      badge: str(hero.badge || "Agen Properti Terpercaya"),
      title: str(hero.title || config.title || "Temukan Rumah & Tanah Impian Anda"),
      subtitle: str(hero.subtitle || config.tagline || config.description || "Jelajahi pilihan rumah dan tanah terbaik dengan harga transparan dan lokasi strategis."),
    },
    search: {
      enabled: bool(search.enabled, true),
      title: str(search.title || "Cari Properti"),
      submitText: str(search.submitText || "Cari Properti"),
    },
    featured: {
      enabled: bool(featured.enabled, true),
      eyebrow: str(featured.eyebrow || "Pilihan Terbaik"),
      title: str(featured.title || "Property Unggulan"),
      intro: str(featured.intro || ""),
      list: featuredList,
    },
    latest: {
      enabled: bool(latest.enabled, true),
      eyebrow: str(latest.eyebrow || "Baru Ditambahkan"),
      title: str(latest.title || "Property Terbaru"),
      intro: str(latest.intro || ""),
      list: latestPool,
      initial: latestCount,
    },
    news: {
      enabled: bool(news.enabled, true),
      eyebrow: str(news.eyebrow || "Artikel & Tips"),
      title: str(news.title || "Berita Properti"),
      intro: str(news.intro || ""),
      list: newsPosts.slice(0, intval(news.count, 3) || 3),
    },
    cta: {
      enabled: bool(cta.enabled, true),
      title: str(cta.title || "Punya properti untuk dijual atau disewakan?"),
      text: str(cta.text || "Pasarkan properti Anda bersama kami dan jangkau lebih banyak calon pembeli yang serius."),
      button: {
        text: str(ctaBtn.text || "Hubungi Kami"),
        url: str(ctaBtn.url || (waNumber ? "https://wa.me/" + waNumber.replace(/[^\d]/g, "") : (social.email ? "mailto:" + social.email : "/about/"))),
      },
    },
    contact: {
      whatsapp: waNumber,
      phone: str(contact.phone || ""),
    },
    filters: {
      types: keys(typeSet),
      locations: keys(locSet),
    },
  };
}

module.exports = {
  getHome: getHome,
  isProperty: isProperty,
  propData: propData,
  navHref: navHref,
  formatPrice: formatPrice,
  formatPriceShort: formatPriceShort,
  parsePrice: parsePrice,
};

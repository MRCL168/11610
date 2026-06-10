/* ============================================================
   partials/profile.js — Normalisasi data tema Kontraktor
   Hanya membaca data dari ctx.themeContent/config.profile dan
   mengembalikan fallback yang aman untuk dirender template.
   Tidak ada akses API, filesystem, maupun routing inti.
   ============================================================ */

function navHref(U, url) {
  var u = String(url || "");
  if (!u) return "#";
  if (/^(https?:|mailto:|tel:|#)/i.test(u)) return u;
  return U.url(u);
}

function obj(v) { return v && typeof v === "object" && !Array.isArray(v) ? v : {}; }
function arr(v) { return Array.isArray(v) ? v : []; }
function str(v, fallback) {
  if (v === 0) return "0";
  return (v != null && String(v).trim() !== "") ? String(v) : (fallback || "");
}
function enabled(section, fallback) {
  section = obj(section);
  if (section.enabled === false || section.show === false) return false;
  if (section.enabled === true || section.show === true) return true;
  return fallback !== false;
}

function buttonData(btn, text, url) {
  btn = obj(btn);
  return { text: str(btn.text, text), url: str(btn.url, url) };
}

function getRaw(ctx) {
  var tc = obj(ctx.themeContent);
  if (Object.keys(tc).length) return tc;
  return obj((ctx.config || {}).profile);
}

function getProfile(ctx) {
  var config = ctx.config || {};
  var social = obj(config.social);
  var p = getRaw(ctx);

  var defaultPhone = str(social.whatsapp || social.phone || "", "");
  var defaultEmail = str(social.email || "", "");
  var contactUrl = defaultPhone ? "https://wa.me/" + defaultPhone.replace(/\D/g, "") : (defaultEmail ? "mailto:" + defaultEmail : "/hubungi-kami/");

  var hero = obj(p.hero);
  var features = obj(p.features);
  var about = obj(p.about);
  var portfolio = obj(p.portfolio);
  var testimonials = obj(p.testimonials);
  var cta = obj(p.cta);
  var headerCta = obj(p.headerCta);
  var contact = obj(p.contact);
  var sidebar = obj(p.sidebar);

  var featureItems = arr(features.items)
    .filter(function (it) { return it && (it.title || it.text); })
    .map(function (it) {
      it = obj(it);
      return { icon: str(it.icon, "helmet"), title: str(it.title), text: str(it.text) };
    });
  if (!featureItems.length) {
    featureItems = [
      { icon: "plan", title: "Perencanaan Terukur", text: "Alur pekerjaan, material, dan estimasi disusun jelas sejak awal." },
      { icon: "tools", title: "Tim Lapangan Rapi", text: "Pekerjaan dilakukan oleh tenaga berpengalaman dengan pengawasan berkala." },
      { icon: "shield", title: "Kualitas Terkontrol", text: "Setiap tahap pekerjaan dicek agar hasil akhir kuat, aman, dan sesuai desain." }
    ];
  }

  var aboutPoints = arr(about.points).filter(Boolean);
  if (!aboutPoints.length) {
    aboutPoints = ["RAB transparan dan mudah dipahami", "Pengawasan proyek lebih terstruktur", "Komunikasi rutin selama proses pembangunan"];
  }
  var aboutStats = arr(about.stats).filter(function (s) { return s && (s.value || s.label); });
  if (!aboutStats.length) {
    aboutStats = [
      { value: "100+", label: "Proyek ditangani" },
      { value: "8+", label: "Tahun pengalaman" },
      { value: "4.9", label: "Rata-rata kepuasan" }
    ];
  }

  var portfolioItems = arr(portfolio.items)
    .filter(function (it) { return it && (it.title || it.image || it.text); })
    .map(function (it) {
      it = obj(it);
      return {
        title: str(it.title, "Proyek Kontraktor"),
        category: str(it.category, "Pembangunan"),
        location: str(it.location),
        year: str(it.year),
        image: str(it.image),
        text: str(it.text),
        url: str(it.url)
      };
    });
  if (!portfolioItems.length) {
    portfolioItems = [
      { title: "Renovasi Rumah Tinggal", category: "Renovasi", location: "Jakarta", year: "2026", image: "", text: "Pekerjaan renovasi fasad, ruang keluarga, dan perbaikan struktur ringan.", url: "" },
      { title: "Pembangunan Ruko", category: "Bangunan Komersial", location: "Tangerang", year: "2025", image: "", text: "Pembangunan ruko dua lantai dengan penyesuaian fungsi usaha.", url: "" },
      { title: "Interior Kantor", category: "Interior", location: "Bekasi", year: "2025", image: "", text: "Pengerjaan partisi, plafon, lantai, dan finishing ruang kerja.", url: "" }
    ];
  }

  var testimonialItems = arr(testimonials.items)
    .filter(function (it) { return it && (it.quote || it.name); })
    .map(function (it) {
      it = obj(it);
      return { quote: str(it.quote), name: str(it.name, "Klien"), role: str(it.role), photo: str(it.photo) };
    });
  if (!testimonialItems.length) {
    testimonialItems = [
      { quote: "Pekerjaan rapi dan progresnya mudah dipantau. Estimasi biaya juga dijelaskan dengan terbuka.", name: "Bapak Andri", role: "Pemilik Rumah", photo: "" },
      { quote: "Timnya responsif saat ada perubahan detail di lapangan. Hasil akhir sesuai desain awal.", name: "Ibu Ratna", role: "Klien Renovasi", photo: "" }
    ];
  }

  var blocks = arr(sidebar.blocks).length ? arr(sidebar.blocks) : arr(sidebar);

  return {
    hero: {
      enabled: enabled(hero, true),
      eyebrow: str(hero.eyebrow, "Jasa Kontraktor Profesional"),
      title: str(hero.title, "Bangun dan renovasi properti dengan tim kontraktor tepercaya"),
      text: str(hero.text, "Kami membantu perencanaan, pembangunan, renovasi, dan finishing proyek rumah maupun bangunan komersial dengan proses kerja yang rapi, transparan, dan terukur."),
      background: str(hero.background),
      image: str(hero.image),
      badge: str(hero.badge, "Survey lokasi & estimasi transparan"),
      primaryCta: buttonData(hero.primaryCta, "Konsultasi Proyek", contactUrl),
      secondaryCta: buttonData(hero.secondaryCta, "Lihat Portofolio", "#portofolio")
    },
    headerCta: {
      enabled: enabled(headerCta, true),
      text: str(headerCta.text, "Konsultasi Proyek"),
      url: str(headerCta.url, contactUrl)
    },
    features: {
      enabled: enabled(features, true),
      eyebrow: str(features.eyebrow, "Keunggulan Kami"),
      title: str(features.title, "Pekerjaan konstruksi yang rapi, terukur, dan mudah dipantau"),
      text: str(features.text, "Setiap proyek dikerjakan dengan perencanaan teknis, pengawasan lapangan, dan komunikasi yang jelas agar hasilnya sesuai kebutuhan Anda."),
      image: str(features.image),
      items: featureItems
    },
    about: {
      enabled: enabled(about, true),
      eyebrow: str(about.eyebrow, "Tentang Kami"),
      title: str(about.title, "Mitra kontraktor untuk rumah, kantor, dan bangunan usaha"),
      text: str(about.text, "Kami berfokus pada pekerjaan konstruksi dan renovasi dengan pendekatan profesional: memahami kebutuhan klien, menyusun estimasi yang masuk akal, menjaga kualitas material, dan memastikan progres proyek berjalan terarah."),
      image: str(about.image),
      points: aboutPoints,
      stats: aboutStats
    },
    portfolio: {
      enabled: enabled(portfolio, true),
      eyebrow: str(portfolio.eyebrow, "Portofolio"),
      title: str(portfolio.title, "Contoh proyek yang pernah kami tangani"),
      text: str(portfolio.text, "Gunakan bagian ini untuk menampilkan proyek pembangunan, renovasi, interior, atau pekerjaan kontraktor lain yang ingin Anda tonjolkan."),
      image: str(portfolio.image),
      items: portfolioItems
    },
    testimonials: {
      enabled: enabled(testimonials, true),
      eyebrow: str(testimonials.eyebrow, "Testimoni"),
      title: str(testimonials.title, "Kepercayaan klien dibangun dari hasil kerja yang konsisten"),
      text: str(testimonials.text, "Ulasan singkat dari klien membantu calon pelanggan memahami kualitas kerja, komunikasi, dan ketepatan proses proyek."),
      image: str(testimonials.image),
      items: testimonialItems
    },
    cta: {
      enabled: enabled(cta, true),
      eyebrow: str(cta.eyebrow, "Mulai Proyek"),
      title: str(cta.title, "Butuh kontraktor untuk bangun atau renovasi?"),
      text: str(cta.text, "Ceritakan kebutuhan proyek Anda. Tim kami dapat membantu membuat estimasi awal, menyusun lingkup pekerjaan, dan memberi arahan langkah berikutnya."),
      image: str(cta.image),
      button: buttonData(cta.button, "Hubungi Kami", contactUrl)
    },
    contact: {
      enabled: enabled(contact, true),
      title: str(contact.title, "Hubungi Kami"),
      text: str(contact.text, "Konsultasikan kebutuhan pembangunan atau renovasi Anda. Sertakan lokasi, jenis pekerjaan, dan target waktu agar kami dapat menyiapkan arahan awal."),
      address: str(contact.address, config.address || ""),
      phone: str(contact.phone, defaultPhone),
      email: str(contact.email, defaultEmail),
      mapEmbed: str(contact.mapEmbed),
      mapImage: str(contact.mapImage),
      mapUrl: str(contact.mapUrl)
    },
    sidebar: {
      enabled: enabled(sidebar, true),
      blocks: blocks.filter(function (b) { return b && typeof b === "object" && b.type; })
    }
  };
}

module.exports = { getProfile: getProfile, navHref: navHref };

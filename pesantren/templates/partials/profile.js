/* ============================================================
   partials/profile.js — Penyusun data Pesantren (TEMA)
   Membaca ctx.config.profile (di-mirror dari ctx.themeContent oleh
   inti) lalu mengembalikan objek yang sudah DINORMALKAN + diberi
   nilai default Bahasa Indonesia, sehingga beranda tetap rapi
   walau Customizer belum diisi.

   Kontrak emas: file ini HANYA membaca data dari ctx (config/U).
   Tidak ada akses GitHub API / filesystem / routing — itu inti.
   Kunci pada theme.json (jalur bertitik, mis. "hero.headline")
   HARUS sinkron dengan properti yang dibaca di sini.
   ============================================================ */

"use strict";

/* ---------- Helper kecil ---------- */
function obj(v) { return v && typeof v === "object" && !Array.isArray(v) ? v : {}; }
function arr(v) { return Array.isArray(v) ? v : []; }
function str(v) { return v == null ? "" : String(v); }

// Tautan aman untuk URL internal (diawali basePath) maupun eksternal.
function navHref(U, url) {
  var u = str(url);
  if (!u) return "#";
  if (/^(https?:|mailto:|tel:|#)/i.test(u)) return u;
  return U.url(u);
}

// Bangun tautan WhatsApp wa.me dari nomor bebas-format (spasi/strip/+ diabaikan).
// "0877-4113-5796" → "62877..." (awalan 0 diganti 62).
function waHref(number, text) {
  var digits = str(number).replace(/[^\d]/g, "");
  if (!digits) return "";
  if (digits.charAt(0) === "0") digits = "62" + digits.slice(1);
  var base = "https://wa.me/" + digits;
  return text ? base + "?text=" + encodeURIComponent(text) : base;
}

// Pisahkan nilai statistik "1.250" / "320+" → angka untuk count-up + imbuhan.
// Mengembalikan { raw, num, prefix, suffix } agar template bisa animasi naik.
function parseStat(value) {
  var raw = str(value).trim();
  var m = raw.match(/^(\D*)([\d.,\s]+)(\D*)$/);
  if (!m) return { raw: raw, num: null, prefix: "", suffix: "" };
  var num = parseInt(m[2].replace(/[^\d]/g, ""), 10);
  if (isNaN(num)) return { raw: raw, num: null, prefix: "", suffix: "" };
  return { raw: raw, num: num, prefix: m[1].trim(), suffix: m[3].trim() };
}

/* ---------- Resolusi utama ---------- */
function getProfile(ctx) {
  var config = obj(ctx.config);
  var p = obj(config.profile);          // = ctx.themeContent (di-mirror inti)
  var social = obj(config.social);

  var defaultCtaUrl = "/pendaftaran/";

  /* ---- Hero ---- */
  var hero = obj(p.hero);
  var heroPrimary = obj(hero.primaryCta);
  var heroSecondary = obj(hero.secondaryCta);
  var hasHeroSecondary = !!(heroSecondary.text || heroSecondary.url);

  /* ---- Slider (slide hero) ---- */
  var slides = arr(p.slides)
    .map(function (s) {
      s = obj(s);
      return { image: str(s.image), title: str(s.title), caption: str(s.caption) };
    })
    .filter(function (s) { return s.image; });

  /* ---- Tombol CTA header (terpisah, bisa disembunyikan) ---- */
  var hc = obj(p.headerCta);
  var headerCtaShow = hc.show !== false;

  /* ---- Statistik ---- */
  var stats = arr(p.stats)
    .map(function (s) { s = obj(s); return { value: str(s.value), label: str(s.label) }; })
    .filter(function (s) { return s.value || s.label; })
    .map(function (s) {
      var ps = parseStat(s.value);
      return { value: s.value, label: s.label, num: ps.num, prefix: ps.prefix, suffix: ps.suffix };
    });

  /* ---- Program Unggulan ---- */
  var programs = arr(p.programs)
    .map(function (s) {
      s = obj(s);
      return { icon: str(s.icon) || "book", title: str(s.title), text: str(s.text), url: str(s.url) };
    })
    .filter(function (s) { return s.title || s.text; });

  /* ---- Profil Singkat ---- */
  var profil = obj(p.profil);
  var profilPoints = arr(profil.points).map(str).filter(Boolean);
  var hasProfil = !!(profil.text || profilPoints.length);

  /* ---- Fasilitas Penunjang ---- */
  var fasilitas = arr(p.fasilitas)
    .map(function (s) {
      s = obj(s);
      return { icon: str(s.icon) || "building", title: str(s.title), text: str(s.text) };
    })
    .filter(function (s) { return s.title || s.text; });

  /* ---- Pengajar (Ustadz/Ustadzah) ---- */
  var pengajar = arr(p.pengajar)
    .map(function (s) {
      s = obj(s);
      return { photo: str(s.photo), name: str(s.name), role: str(s.role) };
    })
    .filter(function (s) { return s.name; });

  /* ---- Berita (mengambil artikel dari inti) ---- */
  var berita = obj(p.berita);
  var beritaEnabled = berita.enabled !== false;

  /* ---- Testimoni ---- */
  var testimoni = arr(p.testimoni)
    .map(function (s) {
      s = obj(s);
      return { quote: str(s.quote), name: str(s.name), role: str(s.role), photo: str(s.photo) };
    })
    .filter(function (s) { return s.quote; });

  /* ---- Lokasi & Kontak ---- */
  var kontak = obj(p.kontak);
  var waNumber = kontak.whatsapp || kontak.phone || "";

  /* ---- Pendaftaran (form → Google Sheet) ---- */
  var pend = obj(p.pendaftaran);
  // Pilihan "Program yang diminati" otomatis dari daftar Program Unggulan,
  // dengan fallback bila program belum diisi.
  var programChoices = programs.map(function (pr) { return pr.title; }).filter(Boolean);
  if (!programChoices.length) {
    programChoices = ["Tahfidz Al-Qur'an", "Kitab Kuning", "Reguler / Umum"];
  }

  /* ---- CTA band ---- */
  var cta = obj(p.cta);
  var ctaBtn = obj(cta.button);
  var hasCta = !!(cta.title || cta.text);

  /* ---- Bilah sisi (tampil di semua halaman kecuali beranda) ---- */
  var sb = obj(p.sidebar);
  var sbCta = obj(sb.cta);
  var sbKontak = obj(sb.kontak);
  var sbRecent = obj(sb.recent);
  var sbKategori = obj(sb.kategori);
  var sbTeks = obj(sb.teks);
  var sbBanner = obj(sb.banner);
  var recentCount = parseInt(str(sbRecent.count).replace(/[^\d]/g, ""), 10);
  if (isNaN(recentCount) || recentCount < 1) recentCount = 4;

  return {
    /* Hero */
    hero: {
      eyebrow: hero.eyebrow || "Pondok Pesantren",
      headline: hero.headline || config.title || "Membentuk Generasi Qur'ani & Berakhlak Mulia",
      subheadline: hero.subheadline || config.description || config.tagline ||
        "Pendidikan Islam terpadu yang memadukan tahfidz, ilmu agama, dan sains modern dalam lingkungan asrama yang nyaman.",
      primaryCta: { text: heroPrimary.text || "Daftar Sekarang", url: heroPrimary.url || defaultCtaUrl },
      secondaryCta: hasHeroSecondary
        ? { text: heroSecondary.text || "Selengkapnya", url: heroSecondary.url || "#profil" }
        : { text: "Jelajahi Program", url: "#program" },
    },

    /* Slider */
    slides: slides,
    hasSlides: slides.length > 0,

    /* Header CTA */
    headerCta: {
      show: headerCtaShow,
      text: hc.text || heroPrimary.text || "Daftar Santri",
      url: hc.url || heroPrimary.url || defaultCtaUrl,
    },

    /* Statistik */
    stats: stats,
    hasStats: stats.length >= 2,

    /* Program Unggulan */
    programsEyebrow: p.programsEyebrow || "Apa yang Kami Ajarkan",
    programsTitle: p.programsTitle || "Program Unggulan",
    programsIntro: p.programsIntro || "",
    programs: programs,
    hasPrograms: programs.length > 0,

    /* Profil Singkat */
    profil: hasProfil
      ? {
          eyebrow: profil.eyebrow || "Tentang Kami",
          title: profil.title || "Sekilas Tentang Pesantren",
          text: profil.text || "",
          image: profil.image || "",
          points: profilPoints,
        }
      : null,

    /* Fasilitas Penunjang */
    fasilitasEyebrow: p.fasilitasEyebrow || "Sarana & Prasarana",
    fasilitasTitle: p.fasilitasTitle || "Fasilitas Penunjang",
    fasilitasIntro: p.fasilitasIntro || "",
    fasilitas: fasilitas,
    hasFasilitas: fasilitas.length > 0,

    /* Pengajar */
    pengajarEyebrow: p.pengajarEyebrow || "Dewan Asatidz",
    pengajarTitle: p.pengajarTitle || "Pengajar & Pembimbing",
    pengajarIntro: p.pengajarIntro || "",
    pengajar: pengajar,
    hasPengajar: pengajar.length > 0,

    /* Berita */
    berita: {
      enabled: beritaEnabled,
      eyebrow: berita.eyebrow || "Kabar Pesantren",
      title: berita.title || "Berita & Kegiatan Terbaru",
    },

    /* Testimoni */
    testimoniEyebrow: p.testimoniEyebrow || "Kata Mereka",
    testimoniTitle: p.testimoniTitle || "Testimoni Wali Santri & Alumni",
    testimoni: testimoni,
    hasTestimoni: testimoni.length > 0,

    /* Lokasi & Kontak */
    kontak: {
      eyebrow: kontak.eyebrow || "Kunjungi Kami",
      title: kontak.title || "Lokasi & Kontak",
      intro: kontak.intro || "",
      address: kontak.address || "",
      phone: kontak.phone || "",
      whatsapp: kontak.whatsapp || "",
      email: kontak.email || social.email || "",
      hours: kontak.hours || "",
      mapsEmbed: kontak.mapsEmbed || "",
      waNumber: waNumber,
      waLink: waHref(waNumber, "Assalamu'alaikum, saya ingin bertanya tentang " + (config.title || "pesantren") + "."),
    },

    /* Pendaftaran */
    pendaftaran: {
      intro: pend.intro || "",
      scriptUrl: pend.scriptUrl || "",
      waFallback: pend.waFallback || waNumber,
      successMessage: pend.successMessage ||
        "Terima kasih, pendaftaran Anda sudah kami terima. Tim kami akan segera menghubungi Anda.",
      programChoices: programChoices,
    },

    /* CTA band */
    cta: hasCta
      ? {
          title: cta.title || "",
          text: cta.text || "",
          button: { text: ctaBtn.text || "Daftar Sekarang", url: ctaBtn.url || defaultCtaUrl },
        }
      : null,

    /* Bilah sisi (post / arsip / halaman biasa) */
    sidebar: {
      enabled: sb.enabled !== false,
      position: str(sb.position).toLowerCase() === "kiri" ? "kiri" : "kanan",
      cta: {
        show: sbCta.show !== false,
        title: sbCta.title || "Penerimaan Santri Baru",
        text: sbCta.text || "Bergabunglah bersama keluarga besar kami. Daftar sekarang, kuota terbatas.",
        buttonText: sbCta.buttonText || "Daftar Sekarang",
        buttonUrl: sbCta.buttonUrl || defaultCtaUrl,
      },
      kontak: {
        show: sbKontak.show !== false,
        title: sbKontak.title || "Hubungi Kami",
      },
      recent: {
        show: sbRecent.show !== false,
        title: sbRecent.title || "Artikel Terbaru",
        count: recentCount,
      },
      kategori: {
        show: sbKategori.show !== false,
        title: sbKategori.title || "Kategori",
      },
      teks: {
        show: sbTeks.show === true,
        title: sbTeks.title || "Pengumuman",
        body: sbTeks.body || "",
      },
      banner: {
        show: sbBanner.show === true,
        image: sbBanner.image || "",
        url: sbBanner.url || "",
        alt: sbBanner.alt || "",
      },
    },
  };
}

module.exports = { getProfile: getProfile, navHref: navHref, waHref: waHref };

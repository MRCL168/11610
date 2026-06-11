/* ============================================================
   partials/school.js — Penyusun data tema "Gitschool" (TEMA)
   Membaca data dari ctx (themeContent / config.profile) lalu
   mengembalikannya dalam bentuk yang sudah dinormalkan + diberi
   nilai default yang lengkap. Tujuannya: beranda sekolah tetap
   tampil utuh & menarik meski pemilik situs belum mengisi apa pun
   di menu "Sesuaikan".

   KONTRAK: berkas ini HANYA membaca data dari ctx (config/U).
   Tidak ada akses GitHub API / filesystem / routing — itu urusan
   inti. Tema hanya menerima data lalu memutuskan tampilannya.
   ============================================================ */

/* ---------- Util kecil ---------- */
// Tautan aman: URL internal diawali basePath, eksternal/anchor dibiarkan.
function navHref(U, url) {
  var u = String(url || "");
  if (!u) return "#";
  if (/^(https?:|mailto:|tel:|#)/i.test(u)) return u;
  return U.url(u);
}
function obj(v) { return v && typeof v === "object" && !Array.isArray(v) ? v : {}; }
function arr(v) { return Array.isArray(v) ? v : []; }
function str(v) { return v == null ? "" : String(v); }
function bool(v, dflt) { return v === undefined || v === null ? !!dflt : v !== false; }
function num(v, dflt) { var n = parseInt(v, 10); return isNaN(n) ? dflt : n; }

// Bangun URL embed Google Maps tanpa API key dari sebuah alamat.
// Dipakai sebagai cadangan bila pemilik situs belum menempel URL embed.
function mapEmbedFromAddress(address) {
  var q = encodeURIComponent(String(address || "").trim());
  if (!q) return "";
  return "https://maps.google.com/maps?q=" + q + "&z=15&hl=id&output=embed";
}

/* ---------- Penyusun utama ----------
   Mengambil sumber konten: utamakan ctx.themeContent (cara baru),
   jatuh ke ctx.config.profile (mirror back-compat) bila kosong. */
function getSchool(ctx) {
  var config = ctx.config || {};
  var social = obj(config.social);
  // Sumber konten Customizer (keduanya berisi data tema aktif yang sama).
  var c = obj(ctx.themeContent);
  if (!Object.keys(c).length) c = obj(config.profile);

  var siteTitle = config.title || "Sekolah Kita";

  /* ---- Hero slider ---- */
  var hero = obj(c.hero);
  var slides = arr(hero.slides)
    .map(function (s) {
      s = obj(s);
      var pc = obj(s.primary), sc = obj(s.secondary);
      // Dukung dua bentuk penyimpanan tombol: grup {text,url} (konvensi
      // Customizer) maupun field datar primaryText/primaryUrl/secondaryText/
      // secondaryUrl — agar tetap tampil apa pun bentuk data yang masuk.
      var pTxt = pc.text != null ? pc.text : s.primaryText;
      var pUrl = pc.url != null ? pc.url : s.primaryUrl;
      var sTxt = sc.text != null ? sc.text : s.secondaryText;
      var sUrl = sc.url != null ? sc.url : s.secondaryUrl;
      return {
        image: str(s.image),
        eyebrow: str(s.eyebrow),
        title: str(s.title),
        text: str(s.text),
        primary: { text: str(pTxt), url: str(pUrl) },
        secondary: { text: str(sTxt), url: str(sUrl) },
      };
    })
    .filter(function (s) { return s.title || s.text || s.image; });

  if (!slides.length) {
    // Slide bawaan — beranda langsung tampil penuh tanpa konfigurasi.
    slides = [
      { image: "/theme/img/slide-1.svg", eyebrow: "Sekolah Unggulan", title: siteTitle,
        text: "Lingkungan belajar yang aman, modern, dan menyenangkan untuk menumbuhkan potensi terbaik setiap anak.",
        primary: { text: "Daftar Sekarang", url: "#pendaftaran" }, secondary: { text: "Jelajahi Sekolah", url: "#fitur" } },
      { image: "/theme/img/slide-2.svg", eyebrow: "Pendidikan Berkarakter", title: "Membentuk Generasi Cerdas & Berakhlak",
        text: "Kurikulum seimbang antara akademik, penguatan karakter, dan keterampilan abad 21.",
        primary: { text: "Program Unggulan", url: "#fitur" }, secondary: { text: "Lihat Galeri", url: "#galeri" } },
      { image: "/theme/img/slide-3.svg", eyebrow: "Fasilitas Lengkap", title: "Belajar Nyaman dengan Fasilitas Modern",
        text: "Ruang kelas representatif, laboratorium, perpustakaan, dan area bermain yang ramah anak.",
        primary: { text: "Hubungi Kami", url: "#lokasi" }, secondary: { text: "Berita Terbaru", url: "#berita" } },
    ];
  }

  /* ---- Fitur / keunggulan ---- */
  var features = obj(c.features);
  var featureItems = arr(features.items)
    .map(function (f) { f = obj(f); return { icon: str(f.icon) || "book", title: str(f.title), text: str(f.text) }; })
    .filter(function (f) { return f.title || f.text; });
  if (!featureItems.length) {
    featureItems = [
      { icon: "book", title: "Kurikulum Terpadu", text: "Memadukan kurikulum nasional dengan penguatan karakter dan literasi digital." },
      { icon: "teacher", title: "Guru Profesional", text: "Tenaga pendidik berpengalaman, ramah, dan berdedikasi mendampingi tumbuh kembang anak." },
      { icon: "flask", title: "Laboratorium Lengkap", text: "Lab komputer, IPA, dan bahasa untuk mendukung pembelajaran berbasis praktik." },
      { icon: "palette", title: "Ekstrakurikuler Beragam", text: "Seni, olahraga, robotik, hingga kepemimpinan untuk menyalurkan minat dan bakat." },
      { icon: "shield", title: "Lingkungan Aman", text: "Area sekolah terpantau CCTV dengan pengawasan dan protokol keselamatan yang ketat." },
      { icon: "bus", title: "Antar-Jemput", text: "Layanan transportasi sekolah yang aman dan tepat waktu untuk kemudahan orang tua." },
    ];
  }

  /* ---- Statistik ---- */
  var statsBlock = obj(c.stats);
  var statItems = arr(statsBlock.items)
    .map(function (s) { s = obj(s); return { value: str(s.value), label: str(s.label) }; })
    .filter(function (s) { return s.value || s.label; });
  if (!statItems.length) {
    statItems = [
      { value: "1.250+", label: "Siswa Aktif" },
      { value: "85", label: "Guru & Staf" },
      { value: "30", label: "Tahun Pengalaman" },
      { value: "98%", label: "Tingkat Kelulusan" },
    ];
  }

  /* ---- Galeri ---- */
  var gallery = obj(c.gallery);
  var galleryItems = arr(gallery.items)
    .map(function (g) { g = obj(g); return { image: str(g.image), caption: str(g.caption) }; })
    .filter(function (g) { return g.image; });
  if (!galleryItems.length) {
    galleryItems = [
      { image: "/theme/img/galeri-1.svg", caption: "Upacara Bendera" },
      { image: "/theme/img/galeri-2.svg", caption: "Belajar di Kelas" },
      { image: "/theme/img/galeri-3.svg", caption: "Praktik Laboratorium" },
      { image: "/theme/img/galeri-4.svg", caption: "Kegiatan Olahraga" },
      { image: "/theme/img/galeri-5.svg", caption: "Pentas Seni" },
      { image: "/theme/img/galeri-6.svg", caption: "Perpustakaan" },
    ];
  }

  /* ---- Berita (memakai ctx.posts) ---- */
  var news = obj(c.news);
  var newsMore = obj(news.more);

  /* ---- Testimoni ---- */
  var testi = obj(c.testimonials);
  var testiItems = arr(testi.items)
    .map(function (t) {
      t = obj(t);
      return { quote: str(t.quote), name: str(t.name), role: str(t.role), photo: str(t.photo) };
    })
    .filter(function (t) { return t.quote; });
  if (!testiItems.length) {
    testiItems = [
      { quote: "Anak saya jadi lebih percaya diri dan senang berangkat sekolah setiap hari. Gurunya sangat perhatian.", name: "Ibu Sariah", role: "Orang Tua Siswa Kelas 3", photo: "" },
      { quote: "Fasilitasnya lengkap dan bersih. Komunikasi sekolah dengan orang tua juga lancar lewat aplikasi.", name: "Bapak Hendra", role: "Orang Tua Siswa Kelas 6", photo: "" },
      { quote: "Saya suka kegiatan ekskul robotiknya. Banyak teman baru dan pelajaran jadi terasa seru.", name: "Aisyah", role: "Siswa Kelas 5", photo: "" },
      { quote: "Proses pendaftaran mudah dan informatif. Sekolah responsif menjawab setiap pertanyaan kami.", name: "Ibu Lestari", role: "Orang Tua Siswa Baru", photo: "" },
    ];
  }

  /* ---- Pendaftaran (form → Google Sheet) ---- */
  var enroll = obj(c.enroll);
  var levels = arr(enroll.levels).map(str).filter(Boolean);
  if (!levels.length) {
    levels = ["Kelompok Bermain (KB)", "TK A", "TK B", "SD Kelas 1", "SMP Kelas 7", "SMA Kelas 10"];
  }

  /* ---- Peta / lokasi ---- */
  var map = obj(c.map);
  var mapAddress = str(map.address) || "Jl. Pendidikan No. 1, Kota Tangerang, Banten 15000";
  var mapEmbed = str(map.embedUrl) || mapEmbedFromAddress(mapAddress);

  /* ---- CTA band ---- */
  var cta = obj(c.cta);
  var ctaP = obj(cta.primary), ctaS = obj(cta.secondary);

  /* ---- Tombol CTA header ---- */
  var hc = obj(c.headerCta);

  return {
    siteTitle: siteTitle,

    hero: {
      eyebrow: str(hero.eyebrow),
      autoplay: bool(hero.autoplay, true),
      interval: Math.max(2, num(hero.interval, 6)),
      slides: slides,
    },

    features: {
      enabled: bool(features.enabled, true),
      eyebrow: str(features.eyebrow) || "Mengapa Memilih Kami",
      title: str(features.title) || "Keunggulan Sekolah Kami",
      intro: str(features.intro) || "Kami berkomitmen memberikan pendidikan terbaik melalui program, fasilitas, dan pendampingan yang menyeluruh.",
      items: featureItems,
    },

    stats: {
      enabled: bool(statsBlock.enabled, true),
      title: str(statsBlock.title),
      items: statItems,
    },

    gallery: {
      enabled: bool(gallery.enabled, true),
      eyebrow: str(gallery.eyebrow) || "Galeri",
      title: str(gallery.title) || "Kegiatan & Suasana Sekolah",
      intro: str(gallery.intro) || "Sekilas keseharian belajar, berkarya, dan bertumbuh bersama di sekolah kami.",
      items: galleryItems,
    },

    news: {
      enabled: bool(news.enabled, true),
      eyebrow: str(news.eyebrow) || "Berita & Pengumuman",
      title: str(news.title) || "Kabar Terbaru Sekolah",
      intro: str(news.intro) || "Informasi kegiatan, prestasi, dan pengumuman penting dari sekolah.",
      count: Math.max(1, num(news.count, 3)),
      more: { text: str(newsMore.text), url: str(newsMore.url) },
    },

    testimonials: {
      enabled: bool(testi.enabled, true),
      eyebrow: str(testi.eyebrow) || "Testimoni",
      title: str(testi.title) || "Apa Kata Orang Tua & Siswa",
      intro: str(testi.intro) || "Kepercayaan keluarga adalah hal yang paling kami jaga.",
      items: testiItems,
    },

    enroll: {
      enabled: bool(enroll.enabled, true),
      eyebrow: str(enroll.eyebrow) || "Pendaftaran",
      title: str(enroll.title) || "Formulir Pendaftaran Siswa Baru",
      intro: str(enroll.intro) || "Isi formulir di bawah ini. Tim kami akan menghubungi Anda untuk proses selanjutnya.",
      endpoint: str(enroll.endpoint),
      levels: levels,
      buttonText: str(enroll.buttonText) || "Kirim Pendaftaran",
      successMessage: str(enroll.successMessage) || "Terima kasih! Pendaftaran Anda telah kami terima. Tim kami akan segera menghubungi Anda.",
      whatsapp: str(enroll.whatsapp).replace(/[^0-9]/g, ""),
    },

    map: {
      enabled: bool(map.enabled, true),
      eyebrow: str(map.eyebrow) || "Lokasi",
      title: str(map.title) || "Kunjungi Sekolah Kami",
      address: mapAddress,
      embedUrl: mapEmbed,
      phone: str(map.phone) || "(021) 1234-5678",
      email: str(map.email) || social.email || "info@sekolah.sch.id",
      hours: str(map.hours) || "Senin–Jumat, 07.00–15.00 WIB",
      directionsUrl: str(map.directionsUrl),
    },

    cta: {
      enabled: bool(cta.enabled, true),
      title: str(cta.title) || "Siap Bergabung Bersama Kami?",
      text: str(cta.text) || "Daftarkan putra-putri Anda sekarang dan jadilah bagian dari keluarga besar sekolah kami.",
      primary: { text: str(ctaP.text) || "Daftar Sekarang", url: str(ctaP.url) || "#pendaftaran" },
      secondary: { text: str(ctaS.text), url: str(ctaS.url) },
    },

    headerCta: {
      show: bool(hc.show, true),
      text: str(hc.text) || "Pendaftaran",
      url: str(hc.url) || "#pendaftaran",
    },
  };
}

module.exports = { getSchool: getSchool, navHref: navHref };

/* ============================================================
   partials/defaults.js — Konten fallback bawaan (TEMA)
   Nilai default bertema GudangWEB (jasa pembuatan website & SEO).
   Dipakai oleh profile.js bila bagian tertentu di menu Sesuaikan
   masih kosong, sehingga tema langsung tampil utuh & relevan saat
   pertama diaktifkan — tanpa perlu mengisi apa pun lebih dulu.

   Semua nilai di sini DAPAT ditimpa dari menu Sesuaikan (data
   pengguna selalu menang). Ganti nomor/email contoh di bawah dengan
   milik Anda sendiri.
   ============================================================ */

module.exports = {
  // ---- Hero slider ----
  slides: [
    {
      image: "/public/images/hero-sample.svg",
      kicker: "GudangWEB · Tangerang",
      title: "Jasa Pembuatan Website & SEO untuk Bisnis Anda",
      subtitle: "Website cepat, profesional, dan dioptimasi agar mudah ditemukan pelanggan di Google.",
      btnText: "Konsultasi Gratis",
      btnUrl: "/kontak/",
      btn2Text: "Lihat Layanan",
      btn2Url: "#layanan"
    },
    {
      image: "",
      kicker: "Spesialis SEO Lokal & AEO",
      title: "Bantu pelanggan menemukan bisnis Anda",
      subtitle: "Optimasi SEO lokal, structured data, dan AEO agar tampil di Google maupun mesin jawaban AI.",
      btnText: "Mulai Sekarang",
      btnUrl: "/kontak/",
      btn2Text: "",
      btn2Url: ""
    },
    {
      image: "/public/images/hero-sample.svg",
      kicker: "WordPress Custom",
      title: "Tema & plugin dibangun sesuai kebutuhan",
      subtitle: "Tanpa page builder berat — kode rapi, ringan, dan ramah SEO sejak awal.",
      btnText: "Diskusi Proyek",
      btnUrl: "/kontak/",
      btn2Text: "",
      btn2Url: ""
    }
  ],
  heroAutoplay: true,
  heroInterval: 6,

  // ---- Tombol CTA header ----
  headerCta: { show: true, text: "Konsultasi Gratis", url: "/kontak/" },

  // ---- Statistik ----
  stats: [
    { value: "100+", label: "Website Dibuat" },
    { value: "5 Thn", label: "Pengalaman" },
    { value: "90+", label: "Klien Puas" },
    { value: "4.9/5", label: "Rating Layanan" }
  ],

  // ---- Profil / Tentang ----
  about: {
    eyebrow: "Tentang GudangWEB",
    title: "Partner pengembangan web & SEO untuk bisnis Indonesia",
    text: "GudangWEB membantu bisnis dari berbagai skala membangun kehadiran digital yang kuat — mulai dari website profesional hingga strategi SEO yang terukur. Berbasis di Tangerang, kami fokus pada kode yang rapi, performa cepat, dan optimasi yang berdampak nyata pada pertumbuhan Anda.",
    image: "",
    points: [
      "Kode rapi tanpa page builder berat",
      "Optimasi SEO & schema (JSON-LD) sejak awal",
      "Pendampingan yang ramah dan responsif"
    ]
  },

  // ---- Layanan ----
  servicesEyebrow: "Apa yang kami kerjakan",
  servicesTitle: "Layanan GudangWEB",
  servicesIntro: "Solusi lengkap untuk membangun dan mengembangkan kehadiran digital bisnis Anda.",
  services: [
    { icon: "building", title: "Pembuatan Website", text: "Company profile, toko online, dan landing page yang cepat serta profesional.", url: "/kontak/" },
    { icon: "chart", title: "Optimasi SEO", text: "Riset kata kunci, SEO on-page & teknis untuk mendongkrak peringkat di Google.", url: "/kontak/" },
    { icon: "mapPin", title: "SEO Lokal", text: "Bantu bisnis Anda muncul di pencarian dan Google Maps area sekitar.", url: "/kontak/" },
    { icon: "globe", title: "Schema & AEO", text: "Structured data (JSON-LD) agar konten siap untuk mesin jawaban AI.", url: "/kontak/" },
    { icon: "pen", title: "Konten & Copywriting", text: "Artikel ramah SEO dan konten yang relevan dengan bisnis Anda.", url: "/kontak/" },
    { icon: "gear", title: "Pemeliharaan Website", text: "Pembaruan, keamanan, dan dukungan teknis berkelanjutan.", url: "/kontak/" }
  ],

  // ---- Berita / Wawasan ----
  newsEnabled: true,
  newsEyebrow: "Wawasan",
  newsTitle: "Artikel & Tips Terbaru",
  newsIntro: "Tips seputar website, SEO, dan pemasaran digital dari tim GudangWEB.",
  newsCount: 3,

  // ---- FAQ (beranda) ----
  faq: {
    enabled: true,
    eyebrow: "FAQ",
    title: "Pertanyaan yang Sering Diajukan",
    intro: "Beberapa hal yang sering ditanyakan calon klien seputar layanan website & SEO kami.",
    items: [
      { q: "Berapa biaya pembuatan website?", a: "Biaya bergantung pada jenis dan kompleksitas situs (company profile, toko online, atau custom). Hubungi kami untuk penawaran yang sesuai dengan kebutuhan dan anggaran Anda." },
      { q: "Berapa lama proses pembuatan website?", a: "Umumnya 1–4 minggu, tergantung skala proyek serta kelengkapan materi (teks, gambar, dan kebutuhan fitur)." },
      { q: "Apakah website sudah dioptimasi untuk SEO?", a: "Ya. Setiap website kami bangun dengan struktur ramah SEO, kecepatan tinggi, dan structured data (JSON-LD) sejak awal agar mudah ditemukan di Google." },
      { q: "Apa itu SEO Lokal dan apakah bisnis saya membutuhkannya?", a: "SEO Lokal membantu bisnis Anda muncul saat orang mencari layanan di area sekitar (mis. \"jasa pembuatan website Tangerang\") dan di Google Maps. Sangat penting untuk bisnis yang melayani wilayah tertentu." },
      { q: "Apakah ada layanan pemeliharaan setelah website jadi?", a: "Ada. Kami menyediakan paket pemeliharaan untuk pembaruan, keamanan, backup, dan dukungan teknis berkelanjutan." },
      { q: "Apakah saya bisa mengelola konten website sendiri?", a: "Bisa. Website dibangun dengan panel admin yang mudah digunakan, dilengkapi panduan singkat agar Anda dapat memperbarui konten secara mandiri." }
    ]
  },

  // ---- CTA band ----
  ctaBand: {
    title: "Siap punya website yang mendatangkan pelanggan?",
    text: "Konsultasikan kebutuhan website & SEO Anda dengan GudangWEB — gratis, tanpa komitmen.",
    button: { text: "Konsultasi Gratis", url: "/kontak/" }
  },

  // ---- Kontak + peta ----
  contact: {
    eyebrow: "Kontak",
    title: "Hubungi GudangWEB",
    intro: "Ceritakan kebutuhan proyek Anda, kami bantu carikan solusi terbaiknya.",
    address: "Tangerang, Banten, Indonesia",
    phone: "",
    whatsapp: "",
    email: "",
    hours: "Senin–Sabtu: 09.00–18.00",
    mapEmbed: "https://maps.google.com/maps?q=Tangerang,Banten&output=embed",
    mapsUrl: "https://maps.google.com/?q=Tangerang,Banten"
  },

  // ---- Sidebar (halaman dalam, bukan beranda) ----
  // Ganti nomor/email contoh di bawah dengan milik Anda lewat menu Sesuaikan.
  sidebar: [
    {
      type: "tombol-kontak",
      title: "Hubungi Kami",
      text: "Konsultasi gratis untuk kebutuhan website & SEO Anda.",
      items: [
        { label: "Chat WhatsApp", url: "https://wa.me/6281234567890" },
        { label: "Kirim Email", url: "mailto:halo@gudangweb.com" },
        { label: "Lihat Semua Kontak", url: "/kontak/" }
      ]
    },
    {
      type: "text",
      title: "Tentang GudangWEB",
      content: "<p>GudangWEB adalah penyedia jasa pembuatan website &amp; SEO di Tangerang. Kami membangun situs yang cepat, rapi, dan dioptimasi untuk Google.</p>"
    },
    {
      type: "recent-posts",
      title: "Artikel Terbaru",
      count: 4
    },
    {
      type: "cta",
      title: "Butuh Website?",
      text: "Konsultasikan kebutuhan Anda sekarang, tim kami siap membantu.",
      button: { text: "Konsultasi Gratis", url: "/kontak/" }
    }
  ]
};

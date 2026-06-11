/* ============================================================
   templates/home.js — Beranda sekolah (TEMA)
   Halaman 1 = landing page lengkap dengan urutan section:
     hero slider → fitur → statistik → galeri → berita →
     testimoni → form pendaftaran (Google Sheet) → peta → CTA.
   Tiap section dapat dimunculkan/disembunyikan dari menu "Sesuaikan".
   Halaman 2+ = indeks berita sederhana dengan paginasi.
   ctx: { config, U, lib, site, seo, themeVars, themeContent, posts, pageNum, totalPages }
   ============================================================ */

var layout = require("./partials/layout");
var postCard = require("./partials/post-card");
var icons = require("./partials/icons");
var schoolMod = require("./partials/school");
var getSchool = schoolMod.getSchool;
var navHref = schoolMod.navHref;

module.exports = function home(ctx) {
  var config = ctx.config, U = ctx.U, lib = ctx.lib, posts = ctx.posts, pageNum = ctx.pageNum, totalPages = ctx.totalPages;
  var esc = lib.esc, attr = lib.attr;

  /* -------- Halaman 2+: indeks berita sederhana -------- */
  if (pageNum > 1) {
    var cardsP = posts.map(function (p) { return postCard(p, ctx); }).join("");
    var prevP = pageNum > 1
      ? '<a class="page-link" href="' + attr(U.url(pageNum === 2 ? "/" : "/page/" + (pageNum - 1) + "/")) + '">← Sebelumnya</a>'
      : '<span class="page-link disabled">← Sebelumnya</span>';
    var nextP = pageNum < totalPages
      ? '<a class="page-link" href="' + attr(U.url("/page/" + (pageNum + 1) + "/")) + '">Berikutnya →</a>'
      : '<span class="page-link disabled">Berikutnya →</span>';
    var idxContent =
      '\n    <section class="page-head"><div class="container"><span class="page-head-kicker">Berita</span><h1>Berita & Pengumuman — Halaman ' + pageNum + "</h1></div></section>" +
      '\n    <section class="section"><div class="container">' +
      '<div class="post-grid">' + cardsP + "</div>" +
      '\n      <nav class="pagination">' + prevP + '<span class="page-info">Halaman ' + pageNum + " dari " + totalPages + "</span>" + nextP + "</nav>" +
      "\n    </div></section>";
    return layout(ctx, idxContent);
  }

  /* -------- Halaman 1: landing sekolah -------- */
  var s = getSchool(ctx);

  /* ===== Hero slider ===== */
  var slidesHtml = s.hero.slides.map(function (sl, i) {
    var hasImg = !!sl.image;
    var bg = hasImg ? ' style="background-image:url(\'' + attr(U.url(sl.image)) + '\')"' : "";
    var eyebrow = sl.eyebrow ? '<span class="hero-eyebrow">' + esc(sl.eyebrow) + "</span>" : "";
    var btnPrimary = sl.primary.text
      ? '<a class="btn btn-primary btn-lg" href="' + attr(navHref(U, sl.primary.url)) + '">' + esc(sl.primary.text) + "</a>"
      : "";
    var btnSecondary = sl.secondary.text
      ? '<a class="btn btn-ghost btn-lg" href="' + attr(navHref(U, sl.secondary.url)) + '">' + esc(sl.secondary.text) + "</a>"
      : "";
    var actions = (btnPrimary || btnSecondary) ? '<div class="hero-actions">' + btnPrimary + btnSecondary + "</div>" : "";
    return (
      '\n        <div class="hero-slide' + (i === 0 ? " is-active" : "") + (hasImg ? " has-bg" : "") + '"' + bg + ' role="group" aria-roledescription="slide" aria-label="Slide ' + (i + 1) + " dari " + s.hero.slides.length + '">' +
      '<div class="hero-overlay" aria-hidden="true"></div>' +
      '<div class="container"><div class="hero-content">' +
      eyebrow +
      '<h1 class="hero-title">' + esc(sl.title) + "</h1>" +
      (sl.text ? '<p class="hero-lead">' + esc(sl.text) + "</p>" : "") +
      actions +
      "</div></div>" +
      "</div>"
    );
  }).join("");

  var multi = s.hero.slides.length > 1;
  var dots = multi
    ? '<div class="hero-dots" role="tablist" aria-label="Pilih slide">' +
      s.hero.slides.map(function (sl, i) {
        return '<button class="hero-dot' + (i === 0 ? " is-active" : "") + '" type="button" role="tab" aria-label="Slide ' + (i + 1) + '" data-index="' + i + '"></button>';
      }).join("") +
      "</div>"
    : "";
  var arrows = multi
    ? '<button class="hero-arrow hero-prev" type="button" aria-label="Slide sebelumnya">‹</button>' +
      '<button class="hero-arrow hero-next" type="button" aria-label="Slide berikutnya">›</button>'
    : "";

  var hero =
    '\n    <section class="hero-slider" data-autoplay="' + (s.hero.autoplay && multi ? "true" : "false") + '" data-interval="' + (s.hero.interval * 1000) + '" aria-roledescription="carousel" aria-label="Sorotan sekolah">' +
    '\n      <div class="hero-track">' + slidesHtml + "\n      </div>" +
    arrows + dots +
    "\n    </section>";

  /* ===== Fitur / keunggulan ===== */
  var features = "";
  if (s.features.enabled) {
    var fCards = s.features.items.map(function (f) {
      return (
        '\n        <article class="feature-card">' +
        '<div class="feature-icon">' + icons.featureIcon(f.icon) + "</div>" +
        '<h3 class="feature-title">' + esc(f.title) + "</h3>" +
        '<p class="feature-text">' + esc(f.text) + "</p>" +
        "</article>"
      );
    }).join("");
    features =
      '\n    <section class="section" id="fitur">' +
      '\n      <div class="container">' +
      '\n        <div class="section-head center"><span class="eyebrow">' + esc(s.features.eyebrow) + '</span><h2>' + esc(s.features.title) + "</h2>" +
      (s.features.intro ? "<p>" + esc(s.features.intro) + "</p>" : "") + "</div>" +
      '\n        <div class="feature-grid">' + fCards + "\n        </div>" +
      "\n      </div>" +
      "\n    </section>";
  }

  /* ===== Statistik ===== */
  var stats = "";
  if (s.stats.enabled && s.stats.items.length) {
    var stItems = s.stats.items.map(function (st) {
      return (
        '<div class="stat">' +
        '<div class="stat-value" data-count>' + esc(st.value) + "</div>" +
        '<span class="stat-label">' + esc(st.label) + "</span>" +
        "</div>"
      );
    }).join("");
    var stHead = s.stats.title ? '<div class="section-head center"><h2>' + esc(s.stats.title) + "</h2></div>" : "";
    stats =
      '\n    <section class="stats-band">' +
      '\n      <div class="container">' + stHead +
      '<div class="stats-grid">' + stItems + "</div>" +
      "\n      </div>" +
      "\n    </section>";
  }

  /* ===== Galeri ===== */
  var gallery = "";
  if (s.gallery.enabled && s.gallery.items.length) {
    var gItems = s.gallery.items.map(function (g) {
      var capAttr = g.caption ? ' data-caption="' + attr(g.caption) + '"' : "";
      var capHtml = g.caption ? '<span class="gallery-cap">' + esc(g.caption) + "</span>" : "";
      return (
        '\n        <a class="gallery-item" href="' + attr(U.url(g.image)) + '"' + capAttr + '>' +
        '<img src="' + attr(U.url(g.image)) + '" alt="' + attr(g.caption || "Galeri sekolah") + '" loading="lazy">' +
        capHtml +
        "</a>"
      );
    }).join("");
    gallery =
      '\n    <section class="section section-alt" id="galeri">' +
      '\n      <div class="container">' +
      '\n        <div class="section-head center"><span class="eyebrow">' + esc(s.gallery.eyebrow) + '</span><h2>' + esc(s.gallery.title) + "</h2>" +
      (s.gallery.intro ? "<p>" + esc(s.gallery.intro) + "</p>" : "") + "</div>" +
      '\n        <div class="gallery-grid">' + gItems + "\n        </div>" +
      "\n      </div>" +
      "\n    </section>";
  }

  /* ===== Berita (memakai ctx.posts) ===== */
  var news = "";
  if (s.news.enabled && posts && posts.length) {
    var latest = posts.slice(0, s.news.count);
    var nCards = latest.map(function (p) { return postCard(p, ctx); }).join("");
    var moreBtn = s.news.more.url
      ? '<div class="news-more"><a class="btn btn-outline" href="' + attr(navHref(U, s.news.more.url)) + '">' + esc(s.news.more.text || "Lihat Semua") + " " + icons.arrow() + "</a></div>"
      : "";
    news =
      '\n    <section class="section" id="berita">' +
      '\n      <div class="container">' +
      '\n        <div class="section-head center"><span class="eyebrow">' + esc(s.news.eyebrow) + '</span><h2>' + esc(s.news.title) + "</h2>" +
      (s.news.intro ? "<p>" + esc(s.news.intro) + "</p>" : "") + "</div>" +
      '\n        <div class="post-grid">' + nCards + "</div>" +
      moreBtn +
      "\n      </div>" +
      "\n    </section>";
  }

  /* ===== Testimoni ===== */
  var testimonials = "";
  if (s.testimonials.enabled && s.testimonials.items.length) {
    var tCards = s.testimonials.items.map(function (t) {
      var avatar = t.photo
        ? '<img class="testi-avatar" src="' + attr(U.url(t.photo)) + '" alt="' + attr(t.name) + '" loading="lazy">'
        : '<span class="testi-avatar testi-avatar-initial" aria-hidden="true">' + esc((t.name || "?").trim().charAt(0).toUpperCase()) + "</span>";
      return (
        '\n        <figure class="testi-card">' +
        '<div class="testi-quote-ic" aria-hidden="true">' + icons.ui("star") + "</div>" +
        '<blockquote class="testi-quote">' + esc(t.quote) + "</blockquote>" +
        '<figcaption class="testi-author">' + avatar +
        '<span class="testi-meta"><span class="testi-name">' + esc(t.name) + "</span>" +
        (t.role ? '<span class="testi-role">' + esc(t.role) + "</span>" : "") + "</span>" +
        "</figcaption>" +
        "</figure>"
      );
    }).join("");
    testimonials =
      '\n    <section class="section section-alt" id="testimoni">' +
      '\n      <div class="container">' +
      '\n        <div class="section-head center"><span class="eyebrow">' + esc(s.testimonials.eyebrow) + '</span><h2>' + esc(s.testimonials.title) + "</h2>" +
      (s.testimonials.intro ? "<p>" + esc(s.testimonials.intro) + "</p>" : "") + "</div>" +
      '\n        <div class="testi-grid">' + tCards + "\n        </div>" +
      "\n      </div>" +
      "\n    </section>";
  }

  /* ===== Form Pendaftaran Siswa (terhubung Google Sheet) ===== */
  var enroll = "";
  if (s.enroll.enabled) {
    var levelOpts = s.enroll.levels.map(function (lv) {
      return '<option value="' + attr(lv) + '">' + esc(lv) + "</option>";
    }).join("");

    function field(labelText, inner) {
      return '<div class="form-field">' + labelText + inner + "</div>";
    }

    var formInner =
      field('<label for="reg-nama">Nama Lengkap Siswa <span class="req">*</span></label>',
            '<input type="text" id="reg-nama" name="nama" required autocomplete="name" placeholder="Nama lengkap calon siswa">') +
      field('<label for="reg-tanggal">Tanggal Lahir</label>',
            '<input type="date" id="reg-tanggal" name="tanggal_lahir">') +
      field('<label for="reg-jenjang">Jenjang / Kelas yang Dituju <span class="req">*</span></label>',
            '<select id="reg-jenjang" name="jenjang" required><option value="" disabled selected>— Pilih jenjang —</option>' + levelOpts + "</select>") +
      field('<label for="reg-asal">Asal Sekolah</label>',
            '<input type="text" id="reg-asal" name="asal_sekolah" placeholder="Asal TK/SD/SMP (jika ada)">') +
      field('<label for="reg-ortu">Nama Orang Tua / Wali <span class="req">*</span></label>',
            '<input type="text" id="reg-ortu" name="orang_tua" required placeholder="Nama orang tua atau wali">') +
      field('<label for="reg-wa">Nomor WhatsApp <span class="req">*</span></label>',
            '<input type="tel" id="reg-wa" name="whatsapp" required inputmode="numeric" placeholder="08xxxxxxxxxx">') +
      field('<label for="reg-email">Email</label>',
            '<input type="email" id="reg-email" name="email" autocomplete="email" placeholder="email@contoh.com">') +
      '<div class="form-field form-field-full">' +
        '<label for="reg-pesan">Catatan / Pertanyaan</label>' +
        '<textarea id="reg-pesan" name="pesan" rows="3" placeholder="Tuliskan pertanyaan atau catatan tambahan (opsional)"></textarea>' +
      "</div>";

    // Honeypot anti-spam (disembunyikan via CSS, diperiksa di script).
    var honeypot = '<input type="text" name="_gotcha" class="form-hp" tabindex="-1" autocomplete="off" aria-hidden="true">';

    var dataAttrs =
      ' data-endpoint="' + attr(s.enroll.endpoint) + '"' +
      ' data-success="' + attr(s.enroll.successMessage) + '"' +
      ' data-whatsapp="' + attr(s.enroll.whatsapp) + '"';

    enroll =
      '\n    <section class="section enroll-section" id="pendaftaran">' +
      '\n      <div class="container">' +
      '\n        <div class="enroll-grid">' +
      '\n          <div class="enroll-intro">' +
      '<span class="eyebrow">' + esc(s.enroll.eyebrow) + "</span>" +
      "<h2>" + esc(s.enroll.title) + "</h2>" +
      (s.enroll.intro ? "<p>" + esc(s.enroll.intro) + "</p>" : "") +
      '<ul class="enroll-points">' +
      "<li>" + icons.ui("check") + "Pengisian formulir hanya butuh beberapa menit</li>" +
      "<li>" + icons.ui("check") + "Data dikirim langsung ke tim pendaftaran sekolah</li>" +
      "<li>" + icons.ui("check") + "Kami menghubungi Anda untuk langkah selanjutnya</li>" +
      "</ul>" +
      (s.enroll.whatsapp
        ? '<a class="btn btn-wa" href="https://wa.me/' + attr(s.enroll.whatsapp) + '" target="_blank" rel="noopener">' + icons.ui("whatsapp") + " Tanya via WhatsApp</a>"
        : "") +
      "\n          </div>" +
      '\n          <div class="enroll-form-wrap">' +
      '\n            <form class="enroll-form" id="enroll-form"' + dataAttrs + " novalidate>" +
      '\n              <div class="form-grid">' + formInner + honeypot + "</div>" +
      '\n              <button type="submit" class="btn btn-primary btn-lg btn-block enroll-submit">' + esc(s.enroll.buttonText) + "</button>" +
      '\n              <p class="form-note">Dengan mengirim, Anda setuju data digunakan untuk keperluan pendaftaran sekolah.</p>' +
      '\n              <div class="form-status" id="enroll-status" role="status" aria-live="polite"></div>' +
      "\n            </form>" +
      "\n          </div>" +
      "\n        </div>" +
      "\n      </div>" +
      "\n    </section>";
  }

  /* ===== Peta / Lokasi ===== */
  var map = "";
  if (s.map.enabled) {
    var directions = s.map.directionsUrl
      ? s.map.directionsUrl
      : "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(s.map.address);
    var infoRows = "";
    if (s.map.address) infoRows += '<li>' + icons.ui("pin") + "<span>" + esc(s.map.address) + "</span></li>";
    if (s.map.phone) infoRows += '<li>' + icons.ui("phone") + '<a href="tel:' + attr(s.map.phone.replace(/[^0-9+]/g, "")) + '">' + esc(s.map.phone) + "</a></li>";
    if (s.map.email) infoRows += '<li>' + icons.ui("mail") + '<a href="mailto:' + attr(s.map.email) + '">' + esc(s.map.email) + "</a></li>";
    if (s.map.hours) infoRows += '<li>' + icons.ui("clock") + "<span>" + esc(s.map.hours) + "</span></li>";

    var frame = s.map.embedUrl
      ? '<div class="map-frame"><iframe src="' + attr(s.map.embedUrl) + '" title="Peta lokasi ' + attr(config.title) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>'
      : '<div class="map-frame map-frame-empty"><span>' + icons.ui("pin") + "Peta belum diatur</span></div>";

    map =
      '\n    <section class="section" id="lokasi">' +
      '\n      <div class="container">' +
      '\n        <div class="section-head center"><span class="eyebrow">' + esc(s.map.eyebrow) + '</span><h2>' + esc(s.map.title) + "</h2></div>" +
      '\n        <div class="map-grid">' +
      "\n          " + frame +
      '\n          <div class="map-info">' +
      '<ul class="map-info-list">' + infoRows + "</ul>" +
      '<a class="btn btn-primary" href="' + attr(directions) + '" target="_blank" rel="noopener">Buka di Google Maps ' + icons.arrow() + "</a>" +
      "\n          </div>" +
      "\n        </div>" +
      "\n      </div>" +
      "\n    </section>";
  }

  /* ===== CTA band ===== */
  var cta = "";
  if (s.cta.enabled) {
    var ctaPrimary = s.cta.primary.text
      ? '<a class="btn btn-light btn-lg" href="' + attr(navHref(U, s.cta.primary.url)) + '">' + esc(s.cta.primary.text) + "</a>"
      : "";
    var ctaSecondary = s.cta.secondary.text
      ? '<a class="btn btn-ghost-light btn-lg" href="' + attr(navHref(U, s.cta.secondary.url)) + '">' + esc(s.cta.secondary.text) + "</a>"
      : "";
    cta =
      '\n    <section class="cta-band">' +
      '\n      <div class="container"><div class="cta-inner">' +
      "<h2>" + esc(s.cta.title) + "</h2>" +
      (s.cta.text ? "<p>" + esc(s.cta.text) + "</p>" : "") +
      '<div class="cta-actions">' + ctaPrimary + ctaSecondary + "</div>" +
      "</div></div>" +
      "\n    </section>";
  }

  // Lightbox galeri (kerangka; diisi & dikontrol oleh assets/script.js).
  var lightbox =
    '\n    <div class="lightbox" id="lightbox" aria-hidden="true">' +
    '<button class="lightbox-close" type="button" aria-label="Tutup">×</button>' +
    '<figure class="lightbox-figure"><img class="lightbox-img" src="" alt=""><figcaption class="lightbox-cap"></figcaption></figure>' +
    "</div>";

  var content = hero + features + stats + gallery + news + testimonials + enroll + map + cta + lightbox;
  return layout(ctx, content);
};

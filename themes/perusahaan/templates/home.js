/* ============================================================
   templates/home.js — Beranda landing perusahaan (TEMA)
   Halaman 1 = landing: hero slider → statistik → profil →
   layanan → berita → CTA. Halaman 2+ = indeks artikel berpaginasi.
   ctx: { config, U, lib, site, seo, themeVars, themeContent,
          posts, pageNum, totalPages, plugins }
   ============================================================ */

var layout = require("./partials/layout");
var postCard = require("./partials/post-card");
var icons = require("./partials/icons");
var profileMod = require("./partials/profile");
var getProfile = profileMod.getProfile;
var navHref = profileMod.navHref;

module.exports = function home(ctx) {
  var config = ctx.config, U = ctx.U, lib = ctx.lib, posts = ctx.posts, pageNum = ctx.pageNum, totalPages = ctx.totalPages;
  var esc = lib.esc, attr = lib.attr;

  /* -------- Halaman 2+: indeks artikel sederhana -------- */
  if (pageNum > 1) {
    var cardsP = posts.map(function (p) { return postCard(p, ctx); }).join("");
    var prevP = pageNum > 1
      ? '<a class="page-link" href="' + attr(U.url(pageNum === 2 ? "/" : "/page/" + (pageNum - 1) + "/")) + '">&larr; Sebelumnya</a>'
      : '<span class="page-link disabled">&larr; Sebelumnya</span>';
    var nextP = pageNum < totalPages
      ? '<a class="page-link" href="' + attr(U.url("/page/" + (pageNum + 1) + "/")) + '">Berikutnya &rarr;</a>'
      : '<span class="page-link disabled">Berikutnya &rarr;</span>';
    var idxContent =
      '\n    <section class="page-head"><div class="container"><span class="page-head-kicker">Berita</span><h1>Artikel &mdash; Halaman ' + pageNum + "</h1></div></section>" +
      '\n    <section class="section"><div class="container">' +
      '<div class="post-grid">' + cardsP + "</div>" +
      '\n      <nav class="pagination">' + prevP + '<span class="page-info">Halaman ' + pageNum + " dari " + totalPages + "</span>" + nextP + "</nav>" +
      "\n    </div></section>";
    return layout(ctx, idxContent);
  }

  /* -------- Halaman 1: landing -------- */
  var profile = getProfile(ctx);

  /* === 1) HERO SLIDER === */
  var slides = profile.slides;
  var multi = slides.length > 1;

  var slidesHtml = slides.map(function (s, i) {
    var isActive = i === 0;
    var bg = s.image
      ? '<div class="slide-bg" style="background-image:url(\'' + attr(U.url(s.image)) + '\')"></div>'
      : '<div class="slide-bg slide-bg-plain"></div>';
    var kicker = s.kicker ? '<span class="eyebrow eyebrow-on-dark">' + esc(s.kicker) + "</span>" : "";
    // Slide pertama memakai H1 (judul utama halaman), sisanya H2 — tampilan identik.
    var titleTag = isActive ? "h1" : "h2";
    var title = s.title ? "<" + titleTag + ' class="slide-title">' + esc(s.title) + "</" + titleTag + ">" : "";
    var lead = s.subtitle ? '<p class="slide-lead">' + esc(s.subtitle) + "</p>" : "";
    var btns = "";
    if (s.primary.text) {
      btns += '<a class="btn btn-primary btn-lg" href="' + attr(navHref(U, s.primary.url)) + '">' + esc(s.primary.text) + "</a>";
    }
    if (s.secondary.text) {
      btns += '<a class="btn btn-ghost btn-lg" href="' + attr(navHref(U, s.secondary.url)) + '">' + esc(s.secondary.text) + "</a>";
    }
    var actions = btns ? '<div class="slide-actions">' + btns + "</div>" : "";
    return (
      '\n        <div class="slide' + (isActive ? " is-active" : "") + '" data-index="' + i + '" role="group" aria-roledescription="slide" aria-label="' + (i + 1) + " dari " + slides.length + '"' + (isActive ? "" : ' aria-hidden="true"') + ">" +
      "\n          " + bg +
      '\n          <div class="slide-overlay" aria-hidden="true"></div>' +
      '\n          <div class="container"><div class="slide-content">' + kicker + title + lead + actions + "</div></div>" +
      "\n        </div>"
    );
  }).join("");

  var controls = "";
  if (multi) {
    var dots = slides.map(function (s, i) {
      return '<button class="slider-dot' + (i === 0 ? " is-active" : "") + '" type="button" data-goto="' + i + '" role="tab" aria-label="Tampilkan slide ' + (i + 1) + '" aria-selected="' + (i === 0 ? "true" : "false") + '"></button>';
    }).join("");
    controls =
      '\n        <button class="slider-arrow slider-prev" type="button" aria-label="Slide sebelumnya">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg></button>' +
      '\n        <button class="slider-arrow slider-next" type="button" aria-label="Slide berikutnya">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg></button>' +
      '\n        <div class="slider-dots" role="tablist" aria-label="Pilih slide">' + dots + "</div>";
  }

  var hero =
    '\n    <section class="hero-slider"' +
    ' data-autoplay="' + (profile.heroAutoplay ? "true" : "false") + '"' +
    ' data-interval="' + (profile.heroInterval * 1000) + '"' +
    ' aria-roledescription="carousel" aria-label="Sorotan utama">' +
    '\n      <div class="slides">' + slidesHtml + "\n      </div>" +
    controls +
    "\n    </section>";

  /* === 2) STATISTIK (kartu terangkat menumpuk tepi bawah hero) === */
  var stats = "";
  if (profile.hasStats) {
    var statItems = profile.stats.map(function (st) {
      return '<div class="stat"><span class="stat-value">' + esc(st.value || "") + '</span><span class="stat-label">' + esc(st.label || "") + "</span></div>";
    }).join("");
    stats =
      '\n    <section class="stats-band">' +
      '\n      <div class="container"><div class="stats-card">' + statItems + "</div></div>" +
      "\n    </section>";
  }

  /* === 3) PROFIL / TENTANG === */
  var about = "";
  if (profile.about) {
    var pointsHtml = profile.about.points.length
      ? '<ul class="about-points">' + profile.about.points.map(function (pt) {
          return "<li>" + icons.featureIcon("check") + "<span>" + esc(pt) + "</span></li>";
        }).join("") + "</ul>"
      : "";
    var aboutText = profile.about.text ? "<p>" + esc(profile.about.text) + "</p>" : "";
    var aboutMedia = profile.about.image
      ? '<div class="about-media"><img src="' + attr(U.url(profile.about.image)) + '" alt="' + attr(profile.about.title) + '" loading="lazy"></div>'
      : '<div class="about-panel"><span class="about-panel-mark">' + esc(config.title) + "</span></div>";
    about =
      '\n    <section class="section" id="profil">' +
      '\n      <div class="container"><div class="about-grid">' +
      '\n        <div class="about-text">' +
      '<span class="eyebrow">' + esc(profile.about.eyebrow) + "</span>" +
      "<h2>" + esc(profile.about.title) + "</h2>" +
      aboutText + pointsHtml +
      "\n        </div>" +
      "\n        " + aboutMedia +
      "\n      </div></div>" +
      "\n    </section>";
  }

  /* === 4) LAYANAN === */
  var services = "";
  if (profile.hasServices) {
    var cards = profile.services.map(function (s) {
      var inner =
        '<div class="service-icon">' + icons.featureIcon(s.icon) + "</div>" +
        '<h3 class="service-title">' + esc(s.title || "") + "</h3>" +
        '<p class="service-text">' + esc(s.text || "") + "</p>";
      if (s.url) {
        return (
          '\n        <a class="service-card service-card-link" href="' + attr(navHref(U, s.url)) + '">' +
          inner +
          '<span class="service-more">Selengkapnya ' + icons.arrow() + "</span>" +
          "</a>"
        );
      }
      return '\n        <article class="service-card">' + inner + "</article>";
    }).join("");
    var svcIntro = profile.servicesIntro ? "<p>" + esc(profile.servicesIntro) + "</p>" : "";
    services =
      '\n    <section class="section section-alt" id="layanan">' +
      '\n      <div class="container">' +
      '\n        <div class="section-head center"><span class="eyebrow">' + esc(profile.servicesEyebrow) + '</span><h2>' + esc(profile.servicesTitle) + "</h2>" + svcIntro + "</div>" +
      '\n        <div class="service-grid">' + cards + "</div>" +
      "\n      </div>" +
      "\n    </section>";
  }

  /* === 5) BERITA / WAWASAN (memakai posts dari inti) === */
  var news = "";
  if (profile.newsEnabled && posts && posts.length) {
    var latest = posts.slice(0, profile.newsCount);
    var newsIntro = profile.newsIntro ? "<p>" + esc(profile.newsIntro) + "</p>" : "";
    var cardsHtml = latest.map(function (p) { return postCard(p, ctx); }).join("");
    var moreLink = totalPages > 1
      ? '<div class="news-more"><a class="btn btn-outline" href="' + attr(U.url("/page/2/")) + '">Lihat artikel lainnya ' + icons.arrow() + "</a></div>"
      : "";
    news =
      '\n    <section class="section" id="berita">' +
      '\n      <div class="container">' +
      '\n        <div class="section-head"><span class="eyebrow">' + esc(profile.newsEyebrow) + '</span><h2>' + esc(profile.newsTitle) + "</h2>" + newsIntro + "</div>" +
      '\n        <div class="post-grid">' + cardsHtml + "</div>" +
      moreLink +
      "\n      </div>" +
      "\n    </section>";
  }

  /* === 6) CTA BAND === */
  var ctaBand = "";
  if (profile.ctaBand) {
    var bandText = profile.ctaBand.text ? "<p>" + esc(profile.ctaBand.text) + "</p>" : "";
    ctaBand =
      '\n    <section class="cta-band">' +
      '\n      <div class="container"><div class="cta-inner">' +
      "<h2>" + esc(profile.ctaBand.title) + "</h2>" + bandText +
      '<div class="cta-actions"><a class="btn btn-light btn-lg" href="' + attr(navHref(U, profile.ctaBand.button.url)) + '">' + esc(profile.ctaBand.button.text) + "</a></div>" +
      "</div></div>" +
      "\n    </section>";
  }

  var content = hero + stats + about + services + news + ctaBand;
  return layout(ctx, content);
};

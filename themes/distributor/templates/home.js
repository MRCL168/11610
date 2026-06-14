/* ============================================================
   templates/home.js — Beranda landing "Distributor" (TEMA)
   Halaman 1 = landing katalog: hero slider fullwidth + teks →
   fitur/keunggulan (ikon di kiri) → profil singkat + foto →
   grid produk/katalog (dari post) → lokasi + kontak → CTA.
   Halaman 2+ = indeks produk sederhana dengan paginasi.

   ctx: { config, U, lib, site, seo, themeVars, themeContent,
          posts, pageNum, totalPages }
   ============================================================ */

var layout = require("./partials/layout");
var postCard = require("./partials/post-card");
var contentMod = require("./partials/content");
var iconsMod = require("./partials/icons");
var getContent = contentMod.getContent;
var navHref = contentMod.navHref;
var waLink = contentMod.waLink;
var digits = contentMod.digits;
var featureIcon = iconsMod.featureIcon;
var ui = iconsMod.ui;

module.exports = function home(ctx) {
  var config = ctx.config, U = ctx.U, lib = ctx.lib, posts = ctx.posts, pageNum = ctx.pageNum, totalPages = ctx.totalPages;
  var esc = lib.esc, attr = lib.attr;

  /* ============================================================
     Halaman 2+ : indeks produk sederhana + paginasi
     ============================================================ */
  if (pageNum > 1) {
    var cardsP = posts.map(function (p) { return postCard(p, ctx); }).join("");
    var prevP = pageNum > 1
      ? '<a class="page-link" href="' + attr(U.url(pageNum === 2 ? "/" : "/page/" + (pageNum - 1) + "/")) + '">← Sebelumnya</a>'
      : '<span class="page-link disabled">← Sebelumnya</span>';
    var nextP = pageNum < totalPages
      ? '<a class="page-link" href="' + attr(U.url("/page/" + (pageNum + 1) + "/")) + '">Berikutnya →</a>'
      : '<span class="page-link disabled">Berikutnya →</span>';
    var idxContent =
      '\n    <section class="page-head"><div class="container"><span class="page-head-kicker">Katalog</span><h1>Produk — Halaman ' + pageNum + "</h1></div></section>" +
      '\n    <section class="section"><div class="container">' +
      '<div class="product-grid cols-3">' + cardsP + "</div>" +
      '\n      <nav class="pagination">' + prevP + '<span class="page-info">Halaman ' + pageNum + " dari " + totalPages + "</span>" + nextP + "</nav>" +
      "\n    </div></section>";
    return layout(ctx, idxContent);
  }

  /* ============================================================
     Halaman 1 : landing
     ============================================================ */
  var d = getContent(ctx);

  /* -------- 1. HERO (slider fullwidth + teks) -------- */
  var slidesHtml = d.hero.slides.map(function (s, i) {
    return '<div class="hero-slide' + (i === 0 ? " is-active" : "") + '"' +
      ' style="background-image:url(\'' + attr(U.url(s.image)) + '\')" role="img" aria-label="' + attr(s.alt || d.hero.title) + '"></div>';
  }).join("");
  var hasSlides = d.hero.slides.length > 0;
  var dots = d.hero.slides.length > 1
    ? '<div class="hero-dots" role="tablist" aria-label="Navigasi slider">' +
      d.hero.slides.map(function (s, i) {
        return '<button class="hero-dot' + (i === 0 ? " is-active" : "") + '" type="button" data-slide="' + i + '" aria-label="Slide ' + (i + 1) + '"></button>';
      }).join("") + "</div>"
    : "";
  var heroSecondary = d.hero.secondaryCta
    ? '<a class="btn btn-ghost btn-lg" href="' + attr(navHref(U, d.hero.secondaryCta.url)) + '">' + esc(d.hero.secondaryCta.text) + "</a>"
    : "";
  var hero =
    '\n    <section class="hero' + (hasSlides ? " has-slider" : " hero-plain") + '"' +
    (hasSlides ? ' data-autoplay="' + (d.hero.autoplay ? "1" : "0") + '" data-interval="' + (d.hero.interval * 1000) + '"' : "") + ">" +
    (hasSlides ? '\n      <div class="hero-slides">' + slidesHtml + "</div>\n      <div class=\"hero-overlay\" aria-hidden=\"true\"></div>" : "") +
    '\n      <div class="container">' +
    '\n        <div class="hero-inner">' +
    '<span class="eyebrow">' + esc(d.hero.eyebrow) + "</span>" +
    '<h1 class="hero-title">' + esc(d.hero.title) + "</h1>" +
    (d.hero.subtitle ? '<p class="hero-lead">' + esc(d.hero.subtitle) + "</p>" : "") +
    '<div class="hero-actions">' +
    '<a class="btn btn-primary btn-lg" href="' + attr(navHref(U, d.hero.primaryCta.url)) + '">' + esc(d.hero.primaryCta.text) + "</a>" +
    heroSecondary +
    "</div>" +
    "</div>" +
    "\n      </div>" +
    dots +
    "\n    </section>";

  /* -------- 2. FITUR / KEUNGGULAN (ikon di samping kiri) -------- */
  var features = "";
  if (d.features) {
    var fIntro = d.features.intro ? "<p>" + esc(d.features.intro) + "</p>" : "";
    var fItems = d.features.items.map(function (f) {
      return (
        '\n        <div class="feature-item">' +
        '<div class="feature-icon">' + featureIcon(f.icon) + "</div>" +
        '<div class="feature-text"><h3>' + esc(f.title) + "</h3>" + (f.text ? "<p>" + esc(f.text) + "</p>" : "") + "</div>" +
        "</div>"
      );
    }).join("");
    features =
      '\n    <section class="section section-alt" id="keunggulan">' +
      '\n      <div class="container">' +
      '\n        <div class="section-head center"><span class="eyebrow">' + esc(d.features.eyebrow) + '</span><h2>' + esc(d.features.title) + "</h2>" + fIntro + "</div>" +
      '\n        <div class="feature-grid">' + fItems + "</div>" +
      "\n      </div>" +
      "\n    </section>";
  }

  /* -------- 3. PROFIL SINGKAT + FOTO -------- */
  var profile = "";
  if (d.profile) {
    var pPoints = d.profile.points.length
      ? '<ul class="profile-points">' + d.profile.points.map(function (pt) { return "<li>" + ui("check") + "<span>" + esc(pt) + "</span></li>"; }).join("") + "</ul>"
      : "";
    var pText = d.profile.text ? "<p>" + esc(d.profile.text) + "</p>" : "";
    var pBtn = d.profile.button
      ? '<a class="btn btn-primary" href="' + attr(navHref(U, d.profile.button.url)) + '">' + esc(d.profile.button.text) + "</a>"
      : "";
    var pMedia = d.profile.image
      ? '<div class="profile-media"><img src="' + attr(U.url(d.profile.image)) + '" alt="' + attr(d.profile.title) + '"></div>'
      : '<div class="profile-panel"><span class="profile-panel-mark">' + esc(config.title) + "</span></div>";
    profile =
      '\n    <section class="section" id="tentang">' +
      '\n      <div class="container">' +
      '\n        <div class="profile-grid">' +
      '\n          <div class="profile-text">' +
      '<span class="eyebrow">' + esc(d.profile.eyebrow) + "</span>" +
      "<h2>" + esc(d.profile.title) + "</h2>" +
      pText + pPoints + (pBtn ? '<div class="profile-actions">' + pBtn + "</div>" : "") +
      "\n          </div>" +
      "\n          " + pMedia +
      "\n        </div>" +
      "\n      </div>" +
      "\n    </section>";
  }

  /* -------- 4. GRID PRODUK / KATALOG (data dari post) -------- */
  var catalog = "";
  var allPosts = (ctx.site && ctx.site.recentPosts) || posts || [];
  if (allPosts.length) {
    var items = allPosts.slice(0, d.catalog.count);
    var cards = items.map(function (p) { return postCard(p, ctx); }).join("");
    var cIntro = d.catalog.intro ? "<p>" + esc(d.catalog.intro) + "</p>" : "";
    var viewAll = d.catalog.viewAllUrl
      ? '\n        <div class="catalog-more"><a class="btn btn-ghost btn-lg" href="' + attr(navHref(U, d.catalog.viewAllUrl)) + '">' + esc(d.catalog.viewAllText) + " " + ui("arrow") + "</a></div>"
      : "";
    catalog =
      '\n    <section class="section section-alt" id="katalog">' +
      '\n      <div class="container">' +
      '\n        <div class="section-head center"><span class="eyebrow">' + esc(d.catalog.eyebrow) + '</span><h2>' + esc(d.catalog.title) + "</h2>" + cIntro + "</div>" +
      '\n        <div class="product-grid cols-' + d.catalog.columns + '">' + cards + "</div>" +
      viewAll +
      "\n      </div>" +
      "\n    </section>";
  }

  /* -------- 5. LOKASI + KONTAK -------- */
  var loc = d.location;
  var hasLocContent = loc.address || loc.phone || loc.whatsapp || loc.email || loc.mapEmbed || loc.text;
  var location = "";
  if (hasLocContent) {
    // Peta: terima embed URL (src) atau snippet <iframe> penuh (tepercaya).
    var mapHtml = "";
    if (loc.mapEmbed) {
      if (/<iframe/i.test(loc.mapEmbed)) {
        mapHtml = '<div class="location-map">' + loc.mapEmbed + "</div>";
      } else {
        mapHtml = '<div class="location-map"><iframe src="' + attr(loc.mapEmbed) + '" title="Peta lokasi" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>';
      }
    } else {
      mapHtml = '<div class="location-map location-map-ph">' + ui("pin") + "<span>Peta lokasi belum diatur</span></div>";
    }

    var contactRows = [];
    if (loc.address) contactRows.push('<li>' + ui("pin") + "<div><span class=\"ci-label\">Alamat</span>" + esc(loc.address) + "</div></li>");
    if (loc.phone) contactRows.push('<li>' + ui("phone") + '<div><span class="ci-label">Telepon</span><a href="tel:' + attr(digits(loc.phone)) + '">' + esc(loc.phone) + "</a></div></li>");
    if (loc.whatsapp) contactRows.push('<li>' + ui("whatsapp") + '<div><span class="ci-label">WhatsApp</span><a href="' + attr(waLink(loc.whatsapp, "Halo, saya ingin bertanya tentang produk Anda.")) + '" target="_blank" rel="noopener">' + esc(loc.whatsapp) + "</a></div></li>");
    if (loc.email) contactRows.push('<li>' + ui("mail") + '<div><span class="ci-label">Email</span><a href="mailto:' + attr(loc.email) + '">' + esc(loc.email) + "</a></div></li>");
    if (loc.hours) contactRows.push('<li>' + ui("clock") + "<div><span class=\"ci-label\">Jam Operasional</span>" + esc(loc.hours) + "</div></li>");

    var locActions = [];
    if (loc.whatsapp) locActions.push('<a class="btn btn-primary" href="' + attr(waLink(loc.whatsapp, "Halo, saya ingin bertanya tentang produk Anda.")) + '" target="_blank" rel="noopener">' + ui("whatsapp") + "<span>Chat WhatsApp</span></a>");
    if (loc.mapUrl) locActions.push('<a class="btn btn-ghost" href="' + attr(loc.mapUrl) + '" target="_blank" rel="noopener">' + ui("pin") + "<span>Buka di Maps</span></a>");

    location =
      '\n    <section class="section" id="lokasi">' +
      '\n      <div class="container">' +
      '\n        <div class="location-grid">' +
      "\n          " + mapHtml +
      '\n          <div class="location-info">' +
      '<span class="eyebrow">' + esc(loc.eyebrow) + "</span>" +
      "<h2>" + esc(loc.title) + "</h2>" +
      (loc.text ? "<p>" + esc(loc.text) + "</p>" : "") +
      (contactRows.length ? '<ul class="contact-info">' + contactRows.join("") + "</ul>" : "") +
      (locActions.length ? '<div class="location-actions">' + locActions.join("") + "</div>" : "") +
      "\n          </div>" +
      "\n        </div>" +
      "\n      </div>" +
      "\n    </section>";
  }

  /* -------- 6. CTA band penutup -------- */
  var ctaBand = "";
  if (d.cta) {
    var bandText = d.cta.text ? "<p>" + esc(d.cta.text) + "</p>" : "";
    var bandBtnExt = /^https?:/i.test(d.cta.button.url);
    ctaBand =
      '\n    <section class="cta-band">' +
      '\n      <div class="container"><div class="cta-inner">' +
      "<h2>" + esc(d.cta.title) + "</h2>" + bandText +
      '<div class="cta-actions"><a class="btn btn-light btn-lg" href="' + attr(navHref(U, d.cta.button.url)) + '"' + (bandBtnExt ? ' target="_blank" rel="noopener"' : "") + ">" + esc(d.cta.button.text) + "</a></div>" +
      "</div></div>" +
      "\n    </section>";
  }

  var content = hero + features + profile + catalog + location + ctaBand;
  return layout(ctx, content);
};

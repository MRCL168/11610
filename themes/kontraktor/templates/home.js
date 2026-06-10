/* ============================================================
   templates/home.js — Beranda tema Kontraktor
   Urutan section: hero → fitur → tentang → portofolio → testimoni → CTA.
   Template tetap fungsi murni (ctx) => string HTML.
   ============================================================ */

var layout = require("./partials/layout");
var postCard = require("./partials/post-card");
var profileMod = require("./partials/profile");
var icons = require("./partials/icons");
var getProfile = profileMod.getProfile;
var navHref = profileMod.navHref;

function imgTag(ctx, src, alt, cls) {
  if (!src) return "";
  return '<img class="' + cls + '" src="' + ctx.lib.attr(ctx.U.url(src)) + '" alt="' + ctx.lib.attr(alt || "") + '" loading="lazy">';
}

function sectionHead(lib, eyebrow, title, text, center) {
  var esc = lib.esc;
  return '<div class="section-head' + (center ? " center" : "") + '">' +
    (eyebrow ? '<span class="eyebrow">' + esc(eyebrow) + '</span>' : "") +
    (title ? '<h2>' + esc(title) + '</h2>' : "") +
    (text ? '<p>' + esc(text) + '</p>' : "") +
    '</div>';
}

function renderHero(ctx, profile) {
  var U = ctx.U, lib = ctx.lib;
  var esc = lib.esc, attr = lib.attr;
  var h = profile.hero;
  if (!h.enabled) return "";
  var bg = h.background ? ' style="background-image:url(\'' + attr(U.url(h.background)) + '\')"' : "";
  var secondary = h.secondaryCta.text || h.secondaryCta.url
    ? '<a class="btn btn-light-ghost btn-lg" href="' + attr(navHref(U, h.secondaryCta.url)) + '">' + esc(h.secondaryCta.text) + '</a>'
    : "";
  var card = h.image
    ? '<div class="hero-card"><img src="' + attr(U.url(h.image)) + '" alt="' + attr(h.title) + '"><span>' + esc(h.badge) + '</span></div>'
    : '<div class="hero-card hero-card-empty"><span>' + esc(h.badge) + '</span><strong>Rencana · Bangun · Renovasi</strong></div>';
  return '\n    <section class="hero"' + bg + '>' +
    '\n      <div class="hero-overlay" aria-hidden="true"></div>' +
    '\n      <div class="container hero-inner">' +
    '\n        <div class="hero-text">' +
    '<span class="eyebrow hero-eyebrow">' + esc(h.eyebrow) + '</span>' +
    '<h1>' + esc(h.title) + '</h1>' +
    '<p>' + esc(h.text) + '</p>' +
    '<div class="hero-actions"><a class="btn btn-primary btn-lg" href="' + attr(navHref(U, h.primaryCta.url)) + '">' + esc(h.primaryCta.text) + '</a>' + secondary + '</div>' +
    '</div>' +
    '\n        ' + card +
    '\n      </div>' +
    '\n    </section>';
}

function renderFeatures(ctx, profile) {
  var lib = ctx.lib;
  var esc = lib.esc;
  var f = profile.features;
  if (!f.enabled) return "";
  var cards = f.items.map(function (it) {
    return '<article class="feature-card"><div class="feature-icon">' + icons.featureIcon(it.icon) + '</div><h3>' + esc(it.title) + '</h3><p>' + esc(it.text) + '</p></article>';
  }).join("");
  var media = f.image ? '<div class="section-media framed-media">' + imgTag(ctx, f.image, f.title, "") + '</div>' : "";
  return '\n    <section class="section features" id="fitur">' +
    '\n      <div class="container">' +
    '\n        <div class="split-head">' + sectionHead(lib, f.eyebrow, f.title, f.text, false) + media + '</div>' +
    '\n        <div class="feature-grid">' + cards + '</div>' +
    '\n      </div>' +
    '\n    </section>';
}

function renderAbout(ctx, profile) {
  var lib = ctx.lib;
  var esc = lib.esc;
  var a = profile.about;
  if (!a.enabled) return "";
  var points = a.points.length ? '<ul class="check-list">' + a.points.map(function (pt) { return '<li>' + esc(pt) + '</li>'; }).join("") + '</ul>' : "";
  var stats = a.stats.length ? '<div class="about-stats">' + a.stats.map(function (s) { return '<div><strong>' + esc(s.value || "") + '</strong><span>' + esc(s.label || "") + '</span></div>'; }).join("") + '</div>' : "";
  var media = a.image ? '<div class="about-media">' + imgTag(ctx, a.image, a.title, "") + '</div>' : '<div class="about-media about-placeholder"><span>Kontraktor</span><strong>Bangunan kuat dimulai dari rencana yang jelas.</strong></div>';
  return '\n    <section class="section section-alt about" id="tentang">' +
    '\n      <div class="container about-grid">' +
    '\n        <div class="about-copy">' + sectionHead(lib, a.eyebrow, a.title, a.text, false) + points + stats + '</div>' +
    '\n        ' + media +
    '\n      </div>' +
    '\n    </section>';
}

function portfolioCard(ctx, item) {
  var U = ctx.U, lib = ctx.lib;
  var esc = lib.esc, attr = lib.attr;
  var media = item.image ? '<img src="' + attr(U.url(item.image)) + '" alt="' + attr(item.title) + '" loading="lazy">' : '<div class="portfolio-empty"><span>Proyek</span></div>';
  var meta = [item.category, item.location, item.year].filter(Boolean).map(esc).join(' · ');
  var body = '<div class="portfolio-media">' + media + '</div><div class="portfolio-body">' + (meta ? '<span class="portfolio-meta">' + meta + '</span>' : "") + '<h3>' + esc(item.title) + '</h3>' + (item.text ? '<p>' + esc(item.text) + '</p>' : "") + '</div>';
  if (item.url) return '<a class="portfolio-card" href="' + attr(navHref(U, item.url)) + '">' + body + '</a>';
  return '<article class="portfolio-card">' + body + '</article>';
}

function renderPortfolio(ctx, profile, standalone) {
  var lib = ctx.lib;
  var p = profile.portfolio;
  if (!p.enabled || !p.items.length) return "";
  var cards = p.items.map(function (item) { return portfolioCard(ctx, item); }).join("");
  var media = p.image && !standalone ? '<div class="section-media framed-media">' + imgTag(ctx, p.image, p.title, "") + '</div>' : "";
  return '\n    <section class="section portfolio" id="portofolio">' +
    '\n      <div class="container">' +
    '\n        <div class="split-head">' + sectionHead(lib, p.eyebrow, p.title, p.text, false) + media + '</div>' +
    '\n        <div class="portfolio-grid">' + cards + '</div>' +
    '\n      </div>' +
    '\n    </section>';
}

function renderTestimonials(ctx, profile) {
  var lib = ctx.lib;
  var esc = lib.esc, attr = lib.attr;
  var t = profile.testimonials;
  if (!t.enabled || !t.items.length) return "";
  var cards = t.items.map(function (it) {
    var photo = it.photo ? '<img src="' + attr(ctx.U.url(it.photo)) + '" alt="' + attr(it.name) + '" loading="lazy">' : '<span>' + esc((it.name || "K").slice(0, 1)) + '</span>';
    return '<article class="testimonial-card"><p>“' + esc(it.quote) + '”</p><div class="testimonial-person"><div class="avatar">' + photo + '</div><div><strong>' + esc(it.name) + '</strong>' + (it.role ? '<small>' + esc(it.role) + '</small>' : "") + '</div></div></article>';
  }).join("");
  var media = t.image ? '<div class="section-media framed-media">' + imgTag(ctx, t.image, t.title, "") + '</div>' : "";
  return '\n    <section class="section section-alt testimonials" id="testimoni">' +
    '\n      <div class="container">' +
    '\n        <div class="split-head">' + sectionHead(lib, t.eyebrow, t.title, t.text, false) + media + '</div>' +
    '\n        <div class="testimonial-grid">' + cards + '</div>' +
    '\n      </div>' +
    '\n    </section>';
}

function renderCta(ctx, profile) {
  var U = ctx.U, lib = ctx.lib;
  var esc = lib.esc, attr = lib.attr;
  var c = profile.cta;
  if (!c.enabled) return "";
  var bg = c.image ? ' style="background-image:url(\'' + attr(U.url(c.image)) + '\')"' : "";
  return '\n    <section class="cta-section"' + bg + '>' +
    '\n      <div class="cta-overlay" aria-hidden="true"></div>' +
    '\n      <div class="container cta-inner">' +
    '<span class="eyebrow">' + esc(c.eyebrow) + '</span><h2>' + esc(c.title) + '</h2><p>' + esc(c.text) + '</p>' +
    '<a class="btn btn-light btn-lg" href="' + attr(navHref(U, c.button.url)) + '">' + esc(c.button.text) + '</a>' +
    '</div>' +
    '\n    </section>';
}

module.exports = function home(ctx) {
  var U = ctx.U, lib = ctx.lib, posts = ctx.posts || [], pageNum = ctx.pageNum || 1, totalPages = ctx.totalPages || 1;
  var attr = lib.attr;

  if (pageNum > 1) {
    var cardsP = posts.map(function (p) { return postCard(p, ctx); }).join("");
    var prevP = pageNum > 1 ? '<a class="page-link" href="' + attr(U.url(pageNum === 2 ? "/" : "/page/" + (pageNum - 1) + "/")) + '">← Sebelumnya</a>' : '<span class="page-link disabled">← Sebelumnya</span>';
    var nextP = pageNum < totalPages ? '<a class="page-link" href="' + attr(U.url("/page/" + (pageNum + 1) + "/")) + '">Berikutnya →</a>' : '<span class="page-link disabled">Berikutnya →</span>';
    var idxContent = '\n    <section class="page-head"><div class="container"><span class="page-head-kicker">Artikel</span><h1>Artikel — Halaman ' + pageNum + '</h1></div></section>' +
      '\n    <section class="section"><div class="container"><div class="post-grid">' + cardsP + '</div>' +
      '<nav class="pagination">' + prevP + '<span class="page-info">Halaman ' + pageNum + ' dari ' + totalPages + '</span>' + nextP + '</nav></div></section>';
    return layout(ctx, idxContent);
  }

  var profile = getProfile(ctx);
  var content = renderHero(ctx, profile) + renderFeatures(ctx, profile) + renderAbout(ctx, profile) + renderPortfolio(ctx, profile, false) + renderTestimonials(ctx, profile) + renderCta(ctx, profile);
  return layout(ctx, content);
};

module.exports.renderPortfolio = renderPortfolio;
module.exports.portfolioCard = portfolioCard;

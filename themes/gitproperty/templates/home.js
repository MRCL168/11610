/* ============================================================
   templates/home.js — Beranda agen properti (TEMA Gitproperty)
   Halaman 1 = landing: hero + Pencarian Properti → Property
   Unggulan → Property Terbaru → Berita → CTA. Tiap seksi dapat
   ditampilkan/disembunyikan dan jumlah propertinya diatur dari
   menu "Sesuaikan" (skema theme.json).
   Halaman 2+ = indeks sederhana (kartu + paginasi).
   ctx: { config, U, lib, site, seo, themeVars, themeContent,
          posts, pageNum, totalPages }
   ============================================================ */

var layout = require("./partials/layout");
var postCard = require("./partials/post-card");
var icons = require("./partials/icons");
var prop = require("./partials/property");
var navHref = prop.navHref;

module.exports = function home(ctx) {
  var config = ctx.config, U = ctx.U, lib = ctx.lib, posts = ctx.posts, pageNum = ctx.pageNum, totalPages = ctx.totalPages;
  var esc = lib.esc, attr = lib.attr;

  /* -------- Halaman 2+: indeks sederhana -------- */
  if (pageNum > 1) {
    var cardsP = posts.map(function (p) { return postCard(p, ctx); }).join("");
    var prevP = pageNum > 1
      ? '<a class="page-link" href="' + attr(U.url(pageNum === 2 ? "/" : "/page/" + (pageNum - 1) + "/")) + '">← Sebelumnya</a>'
      : '<span class="page-link disabled">← Sebelumnya</span>';
    var nextP = pageNum < totalPages
      ? '<a class="page-link" href="' + attr(U.url("/page/" + (pageNum + 1) + "/")) + '">Berikutnya →</a>'
      : '<span class="page-link disabled">Berikutnya →</span>';
    var idxContent =
      '\n    <section class="page-head"><div class="container"><span class="page-head-kicker">Daftar</span><h1>Properti &amp; Artikel — Halaman ' + pageNum + "</h1></div></section>" +
      '\n    <section class="section"><div class="container">' +
      '<div class="prop-grid">' + cardsP + "</div>" +
      '\n      <nav class="pagination">' + prevP + '<span class="page-info">Halaman ' + pageNum + " dari " + totalPages + "</span>" + nextP + "</nav>" +
      "\n    </div></section>";
    return layout(ctx, idxContent);
  }

  /* -------- Halaman 1: landing -------- */
  var h = prop.getHome(ctx);

  /* ---- Hero + Pencarian Properti ---- */
  function opt(value, label, selected) {
    return '<option value="' + attr(value) + '"' + (selected ? " selected" : "") + ">" + esc(label) + "</option>";
  }
  function selectField(id, label, optionsHtml) {
    return (
      '<label class="ps-field">' +
      '<span class="ps-label">' + esc(label) + "</span>" +
      '<select id="' + id + '" class="ps-input">' + optionsHtml + "</select>" +
      "</label>"
    );
  }

  var search = "";
  if (h.search.enabled) {
    var typeOpts = [opt("", "Semua Tipe", true)].concat(
      h.filters.types.map(function (t) { return opt(t.toLowerCase(), t, false); })
    ).join("");
    var listingOpts = [
      opt("", "Jual & Sewa", true),
      opt("dijual", "Dijual", false),
      opt("disewa", "Disewa", false),
    ].join("");
    var locOpts = [opt("", "Semua Lokasi", true)].concat(
      h.filters.locations.map(function (l) { return opt(l.toLowerCase(), l, false); })
    ).join("");
    var priceOpts = [
      opt("", "Semua Harga", true),
      opt("500000000", "< Rp 500 Jt", false),
      opt("1000000000", "< Rp 1 M", false),
      opt("2000000000", "< Rp 2 M", false),
      opt("5000000000", "< Rp 5 M", false),
      opt("10000000000", "< Rp 10 M", false),
    ].join("");
    var bedsOpts = [
      opt("", "Semua", true),
      opt("1", "1+", false),
      opt("2", "2+", false),
      opt("3", "3+", false),
      opt("4", "4+", false),
    ].join("");

    search =
      '\n      <div class="container">' +
      '\n        <form class="prop-search" id="prop-search" role="search" aria-label="Pencarian properti">' +
      '\n          <div class="ps-title">' + icons.propIcon("search") + "<span>" + esc(h.search.title) + "</span></div>" +
      '\n          <div class="ps-grid">' +
      '<label class="ps-field ps-field-wide"><span class="ps-label">Kata Kunci</span>' +
      '<input id="ps-q" class="ps-input" type="text" placeholder="Nama, area, atau alamat properti" autocomplete="off"></label>' +
      selectField("ps-type", "Tipe Properti", typeOpts) +
      selectField("ps-listing", "Status", listingOpts) +
      selectField("ps-lokasi", "Lokasi", locOpts) +
      selectField("ps-price", "Harga Maks.", priceOpts) +
      selectField("ps-beds", "Kamar Tidur", bedsOpts) +
      '<div class="ps-actions">' +
      '<button type="submit" class="btn btn-primary ps-submit">' + icons.propIcon("search") + "<span>" + esc(h.search.submitText) + "</span></button>" +
      '<button type="button" class="ps-reset" id="ps-reset">Reset</button>' +
      "</div>" +
      "\n          </div>" +
      "\n        </form>" +
      "\n      </div>";
  }

  var hero =
    '\n    <section class="hero">' +
    '\n      <div class="hero-bg" aria-hidden="true"></div>' +
    '\n      <div class="container hero-inner">' +
    '<span class="hero-badge">' + icons.propIcon("key") + "<span>" + esc(h.hero.badge) + "</span></span>" +
    '<h1 class="hero-title">' + esc(h.hero.title) + "</h1>" +
    '<p class="hero-lead">' + esc(h.hero.subtitle) + "</p>" +
    "</div>" +
    search +
    "\n    </section>";

  /* ---- Helper kepala seksi ---- */
  function sectionHead(eyebrow, title, intro) {
    return (
      '\n        <div class="section-head">' +
      (eyebrow ? '<span class="eyebrow">' + esc(eyebrow) + "</span>" : "") +
      "<h2>" + esc(title) + "</h2>" +
      (intro ? "<p>" + esc(intro) + "</p>" : "") +
      "\n        </div>"
    );
  }

  /* ---- Property Unggulan ---- */
  var featured = "";
  if (h.featured.enabled && h.featured.list.length) {
    var fCards = h.featured.list.map(function (p) { return postCard(p, ctx); }).join("");
    featured =
      '\n    <section class="section" id="unggulan">' +
      '\n      <div class="container">' +
      sectionHead(h.featured.eyebrow, h.featured.title, h.featured.intro) +
      '\n        <div class="prop-grid">' + fCards + "</div>" +
      "\n      </div>" +
      "\n    </section>";
  }

  /* ---- Property Terbaru (target pencarian) ---- */
  var latest = "";
  if (h.latest.enabled && h.latest.list.length) {
    var lCards = h.latest.list.map(function (p) { return postCard(p, ctx); }).join("");
    var moreBtn = h.latest.list.length > h.latest.initial
      ? '\n        <div class="pool-actions"><button type="button" class="btn btn-outline" id="prop-more">Tampilkan Semua (' + h.latest.list.length + ")</button></div>"
      : "";
    latest =
      '\n    <section class="section section-alt" id="properti">' +
      '\n      <div class="container">' +
      sectionHead(h.latest.eyebrow, h.latest.title, h.latest.intro) +
      '\n        <div class="prop-grid" id="prop-pool" data-initial="' + h.latest.initial + '">' + lCards + "</div>" +
      '\n        <p class="prop-empty" id="prop-empty" hidden>Tidak ada properti yang cocok dengan pencarian Anda. Coba ubah atau atur ulang filter.</p>' +
      moreBtn +
      "\n      </div>" +
      "\n    </section>";
  }

  /* ---- Berita ---- */
  var news = "";
  if (h.news.enabled && h.news.list.length) {
    var nCards = h.news.list.map(function (p) { return postCard(p, ctx); }).join("");
    news =
      '\n    <section class="section" id="berita">' +
      '\n      <div class="container">' +
      '\n        <div class="articles-head">' +
      '<div class="section-head">' +
      (h.news.eyebrow ? '<span class="eyebrow">' + esc(h.news.eyebrow) + "</span>" : "") +
      "<h2>" + esc(h.news.title) + "</h2>" +
      "</div>" +
      '<a class="link-more" href="' + attr(U.url("/page/2/")) + '">Lihat semua ' + icons.arrow() + "</a>" +
      "</div>" +
      (h.news.intro ? '<p class="section-intro">' + esc(h.news.intro) + "</p>" : "") +
      '\n        <div class="post-grid">' + nCards + "</div>" +
      "\n      </div>" +
      "\n    </section>";
  }

  /* ---- CTA band ---- */
  var cta = "";
  if (h.cta.enabled) {
    cta =
      '\n    <section class="cta-band">' +
      '\n      <div class="container"><div class="cta-inner">' +
      "<h2>" + esc(h.cta.title) + "</h2>" +
      (h.cta.text ? "<p>" + esc(h.cta.text) + "</p>" : "") +
      '<div class="cta-actions"><a class="btn btn-light btn-lg" href="' + attr(navHref(U, h.cta.button.url)) + '">' + esc(h.cta.button.text) + "</a></div>" +
      "</div></div>" +
      "\n    </section>";
  }

  var content = hero + featured + latest + news + cta;
  return layout(ctx, content);
};

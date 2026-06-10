/* ============================================================
   templates/home.js — Beranda portal berita (TEMA)
   Halaman 1: ticker terkini, hero berita utama, blok per-kategori
   yang dapat dikonfigurasi, dan daftar berita terbaru.
   Halaman 2+: indeks artikel sederhana dengan paginasi.

   ctx: { config, U, lib, site, seo, themeVars, posts, pageNum, totalPages }
   ============================================================ */

var layout      = require("./partials/layout");
var newsCard    = require("./partials/news-card");
var newsMod     = require("./partials/news-settings");
var getNewsSettings = newsMod.getNewsSettings;

module.exports = function home(ctx) {
  var config = ctx.config, U = ctx.U, lib = ctx.lib;
  var posts = ctx.posts, pageNum = ctx.pageNum, totalPages = ctx.totalPages;
  var esc = lib.esc, attr = lib.attr;

  /* ========================================================
     Halaman 2+: indeks artikel terpaginasi
     ======================================================== */
  if (pageNum > 1) {
    var cardsP = posts.map(function (p) { return newsCard.gridCard(p, ctx); }).join("");
    var prevP = pageNum > 1
      ? '<a class="page-link" href="' + attr(U.url(pageNum === 2 ? "/" : "/page/" + (pageNum - 1) + "/")) + '">← Sebelumnya</a>'
      : '<span class="page-link disabled">← Sebelumnya</span>';
    var nextP = pageNum < totalPages
      ? '<a class="page-link" href="' + attr(U.url("/page/" + (pageNum + 1) + "/")) + '">Berikutnya →</a>'
      : '<span class="page-link disabled">Berikutnya →</span>';

    var idxContent =
      '\n    <section class="page-head"><div class="container">' +
      '<span class="page-head-kicker">Semua Berita</span>' +
      "<h1>Halaman " + pageNum + "</h1>" +
      "</div></section>" +
      '\n    <section class="section"><div class="container">' +
      '<div class="news-grid">' + cardsP + "</div>" +
      '\n      <nav class="pagination">' + prevP + '<span class="page-info">Halaman ' + pageNum + " dari " + totalPages + "</span>" + nextP + "</nav>" +
      "\n    </div></section>";

    return layout(ctx, idxContent);
  }

  /* ========================================================
     Halaman 1: portal berita
     ======================================================== */
  var newsSettings = getNewsSettings(ctx);
  var allPosts = ctx.site.recentPosts || [];

  /* --------------------------------------------------------
     1. TICKER BERITA TERKINI
     -------------------------------------------------------- */
  var tickerHtml = "";
  if (newsSettings.breakingNews) {
    var bn = newsSettings.breakingNews;
    // Tampilkan dua kali untuk animasi looping tanpa batas via JS
    var tickerItems = bn.items
      .map(function (item) { return '<span class="ticker-item">' + esc(item) + "</span>"; })
      .join('<span class="ticker-sep" aria-hidden="true">•</span>');

    tickerHtml =
      '\n    <div class="breaking-news" role="complementary" aria-label="Berita terkini">' +
      '\n      <div class="container">' +
      '\n        <div class="ticker-wrap">' +
      '<span class="ticker-label" aria-label="Label bagian terkini">' + esc(bn.label) + "</span>" +
      '<div class="ticker-viewport" aria-live="off">' +
      '<div class="ticker-track" id="ticker-track">' +
      tickerItems +
      "</div></div>" +
      "\n        </div>" +
      "\n      </div>" +
      "\n    </div>";
  }

  /* --------------------------------------------------------
     2. HERO — BERITA UTAMA
     -------------------------------------------------------- */
  var heroHtml = "";
  if (newsSettings.heroEnabled && allPosts.length) {
    var heroPosts = allPosts.slice(0, newsSettings.heroCount);
    var bigPost   = heroPosts[0];
    var sidePosts = heroPosts.slice(1, 5); // maksimum 4 kartu samping

    var bigCardHtml  = newsCard.heroMainCard(bigPost, ctx);
    var sideCardsHtml = sidePosts.map(function (p) {
      return newsCard.heroSideCard(p, ctx);
    }).join("");

    var sideArea = sidePosts.length
      ? '<div class="hero-side">' + sideCardsHtml + "</div>"
      : "";

    heroHtml =
      '\n    <section class="hero-section">' +
      '\n      <div class="container">' +
      '\n        <div class="hero-section-head">' +
      '<h2 class="section-label">' + esc(newsSettings.heroTitle) + "</h2>" +
      "\n        </div>" +
      '\n        <div class="hero-grid' + (sidePosts.length ? "" : " hero-grid-solo") + '">' +
      '\n          <div class="hero-main">' + bigCardHtml + "</div>" +
      sideArea +
      "\n        </div>" +
      "\n      </div>" +
      "\n    </section>";
  }

  /* --------------------------------------------------------
     3. BLOK KATEGORI (dikonfigurasi via newsSettings.categoryBlocks)
     -------------------------------------------------------- */
  var catBlocksHtml = "";
  newsSettings.categoryBlocks.forEach(function (block) {
    var catPosts = allPosts
      .filter(function (p) { return p.meta.category === block.category; })
      .slice(0, block.count);

    if (!catPosts.length) return;

    var catSlug = lib.slugify(block.category);
    var catUrl  = attr(U.url("/category/" + catSlug + "/"));

    var blockHead =
      '<div class="cat-head">' +
      '<h2 class="cat-block-title"><span class="cat-block-bar" aria-hidden="true"></span>' + esc(block.title) + "</h2>" +
      '<a href="' + catUrl + '" class="cat-more-link">Lihat Semua →</a>' +
      "</div>";

    var cards;
    if (block.layout === "magazine") {
      cards = newsCard.magazineLayout(catPosts, ctx);
    } else if (block.layout === "list") {
      cards = newsCard.listLayout(catPosts, ctx);
    } else {
      cards = newsCard.gridLayout(catPosts, ctx);
    }

    catBlocksHtml +=
      '\n    <section class="section cat-block">' +
      '\n      <div class="container">' +
      blockHead + cards +
      "\n      </div>" +
      "\n    </section>";
  });

  /* --------------------------------------------------------
     4. BERITA TERBARU — fallback grid semua berita
     -------------------------------------------------------- */
  var latestHtml = "";
  var latestPosts = allPosts.slice(0, 6);
  if (latestPosts.length) {
    var latestCards = latestPosts.map(function (p) {
      return newsCard.gridCard(p, ctx);
    }).join("");

    var lihatSemuaLink = totalPages > 1
      ? '<a href="' + attr(U.url("/page/2/")) + '" class="cat-more-link">Lihat Semua →</a>'
      : "";

    latestHtml =
      '\n    <section class="section section-alt">' +
      '\n      <div class="container">' +
      '\n        <div class="cat-head">' +
      '<h2 class="cat-block-title"><span class="cat-block-bar" aria-hidden="true"></span>Berita Terbaru</h2>' +
      lihatSemuaLink +
      "\n        </div>" +
      '\n        <div class="news-grid">' + latestCards + "</div>" +
      "\n      </div>" +
      "\n    </section>";
  }

  var content = tickerHtml + heroHtml + catBlocksHtml + latestHtml;
  return layout(ctx, content);
};

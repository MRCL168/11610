/* ============================================================
   templates/archive.js — Arsip kategori / tag (TEMA)
   Menampilkan daftar produk (grid katalog) untuk sebuah kategori
   atau tag, dengan sticky sidebar info perusahaan di sisi kanan
   (kecuali bila dimatikan dari Customizer).

   ctx: { config, U, lib, site, seo, themeVars, themeContent,
          kind, term, posts, description }
   ============================================================ */

var layout = require("./partials/layout");
var postCard = require("./partials/post-card");
var sidebar = require("./partials/sidebar");

module.exports = function archive(ctx) {
  var lib = ctx.lib, kind = ctx.kind, term = ctx.term, posts = ctx.posts, description = ctx.description;
  var esc = lib.esc;

  var label = kind === "category" ? "Kategori" : "Tag";
  var cards = posts.map(function (p) { return postCard(p, ctx); }).join("");

  var hasDesc = description && String(description).trim();
  var intro = hasDesc
    ? "<p>" + esc(description) + "</p>"
    : "<p>" + posts.length + " produk dalam " + label.toLowerCase() + " ini</p>";

  var head =
    '\n    <section class="page-head"><div class="container">' +
    '<span class="page-head-kicker">' + label + "</span>" +
    "<h1>" + esc(term) + "</h1>" + intro +
    "</div></section>";

  var empty = '<p class="catalog-empty">Belum ada produk pada ' + label.toLowerCase() + " ini.</p>";
  var grid = posts.length
    ? '<div class="product-grid cols-3">' + cards + "</div>"
    : empty;

  // Rakit dengan / tanpa sidebar.
  var asideHtml = sidebar.render(ctx);
  var listing;
  if (asideHtml) {
    listing =
      '\n    <section class="section"><div class="container"><div class="layout-sidebar">' +
      '\n      <div class="post-main">' + grid + "</div>" +
      "\n      " + asideHtml +
      "\n    </div></div></section>";
  } else {
    listing =
      '\n    <section class="section"><div class="container">' +
      grid +
      "</div></section>";
  }

  return layout(ctx, head + listing);
};

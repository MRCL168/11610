/* ============================================================
   templates/archive.js — Arsip kategori / tag (TEMA)
   Menampilkan header kategori, grid artikel, dan sidebar opsional.
   ctx: { config, U, lib, site, seo, themeVars, kind, term, posts, description }
   ============================================================ */

var layout   = require("./partials/layout");
var newsCard = require("./partials/news-card");
var sidebar  = require("./partials/sidebar");

module.exports = function archive(ctx) {
  var lib = ctx.lib, kind = ctx.kind, term = ctx.term;
  var posts = ctx.posts, description = ctx.description;
  var esc = lib.esc;

  var label = kind === "category" ? "Kategori" : "Tag";
  var cards = posts.map(function (p) { return newsCard.gridCard(p, ctx); }).join("");
  var hasDesc = description && String(description).trim();
  var intro = hasDesc
    ? "<p>" + esc(description) + "</p>"
    : "<p>" + posts.length + " artikel di " + label.toLowerCase() + " ini</p>";

  var pageHead =
    '\n    <section class="page-head"><div class="container">' +
    '<span class="page-head-kicker">' + label + "</span>" +
    "<h1>" + esc(term) + "</h1>" +
    intro +
    "</div></section>";

  var blocks = sidebar.getSidebar(ctx);
  var listing;

  if (blocks.length) {
    listing =
      '\n    <section class="section"><div class="container"><div class="layout-sidebar">' +
      '\n      <div class="post-main"><div class="news-grid">' + cards + "</div></div>" +
      "\n      " + sidebar.render(ctx, blocks) +
      "\n    </div></div></section>";
  } else {
    listing =
      '\n    <section class="section"><div class="container">' +
      '<div class="news-grid">' + cards + "</div>" +
      "</div></section>";
  }

  return layout(ctx, pageHead + listing);
};

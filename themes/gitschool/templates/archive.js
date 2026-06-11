/* ============================================================
   templates/archive.js — Arsip kategori / tag (TEMA)
   ctx: { config, U, lib, site, seo, themeVars, kind, term, posts, description }
   ============================================================ */

var layout = require("./partials/layout");
var postCard = require("./partials/post-card");

module.exports = function archive(ctx) {
  var lib = ctx.lib, kind = ctx.kind, term = ctx.term, posts = ctx.posts, description = ctx.description;
  var esc = lib.esc;

  var label = kind === "category" ? "Kategori" : "Tag";
  var cards = posts.map(function (p) { return postCard(p, ctx); }).join("");
  var hasDesc = description && String(description).trim();
  var intro = hasDesc ? "<p>" + esc(description) + "</p>" : "<p>" + posts.length + " berita</p>";

  var content =
    '\n    <section class="page-head">' +
    '\n      <div class="container">' +
    '\n        <span class="page-head-kicker">' + label + "</span>" +
    "\n        <h1>" + esc(term) + "</h1>" +
    "\n        " + intro +
    "\n      </div>" +
    "\n    </section>" +
    '\n    <section class="section"><div class="container">' +
    '<div class="post-grid">' + cards + "</div>" +
    "\n    </div></section>";

  return layout(ctx, content);
};

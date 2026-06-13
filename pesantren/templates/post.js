/* ============================================================
   templates/post.js — Artikel tunggal (TEMA Pesantren)
   Tata letak dua kolom: konten + bilah sisi (bila aktif).
   Bila bilah sisi dimatikan/kosong, otomatis jadi satu kolom
   terpusat yang nyaman dibaca.
   ctx: { config, U, lib, site, seo, themeVars, post, related }
   ============================================================ */

"use strict";

var layout = require("./partials/layout");
var getProfile = require("./partials/profile").getProfile;
var sidebarMod = require("./partials/sidebar");

module.exports = function post(ctx) {
  var config = ctx.config, U = ctx.U, lib = ctx.lib, post = ctx.post, related = ctx.related;
  var esc = lib.esc, attr = lib.attr, slugify = lib.slugify, formatDate = lib.formatDate;

  var cat = post.meta.category
    ? '<a href="' + attr(U.url("/category/" + slugify(post.meta.category) + "/")) + '" class="post-cat">' + esc(post.meta.category) + "</a>"
    : "";

  var tags = (Array.isArray(post.meta.tags) && post.meta.tags.length)
    ? '<div class="post-tags">' + post.meta.tags.map(function (t) {
        return '<a href="' + attr(U.url("/tag/" + slugify(t) + "/")) + '" class="tag">#' + esc(t) + "</a>";
      }).join("") + "</div>"
    : "";

  var featured = post.ogImage
    ? '<figure class="post-hero-img"><img src="' + attr(U.url(post.featuredImage)) + '" alt="' + attr(post.meta.title) + '"></figure>'
    : "";

  var author = post.meta.author
    ? "<span>oleh " + esc(post.meta.author) + '</span><span class="dot">·</span>'
    : "";

  var header =
    '<header class="post-header">' + cat +
    '<h1 class="post-title">' + esc(post.meta.title) + "</h1>" +
    '<div class="post-meta">' + author +
    '<time datetime="' + attr(post.meta.date) + '">' + esc(formatDate(post.meta.date, config.language)) + "</time>" +
    '<span class="dot">·</span><span>' + post.readingTime + " menit baca</span>" +
    "</div></header>";

  var body = '<div class="post-content">\n' + post.html + "\n        </div>";

  var pluginAfter = (ctx.plugins && ctx.plugins.contentAfter) ? ctx.plugins.contentAfter(ctx) : "";

  var relatedHtml = (related && related.length)
    ? '\n    <section class="related"><div class="container">' +
      '<h2 class="related-title">Artikel Lainnya</h2>' +
      '<div class="related-grid">' +
      related.map(function (p) {
        return '\n        <a href="' + attr(U.url(p.permalink)) + '" class="related-card">' +
          '<span class="related-card-title">' + esc(p.meta.title) + "</span>" +
          '<span class="related-card-date">' + esc(formatDate(p.meta.date, config.language)) + "</span>" +
          "</a>";
      }).join("") +
      "</div></div></section>"
    : "";

  // Bilah sisi: tampil di artikel (bukan beranda).
  var profile = getProfile(ctx);
  var sidebar = sidebarMod.renderSidebar(ctx, profile);

  var content;
  if (sidebar) {
    var layoutClass = "content-layout" + (profile.sidebar.position === "kiri" ? " content-layout--left" : "");
    content =
      '\n    <article class="post post-single">' +
      '\n      <div class="container">' +
      '\n        <div class="' + layoutClass + '">' +
      '\n          <main class="content-main">' +
      header + featured + body + tags + pluginAfter +
      "\n          </main>" +
      sidebar +
      "\n        </div>" +
      "\n      </div>" +
      "\n    </article>" +
      relatedHtml;
  } else {
    // Tanpa bilah sisi → satu kolom terpusat (gaya baca lama).
    content =
      '\n    <article class="post post-single">' +
      '\n      <div class="container post-narrow">' + header + "</div>" +
      featured +
      '\n      <div class="container post-narrow">' + body + tags + pluginAfter + "</div>" +
      "\n    </article>" +
      relatedHtml;
  }

  return layout(ctx, content);
};

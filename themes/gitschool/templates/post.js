/* ============================================================
   templates/post.js — Artikel / berita tunggal (TEMA)
   ctx: { config, U, lib, site, seo, themeVars, post, related }
   ============================================================ */

var layout = require("./partials/layout");

module.exports = function post(ctx) {
  var config = ctx.config, U = ctx.U, lib = ctx.lib, post = ctx.post, related = ctx.related;
  var esc = lib.esc, attr = lib.attr, slugify = lib.slugify, formatDate = lib.formatDate;

  var cat = post.meta.category
    ? '<a href="' + attr(U.url("/category/" + slugify(post.meta.category) + "/")) + '" class="post-cat">' + esc(post.meta.category) + "</a>"
    : "";

  var tags = Array.isArray(post.meta.tags) && post.meta.tags.length
    ? '<div class="post-tags">' + post.meta.tags
        .map(function (t) { return '<a href="' + attr(U.url("/tag/" + slugify(t) + "/")) + '" class="tag">#' + esc(t) + "</a>"; })
        .join("") + "</div>"
    : "";

  var featured = post.ogImage
    ? '<figure class="post-hero-img"><img src="' + attr(U.url(post.featuredImage)) + '" alt="' + attr(post.meta.title) + '"></figure>'
    : "";

  var relatedHtml = related && related.length
    ? '\n    <section class="related"><div class="container">' +
      '<h2 class="related-title">Berita Lainnya</h2>' +
      '<div class="related-grid">' +
      related.map(function (p) {
        return '\n        <a href="' + attr(U.url(p.permalink)) + '" class="related-card">' +
          '<span class="related-card-title">' + esc(p.meta.title) + "</span>" +
          '<span class="related-card-date">' + esc(formatDate(p.meta.date, config.language)) + "</span>" +
          "</a>";
      }).join("") +
      "</div></div></section>"
    : "";

  var content =
    '\n    <article class="post">' +
    '\n      <div class="container post-narrow">' +
    '\n        <nav class="breadcrumb"><a href="' + attr(U.url("/")) + '">Beranda</a> <span>›</span> ' +
    (post.meta.category ? '<a href="' + attr(U.url("/category/" + slugify(post.meta.category) + "/")) + '">' + esc(post.meta.category) + "</a> <span>›</span> " : "") +
    "<span>" + esc(post.meta.title) + "</span></nav>" +
    '\n        <header class="post-header">' +
    "\n          " + cat +
    '\n          <h1 class="post-title">' + esc(post.meta.title) + "</h1>" +
    '\n          <div class="post-meta">' +
    (post.meta.author ? "<span>oleh " + esc(post.meta.author) + '</span><span class="dot">·</span>' : "") +
    '<time datetime="' + attr(post.meta.date) + '">' + esc(formatDate(post.meta.date, config.language)) + "</time>" +
    '<span class="dot">·</span><span>' + post.readingTime + " menit baca</span>" +
    "\n          </div>" +
    "\n        </header>" +
    "\n      </div>" +
    "\n      " + featured +
    '\n      <div class="container post-narrow">' +
    '\n        <div class="post-content">\n' + post.html + "\n        </div>" +
    "\n        " + tags +
    "\n        " + ((ctx.plugins && ctx.plugins.contentAfter) ? ctx.plugins.contentAfter(ctx) : "") +
    "\n      </div>" +
    "\n    </article>" +
    relatedHtml;

  return layout(ctx, content);
};

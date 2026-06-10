/* ============================================================
   partials/post-card.js — Kartu artikel tema Kontraktor
   Dipakai untuk arsip, indeks artikel, dan artikel terkait.
   ============================================================ */

module.exports = function postCard(post, ctx) {
  var config = ctx.config, U = ctx.U, lib = ctx.lib;
  var esc = lib.esc, attr = lib.attr, formatDate = lib.formatDate;
  var img = post.ogImage
    ? '<a href="' + attr(U.url(post.permalink)) + '" class="card-thumb" tabindex="-1"><img src="' + attr(U.url(post.featuredImage)) + '" alt="' + attr(post.meta.title) + '" loading="lazy"></a>'
    : '<a href="' + attr(U.url(post.permalink)) + '" class="card-thumb card-thumb-empty" tabindex="-1"><span>Artikel</span></a>';
  var cat = post.meta.category ? '<span class="card-cat">' + esc(post.meta.category) + '</span>' : "";
  return '\n      <article class="post-card">' +
    img +
    '<div class="card-body">' +
    cat +
    '<h2 class="card-title"><a href="' + attr(U.url(post.permalink)) + '">' + esc(post.meta.title) + '</a></h2>' +
    '<p class="card-excerpt">' + esc(post.excerpt || "") + '</p>' +
    '<div class="card-meta"><time datetime="' + attr(post.meta.date || "") + '">' + esc(formatDate(post.meta.date, config.language)) + '</time><span class="dot">·</span><span>' + post.readingTime + ' menit baca</span></div>' +
    '</div>' +
    '</article>';
};

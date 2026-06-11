/* ============================================================
   partials/post-card.js — Kartu berita untuk grid (TEMA)
   Dipakai di beranda (seksi Berita) & halaman arsip.
   Dipanggil: postCard(post, ctx).
   ============================================================ */

module.exports = function postCard(post, ctx) {
  var config = ctx.config, U = ctx.U, lib = ctx.lib;
  var esc = lib.esc, attr = lib.attr, slugify = lib.slugify, formatDate = lib.formatDate;

  var cat = post.meta.category
    ? '<a href="' + attr(U.url("/category/" + slugify(post.meta.category) + "/")) + '" class="card-cat">' + esc(post.meta.category) + "</a>"
    : "";

  // Thumbnail: gambar unggulan bila ada, jika tidak pakai inisial judul.
  var thumb = post.ogImage
    ? '<a href="' + attr(U.url(post.permalink)) + '" class="card-thumb"><img src="' + attr(U.url(post.featuredImage)) + '" alt="' + attr(post.meta.title) + '" loading="lazy"></a>'
    : '<a href="' + attr(U.url(post.permalink)) + '" class="card-thumb card-thumb-empty" aria-hidden="true"><span>' + esc((post.meta.title || "?").trim().charAt(0).toUpperCase()) + "</span></a>";

  return (
    '\n      <article class="post-card">' +
    "\n        " + thumb +
    '\n        <div class="card-body">' +
    "\n          " + cat +
    '\n          <h3 class="card-title"><a href="' + attr(U.url(post.permalink)) + '">' + esc(post.meta.title) + "</a></h3>" +
    '\n          <p class="card-excerpt">' + esc(post.excerpt) + "</p>" +
    '\n          <div class="card-meta">' +
    '<time datetime="' + attr(post.meta.date) + '">' + esc(formatDate(post.meta.date, config.language)) + "</time>" +
    '<span class="dot">·</span><span>' + post.readingTime + " menit baca</span>" +
    "</div>" +
    "\n        </div>" +
    "\n      </article>"
  );
};

/* ============================================================
   partials/news-card.js — Kartu & layout berita (TEMA)

   Fungsi yang diekspor:
   - heroMainCard(post, ctx)       : kartu hero besar dengan overlay foto
   - heroSideCard(post, ctx)       : kartu samping hero (horizontal kompak)
   - gridCard(post, ctx)           : kartu grid standar
   - gridLayout(posts, ctx)        : grid 3–4 kolom dari gridCard
   - magazineLayout(posts, ctx)    : 1 besar kiri + beberapa kecil kanan
   - listLayout(posts, ctx)        : daftar horizontal kompak
   ============================================================ */

/* ---------- heroMainCard ---------- */
function heroMainCard(post, ctx) {
  var config = ctx.config, U = ctx.U, lib = ctx.lib;
  var esc = lib.esc, attr = lib.attr, slugify = lib.slugify, formatDate = lib.formatDate;

  var cat = post.meta.category
    ? '<a href="' + attr(U.url("/category/" + slugify(post.meta.category) + "/")) + '" class="news-cat">' + esc(post.meta.category) + "</a>"
    : "";

  var imgStyle = post.ogImage
    ? ' style="background-image:url(\'' + attr(U.url(post.featuredImage)) + '\')"'
    : "";

  return (
    '<article class="hero-main-card' + (post.ogImage ? " has-img" : "") + '">' +
    '<a href="' + attr(U.url(post.permalink)) + '" class="hero-main-link" aria-label="' + attr(post.meta.title) + '">' +
    '<div class="hero-main-img"' + imgStyle + ' aria-hidden="true"></div>' +
    '<div class="hero-main-overlay">' +
    cat +
    '<h2 class="hero-main-title">' + esc(post.meta.title) + "</h2>" +
    '<p class="hero-main-excerpt">' + esc(post.excerpt) + "</p>" +
    '<div class="hero-main-meta">' +
    '<time datetime="' + attr(post.meta.date) + '">' + esc(formatDate(post.meta.date, config.language)) + "</time>" +
    '<span class="dot" aria-hidden="true">·</span>' +
    "<span>" + post.readingTime + " menit baca</span>" +
    "</div>" +
    "</div>" +
    "</a>" +
    "</article>"
  );
}

/* ---------- heroSideCard ---------- */
function heroSideCard(post, ctx) {
  var config = ctx.config, U = ctx.U, lib = ctx.lib;
  var esc = lib.esc, attr = lib.attr, slugify = lib.slugify, formatDate = lib.formatDate;

  var cat = post.meta.category
    ? '<span class="news-cat news-cat-sm">' + esc(post.meta.category) + "</span>"
    : "";

  var img = post.ogImage
    ? '<div class="side-thumb"><img src="' + attr(U.url(post.featuredImage)) + '" alt="' + attr(post.meta.title) + '" loading="lazy"></div>'
    : '<div class="side-thumb side-thumb-empty" aria-hidden="true"></div>';

  return (
    '<article class="hero-side-card">' +
    '<a href="' + attr(U.url(post.permalink)) + '" class="hero-side-link">' +
    img +
    '<div class="side-body">' +
    cat +
    '<h3 class="side-title">' + esc(post.meta.title) + "</h3>" +
    '<time class="side-date" datetime="' + attr(post.meta.date) + '">' + esc(formatDate(post.meta.date, config.language)) + "</time>" +
    "</div>" +
    "</a>" +
    "</article>"
  );
}

/* ---------- gridCard ---------- */
function gridCard(post, ctx) {
  var config = ctx.config, U = ctx.U, lib = ctx.lib;
  var esc = lib.esc, attr = lib.attr, slugify = lib.slugify, formatDate = lib.formatDate;

  var cat = post.meta.category
    ? '<a href="' + attr(U.url("/category/" + slugify(post.meta.category) + "/")) + '" class="news-cat">' + esc(post.meta.category) + "</a>"
    : "";

  var img = post.ogImage
    ? '<a href="' + attr(U.url(post.permalink)) + '" class="grid-thumb" aria-hidden="true" tabindex="-1">' +
      '<img src="' + attr(U.url(post.featuredImage)) + '" alt="' + attr(post.meta.title) + '" loading="lazy">' +
      "</a>"
    : "";

  return (
    '<article class="grid-card' + (post.ogImage ? " has-thumb" : "") + '">' +
    img +
    '<div class="grid-body">' +
    cat +
    '<h3 class="grid-title"><a href="' + attr(U.url(post.permalink)) + '">' + esc(post.meta.title) + "</a></h3>" +
    '<p class="grid-excerpt">' + esc(post.excerpt) + "</p>" +
    '<div class="grid-meta">' +
    '<time datetime="' + attr(post.meta.date) + '">' + esc(formatDate(post.meta.date, config.language)) + "</time>" +
    '<span class="dot" aria-hidden="true">·</span>' +
    "<span>" + post.readingTime + " menit baca</span>" +
    "</div>" +
    "</div>" +
    "</article>"
  );
}

/* ---------- gridLayout ---------- */
function gridLayout(posts, ctx) {
  var cards = posts.map(function (p) { return gridCard(p, ctx); }).join("");
  return '<div class="news-grid">' + cards + "</div>";
}

/* ---------- magazineLayout ---------- */
function magazineLayout(posts, ctx) {
  if (!posts.length) return "";
  var config = ctx.config, U = ctx.U, lib = ctx.lib;
  var esc = lib.esc, attr = lib.attr, slugify = lib.slugify, formatDate = lib.formatDate;

  var bigPost = posts[0];
  var smallPosts = posts.slice(1);

  /* Kartu besar */
  var bigCat = bigPost.meta.category
    ? '<a href="' + attr(U.url("/category/" + slugify(bigPost.meta.category) + "/")) + '" class="news-cat">' + esc(bigPost.meta.category) + "</a>"
    : "";
  var bigImg = bigPost.ogImage
    ? '<div class="mag-big-img"><img src="' + attr(U.url(bigPost.featuredImage)) + '" alt="' + attr(bigPost.meta.title) + '" loading="lazy"></div>'
    : "";

  var bigCard =
    '<article class="mag-big">' +
    '<a href="' + attr(U.url(bigPost.permalink)) + '">' +
    bigImg +
    '<div class="mag-big-body">' +
    bigCat +
    '<h3 class="mag-big-title">' + esc(bigPost.meta.title) + "</h3>" +
    '<p class="mag-big-excerpt">' + esc(bigPost.excerpt) + "</p>" +
    '<time class="mag-meta" datetime="' + attr(bigPost.meta.date) + '">' + esc(formatDate(bigPost.meta.date, config.language)) + "</time>" +
    "</div>" +
    "</a>" +
    "</article>";

  /* Kartu-kartu kecil */
  var smallCards = smallPosts.map(function (p) {
    var cat = p.meta.category
      ? '<span class="news-cat news-cat-sm">' + esc(p.meta.category) + "</span>"
      : "";
    var img = p.ogImage
      ? '<div class="mag-sm-img"><img src="' + attr(U.url(p.featuredImage)) + '" alt="' + attr(p.meta.title) + '" loading="lazy"></div>'
      : "";
    return (
      '<article class="mag-small">' +
      '<a href="' + attr(U.url(p.permalink)) + '">' +
      img +
      '<div class="mag-sm-body">' +
      cat +
      '<h4 class="mag-sm-title">' + esc(p.meta.title) + "</h4>" +
      '<time class="mag-meta" datetime="' + attr(p.meta.date) + '">' + esc(formatDate(p.meta.date, config.language)) + "</time>" +
      "</div>" +
      "</a>" +
      "</article>"
    );
  }).join("");

  return (
    '<div class="mag-layout">' +
    bigCard +
    '<div class="mag-side">' + smallCards + "</div>" +
    "</div>"
  );
}

/* ---------- listLayout ---------- */
function listLayout(posts, ctx) {
  var config = ctx.config, U = ctx.U, lib = ctx.lib;
  var esc = lib.esc, attr = lib.attr, slugify = lib.slugify, formatDate = lib.formatDate;

  var items = posts.map(function (p) {
    var cat = p.meta.category
      ? '<span class="news-cat news-cat-xs">' + esc(p.meta.category) + "</span>"
      : "";
    var img = p.ogImage
      ? '<div class="list-thumb"><img src="' + attr(U.url(p.featuredImage)) + '" alt="' + attr(p.meta.title) + '" loading="lazy"></div>'
      : "";
    return (
      '<article class="list-card">' +
      '<a href="' + attr(U.url(p.permalink)) + '" class="list-link">' +
      img +
      '<div class="list-body">' +
      cat +
      '<h3 class="list-title">' + esc(p.meta.title) + "</h3>" +
      '<time class="list-date" datetime="' + attr(p.meta.date) + '">' + esc(formatDate(p.meta.date, config.language)) + "</time>" +
      "</div>" +
      "</a>" +
      "</article>"
    );
  }).join("");

  return '<div class="list-layout">' + items + "</div>";
}

module.exports = {
  heroMainCard: heroMainCard,
  heroSideCard: heroSideCard,
  gridCard: gridCard,
  gridLayout: gridLayout,
  magazineLayout: magazineLayout,
  listLayout: listLayout
};

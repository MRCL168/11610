/* ============================================================
   templates/post.js — Halaman tunggal (TEMA Gitproperty)
   • Post properti → tata letak detail listing: header + galeri,
     panel spesifikasi (harga, kamar, luas, sertifikat), deskripsi,
     lokasi/Maps, dan kotak kontak WhatsApp. Field dibaca dari
     frontmatter via partials/property.js.
   • Post biasa → tata letak artikel standar.
   Catatan kontrak: SEO/JSON-LD tetap ditangani inti (ctx.seo) dan
   dirender di head.js — tema tidak menulis ulang skema.
   ctx: { config, U, lib, site, seo, themeVars, post, related }
   ============================================================ */

var layout = require("./partials/layout");
var icons = require("./partials/icons");
var prop = require("./partials/property");
var navHref = prop.navHref;

module.exports = function post(ctx) {
  var config = ctx.config, U = ctx.U, lib = ctx.lib, post = ctx.post, related = ctx.related;
  var esc = lib.esc, attr = lib.attr, slugify = lib.slugify, formatDate = lib.formatDate;

  var tags = Array.isArray(post.meta.tags) && post.meta.tags.length
    ? '<div class="post-tags">' + post.meta.tags
        .map(function (t) { return '<a href="' + attr(U.url("/tag/" + slugify(t) + "/")) + '" class="tag">#' + esc(t) + "</a>"; })
        .join("") + "</div>"
    : "";

  var relatedHtml = related && related.length
    ? (
      '\n    <section class="related container">' +
      '\n      <h2 class="related-title">Properti & Artikel Lainnya</h2>' +
      '\n      <div class="related-grid">' +
      related.map(function (p) {
        return (
          '\n        <a href="' + attr(U.url(p.permalink)) + '" class="related-card">' +
          '<span class="related-card-title">' + esc(p.meta.title) + "</span>" +
          '<span class="related-card-date">' + esc(formatDate(p.meta.date, config.language)) + "</span>" +
          "</a>"
        );
      }).join("") +
      "\n      </div>" +
      "\n    </section>"
    )
    : "";

  /* ================= POST PROPERTI ================= */
  if (prop.isProperty(post)) {
    var d = prop.propData(post);
    var home = prop.getHome(ctx);

    var listingClass = /sewa/i.test(d.listing) ? " is-sewa" : " is-jual";
    var badges =
      '<span class="prop-badge' + listingClass + '">' + esc(d.listing) + "</span>" +
      (d.type ? '<span class="prop-type">' + esc(d.type) + "</span>" : "");

    var locLine = (d.lokasi || d.alamat)
      ? '<div class="detail-loc">' + icons.propIcon("pin") + "<span>" + esc(d.alamat || d.lokasi) + (d.alamat && d.lokasi ? ", " + esc(d.lokasi) : "") + "</span></div>"
      : "";

    // Galeri: featured + galeri[] (bila ada). Item pertama jadi gambar utama.
    var images = [];
    if (post.featuredImage) images.push(post.featuredImage);
    d.galeri.forEach(function (g) { if (g && images.indexOf(g) === -1) images.push(g); });
    var gallery = "";
    if (images.length) {
      var main = '<div class="dg-main"><img src="' + attr(U.url(images[0])) + '" alt="' + attr(post.meta.title) + '"></div>';
      var thumbs = images.length > 1
        ? '<div class="dg-thumbs">' + images.map(function (src, i) {
            return '<button type="button" class="dg-thumb' + (i === 0 ? " is-active" : "") + '" data-src="' + attr(U.url(src)) + '"><img src="' + attr(U.url(src)) + '" alt="" loading="lazy"></button>';
          }).join("") + "</div>"
        : "";
      gallery = '\n      <div class="detail-gallery" id="detail-gallery">' + main + thumbs + "</div>";
    } else {
      gallery = '\n      <div class="detail-gallery detail-gallery-ph"><div class="dg-ph">' + icons.propIcon("home") + "</div></div>";
    }

    // Panel spesifikasi — hanya field yang terisi.
    function spec(icon, label, value) {
      return (
        '<div class="spec-item">' +
        '<span class="spec-ic">' + icons.propIcon(icon) + "</span>" +
        '<span class="spec-meta"><span class="spec-val">' + esc(value) + '</span><span class="spec-lab">' + esc(label) + "</span></span>" +
        "</div>"
      );
    }
    var specs = [];
    if (d.beds) specs.push(spec("bed", "Kamar Tidur", d.beds));
    if (d.baths) specs.push(spec("bath", "Kamar Mandi", d.baths));
    if (d.building) specs.push(spec("building", "Luas Bangunan", d.building + " m²"));
    if (d.land) specs.push(spec("land", "Luas Tanah", d.land + " m²"));
    if (d.carport) specs.push(spec("car", "Carport", d.carport));
    if (d.cert) specs.push(spec("cert", "Sertifikat", d.cert));
    var specGrid = specs.length ? '<div class="spec-grid">' + specs.join("") + "</div>" : "";

    // Kotak kontak / WhatsApp.
    var waRaw = (d.whatsapp || home.contact.whatsapp || "").replace(/[^\d]/g, "");
    var contactBox = "";
    if (waRaw) {
      var msg = encodeURIComponent("Halo, saya tertarik dengan properti \"" + post.meta.title + "\" (" + U.abs(post.permalink) + "). Apakah masih tersedia?");
      var waUrl = "https://wa.me/" + waRaw + "?text=" + msg;
      contactBox =
        '\n          <div class="contact-box">' +
        '<div class="contact-title">Tertarik dengan properti ini?</div>' +
        '<p class="contact-sub">Hubungi agen kami untuk informasi lebih lanjut atau jadwalkan survei lokasi.</p>' +
        '<a class="btn btn-wa btn-block" href="' + attr(waUrl) + '" target="_blank" rel="noopener">' + icons.propIcon("whatsapp") + "<span>Chat via WhatsApp</span></a>" +
        (home.contact.phone ? '<a class="btn btn-outline btn-block" href="tel:' + attr(home.contact.phone.replace(/[^\d+]/g, "")) + '">' + icons.propIcon("phone") + "<span>" + esc(home.contact.phone) + "</span></a>" : "") +
        "</div>";
    }
    var mapsBox = d.maps
      ? '\n          <a class="btn btn-outline btn-block" href="' + attr(d.maps) + '" target="_blank" rel="noopener">' + icons.propIcon("pin") + "<span>Lihat di Google Maps</span></a>"
      : "";

    var priceBlock =
      '<div class="detail-price">' +
      (d.priceText ? '<span class="detail-price-val">' + esc(d.priceText) + (d.satuan ? '<span class="detail-price-unit">' + esc(d.satuan) + "</span>" : "") + "</span>" : '<span class="detail-price-val">Hubungi Kami</span>') +
      "</div>";

    var contentProp =
      '\n    <article class="detail">' +
      '\n      <div class="container">' +
      '\n        <nav class="crumbs"><a href="' + attr(U.url("/")) + '">Beranda</a> <span>›</span> ' +
      (post.meta.category ? '<a href="' + attr(U.url("/category/" + slugify(post.meta.category) + "/")) + '">' + esc(post.meta.category) + "</a> <span>›</span> " : "") +
      '<span class="crumbs-cur">' + esc(post.meta.title) + "</span></nav>" +
      '\n        <header class="detail-head">' +
      '<div class="detail-badges">' + badges + "</div>" +
      '<h1 class="detail-title">' + esc(post.meta.title) + "</h1>" +
      locLine +
      "</header>" +
      gallery +
      '\n        <div class="detail-grid">' +
      '\n          <div class="detail-main">' +
      priceBlock +
      specGrid +
      '\n            <div class="post-content detail-desc">\n' + post.html + "\n            </div>" +
      tags +
      ((ctx.plugins && ctx.plugins.contentAfter) ? ctx.plugins.contentAfter(ctx) : "") +
      "\n          </div>" +
      '\n          <aside class="detail-side">' +
      contactBox +
      mapsBox +
      "\n          </aside>" +
      "\n        </div>" +
      "\n      </div>" +
      "\n    </article>" +
      relatedHtml;

    return layout(ctx, contentProp);
  }

  /* ================= POST ARTIKEL BIASA ================= */
  var cat = post.meta.category
    ? '<a href="' + attr(U.url("/category/" + slugify(post.meta.category) + "/")) + '" class="post-cat">' + esc(post.meta.category) + "</a>"
    : "";
  var featuredImg = post.ogImage
    ? '<figure class="post-hero-img"><img src="' + attr(U.url(post.featuredImage)) + '" alt="' + attr(post.meta.title) + '"></figure>'
    : "";

  var contentArt =
    '\n    <article class="post">' +
    '\n      <div class="container post-narrow">' +
    '\n        <header class="post-header">' +
    "\n          " + cat +
    '\n          <h1 class="post-title">' + esc(post.meta.title) + "</h1>" +
    '\n          <div class="post-meta">' +
    (post.meta.author ? "<span>oleh " + esc(post.meta.author) + '</span><span class="dot">·</span>' : "") +
    '<time datetime="' + attr(post.meta.date) + '">' + esc(formatDate(post.meta.date, config.language)) + "</time>" +
    '<span class="dot">·</span>' +
    "<span>" + post.readingTime + " menit baca</span>" +
    "\n          </div>" +
    "\n        </header>" +
    "\n      </div>" +
    "\n      " + featuredImg +
    '\n      <div class="container post-narrow">' +
    '\n        <div class="post-content">\n' + post.html + "\n        </div>" +
    "\n        " + tags +
    "\n        " + ((ctx.plugins && ctx.plugins.contentAfter) ? ctx.plugins.contentAfter(ctx) : "") +
    "\n      </div>" +
    "\n    </article>" +
    relatedHtml;

  return layout(ctx, contentArt);
};

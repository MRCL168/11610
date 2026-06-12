/* ============================================================
   partials/post-card.js — Kartu untuk grid (TEMA Gitproperty)
   Dua mode dalam satu fungsi:
     • Properti → kartu properti: thumbnail, badge listing (Dijual/
       Disewa), chip tipe, harga menonjol, lokasi, dan BARIS IKON
       spesifikasi (kamar tidur, kamar mandi, luas bangunan, luas
       tanah). Disisipkan atribut data-* agar pencarian sisi-klien
       bisa memfilter kartu ini.
     • Berita / artikel biasa → kartu artikel ringkas.
   Dipanggil: postCard(post, ctx).
   ============================================================ */

var prop = require("./property");
var icons = require("./icons");

module.exports = function postCard(post, ctx) {
  var config = ctx.config, U = ctx.U, lib = ctx.lib;
  var esc = lib.esc, attr = lib.attr, slugify = lib.slugify, formatDate = lib.formatDate;

  /* ---------------- Kartu PROPERTI ---------------- */
  if (prop.isProperty(post)) {
    var d = prop.propData(post);
    var href = attr(U.url(post.permalink));

    var thumb = post.featuredImage
      ? '<img src="' + attr(U.url(post.featuredImage)) + '" alt="' + attr(post.meta.title) + '" loading="lazy">'
      : '<div class="prop-thumb-ph" aria-hidden="true">' + icons.propIcon("home") + "</div>";

    var listingClass = /sewa/i.test(d.listing) ? " is-sewa" : " is-jual";
    var listingBadge = '<span class="prop-badge' + listingClass + '">' + esc(d.listing) + "</span>";
    var typeChip = d.type ? '<span class="prop-type">' + esc(d.type) + "</span>" : "";

    var priceMain = d.priceShort
      ? '<div class="prop-price">' + esc(d.priceShort) + (d.satuan ? '<span class="prop-price-unit">' + esc(d.satuan) + "</span>" : "") + "</div>"
      : "";

    var loc = d.lokasi
      ? '<div class="prop-loc">' + icons.propIcon("pin") + "<span>" + esc(d.lokasi) + "</span></div>"
      : "";

    // Baris ikon spesifikasi — hanya tampilkan yang relevan (tanah tak punya kamar).
    var specs = [];
    if (d.beds) specs.push('<span class="prop-spec" title="Kamar tidur">' + icons.propIcon("bed") + d.beds + "</span>");
    if (d.baths) specs.push('<span class="prop-spec" title="Kamar mandi">' + icons.propIcon("bath") + d.baths + "</span>");
    if (d.building) specs.push('<span class="prop-spec" title="Luas bangunan">' + icons.propIcon("building") + d.building + ' m²</span>');
    if (d.land) specs.push('<span class="prop-spec" title="Luas tanah">' + icons.propIcon("land") + d.land + ' m²</span>');
    var specRow = specs.length ? '<div class="prop-specs">' + specs.join("") + "</div>" : "";

    // Atribut data untuk filter pencarian sisi-klien.
    var data =
      ' data-prop="1"' +
      ' data-title="' + attr((post.meta.title || "").toLowerCase()) + '"' +
      ' data-type="' + attr(d.type.toLowerCase()) + '"' +
      ' data-listing="' + attr(d.listing.toLowerCase()) + '"' +
      ' data-lokasi="' + attr(d.lokasi.toLowerCase()) + '"' +
      ' data-price="' + d.price + '"' +
      ' data-beds="' + d.beds + '"';

    return (
      '\n      <article class="prop-card"' + data + ">" +
      '\n        <a class="prop-thumb" href="' + href + '">' +
      thumb + listingBadge + typeChip +
      "</a>" +
      '\n        <div class="prop-card-body">' +
      priceMain +
      '\n          <h3 class="prop-card-title"><a href="' + href + '">' + esc(post.meta.title) + "</a></h3>" +
      loc +
      specRow +
      "\n        </div>" +
      "\n      </article>"
    );
  }

  /* ---------------- Kartu ARTIKEL / BERITA ---------------- */
  var cat = post.meta.category
    ? '<a href="' + attr(U.url("/category/" + slugify(post.meta.category) + "/")) + '" class="card-cat">' + esc(post.meta.category) + "</a>"
    : "";
  var img = post.ogImage
    ? '<a href="' + attr(U.url(post.permalink)) + '" class="card-thumb" aria-hidden="true" tabindex="-1"><img src="' + attr(U.url(post.featuredImage)) + '" alt="' + attr(post.meta.title) + '" loading="lazy"></a>'
    : "";

  return (
    '\n      <article class="post-card' + (post.ogImage ? " has-thumb" : "") + '">' +
    "\n        " + img +
    '\n        <div class="card-body">' +
    "\n          " + cat +
    '\n          <h3 class="card-title"><a href="' + attr(U.url(post.permalink)) + '">' + esc(post.meta.title) + "</a></h3>" +
    '\n          <p class="card-excerpt">' + esc(post.excerpt) + "</p>" +
    '\n          <div class="card-meta">' +
    '<time datetime="' + attr(post.meta.date) + '">' + esc(formatDate(post.meta.date, config.language)) + "</time>" +
    '<span class="dot">·</span>' +
    "<span>" + post.readingTime + " menit baca</span>" +
    "\n          </div>" +
    "\n        </div>" +
    "\n      </article>"
  );
};

/* ============================================================
   partials/post-card.js — Kartu PRODUK / katalog (TEMA)
   Setiap post diperlakukan sebagai item katalog. Kartu menampilkan:
   gambar (atau placeholder berinisial), badge kategori, judul, harga
   (opsional dari frontmatter `price`), ringkasan, dan TOMBOL KONTAK
   (WhatsApp) di setiap kartu sesuai kebutuhan distributor.

   Dipanggil: postCard(post, ctx). Sumber kontak diambil dari data
   Lokasi/Sidebar (lihat content.js) atau dari frontmatter post
   (`whatsapp`) bila diisi per-produk.
   ============================================================ */

var contentMod = require("./content");
var resolveContact = contentMod.resolveContact;
var waLink = contentMod.waLink;
var digits = contentMod.digits;

// Inisial dari judul untuk placeholder gambar (maks 2 huruf).
function initials(title) {
  var words = String(title || "").trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "PR";
  var a = words[0].charAt(0);
  var b = words.length > 1 ? words[1].charAt(0) : (words[0].charAt(1) || "");
  return (a + b).toUpperCase();
}

// Tentukan tombol kontak untuk sebuah produk (WhatsApp → email → halaman).
function productContact(post, ctx) {
  var c = resolveContact(ctx);
  var wa = String((post.meta && post.meta.whatsapp) || c.whatsapp || "");
  var title = (post.meta && post.meta.title) || "produk";
  if (wa) {
    var msg = "Halo, saya tertarik dengan produk *" + title + "*. Apakah masih tersedia?";
    return { href: waLink(wa, msg), label: "Hubungi", external: true, kind: "wa" };
  }
  if (c.email) {
    return { href: "mailto:" + c.email + "?subject=" + encodeURIComponent("Tanya produk: " + title), label: "Email", external: false, kind: "mail" };
  }
  return { href: ctx.U.url("/about/"), label: "Hubungi", external: false, kind: "page" };
}

module.exports = function postCard(post, ctx) {
  var config = ctx.config, U = ctx.U, lib = ctx.lib;
  var esc = lib.esc, attr = lib.attr;
  var icons = require("./icons");

  var cat = post.meta.category
    ? '<span class="product-cat">' + esc(post.meta.category) + "</span>"
    : "";

  // Gambar produk atau placeholder berinisial (tetap rapi tanpa featured image).
  var thumb = post.ogImage
    ? '<a href="' + attr(U.url(post.permalink)) + '" class="product-thumb" aria-hidden="true" tabindex="-1"><img src="' + attr(U.url(post.featuredImage)) + '" alt="' + attr(post.meta.title) + '" loading="lazy"></a>'
    : '<a href="' + attr(U.url(post.permalink)) + '" class="product-thumb product-thumb-ph" aria-hidden="true" tabindex="-1"><span>' + esc(initials(post.meta.title)) + "</span></a>";

  // Harga (opsional) — ditonjolkan bila frontmatter memuat `price`.
  var price = post.meta.price
    ? '<div class="product-price">' + esc(post.meta.price) + (post.meta.unit ? ' <span class="product-unit">' + esc(post.meta.unit) + "</span>" : "") + "</div>"
    : "";

  var contact = productContact(post, ctx);
  var ctaIcon = contact.kind === "wa" ? icons.ui("whatsapp") : (contact.kind === "mail" ? icons.ui("mail") : icons.ui("phone"));
  var ctaAttrs = contact.external ? ' target="_blank" rel="noopener"' : "";
  var ctaBtn =
    '<a class="btn btn-primary btn-sm product-cta" href="' + attr(contact.href) + '"' + ctaAttrs + ">" + ctaIcon + "<span>" + esc(contact.label) + "</span></a>";
  var detailLink =
    '<a class="product-detail" href="' + attr(U.url(post.permalink)) + '">Detail ' + icons.ui("arrow") + "</a>";

  return (
    '\n      <article class="product-card' + (post.ogImage ? " has-thumb" : "") + '">' +
    "\n        " + thumb +
    '\n        <div class="product-body">' +
    "\n          " + cat +
    '\n          <h3 class="product-title"><a href="' + attr(U.url(post.permalink)) + '">' + esc(post.meta.title) + "</a></h3>" +
    "\n          " + price +
    '\n          <p class="product-excerpt">' + esc(post.excerpt) + "</p>" +
    '\n          <div class="product-actions">' + ctaBtn + detailLink + "</div>" +
    "\n        </div>" +
    "\n      </article>"
  );
};

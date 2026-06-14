/* ============================================================
   templates/post.js — Detail PRODUK / katalog (TEMA)
   Desain "katalog": ringkasan produk (gambar, harga, spesifikasi,
   tombol kontak) di atas, lalu deskripsi lengkap dari isi Markdown,
   diikuti produk terkait. Sticky sidebar info perusahaan tampil di
   sisi kanan (kecuali bila dimatikan dari Customizer).

   Catatan SEO: meta/OG/JSON-LD utama dirender head.js dari ctx.seo
   (BlogPosting + Breadcrumb dari inti). Di sini ditambahkan skema
   Product/Offer secara TERPISAH & opsional (hanya bila ada harga) —
   bersifat melengkapi (additif), pola yang sama dipakai blok FAQ.

   ctx: { config, U, lib, site, seo, themeVars, post, related }
   ============================================================ */

var layout = require("./partials/layout");
var sidebar = require("./partials/sidebar");
var contentMod = require("./partials/content");
var iconsMod = require("./partials/icons");
var resolveContact = contentMod.resolveContact;
var waLink = contentMod.waLink;
var digits = contentMod.digits;
var ui = iconsMod.ui;

function arr(v) { return Array.isArray(v) ? v : (v ? [v] : []); }

module.exports = function post(ctx) {
  var config = ctx.config, U = ctx.U, lib = ctx.lib, post = ctx.post, related = ctx.related;
  var esc = lib.esc, attr = lib.attr, slugify = lib.slugify, formatDate = lib.formatDate;
  var m = post.meta || {};

  /* ---- Kategori & tag ---- */
  var cat = m.category
    ? '<a href="' + attr(U.url("/category/" + slugify(m.category) + "/")) + '" class="product-detail-cat">' + esc(m.category) + "</a>"
    : "";
  var tags = (Array.isArray(m.tags) && m.tags.length)
    ? '<div class="post-tags">' + m.tags
        .map(function (t) { return '<a href="' + attr(U.url("/tag/" + slugify(t) + "/")) + '" class="tag">#' + esc(t) + "</a>"; })
        .join("") + "</div>"
    : "";

  /* ---- Gambar produk ---- */
  var media = post.ogImage
    ? '<div class="pd-media"><img src="' + attr(U.url(post.featuredImage)) + '" alt="' + attr(m.title) + '"></div>'
    : '<div class="pd-media pd-media-ph"><span>' + esc(String(m.title || "Produk").slice(0, 2).toUpperCase()) + "</span></div>";

  /* ---- Harga ---- */
  var price = m.price
    ? '<div class="pd-price">' + esc(m.price) + (m.unit ? ' <span class="pd-unit">/ ' + esc(m.unit) + "</span>" : "") + "</div>"
    : "";

  /* ---- Spesifikasi ringkas (brand/sku/stok + daftar specs) ---- */
  var specRows = [];
  if (m.brand) specRows.push('<div class="pd-spec"><dt>Merek</dt><dd>' + esc(m.brand) + "</dd></div>");
  if (m.sku) specRows.push('<div class="pd-spec"><dt>Kode / SKU</dt><dd>' + esc(m.sku) + "</dd></div>");
  if (m.stock) specRows.push('<div class="pd-spec"><dt>Ketersediaan</dt><dd>' + esc(m.stock) + "</dd></div>");
  if (m.moq) specRows.push('<div class="pd-spec"><dt>Min. Pemesanan</dt><dd>' + esc(m.moq) + "</dd></div>");
  arr(m.specs).forEach(function (s) {
    s = String(s || "");
    var parts = s.split(":");
    if (parts.length >= 2) {
      specRows.push('<div class="pd-spec"><dt>' + esc(parts.shift().trim()) + "</dt><dd>" + esc(parts.join(":").trim()) + "</dd></div>");
    } else if (s.trim()) {
      specRows.push('<div class="pd-spec pd-spec-full"><dd>' + esc(s.trim()) + "</dd></div>");
    }
  });
  var specs = specRows.length ? '<dl class="pd-specs">' + specRows.join("") + "</dl>" : "";

  /* ---- Tombol kontak produk (WhatsApp → email) ---- */
  var contact = resolveContact(ctx);
  var pWa = String(m.whatsapp || contact.whatsapp || "");
  var ctaBtns = [];
  if (pWa) {
    var msg = "Halo, saya tertarik dengan produk *" + (m.title || "") + "*";
    if (m.price) msg += " (" + m.price + ")";
    msg += ". Apakah masih tersedia?";
    ctaBtns.push('<a class="btn btn-primary btn-lg" href="' + attr(waLink(pWa, msg)) + '" target="_blank" rel="noopener">' + ui("whatsapp") + "<span>Pesan via WhatsApp</span></a>");
  }
  if (contact.email) {
    ctaBtns.push('<a class="btn btn-ghost btn-lg" href="mailto:' + attr(contact.email) + '?subject=' + encodeURIComponent("Tanya produk: " + (m.title || "")) + '">' + ui("mail") + "<span>Email</span></a>");
  }
  if (!ctaBtns.length) {
    ctaBtns.push('<a class="btn btn-primary btn-lg" href="' + attr(U.url("/about/")) + '">' + ui("phone") + "<span>Hubungi Kami</span></a>");
  }
  var actions = '<div class="pd-actions">' + ctaBtns.join("") + "</div>";

  var metaLine =
    '<div class="pd-meta">' +
    (m.author ? "<span>oleh " + esc(m.author) + '</span><span class="dot">·</span>' : "") +
    '<time datetime="' + attr(m.date) + '">' + esc(formatDate(m.date, config.language)) + "</time>" +
    "</div>";

  /* ---- Blok ringkasan produk (gambar + info) ---- */
  var productHead =
    '<div class="pd-head">' +
    media +
    '<div class="pd-info">' +
    cat +
    '<h1 class="pd-title">' + esc(m.title) + "</h1>" +
    metaLine +
    price +
    (post.excerpt ? '<p class="pd-excerpt">' + esc(post.excerpt) + "</p>" : "") +
    specs +
    actions +
    "</div>" +
    "</div>";

  /* ---- Deskripsi lengkap (isi Markdown) ---- */
  var pluginAfter = (ctx.plugins && ctx.plugins.contentAfter) ? ctx.plugins.contentAfter(ctx) : "";
  var description =
    '<div class="pd-description">' +
    '<h2 class="pd-section-title">Deskripsi Produk</h2>' +
    '<div class="post-content">\n' + post.html + "\n</div>" +
    (tags ? "\n" + tags : "") +
    pluginAfter +
    "</div>";

  /* ---- JSON-LD Product (additif; hanya bila ada harga) ---- */
  var productLdTag = "";
  if (m.price) {
    // Coba ekstrak angka harga dari string (mis. "Rp 1.500.000" → 1500000).
    var priceNum = String(m.price).replace(/[^0-9]/g, "");
    var offer = { "@type": "Offer", availability: "https://schema.org/InStock", priceCurrency: "IDR" };
    if (priceNum) offer.price = priceNum;
    offer.url = U.abs(post.permalink);
    var productLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: m.title,
      description: post.excerpt,
      offers: offer,
    };
    if (post.ogImage) productLd.image = post.ogImage;
    if (m.brand) productLd.brand = { "@type": "Brand", name: m.brand };
    if (m.sku) productLd.sku = String(m.sku);
    productLdTag = '\n        <script type="application/ld+json">' + JSON.stringify(productLd).replace(/</g, "\\u003c") + "</script>";
  }

  /* ---- Produk terkait ---- */
  var relatedHtml = (related && related.length)
    ? '\n    <section class="section section-alt related-products"><div class="container">' +
      '<div class="section-head center"><span class="eyebrow">Lainnya</span><h2>Produk Terkait</h2></div>' +
      '<div class="product-grid cols-3">' +
      related.map(function (p) { return postCardRef(p, ctx); }).join("") +
      "</div></div></section>"
    : "";

  /* ---- Rakit dengan / tanpa sidebar ---- */
  var asideHtml = sidebar.render(ctx);
  var article;
  if (asideHtml) {
    article =
      '\n    <article class="product-detail">' +
      '\n      <div class="container"><div class="layout-sidebar">' +
      '\n        <div class="post-main">' + productHead + description + productLdTag + "</div>" +
      "\n        " + asideHtml +
      "\n      </div></div>" +
      "\n    </article>";
  } else {
    article =
      '\n    <article class="product-detail">' +
      '\n      <div class="container container-narrow">' + productHead + description + productLdTag + "</div>" +
      "\n    </article>";
  }

  return layout(ctx, article + relatedHtml);
};

// Kartu produk terkait — memakai kartu katalog standar.
function postCardRef(p, ctx) {
  return require("./partials/post-card")(p, ctx);
}

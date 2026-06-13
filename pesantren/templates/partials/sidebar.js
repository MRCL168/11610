/* ============================================================
   partials/sidebar.js — Bilah sisi (TEMA Pesantren)
   Tampil di SEMUA halaman kecuali beranda (post, arsip, halaman
   biasa). Seluruh widget dapat diatur lewat Customizer
   (Sesuaikan → "Bilah Sisi"): tampil/sembunyi, judul, isi, urutan
   posisi (kanan/kiri).

   Widget yang tersedia (berurutan):
     1. CTA Pendaftaran  — kotak ajakan daftar santri.
     2. Kontak Singkat   — memakai data Lokasi & Kontak (DRY).
     3. Artikel Terbaru  — diambil dari inti (ctx.site.recentPosts).
     4. Kategori         — daftar kategori (ctx.site.categoryNames).
     5. Teks/Pengumuman  — widget teks bebas.
     6. Banner           — gambar + tautan.

   Kontrak emas: HANYA membaca data dari ctx (config/U/site).
   Tidak menyentuh GitHub API / filesystem / routing.
   ============================================================ */

"use strict";

var icons = require("./icons");
var navHref = require("./profile").navHref;

/* Kartu artikel ringkas untuk widget "Artikel Terbaru". */
function recentItem(post, ctx) {
  var U = ctx.U, lib = ctx.lib;
  var esc = lib.esc, attr = lib.attr, formatDate = lib.formatDate;
  var href = attr(U.url(post.permalink));
  var thumb = post.ogImage
    ? '<a class="sb-recent-thumb" href="' + href + '" tabindex="-1" aria-hidden="true"><img src="' + attr(U.url(post.featuredImage)) + '" alt="' + attr(post.meta.title) + '" loading="lazy"></a>'
    : '<a class="sb-recent-thumb sb-recent-thumb-empty" href="' + href + '" tabindex="-1" aria-hidden="true">' + icons.lineIcon("book") + "</a>";
  return (
    '<li class="sb-recent-item">' + thumb +
    '<div class="sb-recent-body">' +
    '<a class="sb-recent-title" href="' + href + '">' + esc(post.meta.title) + "</a>" +
    '<time class="sb-recent-date" datetime="' + attr(post.meta.date) + '">' + esc(formatDate(post.meta.date, ctx.config.language)) + "</time>" +
    "</div></li>"
  );
}

/* Pembungkus satu widget. */
function widgetCard(title, bodyHtml, extraClass) {
  return (
    '\n      <section class="sb-widget' + (extraClass ? " " + extraClass : "") + '">' +
    (title ? '<h2 class="sb-widget-title">' + title + "</h2>" : "") +
    bodyHtml +
    "</section>"
  );
}

/* ---------- Render bilah sisi ---------- */
function renderSidebar(ctx, profile) {
  var U = ctx.U, lib = ctx.lib, site = ctx.site || {};
  var esc = lib.esc, attr = lib.attr, slugify = lib.slugify;
  var sb = profile.sidebar;
  if (!sb || !sb.enabled) return "";

  var parts = [];

  /* 1) Widget CTA Pendaftaran */
  if (sb.cta.show) {
    var ctaBody =
      (sb.cta.text ? '<p class="sb-cta-text">' + esc(sb.cta.text) + "</p>" : "") +
      '<a class="btn btn-primary btn-block" href="' + attr(navHref(U, sb.cta.buttonUrl)) + '">' + esc(sb.cta.buttonText) + "</a>";
    parts.push(widgetCard(esc(sb.cta.title), ctaBody, "sb-cta"));
  }

  /* 2) Widget Kontak Singkat — memakai data kontak utama (DRY) */
  if (sb.kontak.show) {
    var k = profile.kontak;
    var rows = [];
    if (k.address) rows.push('<li><span class="sb-kontak-ic">' + icons.lineIcon("building") + '</span><span>' + esc(k.address) + "</span></li>");
    if (k.phone) rows.push('<li><span class="sb-kontak-ic">' + icons.lineIcon("clock") + '</span><a href="tel:' + attr(k.phone.replace(/\s+/g, "")) + '">' + esc(k.phone) + "</a></li>");
    if (k.waLink) rows.push('<li><span class="sb-kontak-ic">' + icons.lineIcon("heart") + '</span><a href="' + attr(k.waLink) + '" target="_blank" rel="noopener">' + esc(k.whatsapp || k.phone) + "</a></li>");
    if (k.email) rows.push('<li><span class="sb-kontak-ic">' + icons.lineIcon("pen") + '</span><a href="mailto:' + attr(k.email) + '">' + esc(k.email) + "</a></li>");
    if (k.hours) rows.push('<li><span class="sb-kontak-ic">' + icons.lineIcon("clock") + '</span><span>' + esc(k.hours) + "</span></li>");
    if (rows.length) {
      var kBody =
        '<ul class="sb-kontak-list">' + rows.join("") + "</ul>" +
        (k.waLink ? '<a class="btn btn-soft btn-block" href="' + attr(k.waLink) + '" target="_blank" rel="noopener">Chat via WhatsApp</a>' : "");
      parts.push(widgetCard(esc(sb.kontak.title), kBody, "sb-kontak"));
    }
  }

  /* 3) Widget Artikel Terbaru */
  if (sb.recent.show) {
    var posts = (site.recentPosts || []).slice(0, sb.recent.count);
    if (posts.length) {
      var items = posts
        .map(function (p) { return recentItem(p, ctx); })
        .join("");
      parts.push(widgetCard(esc(sb.recent.title), '<ul class="sb-recent">' + items + "</ul>", "sb-recent-w"));
    }
  }

  /* 4) Widget Kategori */
  if (sb.kategori.show) {
    var cats = site.categoryNames || [];
    if (cats.length) {
      var lis = cats
        .map(function (c) {
          return '<li><a href="' + attr(U.url("/category/" + slugify(c) + "/")) + '">' + esc(c) + "</a></li>";
        })
        .join("");
      parts.push(widgetCard(esc(sb.kategori.title), '<ul class="sb-cats">' + lis + "</ul>", "sb-cats-w"));
    }
  }

  /* 5) Widget Teks / Pengumuman */
  if (sb.teks.show && sb.teks.body) {
    var paras = String(sb.teks.body)
      .split(/\n{2,}/)
      .map(function (b) { return "<p>" + esc(b.trim()).replace(/\n/g, "<br>") + "</p>"; })
      .join("");
    parts.push(widgetCard(esc(sb.teks.title), '<div class="sb-text">' + paras + "</div>", "sb-text-w"));
  }

  /* 6) Widget Banner */
  if (sb.banner.show && sb.banner.image) {
    var img = '<img src="' + attr(U.url(sb.banner.image)) + '" alt="' + attr(sb.banner.alt) + '" loading="lazy">';
    var inner = sb.banner.url
      ? '<a href="' + attr(navHref(U, sb.banner.url)) + '" class="sb-banner-link">' + img + "</a>"
      : img;
    parts.push(widgetCard("", inner, "sb-banner"));
  }

  if (!parts.length) return "";

  return '\n      <aside class="sidebar" aria-label="Informasi tambahan">' + parts.join("") + "\n      </aside>";
}

/* Apakah bilah sisi aktif & punya isi? Dipakai template untuk
   memilih tata letak satu/dua kolom. */
function hasSidebar(ctx, profile) {
  return renderSidebar(ctx, profile).trim().length > 0;
}

module.exports = { renderSidebar: renderSidebar, hasSidebar: hasSidebar };

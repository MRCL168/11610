/* ============================================================
   templates/home.js — Beranda Pesantren (TEMA)
   Fungsi murni (ctx) => string HTML. Merangkai seksi sesuai brief:
     hero+slider → statistik → program → profil → fasilitas →
     pengajar → berita → testimoni → lokasi+kontak → CTA.
   Data seksi berasal dari getProfile(ctx) (baca ctx.config.profile
   yang di-mirror inti dari Customizer). Halaman 2+ menampilkan
   indeks artikel sederhana berpaginasi.
   ctx: { config, U, lib, site, seo, themeVars, posts, pageNum, totalPages }
   ============================================================ */

"use strict";

var layout = require("./partials/layout");
var sections = require("./partials/sections");
var postCard = require("./partials/post-card");
var getProfile = require("./partials/profile").getProfile;

module.exports = function home(ctx) {
  var U = ctx.U, lib = ctx.lib;
  var attr = lib.attr;
  var pageNum = ctx.pageNum || 1;
  var totalPages = ctx.totalPages || 1;
  var posts = ctx.posts || [];

  // --- Halaman 2+ : indeks artikel (beranda penuh hanya di halaman 1) ---
  if (pageNum > 1) {
    var cards = posts.map(function (p) { return postCard(p, ctx); }).join("");
    var prev = pageNum > 1
      ? '<a class="page-link" href="' + attr(U.url(pageNum === 2 ? "/" : "/page/" + (pageNum - 1) + "/")) + '">&larr; Sebelumnya</a>'
      : '<span class="page-link disabled">&larr; Sebelumnya</span>';
    var next = pageNum < totalPages
      ? '<a class="page-link" href="' + attr(U.url("/page/" + (pageNum + 1) + "/")) + '">Berikutnya &rarr;</a>'
      : '<span class="page-link disabled">Berikutnya &rarr;</span>';
    var listContent =
      '\n    <section class="page-head"><div class="container">' +
      '<span class="page-head-kicker">Berita</span>' +
      '<h1>Berita &amp; Kegiatan — Halaman ' + pageNum + '</h1>' +
      '</div></section>' +
      '\n    <section class="sect"><div class="container">' +
      '<div class="post-grid">' + cards + '</div>' +
      '\n      <nav class="pagination">' + prev +
      '<span class="page-info">Halaman ' + pageNum + ' dari ' + totalPages + '</span>' +
      next + '</nav>' +
      '\n    </div></section>';
    return layout(ctx, listContent);
  }

  // --- Halaman 1 : beranda lengkap sesuai urutan brief ---
  var profile = getProfile(ctx);
  var content =
    sections.hero(ctx, profile) +
    sections.stats(ctx, profile) +
    sections.programs(ctx, profile) +
    sections.profil(ctx, profile) +
    sections.fasilitas(ctx, profile) +
    sections.pengajar(ctx, profile) +
    sections.berita(ctx, profile) +
    sections.testimoni(ctx, profile) +
    sections.kontak(ctx, profile) +
    sections.ctaBand(ctx, profile) +
    sections.orgSchema(ctx, profile);

  return layout(ctx, content);
};

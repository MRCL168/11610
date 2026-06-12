/* ============================================================
   templates/not-found.js — Halaman 404 (TEMA)
   ctx: { config, U, lib, site, seo, themeVars }
   ============================================================ */

var layout = require("./partials/layout");

module.exports = function notFound(ctx) {
  var U = ctx.U, lib = ctx.lib;
  var attr = lib.attr;

  var content =
    '\n    <section class="error-page"><div class="container">' +
    '<span class="error-code">404</span>' +
    "<h1>Halaman tidak ditemukan</h1>" +
    "<p>Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.</p>" +
    '<a href="' + attr(U.url("/")) + '" class="btn btn-primary btn-lg">&larr; Kembali ke Beranda</a>' +
    "</div></section>";

  return layout(ctx, content);
};

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
    '\n      <div class="error-code">404</div>' +
    "\n      <h1>Halaman Tidak Ditemukan</h1>" +
    "\n      <p>Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.</p>" +
    '\n      <a href="' + attr(U.url("/")) + '" class="btn btn-primary btn-lg">← Kembali ke Beranda</a>' +
    "\n    </div></section>";

  return layout(ctx, content);
};

/* ============================================================
   templates/not-found.js — Halaman 404 (TEMA Gitproperty)
   ctx: { config, U, lib, site, seo, themeVars }
   ============================================================ */

var layout = require("./partials/layout");
var icons = require("./partials/icons");

module.exports = function notFound(ctx) {
  var U = ctx.U, lib = ctx.lib;
  var attr = lib.attr;

  var content =
    '\n    <section class="error-page container">' +
    '\n      <div class="error-ic">' + icons.propIcon("home") + "</div>" +
    "\n      <h1>404</h1>" +
    "\n      <p>Properti atau halaman yang Anda cari tidak ditemukan. Mungkin sudah terjual atau tautannya berubah.</p>" +
    '\n      <a href="' + attr(U.url("/")) + '" class="btn btn-primary btn-lg">← Kembali ke Beranda</a>' +
    "\n    </section>";

  return layout(ctx, content);
};

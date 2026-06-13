/* ============================================================
   templates/not-found.js — Halaman 404 (TEMA Pesantren)
   ctx: { config, U, lib, site, seo, themeVars }
   ============================================================ */

"use strict";

var layout = require("./partials/layout");
var icons = require("./partials/icons");

module.exports = function notFound(ctx) {
  var U = ctx.U, lib = ctx.lib;
  var attr = lib.attr;

  var content =
    '\n    <section class="error-page"><div class="container">' +
    '<span class="error-mark" aria-hidden="true">' + icons.motif() + "</span>" +
    "<h1>404</h1>" +
    "<p>Maaf, halaman yang Anda cari tidak ditemukan.</p>" +
    '<a href="' + attr(U.url("/")) + '" class="btn btn-primary btn-lg">&larr; Kembali ke Beranda</a>' +
    "</div></section>";

  return layout(ctx, content);
};

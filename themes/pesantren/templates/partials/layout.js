/* ============================================================
   partials/layout.js — Kerangka halaman (TEMA Pesantren)
   Menyatukan head + header + main + footer + skrip tema.
   Dipanggil oleh setiap template: layout(ctx, contentHtml).
   ============================================================ */

"use strict";

var head = require("./head");
var header = require("./header");
var footer = require("./footer");

module.exports = function layout(ctx, content) {
  var config = ctx.config, U = ctx.U, lib = ctx.lib;
  var attr = lib.attr;

  // HTML tambahan dari plugin sebelum </body> (mis. tombol WhatsApp).
  var pluginBody = (ctx.plugins && ctx.plugins.bodyEnd) ? ctx.plugins.bodyEnd(ctx) : "";

  return '<!DOCTYPE html>\n<html lang="' + attr(config.language || "id") + '">\n' +
    head(ctx) +
    "\n<body>\n" +
    '  <a class="skip-link" href="#konten">Lewati ke konten</a>\n' +
    header(ctx) +
    '\n  <main class="site-main" id="konten">\n' +
    content +
    "\n  </main>\n" +
    footer(ctx) +
    '\n  <script src="' + attr(U.url("/theme/script.js")) + '" defer></script>' +
    pluginBody +
    "\n</body>\n</html>";
};

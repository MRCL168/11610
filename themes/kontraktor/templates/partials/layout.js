/* ============================================================
   partials/layout.js — Kerangka halaman tema Kontraktor
   Menggabungkan head, header, konten utama, footer, dan skrip tema.
   ============================================================ */

var head = require("./head");
var header = require("./header");
var footer = require("./footer");

module.exports = function layout(ctx, content) {
  var config = ctx.config, U = ctx.U, lib = ctx.lib;
  var attr = lib.attr;
  var pluginBody = (ctx.plugins && ctx.plugins.bodyEnd) ? ctx.plugins.bodyEnd(ctx) : "";

  return '<!DOCTYPE html>\n<html lang="' + attr(config.language || "id") + '">\n' +
    head(ctx) +
    '\n<body>\n' +
    header(ctx) +
    '\n  <main class="site-main">\n' +
    content +
    '\n  </main>\n' +
    footer(ctx) +
    '\n  <script src="' + attr(U.url("/theme/script.js")) + '" defer></script>' +
    pluginBody +
    '\n</body>\n</html>';
};

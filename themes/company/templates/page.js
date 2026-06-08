/* ============================================================
   templates/page.js — Halaman statis (TEMA)
   Dipakai untuk Tentang, Layanan, Kontak, dll.
   ctx: { config, U, lib, site, seo, themeVars, page }
   ============================================================ */

var layout = require("./partials/layout");

module.exports = function page(ctx) {
  var lib = ctx.lib, page = ctx.page;
  var esc = lib.esc;

  var lead = (page.meta && page.meta.excerpt)
    ? '<p class="page-lead">' + esc(page.meta.excerpt) + "</p>"
    : "";

  var content =
    '\n    <article class="post">' +
    '\n      <div class="container post-narrow">' +
    '\n        <header class="post-header">' +
    '<h1 class="post-title">' + esc(page.meta.title) + "</h1>" + lead +
    "</header>" +
    '\n        <div class="post-content">\n' + page.html + "\n        </div>" +
    "\n      </div>" +
    "\n    </article>";

  return layout(ctx, content);
};

/* ============================================================
   templates/page.js — Halaman statis (TEMA)
   Dipakai untuk Tentang, Layanan, Kontak, dll. Menampilkan
   sticky sidebar info perusahaan di sisi kanan (kecuali bila
   dimatikan dari Customizer).

   Catatan SEO: meta/OG/JSON-LD dirender head.js dari ctx.seo
   (inti). Template hanya merender isi.

   ctx: { config, U, lib, site, seo, themeVars, themeContent, page }
   ============================================================ */

var layout = require("./partials/layout");
var sidebar = require("./partials/sidebar");

module.exports = function page(ctx) {
  var lib = ctx.lib, page = ctx.page;
  var esc = lib.esc;
  var m = page.meta || {};

  // Lead opsional dari excerpt halaman.
  var lead = (m.excerpt)
    ? '<p class="page-lead">' + esc(m.excerpt) + "</p>"
    : "";

  var header =
    '<header class="post-header">' +
    '<h1 class="post-title">' + esc(m.title) + "</h1>" +
    lead +
    "</header>";

  // HTML tambahan dari plugin setelah isi (mis. blok FAQ).
  var pluginAfter = (ctx.plugins && ctx.plugins.contentAfter) ? ctx.plugins.contentAfter(ctx) : "";
  var body = '<div class="post-content">\n' + page.html + "\n</div>" + pluginAfter;

  // Rakit dengan / tanpa sidebar.
  var asideHtml = sidebar.render(ctx);
  var content;
  if (asideHtml) {
    content =
      '\n    <article class="post page-static">' +
      '\n      <div class="container"><div class="layout-sidebar">' +
      '\n        <div class="post-main">' + header + body + "</div>" +
      "\n        " + asideHtml +
      "\n      </div></div>" +
      "\n    </article>";
  } else {
    content =
      '\n    <article class="post page-static">' +
      '\n      <div class="container container-narrow">' + header + body + "</div>" +
      "\n    </article>";
  }

  return layout(ctx, content);
};

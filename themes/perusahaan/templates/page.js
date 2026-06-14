/* ============================================================
   templates/page.js — Halaman statis (TEMA)
   - Halaman ber-template "kontak" (front-matter `template: kontak`
     atau slug kontak/contact/hubungi-kami): KHUSUS. Hanya menampilkan
     blok Kontak + Peta dari Sesuaikan → Kontak & Peta — TANPA judul
     halaman, TANPA sidebar, TANPA isi markdown.
   - Halaman lain: dua kolom (isi + sidebar) bila sidebar terisi; jika
     kosong, isi lebar-fokus. Sidebar muncul di semua halaman SELAIN
     beranda.
   ctx: { config, U, lib, site, seo, themeVars, themeContent, page }
   ============================================================ */

var layout = require("./partials/layout");
var sidebar = require("./partials/sidebar");
var contactSection = require("./partials/contact");

// Apakah halaman ini halaman kontak? (template eksplisit atau slug umum)
function isContactPage(page) {
  var tpl = String((page.meta && page.meta.template) || "").toLowerCase().trim();
  if (tpl === "kontak" || tpl === "contact") return true;
  var slug = String(page.slug || "").toLowerCase();
  return /^(kontak|contact|hubungi-kami|hubungi)$/.test(slug);
}

module.exports = function page(ctx) {
  var lib = ctx.lib, page = ctx.page;
  var esc = lib.esc;

  // Halaman KONTAK khusus: render hanya blok Kontak + Peta (lebar penuh).
  // Judul tab/meta tetap diambil dari front-matter halaman oleh inti (ctx.seo).
  if (isContactPage(page)) {
    return layout(ctx, contactSection(ctx));
  }

  // Halaman biasa
  var lead = (page.meta && page.meta.excerpt)
    ? '<p class="page-lead">' + esc(page.meta.excerpt) + "</p>"
    : "";
  var header = '<header class="post-header"><h1 class="post-title">' + esc(page.meta.title) + "</h1>" + lead + "</header>";
  var pluginAfter = (ctx.plugins && ctx.plugins.contentAfter) ? ctx.plugins.contentAfter(ctx) : "";
  var hasBody = page.html && page.html.trim();
  var body = hasBody ? '<div class="post-content">\n' + page.html + "\n</div>" : "";

  var blocks = sidebar.getSidebar(ctx);
  var article;
  if (blocks.length) {
    article =
      '\n    <article class="post">' +
      '\n      <div class="container"><div class="layout-sidebar">' +
      '\n        <div class="post-main">' + header + body + pluginAfter + "</div>" +
      "\n        " + sidebar.render(ctx, blocks) +
      "\n      </div></div>" +
      "\n    </article>";
  } else {
    article =
      '\n    <article class="post">' +
      '\n      <div class="container post-narrow">' + header + body + pluginAfter + "</div>" +
      "\n    </article>";
  }

  return layout(ctx, article);
};

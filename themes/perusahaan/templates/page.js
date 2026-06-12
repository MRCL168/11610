/* ============================================================
   templates/page.js — Halaman statis (TEMA)
   Dipakai untuk Tentang, Layanan, Kontak, dll.
   Halaman ber-template "kontak" (front-matter `template: kontak`
   atau slug kontak/contact/hubungi-kami) menampilkan blok Kontak +
   Peta dari data Sesuaikan → Kontak setelah isi halaman.
   ctx: { config, U, lib, site, seo, themeVars, themeContent, page }
   ============================================================ */

var layout = require("./partials/layout");
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

  var lead = (page.meta && page.meta.excerpt)
    ? '<p class="page-lead">' + esc(page.meta.excerpt) + "</p>"
    : "";
  var header = '<header class="post-header"><h1 class="post-title">' + esc(page.meta.title) + "</h1>" + lead + "</header>";
  // HTML tambahan dari plugin setelah isi (mis. blok FAQ).
  var pluginAfter = (ctx.plugins && ctx.plugins.contentAfter) ? ctx.plugins.contentAfter(ctx) : "";
  var hasBody = page.html && page.html.trim();
  var body = hasBody ? '<div class="post-content">\n' + page.html + "\n</div>" : "";

  var article =
    '\n    <article class="post">' +
    '\n      <div class="container post-narrow">' + header + body + pluginAfter + "</div>" +
    "\n    </article>";

  // Sisipkan blok Kontak + Peta pada halaman kontak.
  var contact = isContactPage(page) ? contactSection(ctx) : "";

  return layout(ctx, article + contact);
};

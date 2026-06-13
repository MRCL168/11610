/* ============================================================
   templates/page.js — Halaman statis (TEMA Pesantren)
   Mendeteksi front-matter `template`:
     - template: kontak       → halaman Kontak (info + peta + form pesan)
     - template: pendaftaran  → halaman Pendaftaran Santri (form → Google Sheet)
     - selain itu             → halaman biasa (konten + bilah sisi)

   Catatan: halaman Kontak & Pendaftaran sengaja TANPA bilah sisi —
   keduanya halaman konversi yang fokus (Kontak sudah memuat info +
   peta sendiri; Pendaftaran adalah formulir terfokus). Bilah sisi
   tampil di halaman biasa lainnya.
   ctx: { config, U, lib, site, seo, themeVars, page }
   ============================================================ */

"use strict";

var layout = require("./partials/layout");
var forms = require("./partials/forms");
var getProfile = require("./partials/profile").getProfile;
var sidebarMod = require("./partials/sidebar");

module.exports = function page(ctx) {
  var lib = ctx.lib, page = ctx.page;
  var esc = lib.esc;
  var tpl = (page.meta && page.meta.template) ? String(page.meta.template) : "";

  // Halaman khusus berbasis Customizer (fokus, tanpa bilah sisi).
  if (tpl === "kontak" || tpl === "pendaftaran") {
    var profileK = getProfile(ctx);
    var special = tpl === "kontak"
      ? forms.renderKontak(ctx, profileK)
      : forms.renderPendaftaran(ctx, profileK);
    return layout(ctx, special);
  }

  // Halaman biasa.
  var lead = page.meta.excerpt ? '<p class="page-lead">' + esc(page.meta.excerpt) + "</p>" : "";
  var pluginAfter = (ctx.plugins && ctx.plugins.contentAfter) ? ctx.plugins.contentAfter(ctx) : "";

  var header =
    '<header class="post-header">' +
    '<h1 class="post-title">' + esc(page.meta.title) + "</h1>" + lead +
    "</header>";
  var body = '<div class="post-content">\n' + page.html + "\n        </div>";

  // Bilah sisi: tampil di halaman biasa (bukan beranda).
  var profile = getProfile(ctx);
  var sidebar = sidebarMod.renderSidebar(ctx, profile);

  var content;
  if (sidebar) {
    var layoutClass = "content-layout" + (profile.sidebar.position === "kiri" ? " content-layout--left" : "");
    content =
      '\n    <article class="post page-default">' +
      '\n      <div class="container">' +
      '\n        <div class="' + layoutClass + '">' +
      '\n          <main class="content-main">' + header + body + pluginAfter + "\n          </main>" +
      sidebar +
      "\n        </div>" +
      "\n      </div>" +
      "\n    </article>";
  } else {
    content =
      '\n    <article class="post page-default">' +
      '\n      <div class="container post-narrow">' + header + body + pluginAfter + "</div>" +
      "\n    </article>";
  }

  return layout(ctx, content);
};

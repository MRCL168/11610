/* ============================================================
   templates/page.js — Halaman statis tema Kontraktor
   Mendukung sidebar halaman dalam, halaman hubungi kami dengan maps,
   dan halaman portofolio berbasis data tema.
   ============================================================ */

var layout = require("./partials/layout");
var sidebar = require("./partials/sidebar");
var profileMod = require("./partials/profile");
var getProfile = profileMod.getProfile;
var navHref = profileMod.navHref;
var home = require("./home");

function isContactPage(slug) {
  slug = String(slug || "").toLowerCase();
  return ["kontak", "contact", "hubungi", "hubungi-kami"].indexOf(slug) !== -1;
}
function isPortfolioPage(slug) {
  slug = String(slug || "").toLowerCase();
  return ["portfolio", "portofolio", "proyek", "projects"].indexOf(slug) !== -1;
}

function renderContact(ctx, profile) {
  var U = ctx.U, lib = ctx.lib;
  var esc = lib.esc, attr = lib.attr;
  var c = profile.contact;
  if (!c.enabled) return "";
  var rows = "";
  if (c.address) rows += '<li><strong>Alamat</strong><span>' + esc(c.address) + '</span></li>';
  if (c.phone) rows += '<li><strong>Telepon / WhatsApp</strong><a href="https://wa.me/' + attr(c.phone.replace(/\D/g, "")) + '">' + esc(c.phone) + '</a></li>';
  if (c.email) rows += '<li><strong>Email</strong><a href="mailto:' + attr(c.email) + '">' + esc(c.email) + '</a></li>';

  var map = "";
  if (c.mapEmbed) {
    map = '<div class="contact-map embed-map">' + c.mapEmbed + '</div>';
  } else if (c.mapImage) {
    var img = '<img src="' + attr(U.url(c.mapImage)) + '" alt="' + attr(c.title) + '" loading="lazy">';
    map = '<div class="contact-map">' + (c.mapUrl ? '<a href="' + attr(navHref(U, c.mapUrl)) + '" target="_blank" rel="noopener">' + img + '</a>' : img) + '</div>';
  } else {
    map = '<div class="contact-map contact-map-empty"><span>Google Maps</span><p>Tempel kode embed maps dari menu Sesuaikan.</p></div>';
  }

  return '\n      <section class="contact-panel">' +
    '\n        <div class="contact-copy"><span class="eyebrow">Kontak</span><h2>' + esc(c.title) + '</h2><p>' + esc(c.text) + '</p><ul class="contact-list">' + rows + '</ul></div>' +
    '\n        ' + map +
    '\n      </section>';
}

module.exports = function page(ctx) {
  var lib = ctx.lib, page = ctx.page;
  var esc = lib.esc;
  var profile = getProfile(ctx);
  var slug = page.slug || (page.meta && page.meta.slug) || "";
  var lead = (page.meta && page.meta.excerpt) ? '<p class="page-lead">' + esc(page.meta.excerpt) + '</p>' : "";
  var header = '<header class="post-header"><h1 class="post-title">' + esc(page.meta.title) + '</h1>' + lead + '</header>';
  var pluginAfter = (ctx.plugins && ctx.plugins.contentAfter) ? ctx.plugins.contentAfter(ctx) : "";
  var extra = "";
  if (isContactPage(slug)) extra += renderContact(ctx, profile);
  if (isPortfolioPage(slug)) extra += home.renderPortfolio(ctx, profile, true);
  var body = '<div class="post-content">\n' + page.html + '\n</div>' + extra + pluginAfter;

  var blocks = sidebar.getSidebar(ctx);
  var content;
  if (blocks.length) {
    content = '\n    <article class="post">' +
      '\n      <div class="container"><div class="layout-sidebar">' +
      '\n        <div class="post-main">' + header + body + '</div>' +
      '\n        ' + sidebar.render(ctx, blocks) +
      '\n      </div></div>' +
      '\n    </article>';
  } else {
    content = '\n    <article class="post">' +
      '\n      <div class="container post-narrow">' + header + body + '</div>' +
      '\n    </article>';
  }
  return layout(ctx, content);
};

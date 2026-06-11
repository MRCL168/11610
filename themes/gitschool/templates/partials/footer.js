/* ============================================================
   partials/footer.js — Footer situs + widget (TEMA)
   Widget dirender DI SINI dari data yang disediakan inti lewat
   ctx.site (widgets, recentPosts, categoryNames, tagNames).
   Tipe widget: text (HTML), recent-posts, categories, tags, social.
   Footer juga menampilkan identitas sekolah + kontak ringkas.
   ============================================================ */

var iconsMod = require("./icons");
var socialLinks = iconsMod.socialLinks;
var ui = iconsMod.ui;
var schoolMod = require("./school");
var getSchool = schoolMod.getSchool;

function widgetBlock(w, ctx) {
  var U = ctx.U, lib = ctx.lib, site = ctx.site;
  var esc = lib.esc, attr = lib.attr, slugify = lib.slugify;
  var type = String((w && w.type) || "").toLowerCase();
  var title = w && w.title ? '<h3 class="widget-title">' + esc(w.title) + "</h3>" : "";
  var body = "";

  if (type === "text") {
    // Konten HTML dari pemilik repo (tepercaya), disisipkan apa adanya.
    body = '<div class="widget-text">' + (w.content || "") + "</div>";
  } else if (type === "recent-posts") {
    var n = parseInt(w.count, 10) || 5;
    var items = (site.recentPosts || [])
      .slice(0, n)
      .map(function (p) { return '<li><a href="' + attr(U.url(p.permalink)) + '">' + esc(p.meta.title) + "</a></li>"; })
      .join("");
    body = '<ul class="widget-list">' + items + "</ul>";
  } else if (type === "categories") {
    var citems = (site.categoryNames || [])
      .map(function (name) { return '<li><a href="' + attr(U.url("/category/" + slugify(name) + "/")) + '">' + esc(name) + "</a></li>"; })
      .join("");
    body = '<ul class="widget-list">' + citems + "</ul>";
  } else if (type === "tags") {
    var tn = parseInt(w.count, 10) || 20;
    var titems = (site.tagNames || [])
      .slice(0, tn)
      .map(function (t) { return '<a class="widget-tag" href="' + attr(U.url("/tag/" + slugify(t) + "/")) + '">#' + esc(t) + "</a>"; })
      .join("");
    body = '<div class="widget-tags">' + titems + "</div>";
  } else if (type === "social") {
    body = socialLinks(ctx.config, lib) || "";
  } else {
    return "";
  }

  return '<div class="footer-widget widget-' + esc(type || "x") + '">' + title + body + "</div>";
}

function renderWidgets(ctx) {
  var widgets = (ctx.site && ctx.site.widgets) || [];
  if (!Array.isArray(widgets) || !widgets.length) return "";
  var cols = widgets.map(function (w) { return widgetBlock(w, ctx); }).filter(Boolean);
  if (!cols.length) return "";
  return (
    '\n    <div class="footer-widgets">' +
    '\n      <div class="container footer-widgets-grid">' + cols.join("") + "</div>" +
    "\n    </div>"
  );
}

module.exports = function footer(ctx) {
  var config = ctx.config, lib = ctx.lib;
  var esc = lib.esc, attr = lib.attr;
  var school = getSchool(ctx);
  var map = school.map;

  var year = new Date().getFullYear();
  var copyright =
    config.footerCopyright && String(config.footerCopyright).trim()
      ? esc(config.footerCopyright)
      : "© " + year + " " + esc(config.title || config.author) + ". Hak cipta dilindungi.";

  // Kontak ringkas dari bagian "Peta / Lokasi".
  var contactRows = "";
  if (map.address) contactRows += '<li>' + ui("pin") + "<span>" + esc(map.address) + "</span></li>";
  if (map.phone) contactRows += '<li>' + ui("phone") + '<a href="tel:' + attr(map.phone.replace(/[^0-9+]/g, "")) + '">' + esc(map.phone) + "</a></li>";
  if (map.email) contactRows += '<li>' + ui("mail") + '<a href="mailto:' + attr(map.email) + '">' + esc(map.email) + "</a></li>";
  if (map.hours) contactRows += '<li>' + ui("clock") + "<span>" + esc(map.hours) + "</span></li>";
  var contactCol = contactRows
    ? '<div class="footer-col footer-contact"><h3 class="footer-col-title">Kontak Sekolah</h3><ul class="footer-contact-list">' + contactRows + "</ul></div>"
    : "";

  var widgets = renderWidgets(ctx);

  var brandMark = config.logo
    ? '<img class="footer-logo" src="' + attr(config.logo ? ctx.U.url(config.logo) : "") + '" alt="' + attr(config.title) + '">'
    : '<span class="footer-mark" aria-hidden="true">' + esc((config.title || "S").trim().charAt(0).toUpperCase()) + "</span>";

  return (
    '\n  <footer class="site-footer">' +
    widgets +
    '\n    <div class="container footer-main">' +
    '\n      <div class="footer-col footer-brand">' +
    "\n        " + brandMark +
    '\n        <div class="footer-title">' + esc(config.title) + "</div>" +
    '\n        <p class="footer-desc">' + esc(config.tagline || config.description || "") + "</p>" +
    "\n        " + (socialLinks(config, lib) || "") +
    "\n      </div>" +
    "\n      " + contactCol +
    "\n    </div>" +
    '\n    <div class="container footer-bottom">' +
    "\n      <span>" + copyright + "</span>" +
    '\n      <a href="https://www.gudangweb.com" target="_blank" rel="noopener">Dibuat dengan GitCMS</a>' +
    "\n    </div>" +
    "\n  </footer>"
  );
};

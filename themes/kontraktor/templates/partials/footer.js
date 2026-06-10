/* ============================================================
   partials/footer.js — Footer tema Kontraktor
   Widget footer tetap memakai data site/widgets dari inti.
   ============================================================ */

var socialLinks = require("./icons").socialLinks;

function widgetBlock(w, ctx) {
  var U = ctx.U, lib = ctx.lib, site = ctx.site || {};
  var esc = lib.esc, attr = lib.attr, slugify = lib.slugify;
  var type = String((w && w.type) || "").toLowerCase();
  var title = w && w.title ? '<h3 class="widget-title">' + esc(w.title) + '</h3>' : "";
  var body = "";

  if (type === "text") {
    body = '<div class="widget-text">' + (w.content || "") + '</div>';
  } else if (type === "recent-posts") {
    body = '<ul class="widget-list">' + (site.recentPosts || []).slice(0, parseInt(w.count, 10) || 5).map(function (p) {
      return '<li><a href="' + attr(U.url(p.permalink)) + '">' + esc(p.meta.title) + '</a></li>';
    }).join("") + '</ul>';
  } else if (type === "categories") {
    body = '<ul class="widget-list">' + (site.categoryNames || []).map(function (name) {
      return '<li><a href="' + attr(U.url("/category/" + slugify(name) + "/")) + '">' + esc(name) + '</a></li>';
    }).join("") + '</ul>';
  } else if (type === "tags") {
    body = '<div class="widget-tags">' + (site.tagNames || []).slice(0, parseInt(w.count, 10) || 20).map(function (t) {
      return '<a class="widget-tag" href="' + attr(U.url("/tag/" + slugify(t) + "/")) + '">#' + esc(t) + '</a>';
    }).join("") + '</div>';
  } else if (type === "social") {
    body = socialLinks(ctx.config, lib);
  } else {
    return "";
  }

  return '<div class="footer-widget widget-' + esc(type || "x") + '">' + title + body + '</div>';
}

function renderWidgets(ctx) {
  var widgets = (ctx.site && ctx.site.widgets) || [];
  if (!Array.isArray(widgets) || !widgets.length) return "";
  var cols = widgets.map(function (w) { return widgetBlock(w, ctx); }).filter(Boolean);
  if (!cols.length) return "";
  return '\n    <div class="footer-widgets"><div class="container footer-widgets-grid">' + cols.join("") + '</div></div>';
}

module.exports = function footer(ctx) {
  var config = ctx.config, lib = ctx.lib;
  var esc = lib.esc;
  var year = new Date().getFullYear();
  var copyright = config.footerCopyright && String(config.footerCopyright).trim()
    ? esc(config.footerCopyright)
    : '© ' + year + ' ' + esc(config.author || config.title || "GitCMS") + (config.footerText ? '. ' + esc(config.footerText) : '');

  return '\n  <footer class="site-footer">' +
    renderWidgets(ctx) +
    '\n    <div class="container footer-main">' +
    '\n      <div><div class="footer-brand">' + esc(config.title || "GitCMS") + '</div><p>' + esc(config.tagline || config.description || "") + '</p></div>' +
    '\n      ' + socialLinks(config, lib) +
    '\n    </div>' +
    '\n    <div class="container footer-bottom"><span>' + copyright + '</span><a href="https://www.gudangweb.com" target="_blank" rel="noopener">Build with GitCMS</a></div>' +
    '\n  </footer>';
};

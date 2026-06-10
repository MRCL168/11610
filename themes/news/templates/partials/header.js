/* ============================================================
   partials/header.js — Header dark portal berita (TEMA)
   Header gelap (--headerBg) dengan logo kiri, navigasi tengah-kanan,
   dan hamburger untuk mobile. Mendukung submenu (hover desktop /
   accordion mobile).
   ============================================================ */

module.exports = function header(ctx) {
  var config = ctx.config, U = ctx.U, lib = ctx.lib;
  var esc = lib.esc, attr = lib.attr;

  function navItemHtml(n) {
    var children = Array.isArray(n.children) ? n.children.filter(function (c) { return c && c.label; }) : [];
    if (!children.length) {
      return '<a class="nav-link" href="' + attr(navHref(U, n.url || "/")) + '">' + esc(n.label) + "</a>";
    }
    var sub = children
      .map(function (c) { return '<a class="submenu-link" href="' + attr(navHref(U, c.url || "/")) + '">' + esc(c.label) + "</a>"; })
      .join("");
    return (
      '<div class="nav-parent">' +
      '<a class="nav-link nav-link-parent" href="' + attr(navHref(U, n.url || "#")) + '">' + esc(n.label) + '<span class="caret" aria-hidden="true">▾</span></a>' +
      '<button class="submenu-toggle" type="button" aria-label="Buka submenu ' + attr(n.label) + '" aria-expanded="false">▾</button>' +
      '<div class="submenu">' + sub + "</div>" +
      "</div>"
    );
  }

  function navHref(U, url) {
    var u = String(url || "");
    if (!u) return "#";
    if (/^(https?:|mailto:|tel:|#)/i.test(u)) return u;
    return U.url(u);
  }

  var navItems = (config.nav || []).map(navItemHtml).join("");

  var brand = config.logo
    ? '<a href="' + attr(U.url("/")) + '" class="site-logo site-logo-img"><img src="' + attr(U.url(config.logo)) + '" alt="' + attr(config.title) + '"></a>'
    : '<a href="' + attr(U.url("/")) + '" class="site-logo">' + esc(config.title) + "</a>";

  return (
    '\n  <header class="site-header">' +
    '\n    <div class="container header-inner">' +
    "\n      " + brand +
    '\n      <button class="nav-toggle" id="nav-toggle" type="button" aria-label="Buka menu" aria-expanded="false" aria-controls="site-nav">' +
    '<span class="nav-toggle-bar"></span><span class="nav-toggle-bar"></span><span class="nav-toggle-bar"></span>' +
    "</button>" +
    '\n      <nav class="site-nav" id="site-nav" aria-label="Navigasi utama">' + navItems + "</nav>" +
    "\n    </div>" +
    "\n  </header>"
  );
};

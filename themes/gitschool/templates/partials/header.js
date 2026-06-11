/* ============================================================
   partials/header.js — Header & navigasi (TEMA)
   Header lengket (sticky) dengan logo, menu (mendukung submenu
   bertingkat), dan satu tombol CTA "Pendaftaran" untuk konversi.
   Pada mobile, menu berubah menjadi drawer (lihat assets/script.js).
   ============================================================ */

var schoolMod = require("./school");
var getSchool = schoolMod.getSchool;
var navHref = schoolMod.navHref;

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
      '\n        <div class="nav-parent">' +
      '<a class="nav-link nav-link-parent" href="' + attr(navHref(U, n.url || "#")) + '">' + esc(n.label) + '<span class="caret" aria-hidden="true">▾</span></a>' +
      '<button class="submenu-toggle" type="button" aria-label="Buka submenu ' + attr(n.label) + '" aria-expanded="false">▾</button>' +
      '<div class="submenu">' + sub + "</div>" +
      "</div>"
    );
  }

  var navItems = (config.nav || []).map(navItemHtml).join("");

  var school = getSchool(ctx);
  // Tombol CTA header (Pendaftaran). Disembunyikan di mobile via CSS (.nav-cta).
  var cta = school.headerCta.show
    ? '<a class="btn btn-primary nav-cta" href="' + attr(navHref(U, school.headerCta.url)) + '">' + esc(school.headerCta.text) + "</a>"
    : "";

  var brand = config.logo
    ? '<a href="' + attr(U.url("/")) + '" class="site-logo site-logo-img"><img src="' + attr(U.url(config.logo)) + '" alt="' + attr(config.title) + '"></a>'
    : '<a href="' + attr(U.url("/")) + '" class="site-logo"><span class="logo-mark" aria-hidden="true">' + esc((config.title || "S").trim().charAt(0).toUpperCase()) + '</span><span class="logo-text">' + esc(config.title) + "</span></a>";

  return (
    '\n  <header class="site-header">' +
    '\n    <div class="container header-inner">' +
    "\n      " + brand +
    '\n      <button class="nav-toggle" id="nav-toggle" type="button" aria-label="Buka menu" aria-expanded="false" aria-controls="site-nav">' +
    '<span class="nav-toggle-bar"></span><span class="nav-toggle-bar"></span><span class="nav-toggle-bar"></span>' +
    "</button>" +
    '\n      <nav class="site-nav" id="site-nav" aria-label="Navigasi utama">' + navItems + cta + "</nav>" +
    "\n    </div>" +
    "\n  </header>"
  );
};

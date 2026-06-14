/* ============================================================
   partials/header.js — Topbar + Header & navigasi (TEMA)
   - Topbar tipis (opsional): nomor telepon & WhatsApp untuk konversi.
   - Header lengket: logo, menu (mendukung submenu/accordion mobile),
     dan satu tombol CTA kontak.
   Semua teks UI dalam Bahasa Indonesia.
   ============================================================ */

var contentMod = require("./content");
var getContent = contentMod.getContent;
var navHref = contentMod.navHref;
var waLink = contentMod.waLink;
var digits = contentMod.digits;
var iconsMod = require("./icons");
var ui = iconsMod.ui;

module.exports = function header(ctx) {
  var config = ctx.config, U = ctx.U, lib = ctx.lib;
  var esc = lib.esc, attr = lib.attr;
  var data = getContent(ctx);

  /* ---- Topbar kontak (opsional) ---- */
  var topbar = "";
  if (data.topbar.enabled) {
    var tbItems = [];
    if (data.topbar.text) tbItems.push('<span class="topbar-note">' + esc(data.topbar.text) + "</span>");
    var tbContacts = [];
    if (data.topbar.phone) {
      tbContacts.push('<a class="topbar-link" href="tel:' + attr(digits(data.topbar.phone)) + '">' + ui("phone") + "<span>" + esc(data.topbar.phone) + "</span></a>");
    }
    if (data.topbar.whatsapp) {
      tbContacts.push('<a class="topbar-link" href="' + attr(waLink(data.topbar.whatsapp, "Halo, saya ingin bertanya tentang produk Anda.")) + '" target="_blank" rel="noopener">' + ui("whatsapp") + "<span>" + esc(data.topbar.whatsapp) + "</span></a>");
    }
    var tbContactsHtml = tbContacts.length ? '<div class="topbar-contacts">' + tbContacts.join("") + "</div>" : "";
    if (tbItems.length || tbContactsHtml) {
      topbar =
        '\n  <div class="site-topbar">' +
        '\n    <div class="container topbar-inner">' + tbItems.join("") + tbContactsHtml + "</div>" +
        "\n  </div>";
    }
  }

  /* ---- Item navigasi (mendukung submenu) ---- */
  function navItemHtml(n) {
    var children = Array.isArray(n.children) ? n.children.filter(function (c) { return c && c.label; }) : [];
    if (!children.length) {
      return '<a class="nav-link" href="' + attr(navHref(U, n.url || "/")) + '">' + esc(n.label) + "</a>";
    }
    var sub = children
      .map(function (c) { return '<a class="submenu-link" href="' + attr(navHref(U, c.url || "/")) + '">' + esc(c.label) + "</a>"; })
      .join("");
    return (
      '\n      <div class="nav-parent">' +
      '<a class="nav-link nav-link-parent" href="' + attr(navHref(U, n.url || "#")) + '">' + esc(n.label) + '<span class="caret" aria-hidden="true">▾</span></a>' +
      '<button class="submenu-toggle" type="button" aria-label="Buka submenu ' + attr(n.label) + '" aria-expanded="false">▾</button>' +
      '<div class="submenu">' + sub + "</div>" +
      "</div>"
    );
  }

  var navItems = (config.nav || []).map(navItemHtml).join("");

  // Tombol CTA header: teks & URL dapat diubah; bisa disembunyikan total.
  // Catatan: pada tampilan mobile, tombol ini disembunyikan via CSS (.nav-cta).
  var cta = data.headerCta.show
    ? '<a class="btn btn-primary nav-cta" href="' + attr(navHref(U, data.headerCta.url)) + '">' + esc(data.headerCta.text) + "</a>"
    : "";

  var brand = config.logo
    ? '<a href="' + attr(U.url("/")) + '" class="site-logo site-logo-img"><img src="' + attr(U.url(config.logo)) + '" alt="' + attr(config.title) + '"></a>'
    : '<a href="' + attr(U.url("/")) + '" class="site-logo">' + esc(config.title) + "</a>";

  return (
    topbar +
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

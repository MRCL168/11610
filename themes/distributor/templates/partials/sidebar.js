/* ============================================================
   partials/sidebar.js — Sticky sidebar info perusahaan (TEMA)
   Tampil di halaman SELAIN beranda (artikel/produk, halaman statis,
   arsip). Menampilkan ringkasan perusahaan, daftar kontak, tombol
   kontak utama, dan (opsional) daftar produk terbaru.

   Data dibaca dari Customizer (ctx.themeContent.sidebar / config.profile.sidebar).
   Dapat dimatikan total lewat `sidebar.enabled = false` di menu Sesuaikan.
   ============================================================ */

var contentMod = require("./content");
var source = contentMod.source;
var resolveContact = contentMod.resolveContact;
var navHref = contentMod.navHref;
var waLink = contentMod.waLink;
var digits = contentMod.digits;
var iconsMod = require("./icons");
var ui = iconsMod.ui;

function obj(v) { return v && typeof v === "object" && !Array.isArray(v) ? v : {}; }
function str(v) { return v == null ? "" : String(v); }

// Ambil & normalkan data sidebar. Mengembalikan null bila dinonaktifkan.
function getSidebarData(ctx) {
  var sb = obj(source(ctx).sidebar);
  if (sb.enabled === false) return null; // dimatikan dari Customizer
  var contact = resolveContact(ctx);
  var btn = obj(sb.button);
  return {
    title: str(sb.title) || str(ctx.config && ctx.config.title) || "Perusahaan Kami",
    logo: str(sb.logo),
    text: str(sb.text),
    address: str(sb.address || contact.address),
    phone: str(sb.phone || contact.phone),
    whatsapp: str(sb.whatsapp || contact.whatsapp),
    email: str(sb.email || contact.email),
    hours: str(sb.hours),
    button: { text: str(btn.text) || "Hubungi Sekarang", url: str(btn.url) },
    showRecent: sb.showRecent === true,
    recentCount: (parseInt(sb.recentCount, 10) || 4),
  };
}

// Apakah sidebar perlu dirender? (true bila tidak dimatikan)
function hasSidebar(ctx) { return !!getSidebarData(ctx); }

function contactList(d, ctx) {
  var lib = ctx.lib, esc = lib.esc, attr = lib.attr;
  var items = [];
  if (d.address) items.push('<li>' + ui("pin") + "<span>" + esc(d.address) + "</span></li>");
  if (d.phone) items.push('<li>' + ui("phone") + '<a href="tel:' + attr(digits(d.phone)) + '">' + esc(d.phone) + "</a></li>");
  if (d.whatsapp) items.push('<li>' + ui("whatsapp") + '<a href="' + attr(waLink(d.whatsapp, "Halo, saya ingin bertanya tentang produk Anda.")) + '" target="_blank" rel="noopener">' + esc(d.whatsapp) + "</a></li>");
  if (d.email) items.push('<li>' + ui("mail") + '<a href="mailto:' + attr(d.email) + '">' + esc(d.email) + "</a></li>");
  if (d.hours) items.push('<li>' + ui("clock") + "<span>" + esc(d.hours) + "</span></li>");
  return items.length ? '<ul class="side-contact">' + items.join("") + "</ul>" : "";
}

// Tentukan tombol kontak utama sidebar (URL kustom → WA → email → halaman).
function primaryButton(d, ctx) {
  var lib = ctx.lib, U = ctx.U, esc = lib.esc, attr = lib.attr;
  var href, ext = false, icon = ui("whatsapp");
  if (d.button.url) { href = navHref(U, d.button.url); ext = /^https?:/i.test(d.button.url); icon = ui("arrow"); }
  else if (d.whatsapp) { href = waLink(d.whatsapp, "Halo, saya ingin bertanya tentang produk Anda."); ext = true; icon = ui("whatsapp"); }
  else if (d.email) { href = "mailto:" + d.email; icon = ui("mail"); }
  else { href = U.url("/about/"); icon = ui("phone"); }
  var attrs = ext ? ' target="_blank" rel="noopener"' : "";
  return '<a class="btn btn-primary side-btn" href="' + attr(href) + '"' + attrs + ">" + icon + "<span>" + esc(d.button.text) + "</span></a>";
}

function recentCard(d, ctx) {
  if (!d.showRecent) return "";
  var lib = ctx.lib, U = ctx.U, esc = lib.esc, attr = lib.attr;
  var posts = ((ctx.site && ctx.site.recentPosts) || []).slice(0, d.recentCount);
  if (!posts.length) return "";
  var lis = posts.map(function (p) {
    var price = p.meta.price ? '<span class="side-recent-price">' + esc(p.meta.price) + "</span>" : "";
    return '<li><a href="' + attr(U.url(p.permalink)) + '"><span class="side-recent-title">' + esc(p.meta.title) + "</span>" + price + "</a></li>";
  }).join("");
  return '<div class="side-card"><h3 class="side-title">Produk Terbaru</h3><ul class="side-recent">' + lis + "</ul></div>";
}

// Render <aside> sidebar. Mengembalikan "" bila dinonaktifkan.
function render(ctx) {
  var d = getSidebarData(ctx);
  if (!d) return "";
  var lib = ctx.lib, U = ctx.U, esc = lib.esc, attr = lib.attr;

  var logo = d.logo
    ? '<div class="side-logo"><img src="' + attr(U.url(d.logo)) + '" alt="' + attr(d.title) + '"></div>'
    : "";
  var text = d.text ? '<p class="side-text">' + esc(d.text) + "</p>" : "";

  var companyCard =
    '<div class="side-card side-company">' +
    logo +
    '<h3 class="side-title">' + esc(d.title) + "</h3>" +
    text +
    contactList(d, ctx) +
    primaryButton(d, ctx) +
    "</div>";

  return '<aside class="page-sidebar">\n        ' + companyCard + recentCard(d, ctx) + "\n      </aside>";
}

module.exports = { getSidebarData: getSidebarData, hasSidebar: hasSidebar, render: render };

/* ============================================================
   partials/sidebar.js — Sidebar halaman selain beranda
   Isi sidebar dibaca dari data tema: sidebar.enabled + sidebar.blocks.
   ============================================================ */

var profileMod = require("./profile");
var getProfile = profileMod.getProfile;
var navHref = profileMod.navHref;
var socialLinks = require("./icons").socialLinks;

function arr(v) { return Array.isArray(v) ? v : []; }

function getSidebar(ctx) {
  var profile = getProfile(ctx);
  if (!profile.sidebar.enabled) return [];
  return arr(profile.sidebar.blocks).filter(function (b) { return b && typeof b === "object" && b.type; });
}

function block(b, ctx) {
  var config = ctx.config, U = ctx.U, lib = ctx.lib, site = ctx.site || {};
  var esc = lib.esc, attr = lib.attr;
  var type = String(b.type || "").toLowerCase();
  var title = b.title ? '<h3 class="side-title">' + esc(b.title) + '</h3>' : "";

  if (type === "text") {
    return '<div class="side-card">' + title + '<div class="side-text">' + (b.content || "") + '</div></div>';
  }
  if (type === "cta") {
    var btn = b.button && typeof b.button === "object" ? b.button : {};
    var text = b.text ? '<p class="side-text">' + esc(b.text) + '</p>' : "";
    var btnHtml = (btn.text || btn.url) ? '<a class="btn btn-primary side-btn" href="' + attr(navHref(U, btn.url || "#")) + '">' + esc(btn.text || "Hubungi Kami") + '</a>' : "";
    return '<div class="side-card side-cta">' + title + text + btnHtml + '</div>';
  }
  if (type === "links") {
    var items = arr(b.items).filter(function (it) { return it && it.label; });
    if (!items.length) return "";
    return '<div class="side-card">' + title + '<ul class="side-links">' + items.map(function (it) {
      return '<li><a href="' + attr(navHref(U, it.url || "/")) + '">' + esc(it.label) + '</a></li>';
    }).join("") + '</ul></div>';
  }
  if (type === "recent-posts") {
    var posts = (site.recentPosts || []).slice(0, parseInt(b.count, 10) || 4);
    if (!posts.length) return "";
    return '<div class="side-card">' + (title || '<h3 class="side-title">Artikel Terbaru</h3>') + '<ul class="side-links">' + posts.map(function (p) {
      return '<li><a href="' + attr(U.url(p.permalink)) + '">' + esc(p.meta.title) + '</a></li>';
    }).join("") + '</ul></div>';
  }
  if (type === "contact") {
    var profile = getProfile(ctx);
    var contact = profile.contact;
    var textBlock = b.text ? '<p class="side-text">' + esc(b.text) + '</p>' : '<p class="side-text">' + esc(contact.text) + '</p>';
    var action = contact.phone
      ? '<a class="btn btn-primary side-btn" href="https://wa.me/' + attr(contact.phone.replace(/\D/g, "")) + '">WhatsApp Kami</a>'
      : (contact.email ? '<a class="btn btn-primary side-btn" href="mailto:' + attr(contact.email) + '">Email Kami</a>' : "");
    return '<div class="side-card side-cta">' + (title || '<h3 class="side-title">Konsultasi Proyek</h3>') + textBlock + action + '</div>';
  }
  if (type === "image") {
    if (!b.src) return "";
    var img = '<img src="' + attr(U.url(b.src)) + '" alt="' + attr(b.alt || "") + '" loading="lazy">';
    if (b.link) img = '<a href="' + attr(navHref(U, b.link)) + '">' + img + '</a>';
    var cap = b.caption ? '<figcaption class="side-caption">' + esc(b.caption) + '</figcaption>' : "";
    return '<div class="side-card side-image-card">' + title + '<figure class="side-image">' + img + cap + '</figure></div>';
  }
  if (type === "social") {
    var links = socialLinks(config, lib);
    if (!links) return "";
    return '<div class="side-card">' + (title || '<h3 class="side-title">Ikuti Kami</h3>') + links + '</div>';
  }
  return "";
}

function render(ctx, blocks) {
  var list = blocks || getSidebar(ctx);
  if (!list.length) return "";
  var cards = list.map(function (b) { return block(b, ctx); }).filter(Boolean).join("\n        ");
  if (!cards) return "";
  return '<aside class="page-sidebar">\n        ' + cards + '\n      </aside>';
}

module.exports = { getSidebar: getSidebar, render: render };

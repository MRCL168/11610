/* ============================================================
   partials/sidebar.js — Sidebar halaman dalam (TEMA)
   Muncul di artikel, halaman statis, dan arsip.
   Isinya dibaca dari config.profile.sidebar (array blok).

   Tipe blok yang didukung:
     - text         : { title, content (HTML) }
     - cta          : { title, text, button{ text, url } }
     - links        : { title, items[ { label, url } ] }
     - recent-posts : { title, count }
     - categories   : { title }
     - contact      : { title, text }
     - image        : { src, alt, caption, link }
     - social       : { title }
   ============================================================ */

var iconsMod = require("./icons");
var socialLinks = iconsMod.socialLinks;

function navHref(U, url) {
  var u = String(url || "");
  if (!u) return "#";
  if (/^(https?:|mailto:|tel:|#)/i.test(u)) return u;
  return U.url(u);
}

function arr(v) { return Array.isArray(v) ? v : []; }

function getSidebar(ctx) {
  var config = ctx.config || {};
  var p = (config.profile && typeof config.profile === "object") ? config.profile : {};
  return arr(p.sidebar).filter(function (b) {
    return b && typeof b === "object" && b.type;
  });
}

function block(b, ctx) {
  var config = ctx.config, U = ctx.U, lib = ctx.lib, site = ctx.site || {};
  var esc = lib.esc, attr = lib.attr, slugify = lib.slugify;
  var type = String(b.type || "").toLowerCase();
  var title = b.title ? '<h3 class="side-title">' + esc(b.title) + "</h3>" : "";

  if (type === "text") {
    return '<div class="side-card">' + title + '<div class="side-text">' + (b.content || "") + "</div></div>";
  }

  if (type === "cta") {
    var btn = (b.button && typeof b.button === "object") ? b.button : {};
    var btnHtml = (btn.text || btn.url)
      ? '<a class="btn btn-primary side-btn" href="' + attr(navHref(U, btn.url || "#")) + '">' + esc(btn.text || "Selengkapnya") + "</a>"
      : "";
    var text = b.text ? '<p class="side-text">' + esc(b.text) + "</p>" : "";
    return '<div class="side-card side-cta">' + title + text + btnHtml + "</div>";
  }

  if (type === "links") {
    var items = arr(b.items).filter(function (it) { return it && it.label; });
    if (!items.length) return "";
    var lis = items.map(function (it) {
      return '<li><a href="' + attr(navHref(U, it.url || "/")) + '">' + esc(it.label) + "</a></li>";
    }).join("");
    return '<div class="side-card">' + title + '<ul class="side-links">' + lis + "</ul></div>";
  }

  if (type === "recent-posts") {
    var n = parseInt(b.count, 10) || 5;
    var posts = (site.recentPosts || []).slice(0, n);
    if (!posts.length) return "";
    var pl = posts.map(function (pp) {
      return '<li><a href="' + attr(U.url(pp.permalink)) + '">' + esc(pp.meta.title) + "</a></li>";
    }).join("");
    return '<div class="side-card">' + (title || '<h3 class="side-title">Artikel Terbaru</h3>') + '<ul class="side-links">' + pl + "</ul></div>";
  }

  if (type === "categories") {
    var cats = site.categoryNames || [];
    if (!cats.length) return "";
    var cl = cats.map(function (name) {
      return '<li><a href="' + attr(U.url("/category/" + slugify(name) + "/")) + '">' + esc(name) + "</a></li>";
    }).join("");
    return '<div class="side-card">' + (title || '<h3 class="side-title">Kategori</h3>') + '<ul class="side-links">' + cl + "</ul></div>";
  }

  if (type === "contact") {
    var social = config.social || {};
    var ctext = b.text ? '<p class="side-text">' + esc(b.text) + "</p>" : "";
    var action = social.email
      ? '<a class="btn btn-primary side-btn" href="mailto:' + attr(social.email) + '">Email Redaksi</a>'
      : '<a class="btn btn-primary side-btn" href="' + attr(U.url("/about/")) + '">Hubungi Kami</a>';
    return '<div class="side-card side-cta">' + (title || '<h3 class="side-title">Kontak</h3>') + ctext + action + "</div>";
  }

  if (type === "image") {
    if (!b.src) return "";
    var img = '<img src="' + attr(U.url(b.src)) + '" alt="' + attr(b.alt || "") + '" loading="lazy">';
    if (b.link) img = '<a href="' + attr(navHref(U, b.link)) + '">' + img + "</a>";
    var cap = b.caption ? '<figcaption class="side-caption">' + esc(b.caption) + "</figcaption>" : "";
    return '<div class="side-card side-image-card">' + title + '<figure class="side-image">' + img + cap + "</figure></div>";
  }

  if (type === "social") {
    var links = socialLinks(config, lib);
    if (!links) return "";
    return '<div class="side-card">' + (title || '<h3 class="side-title">Ikuti Kami</h3>') + links + "</div>";
  }

  return "";
}

function render(ctx, blocks) {
  var list = blocks || getSidebar(ctx);
  if (!list.length) return "";
  var cards = list.map(function (b) { return block(b, ctx); }).filter(Boolean).join("\n        ");
  if (!cards) return "";
  return '<aside class="page-sidebar">\n        ' + cards + "\n      </aside>";
}

module.exports = { getSidebar: getSidebar, render: render };

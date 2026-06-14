/* ============================================================
   partials/sidebar.js — Sidebar halaman dalam (TEMA)
   Muncul di semua halaman SELAIN beranda (artikel, halaman statis,
   arsip). Isinya dibaca dari Sesuaikan → Sidebar (ctx.themeContent
   .sidebar). Bila kosong, dipakai sidebar default bawaan GudangWEB.

   Tipe blok yang didukung:
     - tombol-kontak : { title, text, items[ { label, url } ] }
                       → daftar tombol kontak (ikon WA/telepon/email
                         terdeteksi otomatis dari URL).
     - text          : { title, content (HTML) }
     - cta           : { title, text, button{ text, url } }
     - links         : { title, items[ { label, url } ] }
     - recent-posts  : { title, count }
     - social        : { title }  (memakai config.social)
   ============================================================ */

var iconsMod = require("./icons");
var socialLinks = iconsMod.socialLinks;
var lineIcon = iconsMod.lineIcon;
var arrow = iconsMod.arrow;
var profileMod = require("./profile");
var navHref = profileMod.navHref;
var D = require("./defaults");

function arr(v) { return Array.isArray(v) ? v : []; }

// Ambil daftar blok sidebar (Customizer → fallback default GudangWEB).
function getSidebar(ctx) {
  var content = profileMod.getContent(ctx);
  var list = arr(content.sidebar).filter(function (b) {
    return b && typeof b === "object" && b.type;
  });
  if (!list.length) list = D.sidebar;
  return list;
}

// Pilih ikon tombol kontak berdasarkan pola URL.
function contactIcon(url) {
  var u = String(url || "").toLowerCase();
  if (u.indexOf("wa.me") >= 0 || u.indexOf("whatsapp") >= 0) return lineIcon("chat");
  if (/^tel:/.test(u)) return lineIcon("phone");
  if (/^mailto:/.test(u)) return lineIcon("mail");
  if (u.indexOf("maps.") >= 0 || u.indexOf("/maps") >= 0) return lineIcon("mapPin");
  return arrow();
}

function block(b, ctx) {
  var config = ctx.config, U = ctx.U, lib = ctx.lib, site = ctx.site || {};
  var esc = lib.esc, attr = lib.attr;
  var type = String(b.type || "").toLowerCase();
  var title = b.title ? '<h3 class="sb-title">' + esc(b.title) + "</h3>" : "";

  // ---- Widget: Tombol Kontak ----
  if (type === "tombol-kontak" || type === "tombol_kontak" || type === "contact-buttons") {
    var items = arr(b.items).filter(function (it) { return it && it.label; });
    var text = b.text ? '<p class="sb-text">' + esc(b.text) + "</p>" : "";
    var btns = items.map(function (it) {
      var url = it.url || "#";
      var external = /^https?:/i.test(url) && url.indexOf("wa.me") >= 0 || url.indexOf("maps.") >= 0;
      var rel = external ? ' target="_blank" rel="noopener"' : "";
      return (
        '<a class="sb-contact-btn" href="' + attr(navHref(U, url)) + '"' + rel + ">" +
        '<span class="sb-contact-ic">' + contactIcon(url) + "</span>" +
        '<span class="sb-contact-label">' + esc(it.label) + "</span>" +
        "</a>"
      );
    }).join("");
    var btnWrap = btns ? '<div class="sb-contact-list">' + btns + "</div>" : "";
    if (!text && !btnWrap) return "";
    return '<div class="sb-widget sb-contact">' + title + text + btnWrap + "</div>";
  }

  // ---- Teks / HTML ----
  if (type === "text") {
    if (!b.content) return "";
    return '<div class="sb-widget">' + title + '<div class="sb-text">' + b.content + "</div></div>";
  }

  // ---- Ajakan (CTA) ----
  if (type === "cta") {
    var btn = (b.button && typeof b.button === "object") ? b.button : {};
    var ctaText = b.text ? '<p class="sb-text">' + esc(b.text) + "</p>" : "";
    var ctaBtn = (btn.text || btn.url)
      ? '<a class="btn btn-primary sb-btn" href="' + attr(navHref(U, btn.url || "#")) + '">' + esc(btn.text || "Selengkapnya") + "</a>"
      : "";
    if (!ctaText && !ctaBtn) return "";
    return '<div class="sb-widget sb-cta">' + title + ctaText + ctaBtn + "</div>";
  }

  // ---- Daftar Tautan ----
  if (type === "links") {
    var li = arr(b.items).filter(function (it) { return it && it.label; });
    if (!li.length) return "";
    var lis = li.map(function (it) {
      return '<li><a href="' + attr(navHref(U, it.url || "/")) + '">' + esc(it.label) + "</a></li>";
    }).join("");
    return '<div class="sb-widget">' + title + '<ul class="sb-links">' + lis + "</ul></div>";
  }

  // ---- Artikel Terbaru ----
  if (type === "recent-posts") {
    var n = parseInt(b.count, 10) || 5;
    var posts = (site.recentPosts || []).slice(0, n);
    if (!posts.length) return "";
    var pl = posts.map(function (pp) {
      return '<li><a href="' + attr(U.url(pp.permalink)) + '">' + esc(pp.meta.title) + "</a></li>";
    }).join("");
    return '<div class="sb-widget">' + (title || '<h3 class="sb-title">Artikel Terbaru</h3>') + '<ul class="sb-links">' + pl + "</ul></div>";
  }

  // ---- Media Sosial ----
  if (type === "social") {
    var links = socialLinks(config, lib);
    if (!links) return "";
    return '<div class="sb-widget">' + (title || '<h3 class="sb-title">Ikuti Kami</h3>') + links + "</div>";
  }

  return "";
}

// Render <aside> sidebar dari daftar blok. Mengembalikan "" bila kosong.
function render(ctx, blocks) {
  var list = blocks || getSidebar(ctx);
  if (!list.length) return "";
  var cards = list.map(function (b) { return block(b, ctx); }).filter(Boolean).join("\n        ");
  if (!cards) return "";
  return '<aside class="sidebar" aria-label="Bilah sisi">\n        ' + cards + "\n      </aside>";
}

module.exports = { getSidebar: getSidebar, render: render };

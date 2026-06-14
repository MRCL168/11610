/* ============================================================
   partials/contact.js — Blok Kontak + Peta premium (TEMA)
   Merender SELURUH halaman kontak dari data Sesuaikan → Kontak &
   Peta (ctx.themeContent.contact): panel info berlatar gradien biru
   (alamat/telepon/WA/email/jam + media sosial + tombol Maps) dan
   embed peta menyatu di sisinya dalam satu kartu terangkat.

   Halaman kontak SENGAJA tidak menampilkan judul halaman, sidebar,
   atau isi markdown — semua kontennya bersumber dari Sesuaikan.
   Kontrak: hanya membaca data dari ctx — tanpa akses API/filesystem.
   ============================================================ */

var icons = require("./icons");
var socialLinks = require("./icons").socialLinks;

// Bangun HTML peta dari nilai mapEmbed milik pemilik situs (tepercaya).
// Dukung dua bentuk: kode <iframe> lengkap, atau sekadar URL embed.
function mapHtml(mapEmbed, lib) {
  var attr = lib.attr;
  var v = String(mapEmbed || "").trim();
  if (!v) return "";
  if (/<iframe[\s>]/i.test(v)) {
    // Kode embed lengkap dari Google Maps — sisipkan apa adanya.
    return '<div class="contact-map">' + v + "</div>";
  }
  if (/^https?:\/\//i.test(v)) {
    return '<div class="contact-map"><iframe src="' + attr(v) + '" title="Peta lokasi" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>';
  }
  return "";
}

function row(iconName, label, valueHtml, lib) {
  return (
    '<li class="contact-row">' +
    '<span class="contact-ic">' + icons.lineIcon(iconName) + "</span>" +
    '<span class="contact-row-body"><span class="contact-row-label">' + lib.esc(label) + "</span>" + valueHtml + "</span>" +
    "</li>"
  );
}

module.exports = function contactSection(ctx) {
  var config = ctx.config, U = ctx.U, lib = ctx.lib;
  var esc = lib.esc, attr = lib.attr;
  var profileMod = require("./profile");
  var profile = profileMod.getProfile(ctx);
  var c = profile.contact;

  var rows = [];
  if (c.address) rows.push(row("mapPin", "Alamat", "<span>" + esc(c.address) + "</span>", lib));
  if (c.phone) rows.push(row("phone", "Telepon", '<a href="tel:' + attr(c.phone.replace(/\s+/g, "")) + '">' + esc(c.phone) + "</a>", lib));
  if (c.whatsapp) {
    var wa = c.whatsapp.replace(/[^0-9]/g, "");
    rows.push(row("chat", "WhatsApp", '<a href="https://wa.me/' + attr(wa) + '" target="_blank" rel="noopener">' + esc(c.whatsapp) + "</a>", lib));
  }
  if (c.email) rows.push(row("mail", "Email", '<a href="mailto:' + attr(c.email) + '">' + esc(c.email) + "</a>", lib));
  if (c.hours) rows.push(row("clock", "Jam Operasional", "<span>" + esc(c.hours).replace(/\n/g, "<br>") + "</span>", lib));

  // Bila tak ada satupun data kontak & peta, jangan render seksi sama sekali.
  var map = mapHtml(c.mapEmbed, lib);
  if (!rows.length && !map) return "";

  var intro = c.intro ? '<p class="contact-intro">' + esc(c.intro) + "</p>" : "";
  var listHtml = rows.length ? '<ul class="contact-list">' + rows.join("") + "</ul>" : "";

  var social = socialLinks(config, lib);
  var socialHtml = social ? '<div class="contact-social">' + social + "</div>" : "";

  var mapsBtn = c.mapsUrl
    ? '<a class="btn btn-ghost contact-maps-btn" href="' + attr(c.mapsUrl) + '" target="_blank" rel="noopener">Buka di Google Maps ' + icons.arrow() + "</a>"
    : "";

  // Panel info (gradien biru, teks terang). Judul = H1 halaman kontak.
  var aside =
    '<div class="contact-aside">' +
    '<span class="eyebrow eyebrow-on-dark">' + esc(c.eyebrow) + "</span>" +
    '<h1 class="contact-title">' + esc(c.title) + "</h1>" +
    intro +
    listHtml +
    mapsBtn +
    socialHtml +
    "</div>";

  // Sisi peta (atau placeholder rapi bila peta belum diisi).
  var mapSide = map || '<div class="contact-map contact-map-empty"><span>' + icons.lineIcon("mapPin") + "</span></div>";

  return (
    '\n    <section class="contact-section" id="kontak">' +
    '\n      <div class="container">' +
    '\n        <div class="contact-card">' +
    "\n          " + aside +
    "\n          " + mapSide +
    "\n        </div>" +
    "\n      </div>" +
    "\n    </section>"
  );
};

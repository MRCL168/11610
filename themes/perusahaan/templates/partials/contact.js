/* ============================================================
   partials/contact.js — Blok Kontak + Peta (TEMA)
   Merender kartu informasi kontak (alamat/telepon/email/jam) dan
   embed peta dari data Sesuaikan → Kontak (ctx.themeContent.contact).
   Dipakai oleh halaman statis ber-template "kontak".
   Kontrak: hanya membaca data dari ctx — tanpa akses API/filesystem.
   ============================================================ */

var icons = require("./icons");

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
  var U = ctx.U, lib = ctx.lib;
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

  var intro = c.intro ? "<p>" + esc(c.intro) + "</p>" : "";
  var infoCard =
    '<div class="contact-info">' +
    '<span class="eyebrow">' + esc(c.eyebrow) + "</span>" +
    "<h2>" + esc(c.title) + "</h2>" +
    intro +
    (rows.length ? '<ul class="contact-list">' + rows.join("") + "</ul>" : "") +
    "</div>";

  var mapsLinkBtn = c.mapsUrl
    ? '<div class="contact-actions"><a class="btn btn-outline" href="' + attr(c.mapsUrl) + '" target="_blank" rel="noopener">Buka di Google Maps ' + icons.arrow() + "</a></div>"
    : "";

  return (
    '\n    <section class="section section-alt contact-section" id="kontak">' +
    '\n      <div class="container"><div class="contact-grid">' +
    "\n        " + infoCard + mapsLinkBtn +
    "\n        " + (map || "") +
    "\n      </div></div>" +
    "\n    </section>"
  );
};

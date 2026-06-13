/* ============================================================
   partials/icons.js — Ikon SVG (TEMA Pesantren)
   - socialLinks(config, lib): baris ikon media sosial.
   - lineIcon(name): ikon garis untuk kartu Program & Fasilitas.
   - arrow(): panah kecil untuk tautan "selengkapnya".
   - motif(): ornamen geometris Islami (dipakai sebagai tanda khas).
   Murni tampilan; menerima `lib` (esc/attr) agar tidak bergantung
   pada path inti mana pun.
   ============================================================ */

"use strict";

var SOCIAL = {
  facebook: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z"/></svg>',
  twitter: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>',
  email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
};

// Ikon garis (stroke = currentColor) untuk Program & Fasilitas.
// Bertema pesantren: mushaf, masjid, asrama, ilmu, dsb.
var LINE = {
  book: '<path d="M4 5a2 2 0 0 1 2-2h11a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6a2 2 0 0 0-2 2V5Z"/><path d="M9 7h6M9 11h6"/>',
  quran: '<path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H18a1 1 0 0 1 1 1v13.5"/><path d="M19 17.5a2.5 2.5 0 0 1-2.5 2.5H6.5A1.5 1.5 0 0 1 5 18.5v-14"/><path d="M12 7.5c-1.2 0-2 .9-2 2 0 1.4 2 3 2 3s2-1.6 2-3c0-1.1-.8-2-2-2Z"/>',
  mosque: '<path d="M12 2c1.6 1.6 2.6 2.8 2.6 4.2 0 1.3-1.1 2.3-2.6 2.3S9.4 7.5 9.4 6.2C9.4 4.8 10.4 3.6 12 2Z"/><path d="M4 21v-7a8 8 0 0 1 16 0v7"/><path d="M4 21h16M9 21v-4a3 3 0 0 1 6 0v4"/>',
  building: '<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2"/><path d="M10 21v-3h4v3"/>',
  bed: '<path d="M3 7v12M3 13h18a0 0 0 0 1 0 0v6M21 19v-5a3 3 0 0 0-3-3H9"/><circle cx="7" cy="10" r="1.6"/>',
  arabic: '<path d="M5 8c3 0 4 1 4 3s-1 3-4 3"/><path d="M19 8c-3 0-4 1-4 3s1 3 4 3"/><path d="M12 5v14"/>',
  flask: '<path d="M9 3h6M10 3v6l-5 8.5A2 2 0 0 0 6.7 21h10.6a2 2 0 0 0 1.7-3.5L14 9V3"/><path d="M8 15h8"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z"/>',
  users: '<path d="M16 19v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 19v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1A4 4 0 0 1 16 11"/>',
  heart: '<path d="M19 5.5a4 4 0 0 0-5.7 0L12 6.8l-1.3-1.3A4 4 0 1 0 5 11.2l7 7 7-7a4 4 0 0 0 0-5.7Z"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.5 7.5 8 9 4.5-1.5 8-4 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/>',
  star: '<path d="M12 3.5 14.6 9l6 .5-4.6 4 1.4 5.9L12 16.5 6.6 19.4 8 13.5 3.4 9.5l6-.5L12 3.5Z"/>',
  leaf: '<path d="M11 20a8 8 0 0 1-1-15c4 0 9 1 10 9-7 0-10 2-10 6Z"/><path d="M11 20c0-4 2-7 6-9"/>',
  pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  trophy: '<path d="M8 4h8v4a4 4 0 0 1-8 0V4Z"/><path d="M8 5H5v1a3 3 0 0 0 3 3M16 5h3v1a3 3 0 0 1-3 3"/><path d="M12 12v4M9 20h6M10 20v-2h4v2"/>',
  utensils: '<path d="M5 3v7a2 2 0 0 0 4 0V3M7 11v10M16 3c-1.5 0-2.5 2-2.5 5s1 4 2.5 4 2.5-1 2.5-4-1-5-2.5-5ZM16 16v5"/>',
};

function lineIcon(name) {
  var body = LINE[name] || LINE.star;
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + "</svg>";
}

function arrow() {
  return '<svg class="ic-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
}

// Ornamen bintang geometris 8-titik (rub el hizb) — tanda khas tema.
function motif() {
  return '<svg class="motif" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M12 2.5 14 6l4-1-1 4 3.5 2-3.5 2 1 4-4-1-2 3.5-2-3.5-4 1 1-4L2.5 12 6 10 5 6l4 1 3-4.5Z"/></svg>';
}

function socialLinks(config, lib) {
  var attr = lib.attr;
  var s = (config && config.social) || {};
  var items = [];
  if (s.facebook) items.push('<a href="' + attr(/^https?:/i.test(s.facebook) ? s.facebook : "https://facebook.com/" + s.facebook) + '" aria-label="Facebook" rel="me">' + SOCIAL.facebook + "</a>");
  if (s.instagram) items.push('<a href="https://instagram.com/' + attr(s.instagram) + '" aria-label="Instagram" rel="me">' + SOCIAL.instagram + "</a>");
  if (s.youtube) items.push('<a href="' + attr(/^https?:/i.test(s.youtube) ? s.youtube : "https://youtube.com/" + s.youtube) + '" aria-label="YouTube" rel="me">' + SOCIAL.youtube + "</a>");
  if (s.twitter) items.push('<a href="https://twitter.com/' + attr(s.twitter) + '" aria-label="Twitter / X" rel="me">' + SOCIAL.twitter + "</a>");
  if (s.linkedin) items.push('<a href="https://linkedin.com/company/' + attr(s.linkedin) + '" aria-label="LinkedIn" rel="me">' + SOCIAL.linkedin + "</a>");
  if (s.email) items.push('<a href="mailto:' + attr(s.email) + '" aria-label="Email">' + SOCIAL.email + "</a>");
  return items.length ? '<div class="social">' + items.join("") + "</div>" : "";
}

module.exports = { socialLinks: socialLinks, lineIcon: lineIcon, arrow: arrow, motif: motif };

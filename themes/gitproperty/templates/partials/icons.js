/* ============================================================
   partials/icons.js — Ikon SVG tema Gitproperty (TEMA)
   - propIcon(name): ikon garis untuk spesifikasi & fitur properti
     (kamar tidur, kamar mandi, luas bangunan, luas tanah, dll).
   - socialLinks(config, lib): baris ikon media sosial di footer.
   Murni tampilan; menerima `lib` (esc/attr dari core) agar tidak
   bergantung pada path core mana pun.
   ============================================================ */

/* ---------- Ikon media sosial ---------- */
var SOCIAL = {
  twitter: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11.01 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.08 24 18.09 24 12.07z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.12-2.12C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.53A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.12 2.12c1.88.53 9.38.53 9.38.53s7.5 0 9.38-.53a3 3 0 0 0 2.12-2.12A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6z"/></svg>',
  email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
};

/* ---------- Ikon garis properti (stroke = currentColor) ---------- */
var PROP = {
  /* Spesifikasi unit */
  bed: '<path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6"/><path d="M3 18v2M21 18v2"/><path d="M7 10V8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/>',
  bath: '<path d="M4 12V6a2 2 0 0 1 3.4-1.4L9 6"/><path d="M2 12h20v2a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4z"/><path d="M6 18l-1 3M19 18l1 3"/>',
  building: '<path d="M4 21V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v17"/><path d="M15 9h4a1 1 0 0 1 1 1v11"/><path d="M2 21h20"/><path d="M8 7h3M8 11h3M8 15h3"/>',
  land: '<path d="M3 20h18"/><path d="M5 20V9l7-5 7 5v11"/><path d="M9 20v-5h6v5"/>',
  car: '<path d="M5 13l1.5-4.5A2 2 0 0 1 8.4 7h7.2a2 2 0 0 1 1.9 1.5L19 13"/><path d="M4 13h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H7v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z"/><circle cx="7.5" cy="16" r="1"/><circle cx="16.5" cy="16" r="1"/>',
  cert: '<path d="M6 3h9l3 3v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><circle cx="11" cy="11" r="2.4"/><path d="M9.4 12.8 8 17l3-1.4L14 17l-1.4-4.2"/>',
  pin: '<path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
  tag: '<path d="M3 7v5.6a2 2 0 0 0 .6 1.4l7.4 7.4a2 2 0 0 0 2.8 0l5.6-5.6a2 2 0 0 0 0-2.8L12 5.6A2 2 0 0 0 10.6 5H5a2 2 0 0 0-2 2z"/><circle cx="7.5" cy="9.5" r="1.3"/>',
  key: '<circle cx="7.5" cy="14.5" r="4"/><path d="m10.5 11.5 9-9"/><path d="m16 5 3 3M14 7l2 2"/>',
  home: '<path d="m3 11 9-7 9 7"/><path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10"/><path d="M10 21v-6h4v6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  whatsapp: '<path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.86.5 3.6 1.36 5.1L2 22l5.2-1.5a9.8 9.8 0 0 0 4.84 1.27h.01c5.43 0 9.84-4.4 9.84-9.84C21.88 6.4 17.48 2 12.04 2z" fill="currentColor" stroke="none"/><path d="M9.2 7.3c-.18-.4-.36-.41-.53-.42h-.45c-.16 0-.4.06-.62.3-.21.24-.81.79-.81 1.93s.83 2.24.95 2.4c.12.16 1.6 2.57 3.96 3.5 1.96.77 2.36.62 2.79.58.42-.04 1.37-.56 1.56-1.1.19-.54.19-1 .14-1.1-.06-.1-.22-.16-.46-.28-.24-.12-1.37-.68-1.58-.76-.21-.08-.37-.12-.53.12-.16.24-.6.76-.74.92-.13.16-.27.18-.5.06-.24-.12-1-.37-1.9-1.18-.7-.62-1.18-1.4-1.31-1.64-.14-.24-.01-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.52-1.32-.74-1.8z" fill="#fff" stroke="none"/>',
  phone: '<path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L17 16l5 2v3a1 1 0 0 1-1 1A17 17 0 0 1 4 5a1 1 0 0 1 1-1z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  area: '<path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"/>',
  ruler: '<path d="M3 8.5 8.5 3 21 15.5 15.5 21z"/><path d="M7 7l1.5 1.5M10 10l1.5 1.5M13 13l1.5 1.5"/>',
  arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
};

/**
 * propIcon(name) → string SVG ikon garis.
 * Dipakai pada kartu & panel spesifikasi properti.
 */
function propIcon(name) {
  var body = PROP[name];
  if (!body) body = PROP.home;
  // whatsapp memakai fill penuh; sisanya stroke garis.
  if (name === "whatsapp") {
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + body + "</svg>";
  }
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + "</svg>";
}

/** Panah kecil untuk tautan "selengkapnya". */
function arrow() {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + PROP.arrow + "</svg>";
}

/** Baris ikon media sosial di footer (dibaca dari config.social). */
function socialLinks(config, lib) {
  var attr = lib.attr;
  var s = (config && config.social) || {};
  var items = [];
  if (s.twitter) items.push('<a href="https://twitter.com/' + attr(s.twitter) + '" aria-label="Twitter / X" rel="me">' + SOCIAL.twitter + "</a>");
  if (s.facebook) items.push('<a href="https://facebook.com/' + attr(s.facebook) + '" aria-label="Facebook" rel="me">' + SOCIAL.facebook + "</a>");
  if (s.instagram) items.push('<a href="https://instagram.com/' + attr(s.instagram) + '" aria-label="Instagram" rel="me">' + SOCIAL.instagram + "</a>");
  if (s.linkedin) items.push('<a href="https://linkedin.com/company/' + attr(s.linkedin) + '" aria-label="LinkedIn" rel="me">' + SOCIAL.linkedin + "</a>");
  if (s.youtube) items.push('<a href="https://youtube.com/' + attr(s.youtube) + '" aria-label="YouTube" rel="me">' + SOCIAL.youtube + "</a>");
  if (s.email) items.push('<a href="mailto:' + attr(s.email) + '" aria-label="Email">' + SOCIAL.email + "</a>");
  return items.length ? '<div class="social">' + items.join("") + "</div>" : "";
}

module.exports = { propIcon, arrow, socialLinks };

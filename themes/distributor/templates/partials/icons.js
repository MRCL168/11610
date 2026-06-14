/* ============================================================
   partials/icons.js — Ikon SVG (TEMA)
   - featureIcon(name): ikon garis untuk kartu keunggulan/fitur.
   - ui(name): ikon kecil untuk UI (whatsapp, telepon, email, pin, dll).
   - socialLinks(config, lib): baris ikon media sosial di footer.
   Murni tampilan; menerima `lib` (esc/attr) agar tidak bergantung
   pada path inti mana pun.
   ============================================================ */

/* ---------- Ikon fitur (stroke = currentColor) ----------
   Relevan untuk distributor: pengiriman, stok, kualitas, dukungan, dll. */
var FEATURE = {
  box: '<path d="m21 16-9 5-9-5V8l9-5 9 5v8Z"/><path d="m3 8 9 5 9-5"/><path d="M12 13v8"/>',
  truck: '<path d="M3 6h11v9H3z"/><path d="M14 9h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17.5" cy="18" r="1.6"/>',
  warehouse: '<path d="M3 21V8l9-4 9 4v13"/><path d="M7 21v-7h10v7"/><path d="M7 17h10"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.5 7.5 8 9 4.5-1.5 8-4 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/>',
  tag: '<path d="M3 12V4h8l9 9-7 7-9-9Z"/><circle cx="7.5" cy="7.5" r="1.4"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z"/>',
  headset: '<path d="M4 13a8 8 0 0 1 16 0"/><path d="M4 13v3a2 2 0 0 0 2 2h1v-5H6a2 2 0 0 0-2 2Z"/><path d="M20 13v3a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2Z"/><path d="M18 18v1a3 3 0 0 1-3 3h-3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  handshake: '<path d="m11 17 2 2a1.5 1.5 0 0 0 2-2"/><path d="m13 15 2.5 2.5a1.5 1.5 0 0 0 2-2L14 12"/><path d="M3 8l4-3 5 4 3-1 6 4v5l-4 1-4-3"/><path d="M3 8v6l4 2"/>',
  rocket: '<path d="M5 15c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2 0-2.8a2 2 0 0 0-3 0Z"/><path d="M9 14c4-7 8-9 12-9 0 4-2 8-9 12l-3-3Z"/><path d="m9 11 4 4"/>',
  layers: '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  star: '<path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9L12 3Z"/>',
  coins: '<ellipse cx="9" cy="6" rx="6" ry="3"/><path d="M3 6v6c0 1.7 2.7 3 6 3s6-1.3 6-3V6"/><path d="M15 12c0 1.7 2.7 3 6 3"/><path d="M9 15v3c0 1.7 2.7 3 6 3s6-1.3 6-3v-6"/>',
};

function featureIcon(name) {
  var body = FEATURE[name] || FEATURE.box;
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + "</svg>";
}

/* ---------- Ikon UI kecil ---------- */
var UI = {
  whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M.5 23.5l1.6-5.9A11.4 11.4 0 1 1 12 23.4a11.4 11.4 0 0 1-5.5-1.4L.5 23.5Zm6.3-3.7.4.2a9.5 9.5 0 1 0-3.3-3.3l.2.4-1 3.6 3.7-.9ZM17.4 14c-.1-.2-.5-.3-1-.6s-1.4-.7-1.6-.8-.4-.1-.5.1-.6.8-.8 1-.3.2-.5.1a7.8 7.8 0 0 1-2.3-1.4 8.6 8.6 0 0 1-1.6-2c-.2-.3 0-.4.1-.6l.4-.4.3-.4a.5.5 0 0 0 0-.5l-.7-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2A5 5 0 0 0 7.3 12a11.4 11.4 0 0 0 4.4 3.9c.6.2 1.1.4 1.5.5a3.6 3.6 0 0 0 1.6.1c.5-.1 1.4-.6 1.6-1.1s.2-1 .1-1.1Z"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
};

function ui(name) { return UI[name] || ""; }

/* ---------- Ikon media sosial (footer) ---------- */
var SOCIAL = {
  twitter: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>',
  github: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z"/></svg>',
  email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
};

function socialLinks(config, lib) {
  var attr = lib.attr;
  var s = (config && config.social) || {};
  var items = [];
  if (s.twitter) items.push('<a href="https://twitter.com/' + attr(s.twitter) + '" aria-label="Twitter / X" rel="me">' + SOCIAL.twitter + "</a>");
  if (s.facebook) items.push('<a href="https://facebook.com/' + attr(s.facebook) + '" aria-label="Facebook" rel="me">' + SOCIAL.facebook + "</a>");
  if (s.instagram) items.push('<a href="https://instagram.com/' + attr(s.instagram) + '" aria-label="Instagram" rel="me">' + SOCIAL.instagram + "</a>");
  if (s.linkedin) items.push('<a href="https://linkedin.com/company/' + attr(s.linkedin) + '" aria-label="LinkedIn" rel="me">' + SOCIAL.linkedin + "</a>");
  if (s.github) items.push('<a href="https://github.com/' + attr(s.github) + '" aria-label="GitHub" rel="me">' + SOCIAL.github + "</a>");
  if (s.email) items.push('<a href="mailto:' + attr(s.email) + '" aria-label="Email">' + SOCIAL.email + "</a>");
  return items.length ? '<div class="social">' + items.join("") + "</div>" : "";
}

module.exports = { featureIcon: featureIcon, ui: ui, socialLinks: socialLinks };

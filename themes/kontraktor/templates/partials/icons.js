/* ============================================================
   partials/icons.js — Ikon SVG tema Kontraktor
   Ikon hanya untuk tampilan, tidak mengambil data dari luar ctx.
   ============================================================ */

function icon(name) {
  var I = {
    helmet: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13a8 8 0 0 1 16 0v2h1.2a1 1 0 0 1 0 2H2.8a1 1 0 0 1 0-2H4v-2Zm3.2 2h9.6v-2a4.8 4.8 0 0 0-9.6 0v2Zm2-8.6v4.1h1.8V5.8a6.3 6.3 0 0 0-1.8.6Zm3.8-.6v4.7h1.8V6.4a6.3 6.3 0 0 0-1.8-.6Z" fill="currentColor"/></svg>',
    plan: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h10l4 4v14H5V3Zm9 1.8V8h3.2L14 4.8ZM7 6v13h10V10h-5V6H7Zm2 6h6v1.6H9V12Zm0 3h6v1.6H9V15Z" fill="currentColor"/></svg>',
    building: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21V8l8-5 8 5v13h-6v-6h-4v6H4Zm2-2h2v-6h8v6h2V9.1l-6-3.8-6 3.8V19Zm3-9h2v2H9v-2Zm4 0h2v2h-2v-2Z" fill="currentColor"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9.4 16.8-4-4 1.4-1.4 2.6 2.6 7.8-7.8 1.4 1.4-9.2 9.2Z" fill="currentColor"/></svg>',
    clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20Zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm1-8.4 3.3 2-.9 1.5L11 12.5V7h2v4.6Z" fill="currentColor"/></svg>',
    shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22C7.6 20.7 5 16.8 5 12V5l7-3 7 3v7c0 4.8-2.6 8.7-7 10Zm0-2.1c3.2-1.2 5-4.2 5-7.9V6.3l-5-2.1-5 2.1V12c0 3.7 1.8 6.7 5 7.9Zm-.7-5 4.2-4.2-1.4-1.4-2.8 2.8-1.3-1.3-1.4 1.4 2.7 2.7Z" fill="currentColor"/></svg>',
    tools: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21 19.6-1.4 1.4-6.1-6.1-2.1 2.1.7.7-1.4 1.4-5.8-5.8 1.4-1.4.7.7 5.8-5.8-.7-.7 1.4-1.4 5.8 5.8-1.4 1.4-.7-.7-2.1 2.1 6.1 6.3ZM5.6 4.6l4.2 4.2-1.4 1.4-4.2-4.2V4.6h1.4Z" fill="currentColor"/></svg>',
    team: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm8-1a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm0-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM2 21v-2a6 6 0 0 1 12 0v2H2Zm2-2h8a4 4 0 0 0-8 0Zm10.7 2a7.8 7.8 0 0 0-1.3-4.2A4.5 4.5 0 0 1 22 18.5V21h-7.3Z" fill="currentColor"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.2 5.3 20 12l-6.8 6.7-1.4-1.4 4.4-4.3H4v-2h12.2l-4.4-4.3 1.4-1.4Z" fill="currentColor"/></svg>'
  };
  return I[name] || I.helmet;
}

function featureIcon(name) { return icon(name); }
function arrow() { return icon("arrow"); }

function socialLinks(config, lib) {
  var social = (config && config.social) || {};
  var esc = lib.esc, attr = lib.attr;
  var items = [];
  function add(label, url) {
    if (!url) return;
    items.push('<a href="' + attr(url) + '" target="_blank" rel="noopener">' + esc(label) + '</a>');
  }
  add("Instagram", social.instagram);
  add("LinkedIn", social.linkedin);
  add("Twitter", social.twitter);
  add("GitHub", social.github && social.github.indexOf("http") === 0 ? social.github : (social.github ? "https://github.com/" + social.github : ""));
  if (social.email) items.push('<a href="mailto:' + attr(social.email) + '">Email</a>');
  return items.length ? '<div class="social-links">' + items.join("") + '</div>' : "";
}

module.exports = { featureIcon: featureIcon, arrow: arrow, socialLinks: socialLinks };

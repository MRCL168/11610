/* ============================================================
   templates/page.js — Halaman statis (TEMA)
   ctx: { config, U, lib, site, seo, themeVars, page }
   ============================================================ */

var layout = require("./partials/layout");

module.exports = function page(ctx) {
  var U = ctx.U, lib = ctx.lib, page = ctx.page;
  var esc = lib.esc, attr = lib.attr;

  var content =
    '\n    <article class="post">' +
    '\n      <div class="container post-narrow">' +
    '\n        <nav class="breadcrumb"><a href="' + attr(U.url("/")) + '">Beranda</a> <span>›</span> <span>' + esc(page.meta.title) + "</span></nav>" +
    '\n        <header class="post-header">' +
    '\n          <h1 class="post-title">' + esc(page.meta.title) + "</h1>" +
    "\n        </header>" +
    '\n        <div class="post-content">\n' + page.html + "\n        </div>" +
    "\n        " + ((ctx.plugins && ctx.plugins.contentAfter) ? ctx.plugins.contentAfter(ctx) : "") +
    "\n      </div>" +
    "\n    </article>";

  return layout(ctx, content);
};

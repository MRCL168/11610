/* ============================================================
   templates/page.js — Halaman statis (TEMA Gitproperty)
   ctx: { config, U, lib, site, seo, themeVars, page }
   ============================================================ */

var layout = require("./partials/layout");

module.exports = function page(ctx) {
  var lib = ctx.lib, pg = ctx.page;
  var esc = lib.esc;

  var lead = pg.meta.excerpt
    ? '\n          <p class="page-lead">' + esc(pg.meta.excerpt) + "</p>"
    : "";

  var content =
    '\n    <section class="page-head">' +
    '\n      <div class="container">' +
    '\n        <span class="page-head-kicker">Halaman</span>' +
    "\n        <h1>" + esc(pg.meta.title) + "</h1>" +
    lead +
    "\n      </div>" +
    "\n    </section>" +
    '\n    <article class="post"><div class="container post-narrow">' +
    '\n      <div class="post-content">\n' + pg.html + "\n      </div>" +
    "\n      " + ((ctx.plugins && ctx.plugins.contentAfter) ? ctx.plugins.contentAfter(ctx) : "") +
    "\n    </div></article>";

  return layout(ctx, content);
};

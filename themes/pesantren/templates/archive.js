/* ============================================================
   templates/archive.js — Arsip kategori / tag (TEMA Pesantren)
   Kepala arsip lebar penuh, lalu grid artikel + bilah sisi.
   ctx: { config, U, lib, site, seo, themeVars, kind, term, posts, description }
   ============================================================ */

"use strict";

var layout = require("./partials/layout");
var postCard = require("./partials/post-card");
var getProfile = require("./partials/profile").getProfile;
var sidebarMod = require("./partials/sidebar");

module.exports = function archive(ctx) {
  var lib = ctx.lib, kind = ctx.kind, term = ctx.term, posts = ctx.posts || [], description = ctx.description;
  var esc = lib.esc;

  var label = kind === "category" ? "Kategori" : "Tag";
  var cards = posts.map(function (p) { return postCard(p, ctx); }).join("");
  var hasDesc = description && String(description).trim();
  var intro = hasDesc ? "<p>" + esc(description) + "</p>" : "<p>" + posts.length + " artikel</p>";

  var grid = '<div class="post-grid post-grid-sidebar">' + cards + "</div>";

  var profile = getProfile(ctx);
  var sidebar = sidebarMod.renderSidebar(ctx, profile);

  var bodySection;
  if (sidebar) {
    var layoutClass = "content-layout" + (profile.sidebar.position === "kiri" ? " content-layout--left" : "");
    bodySection =
      '\n    <section class="sect"><div class="container">' +
      '\n      <div class="' + layoutClass + '">' +
      '\n        <main class="content-main">' + grid + "</main>" +
      sidebar +
      "\n      </div>" +
      "\n    </div></section>";
  } else {
    bodySection =
      '\n    <section class="sect"><div class="container">' +
      '<div class="post-grid">' + cards + "</div>" +
      "</div></section>";
  }

  var content =
    '\n    <section class="page-head"><div class="container">' +
    '<span class="page-head-kicker">' + label + "</span>" +
    "<h1>" + esc(term) + "</h1>" + intro +
    "</div></section>" +
    bodySection;

  return layout(ctx, content);
};

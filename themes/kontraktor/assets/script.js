/* ============================================================
   themes/kontraktor/assets/script.js — Interaksi tema Kontraktor
   Hamburger mobile, submenu accordion, dan status header saat scroll.
   ============================================================ */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("site-nav");

  if (header) {
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function closeNav() {
    if (!nav) return;
    nav.classList.remove("open");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.classList.remove("is-active");
    }
    document.body.classList.remove("nav-open");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.classList.toggle("is-active", open);
      document.body.classList.toggle("nav-open", open);
    });

    nav.addEventListener("click", function (e) {
      var link = e.target.closest("a.nav-link, a.submenu-link, a.nav-cta");
      if (link && !link.classList.contains("nav-link-parent") && nav.classList.contains("open")) closeNav();
    });
  }

  var subToggles = document.querySelectorAll(".submenu-toggle");
  for (var i = 0; i < subToggles.length; i++) {
    subToggles[i].addEventListener("click", function (e) {
      e.preventDefault();
      var parent = this.closest(".nav-parent");
      if (!parent) return;
      var open = parent.classList.toggle("submenu-open");
      this.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var mq = window.matchMedia("(min-width: 901px)");
  function onChange() {
    if (!mq.matches) return;
    closeNav();
    var openSub = document.querySelectorAll(".nav-parent.submenu-open");
    for (var j = 0; j < openSub.length; j++) openSub[j].classList.remove("submenu-open");
  }
  if (mq.addEventListener) mq.addEventListener("change", onChange);
  else if (mq.addListener) mq.addListener(onChange);

  document.addEventListener("click", function (e) {
    if (!nav || !nav.classList.contains("open")) return;
    if (e.target.closest("#nav-toggle")) return;
    if (e.target.closest("#site-nav")) return;
    closeNav();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav && nav.classList.contains("open")) closeNav();
  });
})();

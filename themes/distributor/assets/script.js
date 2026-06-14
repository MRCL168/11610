/* ============================================================
   themes/distributor/assets/script.js
   Interaksi sisi-klien tema "Distributor":
   - Drawer navigasi mobile (geser dari kanan) + scrim.
   - Submenu accordion pada tampilan mobile.
   - State "scrolled" pada header saat halaman digulir.
   - Tutup drawer via klik di luar / tombol Escape.
   - Slider hero (fade) dengan autoplay & navigasi titik.
   Semua progressive-enhancement: tanpa JS, situs tetap terbaca.
   ============================================================ */
(function () {
  "use strict";

  var body = document.body;
  var header = document.querySelector(".site-header");
  var navToggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("site-nav");

  /* ---------- Drawer navigasi mobile ---------- */
  function openNav() {
    if (!nav) return;
    nav.classList.add("open");
    body.classList.add("nav-open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "true");
  }
  function closeNav() {
    if (!nav) return;
    nav.classList.remove("open");
    body.classList.remove("nav-open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
  }
  function toggleNav() {
    if (nav && nav.classList.contains("open")) closeNav();
    else openNav();
  }

  if (navToggle) {
    navToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleNav();
    });
  }

  /* Klik di luar drawer menutupnya (saat terbuka, mode mobile). */
  document.addEventListener("click", function (e) {
    if (!nav || !nav.classList.contains("open")) return;
    if (nav.contains(e.target) || (navToggle && navToggle.contains(e.target))) return;
    closeNav();
  });

  /* Tombol Escape menutup drawer. */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.keyCode === 27) closeNav();
  });

  /* ---------- Submenu accordion (mobile) ---------- */
  var subToggles = document.querySelectorAll(".submenu-toggle");
  Array.prototype.forEach.call(subToggles, function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var parent = btn.closest(".nav-parent");
      if (!parent) return;
      var isOpen = parent.classList.toggle("submenu-open");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  });

  /* ---------- Reset state ketika kembali ke layar lebar ---------- */
  var mqDesktop = window.matchMedia("(min-width: 861px)");
  function handleMq(e) {
    if (e.matches) {
      closeNav();
      Array.prototype.forEach.call(document.querySelectorAll(".nav-parent.submenu-open"), function (p) {
        p.classList.remove("submenu-open");
        var t = p.querySelector(".submenu-toggle");
        if (t) t.setAttribute("aria-expanded", "false");
      });
    }
  }
  if (mqDesktop.addEventListener) mqDesktop.addEventListener("change", handleMq);
  else if (mqDesktop.addListener) mqDesktop.addListener(handleMq);

  /* ---------- Header "scrolled" ---------- */
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 8) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Slider hero ---------- */
  function initHeroSlider() {
    var hero = document.querySelector(".hero.has-slider");
    if (!hero) return;
    var slides = hero.querySelectorAll(".hero-slide");
    var dots = hero.querySelectorAll(".hero-dot");
    if (slides.length < 2) return; // tidak perlu logika bila satu slide

    var idx = 0;
    var timer = null;
    var autoplay = hero.getAttribute("data-autoplay") === "1";
    var interval = parseInt(hero.getAttribute("data-interval"), 10) || 5000;
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function show(n) {
      idx = (n + slides.length) % slides.length;
      Array.prototype.forEach.call(slides, function (s, i) {
        s.classList.toggle("is-active", i === idx);
      });
      Array.prototype.forEach.call(dots, function (d, i) {
        d.classList.toggle("is-active", i === idx);
        d.setAttribute("aria-selected", i === idx ? "true" : "false");
      });
    }
    function next() { show(idx + 1); }

    function start() {
      if (!autoplay || reduceMotion) return;
      stop();
      timer = window.setInterval(next, interval);
    }
    function stop() {
      if (timer) { window.clearInterval(timer); timer = null; }
    }

    Array.prototype.forEach.call(dots, function (d, i) {
      d.addEventListener("click", function () {
        show(i);
        start(); // mulai ulang hitungan setelah interaksi
      });
    });

    /* Hentikan autoplay saat tab tidak aktif; lanjutkan saat kembali. */
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else start();
    });

    /* Jeda saat kursor di atas hero (aksesibilitas & kontrol). */
    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);

    show(0);
    start();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeroSlider);
  } else {
    initHeroSlider();
  }
})();

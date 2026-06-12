/* ============================================================
   themes/perusahaan/assets/script.js — Interaksi tema Perusahaan
   1) Hero slider: autoplay, dots, panah, geser (swipe), jeda saat
      hover/fokus, hormati prefers-reduced-motion.
   2) Header: status "scrolled" + drawer navigasi mobile (geser kanan)
      dengan submenu accordion, scrim, Escape, dan reset ke desktop.
   Vanilla JS, tanpa dependensi.
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ============================================================
     1) HERO SLIDER
     ============================================================ */
  (function initSlider() {
    var slider = document.querySelector(".hero-slider");
    if (!slider) return;

    var slides = Array.prototype.slice.call(slider.querySelectorAll(".slide"));
    var dots = Array.prototype.slice.call(slider.querySelectorAll(".slider-dot"));
    var prevBtn = slider.querySelector(".slider-prev");
    var nextBtn = slider.querySelector(".slider-next");
    if (slides.length < 2) return; // satu slide: tidak perlu kontrol

    var index = 0;
    var timer = null;
    var autoplay = slider.getAttribute("data-autoplay") === "true" && !reduceMotion;
    var interval = parseInt(slider.getAttribute("data-interval"), 10) || 6000;

    function show(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) {
        var active = n === index;
        s.classList.toggle("is-active", active);
        if (active) s.removeAttribute("aria-hidden");
        else s.setAttribute("aria-hidden", "true");
      });
      dots.forEach(function (d, n) {
        var active = n === index;
        d.classList.toggle("is-active", active);
        d.setAttribute("aria-selected", active ? "true" : "false");
      });
    }

    function next() { show(index + 1); }
    function prev() { show(index - 1); }

    function start() {
      if (!autoplay) return;
      stop();
      timer = window.setInterval(next, interval);
    }
    function stop() {
      if (timer) { window.clearInterval(timer); timer = null; }
    }
    function restart() { stop(); start(); }

    if (nextBtn) nextBtn.addEventListener("click", function () { next(); restart(); });
    if (prevBtn) prevBtn.addEventListener("click", function () { prev(); restart(); });
    dots.forEach(function (d) {
      d.addEventListener("click", function () {
        var to = parseInt(d.getAttribute("data-goto"), 10) || 0;
        show(to); restart();
      });
    });

    // Jeda autoplay saat hover / fokus, lanjut saat keluar.
    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
    slider.addEventListener("focusin", stop);
    slider.addEventListener("focusout", start);

    // Jeda saat tab tidak terlihat (hemat resource & sinkron).
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop(); else start();
    });

    // Navigasi keyboard panah kiri/kanan saat slider difokuskan.
    slider.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { next(); restart(); }
      else if (e.key === "ArrowLeft") { prev(); restart(); }
    });

    // Geser (swipe) di perangkat sentuh.
    var startX = 0, startY = 0, swiping = false;
    slider.addEventListener("touchstart", function (e) {
      var t = e.changedTouches[0];
      startX = t.clientX; startY = t.clientY; swiping = true;
    }, { passive: true });
    slider.addEventListener("touchend", function (e) {
      if (!swiping) return;
      swiping = false;
      var t = e.changedTouches[0];
      var dx = t.clientX - startX;
      var dy = t.clientY - startY;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) next(); else prev();
        restart();
      }
    }, { passive: true });

    show(0);
    start();
  })();

  /* ============================================================
     2) HEADER + DRAWER NAVIGASI
     ============================================================ */
  var header = document.querySelector(".site-header");
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("site-nav");

  /* ---- Header: status "scrolled" ---- */
  if (header) {
    var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Drawer navigasi (mobile) ---- */
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

    // Klik tautan biasa di dalam drawer → tutup drawer.
    nav.addEventListener("click", function (e) {
      var link = e.target.closest("a.nav-link, a.submenu-link, a.nav-cta");
      if (link && !link.classList.contains("nav-link-parent") && nav.classList.contains("open")) {
        closeNav();
      }
    });
  }

  /* ---- Submenu accordion (mobile) ---- */
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

  /* ---- Reset saat layar membesar ke desktop ---- */
  var mq = window.matchMedia("(min-width: 881px)");
  function onChange() {
    if (mq.matches) {
      closeNav();
      var openSub = document.querySelectorAll(".nav-parent.submenu-open");
      for (var j = 0; j < openSub.length; j++) openSub[j].classList.remove("submenu-open");
    }
  }
  if (mq.addEventListener) mq.addEventListener("change", onChange);
  else if (mq.addListener) mq.addListener(onChange);

  /* ---- Klik di luar drawer (scrim) → tutup ---- */
  document.addEventListener("click", function (e) {
    if (!nav || !nav.classList.contains("open")) return;
    if (e.target.closest("#nav-toggle")) return;
    if (e.target.closest("#site-nav")) return;
    closeNav();
  });

  /* ---- Escape menutup drawer ---- */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav && nav.classList.contains("open")) closeNav();
  });
})();

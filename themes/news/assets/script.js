/* ============================================================
   themes/news/assets/script.js — Interaksi tema News
   - Header: class "scrolled" saat di-scroll.
   - Hamburger: buka/tutup drawer navigasi di mobile.
   - Submenu: hover desktop, accordion mobile.
   - Ticker: duplikasi konten untuk loop tanpa batas.
   ============================================================ */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var toggle = document.getElementById("nav-toggle");
  var nav    = document.getElementById("site-nav");

  /* ---- Header: status "scrolled" ---- */
  if (header) {
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 8);
    };
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

    nav.addEventListener("click", function (e) {
      var link = e.target.closest("a.nav-link, a.submenu-link");
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

  /* ---- Reset submenu saat layar membesar ke desktop ---- */
  var mq = window.matchMedia("(min-width: 861px)");
  function onMqChange() {
    if (mq.matches) {
      closeNav();
      var openSub = document.querySelectorAll(".nav-parent.submenu-open");
      for (var j = 0; j < openSub.length; j++) openSub[j].classList.remove("submenu-open");
    }
  }
  if (mq.addEventListener) mq.addEventListener("change", onMqChange);
  else if (mq.addListener) mq.addListener(onMqChange);

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

  /* ---- Breaking news ticker: duplikasi untuk loop mulus ---- */
  var track = document.getElementById("ticker-track");
  if (track && track.children.length) {
    // Salin isi untuk scroll loop tanpa batas (animasi berakhir di -50%)
    var original = track.innerHTML;
    track.innerHTML = original + original;
  }

  /* ---- FAQ accordion (jika plugin FAQ aktif) ---- */
  var faqItems = document.querySelectorAll(".faq-item");
  for (var f = 0; f < faqItems.length; f++) {
    faqItems[f].addEventListener("toggle", function () {
      if (!this.open) return;
      for (var m = 0; m < faqItems.length; m++) {
        if (faqItems[m] !== this && faqItems[m].open) faqItems[m].open = false;
      }
    });
  }
})();

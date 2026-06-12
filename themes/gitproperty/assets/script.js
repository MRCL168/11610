/* ============================================================
   themes/gitproperty/assets/script.js — Interaksi tema Gitproperty
   - Hamburger membuka/menutup drawer navigasi di mobile.
   - Submenu: hover di desktop (CSS), accordion di mobile.
   - Header mendapat garis + bayangan halus saat di-scroll.
   - Pencarian properti: filter kartu sisi-klien (tipe, status,
     lokasi, harga maks, kamar tidur, kata kunci) + "Tampilkan Semua".
   - Galeri detail: klik thumbnail mengganti gambar utama.
   ============================================================ */
(function () {
  "use strict";

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
    nav.addEventListener("click", function (e) {
      var link = e.target.closest("a.nav-link, a.submenu-link, a.nav-cta");
      if (link && !link.classList.contains("nav-link-parent") && nav.classList.contains("open")) closeNav();
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
  var mq = window.matchMedia("(min-width: 861px)");
  function onChange() {
    if (mq.matches) {
      closeNav();
      var openSub = document.querySelectorAll(".nav-parent.submenu-open");
      for (var j = 0; j < openSub.length; j++) openSub[j].classList.remove("submenu-open");
    }
  }
  if (mq.addEventListener) mq.addEventListener("change", onChange);
  else if (mq.addListener) mq.addListener(onChange);

  /* ---- Klik di luar drawer → tutup ---- */
  document.addEventListener("click", function (e) {
    if (!nav || !nav.classList.contains("open")) return;
    if (e.target.closest("#nav-toggle")) return;
    if (e.target.closest("#site-nav")) return;
    closeNav();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav && nav.classList.contains("open")) closeNav();
  });

  /* ============================================================
     Pencarian properti (filter kartu sisi-klien)
     ============================================================ */
  var form = document.getElementById("prop-search");
  var pool = document.getElementById("prop-pool");

  if (pool) {
    var cards = Array.prototype.slice.call(pool.querySelectorAll(".prop-card"));
    var initial = parseInt(pool.getAttribute("data-initial"), 10) || cards.length;
    var emptyMsg = document.getElementById("prop-empty");
    var moreBtn = document.getElementById("prop-more");
    var showAll = false;

    var fQ = document.getElementById("ps-q");
    var fType = document.getElementById("ps-type");
    var fListing = document.getElementById("ps-listing");
    var fLokasi = document.getElementById("ps-lokasi");
    var fPrice = document.getElementById("ps-price");
    var fBeds = document.getElementById("ps-beds");
    var resetBtn = document.getElementById("ps-reset");

    function val(el) { return el ? String(el.value || "").trim().toLowerCase() : ""; }

    function matchCard(card) {
      var q = val(fQ);
      if (q) {
        var hay = (card.getAttribute("data-title") || "") + " " + (card.getAttribute("data-lokasi") || "");
        if (hay.indexOf(q) === -1) return false;
      }
      var type = val(fType);
      if (type && (card.getAttribute("data-type") || "") !== type) return false;
      var listing = val(fListing);
      if (listing && (card.getAttribute("data-listing") || "") !== listing) return false;
      var lokasi = val(fLokasi);
      if (lokasi && (card.getAttribute("data-lokasi") || "") !== lokasi) return false;
      var price = parseInt(val(fPrice), 10);
      if (price) {
        var cp = parseInt(card.getAttribute("data-price"), 10) || 0;
        if (cp <= 0 || cp > price) return false;
      }
      var beds = parseInt(val(fBeds), 10);
      if (beds) {
        var cb = parseInt(card.getAttribute("data-beds"), 10) || 0;
        if (cb < beds) return false;
      }
      return true;
    }

    function isFiltering() {
      return !!(val(fQ) || val(fType) || val(fListing) || val(fLokasi) || val(fPrice) || val(fBeds));
    }

    function apply() {
      var filtering = isFiltering();
      var matched = 0;
      for (var k = 0; k < cards.length; k++) {
        var ok = matchCard(cards[k]);
        if (ok) matched++;
        var withinInitial = k < initial;
        var visible = ok && (filtering || showAll || withinInitial);
        cards[k].hidden = !visible;
      }
      if (emptyMsg) emptyMsg.hidden = !(filtering && matched === 0);
      if (moreBtn) moreBtn.hidden = filtering || showAll || cards.length <= initial;
    }

    if (moreBtn) {
      moreBtn.addEventListener("click", function () { showAll = true; apply(); });
    }
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        apply();
        var sec = document.getElementById("properti");
        if (sec && window.innerWidth < 861) sec.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      // Filter instan saat memilih dropdown / mengetik.
      [fType, fListing, fLokasi, fPrice, fBeds].forEach(function (el) {
        if (el) el.addEventListener("change", apply);
      });
      if (fQ) fQ.addEventListener("input", apply);
    }
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        if (form) form.reset();
        showAll = false;
        apply();
      });
    }

    apply(); // status awal (terapkan batas jumlah)
  }

  /* ============================================================
     Galeri detail properti (klik thumbnail → ganti gambar utama)
     ============================================================ */
  var gallery = document.getElementById("detail-gallery");
  if (gallery) {
    var mainImg = gallery.querySelector(".dg-main img");
    var thumbs = gallery.querySelectorAll(".dg-thumb");
    for (var t = 0; t < thumbs.length; t++) {
      thumbs[t].addEventListener("click", function () {
        var src = this.getAttribute("data-src");
        if (mainImg && src) mainImg.setAttribute("src", src);
        for (var m = 0; m < thumbs.length; m++) thumbs[m].classList.remove("is-active");
        this.classList.add("is-active");
      });
    }
  }
})();

/* ============================================================
   themes/gitschool/assets/script.js — Interaksi tema "Gitschool"
   Vanilla JS (ES5), tanpa dependensi. Berisi:
     1. Header — status "scrolled" saat halaman digulir.
     2. Navigasi mobile — drawer + submenu accordion.
     3. Hero slider — autoplay, dot, panah, jeda saat hover.
     4. Statistik — animasi hitung naik (count-up) saat terlihat.
     5. Galeri — lightbox sederhana.
     6. Form pendaftaran — kirim ke Google Apps Script (Sheet).
   Menghormati prefers-reduced-motion untuk semua animasi.
   ============================================================ */
(function () {
  "use strict";

  var REDUCE = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function on(el, ev, fn) { if (el) el.addEventListener(ev, fn); }
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ========== 1. Header: status "scrolled" ========== */
  (function header() {
    var hdr = $(".site-header");
    if (!hdr) return;
    function update() {
      if (window.pageYOffset > 12) hdr.classList.add("scrolled");
      else hdr.classList.remove("scrolled");
    }
    update();
    on(window, "scroll", update);
  })();

  /* ========== 2. Navigasi mobile: drawer + submenu ========== */
  (function nav() {
    var toggle = $("#nav-toggle");
    var menu = $("#site-nav");
    if (!toggle || !menu) return;

    function openNav() {
      menu.classList.add("open");
      toggle.classList.add("is-active");
      toggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("nav-open");
    }
    function closeNav() {
      menu.classList.remove("open");
      toggle.classList.remove("is-active");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    }
    function isOpen() { return menu.classList.contains("open"); }

    on(toggle, "click", function () { isOpen() ? closeNav() : openNav(); });

    // Submenu: tombol panah membuka/menutup (accordion) di mobile.
    $all(".submenu-toggle", menu).forEach(function (btn) {
      on(btn, "click", function (e) {
        e.preventDefault();
        var parent = btn.closest(".nav-parent");
        if (!parent) return;
        var willOpen = !parent.classList.contains("open");
        parent.classList.toggle("open", willOpen);
        btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
      });
    });

    // Tutup drawer saat menekan tautan biasa (bukan induk submenu).
    $all("a.nav-link:not(.nav-link-parent), .submenu-link", menu).forEach(function (a) {
      on(a, "click", function () { if (isOpen()) closeNav(); });
    });

    // Tutup saat klik di luar drawer.
    on(document, "click", function (e) {
      if (!isOpen()) return;
      if (menu.contains(e.target) || toggle.contains(e.target)) return;
      closeNav();
    });

    // Tutup dengan tombol Escape.
    on(document, "keydown", function (e) {
      if (e.key === "Escape" && isOpen()) closeNav();
    });

    // Reset saat kembali ke layar lebar (desktop).
    var mq = window.matchMedia("(min-width: 921px)");
    function reset(e) {
      if (e.matches) {
        closeNav();
        $all(".nav-parent.open", menu).forEach(function (p) {
          p.classList.remove("open");
          var b = $(".submenu-toggle", p);
          if (b) b.setAttribute("aria-expanded", "false");
        });
      }
    }
    if (mq.addEventListener) mq.addEventListener("change", reset);
    else if (mq.addListener) mq.addListener(reset);
  })();

  /* ========== 3. Hero slider ========== */
  (function heroSlider() {
    var root = $(".hero-slider");
    if (!root) return;
    var slides = $all(".hero-slide", root);
    if (slides.length < 2) return; // satu slide: tidak perlu logika

    var dots = $all(".hero-dot", root);
    var prev = $(".hero-prev", root);
    var next = $(".hero-next", root);
    var index = 0;
    var timer = null;
    var autoplay = root.getAttribute("data-autoplay") === "true" && !REDUCE;
    var interval = parseInt(root.getAttribute("data-interval"), 10) || 6000;

    function show(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) { s.classList.toggle("is-active", n === index); });
      dots.forEach(function (d, n) { d.classList.toggle("is-active", n === index); });
    }
    function nextSlide() { show(index + 1); }
    function prevSlide() { show(index - 1); }

    function start() {
      if (!autoplay) return;
      stop();
      timer = window.setInterval(nextSlide, interval);
    }
    function stop() { if (timer) { window.clearInterval(timer); timer = null; } }

    on(next, "click", function () { nextSlide(); start(); });
    on(prev, "click", function () { prevSlide(); start(); });
    dots.forEach(function (d) {
      on(d, "click", function () {
        var i = parseInt(d.getAttribute("data-index"), 10) || 0;
        show(i); start();
      });
    });

    // Jeda autoplay saat kursor di atas slider.
    on(root, "mouseenter", stop);
    on(root, "mouseleave", start);

    // Hentikan autoplay saat tab tidak aktif.
    on(document, "visibilitychange", function () {
      if (document.hidden) stop(); else start();
    });

    show(0);
    start();
  })();

  /* ========== 4. Statistik: animasi hitung naik ========== */
  (function statsCount() {
    var nums = $all(".stat-value[data-count]");
    if (!nums.length) return;

    // Pisahkan nilai menjadi: awalan, angka, akhiran. Mis "1.250+".
    function parseValue(text) {
      var m = String(text).match(/[\d.,]+/);
      if (!m) return null;
      var token = m[0];
      var start = text.indexOf(token);
      var prefix = text.slice(0, start);
      var suffix = text.slice(start + token.length);
      var hasSep = /[.,]/.test(token);
      var target = parseInt(token.replace(/[.,]/g, ""), 10);
      if (isNaN(target)) return null;
      return { prefix: prefix, suffix: suffix, target: target, hasSep: hasSep };
    }

    function format(n, hasSep) {
      if (!hasSep) return String(n);
      try { return n.toLocaleString("id-ID"); } catch (e) { return String(n); }
    }

    function animate(el, info) {
      var dur = 1500, t0 = null;
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
        var val = Math.round(info.target * eased);
        el.textContent = info.prefix + format(val, info.hasSep) + info.suffix;
        if (p < 1) window.requestAnimationFrame(step);
        else el.textContent = info.prefix + format(info.target, info.hasSep) + info.suffix;
      }
      window.requestAnimationFrame(step);
    }

    function run(el) {
      var info = parseValue(el.textContent);
      if (!info) return;
      if (REDUCE) return; // teks asli sudah merupakan nilai akhir
      el.textContent = info.prefix + "0" + info.suffix;
      animate(el, info);
    }

    if (!("IntersectionObserver" in window)) { nums.forEach(run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    nums.forEach(function (n) { io.observe(n); });
  })();

  /* ========== 5. Galeri: lightbox ========== */
  (function lightbox() {
    var box = $("#lightbox");
    var items = $all(".gallery-item");
    if (!box || !items.length) return;
    var img = $(".lightbox-img", box);
    var cap = $(".lightbox-cap", box);
    var closeBtn = $(".lightbox-close", box);

    function open(src, caption) {
      if (img) { img.src = src; img.alt = caption || "Galeri sekolah"; }
      if (cap) { cap.textContent = caption || ""; cap.style.display = caption ? "" : "none"; }
      box.classList.add("open");
      box.setAttribute("aria-hidden", "false");
      document.body.classList.add("nav-open");
    }
    function close() {
      box.classList.remove("open");
      box.setAttribute("aria-hidden", "true");
      document.body.classList.remove("nav-open");
      if (img) img.src = "";
    }

    items.forEach(function (a) {
      on(a, "click", function (e) {
        e.preventDefault();
        open(a.getAttribute("href"), a.getAttribute("data-caption") || "");
      });
    });
    on(closeBtn, "click", close);
    on(box, "click", function (e) { if (e.target === box) close(); });
    on(document, "keydown", function (e) {
      if (e.key === "Escape" && box.classList.contains("open")) close();
    });
  })();

  /* ========== 6. Form pendaftaran → Google Sheet ========== */
  (function enrollForm() {
    var form = $("#enroll-form");
    if (!form) return;
    var status = $("#enroll-status");
    var submitBtn = $(".enroll-submit", form);
    var endpoint = form.getAttribute("data-endpoint") || "";
    var successMsg = form.getAttribute("data-success") || "Terima kasih! Pendaftaran Anda telah kami terima.";
    var waNumber = form.getAttribute("data-whatsapp") || "";

    function setStatus(msg, kind) {
      if (!status) return;
      status.textContent = msg;
      status.className = "form-status" + (kind ? " is-" + kind : "");
    }

    function waFallbackLink() {
      if (!waNumber) return "";
      var nama = (form.querySelector('[name="nama"]') || {}).value || "";
      var jenjang = (form.querySelector('[name="jenjang"]') || {}).value || "";
      var teks = encodeURIComponent("Halo, saya ingin mendaftarkan siswa baru.\nNama: " + nama + "\nJenjang: " + jenjang);
      return "https://wa.me/" + waNumber + "?text=" + teks;
    }

    function showWaFallback(prefixMsg) {
      var link = waFallbackLink();
      if (!status) return;
      status.className = "form-status is-error";
      status.innerHTML = "";
      var span = document.createElement("span");
      span.textContent = prefixMsg + (link ? " Silakan kirim pendaftaran via WhatsApp: " : "");
      status.appendChild(span);
      if (link) {
        var a = document.createElement("a");
        a.href = link; a.target = "_blank"; a.rel = "noopener";
        a.textContent = "Buka WhatsApp";
        status.appendChild(a);
      }
    }

    on(form, "submit", function (e) {
      e.preventDefault();

      // Honeypot: jika terisi, kemungkinan besar bot — diam-diam hentikan.
      var hp = form.querySelector('[name="_gotcha"]');
      if (hp && hp.value) return;

      // Validasi bawaan browser untuk field wajib.
      if (typeof form.checkValidity === "function" && !form.checkValidity()) {
        if (typeof form.reportValidity === "function") form.reportValidity();
        setStatus("Mohon lengkapi data yang wajib diisi (*).", "error");
        return;
      }

      // Endpoint belum diatur pemilik situs.
      if (!endpoint) {
        showWaFallback("Formulir online belum aktif.");
        return;
      }

      var data = new FormData(form);
      var params = new URLSearchParams();
      data.forEach(function (v, k) { if (k !== "_gotcha") params.append(k, v); });
      params.append("_dikirim", new Date().toISOString());

      if (submitBtn) { submitBtn.disabled = true; }
      setStatus("Mengirim pendaftaran…", "loading");

      // Kirim ke Google Apps Script. Mode no-cors menghindari kendala CORS;
      // permintaan tetap sampai ke Sheet meski respons tak bisa dibaca.
      fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body: params.toString(),
      })
        .then(function () {
          setStatus(successMsg, "success");
          form.reset();
        })
        .catch(function () {
          showWaFallback("Maaf, pengiriman gagal.");
        })
        .then(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  })();
})();

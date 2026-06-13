/* ============================================================
   theme/script.js — Interaksi TEMA Pesantren
   1. Navigasi: drawer mobile + submenu accordion.
   2. Header: status "scrolled" (bayangan saat menggulir).
   3. Slider hero: geser, dot, tombol, autoplay (jeda saat hover),
      dan geser sentuh (swipe). Menghormati prefers-reduced-motion.
   4. Count-up: animasi angka statistik saat masuk layar.
   5. Formulir Kontak & Pendaftaran: kirim ke Google Sheet via
      Google Apps Script; cadangan ke WhatsApp / email.
   Semua murni sisi-klien — tidak menyentuh inti GitCMS.
   ============================================================ */
(function () {
  "use strict";

  var prefersReduced =
    !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  /* ========================================================
     1) NAVIGASI — drawer mobile & submenu accordion
     ======================================================== */
  (function nav() {
    var toggle = document.getElementById("nav-toggle");
    var navEl = document.getElementById("site-nav");

    function closeNav() {
      if (!navEl) return;
      navEl.classList.remove("open");
      if (toggle) {
        toggle.setAttribute("aria-expanded", "false");
        toggle.classList.remove("is-active");
      }
      document.body.classList.remove("nav-open");
    }

    if (toggle && navEl) {
      toggle.addEventListener("click", function () {
        var open = navEl.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.classList.toggle("is-active", open);
        document.body.classList.toggle("nav-open", open);
      });

      // Klik tautan di dalam drawer → tutup (kecuali tautan induk submenu).
      navEl.addEventListener("click", function (e) {
        var link = e.target.closest("a.nav-link, a.submenu-link");
        if (link && !link.classList.contains("nav-link-parent") && navEl.classList.contains("open")) {
          closeNav();
        }
      });
    }

    // Submenu accordion (mobile): tombol panah men-toggle parent-nya.
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

    // Reset state saat layar membesar ke desktop (drawer aktif <=860px).
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

    // Tutup drawer dengan tombol Escape.
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navEl && navEl.classList.contains("open")) closeNav();
    });
  })();

  /* ========================================================
     2) HEADER — status "scrolled"
     ======================================================== */
  (function headerScroll() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var ticking = false;
    function update() {
      header.classList.toggle("scrolled", window.pageYOffset > 8);
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  })();

  /* ========================================================
     3) SLIDER HERO
     ======================================================== */
  (function sliders() {
    var nodes = document.querySelectorAll("[data-slider]");
    for (var s = 0; s < nodes.length; s++) initSlider(nodes[s]);

    function initSlider(root) {
      var track = root.querySelector(".slider-track");
      var slides = root.querySelectorAll(".slide");
      var dots = root.querySelectorAll(".slider-dot");
      var prev = root.querySelector(".slider-prev");
      var next = root.querySelector(".slider-next");
      var total = slides.length;
      if (!track || total < 2) return;

      var index = 0;
      var timer = null;
      var INTERVAL = 6000;

      function render() {
        track.style.transform = "translateX(" + (-index * 100) + "%)";
        for (var i = 0; i < total; i++) {
          slides[i].setAttribute("aria-hidden", i === index ? "false" : "true");
        }
        for (var d = 0; d < dots.length; d++) {
          dots[d].classList.toggle("is-active", d === index);
          dots[d].setAttribute("aria-selected", d === index ? "true" : "false");
        }
      }

      function goTo(i) { index = (i + total) % total; render(); }
      function nextSlide() { goTo(index + 1); }
      function prevSlide() { goTo(index - 1); }

      if (next) next.addEventListener("click", function () { nextSlide(); restart(); });
      if (prev) prev.addEventListener("click", function () { prevSlide(); restart(); });
      for (var dd = 0; dd < dots.length; dd++) {
        (function (btn) {
          btn.addEventListener("click", function () {
            var t = parseInt(btn.getAttribute("data-go"), 10);
            if (!isNaN(t)) { goTo(t); restart(); }
          });
        })(dots[dd]);
      }

      function start() {
        if (prefersReduced) return;
        stop();
        timer = window.setInterval(nextSlide, INTERVAL);
      }
      function stop() { if (timer) { window.clearInterval(timer); timer = null; } }
      function restart() { stop(); start(); }

      root.addEventListener("mouseenter", stop);
      root.addEventListener("mouseleave", start);
      root.addEventListener("focusin", stop);
      root.addEventListener("focusout", start);

      // Geser sentuh (swipe) sederhana.
      var startX = 0, dx = 0, swiping = false;
      root.addEventListener("touchstart", function (e) {
        if (e.touches.length !== 1) return;
        startX = e.touches[0].clientX; dx = 0; swiping = true; stop();
      }, { passive: true });
      root.addEventListener("touchmove", function (e) {
        if (swiping) dx = e.touches[0].clientX - startX;
      }, { passive: true });
      root.addEventListener("touchend", function () {
        if (!swiping) return;
        swiping = false;
        if (Math.abs(dx) > 40) { if (dx < 0) nextSlide(); else prevSlide(); }
        start();
      });

      render();
      start();
    }
  })();

  /* ========================================================
     4) COUNT-UP STATISTIK
     ======================================================== */
  (function countUp() {
    var nums = document.querySelectorAll(".stat-num[data-target]");
    if (!nums.length) return;

    function format(n) {
      try { return Number(n).toLocaleString("id-ID"); }
      catch (e) { return String(n); }
    }
    function setFinal(el) {
      var target = parseInt(el.getAttribute("data-target"), 10) || 0;
      el.textContent =
        (el.getAttribute("data-prefix") || "") + format(target) + (el.getAttribute("data-suffix") || "");
    }
    function animate(el) {
      var target = parseInt(el.getAttribute("data-target"), 10) || 0;
      var prefix = el.getAttribute("data-prefix") || "";
      var suffix = el.getAttribute("data-suffix") || "";
      var dur = 1400, t0 = null;
      function step(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        el.textContent = prefix + format(Math.round(eased * target)) + suffix;
        if (p < 1) window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
    }

    if (prefersReduced || !("IntersectionObserver" in window)) {
      for (var i = 0; i < nums.length; i++) setFinal(nums[i]);
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    for (var k = 0; k < nums.length; k++) io.observe(nums[k]);
  })();

  /* ========================================================
     5) FORMULIR — Kontak & Pendaftaran
     ======================================================== */
  (function formsModule() {
    var formsList = document.querySelectorAll(".form-card[data-form]");
    for (var f = 0; f < formsList.length; f++) bindForm(formsList[f]);

    // "0877..." -> "62877..." untuk tautan wa.me.
    function digitsToWa(num) {
      var d = String(num || "").replace(/[^\d]/g, "");
      if (!d) return "";
      if (d.charAt(0) === "0") d = "62" + d.slice(1);
      return d;
    }

    // Kumpulkan pasangan label->nilai (lewati kolom teknis & honeypot).
    function fieldPairs(form) {
      var pairs = [];
      var els = form.querySelectorAll("input, textarea, select");
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        var name = el.name;
        if (!name || name.charAt(0) === "_" || name === "website") continue;
        if (el.type === "checkbox" && !el.checked) continue;
        var label = "";
        if (el.id) {
          var lblEl = form.querySelector('label[for="' + el.id + '"]');
          if (lblEl) label = lblEl.textContent.replace(/\s*\*\s*$/, "").trim();
        }
        pairs.push({ label: label || name, value: el.value });
      }
      return pairs;
    }

    function buildMessage(form, subject) {
      var lines = [];
      if (subject) { lines.push("*" + subject + "*"); lines.push(""); }
      var pairs = fieldPairs(form);
      for (var i = 0; i < pairs.length; i++) {
        if (pairs[i].value) lines.push(pairs[i].label + ": " + pairs[i].value);
      }
      return lines.join("\n");
    }

    function setStatus(form, msg, type) {
      var box = form.querySelector(".form-status");
      if (!box) return;
      box.textContent = msg;
      box.classList.remove("is-success", "is-error");
      if (type) box.classList.add("is-" + type);
    }

    function bindForm(form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Honeypot: jika "website" terisi, kemungkinan bot -> batalkan diam-diam.
        var hp = form.querySelector('input[name="website"]');
        if (hp && hp.value) return;

        // Validasi bawaan peramban.
        if (typeof form.reportValidity === "function" && !form.reportValidity()) return;

        var endpoint = form.getAttribute("data-endpoint");
        var wa = form.getAttribute("data-wa");
        var email = form.getAttribute("data-email");
        var success = form.getAttribute("data-success") || "Terima kasih, data Anda sudah terkirim.";
        var subjEl = form.querySelector('input[name="_subjek"]');
        var subject = subjEl ? subjEl.value : "";
        var submitBtn = form.querySelector(".form-submit");

        function openWa() {
          var d = digitsToWa(wa);
          if (!d) return false;
          window.open(
            "https://wa.me/" + d + "?text=" + encodeURIComponent(buildMessage(form, subject)),
            "_blank", "noopener"
          );
          return true;
        }
        function openMail() {
          if (!email) return false;
          window.location.href =
            "mailto:" + email +
            "?subject=" + encodeURIComponent(subject || "Pesan dari website") +
            "&body=" + encodeURIComponent(buildMessage(form, ""));
          return true;
        }

        if (endpoint) {
          // Kirim ke Google Apps Script. mode:no-cors -> respons tak terbaca,
          // jadi tampilkan sukses secara optimistis.
          if (submitBtn) submitBtn.disabled = true;
          setStatus(form, "Mengirim...", null);
          var data = new URLSearchParams(new FormData(form));
          fetch(endpoint, { method: "POST", mode: "no-cors", body: data })
            .then(function () {
              setStatus(form, success, "success");
              form.reset();
            })
            .catch(function () {
              setStatus(form, "Gagal mengirim otomatis. Kami alihkan ke WhatsApp...", "error");
              if (!openWa()) openMail();
            })
            .then(function () {
              if (submitBtn) submitBtn.disabled = false;
            });
        } else {
          // Tanpa endpoint -> langsung WhatsApp (atau email sebagai cadangan).
          if (openWa() || openMail()) {
            setStatus(form, "Membuka WhatsApp... Jika tidak terbuka, silakan hubungi kami manual.", "success");
          } else {
            setStatus(form, "Nomor WhatsApp belum disetel. Silakan hubungi admin.", "error");
          }
        }
      });
    }
  })();
})();

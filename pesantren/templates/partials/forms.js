/* ============================================================
   partials/forms.js — Halaman khusus (TEMA Pesantren)
   - renderKontak(ctx, profile)      : info kontak + peta + form pesan.
   - renderPendaftaran(ctx, profile) : form pendaftaran santri yang
     dikirim ke Google Sheet via Google Apps Script (Web App URL
     diatur di Customizer → "Pendaftaran"). Bila URL kosong, form
     otomatis jatuh ke WhatsApp sebagai cadangan.

   Pemrosesan submit ada di assets/script.js (sisi klien). Tema tidak
   menyentuh inti — endpoint & nomor WA berasal dari Customizer.
   ============================================================ */

"use strict";

const sections = require("./sections");

function field(opts, esc, attr) {
  const id = "f-" + opts.name;
  const req = opts.required ? ' required aria-required="true"' : "";
  const reqMark = opts.required ? ' <span class="req" aria-hidden="true">*</span>' : "";
  const label = `<label class="form-label" for="${attr(id)}">${esc(opts.label)}${reqMark}</label>`;
  let control;
  if (opts.type === "textarea") {
    control = `<textarea class="form-control" id="${attr(id)}" name="${attr(opts.name)}" rows="${opts.rows || 3}"${req} placeholder="${attr(opts.placeholder || "")}"></textarea>`;
  } else if (opts.type === "select") {
    const choices = (opts.choices || []).map((c) => `<option value="${attr(c)}">${esc(c)}</option>`).join("");
    control = `<select class="form-control" id="${attr(id)}" name="${attr(opts.name)}"${req}><option value="" disabled selected>— Pilih —</option>${choices}</select>`;
  } else {
    control = `<input class="form-control" id="${attr(id)}" name="${attr(opts.name)}" type="${attr(opts.type || "text")}"${req} placeholder="${attr(opts.placeholder || "")}"${opts.autocomplete ? ' autocomplete="' + attr(opts.autocomplete) + '"' : ""}>`;
  }
  return `<div class="form-row${opts.wide ? " form-row-wide" : ""}">${label}${control}</div>`;
}

// Honeypot anti-spam: bila terisi (oleh bot), submit dibatalkan di script.js.
function honeypot() {
  return `<div class="form-hp" aria-hidden="true"><label>Jangan isi kolom ini<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>`;
}

/* ---------- Halaman Kontak ---------- */
function renderKontak(ctx, profile) {
  const { lib } = ctx;
  const { esc, attr } = lib;
  const k = profile.kontak;

  const fields =
    field({ name: "nama", label: "Nama", required: true, autocomplete: "name" }, esc, attr) +
    field({ name: "email", label: "Email", type: "email", autocomplete: "email" }, esc, attr) +
    field({ name: "hp", label: "No. HP / WhatsApp", type: "tel", autocomplete: "tel" }, esc, attr) +
    field({ name: "pesan", label: "Pesan", type: "textarea", rows: 4, required: true, wide: true }, esc, attr);

  const form =
    `<form class="form-card" data-form="kontak"` +
    ` data-endpoint="${attr(profile.pendaftaran.scriptUrl)}"` +
    ` data-wa="${attr(profile.pendaftaran.waFallback || k.waNumber)}"` +
    ` data-email="${attr(k.email)}"` +
    ` data-success="${attr("Terima kasih, pesan Anda sudah terkirim. Kami akan segera membalas.")}">` +
    `<h2 class="form-title">Kirim Pesan</h2>` +
    `<div class="form-grid">${fields}</div>` +
    honeypot() +
    `<input type="hidden" name="_subjek" value="${attr("Pesan dari halaman Kontak — " + ctx.config.title)}">` +
    `<button class="btn btn-primary btn-lg form-submit" type="submit">Kirim Pesan</button>` +
    `<p class="form-status" role="status" aria-live="polite"></p>` +
    `</form>`;

  // Blok info + peta memakai builder seksi yang sama (DRY).
  const contactBlock = sections.kontak(ctx, profile);

  return (
    `\n    <article class="post page-kontak">` +
    `\n      <div class="container post-narrow">` +
    `\n        <header class="post-header"><span class="eyebrow center-eyebrow">${esc(k.eyebrow)}</span><h1 class="post-title">${esc(ctx.page.meta.title || "Kontak")}</h1>` +
    (ctx.page.meta.excerpt ? `<p class="page-lead">${esc(ctx.page.meta.excerpt)}</p>` : "") +
    `</header>` +
    `\n        <div class="post-content">\n${ctx.page.html}\n        </div>` +
    `\n      </div>` +
    contactBlock +
    `\n      <div class="container container-narrow">\n        ${form}\n      </div>` +
    `\n    </article>`
  );
}

/* ---------- Halaman Pendaftaran Santri ---------- */
function renderPendaftaran(ctx, profile) {
  const { lib } = ctx;
  const { esc, attr } = lib;
  const pend = profile.pendaftaran;

  const fields =
    field({ name: "nama", label: "Nama Lengkap Calon Santri", required: true, autocomplete: "name" }, esc, attr) +
    field({ name: "jenis_kelamin", label: "Jenis Kelamin", type: "select", choices: ["Laki-laki", "Perempuan"], required: true }, esc, attr) +
    field({ name: "tempat_lahir", label: "Tempat Lahir" }, esc, attr) +
    field({ name: "tanggal_lahir", label: "Tanggal Lahir", type: "date" }, esc, attr) +
    field({ name: "asal_sekolah", label: "Asal Sekolah / Jenjang" }, esc, attr) +
    field({ name: "program", label: "Program yang Diminati", type: "select", choices: pend.programChoices, required: true }, esc, attr) +
    field({ name: "nama_wali", label: "Nama Orang Tua / Wali", required: true }, esc, attr) +
    field({ name: "hp", label: "No. HP / WhatsApp Wali", type: "tel", required: true, autocomplete: "tel" }, esc, attr) +
    field({ name: "email", label: "Email (opsional)", type: "email", autocomplete: "email" }, esc, attr) +
    field({ name: "alamat", label: "Alamat Lengkap", type: "textarea", rows: 2, wide: true }, esc, attr) +
    field({ name: "catatan", label: "Catatan (opsional)", type: "textarea", rows: 2, wide: true }, esc, attr);

  const noEndpointNote = pend.scriptUrl
    ? ""
    : `<p class="form-note">Catatan admin: setel <strong>URL Google Apps Script</strong> di menu <em>Sesuaikan → Pendaftaran</em> agar data tersimpan otomatis ke Google Sheet. Untuk sementara, formulir akan dikirim melalui WhatsApp.</p>`;

  const form =
    `<form class="form-card" data-form="pendaftaran"` +
    ` data-endpoint="${attr(pend.scriptUrl)}"` +
    ` data-wa="${attr(pend.waFallback)}"` +
    ` data-success="${attr(pend.successMessage)}">` +
    `<div class="form-grid">${fields}</div>` +
    honeypot() +
    `<input type="hidden" name="_subjek" value="${attr("Pendaftaran Santri Baru — " + ctx.config.title)}">` +
    `<label class="form-check"><input type="checkbox" name="_setuju" required> Saya menyatakan data di atas benar dan menyetujui untuk dihubungi pihak pesantren.</label>` +
    `<button class="btn btn-primary btn-lg form-submit" type="submit">Kirim Pendaftaran</button>` +
    `<p class="form-status" role="status" aria-live="polite"></p>` +
    noEndpointNote +
    `</form>`;

  const intro = pend.intro
    ? `<p class="page-lead">${esc(pend.intro)}</p>`
    : (ctx.page.meta.excerpt ? `<p class="page-lead">${esc(ctx.page.meta.excerpt)}</p>` : "");

  return (
    `\n    <article class="post page-pendaftaran">` +
    `\n      <div class="container container-narrow">` +
    `\n        <header class="post-header"><span class="eyebrow center-eyebrow">Penerimaan Santri Baru</span><h1 class="post-title">${esc(ctx.page.meta.title || "Pendaftaran Santri")}</h1>${intro}</header>` +
    (ctx.page.html && ctx.page.html.trim() ? `\n        <div class="post-content">\n${ctx.page.html}\n        </div>` : "") +
    `\n        ${form}` +
    `\n      </div>` +
    `\n    </article>`
  );
}

module.exports = { renderKontak: renderKontak, renderPendaftaran: renderPendaftaran };

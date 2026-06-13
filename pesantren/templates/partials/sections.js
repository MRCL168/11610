/* ============================================================
   partials/sections.js — Penyusun seksi BERANDA (TEMA Pesantren)
   Tiap fungsi memetakan data hasil getProfile() menjadi HTML seksi.
   Urutan dirakit di templates/home.js sesuai brief:
     hero+slider → stats → program → profil → fasilitas → pengajar
     → berita → testimoni → lokasi+kontak → CTA
   Murni tampilan: hanya membaca ctx + objek profile. Tidak ada
   akses inti (GitHub/filesystem/routing).
   ============================================================ */

"use strict";

const icons = require("./icons");
const postCard = require("./post-card");
const profileMod = require("./profile");
const navHref = profileMod.navHref;

// Pecah teks multi-paragraf (pisah baris kosong) → <p> aman (di-escape).
function paragraphs(text, esc) {
  return String(text || "")
    .split(/\n{2,}/)
    .map((par) => par.trim())
    .filter(Boolean)
    .map((par) => `<p>${esc(par).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

// Header seksi standar (eyebrow + judul + pengantar opsional).
function sectionHead(eyebrow, title, intro, esc, center) {
  const introHtml = intro ? `<p class="sect-intro">${esc(intro)}</p>` : "";
  return (
    `<div class="sect-head${center ? " center" : ""}">` +
    `<span class="eyebrow">${icons.motif()}${esc(eyebrow)}</span>` +
    `<h2 class="sect-title">${esc(title)}</h2>` +
    introHtml +
    `</div>`
  );
}

/* ---------- 1. Hero + Slider + Teks ---------- */
function hero(ctx, profile) {
  const { U, lib, config } = ctx;
  const { esc, attr } = lib;
  const h = profile.hero;

  const secondary = h.secondaryCta && h.secondaryCta.text
    ? `<a class="btn btn-ghost btn-lg" href="${attr(navHref(U, h.secondaryCta.url))}">${esc(h.secondaryCta.text)}</a>`
    : "";

  const text =
    `<div class="hero-text">` +
    `<span class="eyebrow eyebrow-on-dark">${icons.motif()}${esc(h.eyebrow)}</span>` +
    `<h1 class="hero-title">${esc(h.headline)}</h1>` +
    `<p class="hero-lead">${esc(h.subheadline)}</p>` +
    `<div class="hero-actions">` +
    `<a class="btn btn-primary btn-lg" href="${attr(navHref(U, h.primaryCta.url))}">${esc(h.primaryCta.text)}</a>` +
    secondary +
    `</div>` +
    `</div>`;

  // Media kanan: slider bila ada slide, jika tidak panel berhias arch + motif.
  let media;
  if (profile.hasSlides) {
    const n = profile.slides.length;
    const slidesHtml = profile.slides.map((s, i) => {
      const cap = (s.title || s.caption)
        ? `<div class="slide-cap">${s.title ? `<strong>${esc(s.title)}</strong>` : ""}${s.caption ? `<span>${esc(s.caption)}</span>` : ""}</div>`
        : "";
      const altText = s.title || s.caption || (config.title + " — slide " + (i + 1));
      return (
        `<div class="slide" role="group" aria-roledescription="slide" aria-label="${attr((i + 1) + " dari " + n)}"${i === 0 ? "" : ' aria-hidden="true"'}>` +
        `<img src="${attr(U.url(s.image))}" alt="${attr(altText)}"${i === 0 ? "" : ' loading="lazy"'}>` +
        cap +
        `</div>`
      );
    }).join("");
    const dots = profile.slides.map((s, i) =>
      `<button class="slider-dot${i === 0 ? " is-active" : ""}" type="button" data-go="${i}" aria-label="${attr("Ke slide " + (i + 1))}"></button>`
    ).join("");
    const controls = n > 1
      ? `<button class="slider-btn slider-prev" type="button" aria-label="Slide sebelumnya">‹</button>` +
        `<button class="slider-btn slider-next" type="button" aria-label="Slide berikutnya">›</button>` +
        `<div class="slider-dots" role="tablist" aria-label="Pilih slide">${dots}</div>`
      : "";
    media =
      `<div class="hero-media">` +
      `<div class="hero-arch">` +
      `<div class="hero-slider" data-slider aria-roledescription="carousel" aria-label="Galeri ${attr(config.title)}">` +
      `<div class="slider-viewport"><div class="slider-track">${slidesHtml}</div></div>` +
      controls +
      `</div>` +
      `</div>` +
      `</div>`;
  } else {
    media =
      `<div class="hero-media">` +
      `<div class="hero-arch hero-arch-empty">` +
      `<span class="arch-mark">${icons.motif()}</span>` +
      `<span class="arch-name">${esc(config.title)}</span>` +
      `</div>` +
      `</div>`;
  }

  return (
    `\n    <section class="hero">` +
    `\n      <div class="hero-bg" aria-hidden="true"></div>` +
    `\n      <div class="container">` +
    `\n        <div class="hero-inner">${text}${media}</div>` +
    `\n      </div>` +
    `\n    </section>`
  );
}

/* ---------- 2. Statistik (count-up) ---------- */
function stats(ctx, profile) {
  if (!profile.hasStats) return "";
  const { esc, attr } = ctx.lib;
  const items = profile.stats.map((s) => {
    let num;
    if (s.num != null) {
      num = `<span class="stat-num" data-target="${attr(String(s.num))}" data-prefix="${attr(s.prefix)}" data-suffix="${attr(s.suffix)}">${esc(s.prefix)}0${esc(s.suffix)}</span>`;
    } else {
      num = `<span class="stat-num">${esc(s.value)}</span>`;
    }
    return `<div class="stat">${num}<span class="stat-label">${esc(s.label)}</span></div>`;
  }).join("");
  return (
    `\n    <section class="sect stats-band" aria-label="Statistik pesantren">` +
    `\n      <div class="container"><div class="stats-grid">${items}</div></div>` +
    `\n    </section>`
  );
}

/* ---------- 3. Program Unggulan ---------- */
function programs(ctx, profile) {
  if (!profile.hasPrograms) return "";
  const { U, lib } = ctx;
  const { esc, attr } = lib;
  const cards = profile.programs.map((p) => {
    const inner =
      `<div class="prog-icon">${icons.lineIcon(p.icon)}</div>` +
      `<h3 class="prog-title">${esc(p.title)}</h3>` +
      (p.text ? `<p class="prog-text">${esc(p.text)}</p>` : "");
    if (p.url) {
      return `\n        <a class="prog-card prog-card-link" href="${attr(navHref(U, p.url))}">${inner}<span class="prog-more">Selengkapnya ${icons.arrow()}</span></a>`;
    }
    return `\n        <article class="prog-card">${inner}</article>`;
  }).join("");
  return (
    `\n    <section class="sect" id="program">` +
    `\n      <div class="container">` +
    `\n        ${sectionHead(profile.programsEyebrow, profile.programsTitle, profile.programsIntro, esc, true)}` +
    `\n        <div class="prog-grid">${cards}</div>` +
    `\n      </div>` +
    `\n    </section>`
  );
}

/* ---------- 4. Profil Singkat ---------- */
function profil(ctx, profile) {
  if (!profile.profil) return "";
  const { U, lib, config } = ctx;
  const { esc, attr } = lib;
  const pr = profile.profil;

  const points = pr.points.length
    ? `<ul class="profil-points">${pr.points.map((pt) => `<li>${esc(pt)}</li>`).join("")}</ul>`
    : "";
  const media = pr.image
    ? `<div class="profil-media"><div class="hero-arch profil-arch"><img src="${attr(U.url(pr.image))}" alt="${attr(pr.title || config.title)}"></div></div>`
    : `<div class="profil-media"><div class="hero-arch hero-arch-empty profil-arch"><span class="arch-mark">${icons.motif()}</span><span class="arch-name">${esc(config.title)}</span></div></div>`;

  return (
    `\n    <section class="sect sect-soft" id="profil">` +
    `\n      <div class="container">` +
    `\n        <div class="profil-grid">` +
    `\n          <div class="profil-text">` +
    `<span class="eyebrow">${icons.motif()}${esc(pr.eyebrow)}</span>` +
    `<h2 class="sect-title">${esc(pr.title)}</h2>` +
    paragraphs(pr.text, esc) + points +
    `\n          </div>` +
    `\n          ${media}` +
    `\n        </div>` +
    `\n      </div>` +
    `\n    </section>`
  );
}

/* ---------- 5. Fasilitas Penunjang ---------- */
function fasilitas(ctx, profile) {
  if (!profile.hasFasilitas) return "";
  const { esc } = ctx.lib;
  const cards = profile.fasilitas.map((f) =>
    `\n        <article class="fasil-card">` +
    `<div class="fasil-icon">${icons.lineIcon(f.icon)}</div>` +
    `<div class="fasil-body"><h3 class="fasil-title">${esc(f.title)}</h3>` +
    (f.text ? `<p class="fasil-text">${esc(f.text)}</p>` : "") + `</div>` +
    `</article>`
  ).join("");
  return (
    `\n    <section class="sect" id="fasilitas">` +
    `\n      <div class="container">` +
    `\n        ${sectionHead(profile.fasilitasEyebrow, profile.fasilitasTitle, profile.fasilitasIntro, esc, true)}` +
    `\n        <div class="fasil-grid">${cards}</div>` +
    `\n      </div>` +
    `\n    </section>`
  );
}

/* ---------- 6. Pengajar (Asatidz) ---------- */
function pengajar(ctx, profile) {
  if (!profile.hasPengajar) return "";
  const { U, lib } = ctx;
  const { esc, attr } = lib;
  function initials(name) {
    return String(name).trim().split(/\s+/).slice(0, 2).map((w) => w.charAt(0).toUpperCase()).join("");
  }
  const cards = profile.pengajar.map((t) => {
    const avatar = t.photo
      ? `<div class="teacher-photo"><img src="${attr(U.url(t.photo))}" alt="${attr(t.name)}" loading="lazy"></div>`
      : `<div class="teacher-photo teacher-photo-empty" aria-hidden="true">${esc(initials(t.name))}</div>`;
    return (
      `\n        <article class="teacher-card">` +
      avatar +
      `<h3 class="teacher-name">${esc(t.name)}</h3>` +
      (t.role ? `<span class="teacher-role">${esc(t.role)}</span>` : "") +
      `</article>`
    );
  }).join("");
  return (
    `\n    <section class="sect sect-soft" id="pengajar">` +
    `\n      <div class="container">` +
    `\n        ${sectionHead(profile.pengajarEyebrow, profile.pengajarTitle, profile.pengajarIntro, esc, true)}` +
    `\n        <div class="teacher-grid">${cards}</div>` +
    `\n      </div>` +
    `\n    </section>`
  );
}

/* ---------- 7. Berita & Kegiatan (dari inti: ctx.posts) ---------- */
function berita(ctx, profile) {
  const posts = ctx.posts || [];
  if (!profile.berita.enabled || !posts.length) return "";
  const { U, lib } = ctx;
  const { esc, attr } = lib;
  const latest = posts.slice(0, 3);
  const cards = latest.map((p) => postCard(p, ctx)).join("");
  const allLink = `<a class="link-more" href="${attr(U.url("/"))}">Lihat semua berita ${icons.arrow()}</a>`;
  return (
    `\n    <section class="sect" id="berita">` +
    `\n      <div class="container">` +
    `\n        <div class="sect-head-row">` +
    `\n          ${sectionHead(profile.berita.eyebrow, profile.berita.title, "", esc, false)}` +
    `\n          ${allLink}` +
    `\n        </div>` +
    `\n        <div class="post-grid">${cards}</div>` +
    `\n      </div>` +
    `\n    </section>`
  );
}

/* ---------- 8. Testimoni ---------- */
function testimoni(ctx, profile) {
  if (!profile.hasTestimoni) return "";
  const { U, lib } = ctx;
  const { esc, attr } = lib;
  function initials(name) {
    return String(name || "").trim().split(/\s+/).slice(0, 2).map((w) => w.charAt(0).toUpperCase()).join("") || "•";
  }
  const cards = profile.testimoni.map((t) => {
    const avatar = t.photo
      ? `<img class="tm-photo" src="${attr(U.url(t.photo))}" alt="${attr(t.name)}" loading="lazy">`
      : `<span class="tm-photo tm-photo-empty" aria-hidden="true">${esc(initials(t.name))}</span>`;
    const who = (t.name || t.role)
      ? `<div class="tm-who">${avatar}<div><strong>${esc(t.name)}</strong>${t.role ? `<span>${esc(t.role)}</span>` : ""}</div></div>`
      : "";
    return (
      `\n        <figure class="tm-card">` +
      `<span class="tm-quote" aria-hidden="true">&ldquo;</span>` +
      `<blockquote class="tm-text">${esc(t.quote)}</blockquote>` +
      who +
      `</figure>`
    );
  }).join("");
  return (
    `\n    <section class="sect sect-soft" id="testimoni">` +
    `\n      <div class="container">` +
    `\n        ${sectionHead(profile.testimoniEyebrow, profile.testimoniTitle, "", esc, true)}` +
    `\n        <div class="tm-grid">${cards}</div>` +
    `\n      </div>` +
    `\n    </section>`
  );
}

/* ---------- 9. Lokasi (peta) + Kontak ---------- */
// Bangun iframe peta dari nilai Customizer: terima <iframe> utuh ATAU URL src.
function mapEmbedHtml(value, attr) {
  const v = String(value || "").trim();
  if (!v) return "";
  if (/<iframe/i.test(v)) {
    // Konten tepercaya dari pemilik repo (sama seperti widget HTML) → sisipkan apa adanya.
    return `<div class="kontak-map">${v}</div>`;
  }
  if (/^https?:\/\//i.test(v)) {
    return `<div class="kontak-map"><iframe src="${attr(v)}" title="Peta lokasi" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>`;
  }
  return "";
}

function kontak(ctx, profile) {
  const { lib } = ctx;
  const { esc, attr } = lib;
  const k = profile.kontak;

  const rows = [];
  if (k.address) rows.push(`<li><span class="kontak-ic">${icons.lineIcon("building")}</span><div><strong>Alamat</strong><span>${esc(k.address)}</span></div></li>`);
  if (k.phone) rows.push(`<li><span class="kontak-ic">${icons.lineIcon("clock")}</span><div><strong>Telepon</strong><a href="tel:${attr(k.phone.replace(/\s+/g, ""))}">${esc(k.phone)}</a></div></li>`);
  if (k.waLink) rows.push(`<li><span class="kontak-ic">${icons.lineIcon("heart")}</span><div><strong>WhatsApp</strong><a href="${attr(k.waLink)}" target="_blank" rel="noopener">${esc(k.whatsapp || k.phone)}</a></div></li>`);
  if (k.email) rows.push(`<li><span class="kontak-ic">${icons.lineIcon("pen")}</span><div><strong>Email</strong><a href="mailto:${attr(k.email)}">${esc(k.email)}</a></div></li>`);
  if (k.hours) rows.push(`<li><span class="kontak-ic">${icons.lineIcon("clock")}</span><div><strong>Jam Layanan</strong><span>${esc(k.hours)}</span></div></li>`);

  if (!rows.length && !k.mapsEmbed) return "";

  const intro = k.intro ? `<p class="sect-intro">${esc(k.intro)}</p>` : "";
  const infoCol =
    `<div class="kontak-info">` +
    `<span class="eyebrow">${icons.motif()}${esc(k.eyebrow)}</span>` +
    `<h2 class="sect-title">${esc(k.title)}</h2>` +
    intro +
    (rows.length ? `<ul class="kontak-list">${rows.join("")}</ul>` : "") +
    (k.waLink ? `<a class="btn btn-primary" href="${attr(k.waLink)}" target="_blank" rel="noopener">Chat via WhatsApp</a>` : "") +
    `</div>`;
  const mapCol = mapEmbedHtml(k.mapsEmbed, attr);

  return (
    `\n    <section class="sect" id="kontak">` +
    `\n      <div class="container">` +
    `\n        <div class="kontak-grid${mapCol ? "" : " kontak-grid-single"}">${infoCol}${mapCol}</div>` +
    `\n      </div>` +
    `\n    </section>`
  );
}

/* ---------- 10. CTA band ---------- */
function ctaBand(ctx, profile) {
  if (!profile.cta) return "";
  const { U, lib } = ctx;
  const { esc, attr } = lib;
  const c = profile.cta;
  const text = c.text ? `<p>${esc(c.text)}</p>` : "";
  return (
    `\n    <section class="cta-band">` +
    `\n      <div class="container"><div class="cta-inner">` +
    `<h2>${esc(c.title)}</h2>${text}` +
    `<div class="cta-actions"><a class="btn btn-light btn-lg" href="${attr(navHref(U, c.button.url))}">${esc(c.button.text)}</a></div>` +
    `</div></div>` +
    `\n    </section>`
  );
}

/* ---------- JSON-LD pelengkap: EducationalOrganization ----------
   TAMBAHAN (additive) untuk AEO/SEO — TIDAK menggantikan skema inti
   (WebSite/Breadcrumb tetap dari ctx.seo). Pola sama seperti tema
   company yang menambah FAQPage. Hanya dirender di beranda halaman 1. */
function orgSchema(ctx, profile) {
  const { config, U } = ctx;
  const k = profile.kontak;
  const node = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: config.title,
    url: U.baseUrl + "/",
    description: config.description || profile.hero.subheadline,
  };
  if (config.defaultOgImage) node.logo = U.abs(config.defaultOgImage);
  if (k.phone) node.telephone = k.phone;
  if (k.email) node.email = k.email;
  if (k.address) node.address = { "@type": "PostalAddress", streetAddress: k.address };
  const sameAs = [];
  const s = config.social || {};
  if (s.facebook) sameAs.push(/^https?:/i.test(s.facebook) ? s.facebook : "https://facebook.com/" + s.facebook);
  if (s.instagram) sameAs.push("https://instagram.com/" + s.instagram);
  if (s.youtube) sameAs.push(/^https?:/i.test(s.youtube) ? s.youtube : "https://youtube.com/" + s.youtube);
  if (sameAs.length) node.sameAs = sameAs;
  return `\n      <script type="application/ld+json">${JSON.stringify(node).replace(/</g, "\\u003c")}</script>`;
}

module.exports = {
  hero, stats, programs, profil, fasilitas, pengajar, berita, testimoni, kontak, ctaBand, orgSchema,
};

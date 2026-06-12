/* ============================================================
   plugins/gitproperty/plugin.js — Plugin Gitproperty (untuk GitCMS)
   ------------------------------------------------------------
   Pendamping tema "Gitproperty". Saat AKTIF, plugin ini:

   1. (ADMIN) Mengaktifkan kotak "Properti" pada editor artikel —
      kotak ini dideklarasikan di panel admin (model/) dan hanya
      tampil bila plugin ini aktif, persis seperti plugin FAQ.
      Lewat kotak itu, field listing (harga, tipe, kamar, luas, dll)
      disimpan ke frontmatter post — TANPA perlu mengedit Markdown.

   2. (BUILD) Menyuntikkan schema.org "Product/RealEstateListing"
      (JSON-LD) untuk setiap post yang merupakan listing properti
      (punya `properti: true` atau `harga`). Ini memperkaya hasil
      pencarian & Answer Engine (AEO) — harga, lokasi, kamar, luas.

   Kontrak GitCMS dipatuhi: inti menyediakan data (ctx), plugin
   menambah JSON-LD via hook `filterSeo`. Schema hanya disuntik pada
   halaman post tunggal (ctx.post), bukan beranda/arsip. Plugin ini
   self-contained (tidak meng-import berkas tema) sehingga aman di
   tema mana pun.
   ============================================================ */

/* ---------- Util baca field properti (mandiri) ---------- */
function parsePrice(v) {
  if (typeof v === "number" && isFinite(v)) return v;
  var digits = String(v == null ? "" : v).replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

function isProperty(node) {
  if (!node || !node.meta) return false;
  var m = node.meta;
  if (m.properti === true || m.properti === "true") return true;
  return parsePrice(m.harga) > 0;
}

function intval(v) {
  var n = parseInt(v, 10);
  return isNaN(n) ? 0 : n;
}

module.exports = {
  id: "gitproperty",
  name: "Gitproperty — Properti",
  description:
    "Pendamping tema Gitproperty. Menambahkan kotak Properti pada editor (harga, tipe, kamar, luas, sertifikat, dll) dan menyuntikkan schema Product/RealEstateListing untuk listing demi SEO/AEO.",
  version: "1.0.0",

  hooks: {
    /* ---- Schema Product/RealEstateListing untuk halaman listing ---- */
    filterSeo: function (seo, ctx) {
      // Hanya pada post tunggal yang merupakan listing properti.
      var post = ctx && ctx.post;
      if (!isProperty(post)) return seo;

      var U = ctx.U;
      var m = post.meta || {};
      var price = parsePrice(m.harga);
      var url = U ? U.abs(post.permalink) : post.permalink;
      var image = post.ogImage || (post.featuredImage && U ? U.abs(post.featuredImage) : "");

      // Properti tambahan (hanya yang terisi).
      var extra = [];
      function add(name, value) {
        if (value === "" || value == null) return;
        extra.push({ "@type": "PropertyValue", name: name, value: value });
      }
      add("Tipe Properti", m.tipe_properti);
      add("Status", m.tipe_listing);
      if (intval(m.kamar_tidur)) add("Kamar Tidur", intval(m.kamar_tidur));
      if (intval(m.kamar_mandi)) add("Kamar Mandi", intval(m.kamar_mandi));
      if (intval(m.luas_bangunan)) add("Luas Bangunan", intval(m.luas_bangunan) + " m²");
      if (intval(m.luas_tanah)) add("Luas Tanah", intval(m.luas_tanah) + " m²");
      if (intval(m.carport)) add("Carport", intval(m.carport));
      add("Sertifikat", m.sertifikat);

      var ld = {
        "@context": "https://schema.org",
        "@type": ["Product", "RealEstateListing"],
        name: post.meta.title,
        description: post.excerpt || post.meta.title,
        url: url,
      };
      if (m.tipe_properti) ld.category = String(m.tipe_properti);
      if (image) ld.image = image;
      if (m.lokasi) {
        ld.areaServed = String(m.lokasi);
        ld.address = { "@type": "PostalAddress", addressLocality: String(m.lokasi), addressCountry: "ID" };
      }
      if (extra.length) ld.additionalProperty = extra;
      if (price > 0) {
        ld.offers = {
          "@type": "Offer",
          price: price,
          priceCurrency: "IDR",
          availability: "https://schema.org/InStock",
          url: url,
        };
      }

      seo.jsonLd = (seo.jsonLd || []).concat([ld]);
      return seo;
    },
  },
};

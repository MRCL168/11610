/* ============================================================
   theme.js — Pemuat tema (CORE)
   Tugas: berdasarkan config.theme, temukan folder tema aktif,
   muat template (fungsi murni (ctx) => HTML), baca manifest
   theme.json, dan hitung CSS variable dari opsi tema.

   KONTRAK: core menyediakan data, tema memutuskan tampilannya.
   Engine tidak pernah tahu seperti apa HTML-nya; ia hanya memanggil
   fungsi template milik tema aktif.
   ============================================================ */

const fs = require("fs");
const path = require("path");

// Template yang WAJIB disediakan setiap tema.
const REQUIRED_TEMPLATES = {
  home: "home.js",
  post: "post.js",
  page: "page.js",
  archive: "archive.js",
  notFound: "not-found.js",
};

/**
 * Muat tema aktif.
 * @returns {{ name, dir, assetsDir, templates, manifest, vars }}
 */
function loadTheme(config, ROOT) {
  const name = (config.theme || "default").trim();
  const dir = path.join(ROOT, "themes", name);

  if (!fs.existsSync(dir)) {
    throw new Error(
      `Tema "${name}" tidak ditemukan di themes/${name}/. ` +
      `Periksa field "theme" pada config.json, atau buat folder temanya.`
    );
  }

  const templatesDir = path.join(dir, "templates");
  const templates = {};
  for (const [key, file] of Object.entries(REQUIRED_TEMPLATES)) {
    const full = path.join(templatesDir, file);
    if (!fs.existsSync(full)) {
      throw new Error(`Tema "${name}" tidak memiliki templates/${file}. Template ini wajib ada.`);
    }
    // Muat ulang dari disk setiap build (hindari cache require basi saat dev).
    try { delete require.cache[require.resolve(full)]; } catch (_) {}
    templates[key] = require(full);
  }

  const manifest = readManifest(dir, name);
  const vars = computeThemeVars(manifest, config);

  return { name, dir, assetsDir: path.join(dir, "assets"), templates, manifest, vars };
}

/* ---------- Baca theme.json (manifest) ---------- */
function readManifest(dir, name) {
  const file = path.join(dir, "theme.json");
  if (!fs.existsSync(file)) return {};
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    console.warn(`⚠ themes/${name}/theme.json tidak valid, diabaikan:`, e.message);
    return {};
  }
}

/* ---------- Hitung CSS variable dari opsi tema ----------
   Hanya menghasilkan variabel untuk opsi yang DI-OVERRIDE oleh
   pemilik situs (config.themeOptions). Bila tidak ada override,
   objeknya kosong sehingga tema memakai nilai default dari
   stylesheet — output situs tetap sama persis.

   Nama variabel = "--" + kunci opsi (mis. accent → --accent),
   sesuai pola yang dipakai di assets/style.css (var(--accent)). */
function computeThemeVars(manifest, config) {
  const options = (manifest && manifest.options) || {};
  const overrides = (config && config.themeOptions) || {};
  const vars = {};
  for (const key of Object.keys(options)) {
    const hasOverride =
      Object.prototype.hasOwnProperty.call(overrides, key) &&
      overrides[key] !== "" &&
      overrides[key] != null;
    if (hasOverride) vars["--" + key] = String(overrides[key]);
  }
  return vars;
}

module.exports = { loadTheme, REQUIRED_TEMPLATES };

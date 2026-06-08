# Changelog

## Tema baru: "Company Profile"

Tema kedua untuk GitCMS — tampilan **company profile yang bersih & profesional**.
Berbeda dari tema `default` (berorientasi blog), beranda tema ini berbentuk
**landing page**: hero → statistik → layanan → tentang → wawasan terbalik → CTA band.

### Isi tema (`themes/company/`)
- **`theme.json`** — opsi `accent` (warna aksen, default `#2d54c8`).
- **`assets/style.css`** — gaya minimalis korporat: banyak ruang putih, garis tipis (hairline), satu aksen tegas, bayangan halus seperlunya. Tipografi **Bricolage Grotesque** (judul) + **Hanken Grotesk** (teks).
- **`assets/script.js`** — header lengket dengan status saat di-scroll, drawer mobile, submenu accordion.
- **`templates/`** — `home` (landing), `post`, `page`, `archive`, `not-found`.
- **`templates/partials/`** — `layout`, `head` (SEO lengkap dari `ctx.seo`), `header` (dengan tombol CTA), `footer` (widget + kolom brand/tautan/kontak), `post-card`, `icons` (sosial + ikon layanan), `profile` (penyusun data konten).

### Sumber konten beranda: `config.profile` (opsional)
Tema membaca objek opsional **`config.profile`** dan memberi fallback aman, sehingga
beranda tetap rapi walau belum diisi. Objek ini **aditif** — diabaikan oleh tema lain.

| Field | Fungsi |
|---|---|
| `eyebrow`, `headline`, `subheadline` | Teks hero (fallback ke `title`/`description`) |
| `primaryCta`, `secondaryCta` | Tombol hero `{ text, url }` (CTA utama juga muncul di header) |
| `heroImage` | Gambar hero opsional (tanpa gambar → hero rata-tengah) |
| `stats[]` | `{ value, label }` — muncul bila ≥ 2 item |
| `services[]` | `{ icon, title, text }` — `icon`: spark, layers, chart, shield, chat, rocket, globe, gear, pen, target, clock, users, check |
| `servicesTitle`, `servicesEyebrow`, `servicesIntro` | Judul/pengantar seksi layanan |
| `about` | `{ eyebrow, title, text, image, points[] }` |
| `ctaBand` | `{ title, text, button{ text, url } }` |

Seksi hanya tampil bila datanya ada. URL CTA mendukung tautan internal (otomatis
diawali `basePath`) maupun eksternal/`mailto:`/anchor (`#layanan`, dll).

### Cara mengaktifkan
Set `"theme": "company"` di `config.json`, atau pilih lewat menu **Tema** di CMS.
File `config.json` contoh sudah menyertakan blok `profile` demo (boleh diedit/dihapus).

### Verifikasi
- Build sukses dengan tema aktif (`Tema aktif: "company"`); seluruh jenis halaman (beranda, artikel, halaman statis, arsip kategori/tag, 404) ter-render dengan benar.
- Semua file JS lolos `node --check`; `theme.json` & `config.json` valid.
- `<head>` memuat font tema, meta/Open Graph/Twitter, JSON-LD, dan stylesheet — SEO tetap utuh karena `head.js` merender `ctx.seo` dari inti.

---

## Refactor: Arsitektur Tema (Theme Roadmap)

Memindahkan GitCMS dari template monolitik menjadi sistem **berbasis tema** seperti
WordPress. Seluruh kustomisasi tampilan kini hidup di `themes/<nama>/`, sementara
inti (`build/` + `admin/`) tetap stabil.

**Kontrak:** *inti menyediakan data, tema memutuskan tampilannya.*

### Fase 1 — Pisahkan template ke tema
- `build/templates.js` (monolitik) **dibongkar** menjadi:
  - `themes/default/templates/{home,post,page,archive,not-found}.js` — fungsi murni `(ctx) => HTML`.
  - `themes/default/templates/partials/{layout,head,header,footer,post-card,icons}.js`.
- Helper bersama (`esc`, `attr`, `slugify`, `formatDate`, `makeUrlHelpers`) dipindah ke inti: **`build/util.js`**.

### Fase 2 — Tema dapat dipilih
- `config.json` menambah field **`"theme"`** (default `"default"`) dan **`"themeOptions"`**.
- **`build/theme.js`** (baru): menemukan folder tema aktif, memuat & memvalidasi 5 template wajib, membaca `theme.json`.
- `theme/style.css` & `theme/script.js` dipindah ke **`themes/default/assets/`**. URL publik tetap `/theme/style.css` (tidak ada link yang rusak).

### Fase 3 — SEO & opsi tema
- **`build/seo.js`** (baru): satu sumber untuk `title`, `description`, canonical, Open Graph, dan **JSON-LD** (WebSite / BlogPosting + BreadcrumbList). Diteruskan ke tema lewat `ctx.seo`.
- Partial `head.js` merender seluruh `<head>` dari `ctx.seo` → **tema baru otomatis SEO-ready**.
- **`theme.json`** (manifest) mendeklarasikan `options`. Nilai di `themeOptions` disuntik sebagai CSS variable ke `<head>` (`--accent`, `--fontBody`, …). Opsi default tidak ditulis → output tetap identik.

### Fase 4 — Multi-tema & panel admin
- Panel **"Tema"** baru di CMS: memilih tema (membaca folder `themes/` via GitHub API) dan menyunting opsi dari `theme.json` (input warna & dropdown).
- Menyimpan `{ theme, themeOptions }` ke `config.json` lewat mekanisme `saveSiteConfig` yang sudah ada.
- Tersedia fallback input manual bila listing folder gagal.

### Inti yang dirombak
- **`build/build.js`** menjadi *orkestrator* murni: membaca konten, membangun `ctx`, lalu memanggil template milik tema aktif. Logika slug/permalink, redirect, sitemap, RSS, robots tetap di inti.

### Pembersihan
- ❌ Dihapus: `build/templates.js`, folder `theme/`.
- 🔧 `.github/workflows/deploy.yml` kini memantau `themes/**` (sebelumnya `theme/**`).

### Verifikasi
- Output build dibandingkan byte-per-byte dengan versi sebelum refactor.
- **Seluruh halaman publik** (30+ HTML, `sitemap.xml`, `rss.xml`, `robots.txt`, stub redirect) **identik**.
- Perbedaan yang ada hanyalah yang disengaja: stempel waktu `rss.xml`, komentar/variabel `--fontBody` di `style.css`, dan penambahan panel **Tema** pada admin.
- Semua JS admin & inti lolos `node --check`.

> Catatan: panel **Tema** memanggil GitHub API saat dijalankan di browser, sehingga
> alurnya tidak diuji terhadap repo langsung di lingkungan ini — hanya divalidasi
> secara sintaksis. Uji sekali setelah di-push (buka **Tema**, ganti opsi, simpan).

### Cara membuat tema baru
Lihat bagian **"Sistem Tema"** di `README.md` (struktur folder, objek `ctx`, dan langkah menyalin `themes/default/`).

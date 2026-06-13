# Materi Demo — Tema Pesantren

Folder ini berisi contoh agar tema cepat tampil seperti screenshot.

## 1. `demo-content.json` — isi Customizer
Berisi `{ "options": {…}, "content": {…} }` untuk tema **Pesantren**
(termasuk konfigurasi **Bilah Sisi**). Dua cara memakainya:

- **Lewat menu Sesuaikan (disarankan):** buka **Sesuaikan** di admin, lalu
  isi field mengikuti nilai pada file ini.
- **Seed manual:** salin objek tersebut ke `config.json` pada
  `themeData.pesantren` → `{ "options": {…}, "content": {…} }`, lalu build.

## 2. `kontak.md` & `pendaftaran.md` — contoh halaman
Salin kedua berkas ke `content/pages/`. Kunci pemicunya ada di **front-matter**:

- `template: kontak` → halaman **Kontak** (info + peta + form pesan).
- `template: pendaftaran` → halaman **Pendaftaran Santri** (form → Google Sheet
  via Apps Script; bila URL kosong, otomatis pakai WhatsApp).

> Catatan: halaman **Kontak** & **Pendaftaran** sengaja **tanpa bilah sisi**
> (halaman konversi yang fokus). Bilah sisi muncul di artikel, arsip
> kategori/tag, dan halaman biasa lainnya — **kecuali beranda**.

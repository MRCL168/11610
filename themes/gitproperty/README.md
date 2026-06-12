# Tema Gitproperty — Agen Properti (GitCMS)

Tema untuk website **agen properti** (jual-beli rumah & tanah) dengan nuansa **biru** yang bersih dan terpercaya. Beranda tersusun: **Hero + Pencarian Properti → Property Unggulan → Property Terbaru → Berita → CTA**. Semua seksi dan jumlah properti dapat diatur dari menu **Sesuaikan**.

> Mengikuti kontrak emas GitCMS: **inti menyediakan data, tema yang merender.** Tema ini tidak menyentuh GitHub API, filesystem, maupun routing inti. SEO/JSON-LD tetap ditangani inti (`ctx.seo`) dan hanya dirender di `partials/head.js`.

## Mengaktifkan tema

1. Buka panel admin → menu **Tema** → klik **Aktifkan** pada kartu *Gitproperty* (atau set `"theme": "gitproperty"` di `config.json`).
2. Buka menu **Sesuaikan** untuk mengatur warna, teks tiap seksi, menyalakan/mematikan seksi, jumlah properti di **Unggulan** & **Terbaru**, dan **nomor WhatsApp** kontak.

## Membuat listing properti

Sebuah post menjadi **listing properti** bila frontmatter-nya memuat `properti: true` **atau** memiliki `harga`. Post tanpa keduanya dianggap **berita/artikel** dan tampil di seksi Berita.

Contoh `content/posts/rumah-bsd.md`:

```markdown
---
title: "Rumah Modern 2 Lantai di BSD City"
slug: rumah-modern-bsd-2-lantai
date: 2026-06-05
status: published
category: "Rumah Dijual"
author: "Tim Gitproperty"
tags: ["rumah", "dijual", "properti"]
excerpt: "Rumah dijual di BSD City. 4 KT, 3 KM, LB 150 m², LT 120 m²."
featured_image: "/public/images/properti/rumah-bsd.svg"

properti: true            # WAJIB menandai sebagai listing (atau cukup isi 'harga')
unggulan: true            # tampil di seksi Property Unggulan
tipe_properti: "Rumah"    # Rumah | Tanah | Apartemen | Ruko | Villa | ...
tipe_listing: "Dijual"    # Dijual | Disewa
harga: 2750000000         # angka Rupiah (boleh string "2.750.000.000")
harga_satuan: ""          # opsional, mis. "/tahun" atau "/malam" untuk sewa
lokasi: "BSD City, Tangerang"
alamat: "Cluster Greenwich, BSD City"
kamar_tidur: 4
kamar_mandi: 3
luas_bangunan: 150        # m²
luas_tanah: 120           # m²
carport: 2
sertifikat: "SHM"         # SHM | HGB | Strata Title | ...
maps: "https://maps.google.com/?q=BSD+City"
whatsapp: "6287741135796" # opsional; bila kosong, pakai nomor dari Sesuaikan → Kontak
---

Isi deskripsi properti dalam Markdown (H2/H3 untuk SEO)…
```

### Field yang muncul sebagai ikon pada kartu

Kartu properti menampilkan **harga**, **badge status** (Dijual/Disewa), **chip tipe**, **lokasi**, dan baris **ikon spesifikasi**: 🛏 kamar tidur, 🛁 kamar mandi, 🏠 luas bangunan, dan luas tanah. Field yang kosong otomatis disembunyikan (mis. *Tanah* tidak menampilkan kamar).

### Tambahan pada halaman detail

Halaman detail menampilkan: breadcrumb, galeri (`featured_image` + `galeri[]` bila ada), panel **harga**, **panel spesifikasi** lengkap (termasuk carport & sertifikat), deskripsi, tombol **Chat via WhatsApp** (pesan otomatis berisi judul + URL properti), tombol **Telepon**, dan tautan **Google Maps**.

Galeri tambahan (opsional):

```yaml
galeri:
  - "/public/images/properti/rumah-bsd.svg"
  - "/public/images/properti/rumah-bsd-2.svg"
```

## Pencarian properti

Kotak pencarian pada hero memfilter seksi **Property Terbaru** sepenuhnya di sisi-klien (tanpa server), berdasarkan: kata kunci (judul/lokasi), tipe properti, status, lokasi, **harga maksimum**, dan **kamar tidur minimum**. Pilihan *Tipe* dan *Lokasi* terisi otomatis dari data properti yang ada. Tombol **Tampilkan Semua** muncul bila jumlah properti melebihi *jumlah awal* yang diatur.

## Opsi Customizer (`theme.json`)

| Bagian | Yang bisa diatur |
|---|---|
| **Tampilan** | Warna aksen (biru) `--accent`, warna gelap hero/footer `--accentDeep` |
| **Hero** | Badge, judul, sub-judul |
| **Pencarian Properti** | Tampil/sembunyi, judul kotak, teks tombol |
| **Property Unggulan** | Tampil/sembunyi, eyebrow, judul, pengantar, **jumlah** |
| **Property Terbaru** | Tampil/sembunyi, eyebrow, judul, pengantar, **jumlah awal** |
| **Berita** | Tampil/sembunyi, eyebrow, judul, pengantar, jumlah |
| **CTA Band** | Tampil/sembunyi, judul, teks, tombol (teks + URL) |
| **Kontak** | Nomor WhatsApp & telepon (tombol header + detail properti) |

## Struktur file

```
themes/gitproperty/
  theme.json                 ← manifest + skema customize
  assets/
    style.css                ← tema biru, mobile-first
    script.js                ← drawer mobile, filter pencarian, galeri detail
  templates/
    home.js · post.js · page.js · archive.js · not-found.js
    partials/
      head.js · header.js · footer.js · layout.js
      icons.js               ← ikon SVG properti & sosial
      property.js            ← penyusun data beranda + helper properti
      post-card.js           ← kartu properti / kartu artikel
```

## Catatan

- **Mobile-first**: gaya dasar untuk ponsel, ditingkatkan via `min-width`. Navigasi memakai drawer geser kanan + scrim; di ≥861px berubah jadi menu inline dengan dropdown hover.
- Konten demo (8 listing + 2 artikel + gambar SVG di `public/images/properti/`) disertakan agar tema langsung dapat dilihat. **Aman dihapus** bila tidak diperlukan.

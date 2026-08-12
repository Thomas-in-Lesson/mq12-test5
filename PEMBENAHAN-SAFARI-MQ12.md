# PEMBENAHAN — Safari HWMI MQ 12 (Web App)

**Repo:** `thomas-in-lesson/mq12-test5`
**Live:** https://thomas-in-lesson.github.io/mq12-test5/
**Tanggal audit:** 13 Agustus 2026
**Status:** 2 dari 4 blocker awal sudah beres (nomor SOS asli, Kartu Peserta terhubung data). Sisanya di bawah.

> Kerjakan berurutan P0 → P3. Jangan lompat. P0 menyangkut keselamatan data dan privasi peserta.

---

## P0 — BLOCKER (selesaikan sebelum link disebar ke peserta)

### P0-1 · Tutup akses publik ke data peserta

**Masalah:** `peserta.json` (83 KB, 426 entri berisi nama asli + hotel + nomor kamar + bus) bisa diunduh siapa saja tanpa autentikasi. `robots.txt` = 404, tidak ada `noindex`, sehingga Google bebas mengindeks. Autocomplete menampilkan nomor kamar orang lain hanya dengan mengetik 2 huruf sembarang.

**Kerjakan:**

- [ ] Buat `robots.txt` di root repo:
  ```
  User-agent: *
  Disallow: /
  ```
- [ ] Tambahkan di `<head>` **semua** file `code.html` dan `index.html`:
  ```html
  <meta name="robots" content="noindex, nofollow, noarchive">
  ```
- [ ] Di `site-navigation.js`, hapus nomor kamar dari dropdown autocomplete. Ganti baris render item menjadi nama saja:
  ```js
  autoBox.innerHTML = matches.map(k =>
    `<div class="personal-autocomplete-item" data-name="${data[k].name}">${data[k].name}</div>`
  ).join('');
  ```
- [ ] Naikkan ambang autocomplete dari 2 karakter menjadi **4 karakter**.

**Opsional tapi disarankan:** gerbang kode akses sederhana. Satu kata sandi disebar via grup WA panitia, disimpan di `localStorage`, tanpa itu `peserta.json` tidak di-fetch.

**Selesai bila:** `curl https://…/peserta.json` masih 200 (tidak bisa dihindari di GitHub Pages), tetapi tidak terindeks mesin pencari, dan dropdown tidak lagi membocorkan nomor kamar orang lain.

---

### P0-2 · Restrukturisasi `peserta.json` — satu peserta, banyak malam

**Masalah:** struktur sekarang `nama → satu objek`, sehingga satu orang hanya bisa punya **satu** hotel. Padahal rutenya melintasi 6 kota (Gresik, Semarang, Pemalang, Solo, Cianjur, Jakarta) dan tiap peserta menginap di beberapa hotel.

Ditemukan **34 grup nama sama dengan data berbeda, dan nol yang konsisten** — bukti bahwa ini baris malam/kota berbeda yang tergencet, bukan typo acak:

```
ikhlasul muttaqin       → Hotel Sahid Solo    Kamar 5      Bus 3
m ikhlasul muttaqin     → Hotel Sahid Solo    Kamar 20     Bus 1
muh. ikhlasul muttaqin  → Hotel Gresik        Kamar 1006   Bus 1

m fatihul aziz          → Hotel Sahid Solo         Kamar 4    Bus 1
m. fatihul aziz         → Hotel Gresik             Kamar 501  Bus 2
fatihul aziz            → Hotel R-Gina Pemalang    Kamar 27   Bus 3
```

Akibatnya peserta mendapat kamar berbeda tergantung cara dia mengetik namanya sendiri.

**Skema target:**

```json
{
  "ikhlasul-muttaqin": {
    "name": "M. Ikhlasul Muttaqin",
    "aliases": ["ikhlasul muttaqin", "m ikhlasul muttaqin", "muh ikhlasul muttaqin"],
    "sesi": 3,
    "transport": { "sesi": 3, "unit": "Bus 4", "kursi": "12A" },
    "menginap": [
      { "urutan": 1, "kota": "Gresik",   "hotel": "Hotel Gresik",           "kamar": "1006", "tipe": "Twin Bed" },
      { "urutan": 2, "kota": "Solo",     "hotel": "Hotel Sahid Solo",       "kamar": "5",    "tipe": "Deluxe" },
      { "urutan": 3, "kota": "Pemalang", "hotel": "Hotel R-Gina Pemalang",  "kamar": "27",   "tipe": "Deluxe" }
    ]
  }
}
```

**Kerjakan:**

- [ ] Tulis skrip `tools/audit-peserta.js` yang membaca `peserta.json` lama, mengelompokkan alias (normalisasi: lowercase, buang tanda baca, buang prefiks `m/muh/moh/muhammad/bpk/ibu/bu/pak/mba/mbak`), lalu mengeluarkan `konflik.csv` berisi 34 grup yang perlu diverifikasi panitia.
- [ ] Serahkan `konflik.csv` ke panitia akomodasi untuk dikonfirmasi.
- [ ] Bangun ulang `peserta.json` dengan skema di atas.
- [ ] Sesuaikan `renderProfile()` di `site-navigation.js` agar menampilkan **seluruh daftar menginap**, bukan satu baris.

**Dua angka yang wajib dikonfirmasi ke panitia:** jumlah peserta sebenarnya (426 entri ≈ 383 nama ternormalisasi), dan siapa menginap di mana pada malam ke berapa.

**Selesai bila:** mengetik tiga variasi ejaan nama yang sama menghasilkan profil identik.

---

### P0-3 · Perbaiki pencocokan nama (mesin salah-orang)

**Masalah:** `find(k => k.includes(q) || q.includes(k))` — dua arah, ambil hasil pertama, tanpa skor. Terdapat **98 key yang merupakan substring key lain**. Hasil uji pada data asli:

| Ketik | Yang muncul | Kamar |
|---|---|---|
| `ali` | Bpk A Ghozali | Cianjur, Kamar 106 |
| `ana` | Bpk Irfan Fanani | Solo, Kamar 2 |
| `nur` | Bpk Nurhadi | Cianjur, Kamar 102 |
| `rohman` | Afiq Nur Rohman | Solo, Kamar 57 |

**Kerjakan:**

- [ ] Hapus arah `q.includes(k)` sepenuhnya.
- [ ] Cocokkan hanya lewat key kanonik + array `aliases` (exact match).
- [ ] Kalau tidak ada exact match, jalankan pencarian prefiks kata (`startsWith` per kata), minimal 4 karakter.
- [ ] **Jika kandidat lebih dari satu, jangan pilih otomatis.** Tampilkan daftar dan minta pengguna memilih.
- [ ] Jika nol kandidat, tampilkan "Nama belum terdaftar — hubungi PIC" (jangan diam).

**Selesai bila:** tidak ada satu pun query yang mengembalikan orang lain secara diam-diam.

---

### P0-4 · Bersihkan baris sampah spreadsheet

**Masalah:** 7 baris non-peserta ikut terekspor sebagai entri, termasuk header kolom `"nama"`:

```
"nama"     → NAMA       Hotel R-Gina Pemalang   Kamar 62
"driver"   → Driver     Hotel Sahid Solo        Kamar 14
"perawat"  → Perawat    Hotel Sahid Solo        Kamar 14
"patwal"   → Patwal     Hotel Oak Tree          Kamar 621
"crew bus" → Crew Bus   Hotel Sahid Solo        Kamar 6
"zona 1"   → Zona 1     Hotel Gresik            Kamar 920
"zona 3"   → Zona 3     Swiss-Belhotel Jakarta  Kamar 52
```

**Kerjakan:**

- [ ] Hapus ketujuh entri dari `peserta.json`.
- [ ] Kalau kamar untuk kru/driver/perawat memang dialokasikan, pindahkan ke berkas terpisah `kru.json` yang tidak masuk pencarian peserta.
- [ ] Tambah validasi di skrip ekspor: tolak baris yang `name` cocok dengan daftar kata terlarang (`nama`, `no`, `peserta`, `kamar`, `bus`, `zona *`).

---

### P0-5 · Samakan data transport dengan halaman Denah Bus

**Masalah:** halaman Denah Bus menyatakan **Sesi 1 = ELF 1–8**, **Sesi 2 = belum tersedia**, **Sesi 3 = Bus 1–6**. Sementara `peserta.json` hanya punya `Bus 1`, `Bus 2`, `Bus 3` tanpa field sesi.

Distribusinya mustahil: Bus 1 = 145 orang, Bus 2 = 153, Bus 3 = 128 — bus besar muat ~50 kursi.

**Kerjakan:**

- [ ] Konfirmasi ke panitia: apa arti "Bus 1/2/3" di sumber data — armada, zona, atau kolom sisa?
- [ ] Tambahkan field `sesi` pada setiap peserta.
- [ ] Isi `transport.unit` sesuai sesi: `ELF 1–8` untuk Sesi 1, `Bus 1–6` untuk Sesi 3.
- [ ] Untuk Sesi 2 yang denahnya belum ada, tampilkan "Denah Sesi 2 belum tersedia" — jangan tampilkan tebakan.

**Selesai bila:** peserta Sesi 1 melihat "ELF 5", peserta Sesi 3 bisa melihat Bus 4–6.

---

## P1 — FUNGSI YANG TIDAK BERJALAN

### P1-1 · Pindahkan meta tag sosial ke HTML statis

**Masalah:** `og:title`, `og:description`, `theme-color`, dan `<link rel="manifest">` disuntik lewat JavaScript di `site-navigation.js` baris 51–57. **Crawler WhatsApp, Telegram, dan Facebook tidak menjalankan JavaScript.** Preview link di grup WA tetap kosong. `og:image` belum ada sama sekali.

**Kerjakan:**

- [ ] Hardcode blok berikut di `<head>` **semua** halaman:
  ```html
  <meta name="theme-color" content="#280905">
  <meta name="description" content="Panduan resmi Safari Chubbul Wathon Minal Iman — Maqooshidul Qur-aan 12. Informasi kamar, bus, tata tertib, dan panduan musafir.">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Safari HWMI MQ 12">
  <meta property="og:description" content="Panduan resmi Safari Chubbul Wathon Minal Iman 12 — kamar, bus, rundown, dan tata tertib.">
  <meta property="og:image" content="https://thomas-in-lesson.github.io/mq12/og-cover.jpg">
  <meta property="og:url" content="https://thomas-in-lesson.github.io/mq12/">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="manifest" href="/mq12/manifest.json">
  <link rel="apple-touch-icon" href="/mq12/icon-180.png">
  <link rel="icon" href="/mq12/favicon.ico" sizes="any">
  ```
- [ ] Buat `og-cover.jpg` ukuran **1200×630** berisi logo + judul kegiatan, simpan di repo.
- [ ] Hapus `addMetaIfMissing` dan `addLinkIfMissing` dari `site-navigation.js`.
- [ ] Samakan nilai `theme-color`: sekarang bentrok — `nav.js` memakai `#1c0704`, `manifest.json` memakai `#280905`. Pilih satu.

**Selesai bila:** link ditempel di grup WhatsApp dan muncul kartu preview dengan gambar.

---

### P1-2 · Perbaiki deep-link Kartu Peserta

**Masalah:** kartu menghasilkan `href=".../daftar_kamar_.../code.html#Solo"`, tetapi halaman daftar kamar **tidak punya penanganan `location.hash` sama sekali** (0 kemunculan) dan tidak punya anchor `id="Solo"` — halaman itu memakai tab JS `id="hotel-tabs"`. Hash diabaikan. Tautan bus mengarah ke halaman hub "Pilih sesi", bukan ke denah peserta itu.

**Kerjakan:**

- [ ] Di `daftar_kamar_safari_hwmi_mq_12/code.html`, tambahkan pembacaan hash saat load:
  ```js
  const key = decodeURIComponent(location.hash.slice(1));
  if (key) activateHotelTab(key);
  window.addEventListener('hashchange', () => {
    const k = decodeURIComponent(location.hash.slice(1));
    if (k) activateHotelTab(k);
  });
  ```
- [ ] Sorot baris kamar peserta yang bersangkutan bila ada parameter `?nama=`.
- [ ] Arahkan tautan bus langsung ke halaman denah sesi yang benar (`denah_tempat_duduk_elf` untuk Sesi 1, `denah_bus_sesi_3` untuk Sesi 3), bukan ke halaman hub.

**Selesai bila:** klik "Hotel Sahid Solo — Kamar 5" langsung membuka tab Solo dengan kamar tersorot.

---

### P1-3 · Aksesibilitas modal SOS

**Masalah:** hasil grep pada `site-navigation.js` — nol `role="dialog"`, nol `aria-modal`, nol handler `Escape`, nol focus trap. Drawer hamburger juga belum punya `aria-expanded`. Ini fitur darurat; layak diperbaiki.

**Kerjakan:**

- [ ] Tambahkan `role="dialog"` dan `aria-modal="true"` pada `.site-sos-modal-overlay`.
- [ ] Tambahkan `aria-labelledby` yang menunjuk ke judul modal.
- [ ] Tutup dengan tombol `Escape`.
- [ ] Pindahkan fokus ke tombol tutup saat modal terbuka; kembalikan ke pemicu saat ditutup.
- [ ] Kurung fokus di dalam modal selama terbuka (focus trap).
- [ ] Tambahkan `aria-expanded` yang diperbarui pada tombol hamburger.

---

## P2 — OFFLINE & PWA

### P2-1 · Hentikan Tailwind Play CDN, jadikan CSS statis

**Masalah:** seluruh tampilan dibangun runtime oleh `cdn.tailwindcss.com` — bukan untuk produksi. URL-nya mengembalikan **302 → `/3.4.17?plugins=…`**; response ter-redirect bermasalah untuk `cache.put()` dan `opaqueredirect` tidak bisa diputar ulang.

Perubahan `sw.js` v2 yang menerima `type === 'opaque'` justru **berisiko**: WebKit memberi padding pada opaque response — satu entri bisa dihitung ~7 MB terhadap kuota Cache Storage. Bila kuota iOS terlampaui, **seluruh cache dibuang**, termasuk 22 halaman HTML yang tadinya sudah aman offline.

**Kerjakan:**

- [ ] Pasang Tailwind sebagai devDependency, pindahkan `tailwind.config` dari inline `<script>` ke `tailwind.config.js`.
- [ ] Build sekali: `npx tailwindcss -i src/input.css -o styles.css --minify` (perkiraan hasil 10–15 KB).
- [ ] Unduh `Noto Serif`, `Plus Jakarta Sans`, dan `Material Symbols Outlined` sebagai `.woff2`, simpan di `/fonts/`, tulis `@font-face` sendiri dengan `font-display: swap`.
- [ ] Ganti di semua halaman: hapus `<script src="https://cdn.tailwindcss.com…">`, hapus 3 `<link>` Google Fonts (Material Symbols saat ini dimuat **dua kali** — baris 6 dan 8), ganti dengan `<link rel="stylesheet" href="/mq12/styles.css">`.
- [ ] Masukkan `styles.css` dan semua `.woff2` ke `ASSETS[]` di `sw.js`.
- [ ] Kembalikan filter cache ke `type === 'basic'` saja, naikkan `CACHE_NAME` ke `v3`.

**Selesai bila:** aktifkan mode pesawat sebelum kunjungan pertama selesai → semua halaman tetap tampil lengkap dengan ikon dan warna.

---

### P2-2 · Perbaiki ikon PWA

**Masalah:** `manifest.json` masih menunjuk `lh3.googleusercontent.com/aida-public/…` (aset sementara generator, bisa hangus). File aslinya **225×220 px** tetapi dideklarasikan `192x192` **dan** `512x512` — Android akan meng-upscale jadi buram, dan karena tidak persegi akan gepeng. Belum ada `purpose: maskable`, belum ada `apple-touch-icon`, `favicon.ico` = 404.

**Kerjakan:**

- [ ] Export ulang logo sebagai PNG persegi: `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` (beri padding aman 10%), `icon-180.png` untuk iOS, `favicon.ico`.
- [ ] Simpan semuanya di repo, bukan URL eksternal.
- [ ] Perbarui `manifest.json`:
  ```json
  "icons": [
    { "src": "./icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "./icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "./icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "orientation": "portrait",
  "scope": "./"
  ```
- [ ] Masukkan semua ikon ke `ASSETS[]` di `sw.js`.

---

## P3 — POLISH

### P3-1 · Aksesibilitas dasar

- [ ] Ganti `lang="en"` → `lang="id"` di semua halaman (isi seluruhnya bahasa Indonesia).
- [ ] Logo memakai `data-alt`, bukan `alt` — ganti ke `alt="Logo Safari HWMI Maqooshidul Qur-aan 12"`.
- [ ] Tidak ada `<h1>` sama sekali di beranda. Naikkan judul utama dari `<h2>` ke `<h1>`, dan turunkan judul kartu dari `<h5>` ke `<h3>` (sekarang hierarkinya melompati `<h4>`).
- [ ] Kembalikan cincin fokus keyboard pada input — `focus:outline-none` saat ini hanya diganti perubahan warna border.
- [ ] Kontras placeholder input 4,02:1 — gagal WCAG AA. Naikkan opasitasnya.

### P3-2 · Bug konfigurasi Tailwind

- [ ] `borderRadius.full` disetel `0.75rem`, menimpa nilai bawaan `9999px`. Akibatnya logo yang seharusnya lingkaran menjadi kotak tumpul, dan badge "Personal Card" bukan pill. Kembalikan `"full": "9999px"`, buat token terpisah bila 12px memang dibutuhkan.

### P3-3 · Tata ruang

- [ ] `pt-24 pb-32` = 96 px atas + 128 px bawah. Di iPhone SE itu sekitar sepertiga layar hilang sebelum konten dimulai, padahal tidak ada header dan bottom nav hanya 60 px. Turunkan ke `pt-6 pb-24`.
- [ ] `text-[10px]` masih dipakai di 4 tempat. Audiens banyak berusia 40+ — naikkan minimal ke 12–13 px.
- [ ] Di desktop, Kartu Peserta `max-w-xl` (576 px) melayang sendirian di atas grid 3 kolom selebar 1200 px. Samakan lebarnya dengan grid, atau jadikan kartu sebagai item pertama grid.
- [ ] Terapkan `line-clamp-2` hanya di mobile — di layar lebar deskripsi terpotong padahal ruangnya cukup.

### P3-4 · Desktop & cetak

- [ ] Bottom nav di-`display:none` pada desktop, sehingga satu-satunya navigasi tersisa adalah hamburger. Tambahkan header persisten berisi logo + tautan utama untuk breakpoint `md:` ke atas.
- [ ] Tambahkan `@media print` — panitia akan mencetak rundown, daftar kamar, dan denah bus. Latar `#280905` boros tinta dan tidak terbaca. Balik ke latar putih, teks hitam, sembunyikan nav/FAB/SOS.
- [ ] Pertimbangkan `prefers-color-scheme` atau tombol mode terang. Safari adalah kegiatan luar ruang siang hari; tema gelap di bawah matahari langsung lebih sulit dibaca.

### P3-5 · Kebersihan repo

- [ ] Rename repo `mq12-test5` → `mq12`. Kata "test" muncul di tautan yang dibagikan ke peserta dan menurunkan kepercayaan.
- [ ] Rename semua `code.html` → `index.html` sehingga URL menjadi `/mq12/beranda/` alih-alih `/mq12/beranda_mobile_dark_safari_hwmi_mq_12/code.html`.
- [ ] `index.html` di root adalah duplikat beranda (21.469 vs 19.855 byte — sudah mulai berbeda). Jadikan redirect saja agar tidak ada dua salinan yang saling melenceng.
- [ ] Hapus blok penulisan ulang tautan berbasis teks di `site-navigation.js` baris 65–73 — sudah redundan sejak semua `href` ditulis nyata, dan tetap rapuh (mengubah satu kata judul kartu mematikan tautannya secara diam-diam).

---

## Ringkasan Status

| Prioritas | Butir | Isi |
|---|---|---|
| **P0** | 5 | Privasi data, struktur `peserta.json`, pencocokan nama, baris sampah, sinkron transport |
| **P1** | 3 | Meta sosial statis, deep-link kartu, aksesibilitas modal SOS |
| **P2** | 2 | Tailwind statis + font lokal, ikon PWA |
| **P3** | 5 | Aksesibilitas, bug config, tata ruang, desktop & cetak, kebersihan repo |

**Sudah beres pada revisi sebelumnya:** nomor SOS asli (11 kontak per sesi, tab Sesi 2/3, normalisasi 0→62), Kartu Peserta terhubung `peserta.json`, input 16 px anti-zoom iOS, target sentuh ≥44 px, semua `href="#"` diganti path nyata, `aria-hidden` pada ikon, `safe-area-inset`, pencarian di daftar kamar.

**Catatan penutup:** versi kemarin menampilkan placeholder yang jelas dummy sehingga peserta teliti akan curiga. Versi sekarang menampilkan nama asli, hotel asli, dan nomor kamar asli dengan autocomplete yang meyakinkan — tetapi bisa memberi jawaban salah tanpa tanda apa pun. Dari sisi risiko lapangan itu penurunan. Selesaikan P0 dulu.

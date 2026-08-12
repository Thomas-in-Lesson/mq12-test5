# PEMBENAHAN v2 — Safari HWMI MQ 12

**Repo:** `thomas-in-lesson/mq12-test5`
**Live:** https://thomas-in-lesson.github.io/mq12-test5/
**Audit:** 13 Agustus 2026 (putaran ketiga)

> Urutan kerja: **A → B → C → D**. Bagian A hanya dua perubahan kecil tapi wajib duluan — tanpa itu, semua perbaikan lain tidak akan sampai ke peserta.

---

## ✅ Sudah Terverifikasi Beres

| Item | Bukti |
|---|---|
| `robots.txt` | `Disallow: /` |
| `noindex, nofollow, noarchive` | ada di **19/19** halaman |
| `lang="id"` | 19/19 halaman |
| `theme-color` statis | `#280905`, cocok dengan `manifest.json` |
| OG tags statis | type / title / description / url |
| `<link rel="manifest">` statis | 19/19 halaman |
| Struktur data | `aliases` + `sesi` + `transport` + `menginap[]` |
| Baris sampah | `nama`/`driver`/`patwal`/`perawat`/`crew bus`/`zona` — bersih |
| `borderRadius.full` | `9999px` — logo bulat lagi |
| Deep-link `#kota` | `checkHashActiveHotel()` + `hashchange` **berfungsi** |
| Escape + `aria-modal` + `aria-expanded` | ada |
| Autocomplete | nomor kamar sudah dihapus dari dropdown |
| Kontak PIC | 60 slot, 31 nomor unik, semua format `08xxxxxxxxx` valid |

**Pemeriksaan integritas yang lolos bersih:** tidak ada kamar melebihi kapasitas (hanya satu kamar berisi 5 orang, dan itu Family 2 Bedroom di Jakarta); tidak ada kamar kosong dari 490 kamar; tidak ada kamar campur gender berdasarkan gelar; tidak ada orang menempati dua kursi di denah bus. Dari 417 penempatan kamar yang masuk ke `peserta.json`, **401 cocok persis** dengan halaman Daftar Kamar — hanya 1 yang beda.

---

## A · DUA PERUBAHAN WAJIB DULUAN

### A-1 · Naikkan `CACHE_NAME` ke v3

**Masalah:** `sw.js` **byte-identik** dengan versi sebelumnya (2711 byte, `CACHE_NAME` masih `'safari-hwmi-mq12-v2'`). Browser hanya memasang service worker baru bila **file `sw.js` berubah**. Karena tidak berubah: tidak ada install ulang, `ASSETS[]` tidak di-cache ulang, dan pengunjung lama tetap mengambil `peserta.json` **lama** (83 KB, struktur lama) dari cache.

Kode baru lalu membaca:
```js
entry.menginap    // undefined → "Detail penginapan belum terdaftar"
entry.transport   // undefined → fallback 'Bus 1' untuk SEMUA ORANG
```

- [ ] Ubah satu baris di `sw.js`:
  ```js
  const CACHE_NAME = 'safari-hwmi-mq12-v3';
  ```

Perubahan ini sekaligus mengubah byte `sw.js` sehingga SW baru terpasang dan cache lama dibuang.

**Selesai bila:** buka DevTools → Application → Cache Storage, terlihat `safari-hwmi-mq12-v3` dan `v2` sudah hilang.

---

### A-2 · Sembunyikan blok "Armada Transportasi" dari Kartu Peserta

**Masalah:** nomor bus di kartu salah untuk **3 dari 4 orang**. Hasil silang antara `peserta.json` dan halaman Denah Bus Sesi 3 (83 nama yang ada di kedua sumber):

```
cocok : 20   (24%)
BEDA  : 63   (76%)
```

```
Fathul Bahri Gilang    kartu = Bus 2  →  denah = Bus 1
Fuad Husein            kartu = Bus 2  →  denah = Bus 6
Bpk Irfan Fanani       kartu = Bus 1  →  denah = Bus 5
Bpk Ismadi             kartu = Bus 2  →  denah = Bus 6
Munta' Zemmahal        kartu = Bus 3  →  denah = Bus 1
```

Denah Sesi 3 punya **6 bus, 454 kursi terisi**. `peserta.json` hanya mengenal Bus 1/2/3 (131 + 142 + 103 = 376). Bus besar muat ~50 kursi. Nilai ini bukan armada fisik — kemungkinan kolom zona atau rombongan yang ikut terekspor.

**Yang membuatnya berbahaya:** daftar PIC sekarang berisi peran "Tim Kesehatan **Bus 1–6**". Peserta yang sakit di perjalanan akan menghubungi PIC bus yang tertulis di kartunya — padahal dia ada di kendaraan lain dengan PIC lain.

- [ ] Di `site-navigation.js`, komentari atau hapus blok render "Armada Transportasi" pada `renderCanonicalProfile`.
- [ ] Ganti dengan baris netral: *"Info armada menyusul — lihat Denah Bus"* + tautan ke halaman Denah Bus.

Kosong lebih aman daripada salah. Kembalikan setelah D-3 selesai.

---

## B · PERBAIKAN BUG FUNGSIONAL

### B-1 · Picker kandidat mati total *(fatal)*

Dua tempat menulis ke `autoBox` dengan atribut berbeda:

```js
// autocomplete saat mengetik
`<div class="personal-autocomplete-item" data-name="${data[k].name}">`

// picker saat hasil > 1   ← TIDAK ADA data-name
`<div class="personal-autocomplete-item" data-key="${normalizeInputName(m.name)}">`
```

Handler kliknya membaca `getAttribute('data-name')` → `null` → **klik tidak melakukan apa pun.**

- [ ] Samakan atribut menjadi `data-name` di kedua tempat.
- [ ] Saat item picker diklik, render profil **langsung dari objek**, jangan panggil ulang `searchParticipant()` (kalau dipanggil ulang, picker muncul lagi — lingkaran tanpa ujung). Simpan indeks kandidat, lalu panggil `renderCanonicalProfile(matches[idx])`.

---

### B-2 · Nama lengkap sendiri jatuh ke picker *(fatal)*

Simulasi pada data asli:
```
"Ikhlasul Muttaqin"      → PICKER (2)  → klik → mati
"M Ikhlasul Muttaqin"    → PICKER (2)  → klik → mati
"nur"                    → PICKER (39) → klik → mati
"ana"                    → PICKER (30) → klik → mati
"ali"                    → PICKER (18) → klik → mati
```

Dua penyebab:

**(a)** Regex pembersih prefiks butuh spasi setelah titik:
```js
n.replace(/^(m|muh|moh|muhammad)\.?\s+/, '')
```
`"M.Ikhlasul"` (tanpa spasi) lolos → jadi key `mikhlasul muttaqin` → dianggap orang lain.

- [ ] Ganti `\s+` menjadi `\s*`.

**(b)** Arah `normQ.includes(normKey)` masih ada — itu yang menarik 39 kandidat untuk "nur".

- [ ] Hapus `|| normQ.includes(normKey)` sepenuhnya.
- [ ] Kalau ada **exact match**, langsung tampilkan — jangan pernah munculkan picker.

---

### B-3 · Tampil "Kamar Kamar 4"

```js
`Kamar ${m.kamar}`        // template
"kamar": "Kamar 4"        // data
→ "Kamar Kamar 4 (Deluxe)"
```

Muncul di **setiap** baris penginapan.

- [ ] Pilih satu: buang prefiks di template, atau simpan angkanya saja di JSON. Rekomendasi: simpan `"kamar": "4"` supaya bisa diformat bebas.

---

### B-4 · Autocomplete masih membocorkan nama

Ambang 4 karakter diukur pada input **mentah**, bukan hasil normalisasi:

```
ketik "Muh. "  (5 char) → normV = ""  → includes("") true → 5 nama asli muncul
ketik "Bpk. "  (5 char) → normV = ""  → 5 nama asli muncul
ketik "Mbak "  (5 char) → normV = ""  → 5 nama asli muncul
ketik "Bpk A"  (5 char) → normV = "a" → 5 nama asli muncul
```

- [ ] Pindahkan pengecekan panjang ke **setelah** normalisasi.
- [ ] Tolak `normV` kosong atau kurang dari 4 karakter.

---

### B-5 · Kartu gagal saat offline

Yang disimpan hanya nama:
```js
localStorage.setItem('user_safari_name', entry.name);
```

Saat dibuka lagi tanpa sinyal, `loadPesertaData()` gagal → `pesertaData = {}` → nol kandidat → muncul toast **"Nama belum terdaftar di sistem"**. Peserta yang sudah terdaftar diberi tahu bahwa dirinya tidak terdaftar, tepat saat sinyal hilang.

- [ ] Simpan **objek profil lengkap** di `localStorage`, bukan hanya nama.
- [ ] Saat load, render dari cache dulu, baru segarkan di latar bila `peserta.json` berhasil diambil.

---

### B-6 · `<meta charset>` di baris 11

Deklarasi charset muncul **setelah** `<meta name="description">` yang berisi em-dash "—". Browser modern melakukan restart-parse, tapi crawler WhatsApp lebih ketat — em-dash berpotensi tampil sebagai `â€"` di preview.

- [ ] Pindahkan `<meta charset="utf-8">` ke baris pertama setelah `<head>` di semua halaman.

---

### B-7 · "Lihat Bus" masih ke halaman hub

Masih `href('seats')` → halaman "Pilih sesi perjalanan".

- [ ] Daftarkan dua halaman yatim sebagai route di `site-navigation.js` — keduanya ada di cache `sw.js` tapi tidak punya route:
  ```js
  seatsSesi1: 'denah_tempat_duduk_elf_safari_hwmi_mq_12/code.html',
  seatsSesi3: 'denah_bus_sesi_3_safari_hwmi_mq_12/code.html',
  ```
- [ ] Arahkan tombol sesuai `entry.sesi`. (Kerjakan setelah D-3.)

---

### B-8 · Meta belum lengkap

- [ ] `og:image` — belum ada sama sekali. Buat `og-cover.jpg` **1200×630** berisi logo + judul kegiatan, simpan di repo.
- [ ] `apple-touch-icon` — belum ada. iOS "Add to Home Screen" masih memakai screenshot.
- [ ] `favicon.ico` — masih 404.
- [ ] Ikon `manifest.json` masih menunjuk `lh3.googleusercontent.com/aida-public/…` (aset sementara generator). File aslinya **225×220 px** tapi dideklarasikan `192x192` **dan** `512x512`. Export ulang persegi, simpan lokal, tambahkan `"purpose": "maskable"`.

---

## C · PENGGABUNGAN VARIAN NAMA (otomatis)

Ini yang kamu minta. Bukan masalah tim pencatatan — data lapangan yang dikumpulkan lintas kota, lintas panitia, dalam waktu terbatas memang selalu begini. Yang perlu dibangun adalah lapisan yang memaafkan variasi itu.

### Sebaran masalahnya

Dari gabungan `peserta.json` + `hotelsData` di halaman Daftar Kamar, ditemukan **887 ejaan unik**. Pola yang muncul:

| Pola | Contoh nyata dari data |
|---|---|
| Pemendekan bertingkat | `Juwatono Firmansyah Abadi` · `Juwatono Firmansyah A` · `Juwatono Firmansyah` · `J Firmansyah Abadi` |
| Inisial menggantikan kata | `Ananda Mustika Sari` · `Ananda Mustika S` · `Ananda Mustika` |
| Varian transliterasi Arab | `Yonsania Nur Fadhilah` · `Fadhilla` · `Fadilah` · `Fadillah` · `N Fadhila` |
| Apostrof tidak konsisten | `Lu'lu' Khoirunnisa'` · `Lulu' Khoirunnisa` · `Lu'lu Khoirunisa` |
| Prefiks M./Muh./Bpk | `M Ikhlasul Muttaqin` · `Muh. Ikhlasul Muttaqin` · `M.Ikhlasul Muttaqin` |
| Kapital & spasi ganda | `Fatimah BInti Maimun` · `Juwatono  Firmansyah Abadi` |

Contoh yang kamu sebutkan (`Thousan Ahmad Alin HS` / `Thousan A. A. H. S.` / `Thousand A` / `Thousan Alin A H S`) persis pola nomor 1 dan 2 digabung — dan memang muncul di data ini.

---

### C-1 · Bangun `tools/merge-nama.js`

Algoritma di bawah **sudah saya uji pada data asli** dan lolos semua kasus uji.

**Langkah 1 — Tokenisasi**
- Huruf kecil semua, buang apostrof dan tanda baca selain titik
- Buang gelar: `bpk, pak, ibu, bu, mba, mbak, drs, hj, ny, kh, ust, ustadz, ustadzah, h`
- Pecah per spasi, buang titik di ujung token

**Langkah 2 — Normalisasi fonetik** (untuk varian transliterasi)
```
kh→h   dh→d   ts→s   sh→s   ch→h
y→i    j→z    q→k    f→p
huruf kembar → tunggal      buang semua vokal
```
Dengan ini `fadhilah`, `fadilah`, `fadillah`, `fadhilla` menjadi identik.

**Langkah 3 — Kecocokan antar kata**
- Sama persis, **atau**
- Bentuk fonetiknya sama, **atau**
- Salah satu awalan dari yang lain (keduanya ≥4 huruf), **atau**
- Salah satu berupa inisial 1 huruf dan huruf pertamanya sama

**Langkah 4 — Kecocokan antar nama** (tiga syarat, semua wajib)
1. Nama pendek harus bisa "dilangkahi" di dalam nama panjang **dengan urutan terjaga**
2. Kata pertama kedua nama harus cocok
3. **Minimal 2 kata penuh (≥4 huruf) cocok utuh** — ini kunci anti-salah-gabung

Tanpa syarat nomor 3, algoritma menggabungkan `Ahmad Nurdiansyah` dengan `Anis Nurlaili` lewat jembatan `A Nurdiansyah`. Saya sudah membuktikannya — jangan hilangkan syarat ini.

**Langkah 5 — Pembeda dari data kamar**
Bila dua ejaan muncul di **kota yang sama**, mereka orang berbeda. Tolak penggabungan.

**Langkah 6 — Verifikasi anti-rantai**
Union-find bisa menyambung A–B–C padahal A dan C tidak berhubungan. Setelah klaster terbentuk, ambil ejaan terpanjang sebagai kanonik, lalu **uji ulang setiap anggota terhadap kanonik**. Yang tidak lolos, keluarkan jadi klaster sendiri.

- [ ] Implementasikan enam langkah di atas.

**Hasil uji pada data asli:**
```
887 ejaan unik  →  281 klaster
266 klaster berisi >1 ejaan
4 pasangan ditolak karena berada di kota yang sama
12 ejaan dikeluarkan karena efek rantai
```

**Kasus uji yang WAJIB tetap terpisah** (semua lolos):
```
Dwi Lestari           vs  Putri Lestari
Ikhlasul Abror        vs  Ikhlasul Muttaqin
Fatimah Binti Maimun  vs  Fatimah Ratna Dewi
Muchtar Amin          vs  Umar Muchtar A
M Alam Sahrul         vs  M Ali Ridlo
Bpk Nurhadi           vs  Nur Hilmiyatul Azizah
Ahmad Syarifuddin     vs  Ananda Mustika
Ahmad Nurdiansyah     vs  Anis Nurlaili
```

**Kasus uji yang WAJIB tergabung** (semua lolos):
```
Juwatono Firmansyah Abadi  ↔  J Firmansyah Abadi
Yonsania Nur Fadhilah      ↔  Yonsania Nur Fadilah
Ananda Mustika Sari        ↔  Ananda Mustika S
Lu'lu' Khoirunnisa'        ↔  Lulu' Khoirunnisa
Devi Nuria Arsanti         ↔  Devi Nuriya Arsanti
```

- [ ] Masukkan kedua daftar ini sebagai test suite. Kalau nanti algoritma diubah, jalankan ulang.

---

### C-2 · Pilih nama kanonik

- [ ] Ambil ejaan dengan **jumlah kata terbanyak**; bila seri, ambil yang **paling panjang hurufnya**; bila masih seri, ambil yang kapitalisasinya paling rapi (bukan huruf kecil semua).
- [ ] Simpan **semua** varian ke `aliases[]`, termasuk versi huruf kecil.

Contoh keluaran:
```json
"juwatono-firmansyah-abadi": {
  "name": "Juwatono Firmansyah Abadi",
  "aliases": [
    "juwatono firmansyah abadi",
    "juwatono firmansyah a",
    "juwatono firmansyah",
    "j firmansyah abadi"
  ]
}
```

---

### C-3 · Laporan untuk panitia

- [ ] Keluarkan `laporan-nama.csv` dengan tiga bagian:
  - **GABUNG** — klaster hasil penggabungan, kanonik + semua varian
  - **RAGU** — pasangan yang cocok sebagian tapi ditolak salah satu syarat, perlu mata manusia
  - **TUNGGAL** — ejaan yang tidak punya pasangan sama sekali

Panitia cukup memeriksa bagian RAGU. Bagian GABUNG hanya perlu dibaca sekilas.

---

### C-4 · Pencarian di aplikasi ikut memaafkan

- [ ] Terapkan normalisasi fonetik yang sama di `normalizeInputName()`.
- [ ] Cocokkan terhadap seluruh `aliases[]`, bukan hanya `name`.
- [ ] Peserta boleh mengetik ejaan mana pun — semua harus mendarat di profil yang sama.

**Selesai bila:** mengetik `Thousan A`, `Thousan Ahmad Alin HS`, dan `Thousand A.A. H. S.` menghasilkan profil identik.

---

## D · PERBAIKAN DATA

### D-1 · Ekstrak ulang `menginap[]` — 63% data hilang

**Masalah:** halaman Daftar Kamar menyimpan **1.137 penempatan**. `peserta.json` hanya membawa **417**.

| Malam/kota | Halaman Daftar Kamar | Kartu Peserta |
|---|---|---|
| 1 | 190 | **341** |
| 2 | 54 | 31 |
| 3 | 37 | 3 |
| 4 | 31 | 0 |
| 5 | 49 | 1 |
| 6 | 39 | 0 |

Contoh nyata:
```
Fathul Bahri Gilang   kartu = 1 malam  |  halaman = 6 kota
Ade Iman Hidayat      kartu = 1 malam  |  halaman = 6 kota
Bpk Kushartono        kartu = 1 malam  |  halaman = 6 kota
Bpk Zakiyyul Fuad     kartu = 1 malam  |  halaman = 5 kota
```

**194 dari 376 peserta** datanya kurang. Mereka membuka kartu, melihat "Solo — Kamar 4", dan menyimpulkan itu satu-satunya kamar mereka. Lima malam lainnya tidak terlihat.

Kabar baiknya: **datanya sudah lengkap** di `daftar_kamar_.../code.html` sebagai objek `hotelsData` dengan struktur rapi (`roomNo`, `type`, `occupants[]`). Ini bukan pengumpulan data baru, hanya ekstraksi ulang.

- [ ] Tulis `tools/build-peserta.js` yang membaca `hotelsData`, menerapkan penggabungan nama dari bagian C, lalu menghasilkan `peserta.json` dengan `menginap[]` lengkap.
- [ ] Urutkan `menginap[]` sesuai urutan rute perjalanan, bukan abjad kota.
- [ ] Jadikan `hotelsData` **satu-satunya sumber** — halaman Daftar Kamar juga dirender dari sana, supaya tidak ada lagi dua salinan yang bisa melenceng.

**Selesai bila:** jumlah penempatan di `peserta.json` = 1.137, dan `Fathul Bahri Gilang` menampilkan 6 kota.

---

### D-2 · Perbaiki 1 selisih kamar

```
Ikhlasul Muttaqin — Gresik:  kartu = Kamar 1006  |  halaman = Kamar 522
```

- [ ] Konfirmasi ke panitia akomodasi mana yang benar.

---

### D-3 · Selesaikan data transportasi

**Masalah:** semua 376 peserta bersesi 3. Tidak ada satu pun Sesi 1 atau Sesi 2, padahal halaman Denah Bus menyediakan **Sesi 1 (ELF 1–8)** dan Sesi 2 ("belum tersedia"). Nomor bus juga terbatas di 1/2/3, sementara denah Sesi 3 punya Bus 1–6.

Denah Sesi 3 memuat **177 nama orang** dari 454 kursi — sisanya label peran (`Konsumsi`, `Keamanan`, `PJ.Penginapan`). Jadi denah dan `peserta.json` memang dua populasi berbeda.

- [ ] Tanyakan ke panitia: apa arti kolom "Bus 1/2/3" di sumber data — armada, zona, atau rombongan?
- [ ] Masukkan peserta Sesi 1 dan Sesi 2 yang belum ada sama sekali.
- [ ] Isi `transport.unit` sesuai sesi: `ELF 1–8` untuk Sesi 1, `Bus 1–6` untuk Sesi 3.
- [ ] Untuk Sesi 2 yang denahnya belum ada, tampilkan "Denah Sesi 2 belum tersedia" — jangan tampilkan tebakan.
- [ ] Ambil nomor bus dari **denah**, bukan dari kolom lama.
- [ ] Setelah ini benar, kembalikan blok Armada Transportasi (A-2) dan sambungkan tombol "Lihat Bus" (B-7).

---

### D-4 · 24 nama belum masuk `peserta.json`

Ada di halaman kamar tapi tidak di `peserta.json`. Sebagian varian ejaan (`m afiq nur rohman` vs `Afiq Nur Rohman`, `irfan fanani`, `fatihul aziz`), sebagian memang sengaja dibuang (`crew bus`, `driver`).

- [ ] Bagian C akan menyelesaikan sebagian besar secara otomatis. Sisanya periksa manual lewat `laporan-nama.csv`.

---

## E · POLISH (belum tersentuh)

- [ ] Tailwind Play CDN masih dipakai — build jadi `styles.css` statis, self-host font `.woff2`, lalu kembalikan filter `sw.js` ke `type === 'basic'` saja
- [ ] Material Symbols masih dimuat **dua kali** (baris duplikat di `<head>`)
- [ ] `pt-24 pb-32` — 96 px atas + 128 px bawah, sekitar sepertiga layar iPhone SE terbuang
- [ ] `text-[10px]` masih 4 tempat, dan bertambah di kartu multi-stay yang baru
- [ ] Tidak ada `<h1>`; hierarki masih h2 → h3 → h4 → h5
- [ ] Logo masih `data-alt`, bukan `alt`
- [ ] `@media print` — panitia akan mencetak rundown, daftar kamar, denah bus
- [ ] `prefers-color-scheme` / mode terang untuk kegiatan luar ruang siang hari
- [ ] Header persisten untuk desktop (bottom nav disembunyikan di `md:` ke atas)
- [ ] Penulisan ulang tautan berbasis teks di `site-navigation.js` — sudah redundan, masih aktif
- [ ] `index.html` root masih duplikat beranda (beda 22 baris, semuanya path relatif) — jadikan redirect
- [ ] Repo masih `mq12-test5`; `code.html` → `index.html` agar URL bersih

---

## Ringkasan

| Bagian | Butir | Isi |
|---|---|---|
| **A** | 2 | Cache v3, sembunyikan bus salah |
| **B** | 8 | Picker mati, regex prefiks, "Kamar Kamar", bocor autocomplete, offline, charset, route bus, meta |
| **C** | 4 | Penggabungan varian nama otomatis + laporan panitia |
| **D** | 4 | Ekstrak ulang 63% data kamar, selisih kamar, transportasi, 24 nama |
| **E** | 12 | Polish |

**Catatan urutan:** A-1 dan A-2 sekitar lima baris total, tapi tanpa A-1 semua perbaikan lain tidak sampai ke pengguna, dan tanpa A-2 kartu terus menunjukkan bus yang salah untuk mayoritas peserta. Kerjakan keduanya lebih dulu, baru sisanya.

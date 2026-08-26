// Kalimat "ATAS BERKAT ROCHMAT ALLOH YANG MAHA KUASA" di bilah atas wajib satu
// baris dan utuh di semua lebar layar HP. Jalankan: node tools/test-bilah-atas.js
//
// Sejarahnya: pernah dipasang ukuran tetap 12px, dan di layar 390px kalimat itu
// butuh 319px sementara ruang amannya cuma 282px — jadi terpotong di semua
// halaman tanpa ada yang error. Pernah juga "diperbaiki" dengan membolehkan dua
// baris, padahal kalimatnya tidak boleh dipecah. Uji ini menjaga dua-duanya.
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const nav = fs.readFileSync(path.join(__dirname, '..', 'site-navigation.js'), 'utf8');

// Ada beberapa blok .site-header-center-title span (dasar dan per-media-query).
// Yang dipakai di layar HP adalah yang ukurannya bergantung lebar layar lewat
// calc() di dalam clamp(); itu yang diuji di sini.
const semua = nav.match(/\.site-header-center-title span \{[^}]*\}/g) || [];
const aturan = semua.find((b) => /clamp\([^)]*calc\(/.test(b));
assert.ok(aturan, 'aturan ukuran huruf judul bilah atas berbasis lebar layar tidak ditemukan');
// Semua blok judul, termasuk yang dasar, harus tetap satu baris.
for (const b of semua) {
  assert.ok(!/white-space:\s*normal/.test(b), `ada blok judul yang membolehkan dua baris:\n${b}`);
}

assert.ok(/white-space:\s*nowrap/.test(aturan),
  'judul bilah atas harus white-space: nowrap — kalimatnya tidak boleh dipecah dua baris');
// Ruang aman: lebar layar dikurangi sisi kiri (tombol menu) dan kanan (lencana status).
const sisa = nav.match(/\.site-header-center-title \{\s*max-width:\s*calc\(100vw - (\d+)px\)/);
assert.ok(sisa, 'max-width judul bilah atas tidak lagi memakai calc(100vw - Npx)');
const RESERVE = Number(sisa[1]);

// clamp(min, calc(A vw - B px), max)
const c = aturan.match(/clamp\(\s*([\d.]+)px\s*,\s*calc\(\s*([\d.]+)vw\s*-\s*([\d.]+)px\s*\)\s*,\s*([\d.]+)px\s*\)/);
assert.ok(c, 'rumus ukuran huruf tidak lagi berbentuk clamp(min, calc(Avw - Bpx), max)');
const [minPx, vw, kurang, maxPx] = c.slice(1).map(Number);

// Lebar kalimat per 1px ukuran huruf, diambil dari pengukuran nyata di Chrome
// (207px @ 7,52px = 27,5). Dipakai angka paling boros supaya uji ini tidak
// lolos untuk rumus yang mepet.
const RASIO = 27.6;
const LAYAR = [320, 360, 375, 390, 414, 430];

for (const w of LAYAR) {
  const huruf = Math.min(maxPx, Math.max(minPx, (vw * w) / 100 - kurang));
  const butuh = huruf * RASIO;
  const ruang = w - RESERVE;
  assert.ok(butuh <= ruang,
    `di layar ${w}px: huruf ${huruf.toFixed(2)}px butuh ${butuh.toFixed(0)}px, ruang aman cuma ${ruang}px`);
}

// Batas bawah masih masuk akal untuk dibaca, dan batas atas tidak berlebihan.
assert.ok(minPx >= 7, `batas bawah ${minPx}px terlalu kecil untuk dibaca`);
assert.ok(maxPx <= 14, `batas atas ${maxPx}px kebesaran untuk bilah 56px`);

const contoh = LAYAR.map((w) => `${w}px→${Math.min(maxPx, Math.max(minPx, (vw * w) / 100 - kurang)).toFixed(1)}px`);
console.log(`OK — judul bilah atas tetap satu baris dan utuh di ${LAYAR.length} lebar layar `
  + `(ruang aman lebar-${RESERVE}px).`);
console.log(`   ukuran huruf: ${contoh.join(', ')}`);

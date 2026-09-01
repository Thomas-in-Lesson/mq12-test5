// Uji halaman Peta: jalankan skrip halamannya apa adanya di atas dokumen tiruan,
// lalu pastikan baris tab hari muncul hanya untuk sesi yang petanya terpisah per
// hari, dan setiap hari memuat peta miliknya sendiri.
// Jalankan: node tools/test-peta.js
//
// Dibuat saat Sesi 2 mendapat peta hari ke-1 di samping hari ke-2: sebelum ini
// satu sesi = satu peta, jadi salah menaruh mid berarti peserta menavigasi rute
// hari yang salah tanpa satu pun pesan error.
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const REPO = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(REPO, 'peta_safari_hwmi_mq_12/code.html'), 'utf8');

const skrip = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1])
  .find((s) => s.includes('sesiMapData'));
assert.ok(skrip, 'skrip sesiMapData tidak ditemukan di halaman peta');
assert.ok(html.includes('id="hari-tabs"'), 'wadah #hari-tabs hilang dari halaman');
// Tautan /edit menuntut izin edit peta; peserta hanya boleh diberi /viewer.
assert.ok(!/maps\/d\/edit\?/.test(html), 'ada tautan peta /edit di halaman, peserta tidak punya izin edit');

const el = (id) => ({ id, textContent: '', innerHTML: '', href: '', style: {}, classList: { toggle() {} } });
const simpul = {};
const document = { getElementById: (id) => (simpul[id] = simpul[id] || el(id)) };
const konteks = vm.createContext({ document, window: {} });
vm.runInContext(skrip, konteks);
const switchSesi = konteks.switchSesi;
assert.strictEqual(typeof switchSesi, 'function', 'switchSesi tidak terdefinisi');

const judul = document.getElementById('sesi-map-title');
const baris = document.getElementById('hari-tabs');
const peta = document.getElementById('map-container');
const tombol = document.getElementById('btn-open-maps');
const mid = (s) => (s.match(/mid=([\w-]+)/) || [])[1];

// Sesi 1: satu peta, baris hari disembunyikan.
switchSesi('sesi1');
assert.strictEqual(baris.style.display, 'none', 'baris hari muncul padahal Sesi 1 hanya satu peta');
assert.ok(mid(peta.innerHTML), 'iframe Sesi 1 tanpa mid');
assert.strictEqual(mid(tombol.href), mid(peta.innerHTML), 'tombol Maps App Sesi 1 menunjuk peta lain');

// Sesi 2: dua hari, dua tab, dan peta ikut berganti.
const mids = [];
for (const i of [0, 1]) {
  switchSesi('sesi2', i);
  assert.strictEqual(baris.style.display, '', 'baris hari Sesi 2 tersembunyi');
  assert.strictEqual((baris.innerHTML.match(/<button/g) || []).length, 2, 'tab hari Sesi 2 bukan dua');
  assert.ok(baris.innerHTML.includes('is-active'), 'tak ada tab hari yang aktif');
  assert.ok(/hari ke-/i.test(judul.textContent), `judul hari ke-${i + 1} tidak menyebut hari: ${judul.textContent}`);
  const m = mid(peta.innerHTML);
  assert.ok(m, `iframe hari ke-${i + 1} tanpa mid`);
  assert.strictEqual(mid(tombol.href), m, `tombol Maps App hari ke-${i + 1} menunjuk peta lain`);
  mids.push(m);
}
assert.notStrictEqual(mids[0], mids[1], 'kedua hari Sesi 2 memakai peta yang sama');

// Indeks hari di luar jangkauan jatuh ke hari pertama, bukan crash.
switchSesi('sesi2', 9);
assert.strictEqual(mid(peta.innerHTML), mids[0], 'indeks hari tak sah tidak jatuh ke hari pertama');

// Sesi 3: empat penggal perjalanan, masing-masing peta sendiri.
const mids3 = [];
for (const i of [0, 1, 2, 3]) {
  switchSesi('sesi3', i);
  assert.strictEqual(baris.style.display, '', 'baris hari Sesi 3 tersembunyi');
  assert.strictEqual((baris.innerHTML.match(/<button/g) || []).length, 4, 'tab Sesi 3 bukan empat');
  const m = mid(peta.innerHTML);
  assert.ok(m, `penggal ke-${i + 1} tanpa mid`);
  assert.strictEqual(mid(tombol.href), m, `tombol Maps App penggal ke-${i + 1} menunjuk peta lain`);
  mids3.push(m);
}
assert.strictEqual(new Set(mids3).size, 4, `empat penggal Sesi 3 memakai ${new Set(mids3).size} peta berbeda`);
assert.strictEqual(new Set([...mids, ...mids3]).size, 6, 'ada peta Sesi 2 dan Sesi 3 yang tertukar');

// Sesi tanpa peta tetap harus aman: semua sesi sudah punya peta, jadi
// cabang itu diuji lewat sesi buatan, bukan dibiarkan tak teruji.
vm.runInContext("sesiMapData.sesiUji = { title: 'Uji', active: false, embedUrl: '', mapsUrl: '' };", konteks);
switchSesi('sesiUji');
assert.strictEqual(baris.style.display, 'none', 'baris hari muncul di sesi tanpa peta');
assert.ok(!peta.innerHTML.includes('<iframe'), 'sesi tanpa peta malah merender iframe');
assert.strictEqual(tombol.style.display, 'none', 'tombol Maps App masih tampil di sesi tanpa peta');

console.log('OK — baris tab hari, mid tiap hari, dan sesi tanpa peta semua benar.');
console.log(`   Sesi 2: ${mids.length} peta. Sesi 3: ${mids3.length} peta, semuanya berbeda.`);

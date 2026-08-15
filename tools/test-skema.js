// Uji halaman Skema Foto: jalankan skrip halamannya apa adanya dengan dokumen
// PDF tiruan 15 halaman, lalu pastikan 15 kanvas benar-benar terbentuk.
// Jalankan: node tools/test-skema.js
//
// Dibuat setelah halaman ini blank berhari-hari: acuan ke #zoom-level-badge
// tertinggal setelah tombol zoom dihapus, sehingga baris pertama fungsi render
// melempar TypeError. Tidak ada error yang terlihat pengguna, hanya layar kosong.
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const REPO = path.join(__dirname, '..');
// Boleh diberi path lain lewat argumen, mis. untuk menguji versi lama.
const HAL = process.argv[2] || 'skema_foto_safari_hwmi_mq_12/code.html';
const BERKAS = [HAL, path.resolve(HAL), path.join(REPO, HAL)].find(fs.existsSync);
assert.ok(BERKAS, `halaman tidak ditemukan: ${HAL}`);
const html = fs.readFileSync(BERKAS, 'utf8');

const JUMLAH_HALAMAN = 15;
const dibuat = [];       // elemen yang dibuat skrip halaman
const dipasang = [];     // elemen yang benar-benar masuk ke container

function elemenBaru(tag) {
  const el = {
    tag, className: '', innerText: '', style: {}, width: 0, height: 0,
    anak: [],
    classList: { add() {}, remove() {}, toggle() {} },
    appendChild(c) { el.anak.push(c); },
    getContext: () => ({}),
  };
  dibuat.push(el);
  return el;
}

const wadah = {
  id: 'comic-reader-container', innerHTML: '', style: {},
  classList: { add() { wadah.tersembunyi = true; }, remove() { wadah.tersembunyi = false; } },
  appendChild(c) { dipasang.push(c); },
  addEventListener() {},
};
const kotakGagal = {
  id: 'pdf-fallback-container', tampil: false,
  classList: { add() { kotakGagal.tampil = false; }, remove() { kotakGagal.tampil = true; } },
  addEventListener() {},
};

// pdf.js tiruan: cukup meniru bentuk API yang dipakai halaman.
const pdfjsLibPalsu = {
  GlobalWorkerOptions: {},
  getDocument: (src) => {
    pdfjsLibPalsu.diminta = src;
    return {
      promise: Promise.resolve({
        numPages: JUMLAH_HALAMAN,
        getPage: () => Promise.resolve({
          getViewport: ({ scale }) => ({ width: 800 * scale, height: 1130 * scale }),
          render: () => ({ promise: Promise.resolve() }),
        }),
      }),
    };
  },
};

const ctx = {
  console: { warn() {}, error() {}, log() {} },
  setTimeout, Promise, Math, Date, JSON,
  pdfjsLib: pdfjsLibPalsu,
  document: {
    getElementById: (id) => (id === 'comic-reader-container' ? wadah
      : id === 'pdf-fallback-container' ? kotakGagal : null),
    createElement: elemenBaru,
    addEventListener() {},
  },
};
ctx.window = ctx;
vm.createContext(ctx);

const skrip = html.match(/<script>([\s\S]*?)<\/script>/)[1];
vm.runInContext(skrip, ctx);

// Perenderan asinkron; tunggu sampai selesai.
setTimeout(() => {
  assert.strictEqual(kotakGagal.tampil, false,
    'halaman jatuh ke pesan gagal padahal dokumen berhasil dibuka');
  assert.strictEqual(dipasang.length, JUMLAH_HALAMAN,
    `kartu halaman yang terpasang: ${dipasang.length}, seharusnya ${JUMLAH_HALAMAN}`);

  const kanvas = dibuat.filter((e) => e.tag === 'canvas');
  assert.strictEqual(kanvas.length, JUMLAH_HALAMAN,
    `kanvas yang dibuat: ${kanvas.length}, seharusnya ${JUMLAH_HALAMAN}`);
  assert.ok(kanvas.every((c) => c.width > 0 && c.height > 0),
    'ada kanvas berukuran nol');

  const badge = dibuat.filter((e) => /^Halaman \d+ \/ 15$/.test(e.innerText));
  assert.strictEqual(badge.length, JUMLAH_HALAMAN, 'penanda nomor halaman tidak lengkap');

  // Berkas yang dirujuk harus benar-benar ada di repo.
  for (const rel of [pdfjsLibPalsu.diminta, ctx.pdfjsLib.GlobalWorkerOptions.workerSrc]) {
    assert.ok(rel, 'sumber PDF atau workerSrc tidak diset');
    assert.ok(!/^https?:/.test(rel), `masih mengambil dari internet: ${rel}`);
    const p = path.resolve(path.dirname(BERKAS), rel);
    assert.ok(fs.existsSync(p), `berkas tidak ada: ${path.relative(REPO, p)}`);
  }

  console.log(`OK — skrip Skema Foto merender ${dipasang.length} halaman, ` +
    `${kanvas.length} kanvas, semua penanda halaman benar.`);
  console.log(`   sumber PDF : ${pdfjsLibPalsu.diminta}`);
  console.log(`   worker     : ${ctx.pdfjsLib.GlobalWorkerOptions.workerSrc}`);
}, 60);

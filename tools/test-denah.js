// Uji penautan denah lokasi. Jalankan: node tools/test-denah.js
// Yang dijaga: tiap agenda ziarah di rundown menemukan denah yang benar, dan
// baris non-ziarah tidak ikut diberi tautan.
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { ambilLiteral } = require('./merge-nama');

const REPO = path.join(__dirname, '..');
const baca = (f) => fs.readFileSync(path.join(REPO, f), 'utf8');

// DOM secukupnya supaya denah-viewer.js bisa dimuat di luar peramban.
const buatan = [];
global.window = {};
global.document = {
  currentScript: { src: 'https://contoh/mq12-test5/denah-viewer.js' },
  head: { appendChild: () => {} },
  body: { appendChild: () => {}, classList: { add: () => {}, remove: () => {} } },
  createElement: () => ({ style: {}, classList: { add: () => {}, remove: () => {} }, set innerHTML(v) { buatan.push(v); } }),
  addEventListener: () => {},
};

eval(baca('denah-data.js'));
eval(baca('denah-viewer.js'));
const V = global.window.DenahViewer;

const denah = global.window.DENAH;
assert.strictEqual(denah.sesi1.length, 8, 'Sesi 1 harus punya 8 denah');

// Berkas gambarnya benar-benar ada
for (const sesi of ['sesi1', 'sesi2', 'sesi3']) {
  for (const d of denah[sesi]) {
    for (const akhiran of ['.webp', '.jpg', '-kecil.webp', '-kecil.jpg']) {
      const p = path.join(REPO, 'denah', sesi, d.slug + akhiran);
      assert.ok(fs.existsSync(p), `berkas hilang: ${path.relative(REPO, p)}`);
    }
  }
}

// Daftar kartu
assert.strictEqual((V.daftarHTML('sesi1').match(/denah-kartu/g) || []).length, 8);
assert.strictEqual(V.daftarHTML('sesi2'), '', 'Sesi 2 belum ada datanya, harus kosong');
assert.strictEqual(V.ada('sesi1'), 8);
assert.strictEqual(V.ada('sesi3'), 0);

// Penautan dari rundown: tiap agenda ziarah harus dapat tautan, dan tepat satu
// denah, tanpa ada denah yang dipakai dua kali.
const rundown = ambilLiteral('rundown_kegiatan_safari_hwmi_mq_12/code.html', 'const rundownData');
const agendaSesi1 = rundown.sesi1.hari.flatMap((h) => h.agenda);

const indeksDari = (html) => {
  const m = /buka\('sesi1',(\d+)\)/.exec(html);
  return m ? Number(m[1]) : null;
};

const terpakai = new Map();
let tanpaTautan = [];
for (const a of agendaSesi1) {
  const html = V.tautanUntuk('sesi1', a.agenda);
  const ziarah = /^(ziaro|ziarah)/i.test(a.agenda.trim());
  if (html) {
    const i = indeksDari(html);
    assert.ok(i !== null, 'tautan tanpa indeks: ' + a.agenda);
    if (!terpakai.has(i)) terpakai.set(i, []);
    terpakai.get(i).push(a.agenda);
  } else if (ziarah) {
    tanpaTautan.push(a.agenda);
  }
}

assert.deepStrictEqual(tanpaTautan, [], 'ada agenda ziarah tanpa denah: ' + tanpaTautan.join(' | '));
assert.strictEqual(terpakai.size, 8, `denah tertaut: ${terpakai.size}, seharusnya 8`);

// Baris yang jelas bukan ziarah tidak boleh dapat tautan.
for (const bukan of ['Sarapan', 'Menuju Bus', 'ISHOMA', 'Perjalanan menuju Maqom Mbah Falal']) {
  assert.strictEqual(V.tautanUntuk('sesi1', bukan), '', `tidak boleh bertautan: ${bukan}`);
}

console.log(`OK — 8 denah Sesi 1, semua berkas ada, ${terpakai.size} agenda ziarah tertaut ke denah yang benar.`);
for (const [i, list] of [...terpakai].sort((a, b) => a[0] - b[0])) {
  console.log(`   ${denah.sesi1[i].no}. ${denah.sesi1[i].judul}  <-  ${list.join(' ; ')}`);
}

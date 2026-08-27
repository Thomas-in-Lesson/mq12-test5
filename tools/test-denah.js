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
eval(baca('profil-data.js'));
eval(baca('denah-viewer.js'));
const V = global.window.DenahViewer;

// Profil singkat: tiap lokasi berprofil slug-nya wajib sama dengan slug denah
// supaya keduanya menempel ke lokasi yang benar. Sesi 2 punya 10 profil untuk
// 11 denah — denah jalur jalan kaki Gresik memang bukan tokoh.
const PROFIL_HARAP = { sesi1: 8, sesi2: 10 };
{
  const profil = global.window.PROFIL;
  for (const [sesi, jumlah] of Object.entries(PROFIL_HARAP)) {
    const slugDenah = new Set(global.window.DENAH[sesi].map((d) => d.slug));
    assert.ok(profil && profil[sesi], `profil-data.js tidak memuat ${sesi}`);
    assert.strictEqual(profil[sesi].length, jumlah,
      `${sesi}: lokasi berprofil ${profil[sesi].length}, seharusnya ${jumlah}`);
    for (const lok of profil[sesi]) {
      assert.ok(slugDenah.has(lok.slug), `${sesi}: slug profil tidak dikenal di denah: ${lok.slug}`);
      assert.ok(lok.tokoh.length, `${sesi}: lokasi tanpa tokoh: ${lok.slug}`);
      for (const t of lok.tokoh) {
        assert.ok(t.nama && t.paragraf.length, `${sesi}: profil kosong: ${lok.slug}`);
        for (const p of t.paragraf) {
          assert.ok(p.length > 20, `${sesi}: paragraf terpotong di ${lok.slug}: ${p}`);
          assert.ok(!/\s$/.test(p), `${sesi}: paragraf berakhir menggantung di ${lok.slug}`);
        }
      }
    }
  }
}

const denah = global.window.DENAH;
assert.strictEqual(denah.sesi1.length, 8, 'Sesi 1 harus punya 8 denah');
assert.strictEqual(denah.sesi2.length, 11, 'Sesi 2 harus punya 11 denah');

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
assert.strictEqual((V.daftarHTML('sesi2').match(/denah-kartu/g) || []).length, 11);
assert.strictEqual(V.ada('sesi1'), 8);
assert.strictEqual(V.ada('sesi2'), 11);
assert.strictEqual(V.ada('sesi3'), 0);

// Penautan dari rundown: tiap agenda ziarah harus dapat tautan, dan tepat satu
// denah, tanpa ada denah yang dipakai dua kali.
const rundown = ambilLiteral('rundown_kegiatan_safari_hwmi_mq_12/code.html', 'const rundownData');

// Sesi 2 menambah dua baris bertautan yang bukan "Ziarah ...": observasi museum
// dan denah jalur jalan kaki di Gresik. Keduanya lewat lewat kolom "aksi".
function tautanSesi(sesi) {
  const terpakai = new Map();
  const tanpaTautan = [];
  for (const a of rundown[sesi].hari.flatMap((h) => h.agenda)) {
    const html = V.tautanUntuk(sesi, a.agenda);
    if (html) {
      const m = new RegExp("buka\\('" + sesi + "',(\\d+)\\)").exec(html);
      assert.ok(m, `${sesi}: tautan tanpa indeks: ${a.agenda}`);
      const i = Number(m[1]);
      if (!terpakai.has(i)) terpakai.set(i, []);
      terpakai.get(i).push(a.agenda);
    } else if (/^(ziaro|ziarah)/i.test(a.agenda.trim())) {
      tanpaTautan.push(a.agenda);
    }
  }
  assert.deepStrictEqual(tanpaTautan, [], `${sesi}: agenda ziarah tanpa denah: ${tanpaTautan.join(' | ')}`);
  assert.strictEqual(terpakai.size, denah[sesi].length,
    `${sesi}: denah tertaut ${terpakai.size}, seharusnya ${denah[sesi].length}`);
  return terpakai;
}

const tertaut = { sesi1: tautanSesi('sesi1'), sesi2: tautanSesi('sesi2') };
const terpakai = tertaut.sesi1;

// Baris yang jelas bukan tujuan ziarah tidak boleh dapat tautan. Tiga yang
// terakhir khusus Sesi 2: mengandung kata kunci "aksi" tapi bukan tujuannya.
for (const [sesi, bukan] of [
  ['sesi1', 'Sarapan'], ['sesi1', 'Menuju Bus'], ['sesi1', 'ISHOMA'],
  ['sesi1', 'Perjalanan menuju Maqom Mbah Falal'],
  ['sesi2', 'Persiapan Ziarah'], ['sesi2', 'Jalan Kaki menuju Bis'],
  ['sesi2', 'Perjalanan Menuju Makam Bung Karno'],
]) {
  assert.strictEqual(V.tautanUntuk(sesi, bukan), '', `${sesi}: tidak boleh bertautan: ${bukan}`);
}

// Halaman memanggil DenahViewer saat render pertama, jadi denah-viewer.js wajib
// dimuat SEBELUM skrip halaman. Kalau terbalik, tautannya diam-diam tidak muncul.
for (const f of ['rundown_kegiatan_safari_hwmi_mq_12/code.html',
                 'peta_safari_hwmi_mq_12/code.html']) {
  const html = baca(f);
  const viewer = html.indexOf('denah-viewer.js');
  const inline = html.indexOf('<script>');
  assert.ok(viewer >= 0, `${f}: denah-viewer.js belum dipasang`);
  assert.ok(viewer < inline, `${f}: denah-viewer.js dimuat setelah skrip halaman`);
  assert.ok(html.indexOf('denah-data.js') < viewer, `${f}: denah-data.js harus sebelum viewer`);
}

// Daftar denah di halaman peta harus dirender sekali saat halaman dibuka,
// bukan hanya ketika tab sesi ditekan.
assert.ok(/\n\s*tampilkanDenah\('sesi1'\);/.test(baca('peta_safari_hwmi_mq_12/code.html')),
  'peta: tampilkanDenah tidak dipanggil saat halaman dibuka');

// Uji sungguhan: jalankan skrip halaman Rundown persis seperti urutan di HTML,
// lalu hitung tombol denah yang benar-benar terender. Pemeriksaan inilah yang
// menangkap bug urutan skrip, karena semua uji di atas tetap lolos waktu itu.
(function ujiRender() {
  const vm = require('vm');
  const html = baca('rundown_kegiatan_safari_hwmi_mq_12/code.html');
  const kotak = {};
  const ambil = (id) => kotak[id] || (kotak[id] = {
    innerHTML: '', textContent: '', style: {},
    classList: { toggle() {}, add() {}, remove() {} },
  });
  const ctx = {
    console: { log() {} }, setTimeout, Date, Math, JSON,
    document: {
      currentScript: { src: 'https://x/mq12-test5/denah-viewer.js' },
      getElementById: ambil,
      head: { appendChild() {} },
      body: { appendChild() {}, classList: { add() {}, remove() {} } },
      createElement: () => ({
        style: {}, classList: { add() {}, remove() {} },
        set innerHTML(v) {}, querySelector: () => null, addEventListener() {},
      }),
      addEventListener() {},
    },
  };
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(baca('denah-data.js'), ctx);
  vm.runInContext(baca('profil-data.js'), ctx);
  vm.runInContext(baca('denah-viewer.js'), ctx);
  vm.runInContext(html.match(/<script>([\s\S]*?)<\/script>/)[1], ctx);

  const hitung = (pola) => (ambil('rundown-list').innerHTML.match(pola) || []).length;
  assert.strictEqual(hitung(/Lihat denah lokasi/g), 8, 'tombol denah Sesi 1 tidak 8');
  assert.strictEqual(hitung(/Profil singkat/g), 8, 'tombol profil Sesi 1 tidak 8');

  // Sesi 2 baru terender setelah tabnya ditekan; jumlahnya = baris agenda yang
  // bertautan, bukan jumlah denah, karena denah jalur dipakai oleh dua baris.
  ctx.pilihSesi('sesi2');
  const berprofil = new Set(global.window.PROFIL.sesi2.map((l) => l.slug));
  let barisSesi2 = 0, barisProfil = 0;
  for (const [i, list] of tertaut.sesi2) {
    barisSesi2 += list.length;
    if (berprofil.has(denah.sesi2[i].slug)) barisProfil += list.length;
  }
  assert.strictEqual(hitung(/Lihat denah lokasi/g), barisSesi2,
    `tombol denah Sesi 2 tidak ${barisSesi2}`);
  assert.strictEqual(hitung(/Profil singkat/g), barisProfil,
    `tombol profil Sesi 2 tidak ${barisProfil}`);
})();

console.log(`OK — ${denah.sesi1.length} denah Sesi 1 + ${denah.sesi2.length} denah Sesi 2, semua berkas ada dan tertaut.`);
console.log(`   Profil singkat: ${PROFIL_HARAP.sesi1} lokasi Sesi 1, ${PROFIL_HARAP.sesi2} lokasi Sesi 2.`);
for (const sesi of ['sesi1', 'sesi2']) {
  console.log(`   [${sesi}]`);
  for (const [i, list] of [...tertaut[sesi]].sort((a, b) => a[0] - b[0])) {
    console.log(`   ${denah[sesi][i].no}. ${denah[sesi][i].judul}  <-  ${list.join(' ; ')}`);
  }
}

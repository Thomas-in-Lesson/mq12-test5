// Uji logika tampilan Rundown: seragam sehari penuh dicetak sekali di kepala
// kartu, dan baris agenda hanya menyebut yang berbeda. Jalankan: node tools/test-rundown.js
//
// Dibuat bersama perbaikan B1: sebelum ini tiap baris mencetak tag seragam
// peserta dan pendamping, padahal per hari isinya cuma 2-4 kombinasi. Yang
// paling gampang salah di sini adalah perbandingannya: data lapangan menulis
// hal yang sama dengan koma dan urutan berbeda ("Almamater MQ Kemeja Putih"
// vs "Kemeja Putih, Almamater MQ"), dan kalau dianggap beda, semua baris ikut
// tercetak lagi — perbaikannya jadi sia-sia tanpa ada yang kelihatan salah.
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { ambilLiteral } = require('./merge-nama');

const REPO = path.join(__dirname, '..');
const HAL = path.join(REPO, 'rundown_kegiatan_safari_hwmi_mq_12', 'code.html');
const html = fs.readFileSync(HAL, 'utf8');

// Ambil fungsi pembantunya langsung dari halaman supaya uji ini ikut basi
// kalau halamannya diubah tanpa memperbarui uji.
function ambilPotongan(mulai, akhir) {
  const i = html.indexOf(mulai);
  assert.ok(i > 0, `potongan "${mulai}" tidak ada di halaman Rundown`);
  const j = html.indexOf(akhir, i);
  assert.ok(j > i, `ujung "${akhir}" tidak ketemu sesudah "${mulai}"`);
  return html.slice(i, j + akhir.length);
}

const sumber = [
  ambilPotongan('const kunciSeragam =', ".join('|');"),
  ambilPotongan('function terbanyak(daftar)', '\n  }'),
  ambilPotongan('const BULAN =', "desember: 'Des' };"),
  ambilPotongan('function tanggalRingkas(teks)', '\n  }'),
].join('\n');

// eslint-disable-next-line no-new-func
const { kunciSeragam, terbanyak, tanggalRingkas } = new Function(
  `${sumber}; return { kunciSeragam, terbanyak, tanggalRingkas };`)();

// --- 1. Perbandingan seragam: abai koma, urutan, dan besar-kecil huruf
const SAMA = [
  ['Almamater MQ Kemeja Putih', 'Almamater MQ, Kemeja Putih'],
  ['Almamater MQ Kemeja putih', 'Almamater MQ, Kemeja Putih'],
  ['Kemeja Putih, Almamater MQ', 'Almamater MQ, Kemeja Putih'],
  ['Jasket,Kemeja Putih', 'Jasket, Kemeja Putih'],
];
const BEDA = [
  ['Kemeja Putih', 'Almamater MQ, Kemeja Putih'],
  ['Jasket, Kemeja Putih', 'Almamater MQ, Kemeja Putih'],
  ['Bebas Sopan', 'Almamater MQ, Kemeja Putih'],
  ['Jasket Merah', 'Jasket Biru'],
  ['Baju Salur', 'Pakaian Bebas'],
];
for (const [a, b] of SAMA) {
  assert.strictEqual(kunciSeragam(a), kunciSeragam(b), `harus dianggap sama: "${a}" vs "${b}"`);
}
for (const [a, b] of BEDA) {
  assert.notStrictEqual(kunciSeragam(a), kunciSeragam(b), `harus dianggap beda: "${a}" vs "${b}"`);
}

// --- 2. Seragam baku sehari: yang terbanyak, dan tampilannya yang paling rapi
assert.strictEqual(
  terbanyak(['Almamater MQ Kemeja Putih', 'Almamater MQ, Kemeja Putih', 'Bebas Sopan']),
  'Almamater MQ, Kemeja Putih',
  'varian dengan koma yang seharusnya dipakai untuk ditampilkan');
assert.strictEqual(terbanyak(['Salur', 'Salur', 'Bebas Sopan']), 'Salur');
assert.strictEqual(terbanyak(['Salur', 'Bebas Sopan']), '', 'tidak ada yang berulang: strip tidak perlu muncul');
assert.strictEqual(terbanyak([]), '');
assert.strictEqual(terbanyak(['', '', '']), '');

// --- 3. Tanggal kepala kartu diringkas, yang tak terbaca dibiarkan utuh
assert.strictEqual(
  tanggalRingkas("Rabu Pahing, 19 Robi’ul Awwal 1448 H / 02 September 2026 M"),
  'Rabu Pahing · 2 Sep 2026');
assert.strictEqual(
  tanggalRingkas('Ahad Kliwon, 02 Robi’ul Awwal 1448 H/ 16 Agustus 2026 M'),
  'Ahad Kliwon · 16 Agu 2026');
assert.strictEqual(tanggalRingkas('Tanpa pola tanggal'), 'Tanpa pola tanggal');
assert.strictEqual(tanggalRingkas(''), '');

// --- 4. Data sebenarnya: tiap hari harus punya seragam baku, kalau tidak
//        strip di kepala kartu hilang dan pembaca kehilangan acuan.
const rundownData = ambilLiteral('rundown_kegiatan_safari_hwmi_mq_12/code.html', 'const rundownData');
let hari = 0;
let pengecualian = 0;
let tagLama = 0;
for (const [sesi, isi] of Object.entries(rundownData)) {
  for (const h of isi.hari) {
    hari += 1;
    const baku = terbanyak(h.agenda.map((a) => a.seragam));
    assert.ok(baku, `${sesi} ${h.label}: tidak ada seragam baku yang bisa ditaruh di kepala kartu`);
    const bakuPendamping = terbanyak(h.agenda.map((a) => a.pendamping));
    for (const a of h.agenda) {
      tagLama += (a.seragam ? 1 : 0) + (a.pendamping ? 1 : 0);
      if (a.seragam && kunciSeragam(a.seragam) !== kunciSeragam(baku)) pengecualian += 1;
      if (a.pendamping && kunciSeragam(a.pendamping) !== kunciSeragam(bakuPendamping)) pengecualian += 1;
    }
  }
}
assert.ok(pengecualian * 3 < tagLama,
  `pengecualian terlalu banyak (${pengecualian} dari ${tagLama} tag) — pemindahan ke kepala kartu jadi tidak ada gunanya`);

// Kolom CSV panitia berpindah-pindah, dan build_rundown_csv.py memetakannya
// lewat baris header. Kalau pemetaan itu meleset satu kolom, isinya bergeser
// tanpa satu pun error: nama imam berisi seragam, atau sebaliknya. Dua
// pemeriksaan di bawah inilah yang jadi rem-nya.
let jumlahImam = 0;
for (const [sesi, isi] of Object.entries(rundownData)) {
  for (const h of isi.hari) {
    for (const a of h.agenda) {
      if (!a.imam) continue;
      jumlahImam += 1;
      assert.ok(/^(Bapak|Bpk|Ibu)\b/.test(a.imam),
        `${sesi} ${h.label} "${a.agenda}": jadwal imam bukan nama orang: ${a.imam}`);
    }
  }
}
assert.ok(jumlahImam > 20, `jadwal imam cuma ${jumlahImam} baris — kolomnya kemungkinan tidak terbaca`);

// Peran mini ceremony datang dari kolom tanpa judul di ujung baris; kalau kolom
// itu ikut hilang, catatannya lenyap diam-diam.
const peran = rundownData.sesi3.hari.flatMap((h) => h.agenda).filter((a) => a.catatan);
assert.strictEqual(peran.length, 8, `catatan peran mini ceremony: ${peran.length}, seharusnya 8`);
assert.ok(peran.some((a) => /Dirigen/.test(a.catatan)), 'catatan Dirigen hilang');

assert.ok(html.includes('`Imam: ${a.imam}`'), 'halaman tidak lagi menampilkan jadwal imam');

console.log(`OK — perbandingan seragam (${SAMA.length} sama, ${BEDA.length} beda), seragam baku, `
  + 'dan peringkasan tanggal semua lolos.');
console.log(`   Jadwal imam: ${jumlahImam} baris, semuanya nama orang. Peran mini ceremony: ${peran.length}.`);
console.log(`   ${hari} kartu hari: tag seragam turun dari ${tagLama} menjadi ${pengecualian} pengecualian `
  + `+ ${hari * 2} chip di kepala kartu.`);

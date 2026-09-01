// Uji cakupan pencarian Daftar Kamar: sudah memilih kota berarti hasilnya hanya
// dari kota itu; belum memilih berarti semua kota. Jalankan: node tools/test-kamar.js
//
// Dulu pencarian selalu menjangkau semua kota walau tab kotanya sedang aktif,
// jadi peserta yang membuka Solo dan mengetik namanya ikut melihat kamarnya di
// Jakarta — tampak seperti dua kamar untuk satu malam.
const assert = require('assert');
const { ambilLiteral } = require('./merge-nama');

const HAL = 'daftar_kamar_safari_hwmi_mq_12/code.html';
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', HAL), 'utf8');

// Fungsinya diambil dari halaman supaya uji ini ikut basi kalau halamannya
// diubah tanpa memperbarui uji.
const mulai = html.indexOf('function kamarTerpilih(data, kotaAktif, query)');
assert.ok(mulai > 0, 'kamarTerpilih tidak ada di halaman Daftar Kamar');
const ujung = html.indexOf('\n  }', mulai) + 4;
// eslint-disable-next-line no-new-func
const kamarTerpilih = new Function(`${html.slice(mulai, ujung)}; return kamarTerpilih;`)();

const data = ambilLiteral(HAL, 'const hotelsData');
const kota = Object.keys(data);
assert.ok(kota.length >= 7, `kota di halaman cuma ${kota.length}`);

// 1. Tanpa kota terpilih, tanpa kata kunci: semua kamar semua kota.
const semua = kamarTerpilih(data, '', '');
const totalKamar = kota.reduce((n, k) => n + data[k].rooms.length, 0);
assert.strictEqual(semua.length, totalKamar, `tanpa filter: ${semua.length}, seharusnya ${totalKamar}`);

// 2. Kota terpilih tanpa kata kunci: hanya kamar kota itu.
for (const k of kota) {
  const hasil = kamarTerpilih(data, k, '');
  assert.strictEqual(hasil.length, data[k].rooms.length, `${k}: jumlah kamar tidak cocok`);
  assert.ok(hasil.every((h) => h.kota === k), `${k}: ada kamar kota lain yang ikut`);
}

// 3. Nama yang menginap di banyak kota: dicari tanpa memilih kota ketemu di
//    semua kota, dicari dengan kota terpilih hanya ketemu di kota itu.
const nama = (data.Solo.rooms.find((r) => r.occupants.length) || {}).occupants[0];
assert.ok(nama, 'tidak ada penghuni di Solo untuk diuji');
const lintas = kamarTerpilih(data, '', nama);
assert.ok(lintas.length > 1, `"${nama}" seharusnya ketemu di lebih dari satu kota, dapat ${lintas.length}`);
const diSolo = kamarTerpilih(data, 'Solo', nama);
assert.ok(diSolo.length, `"${nama}" tidak ketemu waktu Solo dipilih`);
assert.ok(diSolo.every((h) => h.kota === 'Solo'),
  `pencarian di Solo ikut memunculkan ${[...new Set(diSolo.map((h) => h.kota))].join(', ')}`);
assert.ok(diSolo.length < lintas.length, 'memilih kota tidak menyempitkan hasil');

// 4. Kata kunci yang tidak ada: kosong, bukan seluruh kamar.
assert.strictEqual(kamarTerpilih(data, '', 'zzzzz-tidak-ada').length, 0, 'kata kunci asing harus nihil');

// 5. Nomor kamar dan tipe ikut dicari, bukan cuma nama.
const contoh = data.Solo.rooms[0];
assert.ok(kamarTerpilih(data, 'Solo', contoh.roomNo).length, 'nomor kamar tidak bisa dicari');

console.log(`OK — ${totalKamar} kamar di ${kota.length} kota. Tanpa kota terpilih pencarian `
  + `menjangkau semua; begitu satu kota dipilih hasilnya hanya dari kota itu.`);
console.log(`   Contoh: "${nama}" ketemu ${lintas.length} kamar lintas kota, ${diSolo.length} kamar di Solo saja.`);

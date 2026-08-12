// Bagian D: bangun peserta.json dari satu sumber saja — halaman Daftar Kamar
// (hotelsData) + kedua halaman denah. Jalankan: node tools/build-peserta.js
const fs = require('fs');
const path = require('path');
const { readSources, buildClusters, petaKota, tulisLaporan } = require('./merge-nama');
const { tokenize } = require('./name-utils');

const REPO = path.join(__dirname, '..');

// ponytail: urutan rute tidak ada sumbernya di repo; angka ini mengikuti
// peserta.json sebelumnya. Kalau panitia mengoreksi rute, ubah di sini saja.
const RUTE = ['Gresik', 'Semarang', 'Pemalang', 'Solo', 'Cianjur', 'Jakarta'];

const slug = (nama) => tokenize(nama).join('-');
const nomorKamar = (roomNo) => String(roomNo).replace(/^kamar\s*/i, '').trim();

function build() {
  const { kamar, busSeat, elfSeat } = readSources();
  const semua = [...kamar, ...busSeat, ...elfSeat].map((r) => r.nama);
  const hasil = buildClusters(semua, petaKota(kamar));

  // ejaan -> indeks klaster
  const idxDari = new Map();
  hasil.clusters.forEach((c, i) => c.variants.forEach((v) => idxDari.set(v, i)));

  const orang = hasil.clusters.map((c) => ({
    name: c.canonical,
    aliases: [...new Set(c.variants.map((v) => v.trim()))],
    peran: '',
    transport: {},
    menginap: [],
  }));

  const bentrok = [];

  for (const r of kamar) {
    const o = orang[idxDari.get(r.nama)];
    if (!o) continue;
    const sudah = o.menginap.find((m) => m.kota === r.kota);
    if (sudah) {
      // D-2: satu orang dua kamar di kota yang sama. Data lapangan, bukan bug kode.
      if (nomorKamar(sudah.kamar) !== nomorKamar(r.kamar)) {
        bentrok.push({
          nama: o.name,
          detail: `${r.kota}: Kamar ${sudah.kamar} vs Kamar ${nomorKamar(r.kamar)}`,
          catatan: 'dua kamar di kota yang sama — konfirmasi ke panitia akomodasi',
        });
      }
      continue;
    }
    o.menginap.push({
      kota: r.kota,
      hotel: r.hotel,
      kamar: nomorKamar(r.kamar), // angka saja; kata "Kamar" ditambahkan di tampilan (B-3)
      tipe: r.tipe,
      urutan: RUTE.indexOf(r.kota) + 1 || 99,
    });
  }

  for (const [sesi, seats] of [['sesi1', elfSeat], ['sesi3', busSeat]]) {
    for (const s of seats) {
      const o = orang[idxDari.get(s.nama)];
      if (!o) continue;
      if (o.transport[sesi] && o.transport[sesi] !== s.unit) {
        bentrok.push({
          nama: o.name,
          detail: `${sesi}: ${o.transport[sesi]} vs ${s.unit}`,
          catatan: 'tercatat di dua kendaraan pada sesi yang sama — cek denah',
        });
        continue;
      }
      o.transport[sesi] = s.unit;
      if (!o.peran && s.peran) o.peran = s.peran;
    }
  }

  for (const o of orang) o.menginap.sort((a, b) => a.urutan - b.urutan);

  const data = {};
  for (const o of orang.sort((a, b) => a.name.localeCompare(b.name))) {
    let key = slug(o.name);
    let n = 2;
    while (data[key]) key = `${slug(o.name)}-${n++}`; // nama kembar tetap punya kunci sendiri
    data[key] = o;
  }

  fs.writeFileSync(path.join(REPO, 'peserta.json'), JSON.stringify(data, null, 1) + '\n');

  const stat = tulisLaporan(hasil, bentrok);
  const total = Object.values(data);
  console.log(`peserta        : ${total.length}`);
  console.log(`penempatan     : ${total.reduce((s, o) => s + o.menginap.length, 0)} (dari ${kamar.length} baris kamar)`);
  console.log(`punya ELF s1   : ${total.filter((o) => o.transport.sesi1).length}`);
  console.log(`punya Bus s3   : ${total.filter((o) => o.transport.sesi3).length}`);
  console.log(`tanpa kamar    : ${total.filter((o) => !o.menginap.length).length}`);
  console.log(`-> peserta.json  (klaster ${stat.gabung + stat.tunggal})`);
}

build();

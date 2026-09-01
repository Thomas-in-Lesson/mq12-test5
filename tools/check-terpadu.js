// Periksa keterpaduan: tiap nama yang tertulis di halaman sumber harus bisa
// ditemukan di peserta.json, dan penempatannya harus sama persis.
// Jalankan: node tools/check-terpadu.js
//
// peserta.json adalah satu-satunya yang dibaca kartu peserta di halaman awal.
// Halaman Daftar Kamar, Denah Bus, dan Denah ELF punya datanya sendiri, jadi
// keduanya bisa berbeda tanpa suara: peserta membuka halaman kamar dan melihat
// namanya, tapi kartu di halaman awal bilang "belum terdaftar" — atau lebih
// buruk, menyebut kamar yang sudah bukan miliknya.
//
// Pernah kejadian: rebuild peserta.json menghapus alokasi bus 158 orang tanpa
// satu pun uji gagal. Pemeriksa ini menutup celah itu dari sisi sebaliknya —
// bukan "apakah generatornya jalan", tapi "apakah hasilnya cocok dengan yang
// dilihat peserta di halaman".

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { readSources } = require('./merge-nama');

const REPO = path.join(__dirname, '..');
const peserta = JSON.parse(fs.readFileSync(path.join(REPO, 'peserta.json'), 'utf8'));
const orang = Object.values(peserta);

// Satu ejaan bisa dipakai beberapa halaman; petanya dibangun sekali.
const dariEjaan = new Map();
const kunci = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
// Halaman menulis "Kamar 101", profil menyimpan "101" saja.
const noKamar = (s) => String(s || '').replace(/^\s*kamar\s*/i, '').trim();
for (const o of orang) {
  for (const ejaan of [o.name, ...(o.aliases || [])]) {
    const k = kunci(ejaan);
    if (!dariEjaan.has(k)) dariEjaan.set(k, new Set());
    dariEjaan.get(k).add(o);
  }
}

const { kamar, bus2Seat, busSeat, elfSeat } = readSources();
const masalah = [];
const hilang = new Set();
// Kejanggalan yang asalnya dari berkas panitia, bukan dari generator: satu
// orang di dua kamar, atau satu kota kekurangan orang. Dilaporkan terpisah dan
// tidak menggagalkan pemeriksaan, supaya tidak menutupi ketidakcocokan yang
// memang salah kita sendiri — dan supaya deploy tidak terhalang olehnya.
const keSumber = new Set();
const kamarPer = new Map();
for (const b of kamar) {
  const k = `${kunci(b.nama)}|${b.kota}`;
  if (!kamarPer.has(k)) kamarPer.set(k, new Set());
  kamarPer.get(k).add(noKamar(b.kamar));
}

function profil(nama, asal) {
  const cocok = dariEjaan.get(kunci(nama));
  if (!cocok || !cocok.size) {
    hilang.add(`${nama}  (${asal})`);
    return null;
  }
  // Dua profil berbagi satu ejaan berarti kartu peserta bisa menampilkan orang
  // yang salah, tergantung mana yang lebih dulu ketemu waktu mencari.
  if (cocok.size > 1) {
    masalah.push(`ejaan "${nama}" (${asal}) menunjuk ${cocok.size} profil: `
      + [...cocok].map((o) => o.name).join(' / '));
    return null;
  }
  return [...cocok][0];
}

// --- 1. Kamar: tiap baris penghuni harus muncul di profil orangnya
let kamarDicek = 0;
for (const baris of kamar) {
  const o = profil(baris.nama, `kamar ${baris.kota}`);
  if (!o) continue;
  kamarDicek += 1;
  const ada = (o.menginap || []).some((m) => m.kota === baris.kota
    && noKamar(m.kamar) === noKamar(baris.kamar));
  if (!ada) {
    const punya = (o.menginap || []).filter((m) => m.kota === baris.kota)
      .map((m) => m.kamar).join(', ') || '(tidak ada)';
    const semua = kamarPer.get(`${kunci(baris.nama)}|${baris.kota}`);
    if (semua && semua.size > 1) {
      keSumber.add(`${o.name}: ${baris.kota} kamar ${[...semua].sort().join(' & ')} `
        + `— profil memakai ${punya}`);
    } else {
      masalah.push(`${o.name}: halaman kamar ${baris.kota} menulis ${noKamar(baris.kamar)}, `
        + `profil menulis ${punya}`);
    }
  }
}

// --- 2. Bus & ELF: unit di denah harus sama dengan yang dipegang profil
let dudukDicek = 0;
for (const [sesi, kursi, label] of [
  ['sesi1', elfSeat, 'denah ELF'],
  ['sesi2', bus2Seat, 'denah bus Sesi 2'],
  ['sesi3', busSeat, 'denah bus Sesi 3'],
]) {
  for (const baris of kursi) {
    const o = profil(baris.nama, label);
    if (!o) continue;
    dudukDicek += 1;
    const punya = (o.transport || {})[sesi];
    if (punya !== baris.unit) {
      masalah.push(`${o.name}: ${label} menempatkan di ${baris.unit}, `
        + `profil menulis ${punya || '(kosong)'}`);
    }
  }
}

// --- 3. Arah sebaliknya: profil tidak boleh mengarang penempatan
for (const o of orang) {
  for (const m of o.menginap || []) {
    const sumber = kamar.some((b) => b.kota === m.kota && noKamar(b.kamar) === noKamar(m.kamar)
      && dariEjaan.get(kunci(b.nama))?.has(o));
    if (!sumber) masalah.push(`${o.name}: profil menulis ${m.kota} kamar ${noKamar(m.kamar)}, `
      + 'tapi namanya tidak ada di halaman kamar');
  }
}

// --- 4. Jumlah penghuni tiap kota harus sama
// Rombongannya sama sepanjang perjalanan, jadi kota yang jumlahnya beda berarti
// ada yang terlewat di berkasnya. Semarang pernah kurang satu orang tanpa
// ketahuan: barisnya tetap 165 karena satu nama tertulis dua kali.
{
  const perKota = new Map();
  for (const b of kamar) {
    const o = profil(b.nama, `kamar ${b.kota}`);
    if (!o) continue;
    if (!perKota.has(b.kota)) perKota.set(b.kota, new Set());
    perKota.get(b.kota).add(o.name);
  }
  const jumlah = [...perKota.values()].map((s) => s.size);
  const lazim = jumlah.sort((a, b) =>
    jumlah.filter((x) => x === b).length - jumlah.filter((x) => x === a).length)[0];
  for (const [kota, isi] of perKota) {
    if (isi.size === lazim) continue;
    const semua = new Set([...perKota.values()].flatMap((s) => [...s]));
    const kurang = [...semua].filter((n) => !isi.has(n));
    keSumber.add(`${kota}: ${isi.size} orang, kota lain ${lazim}`
      + (kurang.length ? ` — tidak ada di berkas kota ini: ${kurang.join(', ')}` : ''));
  }
}

// --- Laporan
if (keSumber.size) {
  console.log(`${keSumber.size} hal di berkas panitia yang perlu dikonfirmasi:`);
  for (const x of [...keSumber].sort()) console.log(`   ${x}`);
  console.log('');
}
if (hilang.size) {
  console.log(`${hilang.size} ejaan di halaman tidak ketemu di peserta.json:`);
  for (const x of [...hilang].sort()) console.log(`   ${x}`);
  console.log('   (tambahkan pasangannya di tools/alias-nama.json kalau memang orang yang sama)');
}
if (masalah.length) {
  console.log(`\n${masalah.length} ketidakcocokan:`);
  for (const x of masalah) console.log(`   ${x}`);
}
assert.strictEqual(masalah.length, 0, `${masalah.length} data halaman tidak cocok dengan peserta.json`);
assert.strictEqual(hilang.size, 0, `${hilang.size} nama di halaman tidak punya profil`);

console.log(`OK — ${kamarDicek} baris kamar dan ${dudukDicek} kursi di halaman `
  + `semuanya cocok dengan ${orang.length} profil di peserta.json.`);
if (keSumber.size) console.log(`   ${keSumber.size} hal menunggu konfirmasi panitia, dibiarkan apa adanya.`);

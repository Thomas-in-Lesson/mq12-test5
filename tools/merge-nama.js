// Bagian C: kumpulkan semua ejaan nama dari halaman-halaman sumber, gabungkan
// varian yang merujuk orang yang sama, lalu keluarkan laporan untuk panitia.
// Jalankan: node tools/merge-nama.js   -> menulis laporan-nama.csv
const fs = require('fs');
const path = require('path');
const { compareNames, pickCanonical, tokenize } = require('./name-utils');

const REPO = path.join(__dirname, '..');

// Baris yang bukan nama orang: label peran, header spreadsheet, nama hotel.
const JUNK = /^(crew\s*(bus|bis)?|driver|patwal|perawat|zona\s*\d*|nama|guest\s*name|kosong|no|room|-+)$/i;
const JUNK_MENGANDUNG = /hotel|feruci|oak\s*tree|guest\s*name/i;
const isJunk = (s) => !s || JUNK.test(s.trim()) || JUNK_MENGANDUNG.test(s);

// Ambil literal JS setelah "const <nama> =" dengan menghitung kurung.
function ambilLiteral(file, deklarasi) {
  const src = fs.readFileSync(path.join(REPO, file), 'utf8');
  const i = src.indexOf(deklarasi);
  if (i < 0) throw new Error(`${deklarasi} tidak ada di ${file}`);
  const start = src.slice(i).search(/[[{]/) + i;
  const buka = src[start];
  const tutup = buka === '[' ? ']' : '}';
  let depth = 0;
  for (let k = start; k < src.length; k++) {
    if (src[k] === buka) depth++;
    else if (src[k] === tutup && --depth === 0) {
      // eslint-disable-next-line no-eval
      return eval(`(${src.slice(start, k + 1)})`); // file milik repo sendiri, bukan input luar
    }
  }
  throw new Error(`literal ${deklarasi} tidak tertutup di ${file}`);
}

function readSources() {
  const hotels = ambilLiteral('daftar_kamar_safari_hwmi_mq_12/code.html', 'const hotelsData');
  const buses = ambilLiteral('denah_bus_sesi_3_safari_hwmi_mq_12/code.html', 'const buses');
  const elves = ambilLiteral('denah_tempat_duduk_elf_safari_hwmi_mq_12/code.html', 'const elves');

  // Penempatan kamar: satu baris per orang per kota.
  const kamar = [];
  for (const [kota, h] of Object.entries(hotels)) {
    for (const room of h.rooms || []) {
      for (const occ of room.occupants || []) {
        const nama = String(occ).trim();
        if (isJunk(nama)) continue;
        kamar.push({ nama, kota, hotel: h.name, kamar: room.roomNo, tipe: room.type });
      }
    }
  }

  // Denah Sesi 3: kursi berbentuk [nomor, nama, peran] di sisi kiri & kanan.
  const busSeat = [];
  buses.forEach((bus, idx) => {
    for (const sisi of [bus.left, bus.right]) {
      for (const baris of sisi || []) {
        for (const kursi of baris || []) {
          const nama = String(kursi[1] || '').trim();
          if (isJunk(nama)) continue;
          busSeat.push({ nama, unit: `Bus ${idx + 1}`, peran: String(kursi[2] || '').trim() });
        }
      }
    }
  });

  // Denah Sesi 1: tiap ELF berisi daftar "Nama|Peran".
  const elfSeat = [];
  elves.forEach((elf, idx) => {
    for (const entri of elf || []) {
      const [nama, peran] = String(entri).split('|');
      const bersih = String(nama || '').trim();
      if (isJunk(bersih)) continue;
      elfSeat.push({ nama: bersih, unit: `ELF ${idx + 1}`, peran: String(peran || '').trim() });
    }
  });

  return { kamar, busSeat, elfSeat };
}

// Langkah 5 + 6: klasterkan ejaan, tolak yang sekota, lalu buang efek rantai.
function buildClusters(ejaan, kotaDari) {
  const list = [...new Set(ejaan)].filter((s) => !isJunk(s));
  const freq = new Map();
  for (const s of ejaan) if (!isJunk(s)) freq.set(s, (freq.get(s) || 0) + 1);
  const parent = list.map((_, i) => i);
  const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));

  // Langkah 5 sebagai invarian klaster, bukan sekadar cek sepasang: union-find
  // bersifat transitif, jadi A dan C bisa berakhir sekamar-sekota lewat B kalau
  // kotanya hanya diperiksa per pasangan.
  // ponytail: yang duluan menggabung yang menang; pasangan yang tertolak masuk
  // laporan supaya panitia bisa menilai ulang.
  const kotaKlaster = list.map((s) => new Set(kotaDari.get(s) || []));
  const union = (a, b) => {
    const ra = find(a);
    const rb = find(b);
    if (ra === rb) return true;
    for (const k of kotaKlaster[ra]) if (kotaKlaster[rb].has(k)) return false;
    parent[ra] = rb;
    for (const k of kotaKlaster[ra]) kotaKlaster[rb].add(k);
    return true;
  };

  const ragu = [];
  const tolakKota = [];

  // ponytail: O(n^2) atas ~900 ejaan (<1 detik). Kalau daftar tumbuh ribuan,
  // saring dulu per huruf pertama kata pertama sebelum membandingkan.
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const hasil = compareNames(list[i], list[j]);
      if (!hasil.match) {
        if (hasil.ragu) ragu.push([list[i], list[j], hasil.reason]);
        continue;
      }
      if (!union(i, j)) tolakKota.push([list[i], list[j], 'menginap di kota yang sama']);
    }
  }

  // Putaran kedua: ejaan yang cuma nyambung lewat inisial ("Thousan A. A. H. S.")
  // digabung HANYA bila kandidatnya tunggal. Kalau "Nurul F" bisa jatuh ke Nurul
  // Fitriani maupun Nurul Fauza, biar panitia yang memutuskan.
  // ponytail: satu putaran saja, memakai potret klaster hasil putaran pertama.
  const potret = list.map((_, i) => find(i));
  const ambigu = [];
  for (let i = 0; i < list.length; i++) {
    const kandidat = new Map();
    for (let j = 0; j < list.length; j++) {
      if (potret[j] === potret[i]) continue;
      const hasil = compareNames(list[i], list[j], { longgar: true });
      if (!hasil.match || !hasil.longgar) continue;
      if (!kandidat.has(potret[j])) kandidat.set(potret[j], list[j]);
    }
    if (!kandidat.size) continue;
    // Beberapa kandidat belum tentu ambigu: kalau kandidat-kandidatnya sendiri
    // satu sama lain masih cocok, mereka memang satu orang (Rodliyatan Mardiyyah
    // / Mardliyah / RODLIYATAN M.). Yang benar-benar ambigu seperti "Nurul F"
    // -> Nurul Fitriani vs Nurul Fauza tidak lolos uji ini.
    const nama = [...kandidat.values()];
    const salingCocok = nama.every((x, ix) => nama.every((y, iy) => ix === iy || compareNames(x, y, { longgar: true }).match));
    if (kandidat.size === 1 || salingCocok) kandidat.forEach((_, root) => union(i, root));
    else ambigu.push([list[i], nama.join(' / '), `ambigu: cocok ke ${kandidat.size} profil`]);
  }

  const kasar = new Map();
  list.forEach((s, i) => {
    const r = find(i);
    if (!kasar.has(r)) kasar.set(r, []);
    kasar.get(r).push(s);
  });

  // Langkah 6: union-find bisa menyambung A-B-C padahal A dan C tak berhubungan.
  // Uji ulang tiap anggota terhadap kanonik; yang gagal keluar jadi klaster sendiri.
  const clusters = [];
  const rantai = [];
  for (const anggota of kasar.values()) {
    if (anggota.length === 1) { clusters.push({ canonical: anggota[0], variants: anggota }); continue; }
    const canonical = pickCanonical(anggota, freq);
    const lolos = [canonical];
    const keluar = [];
    for (const s of anggota) {
      if (s === canonical) continue;
      if (compareNames(canonical, s, { longgar: true }).match) lolos.push(s);
      else { rantai.push([s, canonical]); keluar.push(s); }
    }
    clusters.push({ canonical, variants: lolos });
    // Yang dikeluarkan diklasterkan ulang di antara mereka sendiri, jangan
    // dijadikan tunggal semua: dua ejaan bisa saja tetap satu orang.
    if (keluar.length) clusters.push(...buildClusters(keluar, kotaDari).clusters);
  }

  return { clusters, ragu: [...ragu, ...ambigu], tolakKota, rantai };
}

const csvCell = (s) => `"${String(s).replace(/"/g, '""')}"`;

// Peta ejaan -> kota tempat ejaan itu muncul, bahan langkah 5.
function petaKota(kamar) {
  const kotaDari = new Map();
  for (const r of kamar) {
    if (!kotaDari.has(r.nama)) kotaDari.set(r.nama, new Set());
    kotaDari.get(r.nama).add(r.kota);
  }
  return kotaDari;
}

function tulisLaporan({ clusters, ragu, tolakKota, rantai }, bentrok = []) {
  const gabung = clusters.filter((c) => c.variants.length > 1);
  const tunggal = clusters.filter((c) => c.variants.length === 1);

  // Pasangan yang toh berakhir di klaster yang sama tidak perlu dilihat panitia.
  const klasterDari = new Map();
  clusters.forEach((c, i) => c.variants.forEach((v) => klasterDari.set(v, i)));
  const beda = (a, b) => klasterDari.get(a) !== klasterDari.get(b);

  const baris = [['BAGIAN', 'KANONIK', 'VARIAN / PASANGAN', 'CATATAN']];
  for (const c of gabung.sort((a, b) => b.variants.length - a.variants.length)) {
    baris.push(['GABUNG', c.canonical, c.variants.filter((v) => v !== c.canonical).join(' | '), `${c.variants.length} ejaan`]);
  }
  for (const [a, b, alasan] of ragu) if (beda(a, b)) baris.push(['RAGU', a, b, alasan]);
  for (const [a, b, kota] of tolakKota) if (beda(a, b)) baris.push(['RAGU', a, b, `ditolak: sama-sama menginap di ${kota}`]);
  for (const [a, k] of rantai) if (beda(a, k)) baris.push(['RAGU', a, k, 'dikeluarkan dari klaster karena efek rantai']);
  for (const b of bentrok) baris.push(['BENTROK', b.nama, b.detail, b.catatan]);
  for (const c of tunggal) baris.push(['TUNGGAL', c.canonical, '', '']);

  const out = path.join(REPO, 'laporan-nama.csv');
  fs.writeFileSync(out, '﻿' + baris.map((r) => r.map(csvCell).join(',')).join('\n') + '\n');

  const nRagu = baris.filter((r) => r[0] === 'RAGU').length;
  console.log(`klaster        : ${clusters.length}  (gabung ${gabung.length}, tunggal ${tunggal.length})`);
  console.log(`perlu dicek    : ${nRagu} RAGU + ${bentrok.length} BENTROK`);
  console.log(`-> ${path.relative(REPO, out)}`);
  return { gabung: gabung.length, tunggal: tunggal.length, ragu: nRagu };
}

function main() {
  const { kamar, busSeat, elfSeat } = readSources();
  const semua = [...kamar, ...busSeat, ...elfSeat].map((r) => r.nama);
  console.log(`ejaan unik     : ${new Set(semua).size}`);
  tulisLaporan(buildClusters(semua, petaKota(kamar)));
}

module.exports = { readSources, buildClusters, petaKota, tulisLaporan, isJunk, ambilLiteral };
if (require.main === module) main();

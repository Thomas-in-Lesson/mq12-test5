#!/usr/bin/env node
// Bangun ulang blok hotelsData di halaman Daftar Kamar dari CSV room list panitia.
// Jalankan: node tools/build-hotels.js ["dir sumber"]
// Default dir sumber: ~/Downloads/Room list Hotel
//
// Tiap hotel mengirim tata letak kolom yang berbeda, jadi satu parser per hotel.
// Nama hotel dan kota tetap memakai yang sudah tertera di front; kota yang
// berkasnya belum ada (Solo) dibiarkan seperti sebelumnya.
// Ejaan nama penghuni disamakan dengan nama peserta yang sudah tampil di front
// (peserta.json), supaya kartu "Kamar Hotel" di beranda tetap ketemu orangnya.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { namesMatch, GELAR } = require('./name-utils');
const { isJunk, ambilLiteral } = require('./merge-nama');

const REPO = path.join(__dirname, '..');
const HALAMAN = path.join(REPO, 'daftar_kamar_safari_hwmi_mq_12', 'code.html');
// Panitia menaruh kiriman di mana saja dan menamainya sesukanya ("Gresik opsi
// 2.csv"), jadi tiap kota dicari di semua folder ini dengan awalan nama kota,
// lalu yang paling baru yang menang.
const DIR_SUMBER = [
  path.join(os.homedir(), 'Documents', '#Experiment', 'Baru_data_hotel'),
  path.join(os.homedir(), 'Downloads', 'Room list Hotel'),
  path.join(os.homedir(), 'Downloads', 'Room list Hotel '),  // spasi di ujung, pernah terjadi
  path.join(os.homedir(), 'Downloads'),
].filter(fs.existsSync);

// Berkas CSV terbaru yang namanya diawali nama berkas kota, mis. "Gresik.csv",
// "Gresik opsi 2.csv". Mengembalikan undefined kalau tidak ada.
function csvTerbaru(dirs, namaCsv) {
  const awalan = path.basename(namaCsv, '.csv').toLowerCase();
  return dirs
    .flatMap((d) => fs.readdirSync(d).map((f) => path.join(d, f)))
    .filter((f) => {
      const nama = path.basename(f).toLowerCase();
      return nama.startsWith(awalan) && nama.endsWith('.csv');
    })
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0];
}

const baca = (file) => fs.readFileSync(file, 'utf8')
  .replace(/^\uFEFF/, '')
  .split(/\r?\n/)
  .map((l) => l.split(';').map((s) => s.trim()));

// Samakan gaya tipe kamar: "DELUXE twin - Extrabed" -> "Deluxe Twin - Extrabed".
const rapi = (s) => String(s || '').replace(/\s+/g, ' ').trim()
  .replace(/\S+/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
const gabung = (...bagian) => bagian.filter(Boolean).join(' · ');
const room = (no, type) => ({ roomNo: `Kamar ${no}`, type, occupants: [] });

// ------------------------------------------------------------ parser tiap hotel
// Pola umum: baris pertama kamar membawa nomor + tipe, baris berikutnya hanya nama.

// ROOM;GUEST NAME(urutan);NAMA;ROOM TYPE;REMARKS
function cianjur(rows) {
  const out = [];
  for (const [no, , nama, tipe] of rows) {
    if (/^room/i.test(no)) continue;
    if (no) {
      // ponytail: CSV tidak memuat lantai; ratusan nomor kamar = lantai
      // (101-129 lantai 1, 2xx lantai 2, 3xx lantai 3) — cocok dengan data
      // lantai kiriman panitia sebelumnya. Nomor lain (mis. 888) dibiarkan.
      const lantai = /^[1-3]\d\d$/.test(no) ? `Lantai ${no[0]}` : '';
      out.push(room(no, gabung(rapi(tipe), lantai)));
    }
    if (nama && out.length) out.at(-1).occupants.push(nama);
  }
  return out;
}

// NO;GUEST NAME;ROOM NUMBER;BED TYPE
function gresik(rows) {
  const out = [];
  for (const [no, nama, kamar, bed] of rows) {
    if (/^no$/i.test(no)) continue;
    if (no) out.push(room(kamar, bed ? `${rapi(bed)} Bed` : ''));
    if (nama && out.length) out.at(-1).occupants.push(nama);
  }
  return out;
}

// Room No;Type of Room;Floor;(urutan);NAMA — lantai hanya terisi sebagian.
function jakarta(rows) {
  const out = [];
  for (const [kamar, tipe, lantai, , nama] of rows) {
    if (/^room/i.test(kamar)) continue;
    if (kamar) out.push(room(kamar, gabung(rapi(tipe), lantai && `Lantai ${lantai}`)));
    if (nama && out.length) out.at(-1).occupants.push(nama);
  }
  return out;
}

// NO;TYPE ROOM;ROOM NUMBER;TYPE BED;GUEST 1;GUEST 2;GUEST 3;KETERANGAN
// Satu baris = satu kamar. Dua kamar terakhir belum punya nomor dari hotel.
function pemalang(rows) {
  const out = [];
  for (const [no, tipe, kamar, bed, ...sisa] of rows) {
    if (!/^\d+$/.test(no)) continue;
    const r = room(kamar || 'belum ditentukan', gabung(rapi(tipe), rapi(sisa[3] || bed)));
    r.occupants.push(...sisa.slice(0, 3).filter(Boolean));
    out.push(r);
  }
  return out;
}

// No;Room No;Type of Room;D/T;(urutan);NAMA;[TELP;]LANTAI — berseksi per tipe
// kamar, kolom LANTAI hanya terisi saat lantainya berganti. Kiriman terbaru
// menyisipkan kolom TELP, jadi posisi LANTAI dibaca dari barisan header.
function semarang(rows) {
  const out = [];
  let lantai = '';
  let kolomLantai = 6;
  for (const baris of rows) {
    const [no, kamar, tipe, , , nama] = baris;
    if (/^no$/i.test(no)) {
      const i = baris.findIndex((sel) => /^lantai$/i.test(sel));
      if (i > 0) kolomLantai = i;
      continue; // header tiap seksi
    }
    const lt = baris[kolomLantai];
    if (lt) lantai = rapi(lt);
    if (/^\d+$/.test(no)) out.push(room(kamar, gabung(rapi(tipe), lantai)));
    if (nama && out.length) out.at(-1).occupants.push(nama);
  }
  return out;
}

// No.;Bangunan;Kamar;Nama — satu baris satu orang, dikelompokkan per bangunan
// dan kamar. Nama bangunan dibiarkan apa adanya ("Kelas BTQ", bukan "Kelas Btq").
function hshf(rows) {
  const out = [];
  const indeks = new Map();
  for (const [, bangunan, kamar, nama] of rows) {
    if (!nama || /^nama$/i.test(nama) || !bangunan) continue;
    const kunci = `${bangunan}|${kamar}`;
    if (!indeks.has(kunci)) {
      const nomor = kamar ? (/^kamar/i.test(kamar) ? kamar : `Kamar ${kamar}`) : bangunan;
      indeks.set(kunci, out.push({ roomNo: nomor, type: kamar ? bangunan : 'Ruang bersama', occupants: [] }) - 1);
    }
    out[indeks.get(kunci)].occupants.push(nama);
  }
  return out;
}

// Kunci kota -> nama penginapan, berkas CSV, dan parsernya. Urutan di sini juga
// jadi urutan tab di halaman. Kota tanpa parser/CSV memakai data lama di halaman
// (Solo masih "segera hadir"). HSHF dikirim terpisah, jadi berkasnya di ~/Downloads.
const KOTA = {
  Cianjur: { name: 'Hotel Gino Feruci Cianjur', csv: 'Cianjur.csv', parse: cianjur },
  Gresik: { name: 'Hotel Gresik', csv: 'Gresik.csv', parse: gresik },
  HSHF: { name: 'Pesantren HSHF, Pelabuhan Ratu', csv: 'hshf.csv', parse: hshf },
  Jakarta: { name: 'Swiss-Belhotel Epicentrum Jakarta', csv: 'Jakarta.csv', parse: jakarta },
  Pemalang: { name: 'Hotel R-Gina Pemalang', csv: 'Pemalang.csv', parse: pemalang },
  Semarang: { name: 'Hotel Oak Tree Semarang', csv: 'Semarang.csv', parse: semarang },
  Solo: { name: 'Hotel Sahid Solo', csv: null, parse: null },
};

const BELUM_ADA = 'Data pembagian kamar belum tersedia dari tim panitia (segera hadir).';

// ------------------------------------------------------- ejaan nama ikut front
const PESERTA = JSON.parse(fs.readFileSync(path.join(REPO, 'peserta.json'), 'utf8'));
const ALIAS = JSON.parse(fs.readFileSync(path.join(__dirname, 'alias-nama.json'), 'utf8'));
const ORANG = Object.values(PESERTA).map((o) => ({ nama: o.name, ejaan: [o.name, ...(o.aliases || [])] }));

const kunci = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const persis = new Map();
for (const o of ORANG) for (const e of o.ejaan) persis.set(kunci(e), o.nama);

// Hotel selalu menulis "Bpk" untuk yang sepuh, jadi ejaan tanpa gelar bukan
// orang yang sama — tanpa saringan ini "Irfan Fanani" nyangkut ke Bpk. Irfan
// Fanani, padahal yang dimaksud Muchamad Irfan Fanani.
const bergelar = (s) => GELAR.has(kunci(s).split(' ')[0]);

const ragu = [];
function kanonik(nama) {
  if (isJunk(nama)) return nama; // Crew Bus, Driver, Patwal, Zona n
  const ejaan = ALIAS[nama] || nama;
  const segelar = (kandidat) => bergelar(kandidat) === bergelar(ejaan);
  const persisan = persis.get(kunci(ejaan));
  if (persisan && segelar(persisan)) return persisan;
  const kandidat = [...new Set(ORANG.filter((o) => o.ejaan.some((e) => namesMatch(e, ejaan))).map((o) => o.nama))]
    .filter(segelar);
  if (kandidat.length === 1) return kandidat[0];
  ragu.push({ nama, kandidat });
  return nama;
}

// ------------------------------------------------------------------- tulis blok
function tulisHalaman(data) {
  const blok = JSON.stringify(data, null, 2)
    .split('\n').map((l, i) => (i ? `  ${l}` : l)).join('\n');
  const html = fs.readFileSync(HALAMAN, 'utf8');
  const mulai = html.indexOf('{', html.indexOf('const hotelsData'));
  let depth = 0;
  let k = mulai;
  for (; k < html.length; k++) {
    if (html[k] === '{') depth++;
    else if (html[k] === '}' && --depth === 0) break;
  }
  fs.writeFileSync(HALAMAN, html.slice(0, mulai) + blok + html.slice(k + 1));
}

function main() {
  const dirs = process.argv[2] ? [process.argv[2]] : DIR_SUMBER;
  if (!dirs.length) throw new Error('dir sumber CSV tidak ditemukan — beri path-nya sebagai argumen');
  const lama = ambilLiteral('daftar_kamar_safari_hwmi_mq_12/code.html', 'const hotelsData');
  const data = {};

  for (const [kota, cfg] of Object.entries(KOTA)) {
    const h = lama[kota] || { name: cfg.name, note: BELUM_ADA, rooms: [] };
    const file = cfg.csv && csvTerbaru(dirs, cfg.csv);
    if (!cfg.parse || !file) {
      data[kota] = h; // Solo: belum ada kiriman, catatan "segera hadir" dibiarkan
      console.log(`${kota.padEnd(9)} -> CSV tidak ada, data lama dipakai`);
      continue;
    }
    const rooms = cfg.parse(baca(file)).filter((r) => r.occupants.length);
    for (const r of rooms) r.occupants = r.occupants.map(kanonik);
    data[kota] = { name: h.name || cfg.name, rooms };

    const orang = rooms.reduce((n, r) => n + r.occupants.length, 0);
    const dulu = (h.rooms || []).reduce((n, r) => n + r.occupants.length, 0);
    console.log(`${kota.padEnd(9)} -> ${String(rooms.length).padStart(3)} kamar, ${String(orang).padStart(3)} penghuni `
      + `(sebelumnya ${(h.rooms || []).length} kamar, ${dulu} penghuni)  <- ${path.basename(path.dirname(file))}/${path.basename(file)}`);
  }

  tulisHalaman(data);
  console.log(`-> ${path.relative(REPO, HALAMAN)}`);

  if (ragu.length) {
    console.log(`\n${ragu.length} ejaan tidak bisa dipastikan ke nama di front (dibiarkan apa adanya):`);
    for (const r of ragu) console.log(`  "${r.nama}"${r.kandidat.length ? ` -> ragu antara: ${r.kandidat.join(' | ')}` : ' -> tidak ada yang cocok'}`);
  }
}

if (require.main === module) main();

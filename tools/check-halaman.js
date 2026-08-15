#!/usr/bin/env node
// Periksa seluruh halaman: tombol, tautan, id, urutan skrip, dan cakupan offline.
// Jalankan: node tools/check-halaman.js
//
// Dibuat setelah dua bug yang gagal tanpa suara: tautan denah tidak muncul
// karena skripnya dimuat belakangan, dan Skema Foto blank karena penjaga
// window['pdfjs-dist/build/pdf'] salah kunci. Dua-duanya tidak memunculkan
// error apa pun di console, jadi hanya ketahuan kalau diperiksa seperti ini.

const fs = require('fs');
const path = require('path');

const REPO = path.join(__dirname, '..');
const temuan = [];
const lapor = (berkas, jenis, pesan) => temuan.push({ berkas, jenis, pesan });

const halaman = [];
for (const nama of fs.readdirSync(REPO)) {
  const p = path.join(REPO, nama);
  if (nama.endsWith('.html')) halaman.push(nama);
  else if (fs.statSync(p).isDirectory() && fs.existsSync(path.join(p, 'code.html'))) {
    halaman.push(path.join(nama, 'code.html'));
  }
}
halaman.sort();

// Global yang didaftarkan sebuah berkas skrip, mis. window.DenahViewer = ...
function globalDari(isi) {
  const set = new Set();
  for (const m of isi.matchAll(/window\.([A-Za-z_$][\w$]*)\s*=/g)) set.add(m[1]);
  return set;
}

// Nama fungsi yang bisa dipanggil dari atribut onclick dan sejenisnya.
function fungsiDari(isi) {
  const set = new Set();
  for (const m of isi.matchAll(/function\s+([A-Za-z_$][\w$]*)/g)) set.add(m[1]);
  for (const m of isi.matchAll(/(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?(?:function|\()/g)) set.add(m[1]);
  for (const m of isi.matchAll(/window\.([A-Za-z_$][\w$]*)\s*=/g)) set.add(m[1]);
  return set;
}

const BAWAAN = new Set(['window', 'document', 'console', 'alert', 'confirm', 'this', 'history', 'location', 'localStorage', 'navigator']);

// --- sw.js: aset precache ---
const sw = fs.readFileSync(path.join(REPO, 'sw.js'), 'utf8');
const asetSW = (sw.split('const ASSETS = [')[1] || '').split('];')[0]
  .match(/'([^']+)'/g)?.map((s) => s.slice(1, -1).replace(/^\.\//, '')) || [];

for (const a of asetSW) {
  if (a === '' || a === '/') continue;
  if (!fs.existsSync(path.join(REPO, a))) lapor('sw.js', 'aset-hilang', `precache menunjuk berkas yang tidak ada: ${a}`);
}

// --- tiap halaman ---
for (const hal of halaman) {
  const isi = fs.readFileSync(path.join(REPO, hal), 'utf8');
  const dir = path.dirname(path.join(REPO, hal));

  // Skrip sesuai urutan kemunculan
  const skrip = [];
  for (const m of isi.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    const src = /src=["']([^"']+)["']/.exec(m[1]);
    skrip.push({ posisi: m.index, src: src ? src[1] : null, isi: m[2] });
  }

  // Global yang tersedia, beserta posisi skrip yang mendefinisikannya
  const tersedia = new Map();
  const fungsi = new Set();
  for (const s of skrip) {
    let teks = s.isi;
    if (s.src && !/^https?:/.test(s.src)) {
      const p = path.resolve(dir, s.src);
      if (!fs.existsSync(p)) { lapor(hal, 'skrip-hilang', `<script src="${s.src}"> tidak ada`); continue; }
      teks = fs.readFileSync(p, 'utf8');
    } else if (s.src) {
      lapor(hal, 'ketergantungan-luar', `skrip dari internet: ${s.src} — halaman ini mati saat offline`);
      continue;
    }
    for (const g of globalDari(teks)) if (!tersedia.has(g)) tersedia.set(g, s.posisi);
    for (const f of fungsiDari(teks)) fungsi.add(f);
  }

  // Urutan skrip: global dipakai sebelum berkas yang mendefinisikannya dimuat
  for (const s of skrip) {
    if (s.src) continue;
    for (const [nama, posisiDef] of tersedia) {
      if (posisiDef > s.posisi && new RegExp('\\b' + nama + '\\b').test(s.isi)) {
        lapor(hal, 'urutan-skrip',
          `skrip halaman memakai ${nama}, tetapi berkas yang mendefinisikannya dimuat setelahnya`);
      }
    }
  }

  // Handler inline menunjuk fungsi yang tidak ada
  for (const m of isi.matchAll(/on(?:click|change|input|submit)=["']([^"']+)["']/g)) {
    const nama = /^\s*([A-Za-z_$][\w$.]*)\s*\(/.exec(m[1]);
    if (!nama) continue;
    const akar = nama[1].split('.')[0];
    if (BAWAAN.has(akar)) continue;
    if (!fungsi.has(akar) && !tersedia.has(akar)) {
      lapor(hal, 'handler-mati', `on…="${nama[1]}(...)" — fungsi ${akar} tidak terdefinisi di halaman ini`);
    }
  }

  // getElementById menunjuk id yang tidak ada di markup
  const idAda = new Set([...isi.matchAll(/\sid=["']([^"']+)["']/g)].map((m) => m[1]));
  for (const s of skrip) {
    if (s.src) continue;
    for (const m of s.isi.matchAll(/getElementById\(['"]([^'"]+)['"]\)/g)) {
      if (!idAda.has(m[1])) lapor(hal, 'id-hilang', `getElementById('${m[1]}') tetapi tidak ada elemen dengan id itu`);
    }
  }

  // Tautan lokal yang menunjuk berkas tidak ada
  for (const m of isi.matchAll(/href=["']([^"'#]+)["']/g)) {
    const href = m[1];
    if (/^(https?:|data:|mailto:|tel:|javascript:)/.test(href)) continue;
    if (!fs.existsSync(path.resolve(dir, href.split('#')[0]))) {
      lapor(hal, 'tautan-putus', `href="${href}" tidak ada`);
    }
  }

  // Halaman tidak ikut disimpan untuk offline
  if (!asetSW.includes(hal)) lapor(hal, 'tanpa-offline', 'halaman ini tidak ada di daftar precache sw.js');
}

// --- ikon Material Symbols yang tidak ada di font fallback ---
// Saat online ikon disediakan font Google, tetapi saat offline yang dipakai
// subset lokal. Nama ikon di luar subset itu tampil sebagai TEKS MENTAH tanpa
// error apa pun — persis yang dulu terjadi pada HANDSHAKE dan MOSQUE.
const daftarIkon = path.join(REPO, 'fonts', 'ikon-tersedia.txt');
if (fs.existsSync(daftarIkon)) {
  const tersedia = new Set(
    fs.readFileSync(daftarIkon, 'utf8').split('\n')
      .map((b) => b.trim()).filter((b) => b && !b.startsWith('#')));
  const sumber = [...halaman, 'site-navigation.js', 'denah-viewer.js']
    .filter((f) => fs.existsSync(path.join(REPO, f)));
  for (const f of sumber) {
    const isi = fs.readFileSync(path.join(REPO, f), 'utf8');
    const dipakai = new Set();
    for (const m of isi.matchAll(/material-symbols-outlined[^>]*>\s*([a-z0-9_]{2,})\s*</g)) dipakai.add(m[1]);
    for (const m of isi.matchAll(/data-icon=["']([a-z0-9_]{2,})["']/g)) dipakai.add(m[1]);
    for (const nama of dipakai) {
      if (!tersedia.has(nama)) {
        lapor(f, 'ikon-offline', `ikon "${nama}" tidak ada di font fallback — akan tampil sebagai teks saat offline`);
      }
    }
  }
}

// --- laporan ---
const urut = ['aset-hilang', 'ikon-offline', 'skrip-hilang', 'urutan-skrip', 'handler-mati', 'id-hilang',
  'tautan-putus', 'ketergantungan-luar', 'tanpa-offline'];
temuan.sort((a, b) => urut.indexOf(a.jenis) - urut.indexOf(b.jenis) || a.berkas.localeCompare(b.berkas));

if (!temuan.length) {
  console.log(`OK — ${halaman.length} halaman diperiksa, tidak ada masalah.`);
  process.exit(0);
}

let jenisSekarang = '';
for (const t of temuan) {
  if (t.jenis !== jenisSekarang) { jenisSekarang = t.jenis; console.log(`\n[${t.jenis}]`); }
  console.log(`  ${t.berkas}\n     ${t.pesan}`);
}
console.log(`\n${temuan.length} temuan dari ${halaman.length} halaman.`);
process.exit(1);

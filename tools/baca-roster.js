// Ambil NAMA + BUS dari "Informasi Peserta.xlsx" menjadi roster.json.
// Kolom NOMOR sengaja tidak ikut: peserta.json diunduh mentah oleh browser,
// jadi apa pun yang masuk ke sana otomatis publik. Berkas .xlsx aslinya
// di-gitignore supaya nomor HP tidak pernah ter-push.
// Jalankan ulang hanya kalau .xlsx-nya berubah: node tools/baca-roster.js
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const REPO = path.join(__dirname, '..');
const XLSX = path.join(REPO, 'Informasi Peserta.xlsx');

if (!fs.existsSync(XLSX)) {
  console.error(`Tidak ada ${path.basename(XLSX)}. roster.json yang sudah ada dipakai apa adanya.`);
  process.exit(1);
}

// xlsx = zip berisi XML. Cukup unzip ke stdout, tanpa dependensi baru.
const baca = (isi) => execFileSync('unzip', ['-p', XLSX, isi], { maxBuffer: 64 * 1024 * 1024 }).toString();

const unesc = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
  .replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d)).replace(/&amp;/g, '&');

const strings = [...baca('xl/sharedStrings.xml').matchAll(/<si>([\s\S]*?)<\/si>/g)]
  .map((m) => [...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((t) => unesc(t[1])).join(''));

const sheet = baca('xl/worksheets/sheet1.xml');
const roster = [];
for (const r of sheet.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)) {
  const sel = {};
  for (const c of r[1].matchAll(/<c r="([A-Z]+)\d+"([^>]*)>([\s\S]*?)<\/c>/g)) {
    const v = (c[3].match(/<v>([\s\S]*?)<\/v>/) || [])[1];
    const inline = (c[3].match(/<t[^>]*>([\s\S]*?)<\/t>/) || [])[1];
    sel[c[1]] = /t="s"/.test(c[2]) ? strings[+v] : (inline !== undefined ? unesc(inline) : v);
  }
  const nama = String(sel.B || '').trim();
  const bus = String(sel.C || '').trim();
  if (!nama || nama.toUpperCase() === 'NAMA') continue;
  // Kolom D (nomor HP) sengaja diabaikan.
  roster.push({ nama, bus: bus.replace(/^BUS\s*/i, 'Bus ') });
}

fs.writeFileSync(path.join(REPO, 'roster.json'), JSON.stringify(roster, null, 1) + '\n');
const perBus = {};
roster.forEach((r) => { perBus[r.bus] = (perBus[r.bus] || 0) + 1; });
console.log(`roster.json: ${roster.length} nama |`, perBus);

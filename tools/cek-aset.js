// Cek semua rujukan aset benar-benar ada. Menangkap hal seperti beranda yang
// memuat "site-navigation.js" tanpa "../" sehingga navigasinya mati diam-diam.
// Jalankan: python3 -m http.server 8765  lalu  node tools/cek-aset.js
const fs = require('fs');
const path = require('path');

const REPO = path.join(__dirname, '..');
const BASE = process.env.BASE || 'http://localhost:8765/';

const halaman = fs.readdirSync(REPO)
  .filter((d) => fs.existsSync(path.join(REPO, d, 'code.html')))
  .map((d) => `${d}/code.html`)
  .concat(['index.html']);

const rujukan = new Map(); // url -> siapa yang merujuk
const tambah = (u, dari) => { if (!rujukan.has(u)) rujukan.set(u, dari); };

for (const f of halaman) {
  tambah(f, 'daftar halaman');
  const isi = fs.readFileSync(path.join(REPO, f), 'utf8');
  const dir = path.dirname(f);
  for (const m of isi.matchAll(/(?:src|href)="([^"#][^"]*)"/g)) {
    if (/^(https?:|mailto:|tel:|data:|#)/.test(m[1])) continue;
    tambah(path.normalize(path.join(dir, m[1])), f);
  }
}

const css = fs.readFileSync(path.join(REPO, 'styles.css'), 'utf8');
for (const m of css.matchAll(/url\(\.?\/?([^)]*\.woff2)\)/g)) tambah(m[1].replace(/^\.\//, ''), 'styles.css');

const sw = fs.readFileSync(path.join(REPO, 'sw.js'), 'utf8');
for (const m of sw.matchAll(/'\.\/([^']+)'/g)) tambah(m[1], 'sw.js ASSETS');

(async () => {
  const gagal = [];
  for (const [u, dari] of rujukan) {
    const res = await fetch(BASE + u.replace(/^\.\//, '')).catch(() => null);
    if (!res || !res.ok) gagal.push(`${u}  (dirujuk ${dari}) -> ${res ? res.status : 'tidak bisa dihubungi'}`);
  }
  console.log(`aset dicek: ${rujukan.size} | gagal: ${gagal.length}`);
  gagal.forEach((g) => console.log('  ' + g));
  process.exit(gagal.length ? 1 : 0);
})();

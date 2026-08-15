#!/usr/bin/env node
// Cek class HTML yang tidak punya aturan CSS sama sekali.
// styles.css adalah hasil build Tailwind yang sudah di-purge dan repo ini tidak punya
// build pipeline, jadi class baru (mis. "border-gold/30") diam-diam tidak berefek apa pun.
//
// Pakai: node tools/check-classes.js <file.html> [file.html ...]
// Keluar dengan kode 1 kalau ada class yang tidak terdefinisi.

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const sheet = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');

// Class yang efeknya datang dari JS/atribut, bukan dari CSS.
const IGNORE = /^(dark|group|material-symbols-outlined|is-active)$/;

// Nilai yang disisipkan saat runtime lewat template literal tidak bisa dicek statis.
const isPlaceholder = (n) => n.includes('${') || n.includes('`');

// Tailwind meng-escape ". : / [ ] %" dengan backslash di CSS hasil build, jadi
// tiap karakter itu dicocokkan dengan backslash opsional di depannya.
const defined = (css, name) => {
  let pola = '';
  for (const ch of name) {
    if ('.:/[]%,()'.includes(ch)) pola += '\\\\?\\' + ch;
    else if ('*+?^${}()|\\'.includes(ch)) pola += '\\' + ch;
    else pola += ch;
  }
  return new RegExp('\\.' + pola + '(?![\\w-])').test(css);
};

let failed = 0;

for (const file of process.argv.slice(2)) {
  const html = fs.readFileSync(file, 'utf8');
  const inline = (html.match(/<style[^>]*>[\s\S]*?<\/style>/g) || []).join('\n');
  const css = sheet + '\n' + inline;

  const names = new Set();
  for (const m of html.matchAll(/class="([^"]*)"/g)) {
    // Buang ekspresi ${...} milik template literal; isinya kode, bukan nama class.
    const nilai = m[1].replace(/\$\{[^}]*\}/g, ' ');
    // Atribut yang dirakit lewat penyambungan string JS ("... ' + x + ' ...")
    // tidak bisa dinilai statis; kutip tunggal atau backtick adalah tandanya.
    if (/['`]/.test(nilai)) continue;
    for (const n of nilai.split(/\s+/)) if (n && !IGNORE.test(n) && !isPlaceholder(n)) names.add(n);
  }

  const dead = [...names].filter((n) => !defined(css, n)).sort();
  const rel = path.relative(root, file);
  if (dead.length) {
    failed++;
    console.log(`FAIL ${rel} — ${dead.length} class tanpa aturan CSS:`);
    for (const n of dead) console.log(`       ${n}`);
  } else {
    console.log(`OK   ${rel} — ${names.size} class, semua terdefinisi`);
  }
}

process.exit(failed ? 1 : 0);

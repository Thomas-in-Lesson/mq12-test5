// Test suite bagian C. Jalankan: node tools/test-nama.js
// Dua daftar di bawah diambil langsung dari PEMBENAHAN-SAFARI-MQ12-v2.md.
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { namesMatch, phoneticWord, tokenize, pickCanonical } = require('./name-utils');

const HARUS_PISAH = [
  ['Dwi Lestari', 'Putri Lestari'],
  ['Ikhlasul Abror', 'Ikhlasul Muttaqin'],
  ['Fatimah Binti Maimun', 'Fatimah Ratna Dewi'],
  ['Muchtar Amin', 'Umar Muchtar A'],
  ['M Alam Sahrul', 'M Ali Ridlo'],
  ['Bpk Nurhadi', 'Nur Hilmiyatul Azizah'],
  ['Ahmad Syarifuddin', 'Ananda Mustika'],
  ['Ahmad Nurdiansyah', 'Anis Nurlaili'],
];

const HARUS_GABUNG = [
  ['Juwatono Firmansyah Abadi', 'J Firmansyah Abadi'],
  ['Yonsania Nur Fadhilah', 'Yonsania Nur Fadilah'],
  ['Ananda Mustika Sari', 'Ananda Mustika S'],
  ["Lu'lu' Khoirunnisa'", "Lulu' Khoirunnisa"],
  ['Devi Nuria Arsanti', 'Devi Nuriya Arsanti'],
];

let gagal = 0;
for (const [a, b] of HARUS_PISAH) {
  if (namesMatch(a, b)) { console.error(`GAGAL (harus pisah): ${a}  <->  ${b}`); gagal++; }
}
for (const [a, b] of HARUS_GABUNG) {
  if (!namesMatch(a, b)) { console.error(`GAGAL (harus gabung): ${a}  <->  ${b}`); gagal++; }
}

// Regresi B-2a: prefiks M hanya dipotong bila diikuti titik atau spasi.
assert.deepStrictEqual(tokenize('Mustofa'), ['mustofa']);
assert.deepStrictEqual(tokenize('Maimun'), ['maimun']);
assert.deepStrictEqual(tokenize('M.Ikhlasul Muttaqin'), ['ikhlasul', 'muttaqin']);
assert.deepStrictEqual(tokenize('Muh. Ikhlasul Muttaqin'), ['ikhlasul', 'muttaqin']);
assert.deepStrictEqual(tokenize('Bpk Irfan Fanani'), ['irfan', 'fanani']);
assert.deepStrictEqual(tokenize('Bpk'), ['bpk']); // gelar tunggal tidak boleh habis
assert.deepStrictEqual(tokenize('M'), ['m']);

// Transposisi s/h yang lazim di transliterasi Arab
assert.strictEqual(phoneticWord('tahsinatus'), phoneticWord('tashinatus'));
// ...tapi jangan sampai Muhammad dan Ahmad jadi satu
assert.notStrictEqual(phoneticWord('muhammad'), phoneticWord('ahmad'));

// Varian transliterasi harus punya bentuk fonetik yang sekeluarga.
assert.strictEqual(phoneticWord('fadhilah'), phoneticWord('fadilah'));
assert.strictEqual(phoneticWord('fadhilah'), phoneticWord('fadillah'));

assert.strictEqual(pickCanonical(['j firmansyah abadi', 'Juwatono Firmansyah Abadi']), 'Juwatono Firmansyah Abadi');

// C-4: salinan normalisasi di site-navigation.js tidak boleh melenceng.
const nav = fs.readFileSync(path.join(__dirname, '..', 'site-navigation.js'), 'utf8');
const blok = nav.match(/NAME-PHONETIC-START[\s\S]*?\*\/([\s\S]*?)\/\*\s*---\s*NAME-PHONETIC-END/);
assert.ok(blok, 'blok NAME-PHONETIC tidak ditemukan di site-navigation.js');
const web = new Function(`${blok[1]}; return { normalizeInputName, phoneticWord, phoneticKey };`)();
for (const w of ['fadhilah', 'khoirunnisa', 'muttaqin', 'juwatono', 'syarifuddin', 'nurdiansyah', 'lulu', 'tahsinatus']) {
  assert.strictEqual(web.phoneticWord(w), phoneticWord(w), `salinan phoneticWord melenceng pada "${w}"`);
}
// normalizeInputName() di browser wajib menghasilkan token yang sama dengan tokenize()
for (const n of ['Muchamad Alam Sahrul', 'Mochammad Rizky', 'Mahmud Yunus', 'Mustofa Kamil',
  'Bpk. Irfan Fanani', "Lu'lu' Khoirunnisa'", 'M.Ikhlasul Muttaqin', 'Munta Zemmahal', 'Bpk', 'M']) {
  assert.strictEqual(web.normalizeInputName(n), tokenize(n).join(' '), `normalizeInputName melenceng pada "${n}"`);
}

// C-4 "selesai bila": ejaan mana pun mendarat di profil yang sama.
// Meniru pencarian di site-navigation.js: exact -> sebunyi -> sebagian.
const peserta = require('../peserta.json');
const indeks = Object.entries(peserta).map(([key, item]) => {
  const ejaan = [item.name, ...(item.aliases || [])];
  return { key, norm: new Set(ejaan.map(web.normalizeInputName)), fon: new Set(ejaan.map(web.phoneticKey)) };
});
function cari(q) {
  const nq = web.normalizeInputName(q);
  const fq = web.phoneticKey(q);
  const exact = indeks.filter((i) => i.key === nq || i.norm.has(nq));
  if (exact.length) return exact[0].key;
  const sebunyi = indeks.filter((i) => fq && i.fon.has(fq));
  if (sebunyi.length) return sebunyi[0].key;
  const sebagian = indeks.filter((i) => [...i.norm].some((n) => n.includes(nq)));
  return sebagian.length ? sebagian[0].key : null;
}

for (const varian of [
  ['Thousan Ahmad Alin Hisan Syamsuddin', 'Thousan A. A. H. S.', 'Thousand A.A. H. S.', 'THOUSAN AHMAD A.H.S'],
  ['Yonsania Nur Fadhilah', 'Yonsania Nur Fadilah', 'Yonsania Nur Fadillah'],
  ["Lu'lu' Khoirunnisa'", "Lulu' Khoirunnisa", 'lulu khoirunisa'],
  ['M Ikhlasul Muttaqin', 'M.Ikhlasul Muttaqin', 'Muh. Ikhlasul Muttaqin'],
]) {
  const kunci = varian.map(cari);
  assert.ok(kunci[0], `"${varian[0]}" tidak ditemukan di peserta.json`);
  assert.strictEqual(new Set(kunci).size, 1, `ejaan berbeda mendarat di profil berbeda: ${JSON.stringify(varian.map((v, i) => `${v} -> ${kunci[i]}`))}`);
}

// Nama yang memang beda orang tidak boleh tertukar.
assert.notStrictEqual(cari('Dwi Lestari'), cari('Putri Lestari'));
assert.notStrictEqual(cari('Ikhlasul Abror'), cari('Ikhlasul Muttaqin'));

if (gagal) { console.error(`\n${gagal} kasus gagal`); process.exit(1); }
console.log(`OK — ${HARUS_PISAH.length} kasus pisah, ${HARUS_GABUNG.length} kasus gabung, tokenizer, fonetik, salinan browser, dan pencarian end-to-end atas ${indeks.length} profil semua lolos.`);

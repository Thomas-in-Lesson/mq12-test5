// Penggabungan varian ejaan nama (PEMBENAHAN v2 bagian C, langkah 1-4).
// Dipakai tools/merge-nama.js dan tools/build-peserta.js.
// phoneticWord() juga ada salinannya di site-navigation.js supaya pencarian di
// browser ikut memaafkan; tools/test-nama.js menjaga kedua salinan tetap sama.

// Langkah 1 - Tokenisasi
// Gelar hanya dibuang bila berada di depan. Kalau dibuang di mana saja, "H" pada
// "Thousan Ahmad Alin HS" ikut hilang.
const GELAR = new Set(['bpk', 'bp', 'pak', 'ibu', 'bu', 'mba', 'mbak', 'drs', 'hj', 'ny', 'kh', 'ust', 'ustadz', 'ustadzah', 'h']);
// Prefiks "Muhammad" ditulis belasan cara: M, Muh, Moh, Moch, Much, Muhamad,
// Muchamad, Mochammad... Semuanya menyusut ke awalan "mhmd" secara fonetik.
// Syarat diawali "mu"/"mo" menjaga nama asli seperti Mahmud tetap utuh.
const prefiksMuhammad = (t) => t === 'm' || (/^m[uo]/.test(t) && 'mhmd'.startsWith(phoneticWord(t)));

function tokenize(name) {
  const raw = String(name)
    .toLowerCase()
    .replace(/['’`]/g, '')      // apostrof dibuang, bukan dijadikan pemisah: lu'lu -> lulu
    .replace(/[^a-z0-9]+/g, ' ') // titik ikut jadi pemisah: "m.ikhlasul" -> "m ikhlasul"
    .split(' ')
    .filter(Boolean);
  let i = 0;
  while (i < raw.length - 1 && GELAR.has(raw[i])) i++; // sisakan minimal satu token
  // Prefiks M./Muh./Muhammad ikut dibuang, sama seperti normalizeInputName() di
  // browser. "Mustofa" tetap utuh karena ia satu token, bukan prefiks + nama.
  if (i < raw.length - 1 && prefiksMuhammad(raw[i])) i++;
  return raw.slice(i);
}

// Langkah 2 - Normalisasi fonetik
function phoneticWord(w) {
  return w
    .replace(/kh/g, 'h').replace(/dh/g, 'd').replace(/ts/g, 's')
    .replace(/sh/g, 's').replace(/hs/g, 's').replace(/ch/g, 'h')
    .replace(/y/g, 'i').replace(/j/g, 'z').replace(/q/g, 'k').replace(/f/g, 'p')
    .replace(/(.)\1+/g, '$1')
    .replace(/[aeiou]/g, '')
    .replace(/h+$/, ''); // rohma/rohmah, aziza/azizah, fadhilla/fadhilah
}

// Langkah 3 - Kecocokan antar kata.
// 'full' = benar-benar kata yang sama (persis atau seasal secara fonetik).
// 'partial' = pemendekan atau inisial; tidak boleh jadi satu-satunya alasan menggabung.
function wordsMatch(a, b) {
  if (a === b) return 'full';
  const pa = phoneticWord(a);
  const pb = phoneticWord(b);
  if (pa && pa === pb) return 'full';
  if (a.length >= 4 && b.length >= 4 && (a.startsWith(b) || b.startsWith(a))) return 'partial';
  if (pa.length >= 3 && pb.length >= 3 && (pa.startsWith(pb) || pb.startsWith(pa))) return 'partial';
  if ((a.length === 1 || b.length === 1) && a[0] === b[0]) return 'partial';
  return null;
}

// Langkah 4 - Kecocokan antar nama. Mengembalikan alasan penolakan supaya
// merge-nama.js bisa memisahkan "jelas beda" dari "ragu, perlu mata manusia".
function compareNames(nameA, nameB, { longgar = false } = {}) {
  const A = tokenize(nameA);
  const B = tokenize(nameB);
  if (!A.length || !B.length) return { match: false, reason: 'kosong' };

  // Ejaan yang spasinya hilang: "Munta'zemmahal" vs "Munta' Zemmahal"
  const rapat = (t) => t.join('');
  if (rapat(A) === rapat(B) || phoneticWord(rapat(A)) === phoneticWord(rapat(B))) {
    return { match: true, full: Math.min(A.length, B.length), firstFull: true };
  }

  const [short, long] = A.length <= B.length ? [A, B] : [B, A];

  const awal = wordsMatch(short[0], long[0]);
  if (!awal) return { match: false, reason: 'kata pertama beda' };

  let cursor = 0;
  let full = 0;
  const used = new Set();
  for (const w of short) {
    let hit = -1;
    for (let k = cursor; k < long.length; k++) {
      if (used.has(k)) continue;
      const kind = wordsMatch(w, long[k]);
      if (kind) {
        hit = k;
        used.add(k);
        if (kind === 'full') full++;
        break;
      }
    }
    if (hit === -1) {
      // Fallback: search anywhere in long for unused match (handles transposed initial ordering e.g. Thousan Alin A H S)
      for (let k = 0; k < long.length; k++) {
        if (used.has(k)) continue;
        const kind = wordsMatch(w, long[k]);
        if (kind) {
          hit = k;
          used.add(k);
          if (kind === 'full') full++;
          break;
        }
      }
    }
    if (hit === -1) return { match: false, reason: 'urutan kata tidak cocok' };
    if (hit >= cursor) cursor = hit + 1;
  }

  // Yang berbahaya adalah kecocokan lewat inisial/pemendekan. Selama masih ada
  // dua kata yang benar-benar sama, atau seluruh kata cocok penuh dan jumlah
  // katanya sama, penggabungan aman. "A Nurdiansyah" hanya punya satu kata penuh,
  // jadi ia tidak bisa menjembatani "Ahmad Nurdiansyah" ke "Anis Nurlaili".
  const semuaPenuh = full === short.length && short.length === long.length;
  // Nama depan yang kuat = dua-duanya kata utuh, bukan inisial. Inilah pembeda
  // "Thousan/Thousand ..." (aman) dari "A Nurdiansyah" (jembatan berbahaya).
  // Kemiripan fonetik saja tidak cukup di sini ("Thousan" vs "Tahsinatus" sama-sama
  // thsn...); harus benar-benar berawalan sama huruf per huruf.
  const firstFull = awal === 'full' ||
    (short[0].length >= 4 && long[0].length >= 4 && (short[0].startsWith(long[0]) || long[0].startsWith(short[0])));
  if (full >= 2 || semuaPenuh) return { match: true, full, firstFull };

  // Mode longgar dipakai buildClusters hanya untuk kandidat yang tidak ambigu:
  // nama depan utuh + sisanya inisial ("Thousan A. A. H. S.").
  if (longgar && firstFull && short.length >= 2) return { match: true, full, firstFull, longgar: true };

  // full === 0 berarti seluruh sambungan cuma inisial; itu kebetulan, bukan keraguan.
  return { match: false, reason: 'hanya cocok lewat inisial/pemendekan', ragu: full > 0, firstFull };
}

const namesMatch = (a, b) => compareNames(a, b).match;

// Seberapa rapi kapitalisasinya: Title Case = 1, huruf kecil semua = 0,
// KAPITAL SEMUA dihukum karena terbaca seperti berteriak di kartu peserta.
function skorRapi(s) {
  const t = String(s).trim();
  if (!t) return 0;
  if (t === t.toLowerCase()) return 0;
  if (t === t.toUpperCase() && /[A-Z]{2}/.test(t)) return 0.2;
  const kata = t.split(/\s+/);
  return kata.filter((w) => /^[A-Z]/.test(w)).length / kata.length;
}

// C-2 - Nama kanonik: kata utuh terbanyak (inisial tidak dihitung, supaya
// "Thousan Ahmad Alin HS" menang atas "Thousand A.A. H. S."), lalu kapitalisasi
// paling rapi, lalu ejaan yang paling sering muncul di data.
function pickCanonical(spellings, freq) {
  const utuh = (s) => tokenize(s).filter((w) => w.length >= 2).length;
  const sering = (s) => (freq && freq.get(s)) || 0;
  return [...spellings].sort((a, b) =>
    utuh(b) - utuh(a) ||
    skorRapi(b) - skorRapi(a) ||
    sering(b) - sering(a) ||
    tokenize(b).length - tokenize(a).length ||
    tokenize(b).join(' ').length - tokenize(a).join(' ').length ||
    a.localeCompare(b)
  )[0];
}

module.exports = { GELAR, tokenize, phoneticWord, wordsMatch, compareNames, namesMatch, pickCanonical, skorRapi };

#!/usr/bin/env python3
"""Tulis daftar ikon yang tersedia di font fallback ke fonts/ikon-tersedia.txt.

Jalankan: python3 tools/build_ikon_daftar.py
Butuh    : pip install fonttools brotli   (hanya untuk menjalankan skrip ini)

Ikon di halaman ditulis sebagai ligatur, mis. <span class="material-symbols-
outlined">home</span>. Saat online, ligatur itu disediakan font dari Google.
Saat offline, yang dipakai fonts/material-symbols-outlined-fallback-*.woff2 —
sebuah subset kurasi yang hanya memuat ikon yang memang dipakai situs ini.

Akibatnya, memakai nama ikon baru yang belum ada di subset membuat ikon itu
tampil sebagai TEKS MENTAH ketika peserta sedang offline, tanpa error apa pun.
Daftar hasil skrip ini dipakai tools/check-halaman.js untuk menjaganya, supaya
pemeriksaannya sendiri tidak perlu fontTools.

Kalau berkas fontnya diganti, jalankan ulang skrip ini dan commit hasilnya.
"""

import glob
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KELUARAN = os.path.join(REPO, 'fonts', 'ikon-tersedia.txt')

ANGKA = {'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4',
         'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9'}


def huruf(nama_glyph):
    """Komponen ligatur memakai nama glyph, bukan karakter apa adanya."""
    if nama_glyph == 'underscore':
        return '_'
    if nama_glyph.startswith('digit_'):
        return ANGKA.get(nama_glyph[6:], '?')
    return nama_glyph if len(nama_glyph) == 1 else '?'


def ligatur(path):
    from fontTools.ttLib import TTFont
    font = TTFont(path)
    hasil = set()

    def telusuri(sub, tipe):
        # LookupType 7 hanya pembungkus; isinya harus dibuka dulu.
        if tipe == 7:
            telusuri(sub.ExtSubTable, sub.ExtensionLookupType)
            return
        for awal, kumpulan in getattr(sub, 'ligatures', {}).items():
            for lig in kumpulan:
                hasil.add(huruf(awal) + ''.join(huruf(c) for c in lig.Component))

    for lookup in font['GSUB'].table.LookupList.Lookup:
        for sub in lookup.SubTable:
            telusuri(sub, lookup.LookupType)
    return hasil


def main():
    cocok = glob.glob(os.path.join(REPO, 'fonts', 'material-symbols-*.woff2'))
    if not cocok:
        sys.exit('font fallback tidak ditemukan di fonts/')
    font = cocok[0]

    ikon = sorted(i for i in ligatur(font) if '?' not in i)
    with open(KELUARAN, 'w', encoding='utf-8') as f:
        f.write('# Ikon yang tersedia di ' + os.path.basename(font) + '\n')
        f.write('# Dibuat oleh tools/build_ikon_daftar.py — jangan disunting manual.\n')
        f.write('# Nama ikon di luar daftar ini akan tampil sebagai teks saat offline.\n')
        f.write('\n'.join(ikon) + '\n')

    print(f'{len(ikon)} ikon -> {os.path.relpath(KELUARAN, REPO)}')


if __name__ == '__main__':
    main()

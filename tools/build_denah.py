#!/usr/bin/env python3
"""Siapkan denah lokasi ziarah untuk web: kompres gambar + tulis denah-data.js.

Jalankan: python3 tools/build_denah.py
Sumber  : ~/Documents/#Experiment/Denah-sesi1/ , Denah-sesi2/ , Denah-sesi3/
Hasil   : denah/sesi<N>/<slug>.webp|.jpg (+ -kecil untuk daftar), denah-data.js

Berkas aslinya ~1,8 MB per denah (3754x2390). Untuk dipakai di HP itu terlalu
berat, jadi tiap denah dikecilkan jadi WebP ~80 KB tanpa kehilangan ketajaman
garis, dengan JPEG cadangan untuk peramban lama. Sesi yang foldernya belum ada
otomatis kosong, dan halaman akan menampilkan "segera hadir".
"""

import json
import os
import re
import sys

from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SUMBER = os.path.expanduser('~/Documents/#Experiment')
TUJUAN = os.path.join(REPO, 'denah')
DATA_JS = os.path.join(REPO, 'denah-data.js')

LEBAR_PENUH, MUTU_PENUH = 2400, 80
LEBAR_KECIL, MUTU_KECIL = 480, 78
LEBAR_JPG = 2000  # cadangan untuk peramban tanpa WebP, sengaja lebih kecil

# Warna diambil langsung dari kotak legenda di berkas aslinya.
LEGENDA = [
    ('#B1FF00', 'Tempat Imam Ziaroh'),
    ('#B1FF00', 'Tempat duduk Wali Talqin'),
    ('#58FF00', 'Tempat duduk Tim Pendamping'),
    ('#76FFD5', 'Tempat duduk Murid Laki-Laki'),
    ('#DC1CFF', 'Tempat duduk Murid Perempuan'),
    ('#2F70FF', 'Blok A Penata Acara, B Spiritual, C Perlengkapan'),
    ('#FFFFFF', 'Makam'),
    ('#000000', 'Jalur Peserta'),
    ('#58FF00', 'Jalur VIP & VVIP'),
    ('#7F7F7F', 'Tempat sepatu murid'),
]
PARKIR = [('P1', 'Parkir VIP'), ('P2', 'Parkir Ambulan'),
          ('P3', 'Parkir Perlengkapan'), ('P4', 'Parkir Peserta')]

# Judul, jam, dan daerah diselaraskan dengan agenda ziarah di rundown Sesi 1.
# "cocok" dipakai halaman Rundown untuk menautkan agenda ke denah yang tepat.
SESI1 = {
    "Denah Mbah Syuhada'.jpg": (1, "Makam Kyai Achmad Syuhada'", '05.55 – 06.25', 'Pesantren', 'syuhada', ['syuhada']),
    'Denah Mbah Sanusi.jpg': (2, 'Makam Kyai Achmad Sanusi Tamriz Abdul Ghofar', '09.00 – 09.30', 'Kabuh', 'sanusi', ['sanusi']),
    'Denah Mbah Zamrozi.jpg': (3, 'Makam Kyai Achmad Zamrozi', '10.25 – 10.55', 'Ploso', 'zamrozi', ['zamrozi']),
    'Denah Mbah Falal.jpg': (4, 'Makam Kyai Achmad Falal', '11.45 – 12.15', 'Megaluh', 'falal', ['falal']),
    'Denah Bp Dukhan Iskandar.jpg': (5, 'Jati Kasampurnan — Makam Kholifah Dukhan Iskandar', '15.25 – 15.55', 'Jati Kasampurnan, Kuncung', 'dukhan-iskandar', ['dukhan']),
    'Denah Bp. Salamun & Bp Sumadji.jpg': (6, 'Makam Kholifah Shiddiqiyyah Bp. Salamun & Bp. Sumadji', '16.10 – 16.40', 'Kuncung', 'salamun-sumadji', ['sumadji', 'salamun']),
    'Denah Imam Dzipuro.jpg': (7, 'Makam Syekh Imam Puro', '17.05 – 17.35', 'Kuncung', 'imam-puro', ['dzipuro', 'imam puro']),
    'Denah Jumadil Kubro.jpg': (8, 'Makam Syekh Jumadil Kubro', '19.00 – 19.30', 'Mojokerto', 'jumadil-kubro', ['jumadil']),
}
META = {'sesi1': SESI1, 'sesi2': {}, 'sesi3': {}}


def slug_dari(nama):
    s = re.sub(r'^denah\s*', '', os.path.splitext(nama)[0], flags=re.I)
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', s.lower())).strip('-')


def simpan(im, path_dasar, lebar, mutu, lebar_jpg=None):
    kecil = im.resize((lebar, round(lebar * im.height / im.width)), Image.LANCZOS)
    kecil.save(path_dasar + '.webp', 'WEBP', quality=mutu, method=6)
    lj = lebar_jpg or lebar
    jpg = im.resize((lj, round(lj * im.height / im.width)), Image.LANCZOS)
    jpg.save(path_dasar + '.jpg', 'JPEG', quality=mutu, optimize=True, progressive=True)
    return os.path.getsize(path_dasar + '.webp'), os.path.getsize(path_dasar + '.jpg')


def olah(sesi):
    folder = os.path.join(SUMBER, f'Denah-{sesi}')
    if not os.path.isdir(folder):
        print(f'{sesi}: folder belum ada, dilewati')
        return []

    keluar = os.path.join(TUJUAN, sesi)
    os.makedirs(keluar, exist_ok=True)
    meta = META.get(sesi, {})
    hasil, total = [], 0

    for nama in sorted(os.listdir(folder)):
        if not nama.lower().endswith(('.jpg', '.jpeg', '.png')):
            continue
        info = meta.get(nama)
        if info:
            no, judul, jam, daerah, slug, cocok = info
        else:
            # Sesi 2 & 3 belum punya tabel; pakai nama berkas apa adanya.
            no, judul, jam, daerah = len(hasil) + 1, os.path.splitext(nama)[0], '', ''
            slug, cocok = slug_dari(nama), []

        im = Image.open(os.path.join(folder, nama)).convert('RGB')
        w1, j1 = simpan(im, os.path.join(keluar, slug), LEBAR_PENUH, MUTU_PENUH, LEBAR_JPG)
        w2, j2 = simpan(im, os.path.join(keluar, slug + '-kecil'), LEBAR_KECIL, MUTU_KECIL)
        total += w1 + w2

        hasil.append({'no': no, 'judul': judul, 'jam': jam, 'daerah': daerah,
                      'slug': slug, 'cocok': cocok})
        print(f'  {no}. {judul[:46]:46s} {w1/1024:5.0f} KB  (cadangan jpg {j1/1024:.0f} KB)')

    hasil.sort(key=lambda x: x['no'])
    print(f'{sesi}: {len(hasil)} denah, {total/1024:.0f} KB WebP')
    return hasil


def main():
    os.makedirs(TUJUAN, exist_ok=True)
    data = {'legenda': [{'warna': w, 'label': l} for w, l in LEGENDA],
            'parkir': [{'kode': k, 'label': l} for k, l in PARKIR]}
    for sesi in ('sesi1', 'sesi2', 'sesi3'):
        data[sesi] = olah(sesi)

    with open(DATA_JS, 'w', encoding='utf-8') as f:
        f.write('// Dibuat oleh tools/build_denah.py — jangan disunting manual.\n')
        f.write('window.DENAH = ' + json.dumps(data, ensure_ascii=False, indent=2) + ';\n')
    print(f'-> {os.path.relpath(DATA_JS, REPO)}')


if __name__ == '__main__':
    sys.exit(main())

#!/usr/bin/env python3
"""Siapkan denah lokasi ziarah untuk web: kompres gambar + tulis denah-data.js.

Jalankan: python3 tools/build_denah.py
Sumber  : ~/Documents/#Experiment/Denah-sesi<N>/ — ejaan folder bebas
          ("Denah Sesi 2", "denah_sesi2", dst. semuanya dikenali)
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
# Sesi 2: urutan mengikuti rundown, bukan nomor yang tertulis di berkas panitia
# (di sana Sunan Ampel bernomor 11 tapi diziarahi sesudah Wage Supratman).
# Jam dan daerah disalin apa adanya dari agenda rundown Sesi 2.
# Unsur ke-7 "aksi" hanya untuk denah jalur: baris agendanya bukan "Ziarah ...",
# jadi kata kuncinya disebut sendiri di sini.
SESI2 = {
    'Bung Karno.jpg': (1, 'Makam Bung Karno', '07.55 – 08.55', 'Hari ke-1 · Blitar', 'bung-karno', ['bung karno']),
    'Museum Mpu Tantular.jpg': (2, 'Museum Mpu Tantular', '14.40 – 15.40', 'Hari ke-1 · Sidoarjo', 'mpu-tantular', ['mpu tantular']),
    'Wage Supratman.jpg': (3, 'Makam Wage Supratman', '17.10 – 18.10', 'Hari ke-1 · Surabaya', 'wage-supratman', ['supratman']),
    'Sunan Ampel.jpg': (4, 'Makam Sunan Ampel', '19.10 – 19.40', 'Hari ke-1 · Surabaya', 'sunan-ampel', ['sunan ampel']),
    'Yang ini masukno di perjalanan menuju sunan gresik.jpg': (
        5, 'Jalur Jalan Kaki: Hotel Khas Gresik – Sunan Gresik – Raden Santri',
        '05.00 – 05.15', 'Hari ke-2 · Gresik', 'jalan-kaki-gresik',
        ['sunan gresik', 'raden santri'], 'perjalanan menuju|jalan kaki'),
    'Maulana Malik Ibrahim.jpg': (6, 'Makam Sunan Gresik (Maulana Malik Ibrahim)', '05.30 – 06.00', 'Hari ke-2 · Gresik', 'sunan-gresik', ['sunan gresik']),
    'Raden Satri.jpg': (7, 'Makam Raden Santri (Sayyid Ali Murtadlo)', '06.20 – 06.50', 'Hari ke-2 · Gresik', 'raden-santri', ['raden santri']),
    'Sunan Deket.jpg': (8, 'Makam Sunan Deket', '09.25 – 09.55', 'Hari ke-2 · Lamongan', 'sunan-deket', ['sunan deket']),
    'Sunan Drajat.jpg': (9, 'Makam Sunan Drajat', '11.10 – 11.40', 'Hari ke-2 · Lamongan', 'sunan-drajat', ['sunan drajat']),
    'Ibrohim Asmoroqondi.jpg': (10, 'Makam Maulana Ibrahim Asmoroqondi', '13.15 – 13.45', 'Hari ke-2 · Tuban', 'asmoroqondi', ['asmorokondi', 'asmoroqondi']),
    'Sunan Bonang.jpg': (11, 'Makam Sunan Bonang', '16.15 – 16.45', 'Hari ke-2 · Tuban', 'sunan-bonang', ['sunan bonang']),
}

META = {'sesi1': SESI1, 'sesi2': SESI2, 'sesi3': {}}


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


def folder_sesi(sesi):
    """Cari folder sumber tanpa mempermasalahkan spasi, garis, atau huruf besar."""
    pola = re.compile(r'denah[\s_-]*sesi[\s_-]*' + sesi[-1] + r'$', re.I)
    for nama in sorted(os.listdir(SUMBER)):
        if pola.match(nama.strip()) and os.path.isdir(os.path.join(SUMBER, nama)):
            return os.path.join(SUMBER, nama)
    return None


def olah(sesi):
    folder = folder_sesi(sesi)
    if not folder:
        print(f'{sesi}: folder belum ada, dilewati')
        return []
    print(f'{sesi}: sumber {os.path.relpath(folder, SUMBER)}')

    keluar = os.path.join(TUJUAN, sesi)
    os.makedirs(keluar, exist_ok=True)
    meta = META.get(sesi, {})
    hasil, total = [], 0

    for nama in sorted(os.listdir(folder)):
        if not nama.lower().endswith(('.jpg', '.jpeg', '.png')):
            continue
        info = meta.get(nama)
        aksi = ''
        if info:
            no, judul, jam, daerah, slug, cocok, *sisa = info
            aksi = sisa[0] if sisa else ''
        elif meta:
            # Sesi ini sudah punya tabel, jadi berkas asing berarti namanya
            # berubah — lebih baik berhenti daripada memasang label asal.
            raise SystemExit(f'{sesi}: berkas di luar tabel: {nama!r}')
        else:
            # Sesi tanpa tabel; pakai nama berkas apa adanya.
            no, judul, jam, daerah = len(hasil) + 1, os.path.splitext(nama)[0], '', ''
            slug, cocok = slug_dari(nama), []

        im = Image.open(os.path.join(folder, nama)).convert('RGB')
        w1, j1 = simpan(im, os.path.join(keluar, slug), LEBAR_PENUH, MUTU_PENUH, LEBAR_JPG)
        w2, j2 = simpan(im, os.path.join(keluar, slug + '-kecil'), LEBAR_KECIL, MUTU_KECIL)
        total += w1 + w2

        butir = {'no': no, 'judul': judul, 'jam': jam, 'daerah': daerah,
                 'slug': slug, 'cocok': cocok}
        if aksi:
            butir['aksi'] = aksi
        hasil.append(butir)
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

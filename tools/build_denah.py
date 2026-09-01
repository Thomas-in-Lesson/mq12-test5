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

# Sesi 3: urutan mengikuti waktu kunjungan di rundown, bukan urutan nama berkas.
# Beberapa denah bukan makam melainkan lokasi ISHOMA atau mini ceremony; baris
# agendanya tidak memuat kata "ziarah", jadi kata kuncinya disebut lewat "aksi".
# Yang dicocokkan adalah "agenda · daerah", karena beberapa agenda cuma tertulis
# "ISHOMA" atau "Mini Ceremony" dan hanya daerahnya yang membedakan.
SESI3 = {
    'BENTENG PENDEM.jpg': (1, 'Makam K.H Nur Salim & Benteng Pendem', '09.40 – 10.40', 'Hari ke-1 · Ngawi', 'benteng-pendem', ['nur salim', 'benteng pendem']),
    'MASJID A. KARANGANYAR.jpg': (2, 'Masjid Agung Karanganyar', '12.20 – 13.20', 'Hari ke-1 · Karanganyar', 'masjid-agung-karanganyar', ['masjid agung, karanganyar'], 'ishoma'),
    'ASTANA MANGADEG.jpg': (3, 'Makam P. Sambernyawa — Astana Mangadeg', '15.00 – 16.00', 'Hari ke-1 · Karanganyar', 'astana-mangadeg', ['sambernyawa', 'astana mangadeg']),
    'CANDI PRAMBANAN.jpg': (4, 'Candi Prambanan', '08.35 – 09.15', 'Hari ke-2 · Klaten', 'candi-prambanan', ['prambanan']),
    'JENDRAL SOEDIRMAN.jpg': (5, 'Makam Jendral Sudirman', '10.30 – 11.15', 'Hari ke-2 · Yogyakarta', 'jendral-sudirman', ['sudirman', 'soedirman']),
    'H.O.S. COKROAMIOTO.jpg': (6, 'Makam HOS Cokroaminoto & Kyai Surosentono', '12.00 – 12.45', 'Hari ke-2 · Yogyakarta', 'hos-cokroaminoto', ['cokroaminoto']),
    "MASJID SYUHADA'.jpg": (7, "Masjid Syuhada'", '13.30 – 15.00', 'Hari ke-2 · Yogyakarta', 'masjid-syuhada', ['syuhada'], 'ishoma'),
    'JMYR MUNGKID.jpg': (8, 'JMYR Mungkid — Mini Ceremony', '07.30 – 09.30', 'Hari ke-3 · Magelang', 'jmyr-mungkid', ['jmyr mungkid'], 'mini ceremony'),
    'STUPA BOROBUDUR.jpg': (9, 'Stupa Borobudur', '09.50 – 10.50', 'Hari ke-3 · Magelang', 'stupa-borobudur', ['borobudur']),
    'SOSROKARTONO.jpg': (10, 'Makam R. Sosrokartono', '17.10 – 17.40', 'Hari ke-3 · Kudus', 'sosrokartono', ['sosrokartono']),
    'DZATUL KAHFI & S. GUNUNG JATI.jpg': (11, 'Makam Syekh Dzatul Kahfi, R. Fatahillah & Syarif Hidayatullah', '10.40 – 11.50', 'Hari ke-4 · Cirebon', 'dzatul-kahfi-gunung-jati', ['dzatul kahfi', 'fatahillah']),
    'MASJID SYARIF ABDURRACHMAN.jpg': (12, 'Masjid Syarif Abdurrachman — Astana Gunung Jati', '12.05 – 13.35', 'Hari ke-4 · Cirebon', 'masjid-syarif-abdurrachman', ['astana gunung jati'], 'ishoma'),
    'PETA SYECH MUSA.jpg': (13, 'Peta Jalur Menuju Makam Syekh Musa', '07.00 – 10.00', 'Hari ke-5 · Sukanegara', 'peta-syekh-musa', ['syekh musa'], 'perjalanan menuju'),
    'SYECH MUSA.jpg': (14, 'Makam Syekh Musa', '10.30 – 12.30', 'Hari ke-5 · Sukanegara', 'syekh-musa', ['syekh musa']),
    'PESANTREN HSHF SUKABUMI.jpg': (15, 'Pesantren HSHF — Mini Ceremony', '06.30 – 09.00', 'Hari ke-6 · Pelabuhan Ratu', 'pesantren-hshf', ['pesantren hshf'], 'mini ceremony'),
    'BUNG HATTA.jpg': (16, 'Makam Bung Hatta — TPU Tanah Kusir', '12.30 – 14.30', 'Hari ke-6 · Jakarta Selatan', 'bung-hatta', ['bung hatta']),
    'HUSEIN MUTAHAR (TPU JERUK PURUT).jpg': (17, 'Makam Husein Mutahar — TPU Jeruk Purut', '15.30 – 16.00', 'Hari ke-6 · Jakarta Selatan', 'husein-mutahar', ['husein mutahar']),
    "ABU HANIFAH & KH. ABDUL MU'THI.jpg": (18, "Makam Abu Hanifah & K.H Abdul Mu'thi — Karet Bivak", '17.30 – 18.30', 'Hari ke-6 · Jakarta Pusat', 'abu-hanifah-abdul-muthi', ['abu hanifah']),
    'MUSEUM SUMPAH PEMUDA.jpg': (19, 'Museum Sumpah Pemuda', '07.30 – 09.00', 'Hari ke-7 · Jakarta Pusat', 'museum-sumpah-pemuda', ['sumpah pemuda']),
    'MONUMEN NASIONAL (MONAS).jpg': (20, 'Monumen Nasional (Monas)', '10.05 – 11.45', 'Hari ke-7 · Jakarta Pusat', 'monas', ['monas']),
    'MASJID ISTIQLAL.jpg': (21, 'Masjid Istiqlal', '12.05 – 14.05', 'Hari ke-7 · Jakarta Pusat', 'masjid-istiqlal', ['istiqlal']),
    'SUNAN KALI JOGO.jpg': (22, 'Makam Sunan Kalijogo', '09.05 – 09.35', 'Hari ke-8 · Demak', 'sunan-kalijogo', ['sunan kalijogo']),
    'SUNAN DEMAK.jpg': (23, 'Makam Raden Abdul Fattah Al-Akbar Panotogomo', '10.35 – 11.05', 'Hari ke-8 · Demak', 'raden-abdul-fattah', ['abdul fattah', 'panotogomo']),
}

META = {'sesi1': SESI1, 'sesi2': SESI2, 'sesi3': SESI3}


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

#!/usr/bin/env python3
"""Ambil profil singkat tokoh tiap lokasi ziarah dari berkas panitia.

Jalankan: python3 tools/build_profil.py [berkas] [sesi]
Default : berkas bawaan sesi yang diminta (lihat SUMBER), sesi1
Hasil   : profil-data.js

Sesi 1 datang sebagai PDF: tidak memakai baris kosong antarparagraf, jadi batas
paragraf dikenali dari jarak vertikal antarbaris (24pt di dalam paragraf, ~39pt
antarparagraf) dan judul dari ukuran fontnya (25.9pt vs 16pt isi).

Sesi 2 datang sebagai .docx: paragrafnya sudah eksplisit, tapi gaya judulnya
campur (List Paragraph, Normal (Web), polos), jadi judul dikenali dari isinya
lewat tabel PETA di bawah — bukan dari gayanya.
"""

import json
import os
import re
import sys
import zipfile
from xml.etree import ElementTree as ET

import pypdf

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_JS = os.path.join(REPO, 'profil-data.js')
SUMBER = {
    'sesi1': os.path.expanduser('~/Documents/#Experiment/Profil Singkat Sesi 1.pdf'),
    'sesi2': os.path.expanduser('~/Documents/#Experiment/Profil Singkat Sesi 2.docx'),
    'sesi3': os.path.expanduser('~/Documents/#Experiment/Update baru/PROFILE SINGKAT TUJUAN SESI 3.docx'),
}

UKURAN_JUDUL = 20      # apa pun di atas ini dianggap judul
JARAK_PARAGRAF = 30    # lompatan vertikal yang menandai paragraf baru

# Judul di PDF -> lokasi ziarah. Slug-nya sengaja disamakan dengan yang dipakai
# tools/build_denah.py supaya profil dan denah menempel ke lokasi yang sama.
# Satu lokasi boleh punya lebih dari satu tokoh (Bp. Sumadji & Bp. Salamun).
PETA_S1 = {
    'KYAI ACHMAD SYUHADA': ('syuhada', 'Kyai Ahmad Syuhada’'),
    'KYAI ACHMAD SANUSI': ('sanusi', 'Kyai Ahmad Sanusi Tamriz Abdul Ghofar'),
    'KYAI ACHMAD ZAMROZI': ('zamrozi', 'Kyai Ahmad Zamrozi'),
    'KYAI AHMAD FALAL': ('falal', 'Kyai Ahmad Falal'),
    'BAPAK KHOLIFAH DUCHAN ISKANDAR': ('dukhan-iskandar', 'Bapak Kholifah Duchan Iskandar'),
    'KHOLIFAH BAPAK SUMADJI': ('salamun-sumadji', 'Kholifah Bapak Sumadji'),
    'KHOLIFAH BAPAK MOCH. SALAMUN ADNAN': ('salamun-sumadji', 'Kholifah Bapak Moch. Salamun Adnan'),
    'SYEIKH IMAM DZIPURO': ('imam-puro', 'Syekh Imam Dzipuro'),
    'SYEIKH JUMADIL KUBRO': ('jumadil-kubro', 'Syekh Jumadil Kubro'),
}
# Slug disamakan dengan tools/build_denah.py; denah jalur jalan kaki Gresik
# memang tidak punya tokoh, jadi tidak ada di sini.
PETA_S2 = {
    'MUSEUM NEGERI MPU TANTULAR': ('mpu-tantular', 'Museum Negeri Mpu Tantular'),
    'SUNAN AMPEL': ('sunan-ampel', 'Sunan Ampel'),
    'RADEN SANTRI': ('raden-santri', 'Raden Santri'),
    'SUNAN DRAJAT': ('sunan-drajat', 'Sunan Drajat'),
    'SUNAN BONANG': ('sunan-bonang', 'Sunan Bonang'),
    'SUNAN GRESIK': ('sunan-gresik', 'Sunan Gresik'),
    'WAGE SUPRATMAN': ('wage-supratman', 'Wage Supratman'),
    'SUNAN DEKET': ('sunan-deket', 'Sunan Deket'),
    'BUNG KARNO': ('bung-karno', 'Bung Karno'),
    'IBRAHIM ASMORO QONDI': ('asmoroqondi', 'Syekh Maulana Ibrahim Asmoroqondi'),
}

# Slug disamakan dengan tools/build_denah.py. Tiga denah Sesi 3 sengaja tidak
# ada di sini karena bukan tujuan ziarah: Masjid Agung Karanganyar, Masjid
# Syarif Abdurrachman, dan peta jalur menuju Syekh Musa.
PETA_S3 = {
    'K.H MUHAMMAD NURSALIM ( BENTENG PENDEM)': ('benteng-pendem', 'K.H Muhammad Nursalim'),
    'RM SAID (PANGERAN SAMBERNYAWA) / KGPAA MANGKUNEGARA I': ('astana-mangadeg', 'RM Said (Pangeran Sambernyawa)'),
    'CANDI PRAMBANAN': ('candi-prambanan', 'Candi Prambanan'),
    'JENDRAL SUDIRMAN': ('jendral-sudirman', 'Jendral Sudirman'),
    'H.O.S COKROAMINOTO': ('hos-cokroaminoto', 'H.O.S Cokroaminoto'),
    'MASJID SYUHADA’': ('masjid-syuhada', 'Masjid Syuhada’'),
    'JAMI’ATUL MUDZAKKIRIN YARJUU ROCMATALLOH II SHIDDIQIYYAH': ('jmyr-mungkid', 'Jami’atul Mudzakkirin Yarjuu Rocmatalloh II Shiddiqiyyah'),
    'STUPA BOROBUDUR': ('stupa-borobudur', 'Stupa Borobudur'),
    'R.M.P SOSROKARTONO': ('sosrokartono', 'R.M.P Sosrokartono'),
    'SYEKH DZATUL KAHFI': ('dzatul-kahfi-gunung-jati', 'Syekh Dzatul Kahfi'),
    'RADEN FATAHILLAH DAN SUNAN GUNUNG JATI': ('dzatul-kahfi-gunung-jati', 'Raden Fatahillah dan Sunan Gunung Jati'),
    'SYEKH MUSA': ('syekh-musa', 'Syekh Musa'),
    'PESANTREN HAYYA ‘ALASSHOLAH HAYYA ‘ALAL FALACH': ('pesantren-hshf', 'Pesantren Hayya ‘Alassholah Hayya ‘Alal Falach'),
    'BUNG HATTA': ('bung-hatta', 'Bung Hatta'),
    'HUSEIN MUTAHAR': ('husein-mutahar', 'Husein Mutahar'),
    'ABU HANIFAH DAN K.H ABDUL MU’THI': ('abu-hanifah-abdul-muthi', 'Abu Hanifah dan K.H Abdul Mu’thi'),
    'MUSEUM SUMPAH PEMUDA': ('museum-sumpah-pemuda', 'Museum Sumpah Pemuda'),
    'MONUMEN NASIONAL': ('monas', 'Monumen Nasional'),
    'MASJID ISTIQLAL': ('masjid-istiqlal', 'Masjid Istiqlal'),
    'SUNAN KALIJAGA': ('sunan-kalijogo', 'Sunan Kalijaga'),
    'RADEN ABDUL FATAH AL AKBAR PANOTOGOMO (R. PATAH/ SULTAN DEMAK)': ('raden-abdul-fattah', 'Raden Abdul Fatah Al Akbar Panotogomo'),
}

PETA = {'sesi1': PETA_S1, 'sesi2': PETA_S2, 'sesi3': PETA_S3}
ABAIKAN = {'PROFIL SINGKAT SESI 1', 'PROFIL SINGKAT SESI 2', 'PROFIL SINGKAT SESI 3'}


def potongan(pdf_path):
    """[(ukuran_font, jarak_dari_baris_sebelumnya, teks)] dalam urutan baca."""
    reader = pypdf.PdfReader(pdf_path)
    hasil = []
    for page in reader.pages:
        baris = []

        def visitor(text, cm, tm, font_dict, font_size):
            if text and text.strip():
                baris.append((round(tm[5], 1), font_size or 0, text.strip()))

        page.extract_text(visitor_text=visitor)
        sebelum = None
        for y, fs, teks in baris:
            # Baris pertama tiap halaman tidak punya jarak yang bermakna;
            # ditandai None supaya tidak dianggap paragraf baru begitu saja.
            jarak = None if sebelum is None else abs(sebelum - y)
            hasil.append((fs, jarak, teks))
            sebelum = y
    return hasil


def parse(pdf_path, peta):
    tokoh, sekarang, paragraf = [], None, []

    def tutup():
        nonlocal paragraf
        if sekarang is not None and paragraf:
            teks = re.sub(r'\s+', ' ', ' '.join(paragraf)).strip()
            if teks:
                sekarang['paragraf'].append(teks)
        paragraf = []

    for fs, jarak, teks in potongan(pdf_path):
        if fs >= UKURAN_JUDUL:
            tutup()
            kunci = re.sub(r'\s+', ' ', teks).strip().upper()
            if kunci in ABAIKAN:
                sekarang = None
                continue
            info = peta.get(kunci)
            if not info:
                print(f'  ! judul tidak dikenal, dilewati: {teks!r}')
                sekarang = None
                continue
            slug, nama = info
            sekarang = {'slug': slug, 'nama': nama, 'paragraf': []}
            tokoh.append(sekarang)
            continue

        if sekarang is None:
            continue
        if jarak is None:
            # Pergantian halaman: kalimat bisa terbelah di tengah, jadi paragraf
            # hanya diputus kalau bagian sebelumnya memang sudah selesai.
            if paragraf and not re.search(r'[.!?:”"]\s*$', paragraf[-1]):
                paragraf.append(teks)
                continue
            tutup()
        elif jarak >= JARAK_PARAGRAF:
            tutup()
        paragraf.append(teks)

    tutup()
    return tokoh


W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'


def parse_docx(path, peta):
    with zipfile.ZipFile(path) as z:
        akar = ET.fromstring(z.read('word/document.xml'))

    tokoh, sekarang = [], None
    for p in akar.iter(W + 'p'):
        teks = re.sub(r'\s+', ' ', ''.join(t.text or '' for t in p.iter(W + 't'))).strip()
        if not teks or teks.upper() in ABAIKAN:
            continue

        info = peta.get(teks.upper())
        if info:
            sekarang = {'slug': info[0], 'nama': info[1], 'paragraf': []}
            tokoh.append(sekarang)
            continue

        # Baris pendek tanpa titik penutup persis di bawah judul adalah julukan
        # tokoh ("Si Jenius dari Timur"), bukan paragraf. Digabung ke namanya,
        # karena sebagai paragraf tersendiri ia terbaca seperti kalimat terpotong.
        if sekarang is not None and not sekarang['paragraf'] \
                and len(teks) < 45 and not teks.endswith('.'):
            sekarang['nama'] += f' — {teks}'
            print(f'  · julukan digabung ke nama: {teks!r}')
            continue

        # Baris pendek tanpa titik penutup biasanya judul. Kalau tidak ada di
        # tabel ia tetap dipakai sebagai isi — lebih baik salah tempat dan
        # kelihatan daripada hilang diam-diam — tapi diberitahukan.
        if len(teks) < 45 and not teks.endswith('.'):
            print(f'  ! judul tidak dikenal, dipakai sebagai isi: {teks!r}')
        if sekarang is None:
            print(f'  ! teks sebelum judul pertama, dilewati: {teks[:60]!r}')
            continue
        sekarang['paragraf'].append(teks)
    return tokoh


def main():
    sesi = sys.argv[2] if len(sys.argv) > 2 else 'sesi1'
    berkas = sys.argv[1] if len(sys.argv) > 1 else SUMBER.get(sesi, '')
    if not os.path.exists(berkas):
        raise SystemExit(f'{sesi}: berkas sumber tidak ada: {berkas}')

    data = {}
    if os.path.exists(DATA_JS):
        isi = open(DATA_JS, encoding='utf-8').read()
        if 'window.PROFIL = ' in isi:
            data = json.loads(isi.split('window.PROFIL = ', 1)[1].rsplit(';', 1)[0])
    for s in ('sesi1', 'sesi2', 'sesi3'):
        data.setdefault(s, [])

    # Kelompokkan per lokasi, urut sesuai kemunculan di dokumen.
    per_lokasi, urutan = {}, []
    baca = parse_docx if berkas.lower().endswith('.docx') else parse
    for t in baca(berkas, PETA[sesi]):
        if t['slug'] not in per_lokasi:
            per_lokasi[t['slug']] = []
            urutan.append(t['slug'])
        per_lokasi[t['slug']].append({'nama': t['nama'], 'paragraf': t['paragraf']})

    data[sesi] = [{'slug': s, 'tokoh': per_lokasi[s]} for s in urutan]

    for lok in data[sesi]:
        for t in lok['tokoh']:
            kata = sum(len(p.split()) for p in t['paragraf'])
            print(f"  {lok['slug']:18s} {t['nama'][:40]:40s} {len(t['paragraf'])} paragraf, {kata} kata")
    print(f"{sesi}: {len(data[sesi])} lokasi, {sum(len(l['tokoh']) for l in data[sesi])} tokoh")

    with open(DATA_JS, 'w', encoding='utf-8') as f:
        f.write('// Dibuat oleh tools/build_profil.py — jangan disunting manual.\n')
        f.write('window.PROFIL = ' + json.dumps(data, ensure_ascii=False, indent=2) + ';\n')
    print(f'-> {os.path.relpath(DATA_JS, REPO)}')


if __name__ == '__main__':
    main()

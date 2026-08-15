#!/usr/bin/env python3
"""Ambil profil singkat tokoh tiap lokasi ziarah dari PDF panitia.

Jalankan: python3 tools/build_profil.py [file.pdf] [sesi]
Default : ~/Documents/#Experiment/Profil Singkat Sesi 1.pdf , sesi1
Hasil   : profil-data.js

PDF-nya tidak memakai baris kosong antarparagraf, jadi batas paragraf dikenali
dari jarak vertikal antarbaris (24pt di dalam paragraf, ~39pt antarparagraf) dan
judul dikenali dari ukuran fontnya (25.9pt vs 16pt isi).
"""

import json
import os
import re
import sys

import pypdf

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_JS = os.path.join(REPO, 'profil-data.js')
DEFAULT_PDF = os.path.expanduser('~/Documents/#Experiment/Profil Singkat Sesi 1.pdf')

UKURAN_JUDUL = 20      # apa pun di atas ini dianggap judul
JARAK_PARAGRAF = 30    # lompatan vertikal yang menandai paragraf baru

# Judul di PDF -> lokasi ziarah. Slug-nya sengaja disamakan dengan yang dipakai
# tools/build_denah.py supaya profil dan denah menempel ke lokasi yang sama.
# Satu lokasi boleh punya lebih dari satu tokoh (Bp. Sumadji & Bp. Salamun).
PETA_JUDUL = {
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


def parse(pdf_path):
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
            info = PETA_JUDUL.get(kunci)
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


def main():
    pdf = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_PDF
    sesi = sys.argv[2] if len(sys.argv) > 2 else 'sesi1'

    data = {}
    if os.path.exists(DATA_JS):
        isi = open(DATA_JS, encoding='utf-8').read()
        if 'window.PROFIL = ' in isi:
            data = json.loads(isi.split('window.PROFIL = ', 1)[1].rsplit(';', 1)[0])
    for s in ('sesi1', 'sesi2', 'sesi3'):
        data.setdefault(s, [])

    # Kelompokkan per lokasi, urut sesuai kemunculan di dokumen.
    per_lokasi, urutan = {}, []
    for t in parse(pdf):
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

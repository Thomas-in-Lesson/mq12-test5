#!/usr/bin/env python3
"""Bangun data rundown dari PDF roundown resmi panitia.

Jalankan: python3 tools/build_rundown.py [file.pdf]
Default: ~/Documents/#Experiment/FINALL FIX ROUNDOWN. 13 agustus.pdf

PDF-nya berupa tabel. Teks diambil beserta koordinatnya lalu dikelompokkan
menjadi baris (berdasarkan y) dan kolom (berdasarkan x), karena extract_text()
biasa mencampur AGENDA/DAERAH dan KEGIATAN/SERAGAM jadi satu paragraf.
"""

import json
import os
import re
import sys

import pypdf

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HALAMAN = os.path.join(REPO, 'rundown_kegiatan_safari_hwmi_mq_12', 'code.html')
DEFAULT_PDF = os.path.expanduser('~/Documents/#Experiment/FINALL FIX ROUNDOWN. 13 agustus.pdf')

JAM = re.compile(r'(\d{1,2}[.:]\d{2})\s*[–-]\s*(\d{1,2}[.:]\d{2})')
SESI = re.compile(r'^SESI\s*([123])\b(.*)$', re.I)
HARI = re.compile(r'^HARI\s*KE\s*(\d+)\b(.*)$', re.I)
ARMADA = re.compile(r'Armada\s*:\s*(.+?)\s*$', re.I)


def kata_berposisi(page):
    """[(y, x, teks)] untuk tiap potongan teks di halaman."""
    hasil = []

    def visitor(text, cm, tm, font_dict, font_size):
        if text and text.strip():
            hasil.append((round(tm[5], 1), round(tm[4], 1), text.strip()))

    page.extract_text(visitor_text=visitor)
    return hasil


def baris_halaman(page, toleransi=4.0):
    """Kelompokkan potongan teks menjadi baris visual, urut atas ke bawah."""
    kata = kata_berposisi(page)
    kata.sort(key=lambda k: (-k[0], k[1]))

    baris, sekarang, y_ref = [], [], None
    for y, x, t in kata:
        if y_ref is None or abs(y - y_ref) <= toleransi:
            sekarang.append((x, t))
            y_ref = y if y_ref is None else y_ref
        else:
            baris.append(sorted(sekarang))
            sekarang, y_ref = [(x, t)], y
    if sekarang:
        baris.append(sorted(sekarang))
    return baris


def gabung(potongan):
    return re.sub(r'\s+', ' ', ' '.join(t for _, t in potongan)).strip()


def parse(pdf_path):
    reader = pypdf.PdfReader(pdf_path)
    sesi = {}
    kunci, hari = None, None

    for page in reader.pages:
        for potongan in baris_halaman(page):
            teks = gabung(potongan)
            if not teks:
                continue

            m = SESI.match(teks)
            if m:
                kunci = 'sesi' + m.group(1)
                sisa = m.group(2).strip()
                armada = ARMADA.search(sisa)
                sesi[kunci] = {
                    'armada': armada.group(1).strip() if armada else '',
                    'tanggal': ARMADA.sub('', sisa).strip(' ,'),
                    'hari': [],
                }
                hari = None
                continue

            if kunci is None:
                continue

            m = HARI.match(teks)
            if m:
                hari = {'label': f'Hari Ke-{m.group(1)}', 'tanggal': m.group(2).strip(' ,'), 'agenda': []}
                sesi[kunci]['hari'].append(hari)
                continue

            m = JAM.search(teks)
            if not m:
                continue

            # Sesi yang cuma satu hari tidak punya baris "HARI KE".
            if hari is None:
                hari = {'label': '', 'tanggal': sesi[kunci]['tanggal'], 'agenda': []}
                sesi[kunci]['hari'].append(hari)

            sebelum = teks[:m.start()].strip()
            sesudah = teks[m.end():].strip()

            # Buang nomor urut di depan agenda.
            agenda = re.sub(r'^\d+\.?\s*', '', sebelum).strip()
            # Durasi selalu di awal kolom setelah jam.
            durasi = ''
            d = re.match(r'^(\d+\s*Jam(?:\s*\d+\s*(?:Menit|menit))?|\d+\s*(?:Menit|menit))', sesudah)
            if d:
                durasi = re.sub(r'\s+', ' ', d.group(1)).strip()
                sesudah = sesudah[d.end():].strip()

            hari['agenda'].append({
                'jam': f'{m.group(1).replace(":", ".")} – {m.group(2).replace(":", ".")}',
                'agenda': agenda,
                'durasi': durasi,
                'ket': re.sub(r'\s+', ' ', sesudah).strip(),
            })

    return sesi


def main():
    pdf = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_PDF
    data = parse(pdf)

    for k, s in data.items():
        total = sum(len(h['agenda']) for h in s['hari'])
        print(f"{k}: {len(s['hari'])} hari, {total} agenda"
              f"{' , armada ' + s['armada'] if s['armada'] else ''}")

    blok = json.dumps(data, ensure_ascii=False, indent=2)
    blok = '\n'.join(('  ' + b) if i else b for i, b in enumerate(blok.split('\n')))

    html = open(HALAMAN, encoding='utf-8').read()
    i = html.index('const rundownData')
    mulai = html.index('{', i)
    depth = 0
    for k in range(mulai, len(html)):
        if html[k] == '{':
            depth += 1
        elif html[k] == '}':
            depth -= 1
            if depth == 0:
                break
    open(HALAMAN, 'w', encoding='utf-8').write(html[:mulai] + blok + html[k + 1:])
    print(f'-> {os.path.relpath(HALAMAN, REPO)}')


if __name__ == '__main__':
    main()

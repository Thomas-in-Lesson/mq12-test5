#!/usr/bin/env python3
"""Bangun ulang blok sesi3 di halaman Rundown dari CSV rundown Sesi 3 panitia.

Jalankan: python3 tools/build_rundown_sesi3.py ["Rundown Sesi 3.csv"] [--tulis]
Default sumber: ~/Downloads/Rundown Sesi 3.csv

CSV ini sudah lengkap (jam, durasi, catatan, seragam) sehingga blok sesi3
ditulis ulang seluruhnya. Sesi 1 dan Sesi 2 tidak disentuh — sumbernya lain.
Tanpa --tulis skrip hanya melaporkan.

Skrip ini juga mencetak kejanggalan yang ditemukan di CSV (jam mundur, nomor
agenda kembar, kolom kosong) supaya bisa dikonfirmasi ke panitia.
"""

import json
import os
import re
import sys

from build_rundown_kostum import KOREKSI_DAERAH, ambil_data, rapi_kostum

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HALAMAN = os.path.join(REPO, 'rundown_kegiatan_safari_hwmi_mq_12', 'code.html')
DEFAULT_CSV = os.path.expanduser('~/Downloads/Rundown Sesi 3.csv')

HARI = re.compile(r'^HARI\s*KE\s*-?\s*(\d+)', re.I)
JAM = re.compile(r'^(\d{1,2})\s*[.:]\s*(\d{2})$')


# Catatan CSV yang dikonfirmasi panitia untuk diabaikan (nama hotelnya keliru:
# baris penginapannya sendiri menyebut Hotel Swiss Belresidences).
ABAIKAN_CATATAN = {'grand sahid jakarta'}


def rapi_jam(teks):
    """"13.00 -  13.30 " -> "13.00 – 13.30"; "07. 40" -> "07.40"."""
    t = re.sub(r'\s+', ' ', (teks or '')).strip()
    t = re.sub(r'(\d{1,2})\s*[.:]\s*(\d{2})', lambda m: f'{m.group(1)}.{m.group(2)}', t)
    return re.sub(r'\s*[–-]\s*', ' – ', t).strip(' –')


def menit(jam):
    """"09.30" -> 570; None kalau bukan jam."""
    m = JAM.match((jam or '').strip())
    return int(m.group(1)) * 60 + int(m.group(2)) if m else None


def baca_csv(path):
    """[{'label':.., 'tanggal':.., 'agenda':[...]}] untuk Sesi 3."""
    hari, aneh = [], []
    seragam_terakhir = ''
    for baris in open(path, encoding='utf-8-sig'):
        kol = [c.strip() for c in baris.rstrip('\n').split(';')]
        kol += [''] * (8 - len(kol))
        judul = HARI.match(kol[0])
        if judul:
            hari.append({'label': f'Hari Ke-{judul.group(1)}', 'tanggal': kol[2], 'agenda': []})
            seragam_terakhir = ''
            continue
        if not hari or not kol[1] or kol[1].upper() == 'AGENDA':
            continue

        # Sub-agenda mini ceremony menaruh nomornya di dalam teks agenda.
        agenda = re.sub(r'^\d+\.\s*', '', kol[1]).strip()
        seragam = rapi_kostum(kol[6])
        if not seragam:
            seragam = seragam_terakhir  # baris tanpa seragam mengikuti baris sebelumnya
        else:
            seragam_terakhir = seragam
        daerah = kol[2].strip()
        hari[-1]['agenda'].append({
            # _sub: sub-acara mini ceremony (nomornya kosong di CSV). Jamnya
            # berada di dalam rentang acara induk, jadi tidak ikut diperiksa urut.
            '_sub': not kol[0].strip(),
            'jam': rapi_jam(kol[3]),
            'agenda': agenda,
            'daerah': KOREKSI_DAERAH.get(daerah, daerah),
            'durasi': re.sub(r'\s+', ' ', kol[4]).strip(),
            'kegiatan': '' if kol[5].strip().lower() in ABAIKAN_CATATAN else re.sub(r'\s+', ' ', kol[5]).strip(),
            'seragam': seragam,
            'catatan': re.sub(r'\s+', ' ', kol[7]).strip(),
        })

    # --- kejanggalan yang perlu mata manusia
    for h in hari:
        akhir_sebelumnya = None
        for a in h['agenda']:
            if a['_sub']:
                continue
            batas = a['jam'].split(' – ')
            mulai = menit(batas[0])
            selesai = menit(batas[1]) if len(batas) > 1 else None
            # Jam mundur. Pengecualian: agenda sebelumnya memang berakhir lewat
            # tengah malam (mis. "20.05 – 04.00"), jadi jamnya wajar lebih kecil.
            lewat_tengah_malam = akhir_sebelumnya is not None and akhir_sebelumnya < 5 * 60
            if mulai is not None and akhir_sebelumnya is not None and mulai < akhir_sebelumnya \
                    and not (lewat_tengah_malam and mulai > 5 * 60):
                aneh.append(f"{h['label']} \"{a['agenda'][:38]}\" mulai {batas[0]}, padahal agenda sebelumnya "
                            f"baru selesai {akhir_sebelumnya // 60:02d}.{akhir_sebelumnya % 60:02d}")
            if selesai is not None:
                akhir_sebelumnya = selesai
            if not a['jam']:
                aneh.append(f"{h['label']} \"{a['agenda'][:38]}\" tidak ada jamnya")
            if not a['seragam']:
                aneh.append(f"{h['label']} \"{a['agenda'][:38]}\" belum ada seragamnya")
    for h in hari:
        for a in h['agenda']:
            del a['_sub']
    return hari, aneh


def main():
    arg = [a for a in sys.argv[1:] if not a.startswith('--')]
    tulis = '--tulis' in sys.argv
    hari, aneh = baca_csv(arg[0] if arg else DEFAULT_CSV)

    html = open(HALAMAN, encoding='utf-8').read()
    data, awal, akhir = ambil_data(html)
    lama = data['sesi3']['hari']

    for i, h in enumerate(hari):
        dulu = len(lama[i]['agenda']) if i < len(lama) else 0
        print(f"{h['label']:12s} {len(h['agenda']):3d} agenda (sebelumnya {dulu})  {h['tanggal']}")
    data['sesi3']['hari'] = hari  # armada & tanggal sesi tetap seperti di halaman

    if aneh:
        print(f'\n{len(aneh)} hal yang perlu dicek di CSV:')
        for x in aneh:
            print(f'   {x}')

    if not tulis:
        print('\n(uji coba — jalankan lagi dengan --tulis untuk menyimpan)')
        return
    blok = json.dumps(data, ensure_ascii=False, indent=2)
    blok = '\n'.join(('  ' + b) if i else b for i, b in enumerate(blok.split('\n')))
    open(HALAMAN, 'w', encoding='utf-8').write(html[:awal] + blok + html[akhir:])
    print(f'-> {os.path.relpath(HALAMAN, REPO)}')


if __name__ == '__main__':
    main()

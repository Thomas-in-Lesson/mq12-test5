#!/usr/bin/env python3
"""Isi kolom seragam (kostum) di halaman Rundown dari CSV kostum panitia.

Jalankan: python3 tools/build_rundown_kostum.py [Rundown.csv] [--tulis] [--paksa]
Default sumber: ~/Downloads/Rundown.csv

--paksa: CSV menang atas kostum yang sudah ada di halaman (dipakai sejak
panitia menyatakan CSV ini yang terbaru). Tanpa --paksa hanya kolom kosong
yang diisi.

CSV-nya berisi satu baris per agenda utama (bukan tiap langkah), formatnya
"no;agenda;kostum;lokasi". Jadi kostum satu baris dipakai untuk semua langkah
di halaman mulai dari agenda itu sampai sebelum agenda utama berikutnya.

Tanpa --tulis skrip hanya melaporkan rencana perubahan. build_rundown.py
JANGAN dijalankan lagi: hasil parse PDF-nya lebih rusak daripada data di
halaman yang sudah dirapikan tangan, dan akan menimpa hasil skrip ini.
"""

import json
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HALAMAN = os.path.join(REPO, 'rundown_kegiatan_safari_hwmi_mq_12', 'code.html')
DEFAULT_CSV = os.path.expanduser('~/Downloads/Rundown.csv')

JUDUL = re.compile(r'^SESI\s*([123])\s*HARI\s*KE-?\s*(\d+)', re.I)

# Kata yang muncul di hampir semua agenda, jadi tidak berguna untuk mencocokkan.
UMUM = {
    'makam', 'maqom', 'ziarah', 'ziaroh', 'menuju', 'perjalanan', 'persiapan',
    'di', 'dan', 'ke', 'jalan', 'kaki', 'bus', 'bis', 'sholat', 'berjamaah',
    'berjama', 'ah', 'h', 'm',
}


# Agenda yang di CSV dan di halaman ditulis dengan kata yang sama sekali beda.
# Kunci = teks CSV, nilai = kata yang dipakai di halaman.
PADANAN = {
    'Kegiatan di HSHF': 'Mini Ceremony',   # sesi 3 hari 6: rangkaian acara di HSHF
    'Acara di Ndalem': 'Penyambutan',      # sesi 3 hari 8
}


def token(teks):
    kata = re.findall(r"[a-z0-9']+", (teks or '').lower())
    return {k.strip("'") for k in kata if k.strip("'") and k.strip("'") not in UMUM}


def rapi_kostum(teks):
    """"Almamater, kemeja putih " -> "Almamater MQ, Kemeja Putih"."""
    t = re.sub(r'\s+', ' ', (teks or '')).strip().rstrip(',')
    t = ', '.join(b.strip().title() for b in t.split(',') if b.strip())
    # Halaman menyebutnya "Almamater MQ"; CSV kadang cuma "Almamater".
    return re.sub(r'\bAlmamater\b(?!\s+Mq)', 'Almamater MQ', t).replace('Almamater Mq', 'Almamater MQ')


def baca_csv(path):
    """{('sesi2', 1): [{'agenda':.., 'kostum':.., 'lokasi':..}, ...]}"""
    hasil, kunci = {}, None
    for baris in open(path, encoding='utf-8-sig'):
        kol = [c.strip() for c in baris.rstrip('\n').split(';')]
        judul = JUDUL.match(kol[0]) if kol and kol[0] else None
        if judul:
            kunci = (f'sesi{judul.group(1)}', int(judul.group(2)))
            hasil[kunci] = []
            continue
        if kunci and len(kol) >= 3 and kol[1]:
            hasil[kunci].append({'agenda': kol[1], 'kostum': kol[2], 'lokasi': kol[3] if len(kol) > 3 else ''})
    return hasil


def ambil_data(html):
    i = html.index('const rundownData')
    mulai = html.index('{', i)
    depth = 0
    for k in range(mulai, len(html)):
        if html[k] == '{':
            depth += 1
        elif html[k] == '}':
            depth -= 1
            if depth == 0:
                return json.loads(html[mulai:k + 1]), mulai, k + 1
    raise ValueError('blok rundownData tidak tertutup')


def cocokkan(milestone, agenda_list, mulai_dari):
    """Indeks item halaman yang paling mirip, dicari maju dari mulai_dari."""
    target = token(milestone)
    terbaik, skor_terbaik = None, 0
    for i in range(mulai_dari, len(agenda_list)):
        skor = len(target & token(agenda_list[i]['agenda']))
        if skor > skor_terbaik:
            terbaik, skor_terbaik = i, skor
    return terbaik if skor_terbaik else None


def main():
    arg = [a for a in sys.argv[1:] if not a.startswith('--')]
    tulis = '--tulis' in sys.argv
    paksa = '--paksa' in sys.argv
    csv = baca_csv(arg[0] if arg else DEFAULT_CSV)

    html = open(HALAMAN, encoding='utf-8').read()
    data, awal, akhir = ambil_data(html)

    ubah, lokasi_beda, tak_cocok, beda_kostum = 0, [], [], []
    for (sesi, hari_ke), milestones in sorted(csv.items()):
        hari = data[sesi]['hari'][hari_ke - 1]
        agenda = hari['agenda']

        # milestone -> indeks item halaman; kostum berlaku sampai milestone berikutnya
        titik, cursor = [], 0
        for ms in milestones:
            idx = cocokkan(PADANAN.get(ms['agenda'], ms['agenda']), agenda, cursor)
            if idx is None:
                tak_cocok.append(f'{sesi} hari {hari_ke}: "{ms["agenda"]}"')
                continue
            titik.append((idx, ms))
            cursor = idx + 1

        print(f'\n== {sesi} hari ke-{hari_ke} ({len(agenda)} langkah, {len(titik)}/{len(milestones)} agenda CSV kena)')
        for n, (idx, ms) in enumerate(titik):
            batas = titik[n + 1][0] if n + 1 < len(titik) else len(agenda)
            awal_blok = 0 if n == 0 else idx  # langkah sebelum agenda pertama ikut kostum pertama
            kostum = rapi_kostum(ms['kostum'])
            print(f'   {ms["agenda"][:40]:40s} -> langkah {awal_blok + 1}-{batas}: {kostum}')
            for item in agenda[awal_blok:batas]:
                lama = item['seragam'].strip()
                if not lama:
                    ubah += 1
                    item['seragam'] = kostum
                elif lama != kostum and paksa:
                    if token(lama).isdisjoint(token(kostum)):
                        beda_kostum.append(f'{sesi} h{hari_ke} "{item["agenda"][:34]}": "{lama}" -> "{kostum}"')
                    ubah += 1
                    item['seragam'] = kostum
                elif token(lama).isdisjoint(token(kostum)):
                    beda_kostum.append(f'{sesi} h{hari_ke} "{item["agenda"][:34]}": halaman="{lama}" vs CSV="{kostum}"')
                if ms['lokasi'] and item['daerah'] and token(ms['lokasi']).isdisjoint(token(item['daerah'])):
                    lokasi_beda.append(f'{sesi} h{hari_ke} "{item["agenda"][:34]}": halaman="{item["daerah"]}" vs CSV="{ms["lokasi"]}"')

    print(f'\n{ubah} kolom seragam diisi{" (CSV menang, --paksa)" if paksa else " dari yang kosong"}')
    if beda_kostum:
        print(f'{len(beda_kostum)} kostum yang beda jenis dengan isi halaman '
              f'({"ditimpa CSV" if paksa else "TIDAK diubah, cek panitia"}):')
        for b in beda_kostum:
            print(f'   {b}')
    if tak_cocok:
        print(f'{len(tak_cocok)} agenda CSV tidak ketemu padanannya di halaman:')
        for t in tak_cocok:
            print(f'   {t}')
    if lokasi_beda:
        print(f'\n{len(lokasi_beda)} lokasi berbeda antara halaman dan CSV (TIDAK diubah, cek panitia):')
        for l in lokasi_beda[:25]:
            print(f'   {l}')

    if not tulis:
        print('\n(uji coba — jalankan lagi dengan --tulis untuk menyimpan)')
        return
    blok = json.dumps(data, ensure_ascii=False, indent=2)
    blok = '\n'.join(('  ' + b) if i else b for i, b in enumerate(blok.split('\n')))
    open(HALAMAN, 'w', encoding='utf-8').write(html[:awal] + blok + html[akhir:])
    print(f'-> {os.path.relpath(HALAMAN, REPO)}')


if __name__ == '__main__':
    main()

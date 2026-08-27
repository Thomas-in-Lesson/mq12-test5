#!/usr/bin/env python3
"""Bangun ulang blok satu sesi di halaman Rundown dari CSV rundown panitia.

Jalankan: python3 tools/build_rundown_csv.py ["Rundown Sesi N.csv"] [--tulis]
Default sumber: berkas CSV di ~/Documents/#Experiment/Rundown_baru/

Sesi diambil dari baris "SESI n" di puncak CSV, jadi satu skrip melayani
Sesi 2 dan Sesi 3; sesi lain di halaman tidak disentuh. Tanpa --tulis skrip
hanya melaporkan.

Kolom dipetakan lewat baris header, bukan nomor kolom: tiap kiriman panitia
menambah atau membuang kolom (SERAGAM PENDAMPING hanya ada di Sesi 3, JADWAL
IMAM baru muncul 27 Agustus 2026), dan nomor kolom yang dipatok mati membuat
seluruh isi bergeser diam-diam.

Skrip ini juga mencetak kejanggalan yang ditemukan di CSV (jam mundur, kolom
kosong) supaya bisa dikonfirmasi ke panitia.
"""

import json
import os
import re
import sys

from build_rundown_kostum import KOREKSI_DAERAH, ambil_data, rapi_kostum

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HALAMAN = os.path.join(REPO, 'rundown_kegiatan_safari_hwmi_mq_12', 'code.html')
SUMBER_DIR = os.path.expanduser('~/Documents/#Experiment/Rundown_baru')

HARI = re.compile(r'^HARI\s*KE\s*-?\s*(\d+)', re.I)
JAM = re.compile(r'^(\d{1,2})\s*[.:]\s*(\d{2})$')
SESI = re.compile(r'^SESI\s*([123])\b', re.I)

# Label header -> nama kolom di data halaman. "KEGIATAN" dan "CATATAN" dipakai
# panitia bergantian untuk kolom yang sama isinya: rincian kegiatan.
KOLOM = {
    'NO': 'no', 'AGENDA': 'agenda', 'DAERAH': 'daerah', 'WAKTU': 'jam',
    'DURASI': 'durasi', 'KEGIATAN': 'kegiatan', 'CATATAN': 'kegiatan',
    'SERAGAM PESERTA': 'seragam', 'SERAGAM PENDAMPING': 'pendamping',
    'JADWAL IMAM': 'imam',
}

# Peran mini ceremony ("Dirigen : ...") ditaruh panitia di kolom tanpa judul di
# ujung baris; kolom tak berjudul apa pun diperlakukan sebagai catatan. Kalau
# nanti peran itu pindah ke kolom JADWAL IMAM, yang bukan nama orang pun ikut
# jatuh ke catatan, bukan dilabeli "Imam".
NAMA_IMAM = re.compile(r'^(bapak|bpk|ibu)\b', re.I)


# Catatan CSV yang dikonfirmasi panitia untuk diabaikan (nama hotelnya keliru:
# baris penginapannya sendiri menyebut Hotel Swiss Belresidences).
ABAIKAN_CATATAN = {'grand sahid jakarta'}


def rapi_jam(teks):
    """"13.00 -  13.30 " -> "13.00 – 13.30"; "07. 40" -> "07.40"."""
    t = re.sub(r'\s+', ' ', (teks or '')).strip()
    t = re.sub(r'(\d{1,2})\s*[.:]\s*(\d{2})', lambda m: f'{m.group(1)}.{m.group(2)}', t)
    return re.sub(r'\s*[–-]\s*', ' – ', t).strip(' –')


def rapi_durasi(teks):
    """"3 Jam 45 menit" -> "3 Jam 45 Menit"; hanya huruf besarnya yang dirapikan."""
    t = re.sub(r'(?i)\b(jam|menit)\b', lambda m: m.group(1).title(), (teks or '').strip())
    return re.sub(r'\s+', ' ', t)


def menit(jam):
    """"09.30" -> 570; None kalau bukan jam."""
    m = JAM.match((jam or '').strip())
    return int(m.group(1)) * 60 + int(m.group(2)) if m else None


def baca_teks(path):
    """Panitia kadang menyimpan CSV-nya ber-encoding Windows, kadang UTF-8."""
    mentah = open(path, 'rb').read()
    try:
        return mentah.decode('utf-8-sig')
    except UnicodeDecodeError:
        return mentah.decode('cp1252')


def baca_csv(path):
    """([{'label':.., 'tanggal':.., 'agenda':[...]}], kejanggalan, 'sesiN')."""
    hari, aneh, sesi, idx = [], [], '', {}
    seragam_terakhir = pendamping_terakhir = ''

    for baris in baca_teks(path).splitlines():
        kol = [c.strip() for c in baris.split(';')]

        if not sesi and SESI.match(kol[0]):
            sesi = 'sesi' + SESI.match(kol[0]).group(1)
            continue
        if not idx:
            # Baris header: petakan label -> posisi kolom, sekali saja.
            if kol[0].upper() == 'NO':
                idx = {KOLOM[c.upper()]: i for i, c in enumerate(kol) if c.upper() in KOLOM}
                hilang = {'agenda', 'jam'} - set(idx)
                if hilang:
                    raise SystemExit(f'header CSV tanpa kolom {sorted(hilang)}: {kol}')
            continue

        sel = lambda nama: re.sub(r'\s+', ' ', kol[idx[nama]]).strip() if idx.get(nama) is not None \
            and idx[nama] < len(kol) else ''

        judul = HARI.match(kol[0])
        if judul:
            hari.append({'label': f'Hari Ke-{judul.group(1)}', 'tanggal': sel('daerah'), 'agenda': []})
            seragam_terakhir = pendamping_terakhir = ''
            continue
        if not hari or not sel('agenda'):
            continue

        # Sub-agenda mini ceremony menaruh nomornya di dalam teks agenda.
        agenda = re.sub(r'^\d+\.\s*', '', sel('agenda')).strip()
        seragam = rapi_kostum(sel('seragam'))
        if not seragam:
            seragam = seragam_terakhir  # baris tanpa seragam mengikuti baris sebelumnya
        else:
            seragam_terakhir = seragam
        # "Jasket Merah" dan kawan-kawan tidak ikut aturan kemeja putih, cuma dirapikan.
        pendamping = sel('pendamping').title().replace('Mq', 'MQ')
        if not pendamping:
            pendamping = pendamping_terakhir
        else:
            pendamping_terakhir = pendamping
        daerah = re.sub(r',(?=\S)', ', ', sel('daerah'))  # "Pesantren,Losplos" -> "Pesantren, Losplos"
        catatan_imam = sel('imam')
        kegiatan = sel('kegiatan')
        # Kolom tanpa judul di ujung baris: dipakai panitia untuk peran mini ceremony.
        ekstra = [re.sub(r'\s+', ' ', c).strip() for i, c in enumerate(kol)
                  if i not in idx.values() and c.strip()]
        if not NAMA_IMAM.match(catatan_imam):
            ekstra.insert(0, catatan_imam)
        hari[-1]['agenda'].append({
            # _sub: sub-acara mini ceremony (nomornya kosong di CSV). Jamnya
            # berada di dalam rentang acara induk, jadi tidak ikut diperiksa urut.
            '_sub': not kol[idx['no']].strip() if idx.get('no') is not None else False,
            'jam': rapi_jam(sel('jam')),
            'agenda': agenda,
            'daerah': KOREKSI_DAERAH.get(daerah, daerah),
            'durasi': rapi_durasi(sel('durasi')),
            'kegiatan': '' if kegiatan.lower() in ABAIKAN_CATATAN else kegiatan,
            'seragam': seragam,
            'pendamping': pendamping,
            'imam': catatan_imam if NAMA_IMAM.match(catatan_imam) else '',
            'catatan': ' · '.join(x for x in ekstra if x),
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
            # "1 Jam Menit": angka menitnya hilang waktu diketik. Sengaja tidak
            # ditebak dari rentang jamnya — biar panitia yang membetulkan.
            if re.search(r'(?i)\bjam\s+menit\b|^\s*menit\b', a['durasi']):
                aneh.append(f"{h['label']} \"{a['agenda'][:38]}\" durasinya ganjil: {a['durasi']!r}")
    for h in hari:
        for a in h['agenda']:
            del a['_sub']
    return hari, aneh, sesi


def main():
    arg = [a for a in sys.argv[1:] if not a.startswith('--')]
    tulis = '--tulis' in sys.argv
    if arg:
        sumber = [arg[0]]
    else:
        sumber = sorted(os.path.join(SUMBER_DIR, f) for f in os.listdir(SUMBER_DIR)
                        if f.lower().endswith('.csv')) if os.path.isdir(SUMBER_DIR) else []
    if not sumber:
        raise SystemExit(f'CSV rundown tidak ditemukan di {SUMBER_DIR}')

    html = open(HALAMAN, encoding='utf-8').read()
    data, awal, akhir = ambil_data(html)
    aneh = []

    for berkas in sumber:
        hari, kejanggalan, sesi = baca_csv(berkas)
        if not sesi:
            raise SystemExit(f'{os.path.basename(berkas)}: baris "SESI n" tidak ada, sesi tidak bisa dipastikan')
        print(f'sumber: {os.path.basename(berkas)} -> {sesi}')
        lama = data[sesi]['hari']
        for i, h in enumerate(hari):
            dulu = len(lama[i]['agenda']) if i < len(lama) else 0
            print(f"   {h['label']:12s} {len(h['agenda']):3d} agenda (sebelumnya {dulu})  {h['tanggal']}")
        data[sesi]['hari'] = hari  # armada & tanggal sesi tetap seperti di halaman
        aneh += [f'{sesi} {x}' for x in kejanggalan]

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

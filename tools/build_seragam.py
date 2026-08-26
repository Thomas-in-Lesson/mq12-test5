#!/usr/bin/env python3
"""Tulis ulang tabel Jadwal Seragam (Sesi 2 & 3) dari CSV jadwal seragam panitia.

Jalankan: python3 tools/build_seragam.py ["Jadwal Seragam.csv"] [--tulis]
Default sumber: ~/Downloads/Jadwal Seragam.csv

CSV-nya berkolom "NO.;Kegiatan;Peserta;Pendamping;Lokasi" dan dikelompokkan per
"SESI n HARI KE-m". Sesi 1 tidak ada di CSV, jadi tabelnya tidak disentuh.

Kolom Wilayah tetap memakai isi halaman kalau agendanya ketemu: kolom Lokasi di
CSV beberapa keliru (Prambanan tertulis Kudus, Jendral Sudirman tertulis Demak)
dan sebagian kosong. Semua selisihnya dicetak untuk dikonfirmasi ke panitia.
Tanpa --tulis skrip hanya melaporkan.

build_jadwal_seragam.py (pembuat halaman versi pertama) jangan dijalankan lagi:
isinya HTML mati yang akan menimpa hasil skrip ini.
"""

import html as html_mod
import os
import re
import sys

from build_rundown_kostum import KOREKSI_DAERAH, rapi_kostum, token

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HALAMAN = os.path.join(REPO, 'jadwal_seragam_safari_hwmi_mq_12', 'code.html')
DEFAULT_CSV = os.path.expanduser('~/Downloads/Jadwal Seragam.csv')

JUDUL_CSV = re.compile(r'^SESI\s*(\d)\s*HARI\s*KE-?\s*(\d+)', re.I)
JUDUL_HAL = re.compile(r'SESI (\d) — HARI KE-(\d+)')

BARIS = ('<tr class="hover:bg-surface-container/50">'
         '<td class="p-3 text-center font-bold">{no}</td>'
         '<td class="p-3">{agenda}</td>'
         '<td class="p-3 font-semibold text-secondary">{peserta}</td>'
         '<td class="p-3 text-primary">{pendamping}</td>'
         '<td class="p-3">{wilayah}</td></tr>')


def rapi(teks):
    t = re.sub(r'\s+', ' ', (teks or '')).strip()
    return re.sub(r'\(\s+', '(', re.sub(r'\s+\)', ')', t))  # "( Dhuhur & Ashar )" -> "(Dhuhur & Ashar)"


def rapi_pendamping(teks):
    """Jasket pendamping dibiarkan apa adanya, hanya dirapikan kapitalnya."""
    t = rapi(teks).rstrip(',')
    return ', '.join(b.strip().title() for b in t.split(',') if b.strip())


def baca_csv(path):
    """{(sesi, hari): [{'agenda':.., 'peserta':.., 'pendamping':.., 'wilayah':..}]}"""
    # Berkas kiriman panitia ber-encoding Windows (apostrof melengkung 0x92).
    isi = open(path, encoding='cp1252').read()
    hasil, kunci = {}, None
    for baris in isi.splitlines():
        kol = [c.strip() for c in baris.split(';')]
        kol += [''] * (5 - len(kol))
        judul = JUDUL_CSV.match(kol[0])
        if judul:
            kunci = (int(judul.group(1)), int(judul.group(2)))
            hasil[kunci] = []
            continue
        if not kunci or not kol[1] or kol[1].lower() == 'kegiatan':
            continue
        wilayah = rapi(kol[4])
        hasil[kunci].append({
            'agenda': rapi(kol[1]),
            'peserta': rapi_kostum(kol[2]),
            'pendamping': rapi_pendamping(kol[3]),
            'wilayah': KOREKSI_DAERAH.get(wilayah, wilayah),
        })
    return hasil


def baca_halaman(html):
    """{(sesi, hari): (awal_tbody, akhir_tbody, [baris lama])}"""
    hasil = {}
    for m in JUDUL_HAL.finditer(html):
        kunci = (int(m.group(1)), int(m.group(2)))
        tb = re.compile(r'<tbody[^>]*>(.*?)</tbody>', re.S).search(html, m.end())
        baris = []
        for tr in re.findall(r'<tr[^>]*>(.*?)</tr>', tb.group(1), re.S):
            sel = [re.sub(r'<[^>]+>', '', c).strip() for c in re.findall(r'<td[^>]*>(.*?)</td>', tr, re.S)]
            if len(sel) >= 5:
                baris.append({'agenda': sel[1], 'peserta': sel[2], 'pendamping': sel[3], 'wilayah': sel[4]})
        hasil[kunci] = (tb.start(1), tb.end(1), baris)
    return hasil


def cocok(agenda, baris_lama):
    """Baris halaman dengan agenda paling mirip, atau None."""
    target = token(agenda)
    terbaik, skor = None, 0
    for b in baris_lama:
        n = len(target & token(b['agenda']))
        if n > skor:
            terbaik, skor = b, n
    return terbaik


def gabung_baris(baris_csv, baris_lama, kunci, dipulihkan):
    """Baris CSV + baris halaman yang tidak ada di CSV (agenda betulan, jangan hilang).

    Seragamnya mengikuti baris sebelumnya (kalau tidak ada, baris sesudahnya),
    sama seperti cara rundown memperlakukan langkah tanpa keterangan seragam.
    """
    padanan_lama = [cocok(b['agenda'], baris_csv) for b in baris_lama]
    hasil = list(baris_csv)
    for i, b in enumerate(baris_lama):
        if padanan_lama[i] is not None:
            continue
        pos = 0
        for j in range(i - 1, -1, -1):
            if padanan_lama[j] is not None:
                pos = hasil.index(padanan_lama[j]) + 1
                break
        acuan = hasil[pos - 1] if pos else (hasil[0] if hasil else b)
        hasil.insert(pos, {
            'agenda': b['agenda'],
            'peserta': acuan['peserta'],
            'pendamping': acuan['pendamping'],
            'wilayah': b['wilayah'],
        })
        dipulihkan.append(f'S{kunci[0]}h{kunci[1]} "{b["agenda"][:40]}" tidak ada di CSV — dikembalikan, '
                          f'seragam ikut baris tetangga ({acuan["peserta"]} / {acuan["pendamping"]})')
    return hasil


def main():
    arg = [a for a in sys.argv[1:] if not a.startswith('--')]
    tulis = '--tulis' in sys.argv
    csv = baca_csv(arg[0] if arg else DEFAULT_CSV)

    html = open(HALAMAN, encoding='utf-8').read()
    halaman = baca_halaman(html)

    beda_seragam, beda_wilayah, tak_ada, dipulihkan = [], [], [], []
    tambalan = []  # (awal, akhir, isi_baru)

    for kunci in sorted(csv):
        if kunci not in halaman:
            tak_ada.append(f'SESI {kunci[0]} HARI KE-{kunci[1]} ada di CSV tapi tidak ada tabelnya di halaman')
            continue
        awal, akhir, lama = halaman[kunci]
        baris = gabung_baris(csv[kunci], lama, kunci, dipulihkan)
        baris_html = []
        for i, r in enumerate(baris, 1):
            padanan = cocok(r['agenda'], lama)
            wilayah = r['wilayah']
            if padanan:
                # Kalau isi halaman ternyata cuma potongan dari nilai CSV
                # ("Hotel Swiss" vs "Hotel Swissbell Rasuna Epicentrum"),
                # CSV yang lebih lengkap yang dipakai.
                if padanan['wilayah'] and wilayah.lower().startswith(padanan['wilayah'].lower()):
                    padanan = {**padanan, 'wilayah': wilayah}
                if padanan['wilayah'] and padanan['wilayah'] != wilayah:
                    beda_wilayah.append(f'S{kunci[0]}h{kunci[1]} "{r["agenda"][:34]}": halaman="{padanan["wilayah"]}" vs CSV="{wilayah or "(kosong)"}"')
                    wilayah = padanan['wilayah']  # isi halaman sudah diperiksa, CSV kolom lokasinya lemah
                for kolom in ('peserta', 'pendamping'):
                    if padanan[kolom] != r[kolom]:
                        beda_seragam.append(f'S{kunci[0]}h{kunci[1]} "{r["agenda"][:30]}" {kolom}: "{padanan[kolom]}" -> "{r[kolom]}"')
            baris_html.append(BARIS.format(
                no=i,
                agenda=html_mod.escape(r['agenda']),
                peserta=html_mod.escape(r['peserta']),
                pendamping=html_mod.escape(r['pendamping']),
                wilayah=html_mod.escape(wilayah),
            ))
        print(f'SESI {kunci[0]} hari ke-{kunci[1]}: {len(baris)} baris (CSV {len(csv[kunci])}, sebelumnya {len(lama)})')
        tambalan.append((awal, akhir, '\n        ' + '\n        '.join(baris_html) + '\n      '))

    print(f'\n{len(beda_seragam)} kolom seragam berubah:')
    for x in beda_seragam:
        print(f'   {x}')
    if dipulihkan:
        print(f'\n{len(dipulihkan)} baris halaman yang tidak ada di CSV (dikembalikan):')
        for x in dipulihkan:
            print(f'   {x}')
    if beda_wilayah:
        print(f'\n{len(beda_wilayah)} wilayah beda antara halaman dan CSV (halaman dipertahankan):')
        for x in beda_wilayah:
            print(f'   {x}')
    for x in tak_ada:
        print(f'   {x}')

    if not tulis:
        print('\n(uji coba — jalankan lagi dengan --tulis untuk menyimpan)')
        return
    for awal, akhir, isi in sorted(tambalan, reverse=True):  # dari belakang, biar offset tetap
        html = html[:awal] + isi + html[akhir:]
    open(HALAMAN, 'w', encoding='utf-8').write(html)
    print(f'-> {os.path.relpath(HALAMAN, REPO)}')


if __name__ == '__main__':
    main()

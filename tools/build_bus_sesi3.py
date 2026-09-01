#!/usr/bin/env python3
"""Bangun ulang denah bus Sesi 3 dari berkas kursi kiriman panitia.

Jalankan: python3 tools/build_bus_sesi3.py ["Seat Bus Sesi 3.xlsx"] [--tulis]
Default sumber: ~/Documents/#Experiment/Seat Bus Sesi 3.xlsx
Hasil: literal `const buses` di halaman Denah Bus Sesi 3.

Berkasnya bukan tabel melainkan gambar denah: tiap kursi menempati kolom tetap,
nomornya di satu kolom dan namanya di kolom sebelahnya, sedangkan perannya
ditulis di baris tepat di bawah nama. Baris paling belakang hanya punya kursi
sisi kanan karena sisi kirinya dipakai pintu dan toilet.

Dikerjakan lewat skrip karena isinya 169 nama: sekali salah salin, satu peserta
naik bus yang salah dan tidak ada yang tahu sampai hari H. Nama ditulis apa
adanya — pencocokan ejaan ke profil peserta dikerjakan tools/build-peserta.js.
"""

import json
import os
import re
import sys
import zipfile
import xml.etree.ElementTree as ET

NS = '{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HALAMAN = os.path.join(REPO, 'denah_bus_sesi_3_safari_hwmi_mq_12', 'code.html')
DEFAULT = os.path.expanduser('~/Documents/#Experiment/Seat Bus Sesi 3.xlsx')

# Kolom nomor kursi -> kolom namanya. Dua slot pertama sisi kiri, dua sisanya
# sisi kanan; lorong bus ada di antara kolom 5 dan 8.
SLOT_KIRI = [(1, 2), (4, 5)]
SLOT_KANAN = [(8, 9), (11, 12)]
JUDUL_BUS = re.compile(r'^BUS\s*(\d+)$', re.I)

# Kejanggalan di berkas kursi yang sudah dikonfirmasi panitia 1 September 2026.
# Ditulis di sini, bukan disunting langsung ke halaman, supaya tidak hilang
# begitu generatornya dijalankan lagi atas berkas yang sama.

# Bus 2 menomori dua kursi dengan 27 dan melewati 26. Panitia: yang di baris
# atas seharusnya 26. Dikunci lewat nama, bukan nomor, karena nomornya kembar.
KOREKSI_NOMOR = {(2, 'Ika Nurul Aini'): '26'}

# Bus 3 di berkas berhenti di kursi 26, padahal panitia memastikan keduanya
# masih ikut. Nomor, nama, dan perannya mengikuti denah sebelum kiriman ini.
TAMBAHAN = {3: {'right': [[['27', 'Alifiyana Ahmad F', 'Keamanan'],
                           ['28', 'Bunga Arum Dhani', 'Kebersihan']]]}}

# Kursi yang memang sengaja dibiarkan kosong, jadi tidak perlu dilaporkan lagi.
KOSONG_SENGAJA = {(6, '28')}


def kolom(ref):
    """"AB12" -> 27 (indeks kolom mulai 0)."""
    n = 0
    for ch in ref:
        if not ch.isalpha():
            break
        n = n * 26 + ord(ch.upper()) - 64
    return n - 1


def baris_lembar(path):
    """Tiap baris lembar pertama sebagai list sel, sudah dirapikan spasinya."""
    with zipfile.ZipFile(path) as z:
        bersama = []
        if 'xl/sharedStrings.xml' in z.namelist():
            for si in ET.fromstring(z.read('xl/sharedStrings.xml')).findall(f'{NS}si'):
                bersama.append(''.join(t.text or '' for t in si.iter(f'{NS}t')))

        lembar = ET.fromstring(z.read('xl/worksheets/sheet1.xml'))
        hasil = []
        for row in lembar.iter(f'{NS}row'):
            sel = {}
            for c in row.findall(f'{NS}c'):
                v = c.find(f'{NS}v')
                nilai = v.text if v is not None else ''
                if c.get('t') == 's' and nilai and nilai.isdigit():
                    nilai = bersama[int(nilai)] if int(nilai) < len(bersama) else nilai
                if c.get('t') == 'inlineStr':
                    nilai = ''.join(t.text or '' for t in c.iter(f'{NS}t'))
                nilai = re.sub(r'\s+', ' ', nilai or '').strip()
                if nilai:
                    sel[kolom(c.get('r'))] = nilai
            hasil.append(sel)
    return hasil


def kursi(baris, bawah, slot):
    """[nomor, nama, peran] untuk satu slot, atau None kalau tidak ada nomornya."""
    kol_no, kol_nama = slot
    no = baris.get(kol_no, '')
    if not no.isdigit():
        return None
    return [no, baris.get(kol_nama, ''), bawah.get(kol_nama, '')]


def baca(path):
    baris = baris_lembar(path)
    bus, sekarang = [], None
    for i, b in enumerate(baris):
        judul = next((JUDUL_BUS.match(v) for v in b.values() if JUDUL_BUS.match(v)), None)
        if judul:
            sekarang = {'no': int(judul.group(1)), 'left': [], 'right': []}
            bus.append(sekarang)
            continue
        if sekarang is None:
            continue
        bawah = baris[i + 1] if i + 1 < len(baris) else {}
        for sisi, slot in (('left', SLOT_KIRI), ('right', SLOT_KANAN)):
            pasangan = [kursi(b, bawah, s) for s in slot]
            # Baris belakang cuma punya sisi kanan; sisi yang kosong dilewati
            # supaya tidak jadi baris hampa di halaman.
            if any(pasangan):
                sekarang[sisi].append([k or ['', '', ''] for k in pasangan])

    for b in bus:
        for sisi in ('left', 'right'):
            for kursi_ in [k for p in b[sisi] for k in p]:
                baru = KOREKSI_NOMOR.get((b['no'], kursi_[1]))
                if baru:
                    kursi_[0] = baru
        for sisi, baris_tambahan in TAMBAHAN.get(b['no'], {}).items():
            b[sisi] += [[list(k) for k in p] for p in baris_tambahan]
    return bus


def literal(bus):
    """Ditulis satu pasang kursi per baris supaya perubahan berikutnya terbaca."""
    keluar = []
    for b in bus:
        bagian = []
        for sisi in ('left', 'right'):
            isi = ',\n'.join('        ' + json.dumps(p, ensure_ascii=False) for p in b[sisi])
            bagian.append(f'      "{sisi}": [\n{isi}\n      ]')
        keluar.append('    {\n' + ',\n'.join(bagian) + '\n    }')
    return '[\n' + ',\n'.join(keluar) + '\n    ]'


def periksa(bus):
    """Kejanggalan yang perlu mata manusia, bukan alasan berhenti."""
    aneh = []
    for b in bus:
        nomor = [k[0] for sisi in ('left', 'right') for p in b[sisi] for k in p if k[0]]
        for n in sorted(set(nomor)):
            if nomor.count(n) > 1:
                aneh.append(f"Bus {b['no']}: nomor kursi {n} dipakai {nomor.count(n)} kali")
        angka = sorted(int(n) for n in set(nomor))
        hilang = [n for n in range(1, max(angka) + 1) if n not in angka] if angka else []
        if hilang:
            aneh.append(f"Bus {b['no']}: nomor kursi terlewat {hilang}")
        # Kursi 2 memang kosong di semua bus: itu tempat di sebelah supir.
        kosong = [k[0] for sisi in ('left', 'right') for p in b[sisi] for k in p
                  if k[0] and not k[1] and k[0] != '2' and (b['no'], k[0]) not in KOSONG_SENGAJA]
        if kosong:
            aneh.append(f"Bus {b['no']}: kursi tanpa nama {kosong}")
    return aneh


def main():
    arg = [a for a in sys.argv[1:] if not a.startswith('--')]
    sumber = arg[0] if arg else DEFAULT
    if not os.path.exists(sumber):
        raise SystemExit(f'berkas kursi tidak ada: {sumber}')

    bus = baca(sumber)
    if len(bus) != 6:
        raise SystemExit(f'terbaca {len(bus)} bus, seharusnya 6 — tata letak berkasnya berubah?')

    html = open(HALAMAN, encoding='utf-8').read()
    awal = html.index('const buses =')
    awal = html.index('[', awal)
    dalam = 0
    for k in range(awal, len(html)):
        dalam += (html[k] == '[') - (html[k] == ']')
        if dalam == 0:
            akhir = k + 1
            break

    for b in bus:
        orang = sum(1 for sisi in ('left', 'right') for p in b[sisi] for k in p if k[1])
        print(f"  Bus {b['no']}: {len(b['left'])} baris kiri, {len(b['right'])} kanan, {orang} orang")
    print(f"  total {sum(1 for b in bus for s in ('left', 'right') for p in b[s] for k in p if k[1])} orang")

    for x in periksa(bus):
        print(f'  ! {x}')

    if '--tulis' not in sys.argv:
        print('\n(uji coba — jalankan lagi dengan --tulis untuk menyimpan)')
        return
    open(HALAMAN, 'w', encoding='utf-8').write(html[:awal] + literal(bus) + html[akhir:])
    print(f'-> {os.path.relpath(HALAMAN, REPO)}')


if __name__ == '__main__':
    main()

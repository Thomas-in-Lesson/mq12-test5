#!/usr/bin/env python3
"""Bangun ulang blok hotelsData di halaman Daftar Kamar dari berkas Excel panitia.

Jalankan: python3 tools/build_hotels.py [dir_sumber]
Default dir_sumber: ~/Documents/#Experiment/Baru_data_hotel

Tiap hotel mengirim tata letak Excel yang berbeda, jadi satu parser per hotel.
Kota yang berkasnya belum ada otomatis ditulis sebagai "segera hadir".
"""

import json
import os
import re
import sys
import zipfile
import xml.etree.ElementTree as ET

NS = '{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HALAMAN = os.path.join(REPO, 'daftar_kamar_safari_hwmi_mq_12', 'code.html')
DEFAULT_SRC = os.path.expanduser('~/Documents/#Experiment/Baru_data_hotel')

BELUM_ADA = 'Data pembagian kamar belum tersedia dari tim panitia (segera hadir).'


# ---------------------------------------------------------------- baca xlsx

def baca(path):
    """{nama_sheet: {baris: {kolom: nilai}}} — sel kosong tidak disertakan."""
    with zipfile.ZipFile(path) as z:
        shared = []
        if 'xl/sharedStrings.xml' in z.namelist():
            for si in ET.fromstring(z.read('xl/sharedStrings.xml')).findall(f'{NS}si'):
                shared.append(''.join(t.text or '' for t in si.iter(f'{NS}t')))

        rels = {}
        for rel in ET.fromstring(z.read('xl/_rels/workbook.xml.rels')):
            rels[rel.get('Id')] = 'xl/' + rel.get('Target').lstrip('/')

        sheets = {}
        wb = ET.fromstring(z.read('xl/workbook.xml'))
        for sh in wb.iter(f'{NS}sheet'):
            rid = sh.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')
            grid = {}
            for row in ET.fromstring(z.read(rels[rid])).iter(f'{NS}row'):
                sel = {}
                for c in row.findall(f'{NS}c'):
                    kol = ''.join(ch for ch in c.get('r') if ch.isalpha())
                    v = c.find(f'{NS}v')
                    val = v.text if v is not None else ''
                    if c.get('t') == 's' and val.isdigit():
                        val = shared[int(val)] if int(val) < len(shared) else val
                    elif c.get('t') == 'inlineStr':
                        val = ''.join(t.text or '' for t in c.iter(f'{NS}t'))
                    val = (val or '').strip()
                    if val:
                        sel[kol] = val
                if sel:
                    grid[int(row.get('r'))] = sel
            sheets[sh.get('name')] = grid
        return sheets


def rapi(teks):
    """Samakan gaya tipe kamar: DELUXE BALCONY -> Deluxe Balcony."""
    return re.sub(r'\s+', ' ', (teks or '')).strip().title()


HEADER = re.compile(
    r'^(no\.?|room|room no|guest name|nama|type of room|bed type|floor|lantai|telp|'
    r'sign|remarks|keterangan|d/t|no\.kmr)$', re.I)

# Teks non-nama yang ikut terbaca di kolom nama: kaligrafi pembuka tiap sheet,
# judul rooming list, dan baris tanggal menginap.
BUKAN_NAMA = re.compile(
    r'atas\s+berkat|rooming\s*list|^pic\b|arrival|departure|^lantai\b|'
    r'feruci|oak\s*tree|swissbel|epicentrum|^tipe\b', re.I)


def is_header(v):
    v = (v or '').strip()
    return bool(v) and (bool(HEADER.match(v)) or bool(BUKAN_NAMA.search(v)))


# --------------------------------------------------------------- parser tiap hotel

def parse_jakarta(sheets):
    """B=No urut, C=Room No, D=Tipe, E=Lantai (sel gabungan), G=Nama."""
    kamar, lantai = [], ''
    for grid in sheets.values():
        for r in sorted(grid):
            sel = grid[r]
            nama = sel.get('G', '')
            if is_header(nama) or is_header(sel.get('C', '')):
                continue
            if sel.get('B'):  # baris pembuka kamar
                if sel.get('E'):
                    lantai = sel['E']  # sel gabungan: hanya baris teratas yang berisi
                tipe = rapi(sel.get('D', ''))
                if lantai:
                    tipe = f'{tipe} · Lantai {lantai}'.strip(' ·')
                kamar.append({'roomNo': f"Kamar {sel.get('C', '?')}", 'type': tipe, 'occupants': []})
            if nama and kamar:
                kamar[-1]['occupants'].append(nama)
    return kamar


def parse_gresik(sheets):
    """A=No urut, B=Nama, C=Nomor kamar, D=Tipe ranjang."""
    kamar = []
    for grid in sheets.values():
        for r in sorted(grid):
            sel = grid[r]
            nama = sel.get('B', '')
            if is_header(nama):
                continue
            if sel.get('A'):
                tipe = rapi(sel.get('D', ''))
                kamar.append({
                    'roomNo': f"Kamar {sel.get('C', '?')}",
                    'type': f'{tipe} Bed' if tipe else '',
                    'occupants': [],
                })
            if nama and kamar:
                kamar[-1]['occupants'].append(nama)
    return kamar


# Semarang: tiga blok kolom berdampingan dalam satu sheet.
SEMARANG_BLOK = [
    {'no': 'A', 'room': 'B', 'tipe': 'C', 'nama': 'F', 'lantai': 'H'},
    {'no': 'J', 'room': 'K', 'tipe': 'L', 'nama': 'O', 'lantai': 'Q'},
    {'no': 'S', 'room': 'T', 'tipe': 'U', 'nama': 'X', 'lantai': 'Z'},
]


def parse_semarang(sheets):
    kamar = []
    for blok in SEMARANG_BLOK:
        hasil, lantai = [], ''
        for grid in sheets.values():
            for r in sorted(grid):
                sel = grid[r]
                nama = sel.get(blok['nama'], '')
                if is_header(nama) or is_header(sel.get(blok['room'], '')):
                    continue
                if sel.get(blok['no']):
                    if sel.get(blok['lantai']):
                        lantai = rapi(sel[blok['lantai']])
                    tipe = rapi(sel.get(blok['tipe'], ''))
                    if lantai:
                        tipe = f'{tipe} · {lantai}'.strip(' ·')
                    hasil.append({
                        'roomNo': f"Kamar {sel.get(blok['room'], '?')}",
                        'type': tipe,
                        'occupants': [],
                    })
                if nama and hasil:
                    hasil[-1]['occupants'].append(nama)
        kamar += hasil
    return kamar


def parse_cianjur(sheets):
    """B=Nomor kamar, D=Nama, E=Tipe, header LANTAI n di kolom G. Tiga sheet."""
    kamar = []
    for grid in sheets.values():
        lantai = ''
        for r in sorted(grid):
            sel = grid[r]
            g = sel.get('G', '')
            if g.upper().startswith('LANTAI'):
                lantai = rapi(g)
            nomor = sel.get('B', '')
            nama = sel.get('D', '')
            if is_header(nomor) or is_header(nama):
                continue
            if nomor and re.fullmatch(r'\d+[A-Za-z]?', nomor):
                tipe = rapi(sel.get('E', ''))
                if lantai:
                    tipe = f'{tipe} · {lantai}'.strip(' ·')
                kamar.append({'roomNo': f'Kamar {nomor}', 'type': tipe, 'occupants': []})
            if nama and kamar:
                kamar[-1]['occupants'].append(nama)
    return kamar


# Pemalang memakai baris judul seperti "TIPE DELUXE pax ( 26 Rooms ) lantai 1".
JUDUL_PEMALANG = re.compile(r'^TIPE\s+(.+?)\s+\d*\s*pax.*?lantai\s*(\d+)', re.I)


def parse_pemalang(sheets):
    """B=Nomor kamar atau baris judul seksi, C=Nama."""
    kamar, tipe = [], ''
    for grid in sheets.values():
        for r in sorted(grid):
            sel = grid[r]
            b, nama = sel.get('B', ''), sel.get('C', '')
            judul = JUDUL_PEMALANG.match(b) if b else None
            if judul:
                tipe = f'{rapi(judul.group(1))} · Lantai {judul.group(2)}'
                continue
            if is_header(b) or is_header(nama):
                continue
            if b and b.isdigit():
                kamar.append({'roomNo': f'Kamar {b}', 'type': tipe, 'occupants': []})
            if nama and kamar:
                kamar[-1]['occupants'].append(nama)
    return kamar


# kunci kota -> (nama hotel, berkas Excel, parser)
HOTEL = {
    'Cianjur':  ('Hotel Gino Feruci Cianjur',        'Cianjur.xlsx',       parse_cianjur),
    'Gresik':   ('Hotel Gresik',                     'Gresik.xlsx',        parse_gresik),
    'Jakarta':  ('Swiss-Belhotel Epicentrum Jakarta', 'Jakarta.xlsx',      parse_jakarta),
    'Pemalang': ('Hotel R-Gina Pemalang',            'Pemalang Baru.xlsx', parse_pemalang),
    'Semarang': ('Hotel Oak Tree Semarang',          'Semarang.xlsx',      parse_semarang),
    'Solo':     ('Hotel Sahid Solo',                 'Solo.xlsx',          None),
}


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_SRC
    data = {}

    for kota, (nama_hotel, berkas, parser) in HOTEL.items():
        path = os.path.join(src, berkas)
        if parser is None or not os.path.exists(path):
            data[kota] = {'name': nama_hotel, 'note': BELUM_ADA, 'rooms': []}
            print(f'{kota:9s} -> segera hadir (berkas belum ada)')
            continue

        rooms = [r for r in parser(baca(path)) if r['occupants']]
        data[kota] = {'name': nama_hotel, 'rooms': rooms}
        orang = sum(len(r['occupants']) for r in rooms)
        print(f'{kota:9s} -> {len(rooms):3d} kamar, {orang:3d} penghuni')

    blok = json.dumps(data, ensure_ascii=False, indent=2)
    blok = '\n'.join(('  ' + b) if i else b for i, b in enumerate(blok.split('\n')))

    html = open(HALAMAN, encoding='utf-8').read()
    i = html.index('const hotelsData')
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

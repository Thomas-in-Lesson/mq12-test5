#!/usr/bin/env python3
"""Bangun data rundown di halaman Rundown Kegiatan dari PDF roundown panitia.

Jalankan: python3 tools/build_rundown.py [file.pdf]
Default: ~/Documents/#Experiment/FINALL FIX ROUNDOWN. 13 agustus.pdf

PDF-nya tabel dan banyak selnya menumpuk beberapa baris, sehingga
extract_text() biasa mencampur AGENDA dengan DAERAH dan KEGIATAN dengan
SERAGAM. Di sini teks diambil beserta koordinatnya: posisi x baris header
dipakai sebagai batas kolom, lalu baris yang tidak punya jam diperlakukan
sebagai sambungan sel baris di atasnya.
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
DURASI = re.compile(r'^(\d+\s*Jam(?:\s*\d+\s*menit)?|\d+\s*menit)', re.I)

# Label header -> nama kolom yang dipakai di data.
KOLOM = {
    'NO': 'no', 'AGENDA': 'agenda', 'DAERAH': 'daerah', 'WAKTU': 'jam',
    'DURASI': 'durasi', 'KEGIATAN': 'kegiatan', 'SERAGAM': 'seragam',
    'CATATAN': 'catatan',
}


def baris_halaman(page, toleransi=4.0):
    """[[(x, teks), ...]] per baris visual, urut dari atas ke bawah."""
    frag = []

    def visitor(text, cm, tm, font_dict, font_size):
        if text and text.strip():
            frag.append((round(tm[5], 1), round(tm[4], 1), text.strip()))

    page.extract_text(visitor_text=visitor)
    frag.sort(key=lambda k: (-k[0], k[1]))

    baris, sekarang, y_ref = [], [], None
    for y, x, t in frag:
        if y_ref is not None and abs(y - y_ref) > toleransi:
            baris.append(sekarang)
            sekarang = []
        sekarang.append((x, t))
        y_ref = y
    if sekarang:
        baris.append(sekarang)
    return baris


def anchor_header(baris):
    """Posisi x tiap kolom kalau baris ini adalah baris header tabel."""
    label = {t.upper(): x for x, t in baris}
    if not {'NO', 'AGENDA', 'WAKTU'} <= set(label):
        return None
    return sorted(((label[k], KOLOM[k]) for k in label if k in KOLOM))


def pisah_kolom(baris, anchor):
    """Bagikan potongan teks ke kolom terdekat berdasarkan posisi x."""
    batas = [((anchor[i][0] + anchor[i + 1][0]) / 2) for i in range(len(anchor) - 1)]
    hasil = {nama: [] for _, nama in anchor}
    for x, t in sorted(baris):
        i = 0
        while i < len(batas) and x >= batas[i]:
            i += 1
        hasil[anchor[i][1]].append(t)
    return {k: re.sub(r'\s+', ' ', ' '.join(v)).strip() for k, v in hasil.items()}


# jam akhir opsional: beberapa agenda penutup hanya menulis jam mulai (16.55).
WAKTU_DURASI = re.compile(
    r'^(\d{1,2})[.:](\d{2})(?:[–-](\d{1,2})[.:](\d{2}))?'
    r'((?:\d+Jam(?:\d+[Mm]enit)?|\d+[Mm]enit)?)', re.I)


def punya_jam(row):
    return bool(WAKTU_DURASI.match(re.sub(r'\s+', '', row.get('jam', '') + row.get('durasi', ''))))


def jam_dan_durasi(row):
    """Kolom WAKTU sering tumpah ke kolom DURASI karena tiap angkanya dipecah
    jadi fragmen dengan posisi x yang meleset. Gabung keduanya lalu urai."""
    rapat = re.sub(r'\s+', '', row.get('jam', '') + row.get('durasi', ''))
    m = WAKTU_DURASI.match(rapat)
    if not m:
        return '', ''
    jam = f'{int(m.group(1)):02d}.{m.group(2)}'
    if m.group(3):
        jam += f' – {int(m.group(3)):02d}.{m.group(4)}'
    durasi = re.sub(r'(?i)(\d+)\s*(jam|menit)', lambda x: f'{x.group(1)} {x.group(2).title()} ', m.group(5))
    return jam, re.sub(r'\s+', ' ', durasi).strip()


def rapikan(row):
    """Bersihkan hasil mentah satu baris tabel."""
    jam, durasi = jam_dan_durasi(row)
    catatan = row.get('catatan', '').strip()

    return {
        'jam': jam,
        'agenda': re.sub(r'^\d+\s*\.?\s*', '', row.get('agenda', '')).strip(),
        'daerah': row.get('daerah', '').strip(),
        'durasi': durasi,
        'kegiatan': row.get('kegiatan', '').strip(),
        'seragam': row.get('seragam', '').strip().strip(',').strip(),
        # sisa koma dari kolom SERAGAM yang tumpah; bukan catatan sungguhan
        'catatan': '' if re.fullmatch(r'[\s,.\-]*', catatan) else catatan,
    }


def parse(pdf_path):
    reader = pypdf.PdfReader(pdf_path)
    sesi, kunci, hari, anchor, baris_aktif = {}, None, None, None, None

    def simpan():
        nonlocal baris_aktif
        if baris_aktif and hari is not None:
            bersih = rapikan(baris_aktif)
            # Agenda penutup ada yang tidak diberi jam sama sekali di dokumen
            # ("Penyambutan Ndalem — Kondisional"); tetap ditampilkan apa adanya.
            if bersih['jam'] or (bersih['agenda'] and baris_aktif.get('no', '').strip()):
                hari['agenda'].append(bersih)
        baris_aktif = None

    for page in reader.pages:
        for baris in baris_halaman(page):
            teks = re.sub(r'\s+', ' ', ' '.join(t for _, t in sorted(baris))).strip()
            if not teks:
                continue

            head = anchor_header(baris)
            if head:
                simpan()
                anchor = head
                continue

            m = SESI.match(teks)
            if m:
                simpan()
                kunci = 'sesi' + m.group(1)
                sisa = m.group(2).strip()
                arm = ARMADA.search(sisa)
                sesi[kunci] = {
                    'armada': arm.group(1).strip() if arm else '',
                    'tanggal': ARMADA.sub('', sisa).strip(' ,'),
                    'hari': [],
                }
                hari = None
                continue

            if kunci is None:
                continue

            m = HARI.match(teks)
            if m:
                simpan()
                hari = {'label': f'Hari Ke-{m.group(1)}', 'tanggal': m.group(2).strip(' ,'), 'agenda': []}
                sesi[kunci]['hari'].append(hari)
                continue

            if anchor is None:
                continue

            kol = pisah_kolom(baris, anchor)

            # Kolom NO dan WAKTU bisa jatuh di baris visual yang berbeda dalam
            # satu baris tabel, jadi nomor urut saja bukan penanda yang andal.
            # Jam selalu muncul tepat sekali per baris, itu penanda utamanya.
            # Nomor urut hanya dipakai kalau baris berjalan sudah punya nomor
            # DAN jam — cukup untuk memisah agenda penutup yang tak berjam,
            # tanpa memecah baris yang nomornya menumpuk di baris visual lain.
            nomor = re.match(r'^\d+\s*\.?$', kol.get('no', '').strip())
            lanjut_bernomor = bool(
                nomor and baris_aktif is not None
                and baris_aktif.get('no', '').strip() and punya_jam(baris_aktif))

            if punya_jam(kol) or lanjut_bernomor:
                simpan()
                if hari is None:  # sesi satu hari tidak punya baris "HARI KE"
                    hari = {'label': '', 'tanggal': sesi[kunci]['tanggal'], 'agenda': []}
                    sesi[kunci]['hari'].append(hari)
                baris_aktif = kol
            elif baris_aktif is not None:
                # sambungan sel yang menumpuk ke baris berikutnya
                for k, v in kol.items():
                    if v:
                        baris_aktif[k] = (baris_aktif.get(k, '') + ' ' + v).strip()

    simpan()
    return sesi


# PDF tidak menulis armada untuk Sesi 3; diisi atas konfirmasi panitia.
ARMADA_TAMBAHAN = {'sesi3': 'Big Bus'}


def main():
    pdf = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_PDF
    data = parse(pdf)

    for kunci, armada in ARMADA_TAMBAHAN.items():
        if kunci in data and not data[kunci]['armada']:
            data[kunci]['armada'] = armada

    for k, s in data.items():
        total = sum(len(h['agenda']) for h in s['hari'])
        print(f"{k}: {len(s['hari'])} hari, {total} agenda"
              + (f", armada {s['armada']}" if s['armada'] else ''))

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

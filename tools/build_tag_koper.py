#!/usr/bin/env python3
"""Buat lembar tag koper siap cetak dari DATA NAME TAG KOPER.xlsx.

Jalankan: python3 tools/build_tag_koper.py [file.xlsx]
Default sumber: ~/Documents/#Experiment/DATA NAME TAG KOPER.xlsx
Hasil        : ~/Documents/#Experiment/tag-koper.html
               (buka di browser lalu Cmd+P -> Save as PDF)

PENTING: keluarannya memuat nomor HP peserta. Berkas hasil sengaja ditulis DI
LUAR folder repo, bukan sekadar di-gitignore, supaya tidak ikut terkirim kalau
situsnya nanti dideploy dengan menyalin seluruh isi folder ke server. Yang
disimpan di repo hanya skrip ini, datanya tidak.
"""

import html
import re
import os
import sys
import zipfile
import xml.etree.ElementTree as ET

NS = '{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_SRC = os.path.expanduser('~/Documents/#Experiment/DATA NAME TAG KOPER.xlsx')
KELUARAN = os.path.expanduser('~/Documents/#Experiment/tag-koper.html')

# Warna per bus supaya gampang disortir saat bongkar bagasi.
WARNA = {
    'BUS 1': '#C21A03', 'BUS 2': '#1D4ED8', 'BUS 3': '#047857',
    'BUS 4': '#B45309', 'BUS 5': '#6D28D9', 'BUS 6': '#BE185D',
}
WARNA_LAIN = '#374151'


def baca(path):
    """[(nama, bus, telp)] dari kolom B/C/D, baris header dilewati."""
    with zipfile.ZipFile(path) as z:
        shared = []
        if 'xl/sharedStrings.xml' in z.namelist():
            for si in ET.fromstring(z.read('xl/sharedStrings.xml')).findall(f'{NS}si'):
                shared.append(''.join(t.text or '' for t in si.iter(f'{NS}t')))

        sheet = ET.fromstring(z.read('xl/worksheets/sheet1.xml'))
        baris = []
        for row in sheet.iter(f'{NS}row'):
            sel = {}
            for c in row.findall(f'{NS}c'):
                kol = ''.join(ch for ch in c.get('r') if ch.isalpha())
                v = c.find(f'{NS}v')
                val = v.text if v is not None else ''
                if c.get('t') == 's' and val.isdigit():
                    val = shared[int(val)] if int(val) < len(shared) else val
                if val and val.strip():
                    sel[kol] = val.strip()

            nama, bus, telp = sel.get('B', ''), sel.get('C', ''), sel.get('D', '')
            # Baris header berisi "nama | bus | nomor tlp"; "bus" tanpa angka
            # ikut lolos kalau hanya dicek awalannya, jadi nomornya diwajibkan.
            if not nama or not re.fullmatch(r'BUS\s*\d+', bus.strip(), re.I):
                continue
            baris.append((nama, re.sub(r'\s+', ' ', bus.strip().upper()), telp))
    return baris


def kartu(nama, bus, telp):
    warna = WARNA.get(bus, WARNA_LAIN)
    # Nama panjang dikecilkan supaya tetap muat satu kartu.
    ukuran = '15pt' if len(nama) <= 22 else ('13pt' if len(nama) <= 30 else '11pt')
    return f'''
    <div class="tag">
      <div class="pita" style="background:{warna}">{html.escape(bus)}</div>
      <div class="isi">
        <div class="nama" style="font-size:{ukuran}">{html.escape(nama)}</div>
        <div class="telp">{html.escape(telp) if telp else '&nbsp;'}</div>
      </div>
      <div class="kaki">SAFARI HWMI MQ 12 &middot; SESI 3</div>
    </div>'''


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_SRC
    data = baca(src)
    data.sort(key=lambda r: (r[1], r[0].lower()))

    per_bus = {}
    for _, bus, _ in data:
        per_bus[bus] = per_bus.get(bus, 0) + 1
    tanpa_telp = sum(1 for _, _, t in data if not t)

    doc = f'''<!DOCTYPE html>
<html lang="id"><head><meta charset="utf-8">
<title>Tag Koper — Safari HWMI MQ 12</title>
<style>
  @page {{ size: A4 portrait; margin: 10mm; }}
  * {{ box-sizing: border-box; }}
  body {{ margin: 0; background: #F3F4F6;
         font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }}
  .catatan {{ padding: 12px 16px; background: #FEF3C7; border-bottom: 2px solid #B45309;
              color: #7C2D12; font-size: 12pt; }}
  .lembar {{ display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; padding: 10mm; }}
  .tag {{ height: 62mm; display: flex; flex-direction: column;
          border: 1.2pt dashed #9CA3AF; border-radius: 3mm;
          background: #FFFFFF; overflow: hidden; }}
  .pita {{ padding: 3mm; color: #FFFFFF; font-size: 19pt; font-weight: 800;
           letter-spacing: .06em; text-align: center; }}
  .isi {{ flex: 1; display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: 2mm; padding: 3mm; text-align: center; }}
  .nama {{ font-weight: 800; color: #111827; line-height: 1.25; }}
  .telp {{ font-size: 12pt; font-weight: 600; color: #374151;
           font-variant-numeric: tabular-nums; }}
  .kaki {{ padding: 2mm; border-top: 1pt solid #E5E7EB;
           color: #6B7280; font-size: 7.5pt; letter-spacing: .08em; text-align: center; }}
  @media print {{
    body {{ background: #FFFFFF; }}
    .catatan {{ display: none; }}
    .lembar {{ padding: 0; gap: 3mm; }}
    .tag {{ break-inside: avoid; }}
    .pita {{ -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
  }}
</style></head>
<body>
<div class="catatan">
  <strong>{len(data)} tag</strong> &mdash; {' &middot; '.join(f'{b}: {n}' for b, n in sorted(per_bus.items()))}
  {f' &middot; <strong>{tanpa_telp} tanpa nomor HP</strong>' if tanpa_telp else ''}
  <br>Cetak lewat Cmd + P (aktifkan &ldquo;Background graphics&rdquo; agar pita warnanya ikut tercetak).
  Berkas ini memuat nomor HP peserta &mdash; jangan diunggah ke web.
</div>
<div class="lembar">{''.join(kartu(*r) for r in data)}</div>
</body></html>
'''

    with open(KELUARAN, 'w', encoding='utf-8') as f:
        f.write(doc)

    print(f'{len(data)} tag: ' + ', '.join(f'{b} {n}' for b, n in sorted(per_bus.items())))
    if tanpa_telp:
        print(f'{tanpa_telp} tag tanpa nomor HP')
    print(f'-> {KELUARAN}')
    print('   berisi nomor HP peserta; sengaja di luar folder repo, jangan diunggah')


if __name__ == '__main__':
    main()

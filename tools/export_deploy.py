#!/usr/bin/env python3
"""
Generator Direktori Siap Upload Web Safari HWMI MQ 12
Menyalin seluruh berkas web produksi statis ke direktori bersih di luar repo:
~/Documents/#Experiment/SIAP_UPLOAD_WEB_SAFARI_MQ12
"""

import os
import shutil

src_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
dest_dir = os.path.abspath(os.path.join(src_dir, '..', 'SIAP_UPLOAD_WEB_SAFARI_MQ12'))

if os.path.exists(dest_dir):
    shutil.rmtree(dest_dir)

os.makedirs(dest_dir, exist_ok=True)

# Berkas utama di root
root_files = [
    'index.html',
    'darurat.html',
    'styles.css',
    'site-navigation.js',
    'sw.js',
    'peserta.json',
    'manifest.json',
    'favicon.ico',
    'icon-180.png',
    'icon-192.png',
    'icon-512.png',
    'icon-maskable-512.png',
    'logo.png',
    'og-cover.jpg',
    'denah-data.js',
    'denah-viewer.js',
    'skema-foto-terbaru.pdf'
]

for f in root_files:
    s = os.path.join(src_dir, f)
    if os.path.exists(s):
        shutil.copy2(s, os.path.join(dest_dir, f))

# Subdirektori pendukung
sub_dirs = ['fonts', 'denah', 'vendor']
for d in sub_dirs:
    s = os.path.join(src_dir, d)
    if os.path.exists(s):
        shutil.copytree(s, os.path.join(dest_dir, d))

# Subdirektori 22 halaman (*_safari_hwmi_mq_12/code.html)
for sub in os.listdir(src_dir):
    full_sub = os.path.join(src_dir, sub)
    if os.path.isdir(full_sub) and os.path.exists(os.path.join(full_sub, 'code.html')):
        dest_sub = os.path.join(dest_dir, sub)
        os.makedirs(dest_sub, exist_ok=True)
        shutil.copy2(os.path.join(full_sub, 'code.html'), os.path.join(dest_sub, 'code.html'))

print('✅ BERHASIL: Direktori web produksi siap upload telah dibuat di:')
print(f'   {dest_dir}')

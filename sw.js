const CACHE_NAME = 'safari-hwmi-mq12-v64';
const ASSETS = [
  './',
  './index.html',
  './darurat.html',
  './site-navigation.js',
  './styles.css',
  './peserta.json',
  './manifest.json',
  './favicon.ico',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './icon-180.png',
  './logo.png',
  './fonts/material-symbols-outlined-fallback-100_700.woff2',
  './fonts/noto-serif-latin-400.woff2',
  './fonts/noto-serif-latin-ext-400.woff2',
  './fonts/plus-jakarta-sans-latin-400.woff2',
  './fonts/plus-jakarta-sans-latin-ext-400.woff2',
  './beranda_mobile_dark_safari_hwmi_mq_12/code.html',
  './informasi_peserta_safari_hwmi_mq_12/code.html',
  './i_tibar_musafir_final_safari_hwmi_mq_12/code.html',
  './tata_tertib_dark_safari_hwmi_mq_12/code.html',
  './panduan_sholat_musafir_safari_hwmi_mq_12/code.html',
  './tata_tertib_berangkat_verbatim_safari_hwmi_mq_12/code.html',
  './etika_dalam_berbicara_safari_hwmi_mq_12/code.html',
  './etika_dalam_berpakaian_safari_hwmi_mq_12/code.html',
  './tata_tertib_di_penginapan_safari_hwmi_mq_12/code.html',
  './tata_tertib_selain_makam_safari_hwmi_mq_12/code.html',
  './tata_tertib_di_area_makam_safari_hwmi_mq_12/code.html',
  './tata_tertib_di_dalam_bus_safari_hwmi_mq_12/code.html',
  './rundown_kegiatan_safari_hwmi_mq_12/code.html',
  './daftar_kamar_safari_hwmi_mq_12/code.html',
  './jadwal_seragam_safari_hwmi_mq_12/code.html',
  './skema_foto_safari_hwmi_mq_12/code.html',
  './peta_safari_hwmi_mq_12/code.html',
  './starterpack_dan_packing_safari_hwmi_mq_12/code.html',
  './denah-data.js',
  './denah-viewer.js',
  './profil-data.js',
  './denah/sesi1/syuhada.webp',
  './denah/sesi1/syuhada-kecil.webp',
  './denah/sesi1/sanusi.webp',
  './denah/sesi1/sanusi-kecil.webp',
  './denah/sesi1/zamrozi.webp',
  './denah/sesi1/zamrozi-kecil.webp',
  './denah/sesi1/falal.webp',
  './denah/sesi1/falal-kecil.webp',
  './denah/sesi1/dukhan-iskandar.webp',
  './denah/sesi1/dukhan-iskandar-kecil.webp',
  './denah/sesi1/salamun-sumadji.webp',
  './denah/sesi1/salamun-sumadji-kecil.webp',
  './denah/sesi1/imam-puro.webp',
  './denah/sesi1/imam-puro-kecil.webp',
  './denah/sesi1/jumadil-kubro.webp',
  './denah/sesi1/jumadil-kubro-kecil.webp',
  './denah_bus_safari_hwmi_mq_12/code.html',
  './denah_bus_sesi_2_safari_hwmi_mq_12/code.html',
  './denah_bus_sesi_3_safari_hwmi_mq_12/code.html',
  './denah_tempat_duduk_elf_safari_hwmi_mq_12/code.html',
  './skema-foto-terbaru.pdf',
  './vendor/pdf.min.js',
  './vendor/pdf.worker.min.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // addAll() bersifat semua-atau-tidak: satu berkas gagal diambil membuat
      // seluruh precache batal tanpa jejak. Disimpan satu per satu supaya
      // kegagalan satu berkas tidak menghapus sisanya.
      return Promise.all(ASSETS.map((aset) => cache.add(aset).catch(() => {})));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        // Semua aset sudah same-origin sejak Tailwind & font di-host sendiri,
        // jadi respons opaque lintas-origin tidak perlu ikut disimpan lagi.
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        }
        return networkResponse;
      }).catch(() => {
        return caches.match('./index.html');
      });
    })
  );
});

const CACHE_NAME = 'safari-hwmi-mq12-v94';
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
  './denah/sesi2/bung-karno.webp',
  './denah/sesi2/bung-karno-kecil.webp',
  './denah/sesi2/mpu-tantular.webp',
  './denah/sesi2/mpu-tantular-kecil.webp',
  './denah/sesi2/wage-supratman.webp',
  './denah/sesi2/wage-supratman-kecil.webp',
  './denah/sesi2/sunan-ampel.webp',
  './denah/sesi2/sunan-ampel-kecil.webp',
  './denah/sesi2/jalan-kaki-gresik.webp',
  './denah/sesi2/jalan-kaki-gresik-kecil.webp',
  './denah/sesi2/sunan-gresik.webp',
  './denah/sesi2/sunan-gresik-kecil.webp',
  './denah/sesi2/raden-santri.webp',
  './denah/sesi2/raden-santri-kecil.webp',
  './denah/sesi2/sunan-deket.webp',
  './denah/sesi2/sunan-deket-kecil.webp',
  './denah/sesi2/sunan-drajat.webp',
  './denah/sesi2/sunan-drajat-kecil.webp',
  './denah/sesi2/asmoroqondi.webp',
  './denah/sesi2/asmoroqondi-kecil.webp',
  './denah/sesi2/sunan-bonang.webp',
  './denah/sesi2/sunan-bonang-kecil.webp',
  './denah/sesi3/benteng-pendem.webp',
  './denah/sesi3/benteng-pendem-kecil.webp',
  './denah/sesi3/masjid-agung-karanganyar.webp',
  './denah/sesi3/masjid-agung-karanganyar-kecil.webp',
  './denah/sesi3/astana-mangadeg.webp',
  './denah/sesi3/astana-mangadeg-kecil.webp',
  './denah/sesi3/candi-prambanan.webp',
  './denah/sesi3/candi-prambanan-kecil.webp',
  './denah/sesi3/jendral-sudirman.webp',
  './denah/sesi3/jendral-sudirman-kecil.webp',
  './denah/sesi3/hos-cokroaminoto.webp',
  './denah/sesi3/hos-cokroaminoto-kecil.webp',
  './denah/sesi3/masjid-syuhada.webp',
  './denah/sesi3/masjid-syuhada-kecil.webp',
  './denah/sesi3/jmyr-mungkid.webp',
  './denah/sesi3/jmyr-mungkid-kecil.webp',
  './denah/sesi3/stupa-borobudur.webp',
  './denah/sesi3/stupa-borobudur-kecil.webp',
  './denah/sesi3/sosrokartono.webp',
  './denah/sesi3/sosrokartono-kecil.webp',
  './denah/sesi3/dzatul-kahfi-gunung-jati.webp',
  './denah/sesi3/dzatul-kahfi-gunung-jati-kecil.webp',
  './denah/sesi3/masjid-syarif-abdurrachman.webp',
  './denah/sesi3/masjid-syarif-abdurrachman-kecil.webp',
  './denah/sesi3/peta-syekh-musa.webp',
  './denah/sesi3/peta-syekh-musa-kecil.webp',
  './denah/sesi3/syekh-musa.webp',
  './denah/sesi3/syekh-musa-kecil.webp',
  './denah/sesi3/pesantren-hshf.webp',
  './denah/sesi3/pesantren-hshf-kecil.webp',
  './denah/sesi3/bung-hatta.webp',
  './denah/sesi3/bung-hatta-kecil.webp',
  './denah/sesi3/husein-mutahar.webp',
  './denah/sesi3/husein-mutahar-kecil.webp',
  './denah/sesi3/abu-hanifah-abdul-muthi.webp',
  './denah/sesi3/abu-hanifah-abdul-muthi-kecil.webp',
  './denah/sesi3/museum-sumpah-pemuda.webp',
  './denah/sesi3/museum-sumpah-pemuda-kecil.webp',
  './denah/sesi3/monas.webp',
  './denah/sesi3/monas-kecil.webp',
  './denah/sesi3/masjid-istiqlal.webp',
  './denah/sesi3/masjid-istiqlal-kecil.webp',
  './denah/sesi3/sunan-kalijogo.webp',
  './denah/sesi3/sunan-kalijogo-kecil.webp',
  './denah/sesi3/raden-abdul-fattah.webp',
  './denah/sesi3/raden-abdul-fattah-kecil.webp',
  './denah_bus_safari_hwmi_mq_12/code.html',
  './denah_bus_sesi_2_safari_hwmi_mq_12/code.html',
  './denah_bus_sesi_3_safari_hwmi_mq_12/code.html',
  './denah_tempat_duduk_elf_safari_hwmi_mq_12/code.html',
  './skema-foto-sesi3.pdf',
  './skema-foto-sesi2.pdf',
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

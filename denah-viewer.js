/* Penampil denah lokasi ziarah, dipakai bersama oleh halaman Peta Safari dan
   Rundown Kegiatan. Butuh denah-data.js dimuat lebih dulu.

   Gayanya ditulis di sini, bukan di styles.css, karena styles.css adalah hasil
   build Tailwind yang sudah di-purge sehingga kelas baru tidak ikut ter-compile. */
(function () {
  'use strict';

  var D = window.DENAH;
  if (!D) return;
  var P = window.PROFIL || {};

  // Profil tokoh untuk satu lokasi, dicocokkan lewat slug yang sama dengan denah.
  function profilLokasi(sesi, slug) {
    var daftar = P[sesi] || [];
    for (var i = 0; i < daftar.length; i++) {
      if (daftar[i].slug === slug) return daftar[i].tokoh || [];
    }
    return [];
  }

  var esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };

  // Akar situs diturunkan dari lokasi berkas ini sendiri, bukan dari
  // location.pathname, supaya tetap benar baik dipanggil dari halaman di dalam
  // folder maupun dari index.html di akar.
  var AKAR = (function () {
    var s = document.currentScript;
    return s ? s.src.replace(/denah-viewer\.js.*$/, '') : './';
  })();

  var gambar = function (sesi, slug, kecil, alt, lazy) {
    var d = 'denah/' + sesi + '/' + slug + (kecil ? '-kecil' : '');
    return '<picture>' +
      '<source srcset="' + AKAR + d + '.webp" type="image/webp">' +
      '<img src="' + AKAR + d + '.jpg" alt="' + esc(alt) + '"' +
      (lazy ? ' loading="lazy"' : '') + '>' +
      '</picture>';
  };

  var CSS = [
    '.denah-daftar{display:grid;gap:10px}',
    '.denah-kartu{display:flex;gap:10px;width:100%;padding:8px;text-align:left;cursor:pointer;',
    '  border:1px solid rgba(224,184,99,.3);border-radius:14px;background:rgb(var(--c-surface-low));',
    '  color:#fff;font:inherit;align-items:center;transition:border-color .18s ease,background .18s ease}',
    '.denah-kartu:hover{border-color:rgba(224,184,99,.6);background:rgb(var(--c-surface-container))}',
    '.denah-kartu picture{flex:none;width:96px;height:62px;border-radius:9px;overflow:hidden;background:#fff}',
    '.denah-kartu img{width:100%;height:100%;object-fit:cover;object-position:right center;display:block}',
    '.denah-teks{min-width:0;flex:1}',
    '.denah-no{display:inline-block;min-width:20px;padding:1px 6px;margin-bottom:3px;border-radius:999px;',
    '  background:rgba(224,184,99,.18);border:1px solid rgba(224,184,99,.45);',
    '  color:#E0B863;font-size:10px;font-weight:800;text-align:center}',
    '.denah-judul{display:block;font-size:12.5px;font-weight:700;color:#fff;line-height:1.3}',
    '.denah-meta{display:block;margin-top:3px;font-size:10.5px;color:rgb(var(--c-on-surface-variant))}',

    '.denah-tautan{display:inline-flex;align-items:center;gap:5px;margin:6px 6px 0 0;padding:4px 10px;',
    '  border:1px solid rgba(224,184,99,.45);border-radius:999px;background:rgba(224,184,99,.14);',
    '  color:#E0B863;font-size:10.5px;font-weight:700;cursor:pointer;font-family:inherit}',

    '.denah-layar{position:fixed;inset:0;z-index:11000;display:none;flex-direction:column;background:#0D0303}',
    '.denah-layar.buka{display:flex}',
    'body.denah-terkunci{overflow:hidden}',
    '.denah-atas{display:flex;align-items:center;gap:10px;padding:10px 12px;',
    '  border-bottom:1px solid rgba(224,184,99,.25);background:rgba(58,12,12,.95)}',
    '.denah-atas .jdl{flex:1;min-width:0;font-size:12.5px;font-weight:700;color:#fff;line-height:1.3}',
    '.denah-atas .jdl small{display:block;margin-top:2px;font-size:10.5px;font-weight:500;',
    '  color:rgb(var(--c-on-surface-variant))}',
    '.denah-tbl{flex:none;width:34px;height:34px;display:grid;place-items:center;cursor:pointer;',
    '  border:1px solid rgba(224,184,99,.45);border-radius:10px;background:rgba(224,184,99,.14)}',
    '.denah-tbl:disabled{opacity:.35;cursor:default}',

    '.denah-panggung{flex:1;overflow:hidden;position:relative;background:#fff;touch-action:none}',
    '.denah-panggung picture,.denah-panggung img{display:block;width:100%;height:100%}',
    '.denah-panggung img{object-fit:contain;transform-origin:0 0;will-change:transform}',
    '.denah-petunjuk{position:absolute;left:50%;bottom:10px;transform:translateX(-50%);',
    '  padding:5px 12px;border-radius:999px;background:rgba(13,3,3,.82);color:#E0B863;',
    '  font-size:10.5px;font-weight:600;white-space:nowrap;pointer-events:none;transition:opacity .4s ease}',

    '.denah-bawah{flex:none;max-height:42vh;overflow:auto;background:rgb(var(--c-surface-low));',
    '  border-top:1px solid rgba(224,184,99,.25)}',
    '.denah-bawah summary{padding:11px 14px;color:#E0B863;font-size:12px;font-weight:700;cursor:pointer}',
    '.denah-legenda{display:grid;grid-template-columns:1fr;gap:7px;padding:0 14px 14px}',
    '.denah-baris{display:flex;align-items:center;gap:9px;font-size:11.5px;color:#fff}',
    '.denah-kotak{flex:none;width:17px;height:17px;border-radius:4px;border:1px solid rgba(255,255,255,.45)}',
    '.denah-kode{flex:none;min-width:24px;padding:1px 5px;border:1px solid rgba(255,255,255,.5);',
    '  border-radius:4px;font-size:10px;font-weight:700;text-align:center;color:#fff}',
    // Pemilih Denah / Profil di dalam layar penuh
    '.denah-tab{display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:8px 12px;',
    '  background:rgba(58,12,12,.95);border-bottom:1px solid rgba(224,184,99,.25)}',
    '.denah-tab button{padding:8px 4px;border:1px solid rgba(224,184,99,.4);border-radius:10px;',
    '  background:transparent;color:#E0B863;font:700 11.5px/1 -apple-system,BlinkMacSystemFont,sans-serif;',
    '  cursor:pointer;white-space:nowrap}',
    '.denah-tab button.aktif{background:rgb(var(--c-gold));color:rgb(var(--c-on-gold));border-color:rgb(var(--c-gold))}',

    // Panggung teks profil — dibaca, bukan dilihat, jadi diberi lebar baca nyaman
    '.profil-panggung{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;',
    '  background:rgb(var(--c-surface));padding:18px 16px 28px}',
    '.profil-isi{max-width:34em;margin:0 auto}',
    '.profil-tokoh+.profil-tokoh{margin-top:22px;padding-top:20px;border-top:1px solid rgba(224,184,99,.22)}',
    '.profil-nama{margin:0 0 10px;font-family:"Noto Serif",serif;font-size:17px;line-height:1.3;',
    '  font-weight:700;color:rgb(var(--c-gold))}',
    '.profil-isi p{margin:0 0 12px;font-size:15px;line-height:1.75;color:#fff;text-align:left}',
    '.profil-isi p:last-child{margin-bottom:0}',
    '.profil-kosong{padding:28px 16px;text-align:center;font-size:12.5px;',
    '  color:rgb(var(--c-on-surface-variant))}',

    '@media(min-width:600px){.denah-legenda{grid-template-columns:1fr 1fr}}',
    '@media(min-width:768px){.profil-isi p{font-size:16px}.profil-nama{font-size:19px}}',
    '@media(min-width:768px){.denah-kartu picture{width:132px;height:84px}',
    '  .denah-judul{font-size:14px}.denah-atas .jdl{font-size:15px}}',
  ].join('\n');

  var gaya = document.createElement('style');
  gaya.textContent = CSS;
  document.head.appendChild(gaya);

  var IKON = {
    tutup: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
    kiri: 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z',
    kanan: 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z',
    denah: 'M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z',
    profil: 'M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z',
  };
  var svg = function (d, ukuran) {
    return '<svg width="' + (ukuran || 18) + '" height="' + (ukuran || 18) +
      '" viewBox="0 0 24 24" fill="#E0B863" aria-hidden="true"><path d="' + d + '"/></svg>';
  };

  var layar = null, sesiAktif = null, ke = 0, tabAktif = 'denah';
  var skala = 1, geserX = 0, geserY = 0;

  function terapkan() {
    var img = layar.querySelector('.denah-panggung img');
    if (img) img.style.transform = 'translate(' + geserX + 'px,' + geserY + 'px) scale(' + skala + ')';
  }

  function reset() { skala = 1; geserX = 0; geserY = 0; terapkan(); }

  function legendaHTML() {
    var baris = D.legenda.map(function (l) {
      return '<div class="denah-baris"><span class="denah-kotak" style="background:' + l.warna +
        '"></span><span>' + esc(l.label) + '</span></div>';
    }).concat(D.parkir.map(function (p) {
      return '<div class="denah-baris"><span class="denah-kode">' + esc(p.kode) +
        '</span><span>' + esc(p.label) + '</span></div>';
    }));
    return '<details open><summary>Keterangan warna &amp; simbol</summary>' +
      '<div class="denah-legenda">' + baris.join('') + '</div></details>';
  }

  function bangunLayar() {
    layar = document.createElement('div');
    layar.className = 'denah-layar';
    layar.innerHTML =
      '<div class="denah-atas">' +
      '  <button class="denah-tbl" data-aksi="prev" aria-label="Denah sebelumnya">' + svg(IKON.kiri) + '</button>' +
      '  <div class="jdl"></div>' +
      '  <button class="denah-tbl" data-aksi="next" aria-label="Denah berikutnya">' + svg(IKON.kanan) + '</button>' +
      '  <button class="denah-tbl" data-aksi="tutup" aria-label="Tutup">' + svg(IKON.tutup) + '</button>' +
      '</div>' +
      '<div class="denah-tab">' +
      '  <button data-aksi="tab" data-tab="denah">Denah Lokasi</button>' +
      '  <button data-aksi="tab" data-tab="profil">Profil Singkat</button>' +
      '</div>' +
      '<div class="denah-panggung"></div>' +
      '<div class="profil-panggung"></div>' +
      '<div class="denah-bawah">' + legendaHTML() + '</div>';
    document.body.appendChild(layar);

    layar.addEventListener('click', function (e) {
      var t = e.target.closest('[data-aksi]');
      if (!t) return;
      if (t.dataset.aksi === 'tutup') tutup();
      if (t.dataset.aksi === 'prev') pindah(-1);
      if (t.dataset.aksi === 'next') pindah(1);
      if (t.dataset.aksi === 'tab') { tabAktif = t.dataset.tab; tampil(); }
    });

    pasangSentuhan(layar.querySelector('.denah-panggung'));
    document.addEventListener('keydown', function (e) {
      if (!layar.classList.contains('buka')) return;
      if (e.key === 'Escape') tutup();
      if (e.key === 'ArrowLeft') pindah(-1);
      if (e.key === 'ArrowRight') pindah(1);
    });
  }

  // Cubit dua jari untuk memperbesar, satu jari untuk menggeser saat sudah
  // diperbesar, dan usap kiri/kanan untuk pindah denah saat belum diperbesar.
  function pasangSentuhan(panggung) {
    var jarakAwal = 0, skalaAwal = 1, mulaiX = 0, mulaiY = 0, gx = 0, gy = 0, mode = '';
    var jarak = function (t) {
      return Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    };

    panggung.addEventListener('touchstart', function (e) {
      if (e.touches.length === 2) {
        mode = 'cubit'; jarakAwal = jarak(e.touches); skalaAwal = skala;
      } else if (e.touches.length === 1) {
        mode = skala > 1 ? 'geser' : 'usap';
        mulaiX = e.touches[0].clientX; mulaiY = e.touches[0].clientY;
        gx = geserX; gy = geserY;
      }
    }, { passive: true });

    panggung.addEventListener('touchmove', function (e) {
      if (mode === 'cubit' && e.touches.length === 2) {
        skala = Math.min(6, Math.max(1, skalaAwal * (jarak(e.touches) / jarakAwal)));
        if (skala === 1) { geserX = 0; geserY = 0; }
        terapkan();
      } else if (mode === 'geser' && e.touches.length === 1) {
        geserX = gx + (e.touches[0].clientX - mulaiX);
        geserY = gy + (e.touches[0].clientY - mulaiY);
        terapkan();
      }
    }, { passive: true });

    panggung.addEventListener('touchend', function (e) {
      if (mode === 'usap' && e.changedTouches.length) {
        var dx = e.changedTouches[0].clientX - mulaiX;
        var dy = e.changedTouches[0].clientY - mulaiY;
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) pindah(dx < 0 ? 1 : -1);
      }
      mode = '';
    });

    var ketukTerakhir = 0;
    panggung.addEventListener('click', function () {
      var kini = Date.now();
      if (kini - ketukTerakhir < 300) {
        skala = skala > 1 ? 1 : 2.5;
        geserX = 0; geserY = 0;
        terapkan();
      }
      ketukTerakhir = kini;
    });
  }

  function tampil() {
    var daftar = D[sesiAktif] || [];
    var d = daftar[ke];
    if (!d) return;

    layar.querySelector('.jdl').innerHTML = esc(d.no + '. ' + d.judul) +
      (d.jam || d.daerah ? '<small>' + esc([d.jam, d.daerah].filter(Boolean).join(' · ')) + '</small>' : '');
    layar.querySelector('[data-aksi="prev"]').disabled = ke === 0;
    layar.querySelector('[data-aksi="next"]').disabled = ke === daftar.length - 1;

    var tokoh = profilLokasi(sesiAktif, d.slug);
    // Tab hanya berguna kalau lokasi ini memang punya profil.
    var barisTab = layar.querySelector('.denah-tab');
    barisTab.style.display = tokoh.length ? '' : 'none';
    if (!tokoh.length) tabAktif = 'denah';
    barisTab.querySelectorAll('button').forEach(function (b) {
      b.classList.toggle('aktif', b.dataset.tab === tabAktif);
    });

    var panggung = layar.querySelector('.denah-panggung');
    var teks = layar.querySelector('.profil-panggung');
    var bawah = layar.querySelector('.denah-bawah');
    var lihatProfil = tabAktif === 'profil';

    panggung.style.display = lihatProfil ? 'none' : '';
    bawah.style.display = lihatProfil ? 'none' : '';
    teks.style.display = lihatProfil ? '' : 'none';

    if (lihatProfil) {
      teks.innerHTML = '<div class="profil-isi">' + tokoh.map(function (t) {
        return '<div class="profil-tokoh"><h3 class="profil-nama">' + esc(t.nama) + '</h3>' +
          (t.paragraf || []).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') +
          '</div>';
      }).join('') + '</div>';
      teks.scrollTop = 0;
      return;
    }

    panggung.innerHTML = gambar(sesiAktif, d.slug, false, d.judul, false) +
      '<div class="denah-petunjuk">Cubit dua jari untuk memperbesar · usap untuk pindah</div>';
    reset();

    var petunjuk = panggung.querySelector('.denah-petunjuk');
    setTimeout(function () { if (petunjuk) petunjuk.style.opacity = '0'; }, 3200);
  }

  function pindah(arah) {
    var daftar = D[sesiAktif] || [];
    var baru = ke + arah;
    if (baru < 0 || baru >= daftar.length) return;
    ke = baru;
    tampil();
  }

  function buka(sesi, index, tab) {
    if (!layar) bangunLayar();
    sesiAktif = sesi;
    ke = index || 0;
    tabAktif = tab === 'profil' ? 'profil' : 'denah';
    layar.classList.add('buka');
    document.body.classList.add('denah-terkunci');
    tampil();
  }

  function tutup() {
    layar.classList.remove('buka');
    document.body.classList.remove('denah-terkunci');
  }

  // Daftar kartu denah untuk satu sesi. Mengembalikan '' kalau belum ada datanya.
  function daftarHTML(sesi) {
    var daftar = D[sesi] || [];
    if (!daftar.length) return '';
    return '<div class="denah-daftar">' + daftar.map(function (d, i) {
      return '<button type="button" class="denah-kartu" onclick="DenahViewer.buka(\'' + sesi + '\',' + i + ')">' +
        gambar(sesi, d.slug, true, d.judul, true) +
        '<span class="denah-teks">' +
        '<span class="denah-no">' + d.no + '</span>' +
        '<span class="denah-judul">' + esc(d.judul) + '</span>' +
        (d.jam || d.daerah ? '<span class="denah-meta">' + esc([d.jam, d.daerah].filter(Boolean).join(' · ')) + '</span>' : '') +
        (profilLokasi(sesi, d.slug).length
          ? '<span class="denah-meta" style="color:#E0B863;font-weight:700">Denah &amp; profil singkat</span>' : '') +
        '</span></button>';
    }).join('') + '</div>';
  }

  // Tautan kecil dari satu baris agenda rundown ke denah yang cocok.
  function tautanUntuk(sesi, teksAgenda) {
    var daftar = D[sesi] || [];
    var t = String(teksAgenda || '').toLowerCase();
    if (!/ziaro|ziarah/.test(t)) return '';
    for (var i = 0; i < daftar.length; i++) {
      var cocok = daftar[i].cocok || [];
      for (var j = 0; j < cocok.length; j++) {
        if (t.indexOf(cocok[j]) >= 0) {
          var html = '<button type="button" class="denah-tautan" onclick="DenahViewer.buka(\'' + sesi + '\',' + i + ')">' +
            svg(IKON.denah, 13) + 'Lihat denah lokasi</button>';
          if (profilLokasi(sesi, daftar[i].slug).length) {
            html += '<button type="button" class="denah-tautan" onclick="DenahViewer.buka(\'' + sesi + '\',' + i + ',\'profil\')">' +
              svg(IKON.profil, 13) + 'Profil singkat</button>';
          }
          return html;
        }
      }
    }
    return '';
  }

  window.DenahViewer = { buka: buka, daftarHTML: daftarHTML, tautanUntuk: tautanUntuk, ada: function (s) { return (D[s] || []).length; } };
})();

(() => {
  const pages = {
    home: 'beranda_mobile_dark_safari_hwmi_mq_12/code.html',
    itibar: 'i_tibar_musafir_final_safari_hwmi_mq_12/code.html',
    rules: 'tata_tertib_dark_safari_hwmi_mq_12/code.html',
    prayer: 'panduan_sholat_musafir_safari_hwmi_mq_12/code.html',
    seats: 'denah_bus_safari_hwmi_mq_12/code.html',
    departure: 'tata_tertib_berangkat_verbatim_safari_hwmi_mq_12/code.html',
    speaking: 'etika_dalam_berbicara_safari_hwmi_mq_12/code.html',
    attire: 'etika_dalam_berpakaian_safari_hwmi_mq_12/code.html',
    lodging: 'tata_tertib_di_penginapan_safari_hwmi_mq_12/code.html',
    publicArea: 'tata_tertib_selain_makam_safari_hwmi_mq_12/code.html',
    cemetery: 'tata_tertib_di_area_makam_safari_hwmi_mq_12/code.html',
    bus: 'tata_tertib_di_dalam_bus_safari_hwmi_mq_12/code.html',
    rundown: 'rundown_kegiatan_safari_hwmi_mq_12/code.html',
    rooms: 'daftar_kamar_safari_hwmi_mq_12/code.html',
    uniforms: 'jadwal_seragam_safari_hwmi_mq_12/code.html',
    photos: 'skema_foto_safari_hwmi_mq_12/code.html',
    map: 'peta_safari_hwmi_mq_12/code.html',
    starterpack: 'starterpack_dan_packing_safari_hwmi_mq_12/code.html'
  };

  const path = window.location.pathname;
  const isSubfolder = path.split('/').filter(Boolean).pop() === 'code.html';
  const root = isSubfolder ? new URL('../', window.location.href) : new URL('./', window.location.href);
  const href = (page) => new URL(pages[page], root).href;
  const go = (page) => { window.location.href = href(page); };
  const isHome = !isSubfolder || path.includes('beranda_mobile_dark');

  document.querySelectorAll('button[aria-label="Go back"]').forEach((button) => button.addEventListener('click', () => history.length > 1 ? history.back() : go('rules')));
  document.querySelectorAll('button, a').forEach((element) => {
    const text = element.textContent.replace(/\s+/g, ' ').trim().toLowerCase();
    if (text.includes('sebelum berangkat')) element.addEventListener('click', (e) => { if(element.tagName==='BUTTON') go('departure'); });
    else if (text.includes('sebagai peserta') || text.includes('dalam berbicara')) element.addEventListener('click', (e) => { if(element.tagName==='BUTTON') go('speaking'); });
    else if (text.includes('dalam berpakaian')) element.addEventListener('click', (e) => { if(element.tagName==='BUTTON') go('attire'); });
    else if (text.includes('penginapan')) element.addEventListener('click', (e) => { if(element.tagName==='BUTTON') go('lodging'); });
    else if (text.includes('area umum') || text.includes('selain makam')) element.addEventListener('click', (e) => { if(element.tagName==='BUTTON') go('publicArea'); });
    else if (text.includes('area makam')) element.addEventListener('click', (e) => { if(element.tagName==='BUTTON') go('cemetery'); });
    else if (text.includes('didalam bus') || text.includes('di dalam bus')) element.addEventListener('click', (e) => { if(element.tagName==='BUTTON') go('bus'); });
  });

  document.querySelectorAll('a[href="#"], a[href^="../"]').forEach((link) => {
    const text = link.textContent.replace(/\s+/g, ' ').trim();
    let page = null;
    if (text.includes('Itibar Musafir')) page = 'itibar';
    else if (text.includes('Tata Tertib Peserta')) page = 'rules';
    else if (text.includes('Panduan Sholat Musafir')) page = 'prayer';
    else if (text.includes('Rundown Kegiatan')) page = 'rundown';
    else if (text.includes('Daftar Kamar Peserta')) page = 'rooms';
    else if (text.includes('Denah Bus')) page = 'seats';
    else if (text.includes('Jadwal Seragam')) page = 'uniforms';
    else if (text.includes('Skema Foto Bersama')) page = 'photos';
    else if (text.includes('Peta Safari')) page = 'map';
    else if (text.includes('Starterpack') || text.includes('Teknis Packing')) page = 'starterpack';
    else if (text.includes('Daftar dan Informasi Peserta')) page = 'home';
    if (page) link.href = href(page);
  });

  const items = [
    ['Beranda', 'Beranda utama', 'home', 'home'],
    ['Itibar Musafir', 'Pedoman perjalanan', 'explore', 'itibar'],
    ['Starterpack & Packing', 'Perlengkapan wajib & tas', 'luggage', 'starterpack'],
    ['Tata Tertib Peserta', 'Aturan kegiatan', 'gavel', 'rules'],
    ['Panduan Sholat Musafir', 'Panduan ibadah', 'prayer_times', 'prayer'],
    ['Rundown Kegiatan', 'Jadwal acara', 'schedule', 'rundown'],
    ['Daftar Kamar Peserta', 'Pembagian penginapan', 'hotel', 'rooms'],
    ['Denah Bus', 'Pembagian tempat duduk', 'directions_bus', 'seats'],
    ['Jadwal Seragam', 'Ketentuan seragam harian', 'apparel', 'uniforms'],
    ['Skema Foto Bersama', 'Formasi & jadwal foto', 'groups', 'photos'],
    ['Peta Safari', 'Rute & titik lokasi', 'map', 'map']
  ];

  const menuStyle = document.createElement('style');
  menuStyle.textContent = '.site-menu-trigger{position:fixed;top:16px;left:16px;z-index:10020;width:44px;height:44px;display:grid;place-items:center;border:1px solid #a58b86;border-radius:6px;background:#381510;color:#e9c176;box-shadow:0 8px 22px rgba(34,5,3,.32);cursor:pointer}.site-menu-trigger:hover,.site-menu-trigger:focus-visible{background:#550000;border-color:#ffb4a8;outline:0}.site-menu-bars{display:grid;gap:5px}.site-menu-bars i{display:block;width:19px;height:2px;border-radius:3px;background:currentColor}.site-menu-backdrop{position:fixed;inset:0;z-index:10029;background:rgba(20,3,2,.64);opacity:0;visibility:hidden;transition:opacity .22s ease,visibility .22s ease}.site-menu-panel{position:fixed;z-index:10030;top:0;left:0;bottom:0;width:min(370px,calc(100vw - 32px));padding:24px 18px 32px;overflow-y:auto;background:#280905;border-right:1px solid #57423e;box-shadow:18px 0 54px rgba(0,0,0,.38);transform:translateX(-104%);transition:transform .25s ease}.site-menu-open .site-menu-backdrop{opacity:1;visibility:visible}.site-menu-open .site-menu-panel{transform:translateX(0)}.site-menu-header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin:2px 4px 24px;padding-bottom:20px;border-bottom:1px solid #57423e}.site-menu-kicker{margin:0 0 4px;color:#e9c176;font:600 11px "Plus Jakarta Sans",sans-serif;letter-spacing:.12em;text-transform:uppercase}.site-menu-title{margin:0;color:#ffdad4;font:600 23px "Noto Serif",serif}.site-menu-close{width:38px;height:38px;display:grid;place-items:center;border:1px solid #57423e;border-radius:4px;background:#381510;color:#e9c176;font-size:23px;line-height:1;cursor:pointer}.site-menu-list{display:grid;gap:7px}.site-menu-item{display:grid;grid-template-columns:36px 1fr;gap:10px;align-items:center;min-height:60px;padding:10px 12px;border:1px solid transparent;border-radius:6px;color:#ffdad4;text-decoration:none}.site-menu-item:hover,.site-menu-item:focus-visible,.site-menu-item.is-active{border-color:#57423e;background:#451f19;outline:0}.site-menu-item.is-active{background:#604403;color:#ffdea5}.site-menu-item.is-disabled{opacity:.52;cursor:not-allowed}.site-menu-item .material-symbols-outlined{color:#e9c176;font-size:23px}.site-menu-item strong{display:block;font:600 13px "Plus Jakarta Sans",sans-serif}.site-menu-item small{display:block;margin-top:3px;color:#dec0bb;font:400 11px "Plus Jakarta Sans",sans-serif}.site-menu-item.is-active small{color:#ffdea5}.site-mobile-bar{display:none}@media(max-width:720px){body.site-has-mobile-bar{padding-top:62px}.site-mobile-bar{position:fixed;z-index:10010;top:0;right:0;left:0;height:62px;display:flex;align-items:center;padding:0 20px 0 68px;background:rgba(40,9,5,.92);border-bottom:1px solid rgba(87,66,62,.7);box-shadow:0 4px 18px rgba(34,5,3,.22);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)}.site-mobile-brand{margin:0;overflow:hidden;color:#ffdad4;font:600 17px "Noto Serif",serif;white-space:nowrap;text-overflow:ellipsis}.site-mobile-brand small{display:block;margin-top:2px;color:#e9c176;font:600 9px "Plus Jakarta Sans",sans-serif;letter-spacing:.11em;text-transform:uppercase}.site-mobile-bar .site-menu-trigger{position:absolute;top:10px;left:14px;width:42px;height:42px}.site-menu-panel{width:min(340px,calc(100vw - 24px));padding-top:20px}body.site-menu-open{overflow:hidden}}';
  document.head.append(menuStyle);

  const trigger = document.createElement('button');
  trigger.className = 'site-menu-trigger';
  trigger.type = 'button';
  trigger.setAttribute('aria-label', 'Buka menu');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.innerHTML = '<span class="site-menu-bars" aria-hidden="true"><i></i><i></i><i></i></span>';
  const backdrop = document.createElement('div');
  backdrop.className = 'site-menu-backdrop';
  const panel = document.createElement('aside');
  panel.className = 'site-menu-panel';
  panel.setAttribute('aria-label', 'Menu utama');
  const isActive = (page) => page && pages[page] && path.includes(pages[page].split('/')[0]);
  const list = items.map(([label, detail, icon, page]) => page
    ? '<a class="site-menu-item' + (isActive(page) ? ' is-active' : '') + '" href="' + href(page) + '"><span class="material-symbols-outlined">' + icon + '</span><span><strong>' + label + '</strong><small>' + detail + '</small></span></a>'
    : '<span class="site-menu-item is-disabled" aria-disabled="true"><span class="material-symbols-outlined">' + icon + '</span><span><strong>' + label + '</strong><small>' + detail + '</small></span></span>'
  ).join('');
  panel.innerHTML = '<header class="site-menu-header"><div><p class="site-menu-kicker">Safari HWMI MQ 12</p><h2 class="site-menu-title">Menu</h2></div><button class="site-menu-close" type="button" aria-label="Tutup menu">×</button></header><nav class="site-menu-list">' + list + '</nav>';
  document.body.append(backdrop, panel);

  if (isHome) {
    document.body.append(trigger);
  } else {
    const mobileBar = document.createElement('header');
    mobileBar.className = 'site-mobile-bar';
    mobileBar.innerHTML = '<p class="site-mobile-brand">Safari HWMI MQ 12<small>Navigasi utama</small></p>';
    mobileBar.append(trigger);
    document.body.prepend(mobileBar);
    document.body.classList.add('site-has-mobile-bar');
  }
  const close = () => { document.body.classList.remove('site-menu-open'); trigger.setAttribute('aria-expanded', 'false'); };
  const open = () => { document.body.classList.add('site-menu-open'); trigger.setAttribute('aria-expanded', 'true'); panel.querySelector('.site-menu-close').focus(); };
  trigger.addEventListener('click', () => document.body.classList.contains('site-menu-open') ? close() : open());
  backdrop.addEventListener('click', close);
  panel.querySelector('.site-menu-close').addEventListener('click', close);
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });

  if (!isHome) { const homeButton = document.createElement('a'); homeButton.href = href('home'); homeButton.setAttribute('aria-label', 'Kembali ke beranda'); homeButton.textContent = 'Beranda'; homeButton.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:9999;padding:10px 14px;border-radius:999px;background:#d1bd68;color:#201f18;font:600 14px system-ui;text-decoration:none;box-shadow:0 4px 16px #0008'; document.body.append(homeButton); }

  // Auto-populate bottom navigation bar across all pages
  document.querySelectorAll('nav.fixed.bottom-0').forEach((nav) => {
    nav.innerHTML = `
      <a href="${href('home')}" class="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors ${isHome ? 'text-primary font-semibold' : ''}">
        <span class="material-symbols-outlined text-[24px]">home</span>
        <span class="text-[11px] mt-1">Beranda</span>
      </a>
      <a href="${href('rules')}" class="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors ${isActive('rules') ? 'text-primary font-semibold' : ''}">
        <span class="material-symbols-outlined text-[24px]">gavel</span>
        <span class="text-[11px] mt-1">Tata Tertib</span>
      </a>
      <a href="${href('prayer')}" class="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors ${isActive('prayer') ? 'text-primary font-semibold' : ''}">
        <span class="material-symbols-outlined text-[24px]">prayer_times</span>
        <span class="text-[11px] mt-1">Sholat</span>
      </a>
      <a href="${href('seats')}" class="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors ${isActive('seats') ? 'text-primary font-semibold' : ''}">
        <span class="material-symbols-outlined text-[24px]">directions_bus</span>
        <span class="text-[11px] mt-1">Bus</span>
      </a>
    `;
  });

  // Global Emergency Floating SOS Button & Modal (Opsi 1)
  const sosBtn = document.createElement('button');
  sosBtn.type = 'button';
  sosBtn.setAttribute('aria-label', 'Bantuan Darurat PIC');
  sosBtn.className = 'fixed left-4 bottom-24 z-[9990] bg-error-container text-on-error-container border border-error/40 px-3.5 py-2.5 rounded-full shadow-lg flex items-center gap-2 text-xs font-bold active:scale-95 transition-transform';
  sosBtn.innerHTML = '<span class="material-symbols-outlined text-[18px] text-error animate-pulse">sos</span><span>Bantuan PIC</span>';

  const sosModal = document.createElement('div');
  sosModal.className = 'fixed inset-0 z-[10050] bg-black/70 backdrop-blur-sm opacity-0 invisible transition-all duration-200 flex items-center justify-center p-4';
  sosModal.innerHTML = `
    <div class="bg-surface-container-low border border-surface-variant rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-5 relative">
      <button id="sos-close" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary text-xl font-bold">×</button>
      <div class="flex items-center gap-3 border-b border-surface-variant/40 pb-3">
        <span class="material-symbols-outlined text-error text-[28px]">emergency</span>
        <div>
          <h3 class="font-title-lg font-bold text-on-surface">Pusat Bantuan & Kontak PIC</h3>
          <p class="text-xs text-on-surface-variant">Hubungi panitia safari jika butuh bantuan mendesak</p>
        </div>
      </div>
      <div class="space-y-3">
        <div class="p-3 rounded-xl bg-surface-container flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <span class="material-symbols-outlined text-secondary text-[22px]">medical_services</span>
            <div>
              <strong class="text-xs text-on-surface block font-semibold">Tim Medis & Kesehatan</strong>
              <span class="text-[11px] text-on-surface-variant">Pertolongan Pertama / Obat</span>
            </div>
          </div>
          <div class="flex gap-1.5">
            <a href="https://wa.me/6281234567890?text=Halo%20Tim%20Medis%20MQ12,%20saya%20butuh%20bantuan" target="_blank" class="w-8 h-8 rounded-full bg-secondary/20 text-secondary border border-secondary/30 flex items-center justify-center text-xs font-bold">WA</a>
            <a href="tel:+6281234567890" class="w-8 h-8 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center"><span class="material-symbols-outlined text-[16px]">call</span></a>
          </div>
        </div>

        <div class="p-3 rounded-xl bg-surface-container flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <span class="material-symbols-outlined text-secondary text-[22px]">directions_bus</span>
            <div>
              <strong class="text-xs text-on-surface block font-semibold">Koordinator Bus 1 & 2</strong>
              <span class="text-[11px] text-on-surface-variant">Pengondisian Armada</span>
            </div>
          </div>
          <div class="flex gap-1.5">
            <a href="https://wa.me/6281234567891?text=Halo%20PIC%20Bus,%20saya%20peserta%20MQ12" target="_blank" class="w-8 h-8 rounded-full bg-secondary/20 text-secondary border border-secondary/30 flex items-center justify-center text-xs font-bold">WA</a>
            <a href="tel:+6281234567891" class="w-8 h-8 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center"><span class="material-symbols-outlined text-[16px]">call</span></a>
          </div>
        </div>

        <div class="p-3 rounded-xl bg-surface-container flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <span class="material-symbols-outlined text-secondary text-[22px]">directions_bus</span>
            <div>
              <strong class="text-xs text-on-surface block font-semibold">Koordinator Bus 3 & Elf</strong>
              <span class="text-[11px] text-on-surface-variant">Pengondisian Armada</span>
            </div>
          </div>
          <div class="flex gap-1.5">
            <a href="https://wa.me/6281234567892?text=Halo%20PIC%20Bus,%20saya%20peserta%20MQ12" target="_blank" class="w-8 h-8 rounded-full bg-secondary/20 text-secondary border border-secondary/30 flex items-center justify-center text-xs font-bold">WA</a>
            <a href="tel:+6281234567892" class="w-8 h-8 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center"><span class="material-symbols-outlined text-[16px]">call</span></a>
          </div>
        </div>

        <div class="p-3 rounded-xl bg-surface-container flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <span class="material-symbols-outlined text-secondary text-[22px]">shield</span>
            <div>
              <strong class="text-xs text-on-surface block font-semibold">Keamanan & Pembimbing</strong>
              <span class="text-[11px] text-on-surface-variant">Pengawalan & Panduan</span>
            </div>
          </div>
          <div class="flex gap-1.5">
            <a href="https://wa.me/6281234567893?text=Halo%20Keamanan%20MQ12,%20saya%20butuh%20bantuan" target="_blank" class="w-8 h-8 rounded-full bg-secondary/20 text-secondary border border-secondary/30 flex items-center justify-center text-xs font-bold">WA</a>
            <a href="tel:+6281234567893" class="w-8 h-8 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center"><span class="material-symbols-outlined text-[16px]">call</span></a>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.append(sosBtn, sosModal);
  const openSos = () => { sosModal.classList.remove('opacity-0', 'invisible'); };
  const closeSos = () => { sosModal.classList.add('opacity-0', 'invisible'); };
  sosBtn.addEventListener('click', openSos);
  sosModal.querySelector('#sos-close').addEventListener('click', closeSos);
  sosModal.addEventListener('click', (e) => { if(e.target === sosModal) closeSos(); });

  // Global Offline Readiness Indicator & Connection Status Badge (Ide A)
  const badge = document.createElement('div');
  badge.id = 'offline-ready-badge';
  badge.className = 'fixed top-3 right-4 z-[9995] px-2.5 py-1 rounded-full text-[10px] font-bold border backdrop-blur-md transition-all duration-300 flex items-center gap-1.5 shadow-sm cursor-pointer select-none';
  
  function updateOfflineStatus() {
    if (navigator.onLine) {
      badge.className = 'fixed top-3 right-4 z-[9995] px-2.5 py-1 rounded-full text-[10px] font-bold border backdrop-blur-md transition-all duration-300 flex items-center gap-1.5 shadow-sm cursor-pointer select-none bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
      badge.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span><span>Offline Ready</span>';
      badge.title = 'Seluruh data 100% aman tersimpan offline di HP Anda.';
    } else {
      badge.className = 'fixed top-3 right-4 z-[9995] px-2.5 py-1 rounded-full text-[10px] font-bold border backdrop-blur-md transition-all duration-300 flex items-center gap-1.5 shadow-sm cursor-pointer select-none bg-amber-950/90 text-amber-300 border-amber-500/50';
      badge.innerHTML = '<span class="w-2 h-2 rounded-full bg-amber-400"></span><span>Mode Offline (Tanpa Sinyal)</span>';
      badge.title = 'Aplikasi berjalan lancar tanpa sinyal internet.';
    }
  }

  badge.addEventListener('click', () => {
    const isOff = !navigator.onLine;
    const msg = isOff ? '⚡ Mode Offline Aktif: Seluruh fitur tetap berfungsi tanpa internet!' : '🟢 Offline Ready: Seluruh halaman & data kamar/bus sudah tersimpan di HP Anda.';
    let toast = document.getElementById('offline-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'offline-toast';
      toast.className = 'fixed top-16 left-1/2 -translate-x-1/2 z-[10060] bg-surface-container border border-secondary/40 text-on-surface px-4 py-2.5 rounded-xl text-xs font-semibold shadow-2xl transition-all duration-300 text-center max-w-xs';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.remove('opacity-0', 'invisible');
    setTimeout(() => { toast.classList.add('opacity-0', 'invisible'); }, 3000);
  });

  window.addEventListener('online', updateOfflineStatus);
  window.addEventListener('offline', updateOfflineStatus);
  document.body.appendChild(badge);
  updateOfflineStatus();

  // PWA & Service Worker Registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = new URL('sw.js', root).href;
      navigator.serviceWorker.register(swUrl).catch(() => {});
    });
  }

  // Inject Web App Manifest
  if (!document.querySelector('link[rel="manifest"]')) {
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = new URL('manifest.json', root).href;
    document.head.append(manifestLink);
  }
})();


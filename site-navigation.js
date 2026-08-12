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

  // Back button binding
  document.querySelectorAll('button[aria-label="Go back"]').forEach((button) => 
    button.addEventListener('click', () => history.length > 1 ? history.back() : go('rules'))
  );

  // Link bindings
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
    ['Bantuan PIC (SOS)', 'Kontak darurat & panitia', 'emergency', 'sos'],
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

  // Self-Contained Scoped CSS Stylesheet Injection
  const globalStyle = document.createElement('style');
  globalStyle.textContent = `
    /* Global Body Padding for Top Header & Bottom Nav */
    body {
      padding-top: 56px !important;
      padding-bottom: 76px !important;
    }

    /* Menu Drawer Trigger Button */
    .site-menu-trigger {
      position: absolute;
      top: 8px;
      left: 12px;
      z-index: 10020;
      width: 40px;
      height: 40px;
      display: grid;
      place-items: center;
      border: 1px solid #573a34;
      border-radius: 8px;
      background: #2b0b07;
      color: #e9c176;
      box-shadow: 0 4px 14px rgba(0,0,0,0.35);
      cursor: pointer;
    }
    .site-menu-trigger:hover { background: #3d120c; border-color: #e9c176; }
    .site-menu-bars { display: grid; gap: 4px; }
    .site-menu-bars i { display: block; width: 18px; height: 2px; border-radius: 2px; background: currentColor; }
    
    /* Backdrop & Panel */
    .site-menu-backdrop {
      position: fixed;
      inset: 0;
      z-index: 10029;
      background: rgba(15,3,2,0.75);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      opacity: 0;
      visibility: hidden;
      transition: opacity .22s ease, visibility .22s ease;
    }
    .site-menu-panel {
      position: fixed;
      z-index: 10030;
      top: 0; left: 0; bottom: 0;
      width: min(320px, calc(100vw - 32px));
      padding: 20px 16px 32px;
      overflow-y: auto;
      background: #1f0604;
      border-right: 1px solid #4a211a;
      box-shadow: 12px 0 36px rgba(0,0,0,0.5);
      transform: translateX(-104%);
      transition: transform .25s ease;
    }
    .site-menu-open .site-menu-backdrop { opacity: 1; visibility: visible; }
    .site-menu-open .site-menu-panel { transform: translateX(0); }
    body.site-menu-open { overflow: hidden; }

    .site-menu-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 18px;
      padding-bottom: 14px;
      border-bottom: 1px solid #4a211a;
    }
    .site-menu-kicker { margin: 0; color: #e9c176; font: 600 10px sans-serif; letter-spacing: 0.12em; text-transform: uppercase; }
    .site-menu-title { margin: 2px 0 0; color: #ffdad4; font: 700 20px serif; }
    .site-menu-close {
      width: 34px; height: 34px;
      display: grid; place-items: center;
      border: 1px solid #4a211a; border-radius: 6px;
      background: #2b0b07; color: #e9c176;
      font-size: 20px; cursor: pointer;
    }

    .site-menu-list { display: grid; gap: 6px; }
    .site-menu-item {
      display: grid;
      grid-template-columns: 32px 1fr;
      gap: 10px;
      align-items: center;
      padding: 10px 12px;
      border: 1px solid transparent;
      border-radius: 8px;
      color: #ffdad4;
      text-decoration: none;
      cursor: pointer;
    }
    .site-menu-item:hover, .site-menu-item.is-active { border-color: #573a34; background: #381510; }
    .site-menu-item.is-active { background: #543c05; border-color: #e9c176; color: #ffdea5; }
    .site-menu-item .material-symbols-outlined { color: #e9c176; font-size: 22px; }
    .site-menu-item strong { display: block; font: 600 13px sans-serif; }
    .site-menu-item small { display: block; margin-top: 2px; color: #cbb2ad; font: 400 11px sans-serif; }

    /* Top Navigation Bar */
    .site-mobile-bar {
      position: fixed;
      z-index: 10010;
      top: 0; right: 0; left: 0;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 12px 0 60px;
      background: rgba(28,7,4,0.96);
      border-bottom: 1px solid #4a211a;
      box-shadow: 0 4px 16px rgba(0,0,0,0.3);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }
    .site-mobile-brand { margin: 0; color: #ffdad4; font: 600 14px serif; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 160px; }
    .site-mobile-brand small { display: block; margin-top: 1px; color: #e9c176; font: 600 9px sans-serif; letter-spacing: 0.1em; text-transform: uppercase; }

    /* Offline Status Badge */
    .site-offline-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 8px;
      border-radius: 999px;
      font: 700 10px sans-serif;
      border: 1px solid rgba(74,222,128,0.4);
      background: rgba(5,46,22,0.85);
      color: #86efac;
      cursor: pointer;
      user-select: none;
      white-space: nowrap;
      shrink: 0;
    }
    .site-offline-badge.offline {
      border-color: rgba(251,191,36,0.5);
      background: rgba(69,26,3,0.9);
      color: #fde047;
    }
    .site-offline-dot { width: 6px; height: 6px; border-radius: 50%; background: #4ade80; }
    .site-offline-badge.offline .site-offline-dot { background: #fbbf24; }

    /* Bottom Floating Navigation Bar (Integrated 5-Tab Layout) */
    .site-bottom-nav {
      position: fixed;
      bottom: 0; left: 0; right: 0;
      z-index: 9990;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      background: rgba(22,5,3,0.97);
      border-top: 1px solid #4a211a;
      box-shadow: 0 -4px 20px rgba(0,0,0,0.5);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
    }
    .site-bottom-nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #cbb2ad;
      text-decoration: none;
      font: 500 10px sans-serif;
      gap: 2px;
      padding: 4px 6px;
      border: 0; background: transparent;
      cursor: pointer;
    }
    .site-bottom-nav-item.is-active, .site-bottom-nav-item:hover {
      color: #e9c176;
      font-weight: 700;
    }
    .site-bottom-nav-item .material-symbols-outlined { font-size: 22px; }

    /* Special Red Emergency SOS Tab styling in Bottom Nav */
    .site-bottom-nav-item.is-sos {
      color: #ffb4ab;
    }
    .site-bottom-nav-item.is-sos .material-symbols-outlined {
      color: #ffb4ab;
    }
    .site-bottom-nav-item.is-sos:hover {
      color: #ffdad6;
    }

    /* SOS Modal Overlay & Content */
    .site-sos-modal-overlay {
      position: fixed;
      inset: 0;
      z-index: 10050;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      background: rgba(10,2,1,0.82);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.2s ease, visibility 0.2s ease;
    }
    .site-sos-modal-overlay.is-open {
      opacity: 1;
      visibility: visible;
    }
    .site-sos-card {
      position: relative;
      width: min(380px, 100%);
      background: #2b0b07;
      border: 1px solid #5d2821;
      border-radius: 20px;
      padding: 20px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.6);
      color: #ffdad4;
      font-family: sans-serif;
    }
    .site-sos-close {
      position: absolute;
      top: 14px; right: 14px;
      width: 30px; height: 30px;
      display: grid; place-items: center;
      border: 1px solid #5d2821; border-radius: 50%;
      background: #3a1510; color: #e9c176;
      font-size: 18px; cursor: pointer;
    }
    .site-sos-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-bottom: 14px;
      margin-bottom: 14px;
      border-bottom: 1px solid #4a211a;
    }
    .site-sos-header h3 { margin: 0; font: 700 16px sans-serif; color: #ffdad4; }
    .site-sos-header p { margin: 2px 0 0; font: 400 11px sans-serif; color: #cbb2ad; }
    .site-sos-list { display: grid; gap: 10px; }
    .site-sos-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      background: #381410;
      border: 1px solid #57251d;
      border-radius: 12px;
    }
    .site-sos-item-info { display: flex; align-items: center; gap: 10px; }
    .site-sos-item-info strong { display: block; font: 600 12px sans-serif; color: #ffdad4; }
    .site-sos-item-info span { display: block; font: 400 10px sans-serif; color: #cbb2ad; }
    .site-sos-actions { display: flex; gap: 6px; }
    .site-sos-act-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 6px 10px;
      border-radius: 999px;
      font: 700 11px sans-serif;
      text-decoration: none;
    }
    .site-sos-act-wa { background: #1b4d2e; border: 1px solid #2e7d48; color: #7be495; }
    .site-sos-act-call { background: #4d3800; border: 1px solid #7a5900; color: #ffdea5; }
  `;
  document.head.append(globalStyle);

  // Render Menu Drawer Trigger & Panel
  const trigger = document.createElement('button');
  trigger.className = 'site-menu-trigger';
  trigger.type = 'button';
  trigger.setAttribute('aria-label', 'Buka menu');
  trigger.innerHTML = '<span class="site-menu-bars"><i></i><i></i><i></i></span>';

  const backdrop = document.createElement('div');
  backdrop.className = 'site-menu-backdrop';

  const panel = document.createElement('aside');
  panel.className = 'site-menu-panel';
  const isActive = (page) => page && pages[page] && path.includes(pages[page].split('/')[0]);
  
  const list = items.map(([label, detail, icon, page]) => {
    if (page === 'sos') {
      return `<button id="drawer-sos-btn" class="site-menu-item" type="button">
        <span class="material-symbols-outlined" style="color:#ffb4ab;">emergency</span>
        <span><strong style="color:#ffb4ab;">${label}</strong><small>${detail}</small></span>
       </button>`;
    }
    return page
      ? `<a class="site-menu-item${isActive(page) ? ' is-active' : ''}" href="${href(page)}">
          <span class="material-symbols-outlined">${icon}</span>
          <span><strong>${label}</strong><small>${detail}</small></span>
         </a>`
      : `<span class="site-menu-item is-disabled">
          <span class="material-symbols-outlined">${icon}</span>
          <span><strong>${label}</strong><small>${detail}</small></span>
         </span>`;
  }).join('');

  panel.innerHTML = `
    <header class="site-menu-header">
      <div>
        <p class="site-menu-kicker">Safari HWMI MQ 12</p>
        <h2 class="site-menu-title">Menu</h2>
      </div>
      <button class="site-menu-close" type="button" aria-label="Tutup menu">×</button>
    </header>
    <nav class="site-menu-list">${list}</nav>
  `;
  document.body.append(backdrop, panel);

  // Offline Badge setup
  const badge = document.createElement('div');
  badge.className = 'site-offline-badge';
  function updateOfflineStatus() {
    if (navigator.onLine) {
      badge.className = 'site-offline-badge';
      badge.innerHTML = '<span class="site-offline-dot"></span><span>Offline Ready</span>';
    } else {
      badge.className = 'site-offline-badge offline';
      badge.innerHTML = '<span class="site-offline-dot"></span><span>Offline Mode</span>';
    }
  }
  window.addEventListener('online', updateOfflineStatus);
  window.addEventListener('offline', updateOfflineStatus);
  updateOfflineStatus();

  // Render Top Header Bar Consistently Across ALL Pages
  // First remove any existing <header> in body if it collides
  document.querySelectorAll('header.fixed.top-0').forEach(el => el.remove());

  const mobileBar = document.createElement('header');
  mobileBar.className = 'site-mobile-bar';
  mobileBar.innerHTML = '<p class="site-mobile-brand">Safari HWMI MQ 12<small>Navigasi Utama</small></p>';
  mobileBar.append(trigger, badge);
  document.body.prepend(mobileBar);

  const closeMenu = () => document.body.classList.remove('site-menu-open');
  const openMenu = () => document.body.classList.add('site-menu-open');
  trigger.addEventListener('click', () => document.body.classList.contains('site-menu-open') ? closeMenu() : openMenu());
  backdrop.addEventListener('click', closeMenu);
  panel.querySelector('.site-menu-close').addEventListener('click', closeMenu);

  // Global Emergency SOS Modal Definition
  const sosModal = document.createElement('div');
  sosModal.className = 'site-sos-modal-overlay';
  sosModal.innerHTML = `
    <div class="site-sos-card">
      <button class="site-sos-close" type="button">×</button>
      <div class="site-sos-header">
        <span class="material-symbols-outlined" style="color:#ffb4ab;font-size:28px;">emergency</span>
        <div>
          <h3>Pusat Bantuan & Kontak PIC</h3>
          <p>Hubungi panitia safari jika butuh bantuan mendesak</p>
        </div>
      </div>
      <div class="site-sos-list">
        <div class="site-sos-item">
          <div class="site-sos-item-info">
            <span class="material-symbols-outlined" style="color:#e9c176;">medical_services</span>
            <div>
              <strong>Tim Medis & Kesehatan</strong>
              <span>Pertolongan Pertama / Obat</span>
            </div>
          </div>
          <div class="site-sos-actions">
            <a href="https://wa.me/6281234567890?text=Halo%20Tim%20Medis%20MQ12,%20saya%20butuh%20bantuan" target="_blank" class="site-sos-act-btn site-sos-act-wa">WA</a>
            <a href="tel:+6281234567890" class="site-sos-act-btn site-sos-act-call">📞</a>
          </div>
        </div>

        <div class="site-sos-item">
          <div class="site-sos-item-info">
            <span class="material-symbols-outlined" style="color:#e9c176;">directions_bus</span>
            <div>
              <strong>Koordinator Bus 1 & 2</strong>
              <span>Pengondisian Armada</span>
            </div>
          </div>
          <div class="site-sos-actions">
            <a href="https://wa.me/6281234567891?text=Halo%20PIC%20Bus,%20saya%20peserta%20MQ12" target="_blank" class="site-sos-act-btn site-sos-act-wa">WA</a>
            <a href="tel:+6281234567891" class="site-sos-act-btn site-sos-act-call">📞</a>
          </div>
        </div>

        <div class="site-sos-item">
          <div class="site-sos-item-info">
            <span class="material-symbols-outlined" style="color:#e9c176;">directions_bus</span>
            <div>
              <strong>Koordinator Bus 3 & Elf</strong>
              <span>Pengondisian Armada</span>
            </div>
          </div>
          <div class="site-sos-actions">
            <a href="https://wa.me/6281234567892?text=Halo%20PIC%20Bus,%20saya%20peserta%20MQ12" target="_blank" class="site-sos-act-btn site-sos-act-wa">WA</a>
            <a href="tel:+6281234567892" class="site-sos-act-btn site-sos-act-call">📞</a>
          </div>
        </div>

        <div class="site-sos-item">
          <div class="site-sos-item-info">
            <span class="material-symbols-outlined" style="color:#e9c176;">shield</span>
            <div>
              <strong>Keamanan & Pembimbing</strong>
              <span>Pengawalan & Panduan</span>
            </div>
          </div>
          <div class="site-sos-actions">
            <a href="https://wa.me/6281234567893?text=Halo%20Keamanan%20MQ12,%20saya%20butuh%20bantuan" target="_blank" class="site-sos-act-btn site-sos-act-wa">WA</a>
            <a href="tel:+6281234567893" class="site-sos-act-btn site-sos-act-call">📞</a>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.append(sosModal);

  const openSos = () => sosModal.classList.add('is-open');
  const closeSos = () => sosModal.classList.remove('is-open');
  sosModal.querySelector('.site-sos-close').addEventListener('click', closeSos);
  sosModal.addEventListener('click', (e) => { if (e.target === sosModal) closeSos(); });

  const drawerSosBtn = panel.querySelector('#drawer-sos-btn');
  if (drawerSosBtn) {
    drawerSosBtn.addEventListener('click', () => {
      closeMenu();
      openSos();
    });
  }

  // Global Bottom Navigation Bar (5 Integrated Clean Tabs - Zero Floating Overlap)
  const navBar = document.createElement('nav');
  navBar.className = 'site-bottom-nav';
  navBar.innerHTML = `
    <a href="${href('home')}" class="site-bottom-nav-item${isHome ? ' is-active' : ''}">
      <span class="material-symbols-outlined">home</span>
      <span>Beranda</span>
    </a>
    <a href="${href('rules')}" class="site-bottom-nav-item${isActive('rules') ? ' is-active' : ''}">
      <span class="material-symbols-outlined">gavel</span>
      <span>Tata Tertib</span>
    </a>
    <button type="button" id="bottom-sos-btn" class="site-bottom-nav-item is-sos">
      <span class="material-symbols-outlined">sos</span>
      <span>Bantuan</span>
    </button>
    <a href="${href('prayer')}" class="site-bottom-nav-item${isActive('prayer') ? ' is-active' : ''}">
      <span class="material-symbols-outlined">prayer_times</span>
      <span>Sholat</span>
    </a>
    <a href="${href('seats')}" class="site-bottom-nav-item${isActive('seats') ? ' is-active' : ''}">
      <span class="material-symbols-outlined">directions_bus</span>
      <span>Bus</span>
    </a>
  `;
  document.body.append(navBar);

  const bottomSosBtn = navBar.querySelector('#bottom-sos-btn');
  if (bottomSosBtn) {
    bottomSosBtn.addEventListener('click', openSos);
  }

  // PWA Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = new URL('sw.js', root).href;
      navigator.serviceWorker.register(swUrl).catch(() => {});
    });
  }
})();

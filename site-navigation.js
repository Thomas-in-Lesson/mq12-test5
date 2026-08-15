(() => {
  const pages = {
    home: 'beranda_mobile_dark_safari_hwmi_mq_12/code.html',
    itibar: 'i_tibar_musafir_final_safari_hwmi_mq_12/code.html',
    rules: 'tata_tertib_dark_safari_hwmi_mq_12/code.html',
    prayer: 'panduan_sholat_musafir_safari_hwmi_mq_12/code.html',
    seats: 'denah_bus_safari_hwmi_mq_12/code.html',
    seatsSesi1: 'denah_tempat_duduk_elf_safari_hwmi_mq_12/code.html',
    seatsSesi2: 'denah_bus_sesi_2_safari_hwmi_mq_12/code.html',
    seatsSesi3: 'denah_bus_sesi_3_safari_hwmi_mq_12/code.html',
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
    starterpack: 'starterpack_dan_packing_safari_hwmi_mq_12/code.html',
    participants: 'informasi_peserta_safari_hwmi_mq_12/code.html',
    emergency: 'darurat.html'
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

  // Penulisan ulang tautan berbasis teks sudah dihapus: seluruh href="../..." di
  // halaman memang sudah menunjuk berkas yang benar, jadi kode itu hanya menimpa
  // tautan dengan alamat yang sama persis.

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

  // Self-Contained Responsive Scoped CSS
  const globalStyle = document.createElement('style');
  globalStyle.textContent = `
    .site-menu-bars { display: grid; gap: 4px; }
    .site-menu-bars i { display: block; width: 18px; height: 2px; border-radius: 2px; background: #E0B863 !important; }
    
    .site-menu-backdrop {
      position: fixed;
      inset: 0;
      z-index: 10029;
      background: rgba(13,3,3,0.85);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      opacity: 0;
      visibility: hidden;
      pointer-events: none !important;
      transition: opacity .22s ease, visibility .22s ease;
    }
    .site-menu-panel {
      position: fixed;
      z-index: 10030;
      top: 0; left: 0; bottom: 0;
      width: min(340px, calc(100vw - 32px));
      padding: 20px 16px 32px;
      overflow-y: auto;
      background: linear-gradient(180deg, #2D0808 0%, #150303 100%) !important;
      border-right: 1px solid rgba(224, 184, 99, 0.3) !important;
      box-shadow: 12px 0 36px rgba(0,0,0,0.85) !important;
      transform: translateX(-104%);
      transition: transform .25s ease;
    }
    .site-menu-open .site-menu-backdrop { opacity: 1; visibility: visible; pointer-events: auto !important; }
    .site-menu-open .site-menu-panel { transform: translateX(0); }
    body.site-menu-open { overflow: hidden; }

    .site-menu-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 18px;
      padding-bottom: 14px;
      border-bottom: 1px solid rgba(224, 184, 99, 0.25) !important;
    }
    .site-menu-title { margin: 0; color: #FFFFFF !important; font: 700 20px "Noto Serif", serif !important; }
    .site-menu-close {
      width: 34px; height: 34px;
      display: grid; place-items: center;
      border: 1px solid rgba(224, 184, 99, 0.4) !important; border-radius: 6px;
      background: rgba(56, 21, 16, 0.8) !important; color: #E0B863 !important;
      font-size: 20px; cursor: pointer;
    }

    .site-menu-list { display: grid; gap: 8px; }
    .site-menu-item {
      display: grid;
      grid-template-columns: 32px 1fr;
      gap: 10px;
      align-items: center;
      padding: 11px 13px;
      border: 1px solid rgba(224, 184, 99, 0.2) !important;
      border-radius: 10px;
      background: rgba(56, 21, 16, 0.6) !important;
      color: #FFFFFF !important;
      text-decoration: none;
      cursor: pointer;
      transition: background 0.15s ease, border-color 0.15s ease;
    }
    .site-menu-item:hover { border-color: #E0B863 !important; background: rgba(85, 0, 0, 0.6) !important; }
    .site-menu-item.is-active {
      background: linear-gradient(135deg, #C21A03 0%, #900B0B 100%) !important;
      border-color: #FFFFFF !important;
      color: #FFFFFF !important;
      box-shadow: 0 4px 14px rgba(194, 26, 3, 0.5) !important;
    }
    .site-menu-item .material-symbols-outlined { color: #E0B863 !important; font-size: 22px !important; }
    .site-menu-item.is-active .material-symbols-outlined { color: #FFFFFF !important; }
    .site-menu-item strong { display: block; color: #FFFFFF !important; font: 700 13px "Plus Jakarta Sans", sans-serif !important; }
    .site-menu-item small { display: block; margin-top: 2px; color: #DEC0BB !important; font: 500 11px "Plus Jakarta Sans", sans-serif !important; }
    .site-menu-item.is-active small { color: #FFDAD4 !important; }

    /* Compact Bullet SOS FAB Button (High Contrast White Text) */
    .site-sos-bullet {
      will-change: transform;
      transform: translateZ(0);
      position: fixed;
      z-index: 9985;
      border-radius: 50%;
      background: linear-gradient(135deg, #C21A03, #800000);
      border: 1.5px solid #FFDAD4;
      color: #FFFFFF !important;
      display: grid;
      place-items: center;
      box-shadow: 0 6px 20px rgba(194, 26, 3, 0.6);
      cursor: pointer;
      transition: transform 0.15s ease;
    }
    .site-sos-bullet:active { transform: scale(0.9); }
    .site-sos-bullet, .site-sos-bullet *, .site-sos-bullet span, .site-sos-bullet strong {
      color: #FFFFFF !important;
    }

    /* SOS Modal Overlay & Content (P1-3 Accessibility Enabled) */
    .site-sos-modal-overlay {
      position: fixed;
      inset: 0;
      z-index: 10050;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      background: rgba(13,3,3,0.88);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      opacity: 0;
      visibility: hidden;
      pointer-events: none !important;
      transition: opacity 0.2s ease, visibility 0.2s ease;
    }
    .site-sos-modal-overlay.is-open {
      opacity: 1;
      visibility: visible;
      pointer-events: auto !important;
    }
    .site-sos-card {
      position: relative;
      width: min(420px, 100%);
      max-height: 85vh;
      display: flex;
      flex-direction: column;
      background: #250707 !important;
      border: 1.5px solid #E0B863 !important;
      border-radius: 20px;
      padding: 20px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.95);
      color: #FFFFFF !important;
      font-family: -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif;
    }
    .site-sos-close {
      position: absolute;
      top: 14px; right: 14px;
      width: 32px; height: 32px;
      display: grid; place-items: center;
      border: 1px solid rgba(224, 184, 99, 0.5) !important; border-radius: 50%;
      background: rgba(60, 15, 15, 0.9) !important; color: #E0B863 !important;
      font-size: 20px; cursor: pointer;
    }
    .site-sos-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-bottom: 14px;
      margin-bottom: 12px;
      border-bottom: 1px solid rgba(224, 184, 99, 0.3) !important;
      shrink: 0;
    }
    .site-sos-header h3 { margin: 0; font: 700 16px sans-serif; color: #FFFFFF !important; }
    .site-sos-header p { margin: 2px 0 0; font: 400 11px sans-serif; color: #E0B863 !important; }

    .site-sos-tabs {
      display: flex;
      gap: 6px;
      margin-bottom: 12px;
      shrink: 0;
    }
    .site-sos-tab-btn {
      flex: 1;
      padding: 8px 12px;
      border-radius: 10px;
      border: 1px solid rgba(224, 184, 99, 0.4) !important;
      background: rgba(42, 10, 10, 0.8) !important;
      color: #E0B863 !important;
      font: 700 12px sans-serif;
      cursor: pointer;
      text-align: center;
    }
    .site-sos-tab-btn.is-active {
      background: #E0B863 !important;
      border-color: #E0B863 !important;
      color: #1A0505 !important;
    }

    .site-sos-list {
      display: grid;
      gap: 8px;
      overflow-y: auto;
      padding-right: 4px;
      flex: 1;
    }
    .site-sos-section-title {
      font: 700 12px sans-serif;
      color: #E0B863 !important;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-top: 8px;
      margin-bottom: 4px;
    }
    .site-sos-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      background: rgba(42, 10, 10, 0.8) !important;
      border: 1px solid rgba(224, 184, 99, 0.3) !important;
      border-radius: 12px;
    }
    .site-sos-item-info { display: flex; align-items: center; gap: 8px; }
    .site-sos-item-info strong { display: block; font: 700 13px -apple-system, BlinkMacSystemFont, sans-serif !important; color: #FFFFFF !important; }
    .site-sos-item-info span { display: block; font: 500 11px -apple-system, BlinkMacSystemFont, sans-serif !important; color: #E0B863 !important; }
    .site-sos-actions { display: flex; gap: 6px; shrink: 0; }
    .site-sos-act-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 6px 11px;
      border-radius: 999px;
      font: 700 11px sans-serif;
      text-decoration: none;
    }
    .site-sos-act-wa { background: #1b4d2e; border: 1px solid #2e7d48; color: #7be495 !important; }
    .site-sos-act-call { background: #4d3800; border: 1px solid #7a5900; color: #E0B863 !important; }

    /* Top Navigation Bar Base */
    .site-mobile-bar {
      position: fixed;
      z-index: 10010;
      top: 0; right: 0; left: 0;
      height: calc(var(--bar-top, 56px) + env(safe-area-inset-top, 0px)) !important;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #2A0A0A !important;
      border-bottom: 1px solid rgba(224, 184, 99, 0.3) !important;
    }

    /* True 50% Absolute Center Alignment for Sacred Text */
    .site-header-center-title {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      pointer-events: none !important;
      max-width: calc(100vw - 56px);
      width: max-content;
    }
    .site-header-center-title span {
      display: block;
      color: #F8E088 !important;
      font-family: -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      white-space: nowrap !important;
      font-size: clamp(7.5px, 2.3vw, 11.5px) !important;
      letter-spacing: 0em !important;
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.9), 0 0 10px rgba(248, 224, 136, 0.35) !important;
    }
    @media (max-width: 380px) {
      .site-header-center-title span {
        font-size: clamp(7px, 2.2vw, 9.5px) !important;
        letter-spacing: -0.01em !important;
      }
    }

    /* Sleek Glowing Lamp Symbol Badge Button */
    .site-offline-badge {
      position: absolute;
      z-index: 10020;
      width: 36px;
      height: 36px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      border: 1.5px solid rgba(74,222,128,0.5);
      background: rgba(5,46,22,0.9);
      color: #4ade80;
      box-shadow: 0 0 12px rgba(74,222,128,0.4);
      cursor: pointer;
      user-select: none;
      transition: transform 0.15s ease, box-shadow 0.2s ease;
    }
    .site-offline-badge:active { transform: scale(0.92); }
    .site-offline-badge.offline {
      border-color: rgba(251,191,36,0.6);
      background: rgba(69,26,3,0.95);
      color: #fbbf24;
      box-shadow: 0 0 12px rgba(251,191,36,0.4);
    }
    .site-offline-badge .material-symbols-outlined {
      font-size: 20px;
      filter: drop-shadow(0 0 4px currentColor);
    }

    /* Toast Notification */
    .site-toast {
      position: fixed;
      top: 64px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10060;
      background: var(--c-surface-container);
      border: 1px solid var(--c-primary);
      color: var(--c-on-surface);
      padding: 10px 18px;
      border-radius: 14px;
      font: 600 12px sans-serif;
      box-shadow: 0 10px 30px rgba(0,0,0,0.7);
      opacity: 0;
      visibility: hidden;
      pointer-events: none !important;
      transition: opacity 0.2s ease, visibility 0.2s ease;
      white-space: nowrap;
      text-align: center;
    }
    .site-toast.is-show {
      opacity: 1;
      visibility: visible;
    }

    /* Focus Mode Overlay for Name Typing */
    .personal-typing-backdrop {
      position: fixed;
      inset: 0;
      z-index: 9990;
      background: rgba(13, 3, 3, 0.75);
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transition: opacity 0.2s ease, visibility 0.2s ease;
    }
    body.is-typing-name .personal-typing-backdrop {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
    }
    body.is-typing-name #personal-card-box {
      position: relative !important;
      z-index: 10000 !important;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.95), 0 0 30px rgba(224, 184, 99, 0.4) !important;
    }

    /* Strict Autocomplete dropdown (ELEVATED Z-INDEX & HIGH CONTRAST) */
    .personal-autocomplete-box {
      position: absolute !important;
      left: 0 !important; right: 0 !important; top: 100% !important;
      margin-top: 8px !important;
      z-index: 10005 !important;
      background: #1F0505 !important;
      border: 1.5px solid #E0B863 !important;
      border-radius: 16px !important;
      max-height: 260px !important;
      overflow-y: auto !important;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.95) !important;
      display: none;
    }
    .personal-autocomplete-box.is-open { display: block !important; }
    .personal-autocomplete-item {
      padding: 12px 16px !important;
      border-bottom: 1px solid rgba(224, 184, 99, 0.2) !important;
      cursor: pointer !important;
      color: #FFFFFF !important;
      font-size: 14px !important;
      font-weight: 700 !important;
      background: transparent !important;
      transition: background 0.15s ease, color 0.15s ease !important;
    }
    .personal-autocomplete-item:last-child { border-bottom: none !important; }
    .personal-autocomplete-item:hover, .personal-autocomplete-item:active {
      background: rgba(224, 184, 99, 0.3) !important;
      color: #E0B863 !important;
    }

    /* ========================================================= */
    /* MOBILE DEVICE STYLES (screen width <= 768px)              */
    /* ========================================================= */
    @media (max-width: 768px) {
      body {
        padding-top: 56px !important;
        padding-bottom: calc(76px + env(safe-area-inset-bottom, 0px)) !important;
      }

      .site-mobile-bar {
        height: 56px;
        padding: 0 10px;
      }

      .site-menu-trigger {
        position: absolute;
        top: 8px;
        left: 10px;
        z-index: 10020;
        width: 40px;
        height: 40px;
        display: grid;
        place-items: center;
        border: 1.5px solid #E0B863 !important;
        border-radius: 8px;
        background: rgba(56, 21, 16, 0.85) !important;
        color: #E0B863 !important;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4) !important;
        cursor: pointer;
      }

      .site-header-center-title {
        max-width: calc(100vw - 110px);
      }

      .site-header-center-title span {
        font-size: 12px !important;
        letter-spacing: 0.03em;
      }

      .site-offline-badge {
        top: 10px;
        right: 10px;
      }

      

      
      
      

      .site-sos-bullet {
        bottom: calc(74px + env(safe-area-inset-bottom, 0px));
        right: 14px;
        width: 42px;
        height: 42px;
      }
      .site-sos-bullet .material-symbols-outlined { font-size: 20px; }
    }

    /* ========================================================= */
    /* LAPTOP & DESKTOP STYLES (screen width > 768px)            */
    /* ========================================================= */
    @media (min-width: 769px) {
      body {
        padding-top: 104px !important;
        padding-bottom: 0 !important;
      }

      /* Di desktop bilah yang sama dipindah ke atas, menempel di bawah header,
         supaya navigasi cepat tidak hilang begitu bilah bawah disembunyikan. */
      

      
      
      

      .site-mobile-bar {
        height: 60px;
        padding: 0 16px;
      }

      .site-menu-trigger {
        position: absolute;
        top: 10px;
        left: 16px;
        z-index: 10020;
        width: 40px;
        height: 40px;
        display: grid;
        place-items: center;
        border: 1.5px solid #E0B863 !important;
        border-radius: 8px;
        background: rgba(56, 21, 16, 0.85) !important;
        color: #E0B863 !important;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4) !important;
        cursor: pointer;
      }

      .site-header-center-title {
        max-width: calc(100vw - 200px);
      }

      .site-header-center-title span {
        font-size: 13px;
        letter-spacing: 0.12em;
      }

      .site-offline-badge {
        top: 12px;
        right: 16px;
      }

      .site-sos-bullet {
        bottom: 28px;
        right: 28px;
        width: 48px;
        height: 48px;
      }
      .site-sos-bullet .material-symbols-outlined { font-size: 24px; }
    }

    
    /* Mobile Bottom Navigation */
    @media (max-width: 768px) {
      .site-bottom-nav {
        position: fixed !important;
        bottom: 0 !important;
        top: auto !important;
        left: 0 !important;
        right: 0 !important;
        z-index: 9990 !important;
        height: calc(64px + env(safe-area-inset-bottom, 0px)) !important;
        padding-bottom: env(safe-area-inset-bottom, 0px) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-around !important;
        background: linear-gradient(180deg, #3A0C0C 0%, #200505 100%) !important;
        border-top: 2px solid #E0B863 !important;
        border-bottom: 0 !important;
        box-shadow: 0 -8px 28px rgba(0, 0, 0, 0.7) !important;
        will-change: transform;
        transform: translateZ(0);
      }

      .site-bottom-nav-item {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        color: #FFFFFF !important;
        text-decoration: none !important;
        font: 600 11px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif !important;
        gap: 2px;
        padding: 5px 12px !important;
        border-radius: 12px !important;
        border: 1px solid transparent !important;
        background: transparent !important;
        transition: transform 0.15s ease, opacity 0.15s ease !important;
      }
    }

    /* Desktop Top Navigation Bar (Under Header) */
    @media (min-width: 769px) {
      body {
        padding-top: 108px !important;
        padding-bottom: 0 !important;
      }

      .site-bottom-nav {
        position: fixed !important;
        top: 60px !important;
        bottom: auto !important;
        left: 0 !important;
        right: 0 !important;
        z-index: 9990 !important;
        height: 46px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 12px !important;
        background: linear-gradient(180deg, #3A0C0C 0%, #200505 100%) !important;
        border-top: 0 !important;
        border-bottom: 2px solid #E0B863 !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5) !important;
        will-change: transform;
        transform: translateZ(0);
      }

      .site-bottom-nav-item {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        gap: 8px !important;
        padding: 6px 16px !important;
        border-radius: 10px !important;
        color: #FFFFFF !important;
        text-decoration: none !important;
        font: 600 13px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif !important;
        border: 1px solid transparent !important;
        background: transparent !important;
        transition: transform 0.15s ease, opacity 0.15s ease !important;
      }
    }

    /* Common Active & Icon Styles (Mobile & Desktop) */
    .site-bottom-nav-item .material-symbols-outlined {
      font-size: 22px !important;
      color: #E0B863 !important;
      transition: transform 0.2s ease, color 0.2s ease !important;
    }

    .site-bottom-nav-item.is-active {
      color: #FFFFFF !important;
      font-weight: 700 !important;
      background: linear-gradient(135deg, #C21A03 0%, #900B0B 100%) !important;
      border: 1.5px solid #FFFFFF !important;
      box-shadow: 0 4px 16px rgba(194, 26, 3, 0.6), 0 0 12px rgba(255, 255, 255, 0.3) !important;
    }

    .site-bottom-nav-item.is-active .material-symbols-outlined {
      color: #FFFFFF !important;
      transform: scale(1.12) !important;
    }

    .site-bottom-nav-item:hover {
      background: rgba(255, 255, 255, 0.15) !important;
      color: #FFFFFF !important;
    }

    /* Panitia mencetak rundown, daftar kamar, dan denah bus. Tema gelap dicetak
       jadi lembar hitam pekat, jadi warna dipaksa terang dan semua elemen
       navigasi disembunyikan. */
    @media print {
      .site-menu-trigger, .site-menu-backdrop, .site-menu-panel,
      .site-bottom-nav, .site-sos-bullet, .site-sos-modal,
      .site-offline-badge, .site-header-center-title { display: none !important; }

      html, body, body * {
        background: #fff !important;
        color: #000 !important;
        box-shadow: none !important;
        text-shadow: none !important;
      }
      body, main { padding-top: 0 !important; padding-bottom: 0 !important; }
      main, section, .rounded-2xl, .rounded-xl { border-color: #999 !important; }
      a { text-decoration: underline; }
      table, tr, .site-print-keep { break-inside: avoid; page-break-inside: avoid; }
      h1, h2, h3 { break-after: avoid; page-break-after: avoid; }
    }
  `;
  document.head.append(globalStyle);

  // Render Menu Drawer Trigger & Panel
  const trigger = document.createElement('button');
  trigger.className = 'site-menu-trigger';
  trigger.type = 'button';
  trigger.setAttribute('aria-label', 'Buka menu');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.innerHTML = '<span class="site-menu-bars"><i></i><i></i><i></i></span>';

  const backdrop = document.createElement('div');
  backdrop.className = 'site-menu-backdrop';

  const panel = document.createElement('aside');
  panel.className = 'site-menu-panel';
  const isActive = (page) => page && pages[page] && path.includes(pages[page].split('/')[0]);
  
  const list = items.map(([label, detail, icon, page]) => {
    if (page === 'sos') {
      return `<button id="drawer-sos-btn" class="site-menu-item" type="button">
        <span class="material-symbols-outlined" style="color:#ffb4ab;" aria-hidden="true">emergency</span>
        <span><strong style="color:#ffb4ab;">${label}</strong><small>${detail}</small></span>
       </button>`;
    }
    return page
      ? `<a class="site-menu-item${isActive(page) ? ' is-active' : ''}" href="${href(page)}">
          <span class="material-symbols-outlined" aria-hidden="true">${icon}</span>
          <span><strong>${label}</strong><small>${detail}</small></span>
         </a>`
      : `<span class="site-menu-item is-disabled">
          <span class="material-symbols-outlined" aria-hidden="true">${icon}</span>
          <span><strong>${label}</strong><small>${detail}</small></span>
         </span>`;
  }).join('');

  panel.innerHTML = `
    <header class="site-menu-header">
      <div>
        <h2 class="site-menu-title">Menu Utama</h2>
      </div>
      <button class="site-menu-close" type="button" aria-label="Tutup menu">×</button>
    </header>
    <nav class="site-menu-list">${list}</nav>
  `;
  document.body.append(backdrop, panel);

  const toast = document.createElement('div');
  toast.className = 'site-toast';
  document.body.append(toast);

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('is-show');
    setTimeout(() => toast.classList.remove('is-show'), 3500);
  }

  // Render Top Header Bar Consistently Across ALL Pages
  document.querySelectorAll('header.fixed.top-0').forEach(el => el.remove());

  const mobileBar = document.createElement('header');
  mobileBar.className = 'site-mobile-bar';
  mobileBar.innerHTML = `
    <div class="site-header-center-title">
      <span>ATAS BERKAT ROCHMAT ALLOH YANG MAHA KUASA</span>
    </div>
    <div style="width:42px;height:42px;flex:none;" aria-hidden="true"></div>
  `;
  mobileBar.prepend(trigger);
  document.body.prepend(mobileBar);

  const closeMenu = () => {
    document.body.classList.remove('site-menu-open');
    trigger.setAttribute('aria-expanded', 'false');
  };
  const openMenu = () => {
    document.body.classList.add('site-menu-open');
    trigger.setAttribute('aria-expanded', 'true');
  };
  trigger.addEventListener('click', () => document.body.classList.contains('site-menu-open') ? closeMenu() : openMenu());
  backdrop.addEventListener('click', closeMenu);
  panel.querySelector('.site-menu-close').addEventListener('click', closeMenu);

  // Global Emergency SOS Modal Definition (P1-3 Accessibility + Real Contacts)
  const picDataSesi2 = [
  {
    "cat": "Kesehatan",
    "name": "Anastasya Yosa K.",
    "role": "Tim Kesehatan Bus 1",
    "phone": "085717925886"
  },
  {
    "cat": "Kesehatan",
    "name": "Siti Aisyah",
    "role": "Tim Kesehatan Bus 2",
    "phone": "085745696646"
  },
  {
    "cat": "Kesehatan",
    "name": "Viddi Puspita Sari",
    "role": "Tim Kesehatan Bus 2",
    "phone": "085708114552"
  },
  {
    "cat": "Kesehatan",
    "name": "Resta Lestari",
    "role": "Tim Kesehatan Bus 3",
    "phone": "082338849394"
  },
  {
    "cat": "Kesehatan",
    "name": "Suci Novia Andriani",
    "role": "Tim Kesehatan Bus 3",
    "phone": "081275491949"
  },
  {
    "cat": "Kesehatan",
    "name": "M. Sholikul Amin",
    "role": "Tim Kesehatan Bus 3",
    "phone": "082131044562"
  },
  {
    "cat": "Kesehatan",
    "name": "Syuhada' Ridlo Billah",
    "role": "Tim Kesehatan Bus 3",
    "phone": "082143345952"
  },
  {
    "cat": "Kesehatan",
    "name": "Habib Am",
    "role": "Tim Kesehatan Bus 4",
    "phone": "081991599255"
  },
  {
    "cat": "Kesehatan",
    "name": "Ahmad Nurdiansah",
    "role": "Tim Kesehatan Bus 4",
    "phone": "087796806147"
  },
  {
    "cat": "Kesehatan",
    "name": "J. Firmansyah Abadi",
    "role": "Tim Kesehatan Bus 4",
    "phone": "082244603774"
  },
  {
    "cat": "Kesehatan",
    "name": "Retma Aisyah",
    "role": "Tim Kesehatan Bus 4",
    "phone": "085745635308"
  },
  {
    "cat": "Keamanan",
    "name": "Rodliyatan Mardliyah",
    "role": "Tim Keamanan Bus 1",
    "phone": "085704247949"
  },
  {
    "cat": "Keamanan",
    "name": "Afiq Nur Rohman",
    "role": "Tim Keamanan Bus 1",
    "phone": "081359017643"
  },
  {
    "cat": "Keamanan",
    "name": "Ika Nurul Aini",
    "role": "Tim Keamanan Bus 2",
    "phone": "087834725099"
  },
  {
    "cat": "Keamanan",
    "name": "Rohmawati Fajrin",
    "role": "Tim Keamanan Bus 2",
    "phone": "085194571051"
  },
  {
    "cat": "Keamanan",
    "name": "Salwa Muniroh",
    "role": "Tim Keamanan Bus 2",
    "phone": "08986872277"
  },
  {
    "cat": "Keamanan",
    "name": "Ikhyak Maulana",
    "role": "Tim Keamanan Bus 2",
    "phone": "081231371644"
  },
  {
    "cat": "Keamanan",
    "name": "Al Irfan",
    "role": "Tim Keamanan Bus 2",
    "phone": "089674203783"
  },
  {
    "cat": "Keamanan",
    "name": "Hamrotul Mukarromah",
    "role": "Tim Keamanan Bus 3",
    "phone": "085748027392"
  },
  {
    "cat": "Keamanan",
    "name": "Alifiana Ahmad F",
    "role": "Tim Keamanan Bus 3",
    "phone": "082322967397"
  },
  {
    "cat": "Keamanan",
    "name": "Siti Nur Nisfiyah",
    "role": "Tim Keamanan Bus 3",
    "phone": "081615263612"
  },
  {
    "cat": "Keamanan",
    "name": "Achmad Shodiqin",
    "role": "Tim Keamanan Bus 3",
    "phone": "085731831480"
  },
  {
    "cat": "Keamanan",
    "name": "Siti Julaikah",
    "role": "Tim Keamanan Bus 4",
    "phone": "085856967713"
  },
  {
    "cat": "Keamanan",
    "name": "M Irfan Fanani",
    "role": "Tim Keamanan Bus 4",
    "phone": "081915410723"
  },
  {
    "cat": "Keamanan",
    "name": "Nur Wahyu Muthi L",
    "role": "Tim Keamanan Bus 4",
    "phone": "0895604071022"
  },
  {
    "cat": "Keamanan",
    "name": "A Syarifuddin",
    "role": "Tim Keamanan Bus 4",
    "phone": "085815671959"
  },
  {
    "cat": "Keamanan",
    "name": "A Fikri Ulinnuha",
    "role": "Tim Keamanan Bus 4",
    "phone": "085608608786"
  },
  {
    "cat": "Keamanan",
    "name": "M Amin Ariefulloh",
    "role": "Tim Keamanan Bus 4",
    "phone": "085168629872"
  },
  {
    "cat": "Keamanan",
    "name": "M Ikhwan Syahrom",
    "role": "Tim Keamanan Bus 4",
    "phone": "085731456609"
  }
];

  const picDataSesi3 = [
  {
    "cat": "Kesehatan",
    "name": "Anastasya Yosa K.",
    "role": "Tim Kesehatan Bus 1",
    "phone": "085717925886"
  },
  {
    "cat": "Kesehatan",
    "name": "Siti Aisyah",
    "role": "Tim Kesehatan Bus 2",
    "phone": "085745696646"
  },
  {
    "cat": "Kesehatan",
    "name": "Viddi Puspita Sari",
    "role": "Tim Kesehatan Bus 2",
    "phone": "085708114552"
  },
  {
    "cat": "Kesehatan",
    "name": "Resta Lestari",
    "role": "Tim Kesehatan Bus 3",
    "phone": "082338849394"
  },
  {
    "cat": "Kesehatan",
    "name": "Retma Aisyah",
    "role": "Tim Kesehatan Bus 3",
    "phone": "085745635308"
  },
  {
    "cat": "Kesehatan",
    "name": "Suci Novia Andriani",
    "role": "Tim Kesehatan Bus 4",
    "phone": "081275491949"
  },
  {
    "cat": "Kesehatan",
    "name": "Habib Am",
    "role": "Tim Kesehatan Bus 5",
    "phone": "081991599255"
  },
  {
    "cat": "Kesehatan",
    "name": "M. Mu'thi Syahrul Sya'ban",
    "role": "Tim Kesehatan Bus 5",
    "phone": "081217475407"
  },
  {
    "cat": "Kesehatan",
    "name": "J. Firmansyah Abadi",
    "role": "Tim Kesehatan Bus 5",
    "phone": "082244603774"
  },
  {
    "cat": "Kesehatan",
    "name": "Syuhada' Ridlo Billah",
    "role": "Tim Kesehatan Bus 6",
    "phone": "082143345952"
  },
  {
    "cat": "Kesehatan",
    "name": "Ahmad Nurdiansah",
    "role": "Tim Kesehatan Bus 6",
    "phone": "087796806147"
  },
  {
    "cat": "Kesehatan",
    "name": "M. Sholikul Amin",
    "role": "Tim Kesehatan Bus 6",
    "phone": "082131044562"
  },
  {
    "cat": "Keamanan",
    "name": "Rodliyatan Mardliyah",
    "role": "Tim Keamanan Bus 1",
    "phone": "085704247949"
  },
  {
    "cat": "Keamanan",
    "name": "Afiq Nur Rohman",
    "role": "Tim Keamanan Bus 1",
    "phone": "081359017643"
  },
  {
    "cat": "Keamanan",
    "name": "Salwa Muniroh",
    "role": "Tim Keamanan Bus 2",
    "phone": "08986872277"
  },
  {
    "cat": "Keamanan",
    "name": "Ika Nurul Aini",
    "role": "Tim Keamanan Bus 2",
    "phone": "087834725099"
  },
  {
    "cat": "Keamanan",
    "name": "Hamrotul Mukarromah",
    "role": "Tim Keamanan Bus 3",
    "phone": "085748027392"
  },
  {
    "cat": "Keamanan",
    "name": "Siti Julaikah",
    "role": "Tim Keamanan Bus 3",
    "phone": "085856967713"
  },
  {
    "cat": "Keamanan",
    "name": "Alifiana Ahmad F",
    "role": "Tim Keamanan Bus 3",
    "phone": "082322967397"
  },
  {
    "cat": "Keamanan",
    "name": "Rohmawati Fajrin",
    "role": "Tim Keamanan Bus 4",
    "phone": "085194571051"
  },
  {
    "cat": "Keamanan",
    "name": "Fatimah binti Maimun",
    "role": "Tim Keamanan Bus 4",
    "phone": "085730020079"
  },
  {
    "cat": "Keamanan",
    "name": "Siti Nur Nisfiyah",
    "role": "Tim Keamanan Bus 4",
    "phone": "081615263612"
  },
  {
    "cat": "Keamanan",
    "name": "M Irfan Fanani",
    "role": "Tim Keamanan Bus 5",
    "phone": "081915410723"
  },
  {
    "cat": "Keamanan",
    "name": "M Amin Ariefulloh",
    "role": "Tim Keamanan Bus 5",
    "phone": "085168629872"
  },
  {
    "cat": "Keamanan",
    "name": "A Fikri Ulinnuha",
    "role": "Tim Keamanan Bus 5",
    "phone": "085608608786"
  },
  {
    "cat": "Keamanan",
    "name": "Achmad Shodiqin",
    "role": "Tim Keamanan Bus 5",
    "phone": "085731831480"
  },
  {
    "cat": "Keamanan",
    "name": "Ikhyak Maulana",
    "role": "Tim Keamanan Bus 6",
    "phone": "081231371644"
  },
  {
    "cat": "Keamanan",
    "name": "A Syarifuddin",
    "role": "Tim Keamanan Bus 6",
    "phone": "085815671959"
  },
  {
    "cat": "Keamanan",
    "name": "M Ikhwan Syahrom",
    "role": "Tim Keamanan Bus 6",
    "phone": "085731456609"
  },
  {
    "cat": "Keamanan",
    "name": "Nur Wahyu Muthi L",
    "role": "Tim Keamanan Bus 6",
    "phone": "0895604071022"
  },
  {
    "cat": "Keamanan",
    "name": "Al Irfan",
    "role": "Tim Keamanan Bus 6",
    "phone": "089674203783"
  }
];

  const sosModal = document.createElement('div');
  sosModal.className = 'site-sos-modal-overlay';
  sosModal.setAttribute('role', 'dialog');
  sosModal.setAttribute('aria-modal', 'true');
  sosModal.setAttribute('aria-labelledby', 'sos-modal-title');
  sosModal.innerHTML = `
    <div class="site-sos-card">
      <button class="site-sos-close" type="button" aria-label="Tutup modal bantuan">×</button>
      <div class="site-sos-header">
        <span class="material-symbols-outlined" style="color:#ffb4ab;font-size:28px;" aria-hidden="true">emergency</span>
        <div>
          <h3 id="sos-modal-title">Pusat Bantuan & Kontak PIC</h3>
          <p>Hubungi panitia safari jika butuh bantuan mendesak</p>
        </div>
      </div>
      <div class="site-sos-tabs">
        <button id="sos-tab-sesi2" class="site-sos-tab-btn is-active" type="button">Sesi 2</button>
        <button id="sos-tab-sesi3" class="site-sos-tab-btn" type="button">Sesi 3</button>
      </div>
      <div id="sos-pic-list-container" class="site-sos-list">
      </div>
      <div style="padding:10px 14px;text-align:center;border-top:1px solid rgba(87,66,62,0.3);background:rgba(34,5,3,0.4);border-bottom-left-radius:16px;border-bottom-right-radius:16px;">
        <a href="${href('emergency')}" style="color:var(--c-primary);font-size:12px;font-weight:700;text-decoration:underline;display:inline-flex;align-items:center;gap:6px;">
          <span>🆘</span>
          <span>Buka Halaman Kontak Darurat (Statis / Luring) →</span>
        </a>
      </div>
    </div>
  `;
  document.body.append(sosModal);

  function renderPicList(data) {
    const container = sosModal.querySelector('#sos-pic-list-container');
    if (!container) return;
    let html = '';
    let currentCat = '';
    data.forEach(item => {
      if (item.cat !== currentCat) {
        currentCat = item.cat;
        const iconSym = currentCat.includes('Kesehatan') ? '🩺' : '🛡️';
        html += `<div class="site-sos-section-title">${iconSym} ${currentCat.toUpperCase()}</div>`;
      }
      const cleanPhone = item.phone.replace(/[^0-9]/g, '');
      const intPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
      const visualSymbol = item.cat.includes('Kesehatan') ? '🩺' : '🛡️';
      html += `
        <div class="site-sos-item">
          <div class="site-sos-item-info">
            <span style="font-size:18px;line-height:1;" aria-hidden="true">${visualSymbol}</span>
            <div>
              <strong>${item.name}</strong>
              <span>${item.role} (${item.phone})</span>
            </div>
          </div>
          <div class="site-sos-actions">
            <a href="https://wa.me/${intPhone}?text=Halo%20${encodeURIComponent(item.name)},%20saya%20peserta%20Safari%20MQ12%20butuh%20bantuan" target="_blank" class="site-sos-act-btn site-sos-act-wa">WA</a>
            <a href="tel:+${intPhone}" class="site-sos-act-btn site-sos-act-call">📞</a>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
  }

  renderPicList(picDataSesi2);

  const tabSesi2 = sosModal.querySelector('#sos-tab-sesi2');
  const tabSesi3 = sosModal.querySelector('#sos-tab-sesi3');

  if (tabSesi2 && tabSesi3) {
    tabSesi2.addEventListener('click', () => {
      tabSesi2.classList.add('is-active');
      tabSesi3.classList.remove('is-active');
      renderPicList(picDataSesi2);
    });
    tabSesi3.addEventListener('click', () => {
      tabSesi3.classList.add('is-active');
      tabSesi2.classList.remove('is-active');
      renderPicList(picDataSesi3);
    });
  }

  const openSos = () => {
    sosModal.classList.add('is-open');
    sosModal.querySelector('.site-sos-close').focus();
  };
  const closeSos = () => {
    sosModal.classList.remove('is-open');
  };
  
  sosModal.querySelector('.site-sos-close').addEventListener('click', closeSos);
  sosModal.addEventListener('click', (e) => { if (e.target === sosModal) closeSos(); });
  
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sosModal.classList.contains('is-open')) {
      closeSos();
    }
  });

  const drawerSosBtn = panel.querySelector('#drawer-sos-btn');
  if (drawerSosBtn) {
    drawerSosBtn.addEventListener('click', () => {
      closeMenu();
      openSos();
    });
  }

  // Compact Floating Round Bullet SOS FAB Button (42px Bullet - Pure White SOS Text)
  const sosBullet = document.createElement('button');
  sosBullet.type = 'button';
  sosBullet.className = 'site-sos-bullet';
  sosBullet.setAttribute('aria-label', 'Bantuan PIC SOS');
  sosBullet.innerHTML = '<strong style="color:#FFFFFF !important; font-size:11px; font-weight:800; letter-spacing:0.5px; line-height:1;">SOS</strong>';
  sosBullet.addEventListener('click', openSos);
  document.body.append(sosBullet);

  // Global Bottom Navigation Bar (Mobile Only)
  const navBar = document.createElement('nav');
  navBar.className = 'site-bottom-nav';
  navBar.innerHTML = `
    <a href="${href('home')}" class="site-bottom-nav-item${isHome ? ' is-active' : ''}">
      <span class="material-symbols-outlined" aria-hidden="true">home</span>
      <span>Beranda</span>
    </a>
    <a href="${href('rules')}" class="site-bottom-nav-item${isActive('rules') ? ' is-active' : ''}">
      <span class="material-symbols-outlined" aria-hidden="true">gavel</span>
      <span>Tata Tertib</span>
    </a>
    <a href="${href('prayer')}" class="site-bottom-nav-item${isActive('prayer') ? ' is-active' : ''}">
      <span class="material-symbols-outlined" aria-hidden="true">prayer_times</span>
      <span>Sholat</span>
    </a>
    <a href="${href('photos')}" class="site-bottom-nav-item${isActive('photos') ? ' is-active' : ''}">
      <span class="material-symbols-outlined" aria-hidden="true">groups</span>
      <span>Skema Foto</span>
    </a>
  `;
  document.body.append(navBar);

  // Real Multi-Stay Participant Lookup Engine (P0-2, P0-3, P0-1 Privacy Compliant)
  const PROFIL_KEY = 'user_safari_profile_v2'; // naikkan bila bentuk peserta.json berubah
  let pesertaData = null;
  async function loadPesertaData() {
    if (pesertaData) return pesertaData;
    try {
      const res = await fetch(new URL('peserta.json', root).href);
      pesertaData = await res.json();
    } catch (e) {
      pesertaData = {};
    }
    return pesertaData;
  }

  /* --- NAME-PHONETIC-START (sinkron dengan tools/name-utils.js, dijaga tools/test-nama.js) --- */
  const GELAR = new Set(['bpk', 'bp', 'pak', 'ibu', 'bu', 'mba', 'mbak', 'drs', 'hj', 'ny', 'kh', 'ust', 'ustadz', 'ustadzah', 'h']);
  const prefiksMuhammad = (t) => t === 'm' || (/^m[uo]/.test(t) && 'mhmd'.startsWith(phoneticWord(t)));

  function normalizeInputName(name) {
    const raw = String(name).toLowerCase()
      .replace(/['’`]/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .split(' ').filter(Boolean);
    let i = 0;
    while (i < raw.length - 1 && GELAR.has(raw[i])) i++;
    if (i < raw.length - 1 && prefiksMuhammad(raw[i])) i++;
    return raw.slice(i).join(' ');
  }

  function phoneticWord(w) {
    return w
      .replace(/kh/g, 'h').replace(/dh/g, 'd').replace(/ts/g, 's')
      .replace(/sh/g, 's').replace(/hs/g, 's').replace(/ch/g, 'h')
      .replace(/y/g, 'i').replace(/j/g, 'z').replace(/q/g, 'k').replace(/f/g, 'p')
      .replace(/(.)\1+/g, '$1')
      .replace(/[aeiou]/g, '')
      .replace(/h+$/, '');
  }

  // Kunci pemaaf: ejaan berbeda yang sebunyi menghasilkan kunci yang sama (C-4)
  const phoneticKey = (name) => normalizeInputName(name).split(' ').map(phoneticWord).join(' ');
  /* --- NAME-PHONETIC-END --- */

  // Semua ejaan satu profil, dalam bentuk normal dan bentuk bunyi. Dihitung
  // sekali per profil; WeakMap supaya tidak ikut terbawa ke localStorage.
  const cacheKunci = new WeakMap();
  function kunciEjaan(item) {
    let k = cacheKunci.get(item);
    if (!k) {
      const ejaan = [item.name, ...(item.aliases || [])];
      k = { norm: new Set(ejaan.map(normalizeInputName)), fon: new Set(ejaan.map(phoneticKey)) };
      cacheKunci.set(item, k);
    }
    return k;
  }

  function initPersonalCardWidget() {
    const inputView = document.getElementById('personal-input-view');
    const profileView = document.getElementById('personal-profile-view');
    const nameInput = document.getElementById('personal-name-input');
    const btnSave = document.getElementById('btn-save-personal');
    const btnEdit = document.getElementById('btn-edit-personal');
    const displayName = document.getElementById('user-display-name');

    if (!inputView || !profileView || !nameInput || !btnSave) return;

    document.querySelectorAll('a[href="#personal-card-box"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const box = document.getElementById('personal-card-box');
        if (box) {
          box.scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (nameInput && nameInput.offsetParent !== null) {
            setTimeout(() => nameInput.focus(), 300);
          }
        }
      });
    });

    // Autocomplete Box Setup (P0-1 Strict Privacy: Name Only, 4 chars threshold)
    let autoBox = document.querySelector('.personal-autocomplete-box');
    if (!autoBox) {
      autoBox = document.createElement('div');
      autoBox.className = 'personal-autocomplete-box';
      nameInput.parentNode.style.position = 'relative';
      nameInput.parentNode.appendChild(autoBox);
    }

    // Typing Backdrop for Focus Blur Mode
    let typingBackdrop = document.querySelector('.personal-typing-backdrop');
    if (!typingBackdrop) {
      typingBackdrop = document.createElement('div');
      typingBackdrop.className = 'personal-typing-backdrop';
      document.body.appendChild(typingBackdrop);
    }

    const openFocusMode = () => {
      const box = document.getElementById('personal-card-box');
      if (box) document.body.classList.add('is-typing-name');
    };

    const closeFocusMode = () => {
      document.body.classList.remove('is-typing-name');
      if (autoBox) autoBox.classList.remove('is-open');
    };

    closeFocusMode();
    typingBackdrop.addEventListener('click', closeFocusMode);

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#personal-card-box') && !e.target.closest('.personal-autocomplete-box')) {
        closeFocusMode();
      }
    });

    const renderCanonicalProfile = (entry) => {
      closeFocusMode();
      displayName.textContent = entry.name;

      // Satu baris per sesi (B-7, D-3). Sesi 2 belum punya denah, jadi ditulis
      // apa adanya — lebih baik kosong daripada menebak nomor kendaraan.
      const transport = entry.transport || {};
      const sesiHtml = [
        { label: 'Sesi 1', unit: transport.sesi1, page: 'seatsSesi1' },
        { label: 'Sesi 2', unit: transport.sesi2, page: 'seatsSesi2' },
        { label: 'Sesi 3', unit: transport.sesi3, page: 'seatsSesi3' }
      ].map(s => `
        <div class="flex items-center justify-between p-2.5 rounded-xl bg-surface-container border border-outline-variant/20">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-secondary text-[20px]" aria-hidden="true">directions_bus</span>
            <div>
              <span class="text-[11px] text-on-surface-variant uppercase font-semibold">${s.label}</span>
              <strong class="text-xs text-on-surface block font-bold">${s.unit || s.catatan || 'Belum terdaftar'}</strong>
            </div>
          </div>
          ${s.unit && s.page ? `<a href="${href(s.page)}" class="px-2.5 py-1 rounded-lg bg-secondary/15 text-secondary border border-secondary/30 text-[11px] font-bold hover:bg-secondary hover:text-surface-container-lowest transition-colors">Lihat Denah</a>` : ''}
        </div>
      `).join('');

      let staysHtml = '';
      if (entry.menginap && entry.menginap.length > 0) {
        staysHtml = entry.menginap.map(m => {
          const roomText = m.kamar.toLowerCase().startsWith('kamar') ? m.kamar : `Kamar ${m.kamar}`;
          return `
            <div class="p-2.5 rounded-xl bg-surface-container border border-outline-variant/20 flex items-center justify-between">
              <div>
                <span class="text-[10px] text-secondary uppercase font-bold tracking-wider">${m.kota} (${m.hotel})</span>
                <strong class="text-xs text-on-surface block font-bold mt-0.5">${roomText} (${m.tipe})</strong>
              </div>
              <a href="${href('rooms')}#${m.kota}" class="px-2.5 py-1 rounded-lg bg-secondary/15 text-secondary border border-secondary/30 text-[11px] font-bold hover:bg-secondary hover:text-surface-container-lowest transition-colors">Lihat Kamar</a>
            </div>
          `;
        }).join('');
      } else {
        staysHtml = `<div class="p-2 text-xs text-on-surface-variant">Detail penginapan belum terdaftar</div>`;
      }

      profileView.innerHTML = `
        <div class="flex items-center justify-between border-b border-surface-variant/30 pb-3">
          <div>
            <span class="text-[10px] text-on-surface-variant uppercase font-semibold">Nama Peserta</span>
            <h4 id="user-display-name" class="font-title-lg font-bold text-primary">${entry.name}</h4>
          </div>
          <button id="btn-edit-personal" type="button" class="text-xs text-secondary hover:underline flex items-center gap-1 min-h-[44px] px-3 py-1.5 rounded-lg border border-secondary/20 bg-secondary/10"><span class="material-symbols-outlined text-[14px]" aria-hidden="true">edit</span> Ganti Nama</button>
        </div>

        <div class="space-y-2 pt-2">
          <span class="text-[11px] text-on-surface-variant uppercase font-semibold flex items-center gap-1"><span class="material-symbols-outlined text-[14px] text-secondary" aria-hidden="true">directions_bus</span> Armada Transportasi</span>
          ${sesiHtml}

          <div class="space-y-1.5 pt-1">
            <span class="text-[11px] text-on-surface-variant uppercase font-semibold flex items-center gap-1"><span class="material-symbols-outlined text-[14px] text-secondary" aria-hidden="true">hotel</span> Daftar Penginapan (Multi-Kota)</span>
            <div class="space-y-2">
              ${staysHtml}
            </div>
          </div>
        </div>
      `;

      profileView.querySelector('#btn-edit-personal').addEventListener('click', () => {
        profileView.classList.add('hidden');
        inputView.classList.remove('hidden');
        nameInput.focus();
      });

      localStorage.setItem('user_safari_name', entry.name);
      // Kunci ikut versi skema: kartu lama (transport.unit, "kamar": "Kamar 4")
      // tidak boleh dirender oleh kode baru, cukup dicari ulang dari namanya.
      localStorage.setItem(PROFIL_KEY, JSON.stringify(entry));
      inputView.classList.add('hidden');
      profileView.classList.remove('hidden');
      if (autoBox) autoBox.classList.remove('is-open');
    };

    const searchParticipant = async (queryName) => {
      if (!queryName || !queryName.trim()) return;
      const data = await loadPesertaData();
      const normQ = normalizeInputName(queryName);

      if (!normQ || normQ.length < 2) return;

      // Exact > sebunyi > sebagian. Exact menang mutlak atas partial (B-2b).
      const fonQ = phoneticKey(queryName);
      const exact = [];
      const sebunyi = [];
      const partial = [];
      Object.keys(data).forEach(key => {
        const item = data[key];
        const k = kunciEjaan(item);
        if (key === normQ || k.norm.has(normQ)) exact.push(item);
        else if (fonQ && k.fon.has(fonQ)) sebunyi.push(item);
        else if ([...k.norm].some(n => n.includes(normQ))) partial.push(item);
      });

      const matches = exact.length ? exact : (sebunyi.length ? sebunyi : partial);
      if (!matches.length) {
        showToast('⚠️ Nama belum terdaftar di sistem. Silakan hubungi PIC Bantuan.');
        return;
      }

      renderCanonicalProfile(matches[0]);
      // Picker hanya muncul kalau memang masih ambigu setelah exact diprioritaskan
      if (matches.length > 1) {
        autoBox.innerHTML = matches.slice(0, 8).map(m =>
          `<div class="personal-autocomplete-item" data-name="${m.name}">${m.name} <small style="color:var(--c-primary);">(Pilih Profil)</small></div>`
        ).join('');
        autoBox.classList.add('is-open');
      }
    };

    // Autocomplete typing listener (Interactive matching for short/lowercase names, 2+ chars)
    nameInput.addEventListener('input', async () => {
      const val = nameInput.value.trim();
      const normV = normalizeInputName(val);
      if (normV.length < 2) {
        closeFocusMode();
        return;
      }
      const data = await loadPesertaData();
      const fonV = phoneticKey(val);
      
      const matchesMap = new Map();
      Object.keys(data).forEach(k => {
        const item = data[k];
        const key = kunciEjaan(item);
        if ([...key.norm].some(n => n.includes(normV)) || (fonV && [...key.fon].some(f => f.includes(fonV)))) {
          matchesMap.set(item.name, item);
        }
      });
      const matches = Array.from(matchesMap.values()).slice(0, 8);

      if (matches.length > 0) {
        autoBox.innerHTML = matches.map(m => `<div class="personal-autocomplete-item" data-name="${m.name}">${m.name}</div>`).join('');
        autoBox.classList.add('is-open');
        openFocusMode();
      } else {
        closeFocusMode();
      }
    });

    autoBox.addEventListener('click', async (e) => {
      const item = e.target.closest('.personal-autocomplete-item');
      if (item) {
        const selectedName = item.getAttribute('data-name') || item.textContent.replace('(Pilih Profil)', '').trim();
        if (selectedName) {
          nameInput.value = selectedName;
          const data = await loadPesertaData();
          const normS = normalizeInputName(selectedName);
          let target = Object.values(data).find(v => kunciEjaan(v).norm.has(normS));
          if (!target) target = Object.values(data).find(v => [...kunciEjaan(v).norm].some(n => n.includes(normS)));
          if (target) {
            renderCanonicalProfile(target);
          } else {
            await searchParticipant(selectedName);
          }
        }
      }
    });

    btnSave.addEventListener('click', () => searchParticipant(nameInput.value));
    nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        searchParticipant(nameInput.value);
      }
    });

    if (btnEdit) {
      btnEdit.addEventListener('click', () => {
        profileView.classList.add('hidden');
        inputView.classList.remove('hidden');
        nameInput.focus();
      });
    }

    // Auto-load saved user profile with offline fallback support (B-5)
    localStorage.removeItem('user_safari_profile'); // sisa skema lama
    const savedProfileStr = localStorage.getItem(PROFIL_KEY);
    if (savedProfileStr) {
      try {
        const cachedProfile = JSON.parse(savedProfileStr);
        if (cachedProfile && cachedProfile.name) {
          renderCanonicalProfile(cachedProfile);
        }
      } catch(e) {}
    } else {
      const savedName = localStorage.getItem('user_safari_name');
      if (savedName) {
        searchParticipant(savedName);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPersonalCardWidget);
  } else {
    initPersonalCardWidget();
  }

  // Font Ready Listener to prevent icon text FOUT
  if (document.fonts) {
    document.fonts.ready.then(() => document.documentElement.classList.add('fonts-ready'));
  } else {
    document.documentElement.classList.add('fonts-ready');
  }

  // PWA Service Worker Registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = new URL('sw.js', root).href;
      navigator.serviceWorker.register(swUrl).catch(() => {});
    });
  }
})();
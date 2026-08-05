(() => {
  const pages = {
    home: 'beranda_mobile_dark_safari_hwmi_mq_12/code.html',
    itibar: 'i_tibar_musafir_final_safari_hwmi_mq_12/code.html', rules: 'tata_tertib_dark_safari_hwmi_mq_12/code.html', prayer: 'panduan_sholat_musafir_safari_hwmi_mq_12/code.html', seats: 'denah_bus_safari_hwmi_mq_12/code.html',
    departure: 'tata_tertib_berangkat_verbatim_safari_hwmi_mq_12/code.html', speaking: 'etika_dalam_berbicara_safari_hwmi_mq_12/code.html', attire: 'etika_dalam_berpakaian_safari_hwmi_mq_12/code.html',
    lodging: 'tata_tertib_di_penginapan_safari_hwmi_mq_12/code.html', publicArea: 'tata_tertib_selain_makam_safari_hwmi_mq_12/code.html', cemetery: 'tata_tertib_di_area_makam_safari_hwmi_mq_12/code.html', bus: 'tata_tertib_di_dalam_bus_safari_hwmi_mq_12/code.html'
  };
  const root = new URL('../', window.location.href);
  const href = (page) => new URL(pages[page], root).href;
  const go = (page) => { window.location.href = href(page); };
  const isHome = window.location.pathname.includes('beranda_mobile_dark');

  document.querySelectorAll('button[aria-label="Go back"]').forEach((button) => button.addEventListener('click', () => history.length > 1 ? history.back() : go('rules')));
  document.querySelectorAll('button').forEach((button) => {
    const text = button.textContent.replace(/\s+/g, ' ').trim().toLowerCase();
    if (text.includes('sebelum berangkat')) button.addEventListener('click', () => go('departure'));
    else if (text.includes('sebagai peserta') || text.includes('dalam berbicara')) button.addEventListener('click', () => go('speaking'));
    else if (text.includes('dalam berpakaian')) button.addEventListener('click', () => go('attire'));
    else if (text.includes('penginapan')) button.addEventListener('click', () => go('lodging'));
    else if (text.includes('area umum') || text.includes('selain makam')) button.addEventListener('click', () => go('publicArea'));
    else if (text.includes('area makam')) button.addEventListener('click', () => go('cemetery'));
    else if (text.includes('didalam bus') || text.includes('di dalam bus')) button.addEventListener('click', () => go('bus'));
  });
  if (isHome) document.querySelectorAll('a[href="#"]').forEach((link) => {
    const text = link.textContent.replace(/\s+/g, ' ').trim();
    const page = text.includes('Itibar Musafir') ? 'itibar' : text.includes('Tata Tertib Peserta') ? 'rules' : text.includes('Panduan Sholat Musafir') ? 'prayer' : (text.includes('Denah Bus Peserta') || text.includes('Denah Bus Sesi 3') || text.includes('Denah Bus')) ? 'seats' : null;
    if (page) link.href = href(page);
  });

  const items = [
    ['Beranda', 'Beranda utama', 'home', 'home'],
    ['Itibar Musafir', 'Pedoman perjalanan', 'explore', 'itibar'],
    ['Tata Tertib Peserta', 'Aturan kegiatan', 'gavel', 'rules'],
    ['Panduan Sholat Musafir', 'Panduan ibadah', 'prayer_times', 'prayer'],
    ['Rundown Kegiatan', 'Segera hadir', 'schedule'],
    ['Daftar Kamar Peserta', 'Segera hadir', 'hotel'],
    ['Denah Bus', 'Pembagian tempat duduk', 'directions_bus', 'seats'],
    ['Jadwal Seragam', 'Segera hadir', 'apparel'],
    ['Skema Foto Bersama', 'Segera hadir', 'groups'],
    ['Peta Safari', 'Segera hadir', 'map']
  ];
  const menuStyle = document.createElement('style');
  menuStyle.textContent = '.site-menu-trigger{position:fixed;top:16px;right:16px;z-index:10020;width:44px;height:44px;display:grid;place-items:center;border:1px solid #a58b86;border-radius:6px;background:#381510;color:#e9c176;box-shadow:0 8px 22px rgba(34,5,3,.32);cursor:pointer}.site-menu-trigger:hover,.site-menu-trigger:focus-visible{background:#550000;border-color:#ffb4a8;outline:0}.site-menu-bars{display:grid;gap:5px}.site-menu-bars i{display:block;width:19px;height:2px;border-radius:3px;background:currentColor}.site-menu-backdrop{position:fixed;inset:0;z-index:10029;background:rgba(20,3,2,.64);opacity:0;visibility:hidden;transition:opacity .22s ease,visibility .22s ease}.site-menu-panel{position:fixed;z-index:10030;top:0;right:0;bottom:0;width:min(370px,calc(100vw - 32px));padding:24px 18px 32px;overflow-y:auto;background:#280905;border-left:1px solid #57423e;box-shadow:-18px 0 54px rgba(0,0,0,.38);transform:translateX(104%);transition:transform .25s ease}.site-menu-open .site-menu-backdrop{opacity:1;visibility:visible}.site-menu-open .site-menu-panel{transform:translateX(0)}.site-menu-header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin:2px 4px 24px;padding-bottom:20px;border-bottom:1px solid #57423e}.site-menu-kicker{margin:0 0 4px;color:#e9c176;font:600 11px "Plus Jakarta Sans",sans-serif;letter-spacing:.12em;text-transform:uppercase}.site-menu-title{margin:0;color:#ffdad4;font:600 23px "Noto Serif",serif}.site-menu-close{width:38px;height:38px;display:grid;place-items:center;border:1px solid #57423e;border-radius:4px;background:#381510;color:#e9c176;font-size:23px;line-height:1;cursor:pointer}.site-menu-list{display:grid;gap:7px}.site-menu-item{display:grid;grid-template-columns:36px 1fr;gap:10px;align-items:center;min-height:60px;padding:10px 12px;border:1px solid transparent;border-radius:6px;color:#ffdad4;text-decoration:none}.site-menu-item:hover,.site-menu-item:focus-visible,.site-menu-item.is-active{border-color:#57423e;background:#451f19;outline:0}.site-menu-item.is-active{background:#604403;color:#ffdea5}.site-menu-item.is-disabled{opacity:.52;cursor:not-allowed}.site-menu-item .material-symbols-outlined{color:#e9c176;font-size:23px}.site-menu-item strong{display:block;font:600 13px "Plus Jakarta Sans",sans-serif}.site-menu-item small{display:block;margin-top:3px;color:#dec0bb;font:400 11px "Plus Jakarta Sans",sans-serif}.site-menu-item.is-active small{color:#ffdea5}@media(max-width:720px){.site-menu-trigger{top:10px;right:14px;width:42px;height:42px}.site-menu-panel{width:min(340px,calc(100vw - 24px));padding-top:20px}body.site-menu-open{overflow:hidden}}';
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
  const isActive = (page) => page && window.location.pathname.includes(pages[page].split('/')[0]);
  const list = items.map(([label, detail, icon, page]) => page
    ? '<a class="site-menu-item' + (isActive(page) ? ' is-active' : '') + '" href="' + href(page) + '"><span class="material-symbols-outlined">' + icon + '</span><span><strong>' + label + '</strong><small>' + detail + '</small></span></a>'
    : '<span class="site-menu-item is-disabled" aria-disabled="true"><span class="material-symbols-outlined">' + icon + '</span><span><strong>' + label + '</strong><small>' + detail + '</small></span></span>'
  ).join('');
  panel.innerHTML = '<header class="site-menu-header"><div><p class="site-menu-kicker">Safari HWMI MQ 12</p><h2 class="site-menu-title">Menu</h2></div><button class="site-menu-close" type="button" aria-label="Tutup menu">×</button></header><nav class="site-menu-list">' + list + '</nav>';
  document.body.append(trigger, backdrop, panel);
  const close = () => { document.body.classList.remove('site-menu-open'); trigger.setAttribute('aria-expanded', 'false'); };
  const open = () => { document.body.classList.add('site-menu-open'); trigger.setAttribute('aria-expanded', 'true'); panel.querySelector('.site-menu-close').focus(); };
  trigger.addEventListener('click', () => document.body.classList.contains('site-menu-open') ? close() : open());
  backdrop.addEventListener('click', close);
  panel.querySelector('.site-menu-close').addEventListener('click', close);
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });

  if (!isHome) { const homeButton = document.createElement('a'); homeButton.href = href('home'); homeButton.setAttribute('aria-label', 'Kembali ke beranda'); homeButton.textContent = 'Beranda'; homeButton.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:9999;padding:10px 14px;border-radius:999px;background:#d1bd68;color:#201f18;font:600 14px system-ui;text-decoration:none;box-shadow:0 4px 16px #0008'; document.body.append(homeButton); }
})();

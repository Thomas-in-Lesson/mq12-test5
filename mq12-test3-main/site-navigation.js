(() => {
  const pages = {
    home: 'beranda_mobile_dark_safari_hwmi_mq_12/code.html',
    itibar: 'i_tibar_musafir_final_safari_hwmi_mq_12/code.html', rules: 'tata_tertib_dark_safari_hwmi_mq_12/code.html', prayer: 'panduan_sholat_musafir_safari_hwmi_mq_12/code.html', seats: 'denah_bus_safari_hwmi_mq_12/code.html',
    departure: 'tata_tertib_berangkat_verbatim_safari_hwmi_mq_12/code.html', speaking: 'etika_dalam_berbicara_safari_hwmi_mq_12/code.html', attire: 'etika_dalam_berpakaian_safari_hwmi_mq_12/code.html',
    lodging: 'tata_tertib_di_penginapan_safari_hwmi_mq_12/code.html', publicArea: 'tata_tertib_selain_makam_safari_hwmi_mq_12/code.html', cemetery: 'tata_tertib_di_area_makam_safari_hwmi_mq_12/code.html', bus: 'tata_tertib_di_dalam_bus_safari_hwmi_mq_12/code.html'
  };
  const root = new URL('../', window.location.href);
  const go = (page) => { window.location.href = new URL(pages[page], root).href; };
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
    if (page) link.href = new URL(pages[page], root).href;
  });
  if (!isHome) { const homeButton = document.createElement('a'); homeButton.href = new URL(pages.home, root).href; homeButton.setAttribute('aria-label', 'Kembali ke beranda'); homeButton.textContent = 'Beranda'; homeButton.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:9999;padding:10px 14px;border-radius:999px;background:#d1bd68;color:#201f18;font:600 14px system-ui;text-decoration:none;box-shadow:0 4px 16px #0008'; document.body.append(homeButton); }
})();

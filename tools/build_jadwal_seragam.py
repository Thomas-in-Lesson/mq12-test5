import os

html_code = """<!DOCTYPE html>
<html class="dark" lang="id">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex, nofollow, noarchive">
<meta name="theme-color" content="#280905">
<meta name="description" content="Panduan resmi Safari Chubbul Wathon Minal Iman — Maqooshidul Qur-aan 12. Informasi kamar, bus, tata tertib, dan panduan musafir.">
<meta property="og:type" content="website">
<meta property="og:title" content="Safari HWMI MQ 12">
<meta property="og:description" content="Panduan resmi Safari Chubbul Wathon Minal Iman 12 — kamar, bus, rundown, dan tata tertib.">
<meta property="og:image" content="https://thomas-in-lesson.github.io/mq12-test5/og-cover.jpg">
<meta property="og:url" content="https://thomas-in-lesson.github.io/mq12-test5/">
<link rel="apple-touch-icon" href="../icon-180.png">
<link rel="icon" href="../favicon.ico" sizes="any">
<link rel="manifest" href="../manifest.json">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>Jadwal Seragam - Safari HWMI MQ 12</title>
<style>
  .card-inner-glow {
    box-shadow: inset 1px 1px 0px 0px rgba(233, 193, 118, 0.1);
  }
  .table-responsive {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
</style>
<link rel="stylesheet" href="../styles.css">
</head>
<body class="bg-background text-on-surface antialiased min-h-screen flex flex-col pb-24 md:pb-0">

<!-- TopAppBar -->
<header class="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-surface-variant/30 shadow-sm flex items-center justify-between px-margin-mobile h-16 md:hidden">
<button aria-label="Go back" class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-variant/50 text-primary">
<span class="material-symbols-outlined">arrow_back</span>
</button>
<div class="font-headline-md-mobile text-headline-md-mobile font-bold text-secondary flex-1 text-center">
  Jadwal Seragam
</div>
<div class="w-10"></div>
</header>

<!-- Main Canvas -->
<main class="flex-1 w-full max-w-container-max-width mx-auto pt-20 px-margin-mobile md:px-margin-desktop md:pt-32 space-y-8">
<section class="text-center space-y-4">
<h1 class="font-display-lg-mobile text-display-lg-mobile md:font-display-lg text-secondary font-bold">
  JADWAL SERAGAM SAFARI HWMI MQ 12
</h1>
<p class="font-body-md text-on-surface-variant max-w-2xl mx-auto">
  Ketentuan busana & seragam harian peserta dan pendamping seluruh perjalanan Safari.
</p>
<div class="w-16 h-1 bg-secondary mx-auto rounded-full opacity-50"></div>

<!-- Tab Navigation Sesi -->
<div class="flex items-center justify-center gap-2 pt-2 flex-wrap" id="sesi-tabs">
  <button id="tab-btn-sesi1" onclick="switchSesiTab('sesi1')" class="px-4 py-2 rounded-full border border-secondary bg-secondary/20 text-secondary font-bold text-xs shadow-md transition-all">SESI 1</button>
  <button id="tab-btn-sesi2" onclick="switchSesiTab('sesi2')" class="px-4 py-2 rounded-full border border-surface-variant bg-surface-container text-on-surface-variant font-medium text-xs transition-all">SESI 2</button>
  <button id="tab-btn-sesi3" onclick="switchSesiTab('sesi3')" class="px-4 py-2 rounded-full border border-surface-variant bg-surface-container text-on-surface-variant font-medium text-xs transition-all">SESI 3</button>
</div>
</section>

<!-- ================= SESI 1 CONTENT ================= -->
<section id="content-sesi1" class="space-y-6">
<div class="bg-surface-container-low rounded-xl p-5 border border-surface-variant/40 shadow-lg space-y-4">
  <div class="flex items-center justify-between border-b border-surface-variant/30 pb-3">
    <div>
      <span class="text-xs font-bold text-secondary uppercase tracking-wider">SESI KE-1</span>
      <h2 class="font-title-lg text-title-lg font-bold text-primary">Ahad Kliwon, 2 R. Awwal 1448 H / 16 Agustus 2026 M</h2>
    </div>
    <span class="px-3 py-1 rounded-full bg-secondary/15 text-secondary border border-secondary/30 text-xs font-bold shrink-0">1 Hari</span>
  </div>

  <div class="table-responsive">
    <table class="w-full text-left text-xs text-on-surface">
      <thead class="bg-surface-container-high text-secondary uppercase font-bold border-b border-surface-variant/40">
        <tr>
          <th class="p-3 w-10 text-center">No</th>
          <th class="p-3">Agenda / Lokasi</th>
          <th class="p-3">Seragam Peserta</th>
          <th class="p-3">Seragam Pendamping</th>
          <th class="p-3">Wilayah</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-surface-variant/20">
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">1</td><td class="p-3">Sholat Shubuh berjama’ah</td><td class="p-3 font-semibold text-secondary">Almamater</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">LosPlos</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">2</td><td class="p-3">Makam Kyai Achmad Syuhada’</td><td class="p-3 font-semibold text-secondary">Almamater</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">LosPlos</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">3</td><td class="p-3">Do’a Bersama dan Berpamitan</td><td class="p-3 font-semibold text-secondary">Almamater</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">Losplos</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">4</td><td class="p-3">Makam Kyai Achmad Sanusi Tamriz Abdul Ghofar</td><td class="p-3 font-semibold text-secondary">Almamater</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">Kabuh</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">5</td><td class="p-3">Makam Kyai Achmad Zamrozi</td><td class="p-3 font-semibold text-secondary">Almamater</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">Ploso</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">6</td><td class="p-3">Makam Kyai Achmad Falal</td><td class="p-3 font-semibold text-secondary">Almamater</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">Megaluh</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">7</td><td class="p-3">Makam Kholifah Sumadji & Salamun</td><td class="p-3 font-semibold text-secondary">Almamater</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">Ngoro</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">8</td><td class="p-3">Makam Kholifah Dukhan Iskandar</td><td class="p-3 font-semibold text-secondary">Almamater</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">Ngoro</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">9</td><td class="p-3">Makam Syekh Imam Dzipuro</td><td class="p-3 font-semibold text-secondary">Almamater</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">Ngoro</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">10</td><td class="p-3">Makam Syekh Jumal Kubro (Troloyo)</td><td class="p-3 font-semibold text-secondary">Almamater</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">Mojokerto</td></tr>
      </tbody>
    </table>
  </div>
</div>
</section>

<!-- ================= SESI 2 CONTENT ================= -->
<section id="content-sesi2" class="space-y-6 hidden">
<!-- Sesi 2 Hari 1 -->
<div class="bg-surface-container-low rounded-xl p-5 border border-surface-variant/40 shadow-lg space-y-4">
  <div class="flex items-center justify-between border-b border-surface-variant/30 pb-3">
    <div>
      <span class="text-xs font-bold text-secondary uppercase tracking-wider">SESI 2 — HARI KE-1</span>
      <h2 class="font-title-lg text-title-lg font-bold text-primary">Jumat Pahing, 14 R.Awwal 1448 H / 28 Agustus 2026 M</h2>
    </div>
  </div>

  <div class="table-responsive">
    <table class="w-full text-left text-xs text-on-surface">
      <thead class="bg-surface-container-high text-secondary uppercase font-bold border-b border-surface-variant/40">
        <tr>
          <th class="p-3 w-10 text-center">No</th>
          <th class="p-3">Agenda / Lokasi</th>
          <th class="p-3">Seragam Peserta</th>
          <th class="p-3">Seragam Pendamping</th>
          <th class="p-3">Wilayah</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-surface-variant/20">
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">1</td><td class="p-3">Sholat Shubuh berjama’ah</td><td class="p-3 font-semibold text-secondary">Almamater</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">LosPlos</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">2</td><td class="p-3">Makam Bung Karno</td><td class="p-3 font-semibold text-secondary">Almamater</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">Blitar</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">3</td><td class="p-3">Sholat Tamam Taqdim & Makan</td><td class="p-3 font-semibold text-secondary">Jasket</td><td class="p-3 text-primary">Jasket Merah</td><td class="p-3">Sidoarjo</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">4</td><td class="p-3">Museum Mpu Tantular</td><td class="p-3 font-semibold text-secondary">Jasket</td><td class="p-3 text-primary">Jasket Merah</td><td class="p-3">Sidoarjo</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">5</td><td class="p-3">Makam Wage Supratman</td><td class="p-3 font-semibold text-secondary">Almamater</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">Surabaya</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">6</td><td class="p-3">Sholat Jama’ Taqdim & Makan Malam</td><td class="p-3 font-semibold text-secondary">Almamater</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">Masjid Ampel</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">7</td><td class="p-3">Makam Sunan Ampel</td><td class="p-3 font-semibold text-secondary">Almamater</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">Surabaya</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">8</td><td class="p-3">Istirahat di penginapan</td><td class="p-3 font-semibold text-secondary">Bebas Sopan</td><td class="p-3 text-primary">Bebas</td><td class="p-3">Hotel Khas</td></tr>
      </tbody>
    </table>
  </div>
</div>

<!-- Sesi 2 Hari 2 -->
<div class="bg-surface-container-low rounded-xl p-5 border border-surface-variant/40 shadow-lg space-y-4">
  <div class="flex items-center justify-between border-b border-surface-variant/30 pb-3">
    <div>
      <span class="text-xs font-bold text-secondary uppercase tracking-wider">SESI 2 — HARI KE-2</span>
      <h2 class="font-title-lg text-title-lg font-bold text-primary">Sabtu Pon, 15 R.Awwal 1448 H / 29 Agustus 2026 M</h2>
    </div>
  </div>

  <div class="table-responsive">
    <table class="w-full text-left text-xs text-on-surface">
      <thead class="bg-surface-container-high text-secondary uppercase font-bold border-b border-surface-variant/40">
        <tr>
          <th class="p-3 w-10 text-center">No</th>
          <th class="p-3">Agenda / Lokasi</th>
          <th class="p-3">Seragam Peserta</th>
          <th class="p-3">Seragam Pendamping</th>
          <th class="p-3">Wilayah</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-surface-variant/20">
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">1</td><td class="p-3">Sholat Subuh Berjama’ah</td><td class="p-3 font-semibold text-secondary">Almamater</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">Gresik</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">2</td><td class="p-3">Makam Sunan Gresik</td><td class="p-3 font-semibold text-secondary">Almamater</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">Gresik</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">3</td><td class="p-3">Makam Sayyid Ali Murtadlo (Raden Santri)</td><td class="p-3 font-semibold text-secondary">Almamater</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">Gresik</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">4</td><td class="p-3">Makam Sunan Deket</td><td class="p-3 font-semibold text-secondary">Almamater</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">Lamongan</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">5</td><td class="p-3">Makam Sunan Drajat</td><td class="p-3 font-semibold text-secondary">Almamater</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">Lamongan</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">6</td><td class="p-3">Makam Maulana Ibrohim Asmoroqondi & ISHOMA</td><td class="p-3 font-semibold text-secondary">Almamater</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">Tuban</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">7</td><td class="p-3">Makam Sunan Bonang</td><td class="p-3 font-semibold text-secondary">Almamater</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">Tuban</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">8</td><td class="p-3">Sholat berjamaah & makan Masjid Agung Tuban</td><td class="p-3 font-semibold text-secondary">Almamater</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">Tuban</td></tr>
      </tbody>
    </table>
  </div>
</div>
</section>

<!-- ================= SESI 3 CONTENT ================= -->
<section id="content-sesi3" class="space-y-6 hidden">
<!-- Sesi 3 Hari 1 -->
<div class="bg-surface-container-low rounded-xl p-5 border border-surface-variant/40 shadow-lg space-y-4">
  <div class="flex items-center justify-between border-b border-surface-variant/30 pb-3">
    <div>
      <span class="text-xs font-bold text-secondary uppercase tracking-wider">SESI 3 — HARI KE-1</span>
      <h2 class="font-title-lg text-title-lg font-bold text-primary">Rabu Pahing, 19 R.Awwal 1448 H / 2 September 2026 M</h2>
    </div>
  </div>
  <div class="table-responsive">
    <table class="w-full text-left text-xs text-on-surface">
      <thead class="bg-surface-container-high text-secondary uppercase font-bold border-b border-surface-variant/40">
        <tr><th class="p-3 w-10 text-center">No</th><th class="p-3">Agenda / Lokasi</th><th class="p-3">Seragam Peserta</th><th class="p-3">Seragam Pendamping</th><th class="p-3">Wilayah</th></tr>
      </thead>
      <tbody class="divide-y divide-surface-variant/20">
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">1</td><td class="p-3">Sholat Shubuh berjama’ah</td><td class="p-3 font-semibold text-secondary">Almamater</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">Losplos</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">2</td><td class="p-3">Do’a Bersama dan Berpamitan</td><td class="p-3 font-semibold text-secondary">Almamater</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">Losplos</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">3</td><td class="p-3">Makam Kyai Nur Salim (Benteng Pendem)</td><td class="p-3 font-semibold text-secondary">Almamater</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">Ngawi</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">4</td><td class="p-3">Masjid Agung Karanganyar (ISHOMA)</td><td class="p-3 font-semibold text-secondary">Almamater</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">Karanganyar</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">5</td><td class="p-3">Astana Mangadeg (Sambernyowo)</td><td class="p-3 font-semibold text-secondary">Almamater</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">Karanganyar</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">6</td><td class="p-3">Istirahat di Penginapan</td><td class="p-3 font-semibold text-secondary">Baju Bebas Sopan</td><td class="p-3 text-primary">Baju Bebas Sopan</td><td class="p-3">Solo</td></tr>
      </tbody>
    </table>
  </div>
</div>

<!-- Sesi 3 Hari 2 -->
<div class="bg-surface-container-low rounded-xl p-5 border border-surface-variant/40 shadow-lg space-y-4">
  <div class="flex items-center justify-between border-b border-surface-variant/30 pb-3">
    <div>
      <span class="text-xs font-bold text-secondary uppercase tracking-wider">SESI 3 — HARI KE-2</span>
      <h2 class="font-title-lg text-title-lg font-bold text-primary">Kamis Pon, 20 R.Awwal 1448 H / 3 September 2026 M</h2>
    </div>
  </div>
  <div class="table-responsive">
    <table class="w-full text-left text-xs text-on-surface">
      <thead class="bg-surface-container-high text-secondary uppercase font-bold border-b border-surface-variant/40">
        <tr><th class="p-3 w-10 text-center">No</th><th class="p-3">Agenda / Lokasi</th><th class="p-3">Seragam Peserta</th><th class="p-3">Seragam Pendamping</th><th class="p-3">Wilayah</th></tr>
      </thead>
      <tbody class="divide-y divide-surface-variant/20">
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">1</td><td class="p-3">Observasi Prambanan</td><td class="p-3 font-semibold text-secondary">Jasket</td><td class="p-3 text-primary">Jasket Merah</td><td class="p-3">Klaten</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">2</td><td class="p-3">Makam Jendral Sudirman</td><td class="p-3 font-semibold text-secondary">Almamater</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">DIY</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">3</td><td class="p-3">Makam HOS Cokroaminoto & Kyai Surosentono</td><td class="p-3 font-semibold text-secondary">Almamater, Kemeja Putih</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">DIY</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">4</td><td class="p-3">Masjid Syuhada’ (ISHOMA)</td><td class="p-3 font-semibold text-secondary">Almamater, Kemeja Putih</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">DIY</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">5</td><td class="p-3">Istirahat di Mungkid</td><td class="p-3 font-semibold text-secondary">Bebas Sopan</td><td class="p-3 text-primary">Bebas Sopan</td><td class="p-3">Magelang</td></tr>
      </tbody>
    </table>
  </div>
</div>

<!-- Sesi 3 Hari 3 -->
<div class="bg-surface-container-low rounded-xl p-5 border border-surface-variant/40 shadow-lg space-y-4">
  <div class="flex items-center justify-between border-b border-surface-variant/30 pb-3">
    <div>
      <span class="text-xs font-bold text-secondary uppercase tracking-wider">SESI 3 — HARI KE-3</span>
      <h2 class="font-title-lg text-title-lg font-bold text-primary">Jumat Wage, 21 R.Awwal 1448 H / 4 September 2026 M</h2>
    </div>
  </div>
  <div class="table-responsive">
    <table class="w-full text-left text-xs text-on-surface">
      <thead class="bg-surface-container-high text-secondary uppercase font-bold border-b border-surface-variant/40">
        <tr><th class="p-3 w-10 text-center">No</th><th class="p-3">Agenda / Lokasi</th><th class="p-3">Seragam Peserta</th><th class="p-3">Seragam Pendamping</th><th class="p-3">Wilayah</th></tr>
      </thead>
      <tbody class="divide-y divide-surface-variant/20">
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">1</td><td class="p-3">Mungkid (Mini Ceremony)</td><td class="p-3 font-semibold text-secondary">Jasket, Kemeja Putih</td><td class="p-3 text-primary">Jasket Merah</td><td class="p-3">Magelang</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">2</td><td class="p-3">Observasi Borobudur</td><td class="p-3 font-semibold text-secondary">Jasket, Kemeja Putih</td><td class="p-3 text-primary">Jasket Merah</td><td class="p-3">Magelang</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">3</td><td class="p-3">Makam Sosrokartono</td><td class="p-3 font-semibold text-secondary">Almamater, Kemeja Putih</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">Kudus</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">4</td><td class="p-3">Istirahat di Penginapan</td><td class="p-3 font-semibold text-secondary">Bebas Sopan</td><td class="p-3 text-primary">Bebas</td><td class="p-3">Hotel Oaktree</td></tr>
      </tbody>
    </table>
  </div>
</div>

<!-- Sesi 3 Hari 4 -->
<div class="bg-surface-container-low rounded-xl p-5 border border-surface-variant/40 shadow-lg space-y-4">
  <div class="flex items-center justify-between border-b border-surface-variant/30 pb-3">
    <div>
      <span class="text-xs font-bold text-secondary uppercase tracking-wider">SESI 3 — HARI KE-4</span>
      <h2 class="font-title-lg text-title-lg font-bold text-primary">Sabtu Kliwon, 22 R.Awwal 1448 H / 5 September 2026 M</h2>
    </div>
  </div>
  <div class="table-responsive">
    <table class="w-full text-left text-xs text-on-surface">
      <thead class="bg-surface-container-high text-secondary uppercase font-bold border-b border-surface-variant/40">
        <tr><th class="p-3 w-10 text-center">No</th><th class="p-3">Agenda / Lokasi</th><th class="p-3">Seragam Peserta</th><th class="p-3">Seragam Pendamping</th><th class="p-3">Wilayah</th></tr>
      </thead>
      <tbody class="divide-y divide-surface-variant/20">
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">1</td><td class="p-3">Makam Syech Dzatul Kahfi, R. Fatahillah, Sunan Gunung Jati</td><td class="p-3 font-semibold text-secondary">Almamater, Kemeja Putih</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">Cirebon</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">2</td><td class="p-3">ISHOMA di Masjid Abdurrahman Syarif H.</td><td class="p-3 font-semibold text-secondary">Almamater, Kemeja Putih</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">Cirebon</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">3</td><td class="p-3">Istirahat di Penginapan</td><td class="p-3 font-semibold text-secondary">Bebas Sopan</td><td class="p-3 text-primary">Bebas Sopan</td><td class="p-3">Hotel Gino Feruci</td></tr>
      </tbody>
    </table>
  </div>
</div>

<!-- Sesi 3 Hari 5 -->
<div class="bg-surface-container-low rounded-xl p-5 border border-surface-variant/40 shadow-lg space-y-4">
  <div class="flex items-center justify-between border-b border-surface-variant/30 pb-3">
    <div>
      <span class="text-xs font-bold text-secondary uppercase tracking-wider">SESI 3 — HARI KE-5</span>
      <h2 class="font-title-lg text-title-lg font-bold text-primary">Ahad Legi, 23 R.Awwal 1448 H / 6 September 2026 M</h2>
    </div>
  </div>
  <div class="table-responsive">
    <table class="w-full text-left text-xs text-on-surface">
      <thead class="bg-surface-container-high text-secondary uppercase font-bold border-b border-surface-variant/40">
        <tr><th class="p-3 w-10 text-center">No</th><th class="p-3">Agenda / Lokasi</th><th class="p-3">Seragam Peserta</th><th class="p-3">Seragam Pendamping</th><th class="p-3">Wilayah</th></tr>
      </thead>
      <tbody class="divide-y divide-surface-variant/20">
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">1</td><td class="p-3">Makam Syech Musa</td><td class="p-3 font-semibold text-secondary">Almamater, Kemeja Putih</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">Sukanegara</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">2</td><td class="p-3">ISHOMA di area Syekh Musa</td><td class="p-3 font-semibold text-secondary">Almamater, Kemeja Putih</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">Sukanegara</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">3</td><td class="p-3">Tiba di HSHF</td><td class="p-3 font-semibold text-secondary">Bebas Sopan</td><td class="p-3 text-primary">Bebas</td><td class="p-3">Pelabuhan Ratu</td></tr>
      </tbody>
    </table>
  </div>
</div>

<!-- Sesi 3 Hari 6 -->
<div class="bg-surface-container-low rounded-xl p-5 border border-surface-variant/40 shadow-lg space-y-4">
  <div class="flex items-center justify-between border-b border-surface-variant/30 pb-3">
    <div>
      <span class="text-xs font-bold text-secondary uppercase tracking-wider">SESI 3 — HARI KE-6</span>
      <h2 class="font-title-lg text-title-lg font-bold text-primary">Isnen Pahing, 24 R.Awwal 1448 H / 7 September 2026 M</h2>
    </div>
  </div>
  <div class="table-responsive">
    <table class="w-full text-left text-xs text-on-surface">
      <thead class="bg-surface-container-high text-secondary uppercase font-bold border-b border-surface-variant/40">
        <tr><th class="p-3 w-10 text-center">No</th><th class="p-3">Agenda / Lokasi</th><th class="p-3">Seragam Peserta</th><th class="p-3">Seragam Pendamping</th><th class="p-3">Wilayah</th></tr>
      </thead>
      <tbody class="divide-y divide-surface-variant/20">
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">1</td><td class="p-3">Kegiatan di HSHF</td><td class="p-3 font-semibold text-secondary">Jasket, Kemeja Putih</td><td class="p-3 text-primary">Jasket Merah</td><td class="p-3">Pelabuhan Ratu</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">2</td><td class="p-3">Makam Bung Hatta dan ISHOMA</td><td class="p-3 font-semibold text-secondary">Almamater, Kemeja Putih</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">Jakarta Selatan</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">3</td><td class="p-3">Makam Husein Mutahar</td><td class="p-3 font-semibold text-secondary">Almamater, Kemeja Putih</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">Jakarta Selatan</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">4</td><td class="p-3">Makam Abu Hanifah dan KH. Abdul Mu’thi</td><td class="p-3 font-semibold text-secondary">Almamater, Kemeja Putih</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">Jakarta Selatan</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">5</td><td class="p-3">Istirahat di penginapan</td><td class="p-3 font-semibold text-secondary">Bebas Sopan</td><td class="p-3 text-primary">Bebas</td><td class="p-3">Hotel Swiss</td></tr>
      </tbody>
    </table>
  </div>
</div>

<!-- Sesi 3 Hari 7 -->
<div class="bg-surface-container-low rounded-xl p-5 border border-surface-variant/40 shadow-lg space-y-4">
  <div class="flex items-center justify-between border-b border-surface-variant/30 pb-3">
    <div>
      <span class="text-xs font-bold text-secondary uppercase tracking-wider">SESI 3 — HARI KE-7</span>
      <h2 class="font-title-lg text-title-lg font-bold text-primary">Selasa Pon, 25 R.Awwal 1448 H / 8 September 2026 M</h2>
    </div>
  </div>
  <div class="table-responsive">
    <table class="w-full text-left text-xs text-on-surface">
      <thead class="bg-surface-container-high text-secondary uppercase font-bold border-b border-surface-variant/40">
        <tr><th class="p-3 w-10 text-center">No</th><th class="p-3">Agenda / Lokasi</th><th class="p-3">Seragam Peserta</th><th class="p-3">Seragam Pendamping</th><th class="p-3">Wilayah</th></tr>
      </thead>
      <tbody class="divide-y divide-surface-variant/20">
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">1</td><td class="p-3">Museum Sumpah Pemuda</td><td class="p-3 font-semibold text-secondary">Salur</td><td class="p-3 text-primary">Salur</td><td class="p-3">Jakarta Pusat</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">2</td><td class="p-3">MONAS</td><td class="p-3 font-semibold text-secondary">Salur</td><td class="p-3 text-primary">Salur</td><td class="p-3">Jakarta Pusat</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">3</td><td class="p-3">Masjid Istiqlal Dan ISHOMA</td><td class="p-3 font-semibold text-secondary">Salur</td><td class="p-3 text-primary">Salur</td><td class="p-3">Jakarta Pusat</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">4</td><td class="p-3">Istirahat di Penginapan</td><td class="p-3 font-semibold text-secondary">Bebas Sopan</td><td class="p-3 text-primary">Bebas</td><td class="p-3">Hotel R.Gina</td></tr>
      </tbody>
    </table>
  </div>
</div>

<!-- Sesi 3 Hari 8 -->
<div class="bg-surface-container-low rounded-xl p-5 border border-surface-variant/40 shadow-lg space-y-4">
  <div class="flex items-center justify-between border-b border-surface-variant/30 pb-3">
    <div>
      <span class="text-xs font-bold text-secondary uppercase tracking-wider">SESI 3 — HARI KE-8</span>
      <h2 class="font-title-lg text-title-lg font-bold text-primary">Rabu Wage, 26 R.Awwal 1448 H / 9 September 2026 M</h2>
    </div>
  </div>
  <div class="table-responsive">
    <table class="w-full text-left text-xs text-on-surface">
      <thead class="bg-surface-container-high text-secondary uppercase font-bold border-b border-surface-variant/40">
        <tr><th class="p-3 w-10 text-center">No</th><th class="p-3">Agenda / Lokasi</th><th class="p-3">Seragam Peserta</th><th class="p-3">Seragam Pendamping</th><th class="p-3">Wilayah</th></tr>
      </thead>
      <tbody class="divide-y divide-surface-variant/20">
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">1</td><td class="p-3">Makam Sunan Kalijaga</td><td class="p-3 font-semibold text-secondary">Almamater, Kemeja Putih</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">Demak</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">2</td><td class="p-3">Makam Raden Abdul Fattah</td><td class="p-3 font-semibold text-secondary">Almamater, Kemeja Putih</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">Demak</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">3</td><td class="p-3">ISHOMA Masjid Agung Demak</td><td class="p-3 font-semibold text-secondary">Kemeja Putih</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">Demak</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">4</td><td class="p-3">Kembali ke LOSPLOS</td><td class="p-3 font-semibold text-secondary">Kemeja Putih</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">Losplos</td></tr>
        <tr class="hover:bg-surface-container/50"><td class="p-3 text-center font-bold">5</td><td class="p-3">Acara di Ndalem</td><td class="p-3 font-semibold text-secondary">Almamater, Kemeja Putih</td><td class="p-3 text-primary">Jasket Biru</td><td class="p-3">Losplos</td></tr>
      </tbody>
    </table>
  </div>
</div>
</section>

</main>

<script>
function switchSesiTab(sesiId) {
  const tabs = ['sesi1', 'sesi2', 'sesi3'];
  tabs.forEach(t => {
    const btn = document.getElementById('tab-btn-' + t);
    const content = document.getElementById('content-' + t);
    if (t === sesiId) {
      btn.className = 'px-4 py-2 rounded-full border border-secondary bg-secondary/20 text-secondary font-bold text-xs shadow-md transition-all';
      content.classList.remove('hidden');
    } else {
      btn.className = 'px-4 py-2 rounded-full border border-surface-variant bg-surface-container text-on-surface-variant font-medium text-xs transition-all';
      content.classList.add('hidden');
    }
  });
}
</script>
<script src="../site-navigation.js"></script>
</body>
</html>
"""

with open('jadwal_seragam_safari_hwmi_mq_12/code.html', 'w', encoding='utf-8') as f:
    f.write(html_code)

print('Updated jadwal_seragam_safari_hwmi_mq_12/code.html successfully!')

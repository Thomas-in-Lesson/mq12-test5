import json, os

buses = [
  # BUS 1
  {
    "left": [
      [["1", "BPK NURHADI", ""], ["2", "BPK. M. ZAKIYUL FUAD", ""]],
      [["5", "MUJAHIDUL ABROR", "PELAYAN"], ["6", "RUBEN AHMAD HABIL ARASYI", "PELAYAN"]],
      [["9", "Lili Nur Rahma W", "Bendahara"], ["10", "Munta' Zemmahal", "Penata Acara"]],
      [["13", "Fatimah Ratna D", "Bendahara"], ["14", "Nur Mika Sari", "Dokumentasi Tulis"]],
      [["17", "Nur Hilmiyatul A", "Konsumsi"], ["18", "Rodliyatan M", "Keamanan"]],
      [["21", "Ananda Zahra A", "Penginapan"], ["22", "Anggita Putri U", "Penginapan"]],
      [["25", "Anastasya Yosa K", "Kesehatan"], ["26", "Nimimmmis C", "Konsumsi"]],
      [["29", "M. Fatihul Aziz", "Sekertaris"], ["30", "Thousand A.H.S", "Sekertaris"]],
      [["33", "Bagus Adib K", "Audio Visual"], ["34", "M. Alam Syahrul", "Audio Visual"]]
    ],
    "right": [
      [["3", "Fathul Bahri Gilang", "PELAYAN"], ["4", "Syari' Naufal A.B", "Pelayan/ Sekertaris"]],
      [["7", "Ma'rifatul Azal", "PJ"], ["8", "M. Misbahul Muflihin", "Survey"]],
      [["11", "Moch. Rizky", "Dokumentasi"], ["12", "M. Lukman Hakim C", "Ketua Akomodasi"]],
      [["15", "Fuad M. Taufik", "Ketua Acara&arsip"], ["16", "Lutfian Aditya", "Ketua Pelayanan"]],
      [["19", "M. Husna Listyanando", "Ketua Administrasi"], ["20", "Mustofa Kamil", "Dokumentasi"]],
      [["23", "Fariid Nashrulloh", "Penginapan"], ["24", "Saifu Umar Ahmadi", "Penginapan"]],
      [["27", "M. Fadlur Rohman", "Merchandise"], ["28", "Yuan Daviq Nuzul", "Merchandise"]],
      [["31", "Irkham Rayindra", "PJ Armada"], ["32", "Afiq Nur Rohman", "Keamanan"]],
      [["35", "Yuaz Rizal I", "Konsumsi"], ["36", "M. Nashruddin T", "Konsumsi"]]
    ],
    "back": [
      ["37", "Khafid Dwi C", "Perlengkapan"],
      ["38", "Novel Putra Atma", "Perlengkapan"],
      ["39", "Ibnu Adi S", "Perlengkapan"],
      ["40", "Ja'far Shodiq Hidayat", "Perlengkapan"],
      ["41", "Annas Shidiq P", "Perlengkapan"],
      ["42", "M. Karim Al M", "Perlengkapan"]
    ]
  },
  # BUS 2
  {
    "left": [
      [["1", "Bpk. Moch Ghozali", ""], ["2", "Bpk. Kushartono", ""]],
      [["5", "Melly Kayyisa", "Penata Acara"], ["6", "Ma'ul Fatihatur R", "Penata Acara"]],
      [["9", "Ida Rohayati", "Dokumentasi"], ["10", "Ika Nurul A", "Keamanan"]],
      [["13", "Siti Aisyah", "Kesehatan"], ["14", "Ratna Umi T", "Peserta"]],
      [["17", "Santi Kartika S", "Konsumsi"], ["18", "Fianisa Shofwatul", "Konsumsi"]],
      [["21", "Najilah Jahsi", "Peserta"], ["22", "Rohmawati Fajrin", "Keamanan"]],
      [["25", "Hafida Azila", "Konsumsi"], ["26", "Fajriyatul Faricha", "Peserta"]],
      [["29", "Abidatul Faricha", "Merchandise"], ["30", "Adelia Margareta", "Merchandise"]],
      [["33", "Diyah Ayu P", "Peserta"], ["34", "Nurul Fauza", "Peserta"]]
    ],
    "right": [
      [["3", "Fernandi Mendieta", "Pelayan"], ["4", "M. Nurul Fuady", "Pelayan"]],
      [["7", "Umar Muchtar Alif", "Pelayan"], ["8", "Ikhlasul Muttaqin", "Pelayan"]],
      [["11", "Anis Nur Laili", "Peserta"], ["12", "Viddi Puspita S", "Kesehatan"]],
      [["15", "Lu'lu Khoirunnisa", "Dokumentasi Tulis"], ["16", "Sri Bella Y", "Konsumsi"]],
      [["19", "Intan Muhajirotul", "Konsumsi"], ["20", "Sulalatin N", "Peserta"]],
      [["23", "Annisa Kamalat", "Peserta"], ["24", "Rahayu Cahya M", "Konsumsi"]],
      [["27", "Salwa Muniroh", "Keamanan"], ["28", "Karima Fauky", "Dokumentasi Tulis"]],
      [["31", "Tya Aprilia L", "Shodaqoh"], ["32", "Upi Ramadhani", "Peserta"]],
      [["35", "Salma Dewi Atika", "Konsumsi"], ["36", "Sintawati P", "Konsumsi"]]
    ],
    "back": [
      ["37", "M. Ikhlasul M", "Dokumentasi"],
      ["38", "M. Irfan", "Audio Visual"],
      ["39", "Ikhlasul Abror P .D", "PJ. Armada"],
      ["40", "M. Muchtar Amin", "Shodaqoh"],
      ["41", "Ikhya' Maulana", "Keamanan"],
      ["42", "Al Irfan", "Keamanan"]
    ]
  },
  # BUS 3
  {
    "left": [
      [["1", "Bpk. Irfan Fanani", ""], ["2", "", ""]],
      [["5", "Andes Rahayu N", "Konsumsi"], ["6", "Tahdliyatul Ma'azah", "Dokumentasi"]],
      [["9", "Nella Rodliyyah", "Konsumsi"], ["10", "Hamrotul M", "Keamanan"]],
      [["13", "Khamdatul M", "Peserta"], ["14", "Resta Lestari", "Kesehatan"]],
      [["17", "Sitta Jannatul M", "Peserta"], ["18", "Suci Novia A", "Kesehatan"]],
      [["21", "Ummu Cholifah", "Peserta"], ["22", "Dewi Ratnaswari", "Keamanan"]],
      [["25", "Fani Durrotun N", "Peserta"], ["26", "Fina Durrotun N", "Peserta"]],
      [["29", "Na'imatul Malikha", ""], ["30", "Nova Nuraini", ""]],
      [["33", "Nuril Fitriyyah", ""], ["34", "Bunga Arum dani", "Kebersihan"]]
    ],
    "right": [
      [["3", "Ade Iman H", "Pelayan"], ["4", "Dimas Fajar", "Pelayan"]],
      [["7", "Fachrizal Ahmad G", "Penata Acara"], ["8", "Herman Efendi", "PJ Armada"]],
      [["11", "Dwi Ajeng Sasmita", "Dokumentasi Tulis"], ["12", "Tahsinatus S", "Dokumentasi Tulis"]],
      [["15", "Alifiyana Ahmad F", "Keamanan"], ["16", "Riska Farah Z", "Dokumentasi Tulis"]],
      [["19", "Annisa Humaira", "Peserta"], ["20", "Ananda Mustika Sari", "Konsumsi"]],
      [["23", "Putri Andini", "Merchandise"], ["24", "Devi Nuria A", "Merchandise"]],
      [["27", "Dwi Lestari A", "Peserta"], ["28", "Khikmatul Khasanah", "Peserta"]],
      [["31", "Fatimah Binti M", ""], ["32", "Tamia Rizki", "Kebersihan"]],
      [["35", "Zaskia Syamsuwirna", "Keamanan"], ["36", "Siti Nur Nisfiyah", ""]]
    ],
    "back": [
      ["37", "A. Ridwan Agustin", "Konsumsi"],
      ["38", "M. Danis Alfian S", "Konsumsi"],
      ["39", "M. Sholihul Amin", "Kesehatan"],
      ["40", "Raka Biyan P", "PJ Armada"],
      ["41", "A. Shodiqin", "Keamanan"],
      ["42", "Syuhada' Ridlo Billah", "Kesehatan"]
    ]
  },
  # BUS 4
  {
    "left": [
      [["1", "Bpk. Ismadi", ""], ["2", "", ""]],
      [["5", "Mutiara Noor R", "Konsumsi"], ["6", "Putri Lestari", "Konsumsi"]],
      [["9", "Siti Julaikhah", "Keamanan"], ["10", "Isna Maghfiroh", "Peserta"]],
      [["13", "A. Pramuja Hadi", "Penata Acara"], ["14", "Aditya Saputra", "Penata Acara"]],
      [["17", "M. M. Syahrul Sya'ban", "PJ Armada"], ["18", "", ""]],
      [["21", "M. Ali Ridlo", "Dokumentasi Tulis"], ["22", "Habib A. Mukarroman", "Kesehatan"]],
      [["25", "M. Irfan Fanani", "Keamanan"], ["26", "Ismul Ashom", "Konsumsi"]],
      [["29", "M. Agus Prasetyo", "Konsumsi"], ["30", "M. Churul Ilmi", "PJ Armada"]],
      [["33", "M. Fathur Rohim", "Konsumsi"], ["34", "M. Amin Ariefulloh", "Keamanan"]]
    ],
    "right": [
      [["3", "Fuad Husein", "Pelayan"], ["4", "A. Kurniawan", "Pelayan"]],
      [["7", "Retma Aisyah", "Kesehatan"], ["8", "Yonsania Nur F", "Dokumentasi Tulis"]],
      [["11", "Umi Jariyah", "Peserta"], ["12", "Umi Nasikhah", "Peserta"]],
      [["15", "Ahmad Imadul Islam", "Dokumentasi Tulis"], ["16", "Nur Wahyu Mu'thi L", "Keamanan"]],
      [["19", "Shidiq Silo H", "Spiritual"], ["20", "Rifki Darmawan", "Spiritual"]],
      [["23", "A. Syarifuddin", "Keamanan"], ["24", "A. Fikri Ulinnuha", "Keamanan"]],
      [["27", "Ahmad Nurdiansyah", "Kesehatan"], ["28", "M. Kholidin", "Konsumsi"]],
      [["31", "Anang Fachurrozi", "Konsumsi"], ["32", "Chodimul Ihsan", "Spiritual"]],
      [["35", "Dwi Ardiansyah Nur", "Konsumsi"], ["36", "Hafid Dyantoro", "Konsumsi"]]
    ],
    "back": [
      ["37", "M. Ibnu Muhajir", "Konsumsi"],
      ["38", "M. Ikhwan Syahrom", "Keamanan"],
      ["39", "J. Firmansyah A", "Kesehatan"],
      ["40", "M. Bahrun Muchith", "Dokumentasi Tulis"],
      ["41", "Jonathan Leo", "Konsumsi"],
      ["42", "Nur Muhammad", ""]
    ]
  }
]

out_dir = "/Users/rizky/Documents/#Experiment/mq12-test5/denah_bus_sesi_2_safari_hwmi_mq_12"
os.makedirs(out_dir, exist_ok=True)

buses_json = json.dumps(buses, ensure_ascii=False)

html_content = f"""<!doctype html>
<html lang="id">
<head>
<meta charset=utf-8>
<meta name="robots" content="noindex, nofollow, noarchive">
<meta name="theme-color" content="#0D0303">
<meta name="description" content="Panduan resmi Safari Chubbul Wathon Minal Iman — Maqooshidul Qur-aan 12. Informasi kamar, bus, tata tertib, dan panduan musafir.">
<meta property="og:type" content="website">
<meta property="og:title" content="Safari HWMI MQ 12">
<meta property="og:description" content="Panduan resmi Safari Chubbul Wathon Minal Iman 12 — kamar, bus, rundown, dan tata tertib.">
<meta property="og:image" content="https://thomas-in-lesson.github.io/mq12-test5/og-cover.jpg">
<meta property="og:url" content="https://thomas-in-lesson.github.io/mq12-test5/">
<link rel="apple-touch-icon" href="../icon-180.png">
<link rel="icon" href="../favicon.ico" sizes="any">
<link rel="manifest" href="../manifest.json">
<meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Denah Bus Sesi 2 - Safari HWMI MQ 12</title>
  <style>
    :root{{--bg:var(--c-surface);--surface-low:var(--c-surface-low);--surface:var(--c-surface-container);--surface-high:var(--c-surface-high);--line:var(--c-outline-variant);--line-subtle:var(--c-outline-variant);--primary:#ffb4a8;--primary-deep:#550000;--cream:#ffdad4;--muted:#dec0bb;--gold:#e9c176;--gold-deep:#604403;--ink:#410000}}*{{box-sizing:border-box}}html{{scroll-behavior:smooth}}body{{min-height:100vh;margin:0;background:radial-gradient(ellipse 75% 42% at 50% -10%,#572e27 0%,transparent 68%),radial-gradient(circle at 0 40%,#3e130f 0%,transparent 30%),var(--bg);color:var(--cream);font-family:"Plus Jakarta Sans",sans-serif}}.shell{{width:min(1200px,100%);margin:auto;padding:64px 24px 120px}}.top{{display:flex;align-items:center;gap:16px;margin-bottom:40px}}.back{{width:42px;height:42px;border:1px solid var(--line);border-radius:4px;display:grid;place-items:center;background:rgba(51,17,12,.76);color:var(--gold);cursor:pointer;transition:background .2s ease,border-color .2s ease,transform .2s ease}}.back:hover{{background:var(--primary-deep);border-color:var(--primary);transform:translateX(-2px)}}.eyebrow{{margin:0 0 4px;color:var(--gold);font-size:.75rem;font-weight:600;letter-spacing:.13em;text-transform:uppercase}}.top h1,.intro h2,.bus h2{{font-family:"Noto Serif",serif}}.top h1{{margin:0;font-size:clamp(1.5rem,4vw,2rem);font-weight:600}}.hero{{display:grid;grid-template-columns:1fr;gap:24px;margin-bottom:40px}}.intro{{position:relative;overflow:hidden;padding:32px;border:1px solid var(--line-subtle);border-top-color:rgba(255,218,212,.13);border-left-color:rgba(233,193,118,.18);border-radius:8px;background:linear-gradient(135deg,rgba(69,31,25,.96),rgba(51,17,12,.92));box-shadow:inset 0 1px 0 rgba(255,218,212,.05),0 24px 60px rgba(85,0,0,.12)}}.intro:after{{position:absolute;inset:auto 0 0;content:"";height:2px;background:linear-gradient(90deg,var(--gold-deep),transparent 76%)}}.intro h2{{max-width:660px;margin:0 0 16px;color:var(--cream);font-size:clamp(2rem,5vw,3rem);font-weight:700;line-height:1.16;letter-spacing:-.02em}}.intro p:not(.eyebrow){{max-width:680px;margin:0;color:var(--muted);font-size:1rem;line-height:1.75}}.nav{{position:sticky;z-index:2;top:0;display:flex;gap:8px;overflow-x:auto;margin:0 -8px 32px;padding:14px 8px;border-bottom:1px solid rgba(224,184,99,.15);background:#1F0808}}.nav a{{flex:0 0 auto;padding:9px 13px;border:1px solid var(--line);border-radius:4px;background:rgba(56,21,16,.8);color:var(--muted);text-decoration:none;font-size:.78rem;font-weight:600;transition:background .2s ease,border-color .2s ease,color .2s ease}}.nav a:hover,.nav a:focus-visible{{border-color:var(--gold);background:var(--primary-deep);color:var(--cream);outline:0}}.bus{{margin:40px 0;padding:24px;border:1px solid var(--line-subtle);border-top-color:rgba(255,218,212,.1);border-left-color:rgba(233,193,118,.13);border-radius:8px;background:linear-gradient(145deg,var(--surface),var(--surface-low));box-shadow:inset 0 1px 0 rgba(255,218,212,.05),0 22px 58px rgba(34,5,3,.3);scroll-margin-top:86px}}.bus-head{{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:2px 0 20px;border-bottom:1px solid var(--line-subtle)}}.bus-title{{display:flex;gap:11px;align-items:center}}.bus-title .material-symbols-outlined{{color:var(--gold)}}.bus h2{{margin:0;color:var(--cream);font-size:1.5rem;font-weight:600}}.count{{margin:4px 0 0;color:var(--muted);font-size:.76rem}}.scroll{{overflow-x:auto;padding:20px 1px 2px}}.plan{{min-width:900px;padding:18px;border:1px solid #7d5a53;border-top-color:#d3aaa2;border-left-color:#b68c84;border-radius:6px;background:#ffdad4;color:var(--ink);box-shadow:0 18px 36px rgba(34,5,3,.3)}}.bus-banner{{width:42%;min-height:42px;margin:0 auto 18px;display:grid;place-items:center;background:#b60000;color:#fff4f1;font-weight:700;font-size:.95rem;letter-spacing:.04em;text-transform:uppercase}}.cab{{display:grid;grid-template-columns:1.1fr 1.45fr 1.45fr 1.1fr;align-items:stretch;gap:10px;margin-bottom:16px}}.cab-item{{min-height:48px;display:grid;place-items:center;border:1px solid #7a332d;background:#f4c6bf;color:#640b05;text-transform:uppercase;font-size:.68rem;font-weight:700;letter-spacing:.08em}}.cab-item.door{{align-self:start;min-height:30px}}.cab-item.driver{{background:#e7b9b1}}.seats{{display:grid;grid-template-columns:1fr 54px 1fr;gap:12px;align-items:stretch}}.side{{display:grid;gap:10px;align-content:start}}.seat-row{{display:grid;grid-template-columns:1fr 1fr;gap:10px;min-height:58px}}.seat{{display:grid;grid-template-columns:34px 1fr;min-height:58px;border:1px solid #7a332d;background:#fff4f1}}.seat.no-seat{{visibility:hidden}}.no{{display:grid;place-items:center;border-right:1px solid #7a332d;color:#640b05;font-weight:700;font-size:.84rem}}.person{{padding:5px 6px;display:grid;align-content:center;gap:3px;text-align:center;min-width:0}}.name{{font-size:.72rem;line-height:1.13;font-weight:700;overflow-wrap:anywhere}}.role{{font-size:.65rem;line-height:1.13;color:#70241c;overflow-wrap:anywhere}}.empty .person{{background:#f0d6d1}}.aisle{{position:relative;background:repeating-linear-gradient(180deg,transparent 0,transparent 19px,rgba(85,0,0,.18) 20px,transparent 21px)}}.aisle:before{{position:absolute;top:0;bottom:0;left:50%;width:1px;background:rgba(85,0,0,.28);content:""}}.footer-note{{max-width:620px;margin:56px auto 0;color:#a58b86;text-align:center;font-size:.76rem;line-height:1.7}}.footer-note:before{{display:block;width:48px;height:1px;margin:0 auto 16px;background:var(--gold-deep);content:""}}@media(max-width:720px){{.shell{{padding:32px 20px 80px}}.top{{margin-bottom:32px}}.hero{{gap:16px;margin-bottom:32px}}.intro{{padding:24px}}.nav{{margin-bottom:24px}}.bus{{margin:24px 0;padding:16px}}.bus-head{{padding-bottom:16px}}.plan{{padding:12px}}.scroll{{padding-top:16px}}}}@media(prefers-reduced-motion:reduce){{*{{scroll-behavior:auto!important;transition:none!important}}}}
  </style>
  <style>
    .name{{text-transform:uppercase}}
    .front{{display:grid;grid-template-columns:1.28fr 1.08fr minmax(165px,1.8fr) 1.08fr;gap:18px;min-height:104px;margin-bottom:18px}}.crew{{display:grid;grid-template-rows:30px 58px;align-content:start}}.top-door,.kernet,.front .driver,.bottom-door,.toilet{{display:grid;place-items:center;border:1px solid #7a332d;background:#f4c6bf;color:#640b05;text-transform:uppercase;font-size:.68rem;font-weight:700;letter-spacing:.08em}}.top-door{{width:68%;min-height:30px}}.kernet{{min-height:58px}}.kernet-left{{margin-left:30px}}.kernet-center{{margin-top:27px}}.front-gap{{min-width:0}}.front .driver{{min-height:52px;margin-top:8px;background:#e7b9b1}}.seats{{align-items:start}}.left-side{{padding-bottom:0}}.rear-left{{margin-top:12px}}.bottom-door{{width:42%;min-height:28px}}.toilet{{width:82%;min-height:86px;margin-top:18px}}@media(max-width:720px){{.front{{gap:18px}}.top-door,.kernet,.front .driver,.bottom-door,.toilet{{font-size:.66rem}}}}
    
    /* Dedicated Back Row (Seats 37-42) Styling */
    .back-row-section {{
      margin-top: 16px;
      padding-top: 16px;
      border-top: 2px dashed rgba(122, 51, 45, 0.5);
    }}
    .back-row-title {{
      font-size: 0.72rem;
      font-weight: 700;
      color: #640b05;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 8px;
      text-align: center;
    }}
    .back-row-seats {{
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 8px;
    }}
  </style>
<link rel="stylesheet" href="../styles.css">
</head>
<body>
  <main class="shell">
    <header class="top"><button class="back" aria-label="Go back"><span class="material-symbols-outlined">arrow_back</span></button><div><p class="eyebrow">Safari HWMI MQ 12</p><h1>Denah Bus Sesi 2</h1></div></header>
    <section class="hero"><div class="intro"><p class="eyebrow">Data statis peserta Sesi 2</p><h2>Denah Tempat Duduk Bus Sesi 2</h2><p>Penataan tempat duduk untuk empat bus pada Sesi 2. Informasi nomor kursi, posisi pintu, kernet, dan supir sesuai dengan denah resmi yang telah ditetapkan.</p></div></section>
    <nav class="nav" aria-label="Pilih bus"><a href="#bus-1">Bus 1</a><a href="#bus-2">Bus 2</a><a href="#bus-3">Bus 3</a><a href="#bus-4">Bus 4</a></nav>
    <div id="vehicles"></div><p class="footer-note">Posisi bisa berubah sewaktu-waktu mengikuti situasi dan kondisi di lapangan.</p>
  </main>
  <script>
    const buses = {buses_json};
    const seat = (entry) => !entry ? '<div class="seat no-seat"></div>' : '<div class="seat ' + (!entry[1] ? 'empty' : '') + '"><b class="no">' + entry[0] + '</b><div class="person"><span class="name">' + entry[1] + '</span><span class="role">' + entry[2] + '</span></div></div>';
    const seatRows = (rows) => rows.map((row) => '<div class="seat-row">' + seat(row[0]) + seat(row[1]) + '</div>').join('');
    const side = (rows, hasRearArea = false) => '<div class="side' + (hasRearArea ? ' left-side' : '') + '">' + seatRows(rows) + (hasRearArea ? '<div class="rear-left"><div class="bottom-door">Pintu</div><div class="toilet">Toilet</div></div>' : '') + '</div>';
    
    const renderBackRow = (backSeats) => {{
      if (!backSeats || backSeats.length === 0) return '';
      return '<div class="back-row-section"><div class="back-row-title">Barisan Belakang (Kursi 37 - 42)</div><div class="back-row-seats">' + backSeats.map(seat).join('') + '</div></div>';
    }};

    const render = (bus,index) => {{
      const count = bus.left.flat().filter(Boolean).length + bus.right.flat().filter(Boolean).length + (bus.back ? bus.back.length : 0);
      return '<article class="bus" id="bus-' + (index + 1) + '"><header class="bus-head"><div class="bus-title"><span class="material-symbols-outlined">directions_bus</span><div><h2>Bus ' + (index + 1) + '</h2><p class="count">' + count + ' posisi tempat duduk</p></div></div><p class="eyebrow">Kendaraan ' + (index + 1) + '</p></header><div class="scroll"><div class="plan"><div class="bus-banner">Bus ' + (index + 1) + '</div><div class="front"><div class="crew"><div class="top-door">Pintu</div><div class="kernet kernet-left">Kernet</div></div><div class="kernet kernet-center">Kernet</div><div class="front-gap" aria-hidden="true"></div><div class="driver">Supir</div></div><div class="seats">' + side(bus.left, true) + '<div class="aisle" aria-hidden="true"></div>' + side(bus.right) + '</div>' + renderBackRow(bus.back) + '</div></div></article>';
    }};
    
    document.getElementById('vehicles').innerHTML = buses.map(render).join('');
  </script>
  <script src="../site-navigation.js"></script>
</body>
</html>
"""

with open(os.path.join(out_dir, "code.html"), "w", encoding="utf-8") as f:
    f.write(html_content)

print("GENERATED SUCCESSFULLY!")

import zipfile, xml.etree.ElementTree as ET, json, re, os

# 1. Extract contact data strictly from Informasi Peserta.xlsx ONLY
with zipfile.ZipFile('/Users/rizky/Documents/#Experiment/mq12-test5/Informasi Peserta.xlsx') as z:
    strings = []
    if 'xl/sharedStrings.xml' in z.namelist():
        tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
        for elem in tree.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t'):
            strings.append(elem.text or '')
    
    stree = ET.fromstring(z.read('xl/worksheets/sheet1.xml'))
    excel_rows = []
    for row in stree.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row'):
        row_vals = []
        for cell in row.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
            t = cell.get('t')
            val = cell.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
            if val is not None:
                v = val.text
                if t == 's' and int(v) < len(strings):
                    row_vals.append(strings[int(v)])
                else:
                    row_vals.append(v)
        if row_vals:
            excel_rows.append(row_vals)

rows = excel_rows[1:]
full_list = []
seen_names = set()

for r in rows:
    name = r[0].strip() if len(r) > 0 else ''
    phone = r[2].strip() if len(r) > 2 else ''
    
    if not name or name.upper() == 'NAMA':
        continue
        
    clean_phone = re.sub(r'[^\d]', '', phone)
    if clean_phone.startswith('0'):
        wa_phone = '62' + clean_phone[1:]
        fmt_phone = '0' + clean_phone[1:]
    elif clean_phone.startswith('62'):
        wa_phone = clean_phone
        fmt_phone = '0' + clean_phone[2:]
    else:
        wa_phone = clean_phone
        fmt_phone = clean_phone

    if name.lower() not in seen_names:
        seen_names.add(name.lower())
        full_list.append({
            'name': name,
            'phone': fmt_phone,
            'wa': wa_phone
        })

# Sort list alphabetically
full_list.sort(key=lambda x: x['name'])

os.makedirs('informasi_peserta_safari_hwmi_mq_12', exist_ok=True)

html_code = f"""<!DOCTYPE html>
<html class="dark" lang="id">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex, nofollow, noarchive">
<meta name="theme-color" content="#280905">
<meta name="description" content="Daftar & Kontak Peserta Safari Chubbul Wathon Minal Iman 12.">
<meta property="og:type" content="website">
<meta property="og:title" content="Daftar & Informasi Peserta - Safari HWMI MQ 12">
<meta property="og:description" content="Daftar nama dan informasi kontak peserta Safari HWMI MQ 12.">
<meta property="og:image" content="https://thomas-in-lesson.github.io/mq12-test5/og-cover.jpg">
<meta property="og:url" content="https://thomas-in-lesson.github.io/mq12-test5/">
<link rel="apple-touch-icon" href="../icon-180.png">
<link rel="icon" href="../favicon.ico" sizes="any">
<link rel="manifest" href="../manifest.json">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>Daftar & Informasi Peserta - Safari HWMI MQ 12</title>
<style>
  .card-inner-glow {{
    box-shadow: inset 1px 1px 0px 0px rgba(233, 193, 118, 0.1);
  }}
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
  Daftar & Informasi Peserta
</div>
<div class="w-10"></div>
</header>

<!-- Main Canvas -->
<main class="flex-1 w-full max-w-container-max-width mx-auto pt-20 px-margin-mobile md:px-margin-desktop md:pt-32 space-y-8">

<!-- Header Section -->
<section class="text-center space-y-4">
<h1 class="font-display-lg-mobile text-display-lg-mobile md:font-display-lg text-secondary font-bold">
  DAFTAR & KONTAK PESERTA
</h1>
<p class="font-body-md text-on-surface-variant max-w-2xl mx-auto">
  Informasi daftar nama dan kontak HP/WhatsApp resmi peserta Safari HWMI MQ 12.
</p>
<div class="w-16 h-1 bg-secondary mx-auto rounded-full opacity-50"></div>

<!-- Kolom Pencarian Nama -->
<div class="max-w-xl mx-auto relative pt-2">
  <span class="material-symbols-outlined absolute left-4 top-[22px] text-on-surface-variant text-[22px]">search</span>
  <input id="participant-search" type="text" placeholder="Ketik nama peserta untuk mencari..." class="w-full bg-surface-container border border-outline-variant/40 rounded-full py-3 pl-12 pr-10 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-secondary focus:outline-none transition-colors shadow-inner">
  <button id="clear-search" onclick="clearSearch()" class="hidden absolute right-4 top-[22px] text-on-surface-variant hover:text-secondary">
    <span class="material-symbols-outlined text-[18px]">close</span>
  </button>
</div>

<!-- Participant Counter -->
<p id="participant-counter" class="text-xs text-on-surface-variant font-medium">
  Menampilkan <span id="count-num" class="text-secondary font-bold">{len(full_list)}</span> dari {len(full_list)} peserta
</p>
</section>

<!-- Participant List Container -->
<section id="participant-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
</section>

</main>

<script>
const participantsData = {json.dumps(full_list, ensure_ascii=False)};

function renderParticipants(filterText = '') {{
  const grid = document.getElementById('participant-grid');
  const countNum = document.getElementById('count-num');
  const clearBtn = document.getElementById('clear-search');
  
  const query = filterText.toLowerCase().trim();
  if (query) {{
    clearBtn.classList.remove('hidden');
  }} else {{
    clearBtn.classList.add('hidden');
  }}

  const filtered = participantsData.filter(p => p.name.toLowerCase().includes(query));
  countNum.textContent = filtered.length;

  if (filtered.length === 0) {{
    grid.innerHTML = `
      <div class="col-span-full text-center py-12 bg-surface-container-low rounded-2xl border border-surface-variant/30 space-y-3">
        <span class="material-symbols-outlined text-4xl text-on-surface-variant/50">person_search</span>
        <p class="text-sm text-on-surface-variant font-medium">Tidak ada nama peserta yang cocok dengan "${{filterText}}"</p>
      </div>
    `;
    return;
  }}

  grid.innerHTML = filtered.map(p => {{
    const hasPhone = Boolean(p.phone && p.wa);
    const phoneDisplay = hasPhone ? p.phone : 'Nomor belum tersedia';
    
    return `
      <div class="bg-surface-container-low rounded-xl p-5 border border-surface-variant/40 shadow-md card-inner-glow flex flex-col justify-between space-y-4 hover:border-secondary/50 transition-all">
        <div class="flex items-start justify-between gap-3">
          <div class="space-y-1">
            <h3 class="font-title-lg font-bold text-primary line-clamp-1">${{p.name}}</h3>
            <p class="text-xs text-on-surface-variant flex items-center gap-1.5 font-medium">
              <span class="text-[14px]">📞</span>
              <span>${{phoneDisplay}}</span>
            </p>
          </div>
          <div class="w-10 h-10 rounded-full bg-secondary/15 text-secondary flex items-center justify-center font-bold text-sm shrink-0">
            ${{p.name.charAt(0).toUpperCase()}}
          </div>
        </div>

        ${{hasPhone ? `
        <div class="flex items-center gap-2 pt-2 border-t border-surface-variant/30">
          <a href="tel:${{p.phone}}" class="flex-1 bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface font-semibold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors">
            <span class="text-[14px]">📞</span>
            <span>Telepon</span>
          </a>
          <a href="https://wa.me/${{p.wa}}" target="_blank" class="flex-1 bg-secondary text-surface-container-lowest font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 hover:bg-secondary/90 transition-colors shadow-sm">
            <span class="text-[14px]">💬</span>
            <span>WhatsApp</span>
          </a>
        </div>
        ` : `
        <div class="pt-2 border-t border-surface-variant/30 text-center">
          <span class="text-[11px] text-on-surface-variant/70 italic">Kontak pribadi terlindungi</span>
        </div>
        `}}
      </div>
    `;
  }}).join('');
}}

document.getElementById('participant-search').addEventListener('input', (e) => {{
  renderParticipants(e.target.value);
}});

function clearSearch() {{
  const input = document.getElementById('participant-search');
  input.value = '';
  renderParticipants('');
}}

// Initial render
renderParticipants('');
</script>

<script src="../site-navigation.js"></script>
</body>
</html>
"""

with open('informasi_peserta_safari_hwmi_mq_12/code.html', 'w', encoding='utf-8') as f:
    f.write(html_code)

print(f'Successfully generated informasi_peserta_safari_hwmi_mq_12/code.html with strictly {len(full_list)} participants from Informasi Peserta.xlsx!')

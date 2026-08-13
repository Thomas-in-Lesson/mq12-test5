import re, json

with open('site-navigation.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Extract picDataSesi3 JSON array
m = re.search(r'const picDataSesi3 = (\[.*?\]);', js_content, re.DOTALL)
if not m:
    raise Exception("picDataSesi3 not found")

pics = json.loads(m.group(1))

# Group by category
grouped = {}
for p in pics:
    cat = p.get('cat', 'Lainnya')
    if cat not in grouped:
        grouped[cat] = []
    grouped[cat].append(p)

html_content = """<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="robots" content="noindex, nofollow, noarchive">
<title>Kontak Darurat & PIC - Safari HWMI MQ 12</title>
<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background-color: #280905;
    color: #ffdad4;
    margin: 0;
    padding: 20px;
    line-height: 1.5;
  }
  .container {
    max-width: 600px;
    margin: 0 auto;
  }
  h1 {
    color: #e9c176;
    font-size: 22px;
    text-align: center;
    margin-bottom: 8px;
  }
  p.subtitle {
    text-align: center;
    color: #dec0bb;
    font-size: 13px;
    margin-top: 0;
    margin-bottom: 24px;
  }
  .category-title {
    color: #e9c176;
    font-size: 16px;
    border-bottom: 1px solid #522923;
    padding-bottom: 6px;
    margin-top: 24px;
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .card {
    background-color: #33110c;
    border: 1px solid #522923;
    border-radius: 10px;
    padding: 12px 16px;
    margin-bottom: 10px;
  }
  .card-name {
    font-weight: bold;
    font-size: 15px;
    color: #ffb4a8;
  }
  .card-role {
    font-size: 12px;
    color: #dec0bb;
    margin-bottom: 8px;
  }
  .btn-group {
    display: flex;
    gap: 8px;
  }
  .btn {
    flex: 1;
    text-align: center;
    padding: 8px 12px;
    border-radius: 6px;
    text-decoration: none;
    font-size: 13px;
    font-weight: bold;
    display: inline-block;
  }
  .btn-tel {
    background-color: #381510;
    color: #ffdad4;
    border: 1px solid #573a34;
  }
  .btn-wa {
    background-color: #e9c176;
    color: #220503;
  }
  .footer {
    text-align: center;
    font-size: 12px;
    color: #dec0bb;
    margin-top: 32px;
    padding-top: 16px;
    border-top: 1px solid #522923;
  }
  .footer a {
    color: #e9c176;
    text-decoration: underline;
  }
</style>
</head>
<body>
<div class="container">
  <h1>KONTAK DARURAT & PIC</h1>
  <p class="subtitle">Daftar kontak cepat Tim Kesehatan & Keamanan Safari HWMI MQ 12 (Dapat diakses luring tanpa JavaScript).</p>
"""

for cat, items in grouped.items():
    html_content += f'  <div class="category-title">Tim {cat}</div>\n'
    for p in items:
        phone = p['phone']
        clean_phone = re.sub(r'[^\d]', '', phone)
        wa = '62' + clean_phone[1:] if clean_phone.startswith('0') else clean_phone
        html_content += f"""  <div class="card">
    <div class="card-name">{p['name']}</div>
    <div class="card-role">{p['role']}</div>
    <div class="btn-group">
      <a href="tel:{phone}" class="btn btn-tel">📞 Telepon</a>
      <a href="https://wa.me/{wa}" target="_blank" class="btn btn-wa">💬 WhatsApp</a>
    </div>
  </div>\n"""

html_content += """  <div class="footer">
    <p><a href="./">← Kembali ke Beranda Safari MQ 12</a></p>
  </div>
</div>
</body>
</html>
"""

with open('darurat.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print('Successfully generated darurat.html!')

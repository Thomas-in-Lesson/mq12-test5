import pypdf
import re
import json

reader = pypdf.PdfReader('/Users/rizky/Documents/#Experiment/Skema Foto Safari terbaru 15 Agustus 2026.pdf')

with open('peserta.json') as f:
    peserta_raw = json.load(f)

peserta_list = list(peserta_raw.values())

def find_full_name(short_name):
    clean = short_name.strip()
    if not clean:
        return short_name
    
    # Direct match in aliases or name
    for p in peserta_list:
        p_name = p.get('name', '')
        p_aliases = p.get('aliases', [])
        if clean.lower() == p_name.lower() or any(clean.lower() == a.lower() for a in p_aliases):
            return p_name
            
    # Token overlap match
    tokens = set(re.findall(r'\w+', clean.lower()))
    best_match = None
    best_score = 0
    for p in peserta_list:
        p_name = p.get('name', '')
        p_tokens = set(re.findall(r'\w+', p_name.lower()))
        common = tokens.intersection(p_tokens)
        if len(common) > best_score:
            best_score = len(common)
            best_match = p_name
            
    if best_score >= 2 or (best_score == 1 and len(tokens) == 1):
        return best_match
        
    return clean

pages_parsed = []

for idx, page in enumerate(reader.pages):
    text = page.extract_text()
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    
    items = []
    for l in lines:
        matches = re.findall(r'(\d+)[\.\s]+([A-Za-z\’\'\.\s\-]+)', l)
        for num, name in matches:
            n_clean = name.strip()
            if len(n_clean) >= 2 and not n_clean.isupper() or len(n_clean) >= 3:
                items.append({
                    'num': int(num),
                    'short_name': n_clean,
                    'full_name': find_full_name(n_clean)
                })
                
    pages_parsed.append({
        'page_num': idx + 1,
        'lines': lines,
        'items': items
    })

# Write formatted JavaScript file
output_js = f"window.SKEMA_PDF_DATA = {json.dumps(pages_parsed, ensure_ascii=False, indent=2)};"

with open('skema-data.js', 'w', encoding='utf-8') as f:
    f.write(output_js)

print(f"Generated skema-data.js with {len(pages_parsed)} pages successfully!")

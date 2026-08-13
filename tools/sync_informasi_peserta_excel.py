import zipfile, xml.etree.ElementTree as ET, json, re

# 1. Parse Excel
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

with open('peserta.json', 'r', encoding='utf-8') as f:
    peserta_json = json.load(f)

def clean_name(n):
    n = n.lower()
    n = re.sub(r'^(bpk|pak|ibu|bu|mba|mbak|drs|h|hj|s\.pd|m\.pd|st|se)\.?\s*', '', n)
    n = re.sub(r'^(m|muh|moh|muhammad)[\.\s]*', '', n)
    n = re.sub(r'[^a-z0-9]', '', n)
    return n

def format_bus(bus_str):
    bus_str = bus_str.strip().upper()
    if bus_str.startswith('BUS'):
        num = bus_str.replace('BUS', '').strip()
        return f'Bus {num}'
    return bus_str

updated_count = 0
added_count = 0

for r in rows:
    raw_name = r[0].strip() if len(r) > 0 else ''
    raw_bus = r[1].strip() if len(r) > 1 else ''
    phone = r[2].strip() if len(r) > 2 else ''
    
    if not raw_name:
        continue
        
    bus_formatted = format_bus(raw_bus)
    c_name = clean_name(raw_name)
    
    found_key = None
    # 1. Exact or clean match
    for pk, pval in peserta_json.items():
        k_clean = clean_name(pk)
        v_clean = clean_name(pval.get('name', ''))
        aliases_clean = [clean_name(a) for a in pval.get('aliases', [])]
        
        if c_name == k_clean or c_name == v_clean or c_name in aliases_clean:
            found_key = pk
            break
            
    # 2. Substring match
    if not found_key and len(c_name) >= 5:
        for pk, pval in peserta_json.items():
            k_clean = clean_name(pk)
            v_clean = clean_name(pval.get('name', ''))
            if c_name in k_clean or k_clean in c_name or c_name in v_clean or v_clean in c_name:
                found_key = pk
                break

    if found_key:
        profile = peserta_json[found_key]
        if 'transport' not in profile:
            profile['transport'] = {}
        profile['transport']['sesi3'] = bus_formatted
        if 'aliases' not in profile:
            profile['aliases'] = []
        if raw_name not in profile['aliases'] and raw_name != profile['name']:
            profile['aliases'].append(raw_name)
        updated_count += 1
    else:
        # Create new canonical profile if not found
        new_profile = {
            "name": raw_name,
            "aliases": [raw_name],
            "transport": {
                "sesi1": None,
                "sesi3": bus_formatted
            },
            "menginap": []
        }
        peserta_json[c_name] = new_profile
        added_count += 1

print(f'Successfully updated {updated_count} existing profiles with Bus info from Excel.')
print(f'Added {added_count} new participant profiles from Excel.')
print(f'Total profiles in peserta.json now: {len(peserta_json)}')

with open('peserta.json', 'w', encoding='utf-8') as f:
    json.dump(peserta_json, f, ensure_ascii=False, indent=2)

print('Saved updated peserta.json successfully!')

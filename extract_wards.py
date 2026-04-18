import openpyxl
wb = openpyxl.load_workbook('BBMP_198_Wards_Complete_Data.xlsx')
ws = wb.active
wards = []
for row in list(ws.iter_rows())[3:]:
    ward_no = row[0].value
    if not ward_no or not isinstance(ward_no, int):
        continue
    wards.append({
        'ward_id': ward_no,
        'ward_name': str(row[1].value or '').strip(),
        'zone': str(row[2].value or '').strip(),
        'assembly_constituency': str(row[3].value or '').strip(),
        'mla_name': str(row[4].value or '').strip(),
        'mla_party': str(row[5].value or '').strip(),
        'mp_constituency': str(row[6].value or '').strip(),
        'mp_name': str(row[7].value or '').strip(),
        'mp_party': str(row[8].value or '').strip(),
        'corporator': str(row[9].value or '').strip(),
        'local_administrator': str(row[10].value or '').strip(),
        'latitude': float(row[11].value) if row[11].value else 0,
        'longitude': float(row[12].value) if row[12].value else 0,
    })

lines = []
for w in wards:
    wn = w['ward_name'].replace('"', '\\"')
    z = w['zone'].replace('"', '\\"')
    ac = w['assembly_constituency'].replace('"', '\\"')
    mn = w['mla_name'].replace('"', '\\"')
    mp = w['mla_party'].replace('"', '\\"')
    mc = w['mp_constituency'].replace('"', '\\"')
    mpn = w['mp_name'].replace('"', '\\"')
    mpp = w['mp_party'].replace('"', '\\"')
    co = w['corporator'].replace('"', '\\"')
    la = w['local_administrator'].replace('"', '\\"')
    lines.append(f'  {{ ward_id: {w["ward_id"]}, ward_name: "{wn}", zone: "{z}", assembly_constituency: "{ac}", mla_name: "{mn}", mla_party: "{mp}", mp_constituency: "{mc}", mp_name: "{mpn}", mp_party: "{mpp}", corporator: "{co}", local_administrator: "{la}", latitude: {w["latitude"]}, longitude: {w["longitude"]} }},')

with open('ward_entries.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print(f'Exported {len(wards)} wards to ward_entries.txt')

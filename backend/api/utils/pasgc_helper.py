#api/utils/pasgc_helper.py
import csv
import os
CSV_PATH = r".\ml\resilience\manila_barangays\filtered_psgc_lookup.csv"
PSGC_LOOKUP = {}
# Load once when Django starts
with open(CSV_PATH, newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        try:
            code = int(row["psgc_int"])
            name = row["adm4_en"].strip()
            PSGC_LOOKUP[code] = name
        except (ValueError, KeyError):
            continue
def get_barangay_from_psgc(psgc_code):
    if not psgc_code:
        return None
    try:
        return PSGC_LOOKUP.get(int(psgc_code))
    except (ValueError, TypeError):
        return None
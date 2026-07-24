with open(r"c:\ADULTING\portfolio\styles.css", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "browser-shell" in line:
        print(f"L{i+1}: {line.strip()}")

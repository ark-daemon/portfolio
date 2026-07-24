import os

for root, dirs, files in os.walk(r"c:\ADULTING\portfolio"):
    for f in files:
        if f.endswith('.png') or f.endswith('.jpg') or f.endswith('.webp'):
            print(os.path.join(root, f))

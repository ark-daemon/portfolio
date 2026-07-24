import os

screenshots_dir = r"c:\ADULTING\portfolio\screenshots"
if os.path.exists(screenshots_dir):
    files = os.listdir(screenshots_dir)
    print("Files in screenshots directory:")
    for f in files:
        print("  -", f)
else:
    print("screenshots directory does not exist!")

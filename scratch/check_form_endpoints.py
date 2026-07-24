import os
import re

files_to_check = [f for f in os.listdir('.') if os.path.isfile(f)]

endpoint_keywords = ['web3forms', 'formspree', 'formsubmit', 'api.hsforms.com', 'worker', 'access_key', 'form_endpoint']

found = []
for f_name in files_to_check:
    if f_name.endswith(('.html', '.js', '.json', '.env', '.txt', '.py')):
        with open(f_name, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        for kw in endpoint_keywords:
            if kw in content.lower():
                found.append((f_name, kw))

print(f"Form Endpoint / Access Key Search Results: {found}")

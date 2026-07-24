from PIL import Image, ImageDraw, ImageFont

# Create a 1200x630 image (standard Open Graph size)
img = Image.new('RGB', (1200, 630), color='#09090b')
draw = ImageDraw.Draw(img)

# Outer border
draw.rectangle([20, 20, 1180, 610], outline='#27272a', width=2)

# Text content
draw.text((80, 140), "NOAH CARPISO", fill='#ffffff', font_size=56)
draw.text((80, 230), "Remote Operations & Automation Specialist", fill='#a1a1aa', font_size=32)
draw.text((80, 320), "• Community Operations & Ticket Triage (500+ members)", fill='#71717a', font_size=24)
draw.text((80, 365), "• Partnership Coordination (100+ collabs managed)", fill='#71717a', font_size=24)
draw.text((80, 410), "• Custom Python Scrapers & n8n / Make.com Workflows", fill='#71717a', font_size=24)

draw.text((80, 510), "https://noah-carpiso.pages.dev · Metro Manila, PH", fill='#e4e4e7', font_size=22)

img.save('og.png')
print("Generated high-res 1200x630 og.png Open Graph preview image!")

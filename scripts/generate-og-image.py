import os
from PIL import Image

def generate_og_image():
    W, H = 1200, 630
    bg_path = 'public/images/hero-warehouse.webp'
    
    if os.path.exists(bg_path):
        img = Image.open(bg_path).convert('RGB')
        bw, bh = img.size
        aspect = W / H
        bg_aspect = bw / bh

        if bg_aspect > aspect:
            new_w = int(bh * aspect)
            left = (bw - new_w) // 2
            cropped = img.crop((left, 0, left + new_w, bh))
        else:
            new_h = int(bw / aspect)
            top = (bh - new_h) // 2
            cropped = img.crop((0, top, bw, top + new_h))

        resized = cropped.resize((W, H), Image.Resampling.LANCZOS)
        
        os.makedirs('public/images', exist_ok=True)
        resized.save('public/images/og-image.jpg', 'JPEG', quality=95)
        resized.save('public/images/og-image.webp', 'WEBP', quality=95)
        resized.save('public/images/hero-warehouse-og.webp', 'WEBP', quality=95)
        resized.save('public/og-image.png', 'PNG')
        resized.save('public/images/og-image.png', 'PNG')
        print(f"Clean OG warehouse image generated at {W}x{H} (1.91:1 aspect ratio).")

if __name__ == '__main__':
    generate_og_image()

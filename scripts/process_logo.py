from PIL import Image

def process():
    src_path = 'src/assets/logo.png'
    img = Image.open(src_path).convert('RGBA')
    width, height = img.size

    # Let's find the vertical column with the minimum dark pixels between x = 100 and x = 300
    pixels = img.load()
    
    # Count alpha / dark pixels in each column
    col_counts = []
    for x in range(width):
        cnt = sum(1 for y in range(height) if pixels[x, y][3] > 50)
        col_counts.append(cnt)

    # The gap between 'O' and 'a': look in range 150 to 250
    # Find minimum count in range [150, 250]
    min_col = 150
    min_val = 9999
    for x in range(150, min(260, width)):
        if col_counts[x] < min_val:
            min_val = col_counts[x]
            min_col = x

    print(f"Gap between 'O' and 'a' found at x={min_col} with count={min_val}")
    
    # Crop mark strictly from 0 to min_col
    mark_img = img.crop((0, 0, min_col, height))
    
    # Tight crop mark
    m_min_x, m_min_y = mark_img.size[0], mark_img.size[1]
    m_max_x, m_max_y = 0, 0
    m_px = mark_img.load()
    for y in range(mark_img.size[1]):
        for x in range(mark_img.size[0]):
            if m_px[x, y][3] > 30:
                if x < m_min_x: m_min_x = x
                if y < m_min_y: m_min_y = y
                if x > m_max_x: m_max_x = x
                if y > m_max_y: m_max_y = y
    
    m_pad = 6
    mark_cropped = mark_img.crop((max(0, m_min_x - m_pad), max(0, m_min_y - m_pad),
                                  min(mark_img.size[0], m_max_x + m_pad),
                                  min(mark_img.size[1], m_max_y + m_pad)))
    mark_cropped.save('src/assets/logo-mark.png', 'PNG')

    # Save favicon (64x64) and (32x32) with aspect ratio preserved
    fav_size = 64
    fav = Image.new('RGBA', (fav_size, fav_size), (0, 0, 0, 0))
    mw, mh = mark_cropped.size
    ratio = min((fav_size - 8) / mw, (fav_size - 8) / mh)
    nw, nh = int(mw * ratio), int(mh * ratio)
    resized_mark = mark_cropped.resize((nw, nh), Image.Resampling.LANCZOS)
    fav.paste(resized_mark, ((fav_size - nw) // 2, (fav_size - nh) // 2), resized_mark)
    fav.save('public/favicon.png', 'PNG')
    
    # Also write a crisp SVG favicon
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <clipPath id="circle-cut">
      <circle cx="50" cy="50" r="45" />
    </clipPath>
  </defs>
  <!-- Top crescent -->
  <path d="M 12,50 A 42,42 0 1,1 88,50 A 42,32 0 0,0 12,50 Z" fill="#1D1D1F" />
  <!-- Bottom wave -->
  <path d="M 12,58 Q 50,42 88,68 A 42,42 0 0,1 12,58 Z" fill="#1D1D1F" />
</svg>'''
    with open('public/favicon.svg', 'w') as f:
        f.write(svg_content)
    print("Updated logo-mark.png, public/favicon.png, and public/favicon.svg")

if __name__ == '__main__':
    process()

import os, sys, django, requests
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'carmarket.settings')
django.setup()
sys.stdout.reconfigure(encoding='utf-8')

from django.core.files.base import ContentFile
from cars.models import CarPost, CarImage

HEADERS = {'User-Agent': 'CarMarket/1.0 (educational project; contact@carmarket.mk)'}

# Wikipedia article title(s) to try per post (in order of preference)
WIKI_TITLES = {
    'VW Golf IV 1.9 TDI 90ks':         ['Volkswagen Golf Mk4', 'Volkswagen Golf (Mk4)'],
    'BMW 320d E46':                      ['BMW 3 Series (E46)', 'BMW E46'],
    'Audi A4 B7':                        ['Audi A4 (B7)', 'Audi A4 B7'],
    'Opel Astra G':                      ['Opel Astra G', 'Vauxhall Astra (Mk4)'],
    'Mercedes C220 CDI W203':            ['Mercedes-Benz C-Class (W203)', 'Mercedes-Benz W203'],
    'Renault Clio III':                  ['Renault Clio III', 'Renault Clio (2005)'],
    'Volkswagen Passat B6':              ['Volkswagen Passat (B6)', 'Volkswagen Passat B6'],
}

def match_post(post_title):
    for key in WIKI_TITLES:
        if key.lower() in post_title.lower():
            return WIKI_TITLES[key]
    return []

def get_wiki_image_urls(article_title, count=3):
    """Return up to `count` image URLs from a Wikipedia article."""
    urls = []
    try:
        # Get all images listed on the page
        r = requests.get(
            'https://en.wikipedia.org/w/api.php',
            params={
                'action': 'query',
                'titles': article_title,
                'prop': 'images',
                'imlimit': 20,
                'format': 'json',
            },
            headers=HEADERS, timeout=15
        )
        data = r.json()
        pages = data.get('query', {}).get('pages', {})
        image_titles = []
        for page in pages.values():
            if page.get('pageid', -1) == -1:
                continue
            for img in page.get('images', []):
                name = img['title']
                ext = name.rsplit('.', 1)[-1].lower()
                if ext in ('jpg', 'jpeg', 'png') and 'logo' not in name.lower() and 'icon' not in name.lower():
                    image_titles.append(name)

        # Resolve each image title to a direct URL
        for img_title in image_titles[:10]:
            try:
                r2 = requests.get(
                    'https://en.wikipedia.org/w/api.php',
                    params={
                        'action': 'query',
                        'titles': img_title,
                        'prop': 'imageinfo',
                        'iiprop': 'url',
                        'iiurlwidth': 900,
                        'format': 'json',
                    },
                    headers=HEADERS, timeout=10
                )
                d2 = r2.json()
                for pg in d2.get('query', {}).get('pages', {}).values():
                    info = pg.get('imageinfo', [])
                    if info:
                        thumb = info[0].get('thumburl') or info[0].get('url')
                        if thumb:
                            urls.append(thumb)
                            break
            except Exception:
                continue
            if len(urls) >= count:
                break
    except Exception as e:
        print(f'    Wiki API error for "{article_title}": {e}')
    return urls[:count]

def download(url):
    try:
        r = requests.get(url, headers=HEADERS, timeout=20)
        if r.status_code == 200 and 'image' in r.headers.get('content-type', ''):
            return r.content
    except Exception as e:
        print(f'    Download error: {e}')
    return None

# ── MAIN ────────────────────────────────────────────────────────────────────

posts = CarPost.objects.all()
print(f'Found {posts.count()} posts.\n')

for post in posts:
    # Skip posts that already have images
    if post.images.exists():
        print(f'[SKIP] {post.title[:50]} — already has images')
        continue

    titles_to_try = match_post(post.title)
    if not titles_to_try:
        print(f'[SKIP] {post.title[:50]} — no Wikipedia mapping')
        continue

    print(f'[POST] {post.title[:55]}')
    image_urls = []

    for wiki_title in titles_to_try:
        print(f'  Trying Wikipedia: "{wiki_title}"')
        image_urls = get_wiki_image_urls(wiki_title, count=3)
        if image_urls:
            break

    if not image_urls:
        print(f'  No images found.\n')
        continue

    saved = 0
    for order, url in enumerate(image_urls):
        print(f'  Downloading image {order + 1}: {url[:80]}')
        content = download(url)
        if not content:
            print(f'  Failed.')
            continue

        ext = url.rsplit('.', 1)[-1].split('?')[0].lower()
        if ext not in ('jpg', 'jpeg', 'png'):
            ext = 'jpg'

        filename = f'car_{post.id}_{order}.{ext}'
        img = CarImage(post=post, order=order)
        img.image.save(filename, ContentFile(content), save=True)
        saved += 1
        print(f'  Saved as {filename}')

    print(f'  Done — {saved} image(s) saved.\n')

print('All finished.')

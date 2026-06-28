import os, sys, django, requests
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'carmarket.settings')
django.setup()
sys.stdout.reconfigure(encoding='utf-8')

from django.core.files.base import ContentFile
from cars.models import CarPost, CarImage

HEADERS = {'User-Agent': 'CarMarket/1.0 (educational project; contact@carmarket.mk)'}

# Direct Wikimedia image URLs for the cars that failed
DIRECT_IMAGES = {
    'Renault Clio III': [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Renault_Clio_III_phase_II_20091130_front.jpg/960px-Renault_Clio_III_phase_II_20091130_front.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Renault_Clio_III_phase_II_20091129_rear.jpg/960px-Renault_Clio_III_phase_II_20091129_rear.jpg',
    ],
    'Opel Astra G': [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Opel_Astra_G_Caravan_front_20100502.jpg/960px-Opel_Astra_G_Caravan_front_20100502.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Opel_Astra_G_Caravan_rear_20100502.jpg/960px-Opel_Astra_G_Caravan_rear_20100502.jpg',
    ],
    'Audi A4 B7': [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/2006_Audi_A4_2.0T_quattro_%28B7%29%2C_front_8.20.19.jpg/960px-2006_Audi_A4_2.0T_quattro_%28B7%29%2C_front_8.20.19.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Audi_A4_B7_Limousine_front.jpg/960px-Audi_A4_B7_Limousine_front.jpg',
    ],
}

# Fallback: search Wikipedia API with broader terms
WIKI_FALLBACKS = {
    'Renault Clio III': ['Renault Clio', 'Renault'],
    'Opel Astra G':     ['Opel Astra', 'Vauxhall Astra'],
    'Audi A4 B7':       ['Audi A4', 'Audi'],
}

def try_direct_urls(urls):
    for url in urls:
        try:
            r = requests.get(url, headers=HEADERS, timeout=20)
            if r.status_code == 200 and 'image' in r.headers.get('content-type', ''):
                return url, r.content
        except Exception:
            continue
    return None, None

def get_images_via_api(article_title, count=2):
    results = []
    try:
        r = requests.get(
            'https://en.wikipedia.org/w/api.php',
            params={'action': 'query', 'titles': article_title, 'prop': 'pageimages',
                    'format': 'json', 'pithumbsize': 900},
            headers=HEADERS, timeout=15
        )
        data = r.json()
        for page in data.get('query', {}).get('pages', {}).values():
            thumb = page.get('thumbnail', {}).get('source')
            if thumb:
                results.append(thumb)
    except Exception:
        pass
    return results[:count]

posts_to_fix = {
    'Renault Clio III': CarPost.objects.filter(title__icontains='Renault Clio').first(),
    'Opel Astra G':     CarPost.objects.filter(title__icontains='Opel Astra').first(),
    'Audi A4 B7':       CarPost.objects.filter(title__icontains='Audi A4').first(),
}

for car_key, post in posts_to_fix.items():
    if not post:
        print(f'[SKIP] {car_key} — post not found')
        continue
    if post.images.exists():
        print(f'[SKIP] {car_key} — already has images')
        continue

    print(f'[POST] {post.title[:55]}')
    saved = 0

    # Try direct URLs first
    for url in DIRECT_IMAGES.get(car_key, []):
        print(f'  Trying direct: {url[:80]}...')
        try:
            r = requests.get(url, headers=HEADERS, timeout=20)
            if r.status_code == 200 and 'image' in r.headers.get('content-type', ''):
                ext = url.rsplit('.', 1)[-1].split('?')[0][:4].lower()
                if ext not in ('jpg', 'jpeg', 'png', 'webp'):
                    ext = 'jpg'
                filename = f'car_{post.id}_{saved}.{ext}'
                img = CarImage(post=post, order=saved)
                img.image.save(filename, ContentFile(r.content), save=True)
                saved += 1
                print(f'  Saved as {filename}')
            else:
                print(f'  HTTP {r.status_code}')
        except Exception as e:
            print(f'  Error: {e}')

    # If direct URLs didn't work, try Wikipedia API fallbacks
    if saved == 0:
        for fallback_title in WIKI_FALLBACKS.get(car_key, []):
            print(f'  Trying API: "{fallback_title}"')
            urls = get_images_via_api(fallback_title, count=2)
            for url in urls:
                try:
                    r = requests.get(url, headers=HEADERS, timeout=20)
                    if r.status_code == 200 and 'image' in r.headers.get('content-type', ''):
                        filename = f'car_{post.id}_{saved}.jpg'
                        img = CarImage(post=post, order=saved)
                        img.image.save(filename, ContentFile(r.content), save=True)
                        saved += 1
                        print(f'  Saved as {filename}')
                except Exception as e:
                    print(f'  Error: {e}')
            if saved > 0:
                break

    print(f'  Done — {saved} image(s) saved.\n')

print('Retry complete.')
print('\nFinal image counts:')
for post in CarPost.objects.all():
    count = post.images.count()
    status = '✓' if count > 0 else '✗'
    print(f'  {status} {post.title[:50]} — {count} image(s)')

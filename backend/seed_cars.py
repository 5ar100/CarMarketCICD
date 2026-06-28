import os, sys
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'carmarket.settings')
import django; django.setup()
sys.stdout.reconfigure(encoding='utf-8')

from django.contrib.auth.models import User
from cars.models import CarPost

CarPost.objects.all().delete()
User.objects.filter(is_superuser=False).delete()

users_data = [
    ('marko_ns',   'marko@gmail.com',   'pass1234'),
    ('zeljko_bg',  'zeljko@gmail.com',  'pass1234'),
    ('damir_zg',   'damir@gmail.com',   'pass1234'),
    ('stefan_nis', 'stefan@gmail.com',  'pass1234'),
    ('mujo_sa',    'mujo@gmail.com',    'pass1234'),
    ('ivan_lj',    'ivan@gmail.com',    'pass1234'),
    ('goran_sk',   'goran@gmail.com',   'pass1234'),
]
users = [User.objects.create_user(u, e, p) for u, e, p in users_data]
print(f'Created {len(users)} users')

cars = [
    {
        'author': users[0], 'year': 2002, 'fuel_type': 'diesel', 'transmission': 'manual',
        'horsepower': 90, 'mileage': 187000, 'price': '5800.00',
        'title': 'VW Golf IV 1.9 TDI 90ks – Odlično stanje',
        'description': (
            'Prodajem Golf 4 iz 2002. godine, 1.9 TDI motor, 90 konjskih snaga. '
            'Prešao 187.000 km, sve redovno servisiran kod ovlašćenog servisa. '
            'Novo ulje i filteri, nova kvačila, kočnice ispravne. '
            'Klima radi besprekorno, centralna brava, el. podizači stakala. '
            'Karošerija bez rđe, farbana samo prednja hauba zbog kozmetičkog oštećenja. '
            'Registrovan do aprila 2026. Nije bio u udaru. Cena fiksna.'
        ),
        'contact_info': '+381 63 7421 889 – Marko (pozivi i Viber)',
    },
    {
        'author': users[1], 'year': 2003, 'fuel_type': 'diesel', 'transmission': 'manual',
        'horsepower': 150, 'mileage': 224000, 'price': '8200.00',
        'title': 'BMW 320d E46 2003 – Facelift, Koža, Xenon',
        'description': (
            'BMW 320d E46 facelift, godište 2003, 150ks, 6-brzinski manuelni menjač. '
            'Prešao 224.000 km, urađen veliki servis – zupčasti kaiš, vodni pumpa. '
            'Originalna kožna unutrašnjost, xenon farovi, serijska navigacija. '
            'Klimatronik, el. sedišta sa grejanjem, tempomat. Auto uvezen iz Nemačke 2011.'
        ),
        'contact_info': '+381 64 1234 567 – Željko',
    },
    {
        'author': users[2], 'year': 2006, 'fuel_type': 'diesel', 'transmission': 'manual',
        'horsepower': 140, 'mileage': 196000, 'price': '9500.00',
        'title': 'Audi A4 B7 2.0 TDI 140ks – Full Oprema, HR auto',
        'description': (
            'Prodajem Audi A4 B7 limuzinu, 2006. godište, 2.0 TDI 140ks, 6-brzinski. '
            'Kilometraža: 196.000 – sve dokumentirano računima iz servisa. '
            'S-Line vanjski paket, 18" Audi originalne felge, sportsko vješanje. '
            'Unutra: navigacija MMI, bluetooth, grijana prednja sjedala, dvostepena klima.'
        ),
        'contact_info': '+385 91 456 7890 – Damir (WhatsApp dostupan)',
    },
    {
        'author': users[3], 'year': 2001, 'fuel_type': 'petrol', 'transmission': 'manual',
        'horsepower': 101, 'mileage': 162000, 'price': '3200.00',
        'title': 'Opel Astra G 1.6 16V 2001 – Tek registrovan',
        'description': (
            'Astra G karavan, 2001. godište, benzin 1.6 16V, 101ks. '
            'Pređeno 162.000 km, motor tiho radi, bez dima. '
            'Tek položen tehnički pregled, registracija godinu dana. '
            'Nova akumulator, pojačivač kočnica skoro menjani. Enterijer čist i uredan.'
        ),
        'contact_info': '+381 60 9988 112 – Stefan, Niš',
    },
    {
        'author': users[4], 'year': 2004, 'fuel_type': 'diesel', 'transmission': 'automatic',
        'horsepower': 150, 'mileage': 211000, 'price': '10500.00',
        'title': 'Mercedes C220 CDI W203 2004 – Elegance, Automatik',
        'description': (
            'Mercedes-Benz C 220 CDI automatik, 2004. godišta, 150ks, Elegance oprema. '
            'Kilometer: 211.000, motor ispravan, mjenjač radi besprijekorno. '
            'Oprema: navigacija Comand, parktronic, kožna unutrašnjost, grijana sjedišta, '
            'xenon farovi. Auto uvezen iz Austrije, paket dokumentacije potpun.'
        ),
        'contact_info': '+387 61 334 221 – Mujo (poziv ili WhatsApp)',
    },
    {
        'author': users[5], 'year': 2009, 'fuel_type': 'diesel', 'transmission': 'manual',
        'horsepower': 75, 'mileage': 143000, 'price': '4400.00',
        'title': 'Renault Clio III 1.5 dCi 75ks – 2009, Ekonomičan',
        'description': (
            'Renault Clio III, 2009. letnik, 1.5 dCi diesel, 75ks. '
            'Prevoženih 143.000 km, motor brezhibno deluje, poraba 4.5L/100km. '
            'Servisna knjižica popolna, zadnji servis opravljen pred 3 meseci. '
            'Oprema: električna okna, centralna zaklepanje, radio/CD.'
        ),
        'contact_info': '+386 41 778 903 – Ivan, Ljubljana',
    },
    {
        'author': users[6], 'year': 2007, 'fuel_type': 'diesel', 'transmission': 'manual',
        'horsepower': 105, 'mileage': 178000, 'price': '7100.00',
        'title': 'Volkswagen Passat B6 1.9 TDI 2007 – 105ks, Navigacija',
        'description': (
            'VW Passat B6 limuzina, 2007 godina, 1.9 TDI, 105ks, 6-brzinski manuelen menuvac. '
            'Pominati 178.000 km, celosno servisian, dokumentiran. '
            'Oprema: RNS 510 navigacija, klimatronik, tempomat, predni i zadni parktronic, '
            'el. podignuvaci, centralna brava so dalechinsko upravuvanje.'
        ),
        'contact_info': '+389 70 245 678 – Goran, Skopje',
    },
]

for car in cars:
    post = CarPost.objects.create(**car)
    print(f'  + {post.title[:55]}')

print(f'\nDone — {CarPost.objects.count()} posts in PostgreSQL.')

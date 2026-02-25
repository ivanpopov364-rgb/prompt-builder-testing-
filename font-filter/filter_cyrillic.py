import pandas as pd
import requests
import json
import os

def get_cyrillic_fonts():
    api_key = os.environ.get('GOOGLE_FONTS_API_KEY')
    if api_key:
        url = f'https://www.googleapis.com/webfonts/v1/webfonts?key={api_key}&subset=cyrillic'
        try:
            resp = requests.get(url)
            if resp.status_code == 200:
                data = resp.json()
                fonts = [item['family'] for item in data['items']]
                print(f"Получено {len(fonts)} кириллических шрифтов через API")
                return fonts
            else:
                print(f"Ошибка API: {resp.status_code}, использую fallback-список")
        except Exception as e:
            print(f"Ошибка подключения к API: {e}")

    print("Использую встроенный fallback-список (может быть неполным)")
    return [
        'Roboto', 'Open Sans', 'Montserrat', 'PT Sans', 'PT Serif', 'Rubik',
        'IBM Plex Sans', 'Inter', 'Nunito', 'Ubuntu', 'Caveat', 'Comfortaa',
        'Fira Sans', 'Exo 2', 'Oswald', 'Cormorant', 'Playfair Display',
        'Source Sans Pro', 'Merriweather', 'Lora', 'Raleway', 'Muli',
        'Alegreya', 'Cabin', 'Droid Sans', 'Droid Serif', 'Jura', 'Kelly Slab',
        'Lobster', 'Oranienbaum', 'Pangolin', 'Poiret One', 'Press Start 2P',
        'Princess Sofia', 'Prosto One', 'Ruslan Display', 'Russo One',
        'Scada', 'Stalinist One', 'Structuris', 'Tenor Sans', 'Unbounded',
        'Vollkorn', 'Yanone Kaffeesatz', 'Ysabeau'
    ]

metadata_path = 'font-filter/metadata.tsv'
vectors_path = 'font-filter/vectors-200.tsv'

metadata = pd.read_csv(metadata_path, sep='\t', header=None, names=['font_name'])
vectors = pd.read_csv(vectors_path, sep='\t', header=None)

assert len(metadata) == len(vectors), "Несовпадение количества строк"

cyrillic_fonts = get_cyrillic_fonts()
cyrillic_lower = [f.lower() for f in cyrillic_fonts]
metadata['font_lower'] = metadata['font_name'].str.lower()
mask = metadata['font_lower'].isin(cyrillic_lower)

print(f"Найдено {mask.sum()} шрифтов с поддержкой кириллицы из {len(metadata)}")

metadata_filtered = metadata.loc[mask, ['font_name']].reset_index(drop=True)
vectors_filtered = vectors.loc[mask].reset_index(drop=True)

metadata_filtered.to_csv('font-filter/metadata_cyrillic.tsv', sep='\t', index=False, header=False)
vectors_filtered.to_csv('font-filter/vectors_cyrillic.tsv', sep='\t', index=False, header=False)

font_dict = {}
for idx, row in metadata_filtered.iterrows():
    font_dict[row['font_name']] = vectors_filtered.iloc[idx].tolist()

with open('font-filter/fonts_cyrillic.json', 'w', encoding='utf-8') as f:
    json.dump(font_dict, f, ensure_ascii=False, indent=2)

print("Готово! Файлы сохранены в font-filter/")

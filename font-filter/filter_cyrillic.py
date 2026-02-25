import pandas as pd
import requests
import json
import os

# -------------------------------------------------------------------
# НАСТРОЙКИ ПУТЕЙ (измените, если ваши исходные файлы лежат в другой папке)
# -------------------------------------------------------------------
# Путь к исходным данным Fontjoy (относительно корня репозитория)
METADATA_PATH = 'old-data/metadata.tsv'          # ⚠️ измените, если папка другая
VECTORS_PATH = 'old-data/vectors-200.tsv'        # ⚠️ измените, если папка другая

# Папка для сохранения результатов (должна существовать)
OUTPUT_DIR = 'font-filter'                            # ⚠️ измените, если хотите другую папку
# -------------------------------------------------------------------

def get_cyrillic_fonts():
    """Получение списка кириллических шрифтов (через API Google Fonts или fallback)"""
    api_key = os.environ.get('GOOGLE_FONTS_API_KEY')
    if api_key:
        url = f'https://www.googleapis.com/webfonts/v1/webfonts?key={api_key}&subset=cyrillic'
        try:
            resp = requests.get(url)
            if resp.status_code == 200:
                data = resp.json()
                fonts = [item['family'] for item in data['items']]
                print(f"✅ Получено {len(fonts)} кириллических шрифтов через API")
                return fonts
            else:
                print(f"⚠️ Ошибка API: {resp.status_code}, использую fallback-список")
        except Exception as e:
            print(f"⚠️ Ошибка подключения к API: {e}")

    print("ℹ️ Использую встроенный fallback-список (может быть неполным)")
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

# -------------------------------------------------------------------
# Загрузка исходных данных
# -------------------------------------------------------------------
print(f"📂 Загрузка метаданных из {METADATA_PATH}")
metadata = pd.read_csv(METADATA_PATH, sep='\t', header=None, names=['font_name'])

print(f"📂 Загрузка векторов из {VECTORS_PATH}")
vectors = pd.read_csv(VECTORS_PATH, sep='\t', header=None)

print(f"📊 metadata.tsv: {len(metadata)} строк")
print(f"📊 vectors-200.tsv: {len(vectors)} строк")

# Если количество строк не совпадает, обрезаем до меньшего
if len(metadata) != len(vectors):
    print(f"⚠️ Количество строк не совпадает! Обрезаем до {min(len(metadata), len(vectors))} строк.")
    min_len = min(len(metadata), len(vectors))
    metadata = metadata.iloc[:min_len].reset_index(drop=True)
    vectors = vectors.iloc[:min_len].reset_index(drop=True)

# -------------------------------------------------------------------
# Фильтрация по кириллице
# -------------------------------------------------------------------
cyrillic_fonts = get_cyrillic_fonts()
cyrillic_lower = [f.lower() for f in cyrillic_fonts]
metadata['font_lower'] = metadata['font_name'].str.lower()
mask = metadata['font_lower'].isin(cyrillic_lower)

found = mask.sum()
print(f"🎯 Найдено {found} шрифтов с поддержкой кириллицы из {len(metadata)}")

metadata_filtered = metadata.loc[mask, ['font_name']].reset_index(drop=True)
vectors_filtered = vectors.loc[mask].reset_index(drop=True)

# -------------------------------------------------------------------
# Сохранение результатов в папку OUTPUT_DIR
# -------------------------------------------------------------------
os.makedirs(OUTPUT_DIR, exist_ok=True)  # создаст папку, если её нет

metadata_filtered.to_csv(f'{OUTPUT_DIR}/metadata_cyrillic.tsv', sep='\t', index=False, header=False)
vectors_filtered.to_csv(f'{OUTPUT_DIR}/vectors_cyrillic.tsv', sep='\t', index=False, header=False)

# Сохраняем также в JSON для удобства использования в JavaScript
font_dict = {}
for idx, row in metadata_filtered.iterrows():
    font_dict[row['font_name']] = vectors_filtered.iloc[idx].tolist()

with open(f'{OUTPUT_DIR}/fonts_cyrillic.json', 'w', encoding='utf-8') as f:
    json.dump(font_dict, f, ensure_ascii=False, indent=2)

print(f"✅ Готово! Файлы сохранены в папку '{OUTPUT_DIR}':")
print(f"   - metadata_cyrillic.tsv")
print(f"   - vectors_cyrillic.tsv")
print(f"   - fonts_cyrillic.json")

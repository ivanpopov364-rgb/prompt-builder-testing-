// Глобальная переменная для хранения данных о шрифтах
let fontVectors = {};
let fontNames = [];

// Загружаем данные при загрузке страницы
fetch('font-filter/fonts_cyrillic.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Ошибка загрузки данных о шрифтах');
    }
    return response.json();
  })
  .then(data => {
    fontVectors = data;
    fontNames = Object.keys(fontVectors); // получаем массив названий
    console.log(`Загружено ${fontNames.length} кириллических шрифтов`);

    // Если вкладка "Дизайн и цвета" уже инициализирована (или будет позже), вызываем initDesignTab
    // Но лучше вызвать после того, как DOM готов
    if (document.getElementById('base-font')) {
      initDesignTab();
    }
  })
  .catch(error => {
    console.error('Ошибка:', error);
    // Показать сообщение пользователю, если элемент существует
    const previewArea = document.getElementById('font-preview');
    if (previewArea) {
      previewArea.innerHTML = '<p class="error">Не удалось загрузить данные о шрифтах. Попробуйте позже.</p>';
    }
  });

// Инициализация вкладки дизайна (заполнение селектов)
function initDesignTab() {
  const baseSelect = document.getElementById('base-font');
  const contrastSelect = document.getElementById('contrast-font');
  
  if (!baseSelect || !contrastSelect) return; // если элементов нет, выходим

  // Заполняем выпадающие списки названиями шрифтов
  fontNames.forEach(fontName => {
    const option1 = document.createElement('option');
    option1.value = fontName;
    option1.textContent = fontName;
    baseSelect.appendChild(option1);
    
    const option2 = document.createElement('option');
    option2.value = fontName;
    option2.textContent = fontName;
    contrastSelect.appendChild(option2);
  });
  
  // Устанавливаем начальные значения (первые два разных шрифта)
  if (fontNames.length >= 2) {
    baseSelect.value = fontNames[0];
    // Ищем второй шрифт, отличный от первого
    let secondFont = fontNames[1];
    if (secondFont === fontNames[0] && fontNames.length > 1) secondFont = fontNames[1];
    contrastSelect.value = secondFont;
  } else if (fontNames.length === 1) {
    baseSelect.value = fontNames[0];
    contrastSelect.value = fontNames[0];
  }

  // Добавляем обработчики событий (убираем onchange из HTML)
  baseSelect.addEventListener('change', updatePairing);
  contrastSelect.addEventListener('change', updatePairing);
  
  // Применяем шрифты к превью
  updatePairing();
}

// Обновление превью при выборе шрифтов
function updatePairing() {
  const baseSelect = document.getElementById('base-font');
  const contrastSelect = document.getElementById('contrast-font');
  const previewElement = document.getElementById('preview-text');
  
  if (!baseSelect || !contrastSelect || !previewElement) return;

  const baseFont = baseSelect.value;
  const contrastFont = contrastSelect.value;
  
  // Загружаем шрифты через Google Fonts, если они ещё не загружены
  if (baseFont) loadGoogleFont(baseFont);
  if (contrastFont) loadGoogleFont(contrastFont);
  
  // Применяем стили: для примера используем baseFont для всего текста
  // Можно сделать более сложную логику (например, baseFont для заголовка, contrastFont для текста)
  previewElement.style.fontFamily = `'${baseFont}', sans-serif`;
  
  // Можно добавить отображение информации о векторах или степени контраста
  if (fontVectors[baseFont] && fontVectors[contrastFont]) {
    const similarity = calculateCosineSimilarity(
      fontVectors[baseFont], 
      fontVectors[contrastFont]
    );
    console.log(`Сходство между ${baseFont} и ${contrastFont}: ${similarity.toFixed(2)}`);
  }
}

// Простая функция для вычисления косинусного сходства
function calculateCosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Функция для загрузки шрифта через Google Fonts (если ещё не загружен)
function loadGoogleFont(fontName) {
  if (!fontName || fontName.trim() === '') return;
  const family = fontName.trim().replace(/ /g, '+');
  const existingLink = document.querySelector(`link[href*="${family}"]`);
  if (!existingLink) {
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${family}:wght@400;700&subset=cyrillic&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
}

// --- Константы с фиксированными требованиями (без изменений) ---
const MOBILE_REQUIREMENTS = `МОБИЛЬНАЯ ВЕРСИЯ
Меню: бургер
Порядок блоков: как на десктопе
Шрифты: адаптировать для идеального отображения`;

const TECH_REQUIREMENTS = `ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ
Платформа/стек: использовать
- React + TypeScript + Tailwind CSS
- Framer Motion для анимаций
- Мобильная адаптация с гамбургер-меню`;

const footer_requirements = `Footer/подвал:
- копирайт: создано и разработано в студии MegaGroup
- повтор меню + контакты
- политика конфиденциальности: ссылки на полные документы на скрытых страницах.`;

const STORAGE_KEY = 'lovablePromptBuilder';

// --- Элементы формы (без старых шрифтов) ---
const form = document.getElementById('promptForm');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const resultDiv = document.getElementById('result');
const promptOutput = document.getElementById('promptOutput');

// Вкладки
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

// --- Контекст и цели ---
const siteTypeRadios = document.querySelectorAll('input[name="siteType"]');
const projectName = document.getElementById('projectName');
const targetAudience = document.getElementById('targetAudience');
const siteGoals = document.querySelectorAll('input[name="siteGoals"]');
const toneSelect = document.getElementById('tone');
const toneOther = document.getElementById('toneOther');

// --- Дизайн ---
const styleInput = document.getElementById('style');
const stylePreset = document.getElementById('stylePreset');
const references = document.getElementById('references');

// Цвета (три)
const colorPrimary = document.getElementById('colorPrimary');
const colorPrimaryHex = document.getElementById('colorPrimaryHex');
const colorPrimaryIgnore = document.getElementById('colorPrimaryIgnore');
const colorSecondary = document.getElementById('colorSecondary');
const colorSecondaryHex = document.getElementById('colorSecondaryHex');
const colorSecondaryIgnore = document.getElementById('colorSecondaryIgnore');
const colorAccent = document.getElementById('colorAccent');
const colorAccentHex = document.getElementById('colorAccentHex');
const colorAccentIgnore = document.getElementById('colorAccentIgnore');

// Типографика (новые селекты)
const baseFontSelect = document.getElementById('base-font');
const contrastFontSelect = document.getElementById('contrast-font');

// --- Структура (Header и Footer фиксированы) ---
const blocksCheckboxes = document.querySelectorAll('input[name="blocks"]');
const blocksSortable = document.getElementById('blocks-sortable');
const customBlockInput = document.getElementById('customBlockName');
const addCustomBlockBtn = document.getElementById('addCustomBlock');
let sortableInstance = null;
let selectedBlocks = []; // только блоки, выбранные пользователем (без Header/Footer)

// --- Анимации ---
const hoverButtons = document.querySelectorAll('input[name="hoverButtons"]');
const hoverCards = document.querySelectorAll('input[name="hoverCards"]');
const hoverImages = document.querySelectorAll('input[name="hoverImages"]');
const scrollTypeRadios = document.querySelectorAll('input[name="scrollType"]');

// --- Дополнительно ---
const servicesTextarea = document.getElementById('services');
const companyDescTextarea = document.getElementById('companyDesc');
const hasLogoCheckbox = document.getElementById('hasLogo');
const extraWishes = document.getElementById('extraWishes');

// --- Переключение вкладок ---
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        button.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

// --- Показ/скрытие поля "другой" для тона ---
toneSelect.addEventListener('change', () => {
    if (toneSelect.value === 'other') {
        toneOther.style.display = 'block';
    } else {
        toneOther.style.display = 'none';
    }
    saveFormState();
});

// --- Синхронизация цветов ---
function setupColorSync() {
    colorPrimary.addEventListener('input', () => {
        colorPrimaryHex.value = colorPrimary.value;
        saveFormState();
    });
    colorPrimaryHex.addEventListener('input', () => {
        if (/^#[0-9A-F]{6}$/i.test(colorPrimaryHex.value)) {
            colorPrimary.value = colorPrimaryHex.value;
        }
        saveFormState();
    });

    colorSecondary.addEventListener('input', () => {
        colorSecondaryHex.value = colorSecondary.value;
        saveFormState();
    });
    colorSecondaryHex.addEventListener('input', () => {
        if (/^#[0-9A-F]{6}$/i.test(colorSecondaryHex.value)) {
            colorSecondary.value = colorSecondaryHex.value;
        }
        saveFormState();
    });

    colorAccent.addEventListener('input', () => {
        colorAccentHex.value = colorAccent.value;
        saveFormState();
    });
    colorAccentHex.addEventListener('input', () => {
        if (/^#[0-9A-F]{6}$/i.test(colorAccentHex.value)) {
            colorAccent.value = colorAccentHex.value;
        }
        saveFormState();
    });
}

// --- Синхронизация пресета стилей ---
function setupStyleSync() {
    if (!stylePreset || !styleInput) return;
    stylePreset.addEventListener('change', function() {
        if (this.value && this.value !== 'custom') {
            styleInput.value = this.value;
        }
        saveFormState();
    });
    styleInput.addEventListener('input', function() {
        const currentVal = this.value;
        let matched = false;
        for (let opt of stylePreset.options) {
            if (opt.value === currentVal && opt.value !== 'custom') {
                matched = true;
                break;
            }
        }
        if (!matched && stylePreset.value !== 'custom') {
            stylePreset.value = 'custom';
        }
        saveFormState();
    });
}

// --- Обновление сортируемого списка блоков на основе чекбоксов ---
function updateBlocksList() {
    const checked = [];
    blocksCheckboxes.forEach(cb => {
        if (cb.checked) checked.push(cb.value);
    });

    const newSelected = [...selectedBlocks];
    
    checked.forEach(block => {
        if (!newSelected.includes(block)) newSelected.push(block);
    });

    const standardBlocks = Array.from(blocksCheckboxes).map(cb => cb.value);
    const filtered = newSelected.filter(block => {
        if (standardBlocks.includes(block)) {
            return checked.includes(block);
        }
        return true;
    });

    selectedBlocks = filtered;
    renderSortableList();
}

// Отрисовка списка с фиксированными Header и Footer
function renderSortableList() {
    blocksSortable.innerHTML = '';

    const headerLi = document.createElement('li');
    headerLi.textContent = 'Header/Навигация';
    headerLi.classList.add('fixed-item');
    headerLi.style.backgroundColor = '#e0e0e0';
    headerLi.style.cursor = 'default';
    blocksSortable.appendChild(headerLi);

    selectedBlocks.forEach((block) => {
        const li = document.createElement('li');
        li.textContent = block;

        const removeSpan = document.createElement('span');
        removeSpan.textContent = ' ×';
        removeSpan.style.cssText = 'color: red; cursor: pointer; margin-left: 10px; font-weight: bold; float: right;';
        removeSpan.title = 'Удалить блок';
        removeSpan.addEventListener('click', (e) => {
            e.stopPropagation();
            selectedBlocks = selectedBlocks.filter(b => b !== block);
            blocksCheckboxes.forEach(cb => {
                if (cb.value === block) {
                    cb.checked = false;
                }
            });
            renderSortableList();
            saveFormState();
        });

        li.appendChild(removeSpan);
        blocksSortable.appendChild(li);
    });

    const footerLi = document.createElement('li');
    footerLi.textContent = 'Футер (подвал)';
    footerLi.classList.add('fixed-item');
    footerLi.style.backgroundColor = '#e0e0e0';
    footerLi.style.cursor = 'default';
    blocksSortable.appendChild(footerLi);
}

// Инициализация Sortable
function initSortable() {
    if (sortableInstance) sortableInstance.destroy();
    sortableInstance = new Sortable(blocksSortable, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        filter: '.fixed-item',
        preventOnFilter: false,
        onEnd: function(evt) {
            const items = Array.from(blocksSortable.children);
            const newOrder = items
                .filter(li => !li.classList.contains('fixed-item'))
                .map(li => li.textContent.replace(' ×', ''));
            selectedBlocks = newOrder;
            saveFormState();
        }
    });
}

// Добавление кастомного блока
addCustomBlockBtn.addEventListener('click', () => {
    const blockName = customBlockInput.value.trim();
    if (blockName) {
        selectedBlocks.push(blockName);
        customBlockInput.value = '';
        renderSortableList();
        saveFormState();
    }
});

// --- Сохранение состояния в localStorage ---
function saveFormState() {
    const siteType = document.querySelector('input[name="siteType"]:checked')?.value || 'Лендинг';
    const goals = [];
    siteGoals.forEach(cb => { if (cb.checked) goals.push(cb.value); });

    const hoverButtonsSelected = [];
    hoverButtons.forEach(cb => { if (cb.checked) hoverButtonsSelected.push(cb.value); });
    const hoverCardsSelected = [];
    hoverCards.forEach(cb => { if (cb.checked) hoverCardsSelected.push(cb.value); });
    const hoverImagesSelected = [];
    hoverImages.forEach(cb => { if (cb.checked) hoverImagesSelected.push(cb.value); });

    const scrollType = document.querySelector('input[name="scrollType"]:checked')?.value || 'normal';

    const formData = {
        siteType: siteType,
        projectName: projectName.value,
        targetAudience: targetAudience.value,
        siteGoals: goals,
        tone: toneSelect.value,
        toneOther: toneOther.value,
        style: styleInput.value,
        stylePreset: stylePreset ? stylePreset.value : '',
        references: references.value,
        colorPrimary: colorPrimary.value,
        colorPrimaryIgnore: colorPrimaryIgnore.checked,
        colorSecondary: colorSecondary.value,
        colorSecondaryIgnore: colorSecondaryIgnore.checked,
        colorAccent: colorAccent.value,
        colorAccentIgnore: colorAccentIgnore.checked,
        // Сохраняем новые шрифты
        baseFont: baseFontSelect ? baseFontSelect.value : '',
        contrastFont: contrastFontSelect ? contrastFontSelect.value : '',
        selectedBlocks: selectedBlocks,
        hoverButtons: hoverButtonsSelected,
        hoverCards: hoverCardsSelected,
        hoverImages: hoverImagesSelected,
        scrollType: scrollType,
        services: servicesTextarea.value,
        companyDesc: companyDescTextarea.value,
        hasLogo: hasLogoCheckbox.checked,
        extraWishes: extraWishes.value
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
}

// --- Загрузка состояния из localStorage ---
function loadFormState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
        const formData = JSON.parse(saved);

        // Тип сайта
        if (formData.siteType) {
            const radio = document.querySelector(`input[name="siteType"][value="${formData.siteType}"]`);
            if (radio) radio.checked = true;
        }

        projectName.value = formData.projectName || '';
        targetAudience.value = formData.targetAudience || '';

        siteGoals.forEach(cb => {
            cb.checked = formData.siteGoals?.includes(cb.value) || false;
        });

        toneSelect.value = formData.tone || '';
        toneOther.value = formData.toneOther || '';
        if (toneSelect.value === 'other') toneOther.style.display = 'block';
        else toneOther.style.display = 'none';

        styleInput.value = formData.style || '';
        if (stylePreset && formData.stylePreset) stylePreset.value = formData.stylePreset;
        references.value = formData.references || '';

        if (formData.colorPrimary) {
            colorPrimary.value = formData.colorPrimary;
            colorPrimaryHex.value = formData.colorPrimary;
        }
        colorPrimaryIgnore.checked = formData.colorPrimaryIgnore || false;

        if (formData.colorSecondary) {
            colorSecondary.value = formData.colorSecondary;
            colorSecondaryHex.value = formData.colorSecondary;
        }
        colorSecondaryIgnore.checked = formData.colorSecondaryIgnore || false;

        if (formData.colorAccent) {
            colorAccent.value = formData.colorAccent;
            colorAccentHex.value = formData.colorAccent;
        }
        colorAccentIgnore.checked = formData.colorAccentIgnore || false;

        // Загружаем новые шрифты, но только если селекты уже заполнены (инициализированы)
        if (baseFontSelect && formData.baseFont && fontNames.includes(formData.baseFont)) {
            baseFontSelect.value = formData.baseFont;
        }
        if (contrastFontSelect && formData.contrastFont && fontNames.includes(formData.contrastFont)) {
            contrastFontSelect.value = formData.contrastFont;
        }

        if (Array.isArray(formData.selectedBlocks)) {
            selectedBlocks = formData.selectedBlocks;
            blocksCheckboxes.forEach(cb => {
                cb.checked = selectedBlocks.includes(cb.value);
            });
        } else {
            selectedBlocks = [];
            blocksCheckboxes.forEach(cb => cb.checked = false);
        }
        renderSortableList();

        hoverButtons.forEach(cb => {
            cb.checked = formData.hoverButtons?.includes(cb.value) || false;
        });
        hoverCards.forEach(cb => {
            cb.checked = formData.hoverCards?.includes(cb.value) || false;
        });
        hoverImages.forEach(cb => {
            cb.checked = formData.hoverImages?.includes(cb.value) || false;
        });

        if (formData.scrollType) {
            const radio = document.querySelector(`input[name="scrollType"][value="${formData.scrollType}"]`);
            if (radio) radio.checked = true;
        }

        servicesTextarea.value = formData.services || '';
        companyDescTextarea.value = formData.companyDesc || '';
        hasLogoCheckbox.checked = formData.hasLogo || false;
        extraWishes.value = formData.extraWishes || '';

        // Обновить превью шрифтов после загрузки
        updatePairing();

    } catch (e) {
        console.error('Ошибка загрузки из localStorage', e);
    }
}

// --- Генерация промпта (обновлена для новых шрифтов) ---
function generatePrompt() {
    if (!projectName.value.trim()) {
        alert('Пожалуйста, введите название проекта.');
        projectName.focus();
        return;
    }

    const siteType = document.querySelector('input[name="siteType"]:checked')?.value || 'Лендинг';
    let prompt = `# ПРОЕКТ: ${projectName.value.trim()}\n\n`;

    // 1. КОНТЕКСТ И ЦЕЛИ
    prompt += `## 1. КОНТЕКСТ И ЦЕЛИ\n`;
    prompt += `Тип сайта: ${siteType}\n`;
    if (targetAudience.value.trim()) prompt += `Целевая аудитория: ${targetAudience.value.trim()}\n`;

    const goals = [];
    siteGoals.forEach(cb => { if (cb.checked) goals.push(cb.value); });
    if (goals.length > 0) prompt += `Главная цель сайта: ${goals.join(', ')}\n`;

    let tone = toneSelect.value;
    if (tone === 'other' && toneOther.value.trim()) tone = toneOther.value.trim();
    if (tone && tone !== 'other') prompt += `Тон коммуникации: ${tone}\n`;
    prompt += '\n';

    // 2. ВИЗУАЛЬНАЯ ЭСТЕТИКА
    prompt += `## 2. ВИЗУАЛЬНАЯ ЭСТЕТИКА\n`;
    if (styleInput.value.trim()) prompt += `Стиль направления: ${styleInput.value.trim()}\n`;
    if (references.value.trim()) prompt += `Референсы: ${references.value.trim()}\n`;
    prompt += '\n';

    // 3. ЦВЕТОВАЯ ПАЛИТРА
    prompt += `## 3. ЦВЕТОВАЯ ПАЛИТРА\n`;
    if (!colorPrimaryIgnore.checked) prompt += `Основной цвет: ${colorPrimary.value}\n`;
    if (!colorSecondaryIgnore.checked) prompt += `Второстепенный цвет: ${colorSecondary.value}\n`;
    if (!colorAccentIgnore.checked) prompt += `Акцентный цвет: ${colorAccent.value}\n`;
    prompt += '\n';

    // 4. ТИПОГРАФИКА (новые поля)
    prompt += `## 4. ТИПОГРАФИКА\n`;
    if (baseFontSelect && baseFontSelect.value) prompt += `Шрифт заголовков: ${baseFontSelect.value}\n`;
    if (contrastFontSelect && contrastFontSelect.value) prompt += `Шрифт основного текста: ${contrastFontSelect.value}\n`;
    prompt += '\n';

    // 5. СТРУКТУРА И СЕКЦИИ
    prompt += `## 5. СТРУКТУРА И СЕКЦИИ (ПО ПОРЯДКУ)\n`;
    prompt += `1. Header/Навигация\n`;
    if (selectedBlocks.length > 0) {
        selectedBlocks.forEach((block, index) => {
            prompt += `${index+2}. ${block}\n`;
        });
    }
    prompt += `${selectedBlocks.length + 2}. Футер (подвал)\n`;
    prompt += '\n';

    // 6. ИНТЕРАКТИВНОСТЬ И АНИМАЦИИ
    prompt += `## 6. ИНТЕРАКТИВНОСТЬ И АНИМАЦИИ\n`;

    const hoverButtonsSelected = [];
    hoverButtons.forEach(cb => { if (cb.checked) hoverButtonsSelected.push(cb.value); });
    if (hoverButtonsSelected.length > 0) {
        prompt += `Ховер-эффекты для кнопок: ${hoverButtonsSelected.join(', ')}\n`;
    }

    const hoverCardsSelected = [];
    hoverCards.forEach(cb => { if (cb.checked) hoverCardsSelected.push(cb.value); });
    if (hoverCardsSelected.length > 0) {
        prompt += `Ховер-эффекты для карточек: ${hoverCardsSelected.join(', ')}\n`;
    }

    const hoverImagesSelected = [];
    hoverImages.forEach(cb => { if (cb.checked) hoverImagesSelected.push(cb.value); });
    if (hoverImagesSelected.length > 0) {
        prompt += `Ховер-эффекты для изображений: ${hoverImagesSelected.join(', ')}\n`;
    }

    const scrollType = document.querySelector('input[name="scrollType"]:checked')?.value || 'normal';
    if (scrollType === 'snap') {
        prompt += `Тип верстки: snap scrolling (прокрутка по секциям)\n`;
    } else if (scrollType === 'slider') {
        prompt += `Тип верстки: слайдерный скролл (секции наезжают сверху)\n`;
    } else {
        prompt += `Тип верстки: обычный\n`;
    }
    prompt += '\n';

    // 7. МОБИЛЬНАЯ ВЕРСИЯ
    prompt += `## 7. МОБИЛЬНАЯ ВЕРСИЯ\n`;
    prompt += MOBILE_REQUIREMENTS + '\n\n';

    // 8. ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ
    prompt += `## 8. ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ\n`;
    prompt += TECH_REQUIREMENTS + '\n\n';

    // 9. ДОПОЛНИТЕЛЬНЫЕ ПОЖЕЛАНИЯ
    prompt += `## 9. ДОПОЛНИТЕЛЬНЫЕ ПОЖЕЛАНИЯ\n`;
    if (servicesTextarea.value.trim()) {
        prompt += `Материалы заказчика (услуги/товары):\n${servicesTextarea.value.trim()}\n`;
    }
    if (companyDescTextarea.value.trim()) {
        prompt += `Описание компании: ${companyDescTextarea.value.trim()}\n`;
    }
    if (hasLogoCheckbox.checked) {
        prompt += `Есть логотип. Проанализируй его и используй дизайн-систему.\n`;
    }
    if (extraWishes.value.trim()) {
        prompt += `Дополнительно: ${extraWishes.value.trim()}\n`;
    }
    prompt += `\nПожалуйста, сгенерируй код сайта, учитывая все указанные требования. При разработке дизайна опирайся на предоставленную дизайн-систему и, если есть, на стиль логотипа. Используй материалы заказчика для наполнения контентом.`;

    promptOutput.value = prompt;
    resultDiv.style.display = 'block';
}

// --- Копирование ---
function copyToClipboard() {
    promptOutput.select();
    promptOutput.setSelectionRange(0, 99999);
    document.execCommand('copy');
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Скопировано!';
    setTimeout(() => {
        copyBtn.textContent = originalText;
    }, 2000);
}

// --- Кнопка сброса ---
function addResetButton() {
    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.id = 'resetBtn';
    resetBtn.textContent = 'Сбросить форму';
    resetBtn.style.backgroundColor = '#e74c3c';
    resetBtn.style.marginLeft = '10px';
    generateBtn.insertAdjacentElement('afterend', resetBtn);
    resetBtn.addEventListener('click', resetForm);
}

function resetForm() {
    if (confirm('Вы уверены? Все введённые данные будут удалены.')) {
        form.reset();
        toneOther.style.display = 'none';
        selectedBlocks = [];
        renderSortableList();
        localStorage.removeItem(STORAGE_KEY);
        resultDiv.style.display = 'none';
        saveFormState();
        // Сбросить шрифты на первые в списке
        if (fontNames.length > 0) {
            baseFontSelect.value = fontNames[0];
            contrastFontSelect.value = fontNames.length > 1 ? fontNames[1] : fontNames[0];
            updatePairing();
        }
    }
}

// --- Инициализация при загрузке DOM ---
document.addEventListener('DOMContentLoaded', () => {
    // Сначала загружаем состояние из localStorage (если есть)
    loadFormState();
    
    // Инициализируем сортировку и синхронизацию
    initSortable();
    setupColorSync();
    setupStyleSync();

    // Обработчики для блоков
    blocksCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            updateBlocksList();
            saveFormState();
        });
    });

    [hoverButtons, hoverCards, hoverImages].forEach(group => {
        group.forEach(cb => cb.addEventListener('change', saveFormState));
    });

    scrollTypeRadios.forEach(radio => {
        radio.addEventListener('change', saveFormState);
    });

    // Сохраняем состояние при любом изменении формы
    form.addEventListener('input', saveFormState);
    form.addEventListener('change', saveFormState);

    generateBtn.addEventListener('click', generatePrompt);
    copyBtn.addEventListener('click', copyToClipboard);
    addResetButton();

    // Если данные шрифтов уже загружены (благодаря fetch выше), то initDesignTab уже вызван
    // Но если ещё нет, то после загрузки они вызовутся.
    // Дополнительно вызываем updatePairing после возможной загрузки из localStorage
    if (fontNames.length > 0) {
        updatePairing();
    }
});

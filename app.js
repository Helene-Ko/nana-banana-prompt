// Промпты для разных форматов
const promptTemplates = {
    '650x650': (mainText, subText, notes) => `Создай квадратный рекламный баннер 650×650 пикселей для автосервиса «ТСТ-Нива» (замена радиатора охлаждения).

ВАЖНО: не показывать целый автомобиль. Только детали, фон, фрагменты.

Фирменные цвета: фон — голубой #64B5F6, акценты — жёлтый #FFFF00.

Композиция: крупный план нового радиатора на металлическом столе, рядом инструменты. Задний план — бетонный цех, цепи, подъёмник. Освещение — контрастное, кинематографическое.

Текст на баннере (рубленый шрифт):
- ${mainText} (жёлтым, крупно)
- ${subText} (белым)

Настроение: индустриальное, брутальное, дорогое.

${notes ? `Дополнительно: ${notes}` : ''}`,

    '900x480': (mainText, subText, notes) => `Создай горизонтальный баннер 900×480 пикселей для автосервиса «ТСТ-Нива».

ВАЖНО: без целого автомобиля. Только детали и фон.

Цвета: фон #64B5F6, акценты #FFFF00.

Композиция: левая часть — крупно радиатор и инструменты. Правая часть — размытый моторный отсек. Фон — индустриальный цех.

Текст:
- ${mainText} (жёлтый, вверху слева)
- ${subText} (белый)

Стиль: брутальный, мужской, кинематографический.

${notes ? `Дополнительно: ${notes}` : ''}`,

    '240x400': (mainText, subText, notes) => `Создай вертикальный баннер 240×400 пикселей для Яндекс.Карт.

ВАЖНО: верхние 50px и нижние 50px будут обрезаны. Весь текст строго по центру (зона 50–350px). Телефон и адрес НЕ размещать.

Цвета: фон #64B5F6, акценты #FFFF00.

Центральная зона: крупно радиатор, инструменты, бетонный фон.

Текст (строго по центру):
- ${mainText} (жёлтый)
- ${subText} (белый)

Без телефона и адреса. Стиль: брутальный минимализм.

${notes ? `Дополнительно: ${notes}` : ''}`,

    '400x160': (mainText, subText, notes) => `Создай широкий горизонтальный баннер 400×160 пикселей для автосервиса «ТСТ-Нива».

ВАЖНО: не показывать целый автомобиль. Только детали и фон.

Цвета: фон #64B5F6, акценты #FFFF00.

Композиция: на всю ширину — панорама индустриального цеха, слева крупно радиатор, справа размытые инструменты.

Текст (по центру или слева, читаемо):
- ${mainText} (жёлтый, крупно)
- ${subText} (белый, мелко)

Стиль: брутальный, мощный, индустриальный.

${notes ? `Дополнительно: ${notes}` : ''}`
};

// DOM элементы
let currentFormat = '650x650';
const formatBtns = document.querySelectorAll('.format-btn');
const mainTextInput = document.getElementById('mainText');
const subTextInput = document.getElementById('subText');
const customNotes = document.getElementById('customNotes');
const promptOutput = document.getElementById('promptOutput');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');

// Функция генерации промпта
function generatePrompt() {
    const mainText = mainTextInput.value.trim() || 'ЗАМЕНА РАДИАТОРА';
    const subText = subTextInput.value.trim() || 'в автосервисе ТСТ-НИВА';
    const notes = customNotes.value.trim();

    const template = promptTemplates[currentFormat];
    if (template) {
        return template(mainText, subText, notes);
    }
    return 'Ошибка: формат не выбран';
}

// Обновление вывода
function updateOutput() {
    const prompt = generatePrompt();
    promptOutput.textContent = prompt;

    // Сохраняем в localStorage
    saveToLocalStorage();
}

// Сохранение в localStorage
function saveToLocalStorage() {
    const data = {
        format: currentFormat,
        mainText: mainTextInput.value,
        subText: subTextInput.value,
        notes: customNotes.value
    };
    localStorage.setItem('nanaBananaPrompt', JSON.stringify(data));
}

// Загрузка из localStorage
function loadFromLocalStorage() {
    const saved = localStorage.getItem('nanaBananaPrompt');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            currentFormat = data.format || '650x650';
            mainTextInput.value = data.mainText || 'ЗАМЕНА РАДИАТОРА';
            subTextInput.value = data.subText || 'в автосервисе ТСТ-НИВА';
            customNotes.value = data.notes || '';

            // Обновляем активную кнопку
            formatBtns.forEach(btn => {
                if (btn.dataset.format === currentFormat) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        } catch (e) {
            console.log('Ошибка загрузки сохранений');
        }
    }
    updateOutput();
}

// Копирование в буфер
async function copyToClipboard() {
    const prompt = promptOutput.textContent;
    try {
        await navigator.clipboard.writeText(prompt);

        // Визуальный фидбек
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Скопировано!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    } catch (err) {
        alert('Не удалось скопировать текст');
    }
}

// Скачивание .txt файла
function downloadTxt() {
    const prompt = promptOutput.textContent;
    const formatName = currentFormat.replace('x', '_');
    const date = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `prompt_nanabana_${formatName}_${date}.txt`;

    const blob = new Blob([prompt], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Визуальный фидбек
    const originalText = downloadBtn.textContent;
    downloadBtn.textContent = '💾 Скачано!';
    setTimeout(() => {
        downloadBtn.textContent = originalText;
    }, 2000);
}

// Сброс всех полей
function resetAll() {
    if (confirm('Сбросить все настройки?')) {
        currentFormat = '650x650';
        mainTextInput.value = 'ЗАМЕНА РАДИАТОРА';
        subTextInput.value = 'в автосервисе ТСТ-НИВА';
        customNotes.value = '';

        formatBtns.forEach(btn => {
            if (btn.dataset.format === currentFormat) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        updateOutput();
        saveToLocalStorage();
    }
}

// Обработчики событий
formatBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        formatBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFormat = btn.dataset.format;
        updateOutput();
    });
});

mainTextInput.addEventListener('input', updateOutput);
subTextInput.addEventListener('input', updateOutput);
customNotes.addEventListener('input', updateOutput);
copyBtn.addEventListener('click', copyToClipboard);
downloadBtn.addEventListener('click', downloadTxt);
resetBtn.addEventListener('click', resetAll);

// Загрузка сохранений при старте
loadFromLocalStorage();

// Основной файл, объединяющий все модули
import { initTheme, toggleTheme } from './theme.js';
import { 
    setTimezoneToggle, 
    handleTimezoneChange, 
    getLocalTimezoneOffset,
    getSelectedTimezone
} from './timezone.js';
import {
    updateFromTimestamp,
    updateFromDateInputs,
    setCurrentTime,
    handleTimestampFormatChange,
    copyTimestampToClipboard,
    copyFormattedDate,
    formatDateForPreview
} from './timestamp.js';
import {
    validateYearInput,
    validateMonthInput,
    validateDayInput,
    validateHoursInput,
    validateMinutesInput,
    validateSecondsInput,
    validateTimestampInput,
    showCopyNotification
} from './ui.js';
import {
    getConversionHistory,
    addToHistory,
    renderHistory
} from './history.js';

// Инициализация приложения при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    // Получаем ссылки на DOM элементы
    const timestampInput = document.getElementById('timestamp');
    const yearInput = document.getElementById('year');
    const monthInput = document.getElementById('month');
    const dayInput = document.getElementById('day');
    const hoursInput = document.getElementById('hours');
    const minutesInput = document.getElementById('minutes');
    const secondsInput = document.getElementById('seconds');
    const copyTimestampBtn = document.getElementById('copy-timestamp-btn');
    const copyDateBtn = document.getElementById('copy-date-btn');
    const dateFormatSelect = document.getElementById('date-format-select');
    const timestampFormatSelect = document.getElementById('timestamp-format-select');
    const nowBtn = document.getElementById('now-btn');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const timezoneSelect = document.getElementById('timezone-select');
    const timezoneToggle = document.getElementById('timezone-toggle');
    const utcBtn = document.getElementById('utc-btn');
    const localBtn = document.getElementById('local-btn');
    const customBtn = document.getElementById('custom-btn');
    const copyNotification = document.getElementById('copy-notification');
    const livePreviewElement = document.getElementById('live-preview');
    const historyList = document.getElementById('history-list');
    
    // Массив полей даты/времени для удобства
    const dateTimeFields = [yearInput, monthInput, dayInput, hoursInput, minutesInput, secondsInput];
    
    // Добавляем слушатели событий для валидации
    yearInput.addEventListener('blur', () => validateYearInput(yearInput));
    monthInput.addEventListener('blur', () => validateMonthInput(monthInput));
    dayInput.addEventListener('blur', () => validateDayInput(dayInput));
    hoursInput.addEventListener('blur', () => validateHoursInput(hoursInput));
    minutesInput.addEventListener('blur', () => validateMinutesInput(minutesInput));
    secondsInput.addEventListener('blur', () => validateSecondsInput(secondsInput));
    timestampInput.addEventListener('blur', () => validateTimestampInput(timestampInput));
    
    // Добавляем слушатели событий для изменения ввода
    yearInput.addEventListener('input', updateFromDateTimeFields);
    monthInput.addEventListener('input', updateFromDateTimeFields);
    dayInput.addEventListener('input', updateFromDateTimeFields);
    hoursInput.addEventListener('input', updateFromDateTimeFields);
    minutesInput.addEventListener('input', updateFromDateTimeFields);
    secondsInput.addEventListener('input', updateFromDateTimeFields);
    timestampInput.addEventListener('input', updateFromTimestampField);
    
    // Добавляем слушатели событий для кнопок
    copyTimestampBtn.addEventListener('click', () => {
        copyTimestampToClipboard(timestampInput, copyNotification);
    });
    
    copyDateBtn.addEventListener('click', () => {
        const formattedDate = copyFormattedDate(
            yearInput, 
            monthInput, 
            dayInput, 
            hoursInput, 
            minutesInput, 
            secondsInput, 
            dateFormatSelect, 
            timezoneSelect, 
            copyNotification
        );
        
        // Добавляем в историю
        if (formattedDate) {
            addToHistory({
                timestamp: timestampInput.value,
                date: formattedDate
            });
        }
    });
    
    nowBtn.addEventListener('click', () => {
        setCurrentTime(timestampInput, timestampFormatSelect, updateFromTimestampField);
        
        // Добавляем анимацию нажатия
        nowBtn.classList.add('active');
        setTimeout(() => {
            nowBtn.classList.remove('active');
        }, 200);
    });
    
    themeToggleBtn.addEventListener('click', toggleTheme);
    
    // Добавляем слушатели событий для опций часового пояса
    utcBtn.addEventListener('click', () => {
        setTimezoneToggle(
            'utc', 
            timezoneToggle,
            utcBtn, 
            localBtn, 
            customBtn,
            timezoneSelect, 
            updateFromTimestampField
        );
    });
    
    localBtn.addEventListener('click', () => {
        setTimezoneToggle(
            'local', 
            timezoneToggle,
            utcBtn, 
            localBtn, 
            customBtn,
            timezoneSelect, 
            updateFromTimestampField
        );
    });
    
    customBtn.addEventListener('click', () => {
        setTimezoneToggle(
            'custom', 
            timezoneToggle,
            utcBtn, 
            localBtn, 
            customBtn,
            timezoneSelect, 
            updateFromTimestampField
        );
    });
    
    timezoneSelect.addEventListener('change', () => {
        handleTimezoneChange(
            timezoneSelect, 
            timezoneToggle,
            utcBtn, 
            localBtn, 
            customBtn,
            updateFromTimestampField, 
            dateTimeFields
        );
    });
    
    // Обработчик клика на элемент истории
    historyList.addEventListener('click', (event) => {
        const historyItem = event.target.closest('.history-item');
        if (historyItem && historyItem.dataset.timestamp) {
            // Устанавливаем значение из истории
            timestampInput.value = historyItem.dataset.timestamp;
            updateFromTimestampField();
        }
    });
    
    // Добавляем слушатель события для формата временной метки
    timestampFormatSelect.addEventListener('change', () => {
        handleTimestampFormatChange(
            timestampFormatSelect, 
            timestampInput, 
            updateFromTimestampField
        );
    });
    
    // Обработчик изменения формата даты
    dateFormatSelect.addEventListener('change', () => {
        // Обновляем живой предпросмотр при изменении формата даты
        updateFromTimestampField();
    });
    
    // Обработчики изменения полей даты
    dateTimeFields.forEach(field => {
        field.addEventListener('input', () => {
            updateFromDateTimeFields();
            
            // Прямое обновление живого предпросмотра
            if (livePreviewElement) {
                setTimeout(() => {
                    // Получаем текущую дату из полей
                    const year = parseInt(yearInput.value);
                    const month = parseInt(monthInput.value) - 1;
                    const day = parseInt(dayInput.value);
                    const hours = parseInt(hoursInput.value);
                    const minutes = parseInt(minutesInput.value);
                    const seconds = parseInt(secondsInput.value);
                    
                    if (!isNaN(year) && !isNaN(month) && !isNaN(day) && 
                        !isNaN(hours) && !isNaN(minutes) && !isNaN(seconds)) {
                        
                        // Создаем дату
                        const timezone = timezoneSelect.value;
                        let date;
                        
                        if (timezone === '+00:00') {
                            date = new Date(Date.UTC(year, month, day, hours, minutes, seconds));
                        } else {
                            // Создаем дату с учетом часового пояса
                            const offsetMatch = timezone.match(/([+-])(\d{2}):(\d{2})/);
                            if (offsetMatch) {
                                const sign = offsetMatch[1];
                                const offsetHours = parseInt(offsetMatch[2]);
                                const offsetMinutes = parseInt(offsetMatch[3]);
                                const totalOffsetMinutes = (sign === '+' ? -1 : 1) * (offsetHours * 60 + offsetMinutes);
                                
                                const localDate = new Date(Date.UTC(year, month, day, hours, minutes, seconds));
                                date = new Date(localDate.getTime() + totalOffsetMinutes * 60000);
                            } else {
                                date = new Date(Date.UTC(year, month, day, hours, minutes, seconds));
                            }
                        }
                        
                        // Форматируем дату для предпросмотра
                        const dateFormatSelect = document.getElementById('date-format-select');
                        const format = dateFormatSelect.value;
                        let formattedDate;
                        
                        switch (format) {
                            case 'iso':
                                formattedDate = date.toISOString();
                                break;
                            case 'human':
                                const y = date.getUTCFullYear();
                                const mo = (date.getUTCMonth() + 1).toString().padStart(2, '0');
                                const d = date.getUTCDate().toString().padStart(2, '0');
                                const h = date.getUTCHours().toString().padStart(2, '0');
                                const mi = date.getUTCMinutes().toString().padStart(2, '0');
                                const s = date.getUTCSeconds().toString().padStart(2, '0');
                                formattedDate = `${y}-${mo}-${d} ${h}:${mi}:${s}`;
                                break;
                            case 'utc':
                                formattedDate = date.toUTCString();
                                break;
                            case 'locale':
                                formattedDate = date.toLocaleString();
                                break;
                            default:
                                formattedDate = date.toISOString();
                        }
                        
                        // Обновляем предпросмотр
                        livePreviewElement.textContent = formattedDate;
                        
                        // Добавляем анимацию пульсации
                        livePreviewElement.classList.remove('pulse-animation');
                        void livePreviewElement.offsetWidth; // Trick to restart animation
                        livePreviewElement.classList.add('pulse-animation');
                    }
                }, 10); // Небольшая задержка, чтобы убедиться, что значение таймстемпа обновлено
            }
        });
    });
    
    // Функция-обертка для обновления из временной метки
    function updateFromTimestampField() {
        updateFromTimestamp(
            timestampInput, 
            yearInput, 
            monthInput, 
            dayInput, 
            hoursInput, 
            minutesInput, 
            secondsInput, 
            timezoneSelect,
            livePreviewElement
        );
        
        // Добавляем в историю при каждом обновлении из временной метки
        if (timestampInput.value) {
            // Получаем форматированную дату для истории
            const year = yearInput.value;
            const month = monthInput.value.padStart(2, '0');
            const day = dayInput.value.padStart(2, '0');
            const hours = hoursInput.value.padStart(2, '0');
            const minutes = minutesInput.value.padStart(2, '0');
            const seconds = secondsInput.value.padStart(2, '0');
            const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            
            addToHistory({
                timestamp: timestampInput.value,
                date: formattedDate
            });
            
            // Обновляем отображение истории
            renderHistory(historyList);
        }
    }
    
    // Функция-обертка для обновления из полей даты/времени
    function updateFromDateTimeFields() {
        updateFromDateInputs(
            yearInput, 
            monthInput, 
            dayInput, 
            hoursInput, 
            minutesInput, 
            secondsInput, 
            timestampInput, 
            timestampFormatSelect, 
            timezoneSelect
        );
        
        // Обновляем живой предпросмотр после изменения полей даты
        if (livePreviewElement) {
            const dateFormatSelect = document.getElementById('date-format-select');
            const timestamp = parseInt(timestampInput.value);
            if (!isNaN(timestamp)) {
                const date = new Date(timestamp * 1000);
                const timezone = getSelectedTimezone(timezoneSelect);
                const previewText = formatDateForPreview(date, timezone, dateFormatSelect);
                livePreviewElement.textContent = previewText;
                
                // Добавляем анимацию пульсации
                livePreviewElement.classList.remove('pulse-animation');
                void livePreviewElement.offsetWidth; // Trick to restart animation
                livePreviewElement.classList.add('pulse-animation');
            }
        }
    }
    
    // Инициализируем приложение
    initTheme();
    
    // Инициализируем переключатель часового пояса в положение UTC по умолчанию
    setTimezoneToggle('utc', timezoneToggle, utcBtn, localBtn, customBtn, timezoneSelect, null);
    
    updateFromTimestampField();
    
    // Отображаем историю при загрузке
    renderHistory(historyList);
    
    // Устанавливаем часовой пояс по умолчанию UTC
    setTimezoneToggle('utc', timezoneToggle, utcBtn, localBtn, customBtn, timezoneSelect, updateFromTimestampField);
});

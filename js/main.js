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

import domElements from './dom.js';

// Инициализация приложения при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    // Array of date/time fields for convenience
    const dateTimeFields = [domElements.yearInput, domElements.monthInput, domElements.dayInput, domElements.hoursInput, domElements.minutesInput, domElements.secondsInput];

    // Add event listeners for validation
    domElements.yearInput.addEventListener('blur', () => validateYearInput(domElements.yearInput));
    domElements.monthInput.addEventListener('blur', () => validateMonthInput(domElements.monthInput));
    domElements.dayInput.addEventListener('blur', () => validateDayInput(domElements.dayInput));
    domElements.hoursInput.addEventListener('blur', () => validateHoursInput(domElements.hoursInput));
    domElements.minutesInput.addEventListener('blur', () => validateMinutesInput(domElements.minutesInput));
    domElements.secondsInput.addEventListener('blur', () => validateSecondsInput(domElements.secondsInput));
    domElements.timestampInput.addEventListener('blur', () => validateTimestampInput(domElements.timestampInput));

    // Set initial timezone offset based on system
    domElements.timezoneSelect.value = getLocalTimezoneOffset();
    
    // Add event listeners for input changes
    dateTimeFields.forEach(field => field.addEventListener('input', updateFromDateTimeFields));
    domElements.timestampInput.addEventListener('input', updateFromTimestampField);
    
    // Add event listeners for buttons
    domElements.copyTimestampBtn.addEventListener('click', () => {
        copyTimestampToClipboard(domElements.timestampInput, domElements.copyNotification);
    });

    domElements.copyDateBtn.addEventListener('click', () => {
        const formattedDate = copyFormattedDate(
            domElements.yearInput,
            domElements.monthInput,
            domElements.dayInput,
            domElements.hoursInput,
            domElements.minutesInput,
            domElements.secondsInput,
            domElements.dateFormatSelect,
            domElements.timezoneSelect,
            domElements.copyNotification
        );

        // Добавляем в историю
        if (formattedDate) {
            addToHistory({
                timestamp: domElements.timestampInput.value,
                date: formattedDate
            });
        }
    });

    domElements.nowBtn.addEventListener('click', () => {
        updateFromTimestampField();

        // Добавляем анимацию нажатия
        domElements.nowBtn.classList.add('active');
        setTimeout(() => {
            domElements.nowBtn.classList.remove('active');
        }, 200);
    });

    domElements.themeToggleBtn.addEventListener('click', toggleTheme);

    // Add event listeners for timezone options
    domElements.utcBtn.addEventListener('click', () => {
        setTimezoneToggle(
            'utc',
            domElements.timezoneToggle,
            domElements.utcBtn,
            domElements.localBtn,
            domElements.customBtn,
            domElements.timezoneSelect,
            updateFromTimestampField
        );
    });

    domElements.localBtn.addEventListener('click', () => {
        setTimezoneToggle(
            'local',
            domElements.timezoneToggle,
            domElements.utcBtn,
            domElements.localBtn,
            domElements.customBtn,
            domElements.timezoneSelect,
            updateFromTimestampField
        );
    });

    domElements.customBtn.addEventListener('click', () => {
        setTimezoneToggle(
            'custom',
            domElements.timezoneToggle,
            domElements.utcBtn,
            domElements.localBtn,
            domElements.customBtn,
            domElements.timezoneSelect,
            updateFromTimestampField
        );
    });

    domElements.timezoneSelect.addEventListener('change', () => {
        handleTimezoneChange(
            domElements.timezoneSelect,
            domElements.timezoneToggle,
            domElements.utcBtn,
            domElements.localBtn,
            domElements.customBtn,
            updateFromTimestampField,
            dateTimeFields
        );
    });

    // Обработчик клика на элемент истории
    domElements.historyList.addEventListener('click', (event) => {
        const historyItem = event.target.closest('.history-item');
        if (historyItem && historyItem.dataset.timestamp) {
            // Устанавливаем значение из истории
            domElements.timestampInput.value = historyItem.dataset.timestamp;
            updateFromTimestampField();
        }
    });

    // Add event listener for timestamp format
    domElements.timestampFormatSelect.addEventListener('change', () => {
        handleTimestampFormatChange(
            domElements.timestampFormatSelect,
            domElements.timestampInput,
            updateFromTimestampField
        );
    });

    // Handler for date format change
    domElements.dateFormatSelect.addEventListener('change', () => {
        // Update live preview when date format changes
        updateFromTimestampField();
    });

    // Обработчики изменения полей даты
    dateTimeFields.forEach(field => {
        field.addEventListener('input', () => {
            updateFromDateTimeFields();

            // Прямое обновление живого предпросмотра
            if (domElements.livePreviewElement) {
                setTimeout(() => {
                    // Получаем текущую дату из полей
                    const year = parseInt(domElements.yearInput.value);
                    const month = parseInt(domElements.monthInput.value) - 1;
                    const day = parseInt(domElements.dayInput.value);
                    const hours = parseInt(domElements.hoursInput.value);
                    const minutes = parseInt(domElements.minutesInput.value);
                    const seconds = parseInt(domElements.secondsInput.value);

                    if (!isNaN(year) && !isNaN(month) && !isNaN(day) &&
                        !isNaN(hours) && !isNaN(minutes) && !isNaN(seconds)) {

                        // Создаем дату
                        const timezone = domElements.timezoneSelect.value;
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

                        // Format date for preview
                        const format = domElements.dateFormatSelect.value;
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
                        domElements.livePreviewElement.textContent = formattedDate;

                        // Добавляем анимацию пульсации
                        domElements.livePreviewElement.classList.remove('pulse-animation');
                        void domElements.livePreviewElement.offsetWidth; // Trick to restart animation
                        domElements.livePreviewElement.classList.add('pulse-animation');
                    }
                }, 10); // Небольшая задержка, чтобы убедиться, что значение таймстемпа обновлено
            }
        });
    });


    // Wrapper function for updating from timestamp
    function updateFromTimestampField() {
        updateFromTimestamp(
            timestampInput, 
            yearInput, 
            monthInput, 
            dayInput, 
            hoursInput, 
            minutesInput, 
            secondsInput, 
            domElements.timezoneSelect,
            domElements.livePreviewElement
        );

        // Add to history on each update from timestamp
        if (domElements.timestampInput.value) {
            // Get formatted date for history
            const year = domElements.yearInput.value;
            const month = domElements.monthInput.value.padStart(2, '0');
            const day = domElements.dayInput.value.padStart(2, '0');
            const hours = domElements.hoursInput.value.padStart(2, '0');
            const minutes = domElements.minutesInput.value.padStart(2, '0');
            const seconds = domElements.secondsInput.value.padStart(2, '0');
            const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

            addToHistory({
                timestamp: domElements.timestampInput.value,
                date: formattedDate
            });

            // Обновляем отображение истории
            renderHistory(domElements.historyList);
        }
    }

    // Wrapper function for updating from date/time fields
    function updateFromDateTimeFields() {
        updateFromDateInputs(
            domElements.yearInput,
            domElements.monthInput,
            domElements.dayInput,
            domElements.hoursInput,
            domElements.minutesInput,
            domElements.secondsInput,
            domElements.timestampInput,
            domElements.timestampFormatSelect,
            domElements.timezoneSelect
        );

        // Обновляем живой предпросмотр после изменения полей даты
        if (domElements.livePreviewElement) {
            const timestamp = parseInt(domElements.timestampInput.value);
            if (!isNaN(timestamp)) {
                const date = new Date(timestamp * 1000);
                const timezone = getSelectedTimezone(domElements.timezoneSelect);
                const previewText = formatDateForPreview(date, timezone, domElements.dateFormatSelect);
                domElements.livePreviewElement.textContent = previewText;

                // Добавляем анимацию пульсации
                domElements.livePreviewElement.classList.remove('pulse-animation');
                void domElements.livePreviewElement.offsetWidth; // Trick to restart animation
                domElements.livePreviewElement.classList.add('pulse-animation');
            }
        }
    }

    // Инициализируем приложение
    initTheme();

    // Инициализируем переключатель часового пояса в положение UTC по умолчанию
    setTimezoneToggle('utc', domElements.timezoneToggle, domElements.utcBtn, domElements.localBtn, domElements.customBtn, domElements.timezoneSelect, null);

    updateFromTimestampField();

    // Отображаем историю при загрузке
    renderHistory(domElements.historyList);

    // Устанавливаем часовой пояс по умолчанию UTC
    setTimezoneToggle('utc', domElements.timezoneToggle, domElements.utcBtn, domElements.localBtn, domElements.customBtn, domElements.timezoneSelect, updateFromTimestampField);
});

// Функции для работы с временными метками
import domElements from './dom.js';
// Function to format date according to the selected format for live preview
export function formatDateForPreview(date, timezone, dateFormatSelect) {
    let formattedDate;
    let adjustedDate;
    
    // Создаем дату с учетом часового пояса
    if (timezone === '+00:00') {
        // UTC время (+00:00)
        adjustedDate = new Date(date.getTime());
    } else {
        // Обрабатываем смещение часового пояса
        const offsetMillis = getOffsetMillisFromString(timezone);
        adjustedDate = new Date(date.getTime() + offsetMillis);
    }
    
    // Format date according to the selected format
    const format = dateFormatSelect ? dateFormatSelect.value : 'iso';
    
    switch (format) {
        case 'iso':
            // ISO 8601 format
            formattedDate = adjustedDate.toISOString();
            break;
        case 'human':
            // Human readable format
            const year = adjustedDate.getUTCFullYear();
            const month = adjustedDate.getUTCMonth() + 1;
            const day = adjustedDate.getUTCDate();
            const hours = adjustedDate.getUTCHours();
            const minutes = adjustedDate.getUTCMinutes();
            const seconds = adjustedDate.getUTCSeconds();
            formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            break;
        case 'utc':
            // UTC String format
            formattedDate = adjustedDate.toUTCString();
            break;
        case 'locale':
            // Locale String format
            formattedDate = adjustedDate.toLocaleString();
            break;
        default:
            // Default - human readable format
            const y = adjustedDate.getUTCFullYear();
            const mo = adjustedDate.getUTCMonth() + 1;
            const d = adjustedDate.getUTCDate();
            const h = adjustedDate.getUTCHours();
            const mi = adjustedDate.getUTCMinutes();
            const s = adjustedDate.getUTCSeconds();
            formattedDate = `${y}-${mo.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')} ${h.toString().padStart(2, '0')}:${mi.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    
    return formattedDate;
}

// Обновление полей даты из временной метки
function updateFromTimestamp(
    timestampInput, 
    yearInput, 
    monthInput, 
    dayInput, 
    hoursInput, 
    minutesInput, 
    secondsInput, 
    timezoneSelect,
    livePreviewElement = null
) {
    const timestamp = timestampInput.value.trim();
    if (timestamp && /^\d+$/.test(timestamp)) {
        let date;
        // Обрабатываем как секунды или миллисекунды в зависимости от длины
        if (timestamp.length <= 10) {
            date = new Date(Number(timestamp) * 1000);
        } else {
            date = new Date(Number(timestamp));
        }
        
        if (!isNaN(date.getTime())) {
            const timezone = getSelectedTimezone(timezoneSelect);
            let year, month, day, hours, minutes, seconds;
            
            if (timezone === '+00:00') {
                // UTC время (+00:00)
                year = date.getUTCFullYear();
                month = date.getUTCMonth() + 1;
                day = date.getUTCDate();
                hours = date.getUTCHours();
                minutes = date.getUTCMinutes();
                seconds = date.getUTCSeconds();
            } else {
                // Обрабатываем смещение часового пояса (например, +01:00, -07:00)
                const offsetMillis = getOffsetMillisFromString(timezone);
                
                // Создаем дату в UTC и затем корректируем по смещению
                const utcDate = new Date(date.getTime());
                const offsetDate = new Date(utcDate.getTime() + offsetMillis);
                
                year = offsetDate.getUTCFullYear();
                month = offsetDate.getUTCMonth() + 1;
                day = offsetDate.getUTCDate();
                hours = offsetDate.getUTCHours();
                minutes = offsetDate.getUTCMinutes();
                seconds = offsetDate.getUTCSeconds();
            }
            
            yearInput.value = year;
            monthInput.value = month.toString().padStart(2, '0');
            dayInput.value = day.toString().padStart(2, '0');
            hoursInput.value = hours.toString().padStart(2, '0');
            minutesInput.value = minutes.toString().padStart(2, '0');
            secondsInput.value = seconds.toString().padStart(2, '0');
            
            // Обновляем живой предпросмотр, если элемент передан
            if (livePreviewElement) {
                // Get reference to date format dropdown
                const dateFormatSelect = document.getElementById('date-format-select');
                const previewText = formatDateForPreview(date, timezone, dateFormatSelect);
                livePreviewElement.textContent = previewText;
                
                // Добавляем анимацию пульсации
                livePreviewElement.classList.remove('pulse-animation');
                void livePreviewElement.offsetWidth; // Trick to restart animation
                livePreviewElement.classList.add('pulse-animation');
            }
        }
    }
}

// Обновление временной метки из полей даты
function updateFromDateInputs(
    yearInput, 
    monthInput, 
    dayInput, 
    hoursInput, 
    minutesInput, 
    secondsInput, 
    timestampInput, 
    timestampFormatSelect, 
    timezoneSelect
) {
    const year = parseInt(yearInput.value);
    const month = parseInt(monthInput.value) - 1;
    const day = parseInt(dayInput.value);
    const hours = parseInt(hoursInput.value);
    const minutes = parseInt(minutesInput.value);
    const seconds = parseInt(secondsInput.value);
    
    if (!isNaN(year) && !isNaN(month) && !isNaN(day) && 
        !isNaN(hours) && !isNaN(minutes) && !isNaN(seconds)) {
        
        let date;
        const timezone = getSelectedTimezone(timezoneSelect);
        
        if (timezone === 'UTC') {
            date = new Date(Date.UTC(year, month, day, hours, minutes, seconds));
        } else if (timezone === 'local') {
            date = new Date(year, month, day, hours, minutes, seconds);
        } else {
            // Обрабатываем смещение часового пояса (например, +01:00, -07:00)
            const offsetMatch = timezone.match(/([+-])(\d{2}):(\d{2})/);
            if (offsetMatch) {
                const sign = offsetMatch[1];
                const offsetHours = parseInt(offsetMatch[2]);
                const offsetMinutes = parseInt(offsetMatch[3]);
                const totalOffsetMinutes = (sign === '+' ? -1 : 1) * (offsetHours * 60 + offsetMinutes);
                
                // Создаем дату в указанном часовом поясе
                const localDate = new Date(Date.UTC(year, month, day, hours, minutes, seconds));
                date = new Date(localDate.getTime() + totalOffsetMinutes * 60000);
            } else {
                // If format couldn't be recognized, use UTC
                date = new Date(Date.UTC(year, month, day, hours, minutes, seconds));
            }
        }
        
        if (!isNaN(date.getTime())) {
            const timestamp = Math.floor(date.getTime() / 1000);
            const format = timestampFormatSelect.value;
            
            if (format === 'milliseconds') {
                timestampInput.value = (timestamp * 1000).toString();
            } else {
                timestampInput.value = timestamp.toString();
            }
        }
    }
}

// Установка текущего времени
function setCurrentTime(timestampInput, timestampFormatSelect, updateCallback) {
    const now = new Date();
    const timestamp = Math.floor(now.getTime() / 1000);
    
    // Проверяем, нужно ли отображать в миллисекундах
    if (timestampFormatSelect.value === 'milliseconds') {
        timestampInput.value = (timestamp * 1000).toString();
    } else {
        timestampInput.value = timestamp.toString();
    }
    
    if (typeof updateCallback === 'function') {
        updateCallback();
    }
    
    domElements.timestampInput.classList.add('highlight-change');
}

// Handle timestamp format change (seconds/milliseconds)
function handleTimestampFormatChange(timestampFormatSelect, timestampInput, updateCallback) {
    const format = timestampFormatSelect.value;
    const timestamp = timestampInput.value.trim();
    
    if (timestamp) {
        if (format === 'milliseconds' && timestamp.length <= 10) {
            // Конвертируем секунды в миллисекунды
            timestampInput.value = (Number(timestamp) * 1000).toString();
        } else if (format === 'seconds' && timestamp.length > 10) {
            // Конвертируем миллисекунды в секунды
            timestampInput.value = Math.floor(Number(timestamp) / 1000).toString();
        }
        
        if (typeof updateCallback === 'function') {
            updateCallback();
        }
    }
}

// Копирование временной метки в буфер обмена
function copyTimestampToClipboard(timestampInput, timestampFormatSelect, copyTimestampBtn, showNotificationCallback) {
    const timestamp = timestampInput.value.trim();
    if (timestamp) {
        // Проверяем, нужно ли конвертировать в миллисекунды
        const format = timestampFormatSelect.value;
        let finalTimestamp = timestamp;
        
        if (format === 'milliseconds' && timestamp.length <= 10) {
            finalTimestamp = (Number(timestamp) * 1000).toString();
        } else if (format === 'seconds' && timestamp.length > 10) {
            finalTimestamp = Math.floor(Number(timestamp) / 1000).toString();
        }
        
        navigator.clipboard.writeText(finalTimestamp).then(() => {
            if (typeof showNotificationCallback === 'function') {
                showNotificationCallback(`Timestamp copied as ${format === 'milliseconds' ? 'milliseconds' : 'seconds'}!`);
            }
            
            // Показываем индикацию успеха
            copyTimestampBtn.classList.add('copied');
            setTimeout(() => {
                copyTimestampBtn.classList.remove('copied');
            }, 750);
        }).catch(err => {
            console.error('Не удалось скопировать: ', err);
            copyTimestampBtn.classList.add('error');
            setTimeout(() => {
                copyTimestampBtn.classList.remove('error');
            }, 750);
        });
    }
}

// Get formatted date based on selected format
function getFormattedDate(yearInput, monthInput, dayInput, hoursInput, minutesInput, secondsInput, timezoneSelect, dateFormatSelect) {
    const date = getCurrentDateFromInputs(yearInput, monthInput, dayInput, hoursInput, minutesInput, secondsInput, timezoneSelect);
    const format = dateFormatSelect.value;
    
    switch(format) {
        case 'iso':
            return date.toISOString();
        case 'human':
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZoneName: 'short'
            };
            return date.toLocaleDateString(undefined, options);
        case 'utc':
            return date.toUTCString();
        case 'locale':
            return date.toString();
        default:
            return date.toISOString();
    }
}

// Получение объекта Date из текущих входных данных с учетом часового пояса
function getCurrentDateFromInputs(yearInput, monthInput, dayInput, hoursInput, minutesInput, secondsInput, timezoneSelect) {
    const year = parseInt(yearInput.value) || 2025;
    const month = parseInt(monthInput.value) - 1 || 0;
    const day = parseInt(dayInput.value) || 1;
    const hours = parseInt(hoursInput.value) || 0;
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    
    const timezone = getSelectedTimezone(timezoneSelect);
    let date;
    
    if (timezone === 'UTC') {
        date = new Date(Date.UTC(year, month, day, hours, minutes, seconds));
    } else if (timezone === 'local') {
        date = new Date(year, month, day, hours, minutes, seconds);
    } else {
        // Обрабатываем смещение часового пояса
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
    
    return date;
}

// Copy current time in selected format
function copyFormattedDate(yearInput, monthInput, dayInput, hoursInput, minutesInput, secondsInput, timezoneSelect, dateFormatSelect, copyDateBtn, showNotificationCallback) {
    const formattedDate = getFormattedDate(yearInput, monthInput, dayInput, hoursInput, minutesInput, secondsInput, timezoneSelect, dateFormatSelect);
    const formatName = dateFormatSelect.options[dateFormatSelect.selectedIndex].text;
    
    navigator.clipboard.writeText(formattedDate).then(() => {
        // Показываем индикацию успеха
        copyDateBtn.classList.add('copied');
        
        if (typeof showNotificationCallback === 'function') {
            showNotificationCallback(`Format ${formatName} copied!`);
        }
        
        // Remove success indication after delay
        setTimeout(() => {
            copyDateBtn.classList.remove('copied');
        }, 750);
    }).catch(err => {
        console.error('Failed to copy formatted date:', err);
        copyDateBtn.classList.add('error');
        setTimeout(() => {
            copyDateBtn.classList.remove('error');
        }, 750);
    });
}

export {
    updateFromTimestamp,
    updateFromDateInputs,
    setCurrentTime,
    handleTimestampFormatChange,
    copyTimestampToClipboard,
    getFormattedDate,
    getCurrentDateFromInputs,
    copyFormattedDate
};

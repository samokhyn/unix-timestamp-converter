// Functions for working with timezones
function getSelectedTimezone(timezoneSelect) {
    return timezoneSelect.value; // All values in format +/-XX:XX
}

// Function for managing the state of the 3-position toggle
function setTimezoneToggle(position, timezoneToggle, utcBtn, localBtn, customBtn, timezoneSelect, updateCallback) {
    // Update data-position attribute for slider positioning
    timezoneToggle.setAttribute('data-position', position);
    
    // Update ARIA attributes for accessibility
    utcBtn.setAttribute('aria-checked', position === 'utc');
    localBtn.setAttribute('aria-checked', position === 'local');
    customBtn.setAttribute('aria-checked', position === 'custom');
    
    // Обновляем состояние селекта часового пояса в зависимости от выбранной позиции
    switch (position) {
        case 'utc':
            timezoneSelect.value = '+00:00';
            timezoneSelect.disabled = true;
            break;
        case 'local':
            timezoneSelect.value = getLocalTimezoneOffset();
            timezoneSelect.disabled = true;
            break;
        case 'custom':
            timezoneSelect.disabled = false;
            // Если текущее значение совпадает с UTC или локальным, выбираем другое значение
            if (timezoneSelect.value === '+00:00' || timezoneSelect.value === getLocalTimezoneOffset()) {
                // Выбираем значение, отличное от UTC и локального
                const options = Array.from(timezoneSelect.options);
                const otherOption = options.find(option => {
                    return option.value !== '+00:00' && option.value !== getLocalTimezoneOffset();
                });
                if (otherOption) {
                    timezoneSelect.value = otherOption.value;
                }
            }
            break;
    }
    
    // Обновляем поля даты/времени
    if (typeof updateCallback === 'function') {
        updateCallback();
    }
}

// Function for handling timezone change in select
function handleTimezoneChange(timezoneSelect, timezoneToggle, utcBtn, localBtn, customBtn, updateCallback, dateTimeFields) {
    const selectedOption = timezoneSelect.value;
    
    // Определяем, какая позиция должна быть активна
    let position;
    if (selectedOption === '+00:00') {
        position = 'utc';
    } else if (selectedOption === getLocalTimezoneOffset()) {
        position = 'local';
    } else {
        position = 'custom';
    }
    
    // Обновляем состояние переключателя
    setTimezoneToggle(position, timezoneToggle, utcBtn, localBtn, customBtn, timezoneSelect, null);
    
    // Обновляем поля даты/времени
    if (typeof updateCallback === 'function') {
        updateCallback();
    }
    
    // Подсвечиваем поля даты/времени
    if (dateTimeFields && dateTimeFields.length) {
        dateTimeFields.forEach(field => {
            field.classList.add('highlight-change');
            setTimeout(() => {
                field.classList.remove('highlight-change');
            }, 500);
        });
    }
}

// Get timezone offset from string in format "+01:00" or "-07:00"
function getOffsetMillisFromString(offsetStr) {
    const offsetMatch = offsetStr.match(/([+-])(\d{2}):(\d{2})/);
    if (offsetMatch) {
        const sign = offsetMatch[1];
        const hours = parseInt(offsetMatch[2]);
        const minutes = parseInt(offsetMatch[3]);
        return (sign === '+' ? 1 : -1) * (hours * 60 + minutes) * 60000;
    }
    return 0;
}

// Get local timezone in format "+01:00" or "-07:00"
function getLocalTimezoneOffset() {
    const date = new Date();
    const offsetMinutes = date.getTimezoneOffset();
    const sign = offsetMinutes <= 0 ? '+' : '-';
    const absMinutes = Math.abs(offsetMinutes);
    const hours = Math.floor(absMinutes / 60);
    const minutes = absMinutes % 60;
    
    return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export { 
    getSelectedTimezone, 
    setTimezoneToggle,
    handleTimezoneChange, 
    getOffsetMillisFromString,
    getLocalTimezoneOffset
};

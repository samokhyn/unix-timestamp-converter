import domElements from './dom.js';

// Validation functions
function validateYearInput(input) {
    const value = input.value;
    if (value === '') return;
    
    const numValue = parseInt(value);
    if (numValue < 1970) {
        input.value = 1970;
        showFeedback(input);
    } else if (numValue > 2100) {
        input.value = 2100;
        showFeedback(input);
    }
}

function validateMonthInput(input) {
    const value = input.value;
    if (value === '') return;
    
    const numValue = parseInt(value);
    if (numValue < 1) {
        input.value = '01';
        showFeedback(input);
    } else if (numValue > 12) {
        input.value = '12';
        showFeedback(input);
    } else if (value.length === 1) {
        input.value = padZero(numValue);
    }
}

function validateDayInput(input) {
    const value = input.value;
    if (value === '') return;
    
    const numValue = parseInt(value);
    if (numValue < 1) {
        input.value = '01';
        showFeedback(input);
    } else if (numValue > 31) {
        input.value = '31';
        showFeedback(input);
    } else if (value.length === 1) {
        input.value = padZero(numValue);
    }
}

function validateHoursInput(input) {
    const value = input.value;
    if (value === '') return;
    
    const numValue = parseInt(value);
    if (numValue < 0) {
        input.value = '00';
        showFeedback(input);
    } else if (numValue > 23) {
        input.value = '23';
        showFeedback(input);
    } else if (value.length === 1) {
        input.value = padZero(numValue);
    }
}

function validateMinutesInput(input) {
    const value = input.value;
    if (value === '') return;
    
    const numValue = parseInt(value);
    if (numValue < 0) {
        input.value = '00';
        showFeedback(input);
    } else if (numValue > 59) {
        input.value = '59';
        showFeedback(input);
    } else if (value.length === 1) {
        input.value = padZero(numValue);
    }
}

function validateSecondsInput(input) {
    const value = input.value;
    if (value === '') return;
    
    const numValue = parseInt(value);
    if (numValue < 0) {
        input.value = '00';
        showFeedback(input);
    } else if (numValue > 59) {
        input.value = '59';
        showFeedback(input);
    } else if (value.length === 1) {
        input.value = padZero(numValue);
    }
}

function validateTimestampInput(input) {
    const value = input.value;
    if (value === '') return;
    
    // Удаляем все нецифровые символы
    if (!/^\d+$/.test(value)) {
        input.value = value.replace(/\D/g, '');
        showFeedback(input);
    }
}

// Helper function to add zero to values < 10
function padZero(num) {
    return num < 10 ? `0${num}` : num;
}

// UI функция обратной связи
function showFeedback(input) {
    input.classList.add('pulse');
    setTimeout(() => {
        input.classList.remove('pulse');
    }, 300);
}

// Show copy notification
function showCopyNotification(message = 'Copied!', copyNotification) {
    copyNotification.textContent = message;
    copyNotification.classList.remove('hidden');
    
    // Position notification in the center
    copyNotification.style.top = '50%';
    copyNotification.style.left = '50%';
    
    // Hide notification after delay
    setTimeout(() => {
        copyNotification.classList.add('hidden');
    }, 1500);
}

export {
    validateYearInput,
    validateMonthInput,
    validateDayInput,
    validateHoursInput,
    validateMinutesInput,
    validateSecondsInput,
    validateTimestampInput,
    padZero,
    showFeedback,
    showCopyNotification
};

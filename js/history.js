// Функции для работы с историей конвертаций

const HISTORY_KEY = 'unix_converter_history';
const MAX_HISTORY_ITEMS = 3; // Ограничиваем до 3 конвертаций

/**
 * Получение истории конвертаций из localStorage
 * @returns {Array} Массив объектов с историей конвертаций
 */
export function getConversionHistory() {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
}

/**
 * Добавление новой записи в историю конвертаций
 * @param {Object} conversionData Объект с данными о конвертации
 */
export function addToHistory(conversionData) {
    const history = getConversionHistory();
    
    // Проверяем, есть ли уже такая запись в истории
    const existingIndex = history.findIndex(item => 
        item.timestamp === conversionData.timestamp && 
        item.date === conversionData.date
    );
    
    // Если такая запись уже есть, удаляем её
    if (existingIndex !== -1) {
        history.splice(existingIndex, 1);
    }
    
    // Добавляем новую запись в начало массива
    history.unshift({
        ...conversionData,
        id: Date.now(), // Уникальный ID для записи
        createdAt: new Date().toISOString() // Время создания записи
    });
    
    // Ограничиваем количество записей в истории
    if (history.length > MAX_HISTORY_ITEMS) {
        history.pop();
    }
    
    // Сохраняем обновленную историю
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

/**
 * Отображение истории конвертаций в списке
 * @param {HTMLElement} historyList Элемент списка истории
 */
export function renderHistory(historyList) {
    const history = getConversionHistory();
    
    // Очищаем список
    historyList.innerHTML = '';
    
    if (history.length === 0) {
        const emptyItem = document.createElement('li');
        emptyItem.className = 'history-item';
        emptyItem.textContent = 'No conversion history yet';
        historyList.appendChild(emptyItem);
        return;
    }
    
    // Добавляем каждую запись в список (максимум 3)
    history.slice(0, MAX_HISTORY_ITEMS).forEach(item => {
        const listItem = document.createElement('li');
        listItem.className = 'history-item';
        listItem.dataset.timestamp = item.timestamp;
        listItem.dataset.date = item.date;
        
        const timestampDiv = document.createElement('div');
        timestampDiv.className = 'history-timestamp';
        timestampDiv.textContent = item.timestamp;
        
        const dateDiv = document.createElement('div');
        dateDiv.className = 'history-date';
        dateDiv.textContent = item.date;
        
        listItem.appendChild(timestampDiv);
        listItem.appendChild(dateDiv);
        
        historyList.appendChild(listItem);
    });
}



// Functions for working with conversion history
import domElements from './dom.js';
const HISTORY_KEY = 'unix_converter_history';
const MAX_HISTORY_ITEMS = 3; // Limit to 3 conversions

/**
 * Get conversion history from localStorage
 * @returns {Array} Array of objects with conversion history
 */
export function getConversionHistory() {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
}

/**
 * Add new record to conversion history
 * @param {Object} conversionData Object with conversion data
 */
export function addToHistory(conversionData) {
    const history = getConversionHistory();
    
    // Check if such record already exists in history
    const existingIndex = history.findIndex(item => 
        item.timestamp === conversionData.timestamp && 
        item.date === conversionData.date
    );
    
    // If such record already exists, remove it
    if (existingIndex !== -1) {
        history.splice(existingIndex, 1);
    }
    
    // Add new record to the beginning of the array
    history.unshift({
        ...conversionData,
        id: Date.now(), // Unique ID for the record
        createdAt: new Date().toISOString() // Creation time of the record
    });
    
    // Limit history to maximum number of records
    if (history.length > MAX_HISTORY_ITEMS) {
        history.pop();
    }
    
    // Save updated history
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

/**
 * Display conversion history in list
 * @param {HTMLElement} historyList History list element
 */
export function renderHistory(historyList) {
    const history = getConversionHistory()
    
    // Clear history list
    historyList.innerHTML = '';
    
    if (history.length === 0) {
        const emptyItem = document.createElement('li');
        emptyItem.className = 'history-item';
        emptyItem.textContent = 'No conversion history yet';
        historyList.appendChild(emptyItem);
        return;
    }
    
    // Add each record to the list (maximum 3)
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



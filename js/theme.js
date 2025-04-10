import domElements from './dom.js';

// Functions for theme management
function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

function initTheme() {
    // Проверяем сохраненную тему в localStorage
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        // Если есть сохраненная тема, используем её
        setTheme(savedTheme);
    } else {
        // Иначе используем системные настройки
        const prefersDark = window.matchMedia && 
            window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
    }
    
    // Слушаем изменения системной темы
    window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', e => {
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });
        
    // Initialize button state if needed, for example, to reflect the current theme
    // domElements.themeToggleBtn.checked = document.body.getAttribute('data-theme') === 'dark';
}

export { setTheme, toggleTheme, initTheme };

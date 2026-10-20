document.addEventListener('DOMContentLoaded', () => {
    
    // SIDEBAR
    const toggleSidebarBtn = document.getElementById('toggle-sidebar');
    const sidebar = document.getElementById('sidebar');

    toggleSidebarBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    // MODO CLARO/OSCURO
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeLabel = document.getElementById('theme-label');
    const themeIcon = themeToggleBtn.querySelector('i');

    const savedTheme = localStorage.getItem('centinela-theme') || 'light';
    applyTheme(savedTheme);

    // Boton de cambio
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
    });

    /**
     * 
     * @param {string} theme 
     */
    function applyTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        
        localStorage.setItem('centinela-theme', theme);

        // ICONO SOL O LUNA
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            themeLabel.textContent = 'Tema Oscuro';
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            themeLabel.textContent = 'Tema Claro';
        }
    }
});
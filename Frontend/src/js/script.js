document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. CONTROL DE LA BARRA LATERAL (SIDEBAR)
    // ==========================================
    const toggleSidebarBtn = document.getElementById('toggle-sidebar');
    const sidebar = document.getElementById('sidebar');

    if (toggleSidebarBtn && sidebar) {
        toggleSidebarBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            // Guardar estado colapsado en localStorage opcionalmente
            const isCollapsed = sidebar.classList.contains('collapsed');
            localStorage.setItem('centinela-sidebar', isCollapsed);
        });

        // Restaurar estado guardado del sidebar al cargar
        if (localStorage.getItem('centinela-sidebar') === 'true') {
            sidebar.classList.add('collapsed');
        }
    }

    // ==========================================
    // 2. MODO CLARO / OSCURO GLOBAL
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeLabel = document.getElementById('theme-label');

    if (themeToggleBtn) {
        const themeIcon = themeToggleBtn.querySelector('i');
        
        // Cargar tema guardado
        const savedTheme = localStorage.getItem('centinela-theme') || 'light';
        applyTheme(savedTheme);

        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(newTheme);
        });

        function applyTheme(theme) {
            htmlElement.setAttribute('data-theme', theme);
            localStorage.setItem('centinela-theme', theme);

            if (themeIcon) {
                if (theme === 'dark') {
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                } else {
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                }
            }

            if (themeLabel) {
                themeLabel.textContent = theme === 'dark' ? 'Tema Oscuro' : 'Tema Claro';
            }
        }
    }
});
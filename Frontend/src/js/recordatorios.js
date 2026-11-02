document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. ACCIÓN DE CREAR NUEVO RECORDATORIO
    // ==========================================
    const btnNewReminder = document.getElementById('btn-new-reminder');
    if (btnNewReminder) {
        btnNewReminder.addEventListener('click', () => {
            console.log("Abriendo modal o formulario de nuevo recordatorio...");
            alert('Función de agregar recordatorio lista para enlazar con el backend.');
        });
    }

    // ==========================================
    // 2. CONEXIÓN CON EL BACKEND (CARGAR ALERTAS)
    // ==========================================
    async function fetchRemindersData() {
        try {
            const response = await fetch('http://localhost:5064/api/telemetria/alertas');
            if (!response.ok) throw new Error('Error al cargar alertas');
            
            const alertas = await response.json();

            // 1. Actualizar métrica de alertas activas
            const metricActivas = document.getElementById('metric-active-alerts');
            if (metricActivas) metricActivas.textContent = alertas.length;

            // 2. Renderizar listado de alertas de forma dinámica
            const container = document.getElementById('reminders-container');
            if (!container) return;
            
            container.innerHTML = ''; // Limpiar mensaje de carga

            if (alertas.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: var(--textSecondary);">No hay alertas ni recordatorios pendientes.</p>';
                return;
            }

            alertas.forEach(alertItem => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'event-item';
                itemDiv.style.cssText = "background-color: var(--surface); border: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; margin-top: 0; padding: 12px; border-radius: 8px;";
                
                // Mapear colores e iconos según severidad del JSON
                let color = 'var(--primary)';
                let icono = 'fa-solid fa-bell';
                if(alertItem.severity === 'critical') { color = '#f87171'; icono = 'fa-solid fa-triangle-exclamation'; }
                if(alertItem.severity === 'warning') { color = '#fbbf24'; icono = 'fa-solid fa-circle-exclamation'; }
                if(alertItem.severity === 'info') { color = '#60a5fa'; icono = 'fa-solid fa-circle-info'; }

                const fechaStr = new Date(alertItem.opened_at).toLocaleString('es-MX');

                itemDiv.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <i class="${icono}" style="font-size: 20px; color: ${color};"></i>
                        <div>
                            <p style="font-weight: 600; color: var(--textPrimary); margin: 0;">${alertItem.type.toUpperCase()}</p>
                            <p style="font-size: 12px; color: var(--textSecondary); margin: 2px 0 0 0;">Estado: ${alertItem.state} | ${fechaStr}</p>
                        </div>
                    </div>
                    <button class="btn-action-alert" data-id="${alertItem.id}" style="background: var(--surfaceMuted); color: var(--textPrimary); border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 500;">
                        Revisar
                    </button>
                `;
                container.appendChild(itemDiv);
            });
        } catch (error) {
            console.error('Error al cargar recordatorios desde la base de datos:', error);
            const container = document.getElementById('reminders-container');
            if (container) {
                container.innerHTML = `<p style="text-align: center; color: var(--critical);">Error al conectar con el servidor de alertas.</p>`;
            }
        }
    }

    fetchRemindersData();
});
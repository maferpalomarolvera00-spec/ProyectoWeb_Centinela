document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. ACCIÓN DE CREAR NUEVO RECORDATORIO
    // ==========================================
    const btnNewReminder = document.getElementById('btn-new-reminder');
    if (btnNewReminder) {
        btnNewReminder.addEventListener('click', () => {
            console.log("Abriendo modal o formulario de nuevo recordatorio...");
            
            /*
            // Lógica futura para abrir modal de registro:
            // openModalRecordatorio();
            */
            
            alert('Función de agregar recordatorio lista para enlazar con el backend.');
        });
    }

    // ==========================================
    // 2. CONEXIÓN CON EL BACKEND (CARGAR ALERTAS)
    // ==========================================
    async function fetchRemindersData() {
        try {
            /*
            // DESCOMENTAR CUANDO EL BACKEND ESTÉ CONECTADO:
            const response = await fetch('http://localhost:3000/api/alertas/lista');
            const data = await response.json();

            // 1. Actualizar métricas superiores
            document.getElementById('metric-active-alerts').textContent = data.activas;
            document.getElementById('metric-maintenance').textContent = data.mantenimiento;
            document.getElementById('metric-calibration').textContent = data.calibracionGas;
            document.getElementById('metric-system-status').textContent = data.estadoSistema;

            // 2. Renderizar listado de alertas de forma dinámica
            const container = document.getElementById('reminders-container');
            container.innerHTML = ''; // Limpiar mensaje de carga

            if (data.alertas.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: var(--textSecondary);">No hay alertas ni recordatorios pendientes.</p>';
                return;
            }

            data.alertas.forEach(alertItem => {
                const itemDiv = document.createElement('div');
                itemDiv.className = `event-item ${alertItem.claseTipo || ''}`;
                itemDiv.style.cssText = "background-color: var(--surface); border: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; margin-top: 0; padding: 12px; border-radius: 8px;";
                
                itemDiv.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <i class="${alertItem.icono || 'fa-solid fa-bell'}" style="font-size: 20px; color: ${alertItem.colorIcono || 'var(--primary)'};"></i>
                        <div>
                            <p style="font-weight: 600; color: var(--textPrimary);">${alertItem.titulo}</p>
                            <p style="font-size: 12px; color: var(--textSecondary);">${alertItem.descripcion}</p>
                        </div>
                    </div>
                    <button class="btn-action-alert" data-id="${alertItem.id}" style="background: ${alertItem.colorBoton || 'var(--surfaceMuted)'}; color: ${alertItem.textoBotonColor || 'var(--textPrimary)'}; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 500;">
                        ${alertItem.textoBoton || 'Revisar'}
                    </button>
                `;
                container.appendChild(itemDiv);
            });
            */
        } catch (error) {
            console.error('Error al cargar recordatorios desde la base de datos:', error);
            const container = document.getElementById('reminders-container');
            if (container) {
                container.innerHTML = `<p style="text-align: center; color: var(--critical);">Error al conectar con el servidor de alertas.</p>`;
            }
        }
    }

    // fetchRemindersData();
});
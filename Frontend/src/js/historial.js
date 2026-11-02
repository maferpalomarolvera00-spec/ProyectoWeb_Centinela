document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. LÓGICA DEL BOTÓN EXPORTAR CSV
    // ==========================================
    const btnExportCSV = document.getElementById('btn-export-csv');
    if (btnExportCSV) {
        btnExportCSV.addEventListener('click', () => {
            alert('¡Generando archivo CSV con la bitácora actual!');
        });
    }

    // ==========================================
    // 2. CONEXIÓN CON EL BACKEND (CARGAR BITÁCORA)
    // ==========================================
    async function fetchHistoryData() {
        try {
            // Petición a tu nuevo endpoint del historial
            const response = await fetch('http://localhost:5064/api/telemetria/historial');
            if (!response.ok) throw new Error('Error al obtener datos del servidor');
            
            const list = await response.json();
            const tbody = document.getElementById('history-table-body');
            tbody.innerHTML = ''; // Limpiar mensaje de carga

            if (list.length === 0) {
                tbody.innerHTML = `<tr><td colspan="4" style="padding: 20px; text-align: center; color: var(--textSecondary);">Sin registros en la base de datos.</td></tr>`;
                return;
            }

            // Variables para calcular las tarjetas superiores
            let totalTemp = 0, tempCount = 0;
            let totalHum = 0, humCount = 0;
            let picosGas = 0;

            list.forEach(item => {
                // Parsear el JSON crudo que viene de la vista de Supabase
                const data = JSON.parse(item.datosJson);
                
                // Formatear Fecha
                const fechaRaw = data.received_at || data.captured_at || item.fechaRegistro;
                const fechaStr = new Date(fechaRaw).toLocaleString('es-MX', { 
                    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' 
                });
                
                // Extraer Sensor (Usar el nombre del gas si existe, o el nombre del canal)
                const sensor = data.gas_label || (data.channel_key ? data.channel_key.toUpperCase() : 'Desconocido');
                
                // Extraer Valor y Unidad
                const valorRaw = data.display_value !== null && data.display_value !== undefined ? data.display_value : '--';
                const valorUnidad = data.display_unit ? data.display_unit : '';
                const valorFinal = `${valorRaw} ${valorUnidad}`;
                
                // Extraer Estado y asignar colores
                let estado = data.level || data.confidence || 'Normal';
                let color = 'var(--textSecondary)';
                
                if (estado === 'critical') { 
                    color = '#f87171'; // Rojo
                    estado = 'Crítico'; 
                    picosGas++; 
                } else if (estado === 'warning') { 
                    color = '#fbbf24'; // Amarillo
                    estado = 'Advertencia'; 
                    picosGas++; 
                } else if (estado === 'normal' || estado === 'high') { 
                    color = '#4ade80'; // Verde
                    estado = 'Estable'; 
                } else if (estado === 'not_installed') {
                    estado = 'No instalado';
                }

                // Sumar para promedios si es temperatura o humedad
                if (data.channel_key === 'temperature' && typeof data.display_value === 'number') {
                    totalTemp += data.display_value;
                    tempCount++;
                }
                if (data.channel_key === 'humidity' && typeof data.display_value === 'number') {
                    totalHum += data.display_value;
                    humCount++;
                }

                // Crear e inyectar la fila en la tabla
                const row = document.createElement('tr');
                row.style.borderBottom = '1px solid var(--border)';
                row.innerHTML = `
                    <td style="padding: 10px 8px;">${fechaStr}</td>
                    <td style="padding: 10px 8px;">${sensor}</td>
                    <td style="padding: 10px 8px;">${valorFinal}</td>
                    <td style="padding: 10px 8px; color: ${color}; font-weight: 500;">${estado}</td>
                `;
                tbody.appendChild(row);
            });

            // Llenar las métricas de las tarjetas superiores
            document.getElementById('total-records').textContent = list.length;
            document.getElementById('gas-peaks').textContent = picosGas;
            
            document.getElementById('avg-temp').textContent = tempCount > 0 
                ? (totalTemp / tempCount).toFixed(1) 
                : '--';
                
            document.getElementById('avg-humidity').textContent = humCount > 0 
                ? (totalHum / humCount).toFixed(1) 
                : '--';

        } catch (error) {
            console.error('Error al cargar el historial:', error);
            const tbody = document.getElementById('history-table-body');
            if(tbody) {
                tbody.innerHTML = `<tr><td colspan="4" style="padding: 20px; text-align: center; color: #f87171;">Error al conectar con el servidor.</td></tr>`;
            }
        }
    }

    // Ejecutar al iniciar
    fetchHistoryData();
});
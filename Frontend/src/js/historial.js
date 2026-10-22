document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. LÓGICA DEL BOTÓN EXPORTAR CSV
    // ==========================================
    const btnExportCSV = document.getElementById('btn-export-csv');
    if (btnExportCSV) {
        btnExportCSV.addEventListener('click', () => {
            console.log("Solicitando exportación de CSV al servidor...");
            
            /*
            // EJEMPLO DE FETCH PARA DESCARGAR ARCHIVO DESDE EL BACKEND:
            window.location.href = 'http://localhost:3000/api/historial/exportar-csv';
            */
            
            alert('¡Generando archivo CSV con la bitácora actual!');
        });
    }

    // ==========================================
    // 2. CONEXIÓN CON EL BACKEND (CARGAR BITÁCORA)
    // ==========================================
    async function fetchHistoryData() {
        try {
            /*
            // DESCOMENTAR CUANDO EL BACKEND ESTÉ CONECTADO:
            const response = await fetch('http://localhost:3000/api/historial/registros');
            const data = await response.json();

            // 1. Rellenar métricas superiores
            document.getElementById('total-records').textContent = data.totales;
            document.getElementById('gas-peaks').textContent = data.picosGas;
            document.getElementById('avg-temp').textContent = data.tempPromedio;
            document.getElementById('avg-humidity').textContent = data.humedadPromedio;

            // 2. Rellenar tabla dinámica
            const tbody = document.getElementById('history-table-body');
            tbody.innerHTML = ''; // Limpiar estado de carga

            data.registros.forEach(item => {
                const row = document.createElement('tr');
                row.style.borderBottom = '1px solid var(--border)';
                row.innerHTML = `
                    <td style="padding: 10px 8px;">${item.timestamp}</td>
                    <td style="padding: 10px 8px;">${item.sensor}</td>
                    <td style="padding: 10px 8px;">${item.valor}</td>
                    <td style="padding: 10px 8px; color: ${item.colorEstado || 'var(--textSecondary)'};">${item.estado}</td>
                `;
                tbody.appendChild(row);
            });
            */
        } catch (error) {
            console.error('Error al cargar el historial de la base de datos:', error);
            const tbody = document.getElementById('history-table-body');
            if(tbody) {
                tbody.innerHTML = `<tr><td colspan="4" style="padding: 20px; text-align: center; color: var(--critical);">Error al conectar con la base de datos.</td></tr>`;
            }
        }
    }

    // fetchHistoryData();
});
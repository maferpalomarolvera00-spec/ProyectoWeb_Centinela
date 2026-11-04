document.addEventListener('DOMContentLoaded', () => {
    
    let historyChart = null;
    let chartCtx = null;
    let chartData = { labels: [], temp: [], hum: [], mq6: [], mq4: [] };

    // Función para crear el degradado de color debajo de la línea
    function getGradient(ctx, colorHex) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 320);
        const hex = colorHex.replace('#', '');
        const r = parseInt(hex.substring(0,2), 16);
        const g = parseInt(hex.substring(2,4), 16);
        const b = parseInt(hex.substring(4,6), 16);
        
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.5)`); 
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.0)`);
        return gradient;
    }

    // Función para crear el color de fondo translúcido para las tarjetas
    function getCardBackground(colorHex) {
        const hex = colorHex.replace('#', '');
        const r = parseInt(hex.substring(0,2), 16);
        const g = parseInt(hex.substring(2,4), 16);
        const b = parseInt(hex.substring(4,6), 16);
        return `rgba(${r}, ${g}, ${b}, 0.1)`;
    }

    async function fetchHistoryData() {
        try {
            const response = await fetch('http://localhost:5064/api/telemetria/historial');
            if (!response.ok) throw new Error('Error al obtener datos del servidor');
            
            const list = await response.json();
            const tbody = document.getElementById('history-table-body');
            tbody.innerHTML = ''; 

            if (list.length === 0) {
                tbody.innerHTML = `<tr><td colspan="4" style="padding: 20px; text-align: center; color: var(--textSecondary);">Sin registros en la base de datos.</td></tr>`;
                return;
            }

            let totalTemp = 0, tempCount = 0;
            let totalHum = 0, humCount = 0;
            let totalMq6 = 0, mq6Count = 0;
            let totalMq4 = 0, mq4Count = 0;

            let tempLabels = [], tempVals = [], humVals = [], mq6Vals = [], mq4Vals = [];

           list.forEach(item => {
                const data = JSON.parse(item.datosJson);
                const fechaRaw = data.received_at || data.captured_at || item.fechaRegistro;
                const dateObj = new Date(fechaRaw);
                
                const fechaTabla = dateObj.toLocaleString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' });
                const horaGrafica = dateObj.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
                
                const sensor = data.gas_label || (data.channel_key ? data.channel_key.toUpperCase() : 'Desconocido');
                // Intentar sacar el valor de raw_value si display_value es nulo
                const valorRaw = data.display_value !== null && data.display_value !== undefined ? data.display_value : (data.raw_value !== null ? data.raw_value : '--');
                const valorUnidad = data.display_unit ? data.display_unit : '';
                const valorFinal = `${valorRaw} ${valorUnidad}`;
                
                let estado = data.level || data.confidence || 'Normal';
                let color = 'var(--textSecondary)';
                
                if (estado === 'critical') { color = '#f87171'; estado = 'Crítico'; } 
                else if (estado === 'warning') { color = '#fbbf24'; estado = 'Advertencia'; } 
                else if (estado === 'normal' || estado === 'high' || estado === 'medium') { color = '#4ade80'; estado = 'Estable'; } 
                else if (estado === 'not_installed') { estado = 'No instalado'; }

                // Procesamiento para Promedios y Gráficas
                const upperKey = data.channel_key ? data.channel_key.toUpperCase() : '';
                const upperLabel = data.gas_label ? data.gas_label.toUpperCase() : '';

                if (upperKey.includes('TEMP') && typeof valorRaw === 'number') {
                    totalTemp += valorRaw; tempCount++;
                    tempLabels.push(horaGrafica); tempVals.push(valorRaw);
                }
                if (upperKey.includes('HUM') && typeof valorRaw === 'number') {
                    totalHum += valorRaw; humCount++;
                    humVals.push(valorRaw);
                }
                
                // Mapeo flexible para Gases
                if ((upperKey.includes('MQ6') || upperLabel.includes('LP') || upperLabel.includes('PROPANO') || upperLabel.includes('BUTANO')) && typeof valorRaw === 'number') {
                    totalMq6 += valorRaw; mq6Count++;
                    mq6Vals.push(valorRaw);
                }
                if ((upperKey.includes('MQ4') || upperLabel.includes('METANO') || upperLabel.includes('MONOXIDO')) && typeof valorRaw === 'number') {
                    totalMq4 += valorRaw; mq4Count++;
                    mq4Vals.push(valorRaw);
                }

                const row = document.createElement('tr');
                row.style.borderBottom = '1px solid var(--border)';
                row.innerHTML = `
                    <td style="padding: 12px 8px;">${fechaTabla}</td>
                    <td style="padding: 12px 8px; font-weight: 500;">${sensor}</td>
                    <td style="padding: 12px 8px;">${valorFinal}</td>
                    <td style="padding: 12px 8px; color: ${color}; font-weight: 600;">${estado}</td>
                `;
                tbody.appendChild(row);
            });

            document.getElementById('avg-mq6').textContent = mq6Count > 0 ? (totalMq6 / mq6Count).toFixed(0) : '--';
            document.getElementById('avg-mq4').textContent = mq4Count > 0 ? (totalMq4 / mq4Count).toFixed(0) : '--';
            document.getElementById('avg-temp').textContent = tempCount > 0 ? (totalTemp / tempCount).toFixed(1) : '--';
            document.getElementById('avg-humidity').textContent = humCount > 0 ? (totalHum / humCount).toFixed(1) : '--';

            chartData.labels = tempLabels.reverse();
            chartData.temp = tempVals.reverse();
            chartData.hum = humVals.reverse();
            chartData.mq6 = mq6Vals.reverse();
            chartData.mq4 = mq4Vals.reverse();

            initChart();

        } catch (error) {
            console.error('Error al cargar el historial:', error);
            const tbody = document.getElementById('history-table-body');
            if(tbody) tbody.innerHTML = `<tr><td colspan="4" style="padding: 30px; text-align: center; color: #f87171;">Error al conectar con el servidor.</td></tr>`;
        }
    }

    function initChart() {
        const canvas = document.getElementById('historyChart');
        chartCtx = canvas.getContext('2d');
        
        const initialColor = '#f97316'; // Naranja

        historyChart = new Chart(chartCtx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Temperatura (°C)',
                    data: chartData.temp,
                    borderColor: initialColor,
                    backgroundColor: getGradient(chartCtx, initialColor),
                    borderWidth: 2,
                    pointBackgroundColor: initialColor,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: { padding: 0 }, 
                plugins: { 
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleFont: { size: 13, family: 'Poppins' },
                        bodyFont: { size: 14, family: 'Poppins', weight: 'bold' },
                        padding: 12,
                        cornerRadius: 8,
                        displayColors: false
                    }
                },
                scales: {
                    x: { grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false }, ticks: { color: '#9ca3af', font: { family: 'Poppins' } } },
                    y: { grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false }, ticks: { color: '#9ca3af', font: { family: 'Poppins' } }, beginAtZero: false }
                }
            }
        });
    }

    function updateChart(datasetKey, label, color) {
        if(!historyChart) return;
        
        document.getElementById('chart-title').textContent = `Tendencia de ${label}`;
        
        historyChart.data.datasets[0].label = label;
        historyChart.data.datasets[0].data = chartData[datasetKey];
        historyChart.data.datasets[0].borderColor = color;
        historyChart.data.datasets[0].pointBackgroundColor = color;
        historyChart.data.datasets[0].backgroundColor = getGradient(chartCtx, color);
        
        historyChart.update();
    }

    // Configuración de colores (Naranja, Azul, Rojo, Morado)
    const cards = [
        { id: 'card-temp', key: 'temp', label: 'Temperatura (°C)', color: '#f97316' }, 
        { id: 'card-hum',  key: 'hum',  label: 'Humedad (%)', color: '#3b82f6' },     
        { id: 'card-mq6',  key: 'mq6',  label: 'MQ6 (ADC)', color: '#ef4444' },     
        { id: 'card-mq4',  key: 'mq4',  label: 'MQ4 (ADC)', color: '#a855f7' }      
    ];

    cards.forEach(cardConf => {
        const cardElement = document.getElementById(cardConf.id);
        if(cardElement) {
            cardElement.addEventListener('click', () => {
                // Resetear el estilo de todas las tarjetas
                cards.forEach(c => {
                    const el = document.getElementById(c.id);
                    el.style.borderColor = 'transparent';
                    el.style.backgroundColor = 'var(--surface)'; // Color original oscuro
                    el.classList.remove('active');
                });
                
                // Aplicar color de borde y fondo translúcido a la seleccionada
                cardElement.style.borderColor = cardConf.color;
                cardElement.style.backgroundColor = getCardBackground(cardConf.color);
                cardElement.classList.add('active');
                
                updateChart(cardConf.key, cardConf.label, cardConf.color);
            });
        }
    });

    fetchHistoryData();
});
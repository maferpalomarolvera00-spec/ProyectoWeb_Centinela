document.addEventListener('DOMContentLoaded', () => {
    async function fetchResumen() {
        try {
            const response = await fetch('http://localhost:5064/api/telemetria');
            if (!response.ok) throw new Error('Error al conectar con la API');
            
            const data = await response.json();
            const telemetria = JSON.parse(data.datosJson);

            if (!telemetria || !telemetria.readings) return;

            // 1. Extraer los valores del arreglo de sensores
            let mq6 = '--', mq4 = '--', temp = '--', hum = '--';

            telemetria.readings.forEach(sensor => {
                if (sensor.channel_key === 'mq6_raw') mq6 = sensor.raw_value;
                if (sensor.channel_key === 'mq4_raw') mq4 = sensor.raw_value;
                if (sensor.channel_key === 'temperature') temp = sensor.display_value;
                if (sensor.channel_key === 'humidity') hum = sensor.display_value;
            });

            // 2. Inyectar los valores numéricos en el HTML
            document.getElementById('gas-value').textContent = mq6;
            document.getElementById('methane-value').textContent = mq4;
            document.getElementById('temp-value').textContent = temp;
            document.getElementById('humidity-value').textContent = hum;

            // 3. Actualizar los textos de estado (Quitar el "Sincronizando...")
            document.getElementById('gas-status').textContent = mq6 !== '--' ? 'Dato válido' : 'Sincronizando...';
            document.getElementById('methane-status').textContent = mq4 !== '--' ? 'Dato válido' : 'No instalado';
            document.getElementById('temp-status').textContent = temp !== '--' ? 'Dato válido' : 'Sincronizando...';
            document.getElementById('humidity-status').textContent = hum !== '--' ? 'Dato válido' : 'Sincronizando...';

            // 4. Inyectar datos de la batería
            if (telemetria.battery) {
                document.getElementById('battery-value').textContent = `${telemetria.battery.voltage_v || '--'} V`;
                document.getElementById('battery-sub').textContent = 'Conectado';
            }

        } catch (error) {
            console.error("Error cargando el resumen:", error);
        }
    }
    fetchResumen();
    
    setInterval(fetchResumen, 5000); 
});
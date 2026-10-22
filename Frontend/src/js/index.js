document.addEventListener('DOMContentLoaded', () => {
    // Función para actualizar los datos del dashboard mediante fetch al backend
    async function fetchDashboardData() {
        try {
            /* 
            // DESCOMENTAR CUANDO EL BACKEND ESTÉ CONECTADO:
            const response = await fetch('http://localhost:3000/api/dashboard/sensores');
            if (!response.ok) throw new Error('Error al obtener la telemetría');
            const data = await response.json();

            // Actualizar tarjetas de métricas
            document.getElementById('gas-value').textContent = data.gasLP;
            document.getElementById('methane-value').textContent = data.metano || '—';
            document.getElementById('temp-value').textContent = data.temperatura;
            document.getElementById('humidity-value').textContent = data.humedad;

            // Actualizar panel operativo
            document.getElementById('battery-value').textContent = data.bateria + ' V';
            document.getElementById('stations-value').textContent = `${data.estacionesActivas} de ${data.estacionesTotal}`;
            */
        } catch (error) {
            console.error('No se pudo conectar con el servidor de sensores:', error);
        }
    }

    // Ejecutar al cargar la vista y opcionalmente configurar un intervalo en vivo
    fetchDashboardData();
    // setInterval(fetchDashboardData, 5000); // Actualizar cada 5 segundos si se requiere tiempo real
});
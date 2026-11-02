document.addEventListener('DOMContentLoaded', () => {
    async function fetchDashboardData() {
        try {
            const response = await fetch('http://localhost:5064/api/telemetria');
            
            if (!response.ok) throw new Error('Error al obtener la telemetría');
            
            const data = await response.json();

            document.getElementById('gas-value').textContent = data.gasLP;
            document.getElementById('methane-value').textContent = data.metano || '—';
            document.getElementById('temp-value').textContent = data.temperatura; 
            document.getElementById('humidity-value').textContent = data.humedad;

            document.getElementById('battery-value').textContent = data.bateria + ' %';
            document.getElementById('stations-value').textContent = `${data.estacionesActivas} de ${data.estacionesTotal}`;
            
        } catch (error) {
            console.error('No se pudo conectar con el servidor:', error);
        }
    }

    fetchDashboardData();
    //setInterval(fetchDashboardData, 5000); 
});
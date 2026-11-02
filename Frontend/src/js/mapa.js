document.addEventListener('DOMContentLoaded', () => {
    // 1. CONTROL DE PANTALLA COMPLETA PARA EL MAPA
    const btnFullscreen = document.getElementById('btn-fullscreen');
    const mapContainer = document.getElementById('map-card-container');

    if (btnFullscreen && mapContainer) {
        btnFullscreen.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                mapContainer.requestFullscreen().catch(err => {
                    console.error("Error al intentar activar pantalla completa:", err);
                });
                btnFullscreen.innerHTML = '<i class="fa-solid fa-compress"></i> Minimizar';
            } else {
                document.exitFullscreen();
                btnFullscreen.innerHTML = '<i class="fa-solid fa-expand"></i> Pantalla Completa';
            }
        });

        // Sincronizar icono si el usuario sale con la tecla ESC
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) {
                btnFullscreen.innerHTML = '<i class="fa-solid fa-expand"></i> Pantalla Completa';
            }
        });
    }

    // 2. ACCIÓN DE RECENTRAR MAPA
    const btnRecenter = document.getElementById('btn-recenter');
    if (btnRecenter) {
        btnRecenter.addEventListener('click', () => {
            console.log("Mapa recentrado a la posición actual del robot.");
        });
    }

    // 3. CONEXIÓN PARA EL BACKEND (TELEMETRÍA SLAM)
    async function fetchMapTelemetry() {
        try {
            // Petición a tu API en C#
            const response = await fetch('http://localhost:5064/api/telemetria');
            if (!response.ok) throw new Error('Sin datos de telemetría aún');

            const data = await response.json();
            
            // Convertir el JSON en texto a un objeto JavaScript
            const telemetria = JSON.parse(data.datosJson);

            // 1. Coordenada X / Y (Manejando nulos si no hay pose)
            const x = telemetria.pose?.x_m ?? 0;
            const y = telemetria.pose?.y_m ?? 0;
            document.getElementById('coord-xy-value').textContent = `${x.toFixed(2)} / ${y.toFixed(2)}`;
            document.getElementById('coord-xy-status').textContent = telemetria.pose ? "Señal activa" : "Esperando señal";
            document.getElementById('coord-xy-status').style.color = telemetria.pose ? "#4ade80" : "inherit";

            // 2. Incertidumbre (Convertida de metros a centímetros)
            const incertidumbreMetros = telemetria.pose?.sigma_position_m ?? 0;
            const incertidumbreCm = (incertidumbreMetros * 100).toFixed(1);
            document.getElementById('slam-value').textContent = incertidumbreCm;
            document.getElementById('slam-status').textContent = telemetria.pose ? "Calculado" : "Calculando...";

            // 3. Estación Actual (Estado de navegación)
            const navegacion = telemetria.state?.navigation ?? 'Desconocida';
            document.getElementById('station-value').textContent = navegacion.charAt(0).toUpperCase() + navegacion.slice(1);
            document.getElementById('station-sub').textContent = telemetria.pose ? "Posición confirmada" : "Sin posición";

            // 4. Estado del Robot y Conexión
            const estado = telemetria.state?.reported ?? 'Desconocido';
            const conexion = telemetria.connection === 'online' ? 'En línea' : 'Desconectado';
            const statusSub = document.getElementById('robot-status-sub');
            
            document.getElementById('robot-status-text').textContent = estado.charAt(0).toUpperCase() + estado.slice(1);
            statusSub.textContent = conexion;
            statusSub.style.color = telemetria.connection === 'online' ? '#4ade80' : '#f87171'; // Verde si conecta, Rojo si no

        } catch (error) {
            console.warn('Aviso del Mapa:', error.message);
        }
    }

    // Ejecutar inmediatamente al cargar y luego cada 2 segundos
    fetchMapTelemetry();
    setInterval(fetchMapTelemetry, 2000);
});
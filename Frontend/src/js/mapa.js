document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. CONTROL DE PANTALLA COMPLETA PARA EL MAPA
    // ==========================================
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

    // ==========================================
    // 2. ACCIÓN DE RECENTRAR MAPA
    // ==========================================
    const btnRecenter = document.getElementById('btn-recenter');
    if (btnRecenter) {
        btnRecenter.addEventListener('click', () => {
            // Animación visual o llamada a la función de centrado del plano
            console.log("Mapa recentrado a la posición actual del robot.");
            // alert("Vista recentrada en el robot."); // Opcional si prefieres feedback visual inmediato
        });
    }

    // ==========================================
    // 3. CONEXIÓN PARA EL BACKEND (TELEMETRÍA SLAM)
    // ==========================================
    async function fetchMapTelemetry() {
        try {
            /*
            // DESCOMENTAR CUANDO EL BACKEND ESTÉ CONECTADO:
            const response = await fetch('http://localhost:3000/api/mapa/telemetria');
            const data = await response.json();

            document.getElementById('coord-xy-value').textContent = `${data.x}, ${data.y}`;
            document.getElementById('slam-value').textContent = `± ${data.incertidumbre} cm`;
            document.getElementById('station-value').textContent = data.estacionActual;
            document.getElementById('robot-status-text').textContent = data.estadoRobot;
            */
        } catch (error) {
            console.error('Error al obtener telemetría del mapa:', error);
        }
    }

    // fetchMapTelemetry();
    // setInterval(fetchMapTelemetry, 2000); // Actualización en vivo cada 2 segundos
});
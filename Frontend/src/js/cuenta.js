document.addEventListener('DOMContentLoaded', () => {
    const accountForm = document.getElementById('account-form');

    if (accountForm) {
        accountForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // 1. Capturar valores actuales de los inputs
            const profileData = {
                nombre: document.getElementById('input-name').value.trim(),
                correo: document.getElementById('input-email').value.trim(),
                telefono: document.getElementById('input-phone').value.trim(),
                ubicacion: document.getElementById('input-location').value.trim()
            };

            console.log("Datos listos para enviar al servidor:", profileData);

            try {
                /*
                // DESCOMENTAR CUANDO EL BACKEND ESTÉ CONECTADO:
                const response = await fetch('http://localhost:3000/api/usuario/actualizar', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify(profileData)
                });

                if (!response.ok) throw new Error('Error al actualizar el perfil en el servidor');
                const result = await response.json();
                */

                alert('¡Cambios guardados con éxito! (Listo para conectar con el Back)');
                
                // Actualizar visualización en vivo de la tarjeta superior
                if (profileData.nombre) {
                    document.getElementById('profile-display-name').textContent = profileData.nombre;
                    document.getElementById('user-card-name').textContent = profileData.nombre;
                }
                if (profileData.correo) {
                    document.getElementById('profile-display-email').textContent = profileData.correo;
                }

            } catch (error) {
                console.error('Error de conexión:', error);
                alert('Hubo un error al conectar con el servidor.');
            }
        });
    }

    // ==========================================
    // CARGAR DATOS DESDE LA BASE DE DATOS
    // ==========================================
    async function fetchAccountData() {
        try {
            /*
            // DESCOMENTAR CUANDO EL BACKEND ESTÉ CONECTADO:
            const response = await fetch('http://localhost:3000/api/usuario/perfil');
            const data = await response.json();

            // Rellenar inputs
            document.getElementById('input-name').value = data.nombre || '';
            document.getElementById('input-email').value = data.correo || '';
            document.getElementById('input-phone').value = data.telefono || '';
            document.getElementById('input-location').value = data.ubicacion || '';

            // Rellenar tarjetas superiores
            document.getElementById('profile-display-name').textContent = data.nombre || '—';
            document.getElementById('profile-display-email').textContent = data.correo || '—';
            document.getElementById('user-card-name').textContent = data.nombre || '—';
            document.getElementById('user-card-role').textContent = data.rol || '—';
            */
        } catch (error) {
            console.error('Error al cargar la información de la cuenta:', error);
        }
    }

    // fetchAccountData();
});
document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. GUARDAR DATOS DEL FORMULARIO
    // ==========================================
    const accountForm = document.getElementById('account-form');
    if (accountForm) {
        accountForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Capturar valores actuales de los inputs
            const profileData = {
                nombre: document.getElementById('input-name').value.trim(),
                correo: document.getElementById('input-email').value.trim(),
                telefono: document.getElementById('input-phone').value.trim(),
                ubicacion: document.getElementById('input-location').value.trim()
            };

            console.log("Datos listos para enviar al servidor:", profileData);

            try {
                alert('¡Cambios guardados con éxito! (Listo para conectar con el Back)');
                
                // Actualizar visualización en vivo de la tarjeta superior
                if (profileData.nombre) {
                    const profileName = document.getElementById('profile-display-name');
                    const cardName = document.getElementById('user-card-name');
                    if(profileName) profileName.textContent = profileData.nombre;
                    if(cardName) cardName.textContent = profileData.nombre;
                }
                if (profileData.correo) {
                    const profileEmail = document.getElementById('profile-display-email');
                    if(profileEmail) profileEmail.textContent = profileData.correo;
                }
            } catch (error) {
                console.error('Error de conexión:', error);
                alert('Hubo un error al guardar los cambios.');
            }
        });
    }

    // ==========================================
    // 2. CARGAR DATOS DESDE LA BASE DE DATOS
    // ==========================================
    async function fetchAccountData() {
        try {
            const response = await fetch('http://localhost:5064/api/telemetria/cuenta');
            if (!response.ok) throw new Error('Error al cargar el perfil');
            
            const data = await response.json();
            if (!data || data.length === 0) return;
            
            const home = data[0];

            // Rellenar input de ubicación con el nombre del domicilio (tabla homes)
            const locationInput = document.getElementById('input-location');
            if (locationInput && home.name) {
                locationInput.value = home.name;
            }

            // Rellenar rol del usuario (tabla memberships)
            if (home.memberships && home.memberships.length > 0) {
                const rol = home.memberships[0].role;
                const cardRole = document.getElementById('user-card-role');
                if (cardRole) {
                    cardRole.textContent = rol.charAt(0).toUpperCase() + rol.slice(1);
                }
            }
        } catch (error) {
            console.error('Error al cargar la información de la cuenta:', error);
        }
    }

    fetchAccountData();
});
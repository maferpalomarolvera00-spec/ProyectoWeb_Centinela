# ProyectoWeb_Centinela

# Proyecto Centinela 🛡️

Sistema web interdisciplinario de monitoreo y control para estaciones ambientales e IoT, desarrollado para la gestión inteligente de datos (gas LP, metano, temperatura, humedad, mapas de ubicación y registro de eventos).

## 🛠️ Tecnologías Utilizadas
* **Frontend:** HTML5, CSS3 (Diseño modular con variables de diseño *Lunar Base*).
* **Lógica:** JavaScript (Vanilla JS con manejo de módulos ES6).
* **Entorno de Desarrollo:** Visual Studio Code con extensión *Live Server*.
* **Control de Versiones:** Git y GitHub (Flujo de trabajo basado en ramas de características o *feature branches*).

## 📂 Estructura del Proyecto
El proyecto se encuentra modularizado para facilitar el mantenimiento y la escalabilidad del código frontend:

```
ProyectoWeb_Centinela/
└── Frontend/
    └── src/
        ├── css/
        │   └── style.css       <-- Estilos globales y tokens de diseño
        ├── js/
        │   └── script.js       <-- Lógica general y control de interfaz (Sidebar / Tema)
        └── views/
            ├── index.html      <-- Vista de Resumen / Dashboard principal
            ├── mapa.html       <-- Vista de Mapa 2D e Incertidumbre
            ├── historial.html  <-- Vista de Historial y Gráficas
            ├── recordatorios.html <-- Vista de Alertas y Eventos
            └── cuenta.html     <-- Vista de Configuración de Usuario
```

# 👥 Autores
Esteban Cruz Báez (Desarrollo Frontend e Interfaces)
Mía Fernanda Palomar Sánchez (Desarrollo Frontend e Interfaces)
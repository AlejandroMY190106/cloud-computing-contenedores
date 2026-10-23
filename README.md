# Despliegue de Aplicación Web Multi-Contenedor con Base de Datos

Proyecto desarrollado para la actividad calificada de Cloud Computing (Semana 10). Consiste en una arquitectura de microservicios contenerizada con Docker Compose que incluye autenticación segura contra PostgreSQL y exposición mediante proxy inverso Nginx.

## Arquitectura de Servicios

- **Proxy Inverso:** Nginx (`proxy_nginx`) exponiendo el puerto público `80`.
- **Aplicación Web:** Node.js Express + React (`web_app`) en el puerto interno `3000`.
- **Base de Datos:** PostgreSQL 17 (`postgres_db`) en red privada interna con volumen persistente `pgdata`.

## Requisitos Previos

- Docker y Docker Compose instalados.
- Puerto `80` disponible en el host.

## Instrucciones de Ejecución Local

1. Clonar el repositorio:

   ```bash
   git clone <URL_DE_ESTE_REPOSITORIO>
   cd Actividad10-CloudComputing
   ```

2. Configurar variables de entorno:
   Copiar el archivo de plantilla `.env.example` como `.env`:

   ```bash
   cp .env.example .env
   ```

3. Construir y levantar los contenedores:

   ```bash
   docker compose up --build -d
   ```

4. Acceder al aplicativo:
   Abrir en el navegador: `http://localhost`

## Usuarios de Prueba

- **Administrador:** `admin` | Contraseña: `AdminPass123!`
- **Usuario estándar:** `joel` | Contraseña: `UserPass123!`

## Imagen en Docker Hub

- Imagen pública: `alejandromy190106/app-auth:1.0.0`

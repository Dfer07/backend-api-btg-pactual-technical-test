# BTG Pactual - Investment Funds Management Platform

Prueba técnica para el desarrollo de un backend escalable y seguro para la gestión de vinculación de usuarios a fondos de inversión.

## Tecnologías Utilizadas

- **Marco de Trabajo (Framework)**: [NestJS](https://nestjs.com/) v10+
- **Lenguaje**: TypeScript (Modo Estricto)
- **Infraestructura**: AWS Serverless (Lambda, DynamoDB, SES)
- **Despliegue (IaC)**: Serverless Framework
- **Seguridad**: JWT (Access & Refresh), bcrypt, Helmet, Throttler
- **Arquitectura**: Clean Architecture (Hexagonal)

## Requisitos Previos

- Node.js v18+
- [Serverless Framework CLI](https://www.serverless.com/framework/docs/getting-started) (`npm install -g serverless`)
- Credenciales AWS configuradas (opcional para local con LocalStack/Offline)

## Instalación

```bash
git clone <repo-url>
cd backend
npm install
```

## Configuración

Copia el archivo `.env.example` a `.env` y ajusta los valores necesarios:

```bash
cp .env.example .env
```

| Variable | Descripción |
|----------|-------------|
| `JWT_SECRET` | Clave secreta para tokens |
| `SES_FROM_EMAIL` | Email verificado en AWS SES |
| `DYNAMODB_ENDPOINT` | Opcional (para local/LocalStack) |

## Ejecución

### Desarrollo Local (Offline)

Simula AWS Lambda y DynamoDB localmente:

```bash
npm run dev
```

### Pruebas de Administrador (Admin)
Se ha incluido un usuario administrador por defecto mediante el script de seed:
- **Email**: `admin@btgpactual.com`
- **Password**: `AdminPassword123!`

Este usuario tiene acceso a la carpeta **Admin** en Postman, permitiendo visualizar todos los usuarios y transacciones del sistema.

### Base de Datos (Seeding)

Carga los 5 fondos iniciales en DynamoDB:

```bash
npm run seed
```

### Pruebas (TDD)

```bash
npm run test        # Unitarias
npm run test:cov    # Cobertura
```

## Documentación de la API

La colección de Postman se encuentra en `postman/btg-fondos.postman_collection.json`.

### Endpoints Principales (Base Path: `/api/v1`)

- **Autenticación (AUTH)**:
  - `POST /auth/register`: Registro de cliente (Saldo: 500,000 COP). Acepa `notificationPreference` (EMAIL/SMS).
  - `POST /auth/login`: Login exitoso retorna `accessToken`, `refreshToken` y datos del usuario.
  - `POST /auth/refresh`: Renueva el `accessToken` usando el `refreshToken`.
  - `POST /auth/logout`: Endpoint para cierre de sesión y limpieza en cliente.

- **Fondos (FUNDS)**:
  - `GET /funds`: Lista los 5 fondos disponibles con sus montos mínimos.

- **Suscripciones (SUBSCRIPTIONS)**:
  - `POST /subscriptions/subscribe`: Vincularse a un fondo (Valida saldo y duplicados).
  - `POST /subscriptions/cancel`: Desvincularse de un fondo (Reembolsa monto exacto).
  - `GET /subscriptions/active`: Suscripciones activas del usuario.

- **Usuarios (USERS)**:
  - `GET /users/me`: Perfil del usuario autenticado.
  - `PATCH /users/me/notification-preference`: Cambia preferencia entre `EMAIL` y `SMS`.

- **Transacciones (TRANSACTIONS)**:
  - `GET /transactions/history`: Historial personal de aperturas y cancelaciones.

- **Administración (ADMIN)**:
  - `GET /admin/users`: Ver todos los usuarios registrados (Solo ADMIN).
  - `GET /admin/transactions`: Historial global de transacciones (Solo ADMIN).

## Decisiones Técnicas

1. **Clean Architecture**: Separación estricta de capas para alta testabilidad.
2. **Strategy Pattern**: Servicio de notificaciones desacoplado (AWS SES vs Console Log).
3. **Optimización DynamoDB**: Uso de Single Table Design reducido y GSIs para búsquedas por email.
4. **Seguridad**:
   - `esModuleInterop` habilitado para importaciones limpias.
   - Headers de seguridad con Helmet.
   - Throttling en autenticación.
   - Validación Joi de entorno.

## Despliegue

```bash
npm run deploy
```

---
Desarrollado para la prueba técnica de BTG Pactual.

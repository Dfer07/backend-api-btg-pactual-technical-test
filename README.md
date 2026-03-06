<div align="center">

# 🏦 BTG Pactual — Fondos de Inversión API

**Backend RESTful para gestión de fondos de inversión**  
Construido con NestJS · TypeScript · AWS Lambda · DynamoDB

[![NestJS](https://img.shields.io/badge/NestJS-10.x-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![AWS Lambda](https://img.shields.io/badge/AWS_Lambda-Serverless-FF9900?style=for-the-badge&logo=aws-lambda&logoColor=white)](https://aws.amazon.com/lambda/)
[![DynamoDB](https://img.shields.io/badge/DynamoDB-NoSQL-4053D6?style=for-the-badge&logo=amazon-dynamodb&logoColor=white)](https://aws.amazon.com/dynamodb/)
[![Jest](https://img.shields.io/badge/Jest-Tests-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)

[Características](#-características) · [Arquitectura](#-arquitectura) · [Instalación local](#-instalación-local) · [Despliegue AWS](#-despliegue-en-aws) · [API Docs](#-documentación-de-la-api) · [Tests](#-pruebas)

</div>

---

## 📋 Descripción

API REST para una plataforma de fondos de inversión. Permite a clientes registrarse, suscribirse y cancelar suscripciones a fondos, recibir notificaciones por email o SMS (simulado por consola), y consultar su historial de transacciones. El módulo de administración expone endpoints exclusivos para el rol `ADMIN`.

Desarrollado como prueba técnica aplicando **Clean Architecture**, **DDD**, y desplegado de forma completamente serverless en AWS.

---

## ✨ Características

| Módulo | Funcionalidad |
|--------|--------------|
| 🔐 **Auth** | Registro, login, logout, refresh token con rotación y detección de replay |
| 👤 **Users** | Perfil de usuario, preferencia de notificación (email/SMS) |
| 💰 **Funds** | Catálogo de fondos disponibles con monto mínimo |
| 📄 **Subscriptions** | Suscribir/cancelar fondos con control de saldo |
| 📊 **Transactions** | Historial completo de aperturas y cancelaciones |
| 🔔 **Notifications** | Email HTML (Nodemailer) o SMS simulado por preferencia |
| 🛡️ **Admin** | Listado global de usuarios y transacciones (solo rol ADMIN) |

---

## 🏗️ Arquitectura

El proyecto implementa **Clean Architecture** con separación estricta en tres capas por módulo. Para mayor claridad de la arquitectura se puede consultar el archivo [ARCHITECTURE.md](ARCHITECTURE.md).

### 📁 Estructura de Carpetas

```
src/
├── app.module.ts
├── main.ts                    ← Bootstrap local
├── lambda.ts                  ← Bootstrap AWS Lambda
├── config/configuration.ts    ← Variables de entorno centralizadas
├── common/
│   ├── decorators/            ← @Roles()
│   ├── enums/                 ← UserRole, NotificationType, etc.
│   ├── filters/               ← GlobalExceptionFilter
│   ├── guards/                ← JwtAuthGuard, RolesGuard
│   └── interceptors/          ← LoggingInterceptor
├── database/
│   ├── dynamo.service.ts
│   └── seeds/funds.seed.ts
└── modules/
    ├── auth/
    │   ├── application/       ← LoginUseCase, RegisterUseCase, ...
    │   ├── dto/               ← RegisterDto, LoginDto (class-validator)
    │   └── infrastructure/    ← JwtStrategy
    ├── users/
    ├── funds/
    ├── subscriptions/
    ├── transactions/
    ├── notifications/
    └── admin/
```

---

## 🔐 Flujo de Autenticación

```
REGISTER / LOGIN                     USAR TOKEN               RENOVAR
─────────────────                    ──────────               ───────
POST /auth/register                  GET /funds               POST /auth/refresh
POST /auth/login                     Authorization:           { refreshToken }
        │                            Bearer <accessToken>            │
        ▼                                                            ▼
 { accessToken  (1h)  }              JwtStrategy valida       Nuevo par de tokens
 { refreshToken (7d)  }  ──────────▶ firma + existencia       Refresh anterior
   hasheado en DynamoDB              del usuario en DB        invalidado (rotación)
```

---

## 🚀 Instalación Local

### Pre-requisitos

- Node.js `>= 20.x`
- npm `>= 9.x`
- Docker (para DynamoDB local)

### 1 — Clonar e instalar

```bash
git clone https://github.com/Dfer07/backend-api-btg-pactual-technical-test.git
cd backend-api-btg-pactual-technical-test
npm install
```

### 2 — Variables de entorno

```bash
cp .env.example .env
```

Edita `.env` — los campos mínimos para desarrollo local:

```env
NODE_ENV=development

# Genera secrets con:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=<tu_secreto_min_32_chars>
JWT_REFRESH_SECRET=<otro_secreto_diferente>

FRONTEND_URL=http://localhost:5173
DYNAMO_ENDPOINT=http://localhost:8000

SMTP_USER=tu_correo@gmail.com
SMTP_PASS=tu_app_password_de_gmail
```

### 3 — DynamoDB Local

```bash
docker run -d \
  --name dynamodb-local \
  -p 8000:8000 \
  amazon/dynamodb-local \
  -jar DynamoDBLocal.jar -inMemory -sharedDb
```

### 4 — Seed de fondos

```bash
npm run seed
```
### Pruebas de Administrador (Admin)
Se ha incluido un usuario administrador por defecto mediante el script de seed:
- **Email**: `admin@btgpactual.com`
- **Password**: `AdminPassword123!`

Este usuario tiene acceso a la carpeta **Admin** en Postman, permitiendo visualizar todos los usuarios y transacciones del sistema.

### 5 — Iniciar

```bash
npm run start:dev
# API disponible en http://localhost:3000/api/v1
```

---

## ☁️ Despliegue en AWS

### Pre-requisitos

```bash
npm install -g serverless
aws configure   # Configura tus credenciales AWS
```

### Deploy

```bash
# Build + deploy al stage dev
npm run deploy

# Deploy a producción
serverless deploy --stage prod

# Ver logs en tiempo real
serverless logs -f api --tail
```

### Recursos que crea en AWS

| Recurso | Nombre |
|---------|--------|
| Lambda | `btg-pactual-fondos-{stage}-api` |
| API Gateway | Auto-generado (URL en el output del deploy) |
| DynamoDB x4 | `btg-users/funds/subscriptions/transactions-{stage}` |
| IAM Role | Mínimo privilegio — solo acceso a las 4 tablas |

---

## 📖 Documentación de la API

> Importa la colección de Postman: `postman/btg-fondos.postman_collection.json`

**Base URL local:** `http://localhost:3000/api/v1`

### 🔐 Auth

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `POST` | `/auth/register` | — | Registro (saldo inicial $500.000 COP) |
| `POST` | `/auth/login` | — | Login |
| `POST` | `/auth/refresh` | — | Renovar tokens |
| `POST` | `/auth/logout` | JWT | Cerrar sesión |

```jsonc
// POST /auth/register
{
  "email": "usuario@ejemplo.com",
  "password": "minimo8chars",
  "fullName": "Juan Pérez",
  "phone": "+573001234567",
  "notificationPreference": "EMAIL"  // "EMAIL" | "SMS"
}
```

### 👤 Users

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/users/me` | JWT | Perfil del usuario |
| `PATCH` | `/users/notification-preference` | JWT | Cambiar EMAIL/SMS |

### 💰 Funds

Por defecto, el sistema se inicializa (mediante el script `seed`) con los siguientes 5 fondos de inversión disponibles:

| Nombre | Categoría | Monto Mínimo |
|--------|-----------|--------------|
| `FPV_BTG_PACTUAL_RECAUDADORA` | FPV | $75.000 COP |
| `FPV_BTG_PACTUAL_ECOPETROL` | FPV | $125.000 COP |
| `DEUDAPRIVADA` | FIC | $50.000 COP |
| `FDO-ACCIONES` | FIC | $250.000 COP |
| `FPV_BTG_PACTUAL_DINAMICA` | FPV | $100.000 COP |

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/funds` | JWT | Listar fondos disponibles |

### 📄 Subscriptions

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `POST` | `/subscriptions/subscribe` | JWT | Suscribirse a un fondo |
| `POST` | `/subscriptions/cancel` | JWT | Cancelar suscripción |
| `GET` | `/subscriptions/active` | JWT | Suscripciones activas |

```jsonc
// POST /subscriptions/subscribe  y  /subscriptions/cancel
{ "fundId": "id-del-fondo" }
```

**Reglas de negocio:**
- Saldo insuficiente → `400` con mensaje exacto
- Ya suscrito al fondo → `409`
- Al cancelar → se devuelve el monto invertido al saldo

### 📊 Transactions

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/transactions/history` | JWT | Historial del usuario |

### 🛡️ Admin

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/admin/users` | JWT + ADMIN | Todos los usuarios |
| `GET` | `/admin/transactions` | JWT + ADMIN | Todas las transacciones |

> Para promover un usuario a ADMIN: modifica el campo `role` en DynamoDB directamente.

### ❌ Formato de errores

```jsonc
{
  "statusCode": 400,
  "message": "No tiene saldo disponible para vincularse al fondo FPV_BTG_PACTUAL_RECAUDADORA",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/subscriptions/subscribe"
  // En NODE_ENV=development se incluye: error_detail, stack
}
```

---

## 🧪 Pruebas

```bash
npm test              # Ejecutar todos los tests
npm run test:cov      # Con reporte de cobertura
npm run test:watch    # Modo watch
```

| Suite | Casos cubiertos | Tests |
|-------|----------------|-------|
| `login.use-case.spec.ts` | Login exitoso, credenciales inválidas | 2 |
| `register.use-case.spec.ts` | Registro correcto con $500k, email duplicado | 2 |
| `subscribe-to-fund.use-case.spec.ts` | Éxito, saldo insuficiente, ya suscrito | 3 |
| `cancel-subscription.use-case.spec.ts` | Devolución de saldo, sin suscripción activa | 2 |

Los tests usan **mocks de interfaces** — DynamoDB nunca se invoca en los tests unitarios.

---

## 🔒 Seguridad

| Medida | Detalle |
|--------|---------|
| HTTP Headers | `helmet` — X-Frame-Options, HSTS, XSS Protection, etc. |
| Rate Limiting | 10 req/min en endpoints de autenticación |
| Validación | `whitelist: true` + `forbidNonWhitelisted` — nada extra pasa |
| Passwords | bcrypt con cost factor **12** |
| Refresh Tokens | SHA256 pre-hash + bcrypt — nunca en texto plano en DB |
| Replay Attack | Reutilización de refresh token invalida la sesión completa |
| IAM | Mínimo privilegio — solo las 4 tablas del proyecto |
| Prod Errors | Sin stack traces expuestos en producción |
| Env Vars | Validadas con Joi al arrancar — falla rápido si faltan |

---

## ⚙️ Variables de Entorno

| Variable | Req. | Default | Descripción |
|----------|------|---------|-------------|
| `PORT` | — | `3000` | Puerto del servidor |
| `NODE_ENV` | — | `development` | Entorno |
| `FRONTEND_URL` | ✅ | — | URL del frontend (links en emails) |
| `JWT_SECRET` | ✅ | — | Secreto access token (min 32 chars) |
| `JWT_EXPIRES_IN` | — | `1h` | Expiración access token |
| `JWT_REFRESH_SECRET` | ✅ | — | Secreto refresh token (diferente) |
| `JWT_REFRESH_EXPIRES_IN` | — | `7d` | Expiración refresh token |
| `AWS_REGION_NAME` | ✅ | — | Región AWS |
| `AWS_ACCESS_KEY_ID` | Local | — | Clave IAM (Lambda usa rol automático) |
| `AWS_SECRET_ACCESS_KEY` | Local | — | Secret IAM (Lambda usa rol automático) |
| `DYNAMO_ENDPOINT` | Local | — | `http://localhost:8000` para local |
| `DYNAMO_USERS_TABLE` | ✅ | — | Tabla usuarios |
| `DYNAMO_FUNDS_TABLE` | ✅ | — | Tabla fondos |
| `DYNAMO_SUBSCRIPTIONS_TABLE` | ✅ | — | Tabla suscripciones |
| `DYNAMO_TRANSACTIONS_TABLE` | ✅ | — | Tabla transacciones |
| `SMTP_HOST` | — | `smtp.gmail.com` | Host SMTP |
| `SMTP_PORT` | — | `465` | Puerto SMTP |
| `SMTP_USER` | ✅ | — | Correo remitente |
| `SMTP_PASS` | ✅ | — | App Password de Gmail |

> **Nota AWS Lambda:** No necesitas `AWS_ACCESS_KEY_ID` ni `AWS_SECRET_ACCESS_KEY` en producción. El SDK las toma automáticamente del IAM Role de ejecución.

---

## 📌 Scripts

```bash
npm run start:dev     # Desarrollo con hot reload
npm run start:prod    # Producción local
npm run build         # Compilar TypeScript
npm run test          # Tests unitarios
npm run test:cov      # Tests con cobertura
npm run lint          # ESLint
npm run seed          # Cargar fondos en DynamoDB
npm run deploy        # Build + deploy a AWS
```

---

## 📐 Decisiones de Diseño

Para la explicación detallada de arquitectura, patrones, seguridad avanzada y comparaciones contra otras arquitecturas, consulta:

📄 **[ARCHITECTURE.md](./ARCHITECTURE.md)**

---

## 👨‍💻 Autor

**Diego Enriquez**  
Prueba Técnica — BTG Pactual · 2026

---
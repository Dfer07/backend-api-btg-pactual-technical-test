# Arquitectura de la Solución

## ¿Por qué Clean Architecture?

Es la arquitectura que más me convence cuando hay reglas de negocio que proteger. La elección no fue automática,sino que fue porque el problema lo justificaba: validaciones de saldo, estados de suscripción, roles de usuario. Todo eso es lógica de negocio que no le debe importar si la base de datos es DynamoDB, Postgres o cualquier otra cosa.

La idea central es simple: **el dominio no conoce a nadie, pero todos lo conocen a él.** Eso me da la libertad de cambiar infraestructura sin tocar una sola regla de negocio.

Por otro lado, algo que también pesó en la decisión es que es la arquitectura con la que más me siento cómodo y con la que más he trabajado. La separación de capas me ayuda mucho en el día a día, si hay un bug en una regla de negocio, sé que tengo que ir al domain; si algo falla en cómo se persiste, voy directo a infrastructure. No tengo que rastrear todo el proyecto. Y a la hora de testear, puedo escribir tests unitarios puros sobre la lógica más crítica sin necesidad de mockear frameworks ni levantar base de datos.

## Diagrama
```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENTE / FRONTEND                    │
└─────────────────────────────┬────────────────────────────────┘
                              │ HTTPS
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                      AWS API GATEWAY                         │
│              /api/v1  ·  /api/v1/{proxy+}                    │
└─────────────────────────────┬────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                      AWS LAMBDA                              │
│              handler: dist/lambda.handler                    │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │           CAPAS TRANSVERSALES (NestJS)                 │  │
│  │  Helmet · CORS · ThrottlerGuard · ValidationPipe       │  │
│  │  GlobalExceptionFilter · JwtAuthGuard · RolesGuard     │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐    │
│  │  /auth   │ │  /users  │ │  /funds  │ │/subscriptions │    │
│  └──────────┘ └──────────┘ └──────────┘ └───────────────┘    │
│  ┌──────────────────────┐   ┌───────────────────────────┐    │
│  │    /transactions     │   │  /admin  ADMIN ONLY       │    │
│  └──────────────────────┘   └───────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │           CAPA DE APLICACIÓN (Use Cases)               │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              CAPA DE DOMINIO                           │  │
│  │  User · Fund · Subscription · Transaction · Interfaces │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │           CAPA DE INFRAESTRUCTURA                      │  │
│  │  DynamoRepositories · EmailService · SmsService        │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────┬──────────────────────────┬────────────────────┘
               │                          │
               ▼                          ▼
┌──────────────────────┐      ┌──────────────────────────────┐
│    AWS DYNAMODB      │      │   SMTP Gmail                 │
│  btg-users-{stage}   │      │   Notificaciones por email   │
│  btg-funds-{stage}   │      └──────────────────────────────┘
│  btg-subs-{stage}    │
│  btg-txns-{stage}    │
└──────────────────────┘
```

## Justificación por capa

**Dominio** es el núcleo. Aquí viven las entidades (`User`, `Subscription`, `Transaction`) y las interfaces de repositorio. No depende de nada externo — ni de NestJS, ni de DynamoDB, ni de ningún framework. Es la capa que más cuido porque es la que concentra el valor real del sistema.

**Aplicación** contiene los casos de uso. Cada uno resuelve exactamente una cosa: suscribir a un fondo, cancelar, registrar un usuario. Orquestan el dominio sin saber cómo se persiste ni cómo se notifica — solo hablan con interfaces.

**Infraestructura** es la que ensucia las manos. Los repositorios concretos contra DynamoDB, la implementación de notificaciones por email y SMS, la estrategia JWT. Si algo cambia aquí, el dominio no se entera.

---

## Por qué Serverless sobre un servidor tradicional

Elegí Lambda + API Gateway porque el patrón de acceso es irregular y no justifica mantener un servidor corriendo 24/7. El escalado es automático, el costo es por invocación, y toda la infraestructura queda definida en el `serverless.yml` — reproducible en cualquier entorno con un solo comando.

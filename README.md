# Fing - Arquitectura y Hoja de Ruta del Frontend

Este documento detalla la estructura, flujo y evolución del **Frontend (Web y Móvil)** de la plataforma "Fing", diseñado utilizando diagramas de texto plano (ASCII/Unicode) para asegurar compatibilidad total en cualquier visor.

## 🛠️ Stack Tecnológico del Frontend
*   **Web SPA:** React.js con TypeScript, alojado en **Firebase Hosting** para entregas rápidas globales y escalables.
*   **App Móvil:** React Native con TypeScript para compilar aplicaciones nativas de alto rendimiento en **iOS y Android**.
*   **Lógica Compartida:** Uso de TypeScript para interfaces y tipados comunes de API (interfaces de Usuario, Transacción, Cuenta y Categoría).
*   **Estilo y UI:** Componentes reactivos, adaptados para ofrecer una experiencia fluida y consistente en pantallas de computadoras y dispositivos móviles.

---

## 🗺️ Hoja de Ruta de Desarrollo - Frontend

La evolución del frontend se divide en tres fases principales de entrega:

```
┌─────────────────────────────────┐
│     Versión 0.5: MVP Web        │  <--- Inicio con interfaz responsiva en Firebase
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│  Versión 1.0: Expansión Móvil  │  <--- Migración de flujos a React Native (iOS/Android)
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│ Versión 1.5+: Consolidación UI  │  <--- Sincronización de estados locales y offline-first
└─────────────────────────────────┘
```

1.  **v0.5 (MVP Web):** Construcción de la aplicación web tipo SPA. Configuración del flujo de login, panel de control de gastos (dashboard), gráficos visuales e interfaz de ingreso manual de transacciones. Despliegue continuo en Firebase Hosting.
2.  **v1.0 (Expansión Móvil):** Creación del repositorio de React Native. Reutilización de los tipados de TypeScript y controladores de API compartidos para construir la interfaz nativa móvil.
3.  **v1.5+ (Consolidación):** Pulido de componentes, almacenamiento local (offline-first) para visualizaciones rápidas de transacciones anteriores y sincronización de estado fluida.

---

## 🔄 Flujo de Integración del Frontend

El siguiente diagrama ilustra cómo las dos interfaces cliente (Web y Móvil) interactúan de manera independiente y segura con la API unificada del proyecto:

```
      ┌─────────────────────────────────────────────────────────────┐
      │                      ESQUEMAS COMUNES                       │
      │         - Interfaces de TypeScript Compartidas             │
      └──────────────────────────────┬──────────────────────────────┘
                                     │
                 ┌───────────────────┴───────────────────┐
                 ▼                                       ▼
   ┌──────────────────────────┐            ┌──────────────────────────┐
   │       FRONTEND WEB       │            │      FRONTEND MÓVIL      │
   │      (React.js SPA)      │            │      (React Native)      │
   ├──────────────────────────┤            ├──────────────────────────┤
   │ Alojado en Firebase      │            │ Compilados Nativos       │
   │ Responsive para Desktop  │            │ Optimizados iOS/Android  │
   └─────────────┬────────────┘            └─────────────┬────────────┘
                 │                                       │
                 │              (Peticiones REST)        │
                 └───────────────────┬───────────────────┘
                                     │ (HTTPS / JSON API)
                                     ▼
   ┌──────────────────────────────────────────────────────────┐
   │                    BACKEND (GCP Cloud Run)               │
   │            - Procesa consultas y guarda transacciones     │
   └──────────────────────────────────────────────────────────┘
```

---

## 📂 Repositorio de Código Fuente
*   **Código Frontend Web/Móvil:** [github.com/gastonrb19/fing-front](https://github.com/gastonrb19/fing-front)

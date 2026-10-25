# 📌 Tareas Frontend (TODO)

### 🌐 Despliegue y Validación en AWS EC2 (Nginx Puerto 80)
- [ ] **Subir Cambios de Producción a GitHub (`fing-front`):** Hacer commit y push de los módulos de Ingresos, centralización de `API_URL`, `Dockerfile` y `nginx.conf` antes de clonar en la EC2.
- [ ] **Desplegar Contenedor Frontend/Nginx en EC2:** Levantar `fing-frontend` con `docker compose -f docker-compose.prod.yml up -d --build` validando acceso público por la Elastic IP en el puerto `80` y soporte de recarga directa en rutas de React Router (`/movements`, `/income`).
- [ ] **Pruebas End-to-End en Dispositivos Reales (PC y Celulares):** Validar login, persistencia de sesión, registro/edición de gastos compartidos e ingresos, subtotales en Movimientos y cierre de sesión desde ambos celulares (iOS/Android).

### 🧹 Limpieza Integral de Datos en Duro (Post-Deploy)
- [ ] **Conectar Tipos de Gasto (`GET /typespends`) en `NewMovementForm.tsx`:** Consumir el endpoint para poblar dinámicamente el selector de periodicidad (Fijo, Variable, Cuotas) e incluir `fkTypeSpend` en el `POST /spends`.
- [ ] **Datos Reales en Detalle de Movimiento (`WrapCardMovement.tsx`):** Cargar los tipos de gasto dinámicamente en el selector en lugar de opciones estáticas.

### 🛡️ UX y Validación
- [ ] **Renderizar Errores de Validación (Zod) en UI:** Mapear errores de validación estructurados devueltos por el backend marcando los inputs específicos con borde rojo (`border-rose-500`) y texto descriptivo bajo cada campo.

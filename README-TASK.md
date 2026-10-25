# 📌 Tareas Frontend (TODO)

### 🌐 Integración y Consumo con AWS App Runner (Post-Deploy del Backend)
- [ ] **Configuración de Endpoint de Producción (`VITE_API_URL`):**
  - Configurar la URL base apuntando al dominio HTTPS provisto por AWS App Runner (ej. `https://xxxx.us-east-1.awsapprunner.com`).
  - Validar que el interceptor global (`src/utils/api.ts`) mantenga `credentials: "include"` para el intercambio de cookies HTTP-Only de sesión con el backend en AWS.
- [ ] **Validación de Autenticación y CORS entre Dominios:**
  - Probar flujo completo de Login, renovación y cierre de sesión contra el backend en AWS App Runner.
  - Asegurar compatibilidad de cookies cross-site (`SameSite=None; Secure`).
- [ ] **Manejo de Resiliencia:**
  - Implementar mensajes o spinners de espera en caso de que la instancia esté reanudando o atendiendo peticiones iniciales.

### 🧹 Limpieza Integral de Datos en Duro (Información 100% Real)
- [ ] **Conectar Tipos de Gasto (`GET /typespends`) en `NewMovementForm.tsx`:**
  - Consumir el endpoint para poblar dinámicamente el selector de periodicidad (Fijo, Variable, Cuotas).
  - Incluir `fkTypeSpend` seleccionado en el payload del `POST /spends`.
- [ ] **Datos Reales en Detalle de Movimiento (`WrapCardMovement.tsx`):**
  - Cargar los tipos de gasto dinámicamente en el selector en lugar de opciones estáticas.
- [ ] **Auditoría y Depuración de Datos Ficticios:**
  - Revisar y conectar métricas reales de Ingresos en `ContainerCards.tsx` cuando el backend disponga del módulo, o reflejar estado informativo real sin números inventados.
  - Auditar todos los dropdowns, listas y selectores de la aplicación para asegurar que ningún campo utilice datos estáticos quemados.

### 🛡️ UX y Validación
- [ ] **Renderizar Errores de Validación (Zod) en UI:**
  - Mapear errores de validación estructurados devueltos por el backend marcando los inputs específicos con borde rojo (`border-rose-500`) y texto descriptivo bajo cada campo.

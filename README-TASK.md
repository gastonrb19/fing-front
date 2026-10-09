# 📌 Tareas por hacer (TODO)

### Prioridad alta
- [ ] Formatear amount como moneda (separador de miles, símbolo, decimales) y diferenciar ingresos/gastos por color.
- [ ] Actualizar interfaces TypeScript (renombrar `totalAmount` a `amount` y adaptar DTOs según el backend refactorizado).
- [ ] Consumir APIs dinámicas de Categories, Subcategories y TypeSpends directamente desde el componente `NewMovementForm.tsx`.

### Prioridad media
- [ ] Renderizar en UI los errores de validación estructurados (Zod) provenientes del backend, marcando los inputs del formulario en rojo.

### Prioridad baja / mejoras

- [ ] (Auth) Integrar manejo de sesión global: Sustituir la variable `currentUserId` en los componentes de Amistades obteniendo el ID real del usuario desde un Context, Cookie o LocalStorage post-login.

### 📊 Fase 2: Formulario de Gastos y Splits (`NewMovementForm.tsx`)
- [ ] Refactor de Inputs: Cambiar "Día vencimiento cuota" de `date` a `number` (1-31), y remover el checkbox "Pagado".
- [ ] Selector de Amigos (`SplitParticipantsSelector.tsx`): Crear un sub-componente inyectable que liste amistades activas.
- [ ] Envío Final: Modificar el `onSubmit` para enviar el Payload al `POST /spends` incluyendo el arreglo de `participants`.

### 📉 Fase 3: Dashboard de Deudas (`Movements.tsx`)
- [ ] Botón de Rechazo: Agregar botón rojo "Rechazar Asignación" que consuma `PUT /installmentuserpayments/:id/reject`.

### 🤝 Fase 4: Evidencias y Solidaridad
- [ ] Auditoría del Creador: Crear vista para que el Creador vea amigos que rechazaron cuotas (`GET /installmentuserpayments/rejected`).
- [ ] Rescate Financiero: Opción en la tarjeta para pagar la cuota de un amigo asumiendo el rol (`assumedByUserId`).

### 🔗 Integración de Datos Base y Refactorización
- [ ] Eliminar Hardcodes (`CURRENT_USER_ID`): Reemplazar la asquerosa constante `const CURRENT_USER_ID = 1;` en `NewMovementForm.tsx`, Amistades y Movimientos, usando un AuthContext o LocalStorage post-login.
- [ ] Conectar Categorías: Consumir el Endpoint `GET /categories` para poblar el dropdown de Categorías en `NewMovementForm.tsx` (en lugar de datos quemados).
- [ ] Conectar Tipos de Gasto: Consumir el Endpoint de Tipos de Gasto para poblar el dropdown de periodicidad (Fijo/Variable/Cuotas).
- [ ] Revisión General de Datos Estáticos: Auditar otros campos que actualmente tienen valores en duro en los dropdowns del frontend y enlazarlos al backend.

### Fase 3: Detalle y Cuotas

- [ ] Tarea 1: Añadir etiquetas visuales (Badge) en `InstallmentItem.tsx` para indicar si un amigo aceptó (`accepted`) o rechazó (`rejected`) la deuda asignada.
- [ ] Tarea 2: Conectar el `handleSubmit` en `WrapCardMovement.tsx` con el endpoint `PUT /spends/:id` para guardar la edición del Gasto.


### 🚨 Alta Prioridad (Pendientes para la próxima iteración)
- [ ] **Lógica de Rechazo de Cuotas:** Habilitar el botón en `Position.tsx` para rechazar la cuota (consumiendo `PUT /installmentuserpayments/:id/reject`) y validar que la titularidad regrese al creador.
- [ ] **Coherencia en Recálculo de Cuotas:** Al editar monto/cuotas en un Gasto Maestro, asegurar que la base de datos reasigne las cuotas reconstruidas a los usuarios correspondientes en vez de dejarlas huérfanas.

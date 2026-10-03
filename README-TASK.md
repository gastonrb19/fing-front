# 📌 Tareas por hacer (TODO)

### Prioridad alta
- [ ] Conectar las cards de movimientos con datos reales (API / backend) en vez de datos hardcodeados en WrapCardMovement.tsx.
- [ ] Formatear amount como moneda (separador de miles, símbolo, decimales) y diferenciar ingresos/gastos por color.
- [ ] Actualizar interfaces TypeScript (renombrar `totalAmount` a `amount` y adaptar DTOs según el backend refactorizado).
- [ ] Consumir APIs dinámicas de Categories, Subcategories y TypeSpends directamente desde el componente `NewMovementForm.tsx`.

### Prioridad media
- [ ] Habilitar el botón/acción visual de "Pagar Cuota" conectándolo a su respectivo Endpoint (`PUT /installmentuserpayments/:id`).
- [ ] Renderizar en UI los errores de validación estructurados (Zod) provenientes del backend, marcando los inputs del formulario en rojo.

### Prioridad baja / mejoras

- [ ] (Auth) Integrar manejo de sesión global: Sustituir la variable `currentUserId` en los componentes de Amistades obteniendo el ID real del usuario desde un Context, Cookie o LocalStorage post-login.

### 📊 Fase 2: Formulario de Gastos y Splits (`NewMovementForm.tsx`)
- [ ] Refactor de Inputs: Cambiar "Día vencimiento cuota" de `date` a `number` (1-31), y remover el checkbox "Pagado".
- [ ] Selector de Amigos (`SplitParticipantsSelector.tsx`): Crear un sub-componente inyectable que liste amistades activas.
- [ ] Validación Visual de Porcentajes: Asignar % a cada amigo y validar en tiempo real que la suma sea exactamente 100%.
- [ ] Envío Final: Modificar el `onSubmit` para enviar el Payload al `POST /spends` incluyendo el arreglo de `participants`.

### 📉 Fase 3: Dashboard de Deudas (`Movements.tsx`)
- [ ] Listar Deudas Propias: Consumir `GET /users/:userId/installmentuserpayments` para renderizar cuotas pendientes no rechazadas.
- [ ] Botón de Pagar: Conectar el botón de confirmación con el `PUT /installmentuserpayments/:id` (`paymentDone: true`).
- [ ] Botón de Rechazo: Agregar botón rojo "Rechazar Asignación" que consuma `PUT /installmentuserpayments/:id/reject`.

### 🤝 Fase 4: Evidencias y Solidaridad
- [ ] Auditoría del Creador: Crear vista para que el Creador vea amigos que rechazaron cuotas (`GET /installmentuserpayments/rejected`).
- [ ] Rescate Financiero: Opción en la tarjeta para pagar la cuota de un amigo asumiendo el rol (`assumedByUserId`).

### 🔗 Integración de Datos Base y Refactorización
- [ ] Eliminar Hardcodes (`CURRENT_USER_ID`): Reemplazar la constante `const currentUserId = 1;` en todas las vistas (Amistades, Movimientos) por el contexto de autenticación o LocalStorage.
- [ ] Conectar Categorías: Consumir el Endpoint `GET /categories` para poblar el dropdown de Categorías en `NewMovementForm.tsx` (en lugar de datos quemados).
- [ ] Conectar Tipos de Gasto: Consumir el Endpoint de Tipos de Gasto para poblar el dropdown de periodicidad (Fijo/Variable/Cuotas).
- [ ] Revisión General de Datos Estáticos: Auditar otros campos que actualmente tienen valores en duro en los dropdowns del frontend y enlazarlos al backend.

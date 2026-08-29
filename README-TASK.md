# 📌 Tareas por hacer (TODO)

### Prioridad alta
- [ ] Agregar vista de amistad para aceptar cuotas de pagos asociados a otros usuarios en el sistema
- [ ] Conectar las cards de movimientos con datos reales (API / backend) en vez de datos hardcodeados en WrapCardMovement.tsx.
- [ ] Formatear amount como moneda (separador de miles, símbolo, decimales) y diferenciar ingresos/gastos por color.
- [ ] Actualizar interfaces TypeScript (renombrar `totalAmount` a `amount` y adaptar DTOs según el backend refactorizado).
- [ ] Consumir APIs dinámicas de Categories, Subcategories y TypeSpends directamente desde el componente `NewMovementForm.tsx`.

### Prioridad media
- [ ] Habilitar el botón/acción visual de "Pagar Cuota" conectándolo a su respectivo Endpoint (`PUT /installmentuserpayments/:id`).
- [ ] Renderizar en UI los errores de validación estructurados (Zod) provenientes del backend, marcando los inputs del formulario en rojo.

### Prioridad baja / mejoras

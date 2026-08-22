# 📌 Tareas por hacer (TODO)

### Prioridad alta
- [ ] Conectar las cards de movimientos con datos reales (API / backend) en vez de datos hardcodeados en WrapCardMovement.tsx.
- [ ] Formatear amount como moneda (separador de miles, símbolo, decimales) y diferenciar ingresos/gastos por color.
- [ ] Actualizar interfaces TypeScript (renombrar `totalAmount` a `amount` y adaptar DTOs según el backend refactorizado).
- [ ] Consumir APIs dinámicas de Categories, Subcategories y TypeSpends directamente desde el componente `FormTransaction.tsx`.

### Prioridad media
- [ ] Implementar vista dedicada de Cuotas y Cobros Pendientes del Usuario (`GET /users/:userId/installmentuserpayments`).
- [ ] Habilitar el botón/acción visual de "Pagar Cuota" conectándolo a su respectivo Endpoint (`PUT /installmentuserpayments/:id`).
- [ ] Renderizar en UI los errores de validación estructurados (Zod) provenientes del backend, marcando los inputs del formulario en rojo.

### Prioridad baja / mejoras
- [ ] Agregar movimiento del card hacia la izquierda para abrirlo con más detalles.

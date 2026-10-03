# Reglas de Arquitectura - Fing Frontend

## Manejo de Estado en Formularios y Vistas Editables
- **Evitar Wrappers genéricos con children:** NO utilices componentes envoltorios (Wrappers) que reciban `children: ReactNode` para inyectar lógica de cambio de estado (ej. Edición vs Visualización).
- **Estado centralizado en el Padre:** Define y mantén el estado (ej. `isEditing`, `setIsEditing`) directamente en el componente principal de la vista o formulario.
- **Delegar UI a Componentes Especializados:** Pasa el estado y su _setter_ como `props` a componentes hijos específicos (como encabezados o pies de página) para que ellos controlen la interfaz (botones de Editar, Guardar, Cancelar). Esto mantiene el marcado HTML/JSX principal limpio y sin anidamientos excesivos.

## Parseo Seguro de Errores (Fetch)
- **Estructura Anidada del Backend:** Al atrapar errores HTTP (`!res.ok`), recuerda que el backend estructuró sus respuestas de error. Extrae siempre el mensaje priorizando la ruta anidada: `err.error?.message || err.message`.
- **Prevención de Caídas:** Ten en cuenta que si falla una ruta en el backend (ej. un 404 de Express), podría devolver HTML en lugar de JSON. Si `res.json()` falla y salta al bloque `catch`, muestra un mensaje genérico de red en lugar de colapsar la UI.

## Comunicación entre Componentes Hermanos
- Siguiendo la regla de "Estado Centralizado", si un componente hermano altera datos que otro hermano debe reflejar (ej. Aceptar solicitud -> Actualizar lista de amigos), eleva un estado numérico (`refreshKey`) al Padre y pásalo como dependencia al `useEffect` del hermano que debe recargarse. No utilices librerías externas de estado global solo para esto.

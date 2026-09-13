# Reglas de Arquitectura - Fing Frontend

## Manejo de Estado en Formularios y Vistas Editables
- **Evitar Wrappers genéricos con children:** NO utilices componentes envoltorios (Wrappers) que reciban `children: ReactNode` para inyectar lógica de cambio de estado (ej. Edición vs Visualización).
- **Estado centralizado en el Padre:** Define y mantén el estado (ej. `isEditing`, `setIsEditing`) directamente en el componente principal de la vista o formulario.
- **Delegar UI a Componentes Especializados:** Pasa el estado y su _setter_ como `props` a componentes hijos específicos (como encabezados o pies de página) para que ellos controlen la interfaz (botones de Editar, Guardar, Cancelar). Esto mantiene el marcado HTML/JSX principal limpio y sin anidamientos excesivos.

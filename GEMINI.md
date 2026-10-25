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


## Trampas de FormData y Campos Deshabilitados
- **Campos Ocultos/Disabled en Submit:** Recuerda que el recolector nativo de React/Navegador (`new FormData(e.currentTarget)`) ignora silenciosamente cualquier campo `<select>` o `<input>` que tenga el atributo `disabled`. Si dependes de un valor inmutable para el envío (como un ID seleccionado que no debe cambiarse), debes mantenerlo habilitado pero visualmente "readonly", extraerlo de un estado de React en lugar del FormData, o usar un `<input type="hidden">`.

## Cliente HTTP Centralizado y Producción (`src/utils/api.ts`)
- **Prohibido hardcodear `localhost:8000`:** Toda petición al backend debe importar `API_URL` o `apiFetch` desde `src/utils/api.ts` (que en producción resuelve a `/api` vía Nginx reverse proxy same-origin e inyecta automáticamente `credentials: "include"` + `Authorization: Bearer` de respaldo).
- **Orden de `@import` en Tailwind v4 (`src/index.css`):** Cualquier `@import url(...)` externo (ej. Google Fonts) debe declararse SIEMPRE en la primera línea antes de `@import "tailwindcss"`, evitando selectores universales `* { font-family: ... }` que sobrescriban utilidades de Tailwind.

## Estructura de Módulos CRUD y Separación de Lógica
- **Formulario Único Reutilizable:** Cada entidad editable (`Category`, `Subcategory`, `Income`, `CategoryIncome`) debe resolverse en un único `<Entidad>Form.tsx` para `POST`, `GET`, `PUT` y `DELETE`, registrando su ruta en `main.tsx` y `Menu.tsx`.
- **Extracción Selectiva a `logic/`:** Extrae únicamente llamadas HTTP y funciones puras sin estado a `src/components/<Entidad>/logic/<entidad>Service.ts`; mantén los estados de React (`useState`, `isEditing`) visibles en el componente padre.
- **Edición de Ingresos Depositados:** A diferencia de los Gastos con cuotas pagadas, en `Income` TODOS los campos excepto `id` deben seguir siendo editables al activar `isEditing`, incluso si `isPayed` ("Depositado") es `true`.

## Cálculos Financieros y Convención Visual (Home y Movimientos)
- **Respetar siempre `assignedAmount`:** Nunca sumes `spend.amount` cuando exista `spend.assignedAmount` (ni siquiera si `isOwner === true`), pues incluye partes asignadas a amigos.
- **Pagado/Depositado vs. Pendiente:** En `ContainerCards.tsx` y `SummaryMovements.tsx`, **Total gastado / Gastos** suma solo `paidAmount` (`paidInstallments > 0`), **Total ingreso / Ingresos** suma solo `isPayed === true`, **Por pagar / Por ingresar** agrupan lo pendiente, y **Total actual** es `Total ingreso - Total gastado`. Distingue egresos con `(-)` (`text-rose-700`) e ingresos con `(+)` (`text-emerald-700`).

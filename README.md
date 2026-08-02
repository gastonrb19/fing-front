# Fing — Frontend

Aplicación web para el **control y la visualización de finanzas personales**. Permite a los usuarios registrar movimientos, consultar transacciones y llevar un seguimiento de su situación financiera de forma clara y sencilla.

El frontend consume una **REST API construida con Express**, encargada de la autenticación y de toda la lógica de datos.

## Tecnologías

- **React 19** — librería para construir la interfaz de usuario.
- **React Server** — renderizado y arquitectura de componentes de React.
- **TanStack Query (React Query)** — gestión de estado del servidor: fetching, cache, sincronización y revalidación de datos.
- **Axios** — cliente HTTP para comunicarse con la REST API en Express.
- **Tailwind CSS v4** — estilos utilitarios.
- **TypeScript** — tipado estático.
- **Vite** — bundler y servidor de desarrollo con HMR.
- **React Router** — enrutado de la aplicación.

## Requisitos previos

- [Node.js](https://nodejs.org/) 18 o superior
- npm (incluido con Node.js)
- La REST API en Express corriendo y accesible

## Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd fing-frontend

# Instalar dependencias
npm install
```

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con la URL base de la API:

```env
VITE_API_URL=http://localhost:3000/api
```

Esta variable se usa como `baseURL` en la instancia de Axios que consume la REST API.

## Scripts disponibles

| Comando           | Descripción                                              |
| ----------------- | -------------------------------------------------------- |
| `npm run dev`     | Inicia el servidor de desarrollo con HMR.                |
| `npm run build`   | Compila TypeScript y genera el build de producción.      |
| `npm run preview` | Sirve localmente el build de producción.                 |
| `npm run lint`    | Ejecuta ESLint sobre el proyecto.                        |

## Estructura del proyecto

```
fing-frontend/
├── public/                  # Recursos estáticos (íconos, favicon)
├── src/
│   ├── assets/              # Imágenes y recursos importados
│   ├── components/
│   │   ├── HomePage/        # Vista principal (cards, resumen)
│   │   ├── IndexPage/       # Página de inicio / landing
│   │   ├── Login/           # Autenticación de usuarios
│   │   ├── Movements/       # Listado de movimientos
│   │   ├── Transaction/     # Registro de transacciones
│   │   ├── Menu.tsx         # Navegación
│   │   └── ItemMenu.tsx
│   ├── App.tsx              # Componente raíz
│   ├── main.tsx             # Punto de entrada y rutas
│   ├── index.css            # Estilos globales (Tailwind)
│   └── App.css
├── index.html
├── vite.config.ts
└── package.json
```

## Rutas

| Ruta            | Vista        | Descripción                          |
| --------------- | ------------ | ------------------------------------ |
| `/`             | Index        | Página de inicio.                    |
| `/login`        | App          | Inicio de sesión.                    |
| `/home`         | Home         | Panel con resumen financiero.        |
| `/movements`    | Movements    | Listado de movimientos.              |
| `/transactions` | Transaction  | Registro y detalle de transacciones. |

## Comunicación con la API

La aplicación se comunica con la REST API de Express mediante **Axios**, y **TanStack Query** gestiona el estado del servidor (cache, revalidación y estados de carga/error). Se recomienda centralizar la instancia de Axios y los hooks de React Query en `src/` (por ejemplo `src/api/` y `src/hooks/`) para mantener el código organizado.

## Licencia

Uso privado.

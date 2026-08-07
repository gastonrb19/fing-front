export default function FilterMovements({ displayFilter, setDisplayFilter }: { displayFilter: boolean; setDisplayFilter: (display: boolean) => void }) {
  return (
    <form className={`w-11/12 max-h-min mx-auto mt-4 p-4 bg-white rounded-lg shadow-md grid grid-cols-1 gap-2 md:grid-cols-2 ${displayFilter ? "block" : "hidden"}`}>
      <h2 className="relative text-lg font-semibold text-gray-800 text-center col-span-full">
        Segmentar información
        <button
          type="button"
          onClick={() => setDisplayFilter(false)}
          className="absolute right-0 top-0 text-xl font-bold text-gray-500 hover:text-gray-800"
          aria-label="Cerrar filtro"
        >
          ×
        </button>
      </h2>
      <div className="w-full">
        <label
          htmlFor="date-from"
          className="block text-gray-700 font-semibold mb-2"
        >
          Desde
        </label>
        <input
          type="date"
          id="date-from"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div className="w-full">
        <label
          htmlFor="date-to"
          className="block text-gray-700 font-semibold mb-2"
        >
          Hasta
        </label>
        <input
          type="date"
          id="date-to"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div className="w-full">
        <label
          htmlFor="movement-type"
          className="block text-gray-700 font-semibold mb-2"
        >
          Tipo de movimiento
        </label>
        <select
          id="movement-type"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Seleccionar tipo</option>
          <option value="utilities">Gastos</option>
          <option value="income">Ingresos</option>
          <option value="savings">Todos</option>
        </select>
      </div>
      <div className="w-full">
        <label
          htmlFor="category"
          className="block text-gray-700 font-semibold mb-2"
        >
          Seleccionar categoría
        </label>
        <select
          id="category"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Seleccionar categoría</option>
          <option value="food">Comida</option>
          <option value="transport">Transporte</option>
          <option value="salary">Salario</option>
        </select>
      </div>
      <div className="w-full md:col-span-2">
        <label
          htmlFor="subcategory"
          className="block text-gray-700 font-semibold mb-2"
        >
          Subcategoría
        </label>
        <select
          id="subcategory"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Seleccionar subcategoría</option>
          <option value="groceries">Supermercado</option>
          <option value="dinner">Cena</option>
          <option value="fuel">Combustible</option>
        </select>
      </div>
      <button type="submit" className="w-fit justify-self-center bg-cyan-800 hover:bg-cyan-900 text-white font-bold py-1 px-4 rounded col-span-full md:col-span-2">
        Filtrar
      </button>
    </form>
  );
}

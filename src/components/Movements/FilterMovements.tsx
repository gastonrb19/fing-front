import { useEffect, useState } from "react";
import { API_URL } from "../../utils/api";

export interface MovementFilters {
  movementType: "all" | "spend" | "income";
  from: string;
  until: string;
  categoryId: string;
  subcategoryId: string;
  categoryIncomeId: string;
  done: string;
  role: string;
}

interface FilterMovementsProps {
  displayFilter: boolean;
  setDisplayFilter: (display: boolean) => void;
  onFilter: (filters: MovementFilters) => void;
}

const initialFilters: MovementFilters = {
  movementType: "all",
  from: "",
  until: "",
  categoryId: "",
  subcategoryId: "",
  categoryIncomeId: "",
  done: "",
  role: "all",
};

export default function FilterMovements({
  displayFilter,
  setDisplayFilter,
  onFilter,
}: FilterMovementsProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [categoryIncomes, setCategoryIncomes] = useState<any[]>([]);

  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState<MovementFilters>(initialFilters);

  useEffect(() => {
    fetch(`${API_URL}/categories?limit=100`)
      .then((res) => res.json())
      .then((json) => setCategories(json.data || []))
      .catch(console.error);

    fetch(`${API_URL}/category-incomes?limit=100`)
      .then((res) => res.json())
      .then((json) => setCategoryIncomes(json.data || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (formData.categoryId) {
      fetch(`${API_URL}/categories/${formData.categoryId}/subcategories?limit=100`)
        .then((res) => res.json())
        .then((json) => setSubcategories(json.data || []))
        .catch(console.error);
    } else {
      setSubcategories([]);
    }
  }, [formData.categoryId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setErrorMsg("");

    if (id === "until" && formData.from && value && value < formData.from) {
      setErrorMsg("La fecha 'Hasta' no puede ser menor que 'Desde'.");
      return;
    }
    if (id === "from" && formData.until && value && value > formData.until) {
      setErrorMsg("La fecha 'Desde' no puede ser mayor que 'Hasta'.");
      setFormData((prev) => ({ ...prev, from: value, until: "" }));
      return;
    }

    if (id === "movementType") {
      setFormData((prev) => ({
        ...prev,
        movementType: value as MovementFilters["movementType"],
        categoryId: "",
        subcategoryId: "",
        categoryIncomeId: "",
        role: "all",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [id]: value,
      ...(id === "categoryId" ? { subcategoryId: "" } : {}),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(formData);
    setDisplayFilter(false);
  };

  const handleClear = () => {
    setFormData(initialFilters);
    onFilter(initialFilters);
  };

  const isSpendOnly = formData.movementType === "spend";
  const isIncomeOnly = formData.movementType === "income";

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-11/12 max-h-min mx-auto mt-4 p-4 bg-white rounded-lg shadow-md grid grid-cols-1 gap-2 md:grid-cols-2 ${
        displayFilter ? "block" : "hidden"
      }`}
    >
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

      <div className="w-full col-span-full">
        <label
          htmlFor="movementType"
          className="block text-gray-700 font-semibold mb-2"
        >
          Tipo de movimiento
        </label>
        <select
          id="movementType"
          value={formData.movementType}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="all">Todos (Gastos e Ingresos)</option>
          <option value="spend">Solo Gastos</option>
          <option value="income">Solo Ingresos</option>
        </select>
      </div>

      <div className="w-full">
        <label
          htmlFor="from"
          className="block text-gray-700 font-semibold mb-2"
        >
          Desde
        </label>
        <input
          type="date"
          id="from"
          value={formData.from}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      <div className="w-full">
        <label
          htmlFor="until"
          className="block text-gray-700 font-semibold mb-2"
        >
          Hasta
        </label>
        <input
          type="date"
          id="until"
          value={formData.until}
          min={formData.from}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      {isSpendOnly && (
        <>
          <div className="w-full">
            <label
              htmlFor="categoryId"
              className="block text-gray-700 font-semibold mb-2"
            >
              Seleccionar categoría
            </label>
            <select
              id="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Todas las categorías</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full">
            <label
              htmlFor="subcategoryId"
              className="block text-gray-700 font-semibold mb-2"
            >
              Subcategoría
            </label>
            <select
              id="subcategoryId"
              value={formData.subcategoryId}
              onChange={handleChange}
              disabled={!formData.categoryId}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Todas las subcategorías</option>
              {subcategories.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {isIncomeOnly && (
        <div className="w-full col-span-full">
          <label
            htmlFor="categoryIncomeId"
            className="block text-gray-700 font-semibold mb-2"
          >
            Categoría de ingreso
          </label>
          <select
            id="categoryIncomeId"
            value={formData.categoryIncomeId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">Todas las categorías de ingreso</option>
            {categoryIncomes.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="w-full col-span-full">
        <label
          htmlFor="done"
          className="block text-gray-700 font-semibold mb-2"
        >
          {isIncomeOnly
            ? "Estado del ingreso"
            : isSpendOnly
              ? "Estado de deuda (Tus cuotas)"
              : "Estado"}
        </label>
        <select
          id="done"
          value={formData.done}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="">Todos</option>
          <option value="true">
            {isIncomeOnly
              ? "Depositados"
              : isSpendOnly
                ? "Saldados (Pagados)"
                : "Pagados / Depositados"}
          </option>
          <option value="false">
            {isIncomeOnly
              ? "Pendientes (Por ingresar)"
              : isSpendOnly
                ? "Pendientes (Con deuda)"
                : "Pendientes"}
          </option>
        </select>
      </div>

      {isSpendOnly && (
        <div className="w-full col-span-full">
          <label
            htmlFor="role"
            className="block text-gray-700 font-semibold mb-2"
          >
            Rol en el gasto
          </label>
          <select
            id="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="all">Todos (Propios e invitados)</option>
            <option value="owner">Mis Gastos Creados</option>
            <option value="guest">Gastos Compartidos (Me asociaron)</option>
          </select>
        </div>
      )}

      {errorMsg && (
        <p className="text-red-500 text-sm text-center col-span-full font-semibold">
          {errorMsg}
        </p>
      )}

      <div className="flex gap-2 col-span-full md:col-span-2 justify-center mt-2">
        <button
          type="button"
          onClick={handleClear}
          className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-1 px-4 rounded"
        >
          Limpiar
        </button>
        <button
          type="submit"
          className="bg-cyan-700 hover:bg-cyan-900 text-white font-bold py-1 px-4 rounded"
        >
          Filtrar
        </button>
      </div>
    </form>
  );
}

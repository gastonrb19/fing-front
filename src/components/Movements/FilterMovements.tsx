import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface FilterMovementsProps {
  displayFilter: boolean;
  setDisplayFilter: (display: boolean) => void;
  onFilter: (filters: any) => void;
}

export default function FilterMovements({ displayFilter, setDisplayFilter, onFilter }: FilterMovementsProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);

  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    from: "",
    until: "",
    categoryId: "",
    subcategoryId: "",
    done: "",
    role: "all",
  });

  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then(res => res.json())
      .then(json => setCategories(json.data || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (formData.categoryId) {
      fetch(`${API_URL}/categories/${formData.categoryId}/subcategories`)
        .then(res => res.json())
        .then(json => setSubcategories(json.data || []))
        .catch(console.error);
    } else {
      setSubcategories([]);
    }
  }, [formData.categoryId]);

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setErrorMsg(""); // Limpiar error
    
    // Si están cambiando "until" y ya hay "from"
    if (id === "until" && formData.from && value < formData.from) {
      setErrorMsg("La fecha 'Hasta' no puede ser menor que 'Desde'.");
      return;
    }
    // Si cambian "from" y es mayor que "until" actual
    if (id === "from" && formData.until && value > formData.until) {
      setErrorMsg("La fecha 'Desde' no puede ser mayor que 'Hasta'.");
      // Reseteamos until
      setFormData(prev => ({ ...prev, from: value, until: "" }));
      return;
    }

    setFormData(prev => ({ ...prev, [id]: value }));
    if (id === "categoryId") {
      setFormData(prev => ({ ...prev, subcategoryId: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(formData);
    setDisplayFilter(false); // Ocultar filtro al aplicar
  };

  const handleClear = () => {
    const emptyFilters = { from: "", until: "", categoryId: "", subcategoryId: "", done: "", role: "all" };
    setFormData(emptyFilters);
    onFilter(emptyFilters);
  };

  return (
    <form onSubmit={handleSubmit} className={`w-11/12 max-h-min mx-auto mt-4 p-4 bg-white rounded-lg shadow-md grid grid-cols-1 gap-2 md:grid-cols-2 ${displayFilter ? "block" : "hidden"}`}>
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
        <label htmlFor="from" className="block text-gray-700 font-semibold mb-2">Desde</label>
        <input type="date" id="from" value={formData.from} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
      </div>
      <div className="w-full">
        <label htmlFor="until" className="block text-gray-700 font-semibold mb-2">Hasta</label>
        <input type="date" id="until" value={formData.until} min={formData.from} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
      </div>
      
      <div className="w-full">
        <label htmlFor="categoryId" className="block text-gray-700 font-semibold mb-2">Seleccionar categoría</label>
        <select id="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500">
          <option value="">Todas las categorías</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="w-full">
        <label htmlFor="subcategoryId" className="block text-gray-700 font-semibold mb-2">Subcategoría</label>
        <select id="subcategoryId" value={formData.subcategoryId} onChange={handleChange} disabled={!formData.categoryId} className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500">
          <option value="">Todas las subcategorías</option>
          {subcategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      <div className="w-full col-span-full">
        <label htmlFor="done" className="block text-gray-700 font-semibold mb-2">Estado de deuda (Tus cuotas)</label>
        <select id="done" value={formData.done} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500">
          <option value="">Todos</option>
          <option value="true">Saldados (Pagados)</option>
          <option value="false">Pendientes (Con deuda)</option>
        </select>
      </div>

      
      <div className="w-full col-span-full">
        <label htmlFor="role" className="block text-gray-700 font-semibold mb-2">Rol en el gasto</label>
        <select id="role" value={formData.role} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500">
          <option value="all">Todos (Propios e invitados)</option>
          <option value="owner">Mis Gastos Creados</option>
          <option value="guest">Gastos Compartidos (Me asociaron)</option>
        </select>
      </div>

      {errorMsg && <p className="text-red-500 text-sm text-center col-span-full font-semibold">{errorMsg}</p>}
      <div className="flex gap-2 col-span-full md:col-span-2 justify-center mt-2">
        <button type="button" onClick={handleClear} className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-1 px-4 rounded">
          Limpiar
        </button>
        <button type="submit" className="bg-cyan-700 hover:bg-cyan-900 text-white font-bold py-1 px-4 rounded">
          Filtrar
        </button>
      </div>
    </form>
  );
}

import { useEffect, useState } from "react";
import FeedbackMessage from "../Shared/FeedbackMessage";

const fieldClassName =
  "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 shadow-sm transition duration-150 ease-in-out placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-3 focus:ring-cyan-100";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const CURRENT_USER_ID = 1; // TODO: Extraer desde AuthContext

export default function NewMovementForm() {
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ status: "success" | "error" | null; message: string }>({ status: null, message: "" });

  const [formData, setFormData] = useState({
    categoryId: "",
    subcategoryId: "",
    fkTypeSpend: "",
    startPayment: "",
    maxDayToPayment: "", // Número del 1 al 31
    amount: "",
    name: "",
    totalInstallment: "1",
    minDayToPayment: "", // Número del 1 al 31
  });

  // 1. Cargar Categorías y Tipos de Gasto al montar
  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then(res => res.json())
      .then(json => setCategories(json.data || []))
      .catch(console.error);

    fetch(`${API_URL}/typespends`)
      .then(res => res.json())
      .then(json => setTypes(json.data || []))
      .catch(console.error);
  }, []);

  // 2. Cargar Subcategorías cuando la Categoría cambia
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "categoryId") {
      setFormData((prev) => ({ ...prev, subcategoryId: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ status: null, message: "" });

    try {
      const payload = {
        name: formData.name,
        amount: Number(formData.amount),
        userId: CURRENT_USER_ID,
        subcategoryId: Number(formData.subcategoryId),
        fkTypeSpend: Number(formData.fkTypeSpend),
        minDayToPayment: Number(formData.minDayToPayment),
        maxDayToPayment: formData.maxDayToPayment ? Number(formData.maxDayToPayment) : undefined,
        totalInstallment: formData.totalInstallment ? Number(formData.totalInstallment) : 1,
        startPayment: formData.startPayment || new Date().toISOString(),
      };

      const res = await fetch(`${API_URL}/spends`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok || res.status === 201) {
        setFeedback({ status: "success", message: "¡Gasto registrado correctamente!" });
        // Limpiar formulario excepto las categorías si se desea
        setFormData(prev => ({
          ...prev, amount: "", name: "", minDayToPayment: "", maxDayToPayment: ""
        }));
      } else {
        const err = await res.json();
        setFeedback({ status: "error", message: err.error?.message || err.message || "Error al crear gasto." });
      }
    } catch (error) {
      setFeedback({ status: "error", message: "Error de red al conectar con el servidor." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto mb-20 w-11/12 max-w-3xl space-y-6 pb-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Datos Cabecera
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-600">Categoría</label>
            <select name="categoryId" value={formData.categoryId} onChange={handleChange} className={fieldClassName} required>
              <option value="">--Selecciona--</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Subcategoría</label>
            <select name="subcategoryId" value={formData.subcategoryId} onChange={handleChange} className={fieldClassName} required disabled={!formData.categoryId}>
              <option value="">--Selecciona--</option>
              {subcategories.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Tipo de Gasto</label>
            <select name="fkTypeSpend" value={formData.fkTypeSpend} onChange={handleChange} className={fieldClassName} required>
              <option value="">--Selecciona--</option>
              {types.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Fecha de compra/ingreso</label>
            <input name="startPayment" value={formData.startPayment} onChange={handleChange} type="date" className={fieldClassName} required />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Detalle Monetario
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-600">Título del Gasto</label>
            <input name="name" value={formData.name} onChange={handleChange} type="text" className={fieldClassName} placeholder="Ej. Sushi con amigos" required />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Monto Total</label>
            <input name="amount" value={formData.amount} onChange={handleChange} type="number" min="0" step="0.01" className={fieldClassName} placeholder="0.00" required />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Cantidad de cuotas</label>
            <input name="totalInstallment" value={formData.totalInstallment} onChange={handleChange} type="number" min="1" className={fieldClassName} required />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Día de pago esperado (1-31)</label>
            <input name="minDayToPayment" value={formData.minDayToPayment} onChange={handleChange} type="number" min="1" max="31" className={fieldClassName} placeholder="Ej. 15" required />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-slate-600">Día máximo límite de pago (1-31, opcional)</label>
            <input name="maxDayToPayment" value={formData.maxDayToPayment} onChange={handleChange} type="number" min="1" max="31" className={fieldClassName} placeholder="Ej. 20" />
          </div>
        </div>
      </section>

      <div className="flex flex-col items-center justify-center pt-2 gap-4">
        <FeedbackMessage status={feedback.status} message={feedback.message} />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-8 py-3 text-sm font-medium text-white transition hover:bg-slate-700 focus:outline-none focus:ring-3 focus:ring-slate-300 disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar Gasto"}
        </button>
      </div>
    </form>
  );
}

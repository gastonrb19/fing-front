import { useEffect, useState } from "react";
import FeedbackMessage from "../Shared/FeedbackMessage";
import SplitParticipantsSelector, { type ParticipantItem } from "./SplitParticipantsSelector";
import { useAuth } from "../../context/AuthContext";
import { API_URL } from "../../utils/api";

const fieldClassName =
  "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 shadow-sm transition duration-150 ease-in-out placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-3 focus:ring-cyan-100 disabled:bg-slate-200 disabled:text-slate-500 disabled:border-slate-300 disabled:cursor-not-allowed";

export default function NewMovementForm() {
  const { user } = useAuth();
  const currentUserId = user?.id || 1;

  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [participants, setParticipants] = useState<ParticipantItem[]>([
    { userId: currentUserId, percentage: 100 },
  ]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ status: "success" | "error" | null; message: string }>({ status: null, message: "" });

  // Actualizar participante inicial si carga el usuario autenticado
  useEffect(() => {
    if (user?.id) {
      setParticipants([{ userId: user.id, percentage: 100 }]);
    }
  }, [user?.id]);

  const [formData, setFormData] = useState({
    categoryId: "",
    subcategoryId: "",
    startPayment: "",
    maxDayToPayment: "", // Número del 1 al 31
    amount: "",
    name: "",
    totalInstallment: "1",
    minDayToPayment: "", // Número del 1 al 31
  });

  // 1. Cargar Categorías y Amigos al montar o al cambiar de usuario
  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then(res => res.json())
      .then(json => setCategories(json.data || []))
      .catch(console.error);

    if (currentUserId) {
      fetch(`${API_URL}/users/${currentUserId}/friends`)
        .then(res => res.json())
        .then(json => {
          if (json.success && json.data) setFriends(json.data.map((f: any) => f.friend));
          else if (Array.isArray(json)) setFriends(json.map((f: any) => f.friend));
        })
        .catch(console.error);
    }
  }, [currentUserId]);

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

  const [isToday, setIsToday] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const isOnlyCreator =
    participants.length === 1 && Number(participants[0]?.userId) === Number(currentUserId);

  useEffect(() => {
    if (!isOnlyCreator && isPaid) {
      setIsPaid(false);
    }
  }, [isOnlyCreator, isPaid]);

  const getTodayValues = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return {
      dateStr: `${year}-${month}-${day}`,
      dayNum: String(now.getDate())
    };
  };

  const handleTodayToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsToday(checked);
    if (checked) {
      const { dateStr, dayNum } = getTodayValues();
      setFormData((prev) => ({
        ...prev,
        startPayment: dateStr,
        minDayToPayment: dayNum,
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "categoryId") {
      setFormData((prev) => ({ ...prev, subcategoryId: "" }));
    }
    if (name === "startPayment" || name === "minDayToPayment") {
      const { dateStr, dayNum } = getTodayValues();
      if (name === "startPayment" && value !== dateStr) setIsToday(false);
      if (name === "minDayToPayment" && value !== dayNum) setIsToday(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ status: null, message: "" });

    try {
      // Validar sumatoria de porcentajes (debe ser exactamente 100%)
      const totalPct = participants.reduce((sum, p) => sum + (Number(p.percentage) || 0), 0);
      const roundedTotal = Math.round(totalPct * 100) / 100;
      if (Math.abs(roundedTotal - 100) > 0.05) {
        setFeedback({
          status: "error",
          message: `La sumatoria de los porcentajes debe ser exactamente 100% (actual: ${roundedTotal}%).`,
        });
        setLoading(false);
        return;
      }

      const payload = {
        name: formData.name,
        amount: Number(formData.amount),
        userId: currentUserId,
        subcategoryId: Number(formData.subcategoryId),
        fkTypeSpend: 1, // Tipo de gasto estándar por defecto
        minDayToPayment: Number(formData.minDayToPayment),
        maxDayToPayment: formData.maxDayToPayment ? Number(formData.maxDayToPayment) : undefined,
        totalInstallment: formData.totalInstallment ? Number(formData.totalInstallment) : 1,
        startPayment: formData.startPayment || new Date().toISOString(),
        isPaid: isOnlyCreator ? isPaid : false,
        participants: participants.map((p) => ({
          userId: Number(p.userId),
          percentage: Number(p.percentage),
        })),
      };

      const res = await fetch(`${API_URL}/spends`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok || res.status === 201) {
        setFeedback({ status: "success", message: "¡Gasto registrado correctamente!" });
        setIsToday(false);
        setIsPaid(false);
        setParticipants([{ userId: currentUserId, percentage: 100 }]);
        // Limpiar formulario excepto las categorías si se desea
        setFormData(prev => ({
          ...prev, amount: "", name: "", minDayToPayment: "", maxDayToPayment: "", startPayment: ""
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
          <div className="md:col-span-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-600">Fecha de compra/gasto</label>
              <label className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-200 bg-cyan-50/80 px-2.5 py-1 text-xs font-semibold text-cyan-800 hover:bg-cyan-100 transition-colors cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isToday}
                  onChange={handleTodayToggle}
                  className="h-3.5 w-3.5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 accent-cyan-600 cursor-pointer"
                />
                Hoy
              </label>
            </div>
            <input 
              name="startPayment" 
              value={formData.startPayment} 
              onChange={handleChange} 
              type="date" 
              className={fieldClassName} 
              disabled={isToday}
              required 
            />
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
          <div className="md:col-span-2">
            <label
              htmlFor="new-movement-is-paid"
              className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-sm shadow-sm transition-colors ${
                !isOnlyCreator
                  ? "border-slate-200 bg-slate-200 text-slate-500 cursor-not-allowed"
                  : isPaid
                    ? "border-cyan-300 bg-cyan-50/70 text-cyan-900 cursor-pointer"
                    : "border-slate-200 bg-slate-50 text-slate-600 cursor-pointer"
              }`}
            >
              <div className="flex flex-col">
                <span className="font-medium">Marcar movimiento como pagado</span>
                {!isOnlyCreator && (
                  <span className="text-xs text-slate-500">
                    Disponible solo cuando únicamente tú estás implicado en el gasto.
                  </span>
                )}
              </div>
              <input
                id="new-movement-is-paid"
                type="checkbox"
                checked={isPaid}
                disabled={!isOnlyCreator}
                onChange={(e) => setIsPaid(e.target.checked)}
                className="h-4 w-4 accent-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              />
            </label>
          </div>
        </div>
      </section>

      <SplitParticipantsSelector
        participants={participants}
        setParticipants={setParticipants}
        friends={friends}
        currentUserId={currentUserId}
        totalAmount={Number(formData.amount) || 0}
        totalInstallment={Number(formData.totalInstallment) || 1}
      />

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

"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router";
import FormEditHeader from "../Shared/FormEditHeader";
import FormEditFooter from "../Shared/FormEditFooter";
import FeedbackMessage from "../Shared/FeedbackMessage";
import { useAuth } from "../../context/AuthContext";
import { fetchAllCategoryIncomes } from "../CategoryIncome/logic/categoryIncomeService";
import {
  fetchIncomeById,
  saveIncome,
  deleteIncomeById,
  getTodayDateString,
  type IncomeFormData,
} from "./logic/incomeService";

const fieldClassName =
  "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 shadow-sm transition duration-150 ease-in-out placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-3 focus:ring-cyan-100 disabled:bg-slate-200 disabled:text-slate-500 disabled:border-slate-300 disabled:cursor-not-allowed";

const emptyIncome: IncomeFormData = {
  categoryIncomeId: "",
  name: "",
  amount: "",
  date: "",
  comentary: "",
  isPayed: false,
};

export default function IncomeForm() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentUserId = user?.id || 1;

  const id = params.id || searchParams.get("id");
  const isEditMode = Boolean(id);

  // Regla de Arquitectura: Estado centralizado en el componente principal
  // Importante: Aunque isPayed ("Depositado") sea true, NO se bloquea la edición de ningún campo (salvo el id)
  const [isEditing, setIsEditing] = useState(!isEditMode);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [isToday, setIsToday] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState<IncomeFormData>(emptyIncome);
  const [initialData, setInitialData] = useState<IncomeFormData>(emptyIncome);
  const [feedback, setFeedback] = useState<{
    status: "success" | "error" | null;
    message: string;
  }>({ status: null, message: "" });

  useEffect(() => {
    fetchAllCategoryIncomes().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    setFeedback({ status: null, message: "" });
    setIsToday(false);

    if (!id) {
      setIsEditing(true);
      setLoading(false);
      setNotFound(false);
      setFormData(emptyIncome);
      setInitialData(emptyIncome);
      return;
    }

    setIsEditing(false);
    setLoading(true);
    setNotFound(false);

    fetchIncomeById(id)
      .then((loaded) => {
        setFormData(loaded);
        setInitialData(loaded);
      })
      .catch((error: any) => {
        setNotFound(true);
        setFeedback({
          status: "error",
          message: error.message || "Error de red al cargar el ingreso.",
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSetEditing = (editing: boolean) => {
    if (!editing && isEditMode) {
      setFormData(initialData);
      setIsToday(false);
      setFeedback({ status: null, message: "" });
    }
    setIsEditing(editing);
  };

  const handleTodayToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsToday(checked);
    if (checked) {
      setFormData((prev) => ({ ...prev, date: getTodayDateString() }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "date" && value !== getTodayDateString()) {
      setIsToday(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ status: null, message: "" });

    try {
      const saved = await saveIncome(id, currentUserId, formData);

      if (isEditMode) {
        setFormData(saved);
        setInitialData(saved);
        setIsEditing(false);
        setIsToday(false);
        setFeedback({
          status: "success",
          message: "¡Ingreso actualizado correctamente!",
        });
      } else {
        setFormData((prev) => ({
          ...emptyIncome,
          categoryIncomeId: prev.categoryIncomeId,
        }));
        setIsToday(false);
        setFeedback({
          status: "success",
          message: "¡Ingreso registrado correctamente!",
        });
      }
    } catch (error: any) {
      setFeedback({
        status: "error",
        message: error.message || "Error de red al conectar con el servidor.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("¿Estás seguro de que deseas eliminar este movimiento de ingreso?"))
      return;

    setDeleting(true);
    setFeedback({ status: null, message: "" });

    try {
      await deleteIncomeById(id);
      navigate("/movements");
    } catch (error: any) {
      setFeedback({
        status: "error",
        message: error.message || "Error de red al eliminar el ingreso.",
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <p className="mt-10 text-center font-bold text-slate-500">
        Cargando ingreso...
      </p>
    );
  }

  if (isEditMode && notFound) {
    return (
      <div className="mx-auto mt-10 w-11/12 max-w-3xl text-center">
        <p className="font-bold text-red-500">
          {feedback.message || "No se encontró el ingreso."}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto mb-20 w-11/12 max-w-3xl space-y-6 pb-8">
      {isEditMode && (
        <FormEditHeader isEditing={isEditing} setIsEditing={handleSetEditing} />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Datos del Ingreso
              </h3>
              {isEditMode && (
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase ${
                    formData.isPayed
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {formData.isPayed ? "Depositado" : "Pendiente"}
                </span>
              )}
            </div>

            {isEditMode && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100 hover:text-rose-800 disabled:opacity-50 cursor-pointer"
              >
                {deleting ? "Eliminando..." : "Eliminar movimiento"}
              </button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="income-category"
                  className="text-sm font-medium text-slate-600"
                >
                  Categoría de Ingreso
                </label>
                <Link
                  to="/category-income"
                  className="text-xs font-semibold text-cyan-700 hover:text-cyan-800 hover:underline"
                >
                  + Categorías
                </Link>
              </div>
              <select
                id="income-category"
                name="categoryIncomeId"
                value={formData.categoryIncomeId}
                onChange={handleChange}
                disabled={!isEditing}
                className={fieldClassName}
                required
              >
                <option value="">--Selecciona--</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="income-date"
                  className="text-sm font-medium text-slate-600"
                >
                  Fecha depósito
                </label>
                {isEditing && (
                  <label className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-200 bg-cyan-50/80 px-2.5 py-0.5 text-xs font-semibold text-cyan-800 hover:bg-cyan-100 transition-colors cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isToday}
                      onChange={handleTodayToggle}
                      className="h-3.5 w-3.5 rounded border-slate-300 text-cyan-600 accent-cyan-600 cursor-pointer"
                    />
                    Hoy
                  </label>
                )}
              </div>
              <input
                id="income-date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                disabled={!isEditing}
                className={fieldClassName}
                required
              />
            </div>

            <div>
              <label
                htmlFor="income-name"
                className="text-sm font-medium text-slate-600"
              >
                Título del Ingreso
              </label>
              <input
                id="income-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className={fieldClassName}
                placeholder="Ej. Sueldo mensual, Pago cliente"
                maxLength={255}
                required
              />
            </div>

            <div>
              <label
                htmlFor="income-amount"
                className="text-sm font-medium text-slate-600"
              >
                Monto
              </label>
              <input
                id="income-amount"
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                disabled={!isEditing}
                className={fieldClassName}
                placeholder="0.00"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="income-comentary"
                className="text-sm font-medium text-slate-600"
              >
                Comentario (opcional)
              </label>
              <textarea
                id="income-comentary"
                name="comentary"
                rows={3}
                value={formData.comentary}
                onChange={handleChange}
                disabled={!isEditing}
                className={fieldClassName}
                placeholder="Notas adicionales sobre el depósito o ingreso"
                maxLength={255}
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="income-is-payed"
                className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-sm shadow-sm transition-colors ${
                  !isEditing
                    ? "border-slate-200 bg-slate-200 text-slate-500 cursor-not-allowed"
                    : formData.isPayed
                      ? "border-emerald-300 bg-emerald-50/70 text-emerald-900 cursor-pointer"
                      : "border-slate-200 bg-slate-50 text-slate-600 cursor-pointer"
                }`}
              >
                <div className="flex flex-col">
                  <span className="font-medium">Depositado</span>
                  <span className="text-xs text-slate-500">
                    {formData.isPayed
                      ? "Confirmado como depositado en tu cuenta."
                      : "Sin marcar quedará registrado como pendiente por ingresar."}
                  </span>
                </div>
                <input
                  id="income-is-payed"
                  name="isPayed"
                  type="checkbox"
                  checked={formData.isPayed}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isPayed: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 accent-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                />
              </label>
            </div>
          </div>
        </section>

        <div className="flex flex-col items-center justify-center gap-4 pt-2">
          <FeedbackMessage
            status={feedback.status}
            message={feedback.message}
          />

          {isEditMode ? (
            <FormEditFooter
              isEditing={isEditing}
              setIsEditing={handleSetEditing}
            />
          ) : (
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-8 py-3 text-sm font-medium text-white transition hover:bg-slate-700 focus:outline-none focus:ring-3 focus:ring-slate-300 disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar Ingreso"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router";
import FormEditHeader from "../Shared/FormEditHeader";
import FormEditFooter from "../Shared/FormEditFooter";
import FeedbackMessage from "../Shared/FeedbackMessage";
import {
  fetchCategoryIncomeById,
  saveCategoryIncome,
  deleteCategoryIncomeById,
  type CategoryIncomeFormData,
} from "./logic/categoryIncomeService";

const fieldClassName =
  "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 shadow-sm transition duration-150 ease-in-out placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-3 focus:ring-cyan-100 disabled:bg-slate-200 disabled:text-slate-500 disabled:border-slate-300 disabled:cursor-not-allowed";

const emptyCategoryIncome: CategoryIncomeFormData = {
  name: "",
  description: "",
};

export default function CategoryIncomeForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get("id");
  const isEditMode = Boolean(id);

  // Regla de Arquitectura: Estado centralizado en el componente principal del formulario
  const [isEditing, setIsEditing] = useState(!isEditMode);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [formData, setFormData] =
    useState<CategoryIncomeFormData>(emptyCategoryIncome);
  const [initialData, setInitialData] =
    useState<CategoryIncomeFormData>(emptyCategoryIncome);
  const [feedback, setFeedback] = useState<{
    status: "success" | "error" | null;
    message: string;
  }>({ status: null, message: "" });

  useEffect(() => {
    setFeedback({ status: null, message: "" });

    if (!id) {
      setIsEditing(true);
      setLoading(false);
      setNotFound(false);
      setFormData(emptyCategoryIncome);
      setInitialData(emptyCategoryIncome);
      return;
    }

    setIsEditing(false);
    setLoading(true);
    setNotFound(false);

    fetchCategoryIncomeById(id)
      .then((loaded) => {
        setFormData(loaded);
        setInitialData(loaded);
      })
      .catch((error: any) => {
        setNotFound(true);
        setFeedback({
          status: "error",
          message:
            error.message || "Error de red al cargar la categoría de ingreso.",
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSetEditing = (editing: boolean) => {
    if (!editing && isEditMode) {
      setFormData(initialData);
      setFeedback({ status: null, message: "" });
    }
    setIsEditing(editing);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ status: null, message: "" });

    try {
      const saved = await saveCategoryIncome(id, formData);

      if (isEditMode) {
        setFormData(saved);
        setInitialData(saved);
        setIsEditing(false);
        setFeedback({
          status: "success",
          message: "¡Categoría de ingreso actualizada correctamente!",
        });
      } else {
        setFormData(emptyCategoryIncome);
        setFeedback({
          status: "success",
          message: "¡Categoría de ingreso creada correctamente!",
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
    if (
      !confirm(
        "¿Estás seguro de que deseas eliminar esta categoría de ingreso?"
      )
    )
      return;

    setDeleting(true);
    setFeedback({ status: null, message: "" });

    try {
      await deleteCategoryIncomeById(id);
      navigate("/category-income");
    } catch (error: any) {
      setFeedback({
        status: "error",
        message:
          error.message || "Error de red al eliminar la categoría de ingreso.",
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <p className="mt-10 text-center font-bold text-slate-500">
        Cargando categoría de ingreso...
      </p>
    );
  }

  if (isEditMode && notFound) {
    return (
      <div className="mx-auto mt-10 w-11/12 max-w-3xl text-center">
        <p className="font-bold text-red-500">
          {feedback.message || "No se encontró la categoría de ingreso."}
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
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Datos de la Categoría de Ingreso
            </h3>
            <div className="flex items-center gap-3">
              <Link
                to="/income"
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                + Nuevo Ingreso
              </Link>
              {isEditMode && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100 hover:text-rose-800 disabled:opacity-50 cursor-pointer"
                >
                  {deleting ? "Eliminando..." : "Eliminar"}
                </button>
              )}
            </div>
          </div>

          <div className="grid gap-4">
            <div>
              <label
                htmlFor="category-income-name"
                className="text-sm font-medium text-slate-600"
              >
                Nombre
              </label>
              <input
                id="category-income-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className={fieldClassName}
                placeholder="Ej. Sueldo, Honorarios, Inversiones"
                maxLength={100}
                required
              />
            </div>

            <div>
              <label
                htmlFor="category-income-description"
                className="text-sm font-medium text-slate-600"
              >
                Descripción (opcional)
              </label>
              <textarea
                id="category-income-description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                disabled={!isEditing}
                className={fieldClassName}
                placeholder="Breve descripción de este tipo de ingreso"
                maxLength={255}
              />
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
              {saving ? "Guardando..." : "Guardar Categoría de Ingreso"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

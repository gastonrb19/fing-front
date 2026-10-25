"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import FormEditHeader from "../Shared/FormEditHeader";
import FormEditFooter from "../Shared/FormEditFooter";
import FeedbackMessage from "../Shared/FeedbackMessage";
import {
  fetchAllCategories,
  fetchSubcategoryById,
  saveSubcategory,
  deleteSubcategoryById,
  type SubcategoryFormData,
} from "./logic/subcategoryService";

const fieldClassName =
  "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 shadow-sm transition duration-150 ease-in-out placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-3 focus:ring-cyan-100 disabled:bg-slate-200 disabled:text-slate-500 disabled:border-slate-300 disabled:cursor-not-allowed";

export default function SubcategoryForm() {
  const { id_categoria, id_subcategory } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id_subcategory);

  // Regla de Arquitectura: Estado centralizado en el componente principal del formulario
  const [isEditing, setIsEditing] = useState(!isEditMode);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState<SubcategoryFormData>({
    categoryId: id_categoria || "",
    name: "",
    description: "",
  });
  const [initialData, setInitialData] = useState<SubcategoryFormData>({
    categoryId: id_categoria || "",
    name: "",
    description: "",
  });

  const [feedback, setFeedback] = useState<{
    status: "success" | "error" | null;
    message: string;
  }>({ status: null, message: "" });

  useEffect(() => {
    fetchAllCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    setFeedback({ status: null, message: "" });

    if (!id_subcategory) {
      const defaults = {
        categoryId: id_categoria || "",
        name: "",
        description: "",
      };
      setIsEditing(true);
      setLoading(false);
      setNotFound(false);
      setFormData(defaults);
      setInitialData(defaults);
      return;
    }

    setIsEditing(false);
    setLoading(true);
    setNotFound(false);

    fetchSubcategoryById(id_subcategory, id_categoria)
      .then((loaded) => {
        setFormData(loaded);
        setInitialData(loaded);
      })
      .catch((error: any) => {
        setNotFound(true);
        setFeedback({
          status: "error",
          message: error.message || "Error de red al cargar la subcategoría.",
        });
      })
      .finally(() => setLoading(false));
  }, [id_categoria, id_subcategory]);

  const handleSetEditing = (editing: boolean) => {
    if (!editing && isEditMode) {
      setFormData(initialData);
      setFeedback({ status: null, message: "" });
    }
    setIsEditing(editing);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ status: null, message: "" });

    try {
      const saved = await saveSubcategory(
        id_subcategory,
        id_categoria,
        formData
      );

      if (isEditMode) {
        setFormData(saved);
        setInitialData(saved);
        setIsEditing(false);
        setFeedback({
          status: "success",
          message: "¡Subcategoría actualizada correctamente!",
        });
      } else {
        setFormData((prev) => ({ ...prev, name: "", description: "" }));
        setFeedback({
          status: "success",
          message: "¡Subcategoría creada correctamente!",
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
    if (!id_subcategory) return;
    if (!confirm("¿Estás seguro de que deseas eliminar esta subcategoría?"))
      return;

    setDeleting(true);
    setFeedback({ status: null, message: "" });

    try {
      await deleteSubcategoryById(id_subcategory);
      navigate(`/category/${id_categoria || 1}/subcategory`);
    } catch (error: any) {
      setFeedback({
        status: "error",
        message: error.message || "Error de red al eliminar la subcategoría.",
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <p className="mt-10 text-center font-bold text-slate-500">
        Cargando subcategoría...
      </p>
    );
  }

  if (isEditMode && notFound) {
    return (
      <div className="mx-auto mt-10 w-11/12 max-w-3xl text-center">
        <p className="font-bold text-red-500">
          {feedback.message || "No se encontró la subcategoría."}
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
              Datos de la Subcategoría
            </h3>
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

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="subcategory-category"
                className="text-sm font-medium text-slate-600"
              >
                Categoría Padre
              </label>
              <select
                id="subcategory-category"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                disabled={!isEditing}
                className={fieldClassName}
                required
              >
                <option value="">--Selecciona--</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="subcategory-name"
                className="text-sm font-medium text-slate-600"
              >
                Nombre
              </label>
              <input
                id="subcategory-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className={fieldClassName}
                placeholder="Ej. Supermercado, Arriendo, Combustible"
                maxLength={100}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="subcategory-description"
                className="text-sm font-medium text-slate-600"
              >
                Descripción (opcional)
              </label>
              <textarea
                id="subcategory-description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                disabled={!isEditing}
                className={fieldClassName}
                placeholder="Breve descripción de los gastos incluidos en esta subcategoría"
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
              {saving ? "Guardando..." : "Guardar Subcategoría"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

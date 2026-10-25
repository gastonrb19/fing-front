"use client";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  fetchAllCategories,
  fetchSubcategoriesByCategory,
} from "./logic/subcategoryService";

interface SearchSubcategoryProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const fieldClassName =
  "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 shadow-sm transition duration-150 ease-in-out focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-3 focus:ring-cyan-100 disabled:bg-slate-200 disabled:text-slate-500";

export default function SearchSubcategory({
  isOpen,
  setIsOpen,
}: SearchSubcategoryProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();

  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);

  // Abrir/cerrar <dialog> nativo y cargar categorías al abrir
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
      setSelectedCategoryId("");
      setSelectedSubcategoryId("");
      setSubcategories([]);
      setLoadingCategories(true);
      fetchAllCategories()
        .then(setCategories)
        .catch(console.error)
        .finally(() => setLoadingCategories(false));
    } else if (dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  // Cargar subcategorías en cascada cuando cambia la categoría seleccionada
  useEffect(() => {
    setSelectedSubcategoryId("");
    if (!selectedCategoryId) {
      setSubcategories([]);
      return;
    }

    setLoadingSubcategories(true);
    fetchSubcategoriesByCategory(selectedCategoryId)
      .then(setSubcategories)
      .catch(console.error)
      .finally(() => setLoadingSubcategories(false));
  }, [selectedCategoryId]);

  // Fallback para light-dismiss en navegadores sin soporte nativo para closedby="any"
  const handleDialogClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog || "closedBy" in HTMLDialogElement.prototype) return;
    if (event.target !== dialog) return;

    const rect = dialog.getBoundingClientRect();
    const isDialogContent =
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width;

    if (!isDialogContent) {
      dialog.close();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryId || !selectedSubcategoryId) return;

    setIsOpen(false);
    navigate(
      `/category/${selectedCategoryId}/subcategory/${selectedSubcategoryId}`
    );
  };

  return (
    <dialog
      ref={dialogRef}
      {...({ closedby: "any" } as any)}
      aria-labelledby="search-subcategory-title"
      onClose={() => setIsOpen(false)}
      onClick={handleDialogClick}
      className="m-auto w-[90%] max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3
          id="search-subcategory-title"
          className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600"
        >
          Buscar Subcategoría
        </h3>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="text-slate-400 transition-colors hover:text-slate-700 text-lg font-bold cursor-pointer"
          aria-label="Cerrar búsqueda de subcategoría"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="popup-parent-category-select"
            className="text-sm font-medium text-slate-600"
          >
            1. Selecciona la Categoría
          </label>
          <select
            id="popup-parent-category-select"
            name="categoryId"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            disabled={loadingCategories}
            className={fieldClassName}
            required
          >
            <option value="">
              {loadingCategories ? "Cargando categorías..." : "--Selecciona--"}
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                #{cat.id} - {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="popup-subcategory-select"
            className="text-sm font-medium text-slate-600"
          >
            2. Selecciona la Subcategoría
          </label>
          <select
            id="popup-subcategory-select"
            name="subcategoryId"
            value={selectedSubcategoryId}
            onChange={(e) => setSelectedSubcategoryId(e.target.value)}
            disabled={!selectedCategoryId || loadingSubcategories}
            className={fieldClassName}
            required
          >
            <option value="">
              {loadingSubcategories
                ? "Cargando subcategorías..."
                : !selectedCategoryId
                  ? "--Primero selecciona categoría--"
                  : "--Selecciona--"}
            </option>
            {subcategories.map((sub) => (
              <option key={sub.id} value={sub.id}>
                #{sub.id} - {sub.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!selectedCategoryId || !selectedSubcategoryId}
            className="inline-flex items-center justify-center rounded-xl bg-cyan-700 px-5 py-2 text-xs font-semibold text-white transition hover:bg-cyan-800 disabled:opacity-40 cursor-pointer"
          >
            Visualizar
          </button>
        </div>
      </form>
    </dialog>
  );
}

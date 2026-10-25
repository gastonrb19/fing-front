"use client";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { fetchAllCategoryIncomes } from "./logic/categoryIncomeService";

interface SearchCategoryIncomeProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const fieldClassName =
  "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 shadow-sm transition duration-150 ease-in-out focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-3 focus:ring-cyan-100 disabled:bg-slate-200 disabled:text-slate-500";

export default function SearchCategoryIncome({
  isOpen,
  setIsOpen,
}: SearchCategoryIncomeProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
      setSelectedId("");
      setLoading(true);
      fetchAllCategoryIncomes()
        .then(setCategories)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else if (dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

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
    if (!selectedId) return;

    setIsOpen(false);
    navigate(`/category-income?id=${selectedId}`);
  };

  return (
    <dialog
      ref={dialogRef}
      {...({ closedby: "any" } as any)}
      aria-labelledby="search-category-income-title"
      onClose={() => setIsOpen(false)}
      onClick={handleDialogClick}
      className="m-auto w-[90%] max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3
          id="search-category-income-title"
          className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600"
        >
          Buscar Categoría de Ingreso
        </h3>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="text-slate-400 transition-colors hover:text-slate-700 text-lg font-bold cursor-pointer"
          aria-label="Cerrar búsqueda"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="popup-category-income-select"
            className="text-sm font-medium text-slate-600"
          >
            Selecciona una categoría de ingreso
          </label>
          <select
            id="popup-category-income-select"
            name="categoryIncomeId"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            disabled={loading}
            className={fieldClassName}
            required
          >
            <option value="">
              {loading ? "Cargando categorías..." : "--Selecciona--"}
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                #{cat.id} - {cat.name}
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
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl bg-cyan-700 px-5 py-2 text-xs font-semibold text-white transition hover:bg-cyan-800 disabled:opacity-40 cursor-pointer"
          >
            Visualizar
          </button>
        </div>
      </form>
    </dialog>
  );
}

import { useState } from "react";
import { useParams, Link } from "react-router";
import SubcategoryForm from "./SubcategoryForm";
import SearchSubcategory from "./SearchSubcategory";

export default function Subcategory() {
  const { id_categoria, id_subcategory } = useParams();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 pt-10">
      <div className="mx-auto mb-4 flex w-11/12 max-w-3xl flex-col items-center justify-between gap-3 sm:flex-row">
        <h1 className="text-center text-[1.7rem] font-semibold tracking-[0.14em] text-slate-800 sm:text-left">
          {id_subcategory
            ? `Categoría #${id_categoria} - Subcategoría #${id_subcategory}`
            : `Nueva subcategoría (Categoría #${id_categoria})`}
        </h1>
        <div className="flex items-center gap-2">
          {id_subcategory && (
            <Link
              to={`/category/${id_categoria}/subcategory`}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
            >
              + Nueva Subcategoría
            </Link>
          )}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="rounded-xl bg-cyan-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-cyan-800 cursor-pointer"
          >
            Buscar Subcategoría
          </button>
        </div>
      </div>

      <SubcategoryForm />
      <SearchSubcategory isOpen={isSearchOpen} setIsOpen={setIsSearchOpen} />
    </div>
  );
}

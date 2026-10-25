import { useState } from "react";
import { useSearchParams, Link } from "react-router";
import CategoryIncomeForm from "./CategoryIncomeForm";
import SearchCategoryIncome from "./SearchCategoryIncome";

export default function CategoryIncome() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 pt-10">
      <div className="mx-auto mb-4 flex w-11/12 max-w-3xl flex-col items-center justify-between gap-3 sm:flex-row">
        <h1 className="text-center text-[1.7rem] font-semibold tracking-[0.14em] text-slate-800 sm:text-left">
          {id ? `Categoría Ingreso #${id}` : "Nueva categoría de ingreso"}
        </h1>
        <div className="flex items-center gap-2">
          {id && (
            <Link
              to="/category-income"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
            >
              + Nueva Categoría
            </Link>
          )}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="rounded-xl bg-cyan-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-cyan-800 cursor-pointer"
          >
            Buscar Categoría
          </button>
        </div>
      </div>

      <CategoryIncomeForm />
      <SearchCategoryIncome isOpen={isSearchOpen} setIsOpen={setIsSearchOpen} />
    </div>
  );
}

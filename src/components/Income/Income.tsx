import { useState } from "react";
import { useParams, useSearchParams, Link } from "react-router";
import IncomeForm from "./IncomeForm";
import SearchIncome from "./SearchIncome";

export default function Income() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const id = params.id || searchParams.get("id");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 pt-10">
      <div className="mx-auto mb-4 flex w-11/12 max-w-3xl flex-col items-center justify-between gap-3 sm:flex-row">
        <h1 className="text-center text-[1.7rem] font-semibold tracking-[0.14em] text-slate-800 sm:text-left">
          {id ? `Ingreso #${id}` : "Nuevo ingreso"}
        </h1>
        <div className="flex items-center gap-2">
          {id && (
            <Link
              to="/income"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
            >
              + Nuevo Ingreso
            </Link>
          )}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="rounded-xl bg-cyan-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-cyan-800 cursor-pointer"
          >
            Buscar Ingreso
          </button>
        </div>
      </div>

      <IncomeForm />
      <SearchIncome isOpen={isSearchOpen} setIsOpen={setIsSearchOpen} />
    </div>
  );
}

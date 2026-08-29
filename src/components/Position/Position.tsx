"use client";

import { useState } from "react";
import { useParams } from "react-router";
import Menu from "../Menu";
import FormEditHeader from "../Shared/FormEditHeader";
import FormEditFooter from "../Shared/FormEditFooter";

export default function Position() {
  const { id, id_position } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  const fieldClassName =
    "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 shadow-sm transition duration-150 ease-in-out placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-3 focus:ring-cyan-100 disabled:bg-slate-200 disabled:text-slate-500 disabled:border-slate-300";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Lógica de submit iría aquí
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-10">
      <div className="mx-auto w-11/12 max-w-3xl mb-4">
        <h2 className="text-xl font-bold text-slate-800">
          Movimiento #{id} - Cuota #{id_position}
        </h2>
      </div>

      <div className="mx-auto mb-20 w-11/12 max-w-3xl space-y-6 pb-8">
        <FormEditHeader isEditing={isEditing} setIsEditing={setIsEditing} />
        <form className="space-y-6" onSubmit={handleSubmit}>
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Desglose de la Cuota
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-600">Monto</label>
              <input
                type="number"
                className={fieldClassName}
                placeholder="0.00"
                disabled={!isEditing}
                defaultValue="25000"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">Usuario Asociado</label>
              <select className={fieldClassName} disabled={!isEditing} defaultValue="2">
                <option value="1">Usuario 1</option>
                <option value="2">Usuario 2 (Tú)</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600">Día de vencimiento</label>
              <input
                type="date"
                className={fieldClassName}
                disabled={!isEditing}
                defaultValue="2026-09-05"
              />
            </div>
            
            <div className="flex items-end">
              <label
                className={`flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-3 text-sm shadow-sm transition-colors ${
                  !isEditing ? "bg-slate-200 text-slate-500" : "bg-slate-50 text-slate-600"
                }`}
              >
                <span>Pagado</span>
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!isEditing}
                  defaultChecked={false}
                />
              </label>
            </div>
          </div>
        </section>
        <FormEditFooter isEditing={isEditing} setIsEditing={setIsEditing} />
        </form>
      </div>
      <Menu />
    </div>
  );
}

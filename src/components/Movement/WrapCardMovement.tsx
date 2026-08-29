"use client";

import { useState } from "react";
import { Link, useParams } from "react-router";
import FormEditHeader from "../Shared/FormEditHeader";
import FormEditFooter from "../Shared/FormEditFooter";

export default function WrapCardMovement() {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  const fieldClassName =
    "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 shadow-sm transition duration-150 ease-in-out placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-3 focus:ring-cyan-100 disabled:bg-slate-200 disabled:text-slate-500 disabled:border-slate-300";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Lógica de submit iría aquí
    setIsEditing(false);
  };

  return (
    <div className="mx-auto mb-2 w-full max-w-3xl space-y-6 pb-2">
      <FormEditHeader isEditing={isEditing} setIsEditing={setIsEditing} />
      
      <form className="space-y-6" onSubmit={handleSubmit}>
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Datos Cabecera
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-600">Categoría</label>
            <select className={fieldClassName} disabled={!isEditing} defaultValue="1">
              <option value="1">Categoría principal</option>
              <option value="2">Ocio</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Subcategoría</label>
            <select className={fieldClassName} disabled={!isEditing} defaultValue="101">
              <option value="101">Alimentación</option>
              <option value="102">Transporte</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Tipo</label>
            <select className={fieldClassName} disabled={!isEditing} defaultValue="gasto">
              <option value="gasto">Gasto</option>
              <option value="ingreso">Ingreso</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Fecha ingreso</label>
            <input
              type="date"
              className={fieldClassName}
              disabled={!isEditing}
              defaultValue="2026-08-01"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-slate-600">Fecha vencimiento</label>
            <input
              type="date"
              className={fieldClassName}
              disabled={!isEditing}
              defaultValue="2026-08-05"
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Detalle
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-600">Monto</label>
            <input
              type="number"
              className={fieldClassName}
              placeholder="0.00"
              disabled={!isEditing}
              defaultValue="120000"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Titúlo</label>
            <input
              type="text"
              className={fieldClassName}
              placeholder="Título de la transacción"
              disabled={!isEditing}
              defaultValue="Compra de supermercado"
            />
          </div>

          <div className="flex items-end">
            <label
              className={`flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-3 text-sm shadow-sm transition-colors ${
                !isEditing ? "bg-slate-200 text-slate-500" : "bg-slate-50 text-slate-600"
              }`}
            >
              <span>Pagado / terminado</span>
              <input
                type="checkbox"
                className="h-4 w-4 accent-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isEditing}
                defaultChecked={true}
              />
            </label>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Cantidad cuotas</label>
            <input
              type="number"
              className={fieldClassName}
              disabled={!isEditing}
              defaultValue="1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Día vencimiento cuota</label>
            <input
              type="date"
              className={fieldClassName}
              disabled={!isEditing}
              defaultValue="2026-08-05"
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Cuotas
        </h3>
        <div className="max-h-56 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
          {[1, 2, 3, 4, 5, 6].map((cuotaId) => (
            <div
              key={cuotaId}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:bg-slate-100"
            >
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Cuota #{cuotaId}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Usuario asignado: {cuotaId % 2 === 0 ? "Usuario 2" : "Usuario 1"}
                </p>
              </div>
              <div className="text-right flex flex-col items-end">
                <p className="text-sm font-bold text-slate-700 mb-1">$25,000</p>
                <Link
                  to={`/movement/${id || "1"}/position/${cuotaId}`}
                  className="text-xs font-medium text-cyan-600 hover:text-cyan-700 hover:underline"
                >
                  Ver detalle
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      <FormEditFooter isEditing={isEditing} setIsEditing={setIsEditing} />
      </form>
    </div>
  );
}

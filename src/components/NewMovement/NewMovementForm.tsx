const fieldClassName =
  "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 shadow-sm transition duration-150 ease-in-out placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-3 focus:ring-cyan-100";

export default function NewMovementForm() {
  return (
    <form className="mx-auto mb-20 w-11/12 max-w-3xl space-y-6 pb-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Datos Cabecera
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-600">Categoría</label>
            <select className={fieldClassName}>
              <option>--Selecciona--</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Subcategoría</label>
            <select className={fieldClassName}>
              <option>--Selecciona--</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Tipo</label>
            <select className={fieldClassName}>
              <option>--Selecciona--</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Fecha ingreso</label>
            <input type="date" className={fieldClassName} />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-slate-600">Fecha vencimiento</label>
            <input type="date" className={fieldClassName} />
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
            <input type="number" className={fieldClassName} placeholder="0.00" />
          </div>
        <div>
            <label className="text-sm font-medium text-slate-600">Titúlo</label>
            <input type="text" className={fieldClassName} placeholder="Título del movimiento" />
          </div>

          <div className="flex items-end">
            <label className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-600 shadow-sm">
              <span>Pagado / terminado</span>
              <input type="checkbox" className="h-4 w-4 accent-cyan-600" />
            </label>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Cantidad cuotas</label>
            <input type="number" className={fieldClassName} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Día vencimiento cuota</label>
            <input type="date" className={fieldClassName} />
          </div>
        </div>
      </section>

      <div className="flex justify-center pt-2">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 focus:outline-none focus:ring-3 focus:ring-slate-300"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}

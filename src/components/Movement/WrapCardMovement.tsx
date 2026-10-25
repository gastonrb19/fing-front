"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router";
import FormEditHeader from "../Shared/FormEditHeader";
import FormEditFooter from "../Shared/FormEditFooter";
import InstallmentItem from "./InstallmentItem";
import { useAuth } from "../../context/AuthContext";
import { API_URL } from "../../utils/api";

export default function WrapCardMovement() {
  const { id } = useParams();
  const { user } = useAuth();
  const currentUserId = user?.id || 1;

  const [isEditing, setIsEditing] = useState(false);
  const [spend, setSpend] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fieldClassName =
    "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 shadow-sm transition duration-150 ease-in-out placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-3 focus:ring-cyan-100 disabled:bg-slate-200 disabled:text-slate-500 disabled:border-slate-300";

  useEffect(() => {
    fetch(`${API_URL}/spends/${id}`)
      .then((res) => res.json())
      .then((json) => {
        setSpend(json.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const amount = formData.get("amount");
    const name = formData.get("name");
    const minDayToPayment = formData.get("minDayToPayment");

    const totalInstallment = formData.get("totalInstallment");
    
    const payload = {
      spend: {
        name: name ? String(name) : undefined,
        amount: amount ? Number(amount) : undefined,
        minDayToPayment: minDayToPayment ? Number(minDayToPayment) : undefined,
        totalInstallment: totalInstallment ? Number(totalInstallment) : undefined,
      }
    };

    try {
      const res = await fetch(`${API_URL}/spends/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsEditing(false);
        // Opcional: Recargar los datos del gasto actualizados
        const json = await res.json();
        setSpend(json.data);
      } else {
        console.error("Error al guardar:", await res.text());
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  if (loading) return <p className="text-center mt-10 font-bold text-slate-500">Cargando detalle...</p>;
  if (!spend) return <p className="text-center mt-10 font-bold text-red-500">No se encontró el gasto.</p>;

  // Validar si el gasto está completamente pagado
  const allPaid = spend.plannedInstallments?.every((pi: any) => 
    pi.fk_installmentUserPayment?.every((up: any) => up.paymentDone)
  );
  const anyPaid = spend.plannedInstallments?.some((pi: any) => 
    pi.fk_installmentUserPayment?.some((up: any) => up.paymentDone)
  );

  const isSpendOwner = spend.user?.id === currentUserId;
  const disabledReason = !isSpendOwner
    ? `Solo el creador (@${spend.user?.username || "dueño"}) puede modificar este gasto`
    : (anyPaid ? "Bloqueado: Contiene cuotas pagadas" : undefined);

  return (
    <div className="mx-auto mb-2 w-full max-w-3xl space-y-6 pb-2">
      <FormEditHeader isEditing={isEditing} setIsEditing={setIsEditing} disabledReason={disabledReason} />
      
      {!isSpendOwner && (
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 text-xs text-purple-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-sm">
          <span>
            <strong>Gasto compartido:</strong> Este gasto fue creado por <strong>@{spend.user?.username || "un amigo"}</strong>. Abajo puedes ver el detalle y pagar tus cuotas asignadas.
          </span>
          <span className="bg-purple-200/70 text-purple-800 font-semibold px-2 py-0.5 rounded text-[11px] whitespace-nowrap">
            Modo Participante
          </span>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Datos Cabecera
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-600">Categoría</label>
            <select className={fieldClassName} disabled={!isEditing} defaultValue={spend.subcategory?.category?.id || ""}>
              <option defaultValue={spend.subcategory?.category?.id}>{spend.subcategory?.category?.name || "Categoría"}</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Subcategoría</label>
            <select className={fieldClassName} disabled={!isEditing} defaultValue={spend.subcategory?.id || ""}>
              <option defaultValue={spend.subcategory?.id}>{spend.subcategory?.name || "Subcategoría"}</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Tipo</label>
            <select className={fieldClassName} disabled={!isEditing} defaultValue={spend.type?.name?.toLowerCase() || ""}>
              <option defaultValue={spend.type?.name?.toLowerCase()}>{spend.type?.name || "Tipo"}</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Fecha ingreso</label>
            <input
              type="date"
              className={fieldClassName}
              disabled={!isEditing}
              defaultValue={spend.createDate ? spend.createDate.split("T")[0] : ""}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-slate-600">Fecha vencimiento</label>
            <input
              type="date"
              className={fieldClassName}
              disabled={!isEditing}
              defaultValue={spend.startPayment ? spend.startPayment.split("T")[0] : ""}
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
              disabled={!isEditing}
              name="amount" defaultValue={spend.amount || ""}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Título</label>
            <input
              type="text"
              className={fieldClassName}
              disabled={!isEditing}
              name="name" defaultValue={spend.name || ""}
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
                disabled={true}
                checked={allPaid || false}
              />
            </label>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Cantidad cuotas</label>
            <input
              type="number"
              className={fieldClassName}
              disabled={!isEditing}
              name="totalInstallment" min="1" step="1" defaultValue={spend.totalInstallment || ""}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Día vencimiento cuota</label>
            <input
              type="number"
              className={fieldClassName}
              disabled={!isEditing}
              name="minDayToPayment" min="1" max="31" step="1" defaultValue={spend.minDayToPayment || ""}
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Cuotas
        </h3>
        <div className="max-h-56 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
          {spend.plannedInstallments?.map((pi: any, pIndex: number) => 
            pi.fk_installmentUserPayment?.map((payment: any) => (
              <InstallmentItem
                key={payment.idPayment}
                spendId={spend.id}
                installmentId={pi.idPI}
                paymentId={payment.idPayment}
                index={pIndex + 1}
                userName={payment.user?.username || "Desconocido"}
                amount={payment.assignedAmount}
                isPaid={payment.paymentDone}
                isAccepted={payment.accepted}
                isRejected={payment.rejected}
                isCurrentUser={payment.user?.id === currentUserId}
                isSpendOwner={spend.user?.id === currentUserId}
                date={pi.availableDate ? pi.availableDate.split("T")[0] : ""}
              />
            ))
          )}
          {(!spend.plannedInstallments || spend.plannedInstallments.length === 0) && (
             <p className="text-center text-sm text-slate-400 italic py-4">No hay cuotas registradas.</p>
          )}
        </div>
      </section>
      
      {isSpendOwner && <FormEditFooter isEditing={isEditing} setIsEditing={setIsEditing} />}
      </form>
    </div>
  );
}

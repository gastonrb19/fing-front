"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router";
import FormEditHeader from "../Shared/FormEditHeader";
import FormEditFooter from "../Shared/FormEditFooter";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Position() {
  const { id, id_position } = useParams();
  const { user } = useAuth();
  const currentUserId = user?.id || 1;

  const [isEditing, setIsEditing] = useState(false);
  const [payment, setPayment] = useState<any>(null);
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fieldClassName =
    "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 shadow-sm transition duration-150 ease-in-out placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-3 focus:ring-cyan-100 disabled:bg-slate-200 disabled:text-slate-500 disabled:border-slate-300";

  useEffect(() => {
    // Cargar Cuota
    fetch(`${API_URL}/installmentuserpayments/${id_position}`)
      .then((res) => res.json())
      .then((json) => {
        setPayment(json);
        setLoading(false);
      })
      .catch((err) => console.error("Error", err));
      
    // Cargar Amigos del Usuario Actual
    if (currentUserId) {
      fetch(`${API_URL}/users/${currentUserId}/friends`)
        .then(res => res.json())
        .then(json => {
          if(json.success && json.data) setFriends(json.data.map((f:any) => f.friend));
          else if(Array.isArray(json)) setFriends(json.map((f:any) => f.friend));
        })
        .catch(e => console.error(e));
    }
  }, [id_position, currentUserId]);

  const handleAccept = async () => {
    try {
      const res = await fetch(`${API_URL}/installmentuserpayments/${id_position}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accepted: true }),
      });
      if (res.ok) {
        const updated = await res.json();
        setPayment(updated);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async () => {
    try {
      const res = await fetch(`${API_URL}/installmentuserpayments/${id_position}/reject`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentUser: currentUserId }),
      });
      if (res.ok) {
        const updated = await res.json();
        setPayment(updated);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const paymentDone = formData.get("paymentDone") === "on";
    const newUserId = formData.get("userId");
    
    // REGLA ESTRICTA: Sin remanentes. O pagas el total asignado o pagas 0.
    const paidAmount = paymentDone ? payment.assignedAmount : 0;

    try {
      const res = await fetch(`${API_URL}/installmentuserpayments/${id_position}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentDone,
          paidAmount,
          userId: newUserId ? Number(newUserId) : undefined,
        }),
      });
      if (res.ok) {
        setIsEditing(false);
        const updated = await res.json();
        setPayment(updated);
      } else {
        console.error("Error al actualizar cuota:", await res.text());
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-50 pt-10 text-center"><p className="font-bold text-slate-500">Cargando cuota...</p></div>;
  if (!payment) return <div className="min-h-screen bg-slate-50 pt-10 text-center"><p className="font-bold text-red-500">No se encontró la cuota.</p></div>;

  const spendOwner = payment.plannedInstallment?.piId?.user;
  const isSpendOwner = spendOwner?.id === currentUserId;
  const isDebtor = payment.user?.id === currentUserId;

  let disabledReason: string | undefined = undefined;
  if (!isSpendOwner && !isDebtor) {
    disabledReason = "Bloqueado: Esta cuota no te pertenece";
  } else if (isSpendOwner) {
    if (payment.paymentDone) {
      disabledReason = "Bloqueado: Esta cuota ya fue pagada";
    }
  } else if (isDebtor) {
    if (payment.rejected) {
      disabledReason = "Bloqueado: Has rechazado esta cuota";
    } else if (!payment.accepted) {
      disabledReason = "Bloqueado: Debes responder a la cuota primero";
    }
  }

  const showAcceptRejectDecision = isDebtor && !isSpendOwner && !payment.accepted && !payment.rejected;

  return (
    <div className="min-h-screen bg-slate-50 pt-10">
      <div className="mx-auto w-11/12 max-w-3xl mb-4">
        <h2 className="text-xl font-bold text-slate-800">
          Movimiento #{id} - Detalles del Pago
        </h2>
      </div>

      <div className="mx-auto mb-20 w-11/12 max-w-3xl space-y-6 pb-8">
        
        {/* Banner informativo de rol */}
        {isSpendOwner && !isDebtor && (
          <div className="rounded-xl border border-cyan-200 bg-cyan-50/80 p-3.5 text-xs text-cyan-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-sm">
            <span>
              <strong>Modo Creador:</strong> Eres el dueño de este movimiento maestro. Puedes reasignar la cuota a otro amigo o registrar el pago.
            </span>
            {payment.accepted && (
              <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded text-[11px] whitespace-nowrap">
                ✓ Aceptada por {payment.user?.username}
              </span>
            )}
            {!payment.accepted && !payment.rejected && (
              <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded text-[11px] whitespace-nowrap">
                ⏳ Pendiente de respuesta
              </span>
            )}
            {payment.rejected && (
              <span className="bg-rose-100 text-rose-800 font-bold px-2.5 py-1 rounded text-[11px] whitespace-nowrap">
                ✕ Rechazada por {payment.user?.username}
              </span>
            )}
          </div>
        )}

        {/* Banner de cuota rechazada para el Creador */}
        {isSpendOwner && payment.rejected && (
          <div className="rounded-2xl border-2 border-rose-300 bg-rose-50 p-4 text-xs shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="font-bold text-rose-900 text-sm">
                ⚠️ Cuota rechazada por tu amigo ({payment.user?.username})
              </p>
              <p className="text-rose-700 mt-0.5">
                La deuda por ${payment.assignedAmount?.toLocaleString("es-CL")} ha retornado a tu responsabilidad como creador ({payment.assumedByUser?.username || "Tú"}). Puedes pagarla directamente o editarla para reasignársela a otro amigo.
              </p>
            </div>
            {!payment.paymentDone && !isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
              >
                Reasignar o Pagar
              </button>
            )}
          </div>
        )}

        {/* Banner de decisión para el deudor */}
        {showAcceptRejectDecision && (
          <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-5 text-center shadow-sm">
            <h3 className="text-base font-bold text-amber-900">Tienes una cuota pendiente de respuesta</h3>
            <p className="mt-1 text-xs text-amber-700">
              El creador del gasto ({spendOwner?.username || "un amigo"}) te asignó el pago de esta cuota por ${payment.assignedAmount?.toLocaleString("es-CL")}. ¿Aceptas la responsabilidad?
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <button
                type="button"
                onClick={handleReject}
                className="rounded-xl border border-rose-300 bg-white px-5 py-2 text-xs font-bold text-rose-600 shadow-sm hover:bg-rose-50 hover:border-rose-400 transition-colors"
              >
                ✕ Rechazar Cuota
              </button>
              <button
                type="button"
                onClick={handleAccept}
                className="rounded-xl bg-amber-500 px-6 py-2 text-xs font-bold text-white shadow-sm hover:bg-amber-600 transition-colors"
              >
                ✓ Aceptar Cuota
              </button>
            </div>
          </div>
        )}

        {/* Notificación si la cuota fue rechazada */}
        {payment.rejected && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-center shadow-sm">
            <p className="text-xs font-semibold text-rose-800">
              Esta cuota fue rechazada por {payment.user?.username || "el usuario"}. La responsabilidad del pago recae actualmente sobre el creador del gasto ({spendOwner?.username}).
            </p>
          </div>
        )}

        <FormEditHeader 
          isEditing={isEditing} 
          setIsEditing={setIsEditing} 
          disabledReason={disabledReason} 
        />

        <form className="space-y-6" onSubmit={handleSubmit}>
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Desglose de la Cuota
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              
              {/* CAMPO BLOQUEADO (Estricto) */}
              <div>
                <label className="text-sm font-medium text-slate-600">Monto Asignado</label>
                <input
                  type="number"
                  className={fieldClassName}
                  disabled={true} 
                  value={payment.assignedAmount || ""}
                />
              </div>

              {/* SELECT DE USUARIO: Editable por el dueño del gasto */}
              <div>
                <label className="text-sm font-medium text-slate-600">
                  Usuario Responsable
                  {!isSpendOwner && <span className="text-[11px] font-normal text-slate-400 ml-1.5">(Solo el creador puede reasignar)</span>}
                </label>
                <select 
                  name="userId" 
                  className={fieldClassName} 
                  disabled={!isEditing || !isSpendOwner || payment.paymentDone} 
                  defaultValue={payment.user?.id || ""}
                >
                  <option value={payment.user?.id}>{payment.user?.username || "Usuario Actual"}</option>
                  
                  {/* Opción de asignarlo al creador mismo */}
                  {spendOwner && spendOwner.id !== payment.user?.id && (
                    <option value={spendOwner.id}>{spendOwner.username} (Yo - Creador)</option>
                  )}

                  {/* Amigos del creador */}
                  {friends && friends.map(f => f && f.id !== payment.user?.id && f.id !== spendOwner?.id && (
                    <option key={f.id} value={f.id}>{f.username}</option>
                  ))}
                </select>
              </div>

              {/* FECHA BLOQUEADA */}
              <div>
                <label className="text-sm font-medium text-slate-600">Día de vencimiento</label>
                <input
                  type="date"
                  className={fieldClassName}
                  disabled={true}
                  value={
                    payment.plannedInstallment?.availableDate
                      ? payment.plannedInstallment.availableDate.split("T")[0]
                      : ""
                  }
                />
              </div>

              {/* CHECKBOX DE PAGO */}
              <div className="flex items-end">
                <label
                  className={`flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-3 text-sm shadow-sm transition-colors ${
                    !isEditing ? "bg-slate-200 text-slate-500" : "bg-slate-50 text-slate-600 cursor-pointer"
                  }`}
                >
                  <span>¿Pagado?</span>
                  <input
                    type="checkbox"
                    name="paymentDone"
                    className="h-4 w-4 accent-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    disabled={!isEditing}
                    defaultChecked={payment.paymentDone || false}
                  />
                </label>
              </div>

            </div>
          </section>

          {/* Si el deudor tiene que responder a la cuota, no mostramos FormEditFooter */}
          {!showAcceptRejectDecision && (
            <FormEditFooter isEditing={isEditing} setIsEditing={setIsEditing} />
          )}
        </form>
      </div>
    </div>
  );
}

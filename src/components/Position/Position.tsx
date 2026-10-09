"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router";
import FormEditHeader from "../Shared/FormEditHeader";
import FormEditFooter from "../Shared/FormEditFooter";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const CURRENT_USER_ID = 1; // Gastón

export default function Position() {
  const { id, id_position } = useParams();
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
    fetch(`${API_URL}/users/${CURRENT_USER_ID}/friends`)
      .then(res => res.json())
      .then(json => {
        if(json.success && json.data) setFriends(json.data.map((f:any) => f.friend));
        else if(Array.isArray(json)) setFriends(json.map((f:any) => f.friend));
      })
      .catch(e => console.error(e));
  }, [id_position]);

  
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

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const paymentDone = formData.get("paymentDone") === "on";
    const newUserId = formData.get("userId");
    console.log("Valores en React -> pagado:", paymentDone, "nuevo usuario ID:", newUserId);
    
    // REGLA ESTRICTA: Sin remanentes. O pagas el total asignado o pagas 0.
    const paidAmount = paymentDone ? payment.assignedAmount : 0;

    try {
      const res = await fetch(`${API_URL}/installmentuserpayments/${id_position}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentDone,
          paidAmount, // Enviamos el monto inferido
          userId: newUserId ? Number(newUserId) : undefined, // Si cambia de usuario, se enviará
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

  return (
    <div className="min-h-screen bg-slate-50 pt-10">
      <div className="mx-auto w-11/12 max-w-3xl mb-4">
        <h2 className="text-xl font-bold text-slate-800">
          Movimiento #{id} - Detalles del Pago
        </h2>
      </div>

      <div className="mx-auto mb-20 w-11/12 max-w-3xl space-y-6 pb-8">
        <FormEditHeader 
          isEditing={isEditing} 
          setIsEditing={setIsEditing} 
          disabledReason={
            payment.user?.id !== CURRENT_USER_ID
              ? "Bloqueado: Esta cuota pertenece a otro usuario" 
              : (!payment.accepted && !payment.rejected) ? "Bloqueado: Debes aceptar la cuota primero" : undefined
          } 
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

              {/* SELECT DE USUARIO DESBLOQUEABLE */}
              <div>
                <label className="text-sm font-medium text-slate-600">Usuario Responsable</label>
                <select name="userId" className={fieldClassName} disabled={!isEditing} defaultValue={payment.user?.id || ""}>
                  <option value={payment.user?.id}>{payment.user?.username || "Usuario Actual"}</option>
                  {friends && friends.map(f => f && f.id !== payment.user?.id && <option key={f.id} value={f.id}>{f.username}</option>)}
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
                    !isEditing ? "bg-slate-200 text-slate-500" : "bg-slate-50 text-slate-600"
                  }`}
                >
                  <span>¿Pagado?</span>
                  <input
                    type="checkbox"
                    name="paymentDone"
                    className="h-4 w-4 accent-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!isEditing}
                    defaultChecked={payment.paymentDone || false}
                  />
                </label>
              </div>

            </div>
          </section>

          {payment.user?.id === CURRENT_USER_ID && !payment.accepted && !payment.rejected ? (
            <div className="flex justify-center mt-4 border-t border-slate-200 pt-4">
              <button type="button" onClick={handleAccept} className="rounded-xl bg-amber-500 px-8 py-3 text-sm font-bold text-white shadow-sm hover:bg-amber-600 transition-colors">
                Aceptar Cuota
              </button>
            </div>
          ) : (
            <FormEditFooter isEditing={isEditing} setIsEditing={setIsEditing} />
          )}
        </form>
      </div>
    </div>
  );
}

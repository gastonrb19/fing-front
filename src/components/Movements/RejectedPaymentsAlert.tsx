import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { API_URL } from "../../utils/api";

export interface RejectedPayment {
  idPayment: string;
  assignedAmount: number;
  paidAmount: number;
  paymentDone: boolean;
  rejected: boolean;
  accepted: boolean;
  user?: {
    id: number;
    username: string;
    email: string;
  };
  assumedByUser?: {
    id: number;
    username: string;
  };
  plannedInstallment?: {
    idPI: string;
    amount: number;
    availableDate?: string;
    piId?: {
      id: number;
      name: string;
      amount: number;
      user?: {
        id: number;
        username: string;
      };
    };
  };
}

export default function RejectedPaymentsAlert() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rejectedPayments, setRejectedPayments] = useState<RejectedPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);

  const fetchRejected = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      // Pedimos las cuotas rechazadas donde el usuario actual es el creador que asumió la deuda
      const res = await fetch(`${API_URL}/installmentuserpayments/rejected?asCreator=true`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          // Filtrar las que aún no han sido pagadas por el creador
          const pending = data.filter((p: RejectedPayment) => !p.paymentDone);
          setRejectedPayments(pending);
        }
      }
    } catch (err) {
      console.error("Error al cargar cuotas rechazadas:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchRejected();
  }, [fetchRejected]);

  const handlePayAssumedDebt = async (paymentId: string, assignedAmount: number) => {
    if (!confirm(`¿Confirmas que pagarás los $${assignedAmount.toLocaleString("es-CL")} de esta cuota asumida?`)) {
      return;
    }

    try {
      setPayingId(paymentId);
      const res = await fetch(`${API_URL}/installmentuserpayments/${paymentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          paymentDone: true,
          paidAmount: assignedAmount,
        }),
      });

      if (res.ok) {
        // Remover de la lista activa
        setRejectedPayments((prev) => prev.filter((p) => p.idPayment !== paymentId));
      } else {
        alert("Error al procesar el pago de la cuota asumida.");
      }
    } catch (err) {
      console.error(err);
      alert("Error de red.");
    } finally {
      setPayingId(null);
    }
  };

  // Si no hay cuotas rechazadas pendientes, no ocupar espacio visual
  if (!loading && rejectedPayments.length === 0) {
    return null;
  }

  return (
    <section className="w-[90%] max-w-4xl mx-auto mb-6">
      <div className="rounded-2xl border-2 border-rose-300 bg-rose-50/70 p-4 shadow-sm transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500 text-white font-bold text-sm shadow">
              !
            </span>
            <div>
              <h2 className="text-sm font-bold text-rose-950">
                Cuotas rechazadas por tus amigos ({rejectedPayments.length})
              </h2>
              <p className="text-xs text-rose-700">
                Tus amigos declinaron el cobro de estas cuotas. La responsabilidad retornó a ti.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-xs text-rose-800 hover:text-rose-950 font-semibold px-2 py-1 rounded-md hover:bg-rose-100 transition-colors cursor-pointer"
          >
            {isCollapsed ? "Mostrar detalles ▼" : "Ocultar ▲"}
          </button>
        </div>

        {!isCollapsed && (
          <div className="mt-3 divide-y divide-rose-200/60 border-t border-rose-200/60 pt-2">
            {rejectedPayments.map((item) => {
              const spendId = item.plannedInstallment?.piId?.id;
              const spendName = item.plannedInstallment?.piId?.name || "Gasto sin nombre";
              const debtorName = item.user?.username || "Un amigo";
              const amount = item.assignedAmount || 0;

              return (
                <div
                  key={item.idPayment}
                  className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-800 text-sm">{spendName}</span>
                      <span className="bg-rose-100 text-rose-800 font-semibold text-[11px] px-2 py-0.5 rounded-full border border-rose-200">
                        ✕ Rechazado por {debtorName}
                      </span>
                      <span className="bg-purple-100 text-purple-800 font-semibold text-[11px] px-2 py-0.5 rounded-full border border-purple-200">
                        Asumido por ti
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Monto adeudado:{" "}
                      <strong className="text-slate-900">${amount.toLocaleString("es-CL")}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {spendId && (
                      <button
                        onClick={() =>
                          navigate(`/movement/${spendId}/position/${item.idPayment}`)
                        }
                        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Ver Cuota
                      </button>
                    )}
                    <button
                      disabled={payingId === item.idPayment}
                      onClick={() => handlePayAssumedDebt(item.idPayment, amount)}
                      className="rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-rose-700 disabled:bg-rose-300 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      {payingId === item.idPayment ? (
                        "Pagando..."
                      ) : (
                        <>
                          <span>✓</span>
                          <span>Pagar yo</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

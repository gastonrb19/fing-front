import React from "react";

export interface ParticipantItem {
  userId: number;
  percentage: number;
}

interface SplitParticipantsSelectorProps {
  participants: ParticipantItem[];
  setParticipants: React.Dispatch<React.SetStateAction<ParticipantItem[]>>;
  friends: any[];
  currentUserId: number;
  totalAmount: number;
  totalInstallment: number;
}

export default function SplitParticipantsSelector({
  participants,
  setParticipants,
  friends,
  currentUserId,
  totalAmount,
  totalInstallment,
}: SplitParticipantsSelectorProps) {
  const totalPercentage = participants.reduce(
    (sum, p) => sum + (Number(p.percentage) || 0),
    0
  );
  const roundedTotal = Math.round(totalPercentage * 100) / 100;
  const isExact100 = Math.abs(roundedTotal - 100) < 0.05;

  const handleAddParticipant = () => {
    // Buscar el primer amigo que aún no esté en la lista
    const usedUserIds = new Set(participants.map((p) => p.userId));
    const availableFriend = friends.find((f) => !usedUserIds.has(f.id));

    const nextUserId = availableFriend ? availableFriend.id : currentUserId;
    setParticipants((prev) => [...prev, { userId: nextUserId, percentage: 0 }]);
  };

  const handleRemoveParticipant = (index: number) => {
    setParticipants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUserChange = (index: number, newUserId: number) => {
    setParticipants((prev) =>
      prev.map((item, i) => (i === index ? { ...item, userId: newUserId } : item))
    );
  };

  const handlePercentageChange = (index: number, val: number) => {
    const cleanVal = isNaN(val) ? 0 : Math.max(0, Math.min(100, val));
    setParticipants((prev) =>
      prev.map((item, i) => (i === index ? { ...item, percentage: cleanVal } : item))
    );
  };

  const handleSplitEqually = () => {
    if (participants.length === 0) return;
    const count = participants.length;
    const basePct = Math.floor((100 / count) * 100) / 100;
    const remainder = Math.round((100 - basePct * count) * 100) / 100;

    setParticipants((prev) =>
      prev.map((item, idx) => ({
        ...item,
        percentage: idx === 0 ? Math.round((basePct + remainder) * 100) / 100 : basePct,
      }))
    );
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            División de Cuotas (Participantes)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Asigna el porcentaje de cada cuota que asumirá cada persona.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {participants.length > 1 && (
            <button
              type="button"
              onClick={handleSplitEqually}
              className="rounded-lg border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-800 hover:bg-cyan-100 transition-colors"
            >
              ⚡ Partes iguales
            </button>
          )}
          <button
            type="button"
            onClick={handleAddParticipant}
            className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-700 transition-colors shadow-sm"
          >
            + Agregar Persona
          </button>
        </div>
      </div>

      {/* Lista de Cajitas de Participantes */}
      <div className="grid gap-3 sm:grid-cols-2">
        {participants.map((p, idx) => {
          const userShareAmount = totalAmount ? (totalAmount * (p.percentage / 100)) : 0;
          const userInstallmentAmount =
            totalInstallment > 0 ? userShareAmount / totalInstallment : userShareAmount;

          return (
            <div
              key={idx}
              className="relative rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 shadow-sm transition-all hover:border-slate-300 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Cajita #{idx + 1}
                </span>
                {participants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveParticipant(idx)}
                    className="text-xs text-rose-500 hover:text-rose-700 font-bold px-1"
                    title="Eliminar participante"
                  >
                    ✕ Quitar
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Usuario asignado
                  </label>
                  <select
                    value={p.userId}
                    onChange={(e) => handleUserChange(idx, Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100 shadow-sm"
                  >
                    <option value={currentUserId}>Yo (Creador)</option>
                    {friends.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.username}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Porcentaje de la cuota (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      step="any"
                      value={p.percentage || ""}
                      onChange={(e) => handlePercentageChange(idx, parseFloat(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 pr-7 text-xs text-slate-700 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100 shadow-sm font-semibold"
                      placeholder="0"
                      required
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      %
                    </span>
                  </div>
                </div>
              </div>

              {/* Desglose en dinero por cuota */}
              {totalAmount > 0 && (
                <div className="pt-2 border-t border-slate-200/80 text-[11px] flex flex-col gap-0.5 text-slate-500">
                  <div className="flex justify-between">
                    <span>Aporte total:</span>
                    <strong className="text-slate-800">
                      ${Math.round(userShareAmount).toLocaleString("es-CL")}
                    </strong>
                  </div>
                  {totalInstallment > 1 && (
                    <div className="flex justify-between text-cyan-700 font-medium">
                      <span>Por cuota ({totalInstallment}):</span>
                      <span>
                        ${Math.round(userInstallmentAmount).toLocaleString("es-CL")} / mes
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Barra de progreso y validación del 100% */}
      <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-600">Suma total de porcentajes:</span>
          <span
            className={`${
              isExact100
                ? "text-emerald-600"
                : roundedTotal > 100
                ? "text-rose-600"
                : "text-amber-600"
            }`}
          >
            {roundedTotal}% / 100%
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isExact100
                ? "bg-emerald-500"
                : roundedTotal > 100
                ? "bg-rose-500"
                : "bg-amber-400"
            }`}
            style={{ width: `${Math.min(100, roundedTotal)}%` }}
          />
        </div>

        {!isExact100 && (
          <p className="text-[11px] font-medium text-amber-700 pt-0.5">
            {roundedTotal < 100
              ? `Falta asignar un ${Math.round((100 - roundedTotal) * 100) / 100}% para completar el total.`
              : `La suma sobrepasa el 100% por un ${Math.round((roundedTotal - 100) * 100) / 100}%.`}
          </p>
        )}
      </div>
    </section>
  );
}

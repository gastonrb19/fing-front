"use client";

import { memo, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { API_URL } from "../../utils/api";

interface SummaryMovementsProps {
  filters?: any;
}

function SummaryMovements({ filters = {} }: SummaryMovementsProps) {
  const { user } = useAuth();
  const currentUserId = user?.id || 1;

  const movementType = filters.movementType || "all";
  const showSpends = movementType === "all" || movementType === "spend";
  const showIncomes = movementType === "all" || movementType === "income";

  const [spends, setSpends] = useState<any[]>([]);
  const [incomes, setIncomes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUserId) return;

    setLoading(true);

    const fetchSpendsPromise = showSpends
      ? (() => {
          let query = `limit=1000&offset=0`;
          if (filters.categoryId) query += `&category=${filters.categoryId}`;
          if (filters.subcategoryId)
            query += `&subcategory=${filters.subcategoryId}`;
          if (filters.from) query += `&from=${filters.from}`;
          if (filters.until) query += `&until=${filters.until}`;
          if (filters.done) query += `&done=${filters.done}`;
          if (filters.role && filters.role !== "all")
            query += `&role=${filters.role}`;

          return fetch(`${API_URL}/users/${currentUserId}/spends?${query}`)
            .then((res) => (res.ok ? res.json() : { data: [] }))
            .then((json) => (Array.isArray(json.data) ? json.data : []));
        })()
      : Promise.resolve([]);

    const fetchIncomesPromise = showIncomes
      ? (() => {
          let query = `limit=1000&offset=0`;
          if (filters.categoryIncomeId)
            query += `&categoryIncome=${filters.categoryIncomeId}`;
          if (filters.from) query += `&from=${filters.from}`;
          if (filters.until) query += `&until=${filters.until}`;
          if (filters.done) query += `&isPayed=${filters.done}`;

          return fetch(`${API_URL}/users/${currentUserId}/incomes?${query}`)
            .then((res) => (res.ok ? res.json() : { data: [] }))
            .then((json) => (Array.isArray(json.data) ? json.data : []));
        })()
      : Promise.resolve([]);

    Promise.all([fetchSpendsPromise, fetchIncomesPromise])
      .then(([loadedSpends, loadedIncomes]) => {
        setSpends(loadedSpends);
        setIncomes(loadedIncomes);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentUserId, filters, showSpends, showIncomes]);

  // useMemo calcula en una sola pasada todos los subtotales y el Total actual
  const summary = useMemo(() => {
    let pendingSpend = 0;
    let pendingSpendCount = 0;
    let totalSpent = 0;
    let paidSpendCount = 0;

    spends.forEach((spend: any) => {
      const isOwner =
        spend.isOwner !== undefined
          ? spend.isOwner
          : spend.user?.id === currentUserId;

      const userAssigned =
        spend.assignedAmount !== undefined
          ? Number(spend.assignedAmount)
          : isOwner
            ? Number(spend.amount || 0)
            : 0;

      const totalInst =
        Number(spend.userTotalInstallments || spend.totalInstallment) || 1;
      const paidInst = Number(spend.paidInstallments) || 0;

      const userPaid =
        spend.paidAmount !== undefined
          ? Number(spend.paidAmount)
          : (userAssigned / totalInst) * paidInst;

      const remaining = Math.max(0, userAssigned - userPaid);

      if (paidInst < totalInst && remaining > 0) {
        pendingSpend += remaining;
        pendingSpendCount += 1;
      }

      if (paidInst > 0 && userPaid > 0) {
        totalSpent += userPaid;
        paidSpendCount += 1;
      }
    });

    let pendingIncome = 0;
    let pendingIncomeCount = 0;
    let totalIncome = 0;
    let depositedIncomeCount = 0;

    incomes.forEach((inc: any) => {
      const amount = Number(inc.amount || 0);
      if (inc.isPayed) {
        totalIncome += amount;
        depositedIncomeCount += 1;
      } else {
        pendingIncome += amount;
        pendingIncomeCount += 1;
      }
    });

    const roundedSpent = Math.round(totalSpent);
    const roundedIncome = Math.round(totalIncome);

    return {
      pendingSpend: Math.round(pendingSpend),
      pendingSpendCount,
      totalSpent: roundedSpent,
      paidSpendCount,
      pendingIncome: Math.round(pendingIncome),
      pendingIncomeCount,
      totalIncome: roundedIncome,
      depositedIncomeCount,
      totalActual: roundedIncome - roundedSpent,
    };
  }, [spends, incomes, currentUserId]);

  if (loading) return null;

  return (
    <section className="mx-auto mt-6 mb-32 w-11/12 border-t border-slate-200 pt-4 space-y-2.5 text-sm text-slate-600">
      <div className="grid grid-cols-1 gap-y-2.5 sm:grid-cols-2 sm:gap-x-6">
        {/* Fila 1: Gasto pendiente - Ingreso pendiente */}
        {showSpends && (
          <div className="flex items-center justify-start gap-1.5">
            <span className="font-semibold text-rose-700">(-)</span>
            <span className="text-slate-500">Por pagar:</span>
            <span className="font-semibold text-rose-700">
              ${summary.pendingSpend.toLocaleString("es-CL")}
            </span>
            <span className="text-xs text-slate-400">
              ({summary.pendingSpendCount})
            </span>
          </div>
        )}

        {showIncomes && (
          <div
            className={`flex items-center justify-start gap-1.5 ${
              showSpends ? "sm:justify-end" : ""
            }`}
          >
            <span className="font-semibold text-emerald-700">(+)</span>
            <span className="text-slate-500">Por ingresar:</span>
            <span className="font-semibold text-emerald-700">
              ${summary.pendingIncome.toLocaleString("es-CL")}
            </span>
            <span className="text-xs text-slate-400">
              ({summary.pendingIncomeCount})
            </span>
          </div>
        )}

        {/* Fila 2: Gasto pagado - Ingreso depositado */}
        {showSpends && (
          <div
            className={`flex items-center justify-start gap-1.5 ${
              !showIncomes ? "sm:justify-end" : ""
            }`}
          >
            <span className="font-semibold text-rose-700">(-)</span>
            <span className="text-slate-500">Total gastado:</span>
            <span className="font-semibold text-rose-700">
              ${summary.totalSpent.toLocaleString("es-CL")}
            </span>
            <span className="text-xs text-slate-400">
              ({summary.paidSpendCount})
            </span>
          </div>
        )}

        {showIncomes && (
          <div className="flex items-center justify-start sm:justify-end gap-1.5">
            <span className="font-semibold text-emerald-700">(+)</span>
            <span className="text-slate-500">Total ingreso:</span>
            <span className="font-semibold text-emerald-700">
              ${summary.totalIncome.toLocaleString("es-CL")}
            </span>
            <span className="text-xs text-slate-400">
              ({summary.depositedIncomeCount})
            </span>
          </div>
        )}
      </div>

      {movementType === "all" && (
        <div className="border-t border-slate-100 pt-2 flex items-center justify-start sm:justify-end gap-2">
          <span className="font-medium text-slate-600">Total actual:</span>
          <span
            className={`font-bold ${
              summary.totalActual >= 0 ? "text-emerald-700" : "text-rose-700"
            }`}
          >
            {summary.totalActual < 0 ? "-$" : "$"}
            {Math.abs(summary.totalActual).toLocaleString("es-CL")}
          </span>
        </div>
      )}
    </section>
  );
}

// React.memo evita re-renderizados cuando Movements solo alterna displayFilter
export default memo(SummaryMovements);

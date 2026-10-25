import { useEffect, useState, useCallback } from "react";
import CategoryMovement from "./CategoryMovement";
import CategoryIncomeMovement, {
  type CategoryIncomeGroup,
} from "./CategoryIncomeMovement";
import { useAuth } from "../../context/AuthContext";

export interface MovementItem {
  nro: number;
  description: string;
  amount: number;
  assignedAmount?: number;
  isOwner?: boolean;
  creatorName?: string;
  date: string;
  paidInstallments: number;
  totalInstallments: number;
}

export interface SubcategoryInfo {
  id_subcategory: number;
  name_subcategory: string;
  movements: MovementItem[];
}

export interface LoadInfo {
  id_category: number;
  name_category: string;
  subcategories: SubcategoryInfo[];
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface WrapSectionsProps {
  filters?: any;
}

function groupSpends(spends: any[], currentUserId: number): LoadInfo[] {
  const groupedMap = new Map<number, LoadInfo>();

  spends.forEach((spend: any) => {
    const catId = spend.subcategory?.category?.id || 0;
    const catName = spend.subcategory?.category?.name || "Sin Categoría";
    const subId = spend.subcategory?.id || 0;
    const subName = spend.subcategory?.name || "Sin Subcategoría";

    if (!groupedMap.has(catId)) {
      groupedMap.set(catId, {
        id_category: catId,
        name_category: catName,
        subcategories: [],
      });
    }

    const category = groupedMap.get(catId)!;
    let subcategory = category.subcategories.find(
      (s) => s.id_subcategory === subId
    );
    if (!subcategory) {
      subcategory = {
        id_subcategory: subId,
        name_subcategory: subName,
        movements: [],
      };
      category.subcategories.push(subcategory);
    }

    if (!subcategory.movements.find((m) => m.nro === spend.id)) {
      const isOwner =
        spend.isOwner !== undefined
          ? spend.isOwner
          : spend.user?.id === currentUserId;
      subcategory.movements.push({
        nro: spend.id,
        description: spend.name,
        amount: spend.amount,
        assignedAmount:
          spend.assignedAmount !== undefined
            ? spend.assignedAmount
            : spend.amount,
        isOwner,
        creatorName: spend.user?.username || "",
        date: spend.startPayment ? String(spend.startPayment).split("T")[0] : "",
        paidInstallments: spend.paidInstallments || 0,
        totalInstallments:
          spend.userTotalInstallments || spend.totalInstallment || 1,
      });
    }
  });

  return Array.from(groupedMap.values());
}

function groupIncomes(incomes: any[]): CategoryIncomeGroup[] {
  const groupedMap = new Map<number, CategoryIncomeGroup>();

  incomes.forEach((inc: any) => {
    const catId = inc.categoryIncome?.id || 0;
    const catName = inc.categoryIncome?.name || "Sin Categoría de Ingreso";

    if (!groupedMap.has(catId)) {
      groupedMap.set(catId, {
        id_category_income: catId,
        name_category_income: catName,
        incomes: [],
      });
    }

    const group = groupedMap.get(catId)!;
    if (!group.incomes.find((item) => item.id === inc.id)) {
      group.incomes.push({
        id: inc.id,
        name: inc.name,
        amount: Number(inc.amount || 0),
        comentary: inc.comentary || "",
        date: inc.date ? String(inc.date).split("T")[0] : "",
        isPayed: Boolean(inc.isPayed),
      });
    }
  });

  return Array.from(groupedMap.values());
}

export default function WrapSections({ filters = {} }: WrapSectionsProps) {
  const { user } = useAuth();
  const currentUserId = user?.id || 1;

  const movementType = filters.movementType || "all";
  const showSpends = movementType === "all" || movementType === "spend";
  const showIncomes = movementType === "all" || movementType === "income";

  const [infoLoad, setInfoLoad] = useState<LoadInfo[]>([]);
  const [incomeGroups, setIncomeGroups] = useState<CategoryIncomeGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Paginación de Gastos
  const limit = 10;
  const [spendOffset, setSpendOffset] = useState(0);
  const [hasMoreSpends, setHasMoreSpends] = useState(true);
  const [fetchingMoreSpends, setFetchingMoreSpends] = useState(false);
  const [allSpends, setAllSpends] = useState<any[]>([]);

  // Paginación de Ingresos
  const [incomeOffset, setIncomeOffset] = useState(0);
  const [hasMoreIncomes, setHasMoreIncomes] = useState(true);
  const [fetchingMoreIncomes, setFetchingMoreIncomes] = useState(false);
  const [allIncomes, setAllIncomes] = useState<any[]>([]);

  const fetchSpends = useCallback(
    async (currentOffset: number, previousSpends: any[]) => {
      let query = `limit=${limit}&offset=${currentOffset}`;
      if (filters.categoryId) query += `&category=${filters.categoryId}`;
      if (filters.subcategoryId)
        query += `&subcategory=${filters.subcategoryId}`;
      if (filters.from) query += `&from=${filters.from}`;
      if (filters.until) query += `&until=${filters.until}`;
      if (filters.done) query += `&done=${filters.done}`;
      if (filters.role && filters.role !== "all")
        query += `&role=${filters.role}`;

      const res = await fetch(
        `${API_URL}/users/${currentUserId}/spends?${query}`
      );
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(
          errJson.error?.message ||
            errJson.message ||
            "Error al cargar los gastos."
        );
      }

      const json = await res.json();
      const newSpends = json.data || [];
      if (newSpends.length < limit) {
        setHasMoreSpends(false);
      }

      const merged =
        currentOffset === 0 ? newSpends : [...previousSpends, ...newSpends];
      setAllSpends(merged);
      setInfoLoad(groupSpends(merged, currentUserId));
    },
    [filters, currentUserId]
  );

  const fetchIncomes = useCallback(
    async (currentOffset: number, previousIncomes: any[]) => {
      let query = `limit=${limit}&offset=${currentOffset}`;
      if (filters.categoryIncomeId)
        query += `&categoryIncome=${filters.categoryIncomeId}`;
      if (filters.from) query += `&from=${filters.from}`;
      if (filters.until) query += `&until=${filters.until}`;
      if (filters.done) query += `&isPayed=${filters.done}`;

      const res = await fetch(
        `${API_URL}/users/${currentUserId}/incomes?${query}`
      );
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(
          errJson.error?.message ||
            errJson.message ||
            "Error al cargar los ingresos."
        );
      }

      const json = await res.json();
      const newIncomes = json.data || [];
      if (newIncomes.length < limit) {
        setHasMoreIncomes(false);
      }

      const merged =
        currentOffset === 0 ? newIncomes : [...previousIncomes, ...newIncomes];
      setAllIncomes(merged);
      setIncomeGroups(groupIncomes(merged));
    },
    [filters, currentUserId]
  );

  useEffect(() => {
    if (!currentUserId) return;

    setAllSpends([]);
    setInfoLoad([]);
    setSpendOffset(0);
    setHasMoreSpends(showSpends);

    setAllIncomes([]);
    setIncomeGroups([]);
    setIncomeOffset(0);
    setHasMoreIncomes(showIncomes);

    setError("");
    setLoading(true);

    const tasks: Promise<void>[] = [];
    if (showSpends) tasks.push(fetchSpends(0, []));
    if (showIncomes) tasks.push(fetchIncomes(0, []));

    Promise.all(tasks)
      .catch((err: any) => {
        console.error(err);
        setError(err?.message || "No se pudieron cargar los movimientos.");
      })
      .finally(() => setLoading(false));
  }, [filters, currentUserId, showSpends, showIncomes, fetchSpends, fetchIncomes]);

  const handleLoadMoreSpends = async () => {
    const nextOffset = spendOffset + limit;
    setSpendOffset(nextOffset);
    setFetchingMoreSpends(true);
    try {
      await fetchSpends(nextOffset, allSpends);
    } catch (err: any) {
      setError(err?.message || "Error al cargar más gastos.");
    } finally {
      setFetchingMoreSpends(false);
    }
  };

  const handleLoadMoreIncomes = async () => {
    const nextOffset = incomeOffset + limit;
    setIncomeOffset(nextOffset);
    setFetchingMoreIncomes(true);
    try {
      await fetchIncomes(nextOffset, allIncomes);
    } catch (err: any) {
      setError(err?.message || "Error al cargar más ingresos.");
    } finally {
      setFetchingMoreIncomes(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Cargando movimientos...</p>;
  }

  if (error && infoLoad.length === 0 && incomeGroups.length === 0) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  if (infoLoad.length === 0 && incomeGroups.length === 0) {
    return (
      <p className="text-center mt-10 text-slate-500">
        No tienes movimientos registrados.
      </p>
    );
  }

  return (
    <section className="w-11/12 mx-auto mt-10 mb-8 flex flex-col gap-8">
      {showSpends && infoLoad.length > 0 && (
        <div className="flex flex-col gap-4">
          {movementType === "all" && (
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
              Gastos
            </h2>
          )}
          <div className="grid grid-cols-1 gap-3">
            {infoLoad.map((value) => (
              <CategoryMovement key={value.id_category} category={value} />
            ))}
          </div>

          {hasMoreSpends && (
            <button
              onClick={handleLoadMoreSpends}
              disabled={fetchingMoreSpends}
              className="mx-auto mt-2 rounded-lg bg-cyan-700 px-6 py-2 text-sm text-white transition-colors hover:bg-cyan-900 disabled:bg-slate-400"
            >
              {fetchingMoreSpends ? "Cargando..." : "Cargar más gastos"}
            </button>
          )}
        </div>
      )}

      {showIncomes && incomeGroups.length > 0 && (
        <div className="flex flex-col gap-4">
          {movementType === "all" && (
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-600/80">
              Ingresos
            </h2>
          )}
          <div className="grid grid-cols-1 gap-3">
            {incomeGroups.map((group) => (
              <CategoryIncomeMovement
                key={group.id_category_income}
                group={group}
              />
            ))}
          </div>

          {hasMoreIncomes && (
            <button
              onClick={handleLoadMoreIncomes}
              disabled={fetchingMoreIncomes}
              className="mx-auto mt-2 rounded-lg bg-emerald-700 px-6 py-2 text-sm text-white transition-colors hover:bg-emerald-900 disabled:bg-slate-400"
            >
              {fetchingMoreIncomes ? "Cargando..." : "Cargar más ingresos"}
            </button>
          )}
        </div>
      )}
    </section>
  );
}

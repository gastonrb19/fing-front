import { useEffect, useState, useCallback } from "react";
import CategoryMovement from "./CategoryMovement";

export interface MovementItem {
  nro: number;
  description: string;
  amount: number;
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
const CURRENT_USER_ID = 1; // TODO: Cambiar por contexto de Auth

interface WrapSectionsProps {
  filters?: any;
}

export default function WrapSections({ filters = {} }: WrapSectionsProps) {
  const [infoLoad, setInfoLoad] = useState<LoadInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Paginación
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const [hasMore, setHasMore] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);

  // Mantenemos una lista plana de todos los gastos cargados para reagruparlos fácilmente
  const [allSpends, setAllSpends] = useState<any[]>([]);

  const fetchSpends = useCallback(async (currentOffset: number) => {
    try {
      currentOffset === 0 ? setLoading(true) : setFetchingMore(true);
      
      
      // Armar query params dinámicos
      let query = `limit=${limit}&offset=${currentOffset}`;
      if (filters.categoryId) query += `&category=${filters.categoryId}`;
      if (filters.subcategoryId) query += `&subcategory=${filters.subcategoryId}`;
      if (filters.from) query += `&from=${filters.from}`;
      if (filters.until) query += `&until=${filters.until}`;
      if (filters.done) query += `&done=${filters.done}`;
      if (filters.role && filters.role !== 'all') query += `&role=${filters.role}`;

      const res = await fetch(`${API_URL}/users/${CURRENT_USER_ID}/spends?${query}`);

      if (!res.ok) throw new Error("Error fetching spends");
      const json = await res.json();
      
      const newSpends = json.data || [];
      
      if (newSpends.length < limit) {
        setHasMore(false); // Ya no hay más páginas en el backend
      }

      // Fusionar los gastos antiguos con los nuevos que acaban de llegar
      const mergedSpends = currentOffset === 0 ? newSpends : [...allSpends, ...newSpends];
      setAllSpends(mergedSpends);

      // Reagrupar toda la información
      const groupedMap = new Map<number, LoadInfo>();

      mergedSpends.forEach((spend: any) => {
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

        let subcategory = category.subcategories.find((s) => s.id_subcategory === subId);
        if (!subcategory) {
          subcategory = {
            id_subcategory: subId,
            name_subcategory: subName,
            movements: [],
          };
          category.subcategories.push(subcategory);
        }

        // Evitar duplicados si por alguna razón la BD manda el mismo ID
        if (!subcategory.movements.find(m => m.nro === spend.id)) {
            subcategory.movements.push({
              nro: spend.id,
              description: spend.name,
              amount: spend.amount,
              date: spend.startPayment ? spend.startPayment.split("T")[0] : "",
              paidInstallments: spend.paidInstallments || 0,
              totalInstallments: spend.totalInstallment || 1,
            });
        }
      });

      setInfoLoad(Array.from(groupedMap.values()));
      
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los movimientos.");
    } finally {
      setLoading(false);
      setFetchingMore(false);
    }
  }, [allSpends, filters]);

  
  useEffect(() => {
    // Limpiar fantasmas de la UI y errores viejos al cambiar el filtro
    setAllSpends([]);
    setInfoLoad([]);
    setError("");
    fetchSpends(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);


  const handleLoadMore = () => {
    const nextOffset = offset + limit;
    setOffset(nextOffset);
    fetchSpends(nextOffset);
  };

  if (loading && offset === 0) {
    return <p className="text-center mt-10">Cargando movimientos...</p>;
  }

  if (error && offset === 0) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  if (infoLoad.length === 0) {
    return <p className="text-center mt-10 text-slate-500">No tienes movimientos registrados.</p>;
  }

  return (
    <section className="w-11/12 mx-auto mt-10 mb-40 flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-3">
        {infoLoad.map((value) => (
          <CategoryMovement key={value.id_category} category={value} />
        ))}
      </div>
      
      {hasMore && (
        <button 
          onClick={handleLoadMore}
          disabled={fetchingMore}
          className="mx-auto mt-4 rounded-lg bg-cyan-700 px-6 py-2 text-white transition-colors hover:bg-cyan-900 disabled:bg-slate-400"
        >
          {fetchingMore ? "Cargando..." : "Cargar más movimientos"}
        </button>
      )}
    </section>
  );
}

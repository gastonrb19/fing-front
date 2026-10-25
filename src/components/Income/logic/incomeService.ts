import { API_URL } from "../../../utils/api";

export interface IncomeFormData {
  categoryIncomeId: string;
  name: string;
  amount: string;
  date: string;
  comentary: string;
  isPayed: boolean;
}

export async function fetchUserIncomes(userId: number): Promise<any[]> {
  const res = await fetch(`${API_URL}/users/${userId}/incomes?limit=1000`);
  if (!res.ok) return [];
  const json = await res.json().catch(() => ({}));
  return json.data || [];
}

export async function fetchIncomeById(id: string): Promise<IncomeFormData> {
  const res = await fetch(`${API_URL}/incomes/${id}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err.error?.message || err.message || "No se encontró el ingreso."
    );
  }
  const json = await res.json();
  const data = json.data || json;

  return {
    categoryIncomeId: String(data?.categoryIncome?.id ?? ""),
    name: data?.name || "",
    amount: data?.amount !== undefined ? String(data.amount) : "",
    date: data?.date ? String(data.date).split("T")[0] : "",
    comentary: data?.comentary || "",
    isPayed: Boolean(data?.isPayed),
  };
}

export async function saveIncome(
  id: string | null,
  userId: number,
  formData: IncomeFormData
): Promise<IncomeFormData> {
  const isEditMode = Boolean(id);
  const url = isEditMode
    ? `${API_URL}/incomes/${id}`
    : `${API_URL}/incomes`;
  const method = isEditMode ? "PUT" : "POST";

  const cleanName = formData.name.trim();
  const cleanComentary = formData.comentary.trim();
  const numericAmount = Number(formData.amount);
  const selectedCategoryId = Number(formData.categoryIncomeId);

  const payload = isEditMode
    ? {
        income: {
          name: cleanName,
          amount: numericAmount,
          comentary: cleanComentary,
          date: formData.date,
          isPayed: formData.isPayed,
          categoryIncomeId: selectedCategoryId,
        },
      }
    : {
        name: cleanName,
        amount: numericAmount,
        comentary: cleanComentary || undefined,
        date: formData.date,
        isPayed: formData.isPayed,
        userId,
        categoryIncomeId: selectedCategoryId,
      };

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok && res.status !== 201) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err.error?.message || err.message || "Error al guardar el ingreso."
    );
  }

  const json = await res.json();
  const saved = json.data || json;

  return {
    categoryIncomeId: String(
      saved?.categoryIncome?.id ?? formData.categoryIncomeId ?? ""
    ),
    name: saved?.name ?? cleanName,
    amount:
      saved?.amount !== undefined ? String(saved.amount) : formData.amount,
    date: saved?.date ? String(saved.date).split("T")[0] : formData.date,
    comentary: saved?.comentary ?? cleanComentary,
    isPayed:
      saved?.isPayed !== undefined ? Boolean(saved.isPayed) : formData.isPayed,
  };
}

export async function deleteIncomeById(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/incomes/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err.error?.message || err.message || "Error al eliminar el ingreso."
    );
  }
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

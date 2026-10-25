const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface CategoryIncomeFormData {
  name: string;
  description: string;
}

export async function fetchAllCategoryIncomes(): Promise<any[]> {
  const res = await fetch(`${API_URL}/category-incomes?limit=1000`);
  if (!res.ok) return [];
  const json = await res.json().catch(() => ({}));
  return json.data || [];
}

export async function fetchCategoryIncomeById(
  id: string
): Promise<CategoryIncomeFormData> {
  const res = await fetch(`${API_URL}/category-incomes/${id}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err.error?.message ||
        err.message ||
        "No se encontró la categoría de ingreso."
    );
  }
  const json = await res.json();
  const data = json.data || json;
  return {
    name: data?.name || "",
    description: data?.description || "",
  };
}

export async function saveCategoryIncome(
  id: string | null,
  formData: CategoryIncomeFormData
): Promise<CategoryIncomeFormData> {
  const isEditMode = Boolean(id);
  const url = isEditMode
    ? `${API_URL}/category-incomes/${id}`
    : `${API_URL}/category-incomes`;
  const method = isEditMode ? "PUT" : "POST";

  const cleanName = formData.name.trim();
  const cleanDescription = formData.description.trim();

  const payload = isEditMode
    ? {
        categoryIncome: {
          name: cleanName,
          description: cleanDescription || undefined,
        },
      }
    : {
        name: cleanName,
        description: cleanDescription || undefined,
      };

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok && res.status !== 201) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err.error?.message ||
        err.message ||
        "Error al guardar la categoría de ingreso."
    );
  }

  const json = await res.json();
  const saved = json.data || json;

  return {
    name: saved?.name ?? cleanName,
    description: saved?.description ?? cleanDescription,
  };
}

export async function deleteCategoryIncomeById(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/category-incomes/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err.error?.message ||
        err.message ||
        "Error al eliminar la categoría de ingreso."
    );
  }
}

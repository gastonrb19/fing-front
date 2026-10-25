const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface CategoryFormData {
  name: string;
  description: string;
}

export async function fetchCategoryById(id: string): Promise<CategoryFormData> {
  const res = await fetch(`${API_URL}/categories/${id}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err.error?.message || err.message || "No se encontró la categoría."
    );
  }
  const json = await res.json();
  const data = json.data || json;
  return {
    name: data?.name || "",
    description: data?.description || "",
  };
}

export async function saveCategory(
  id: string | null,
  formData: CategoryFormData
): Promise<CategoryFormData> {
  const isEditMode = Boolean(id);
  const url = isEditMode
    ? `${API_URL}/categories/${id}`
    : `${API_URL}/categories`;
  const method = isEditMode ? "PUT" : "POST";

  const cleanName = formData.name.trim();
  const cleanDescription = formData.description.trim();

  const payload = isEditMode
    ? {
        category: {
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
      err.error?.message || err.message || "Error al guardar la categoría."
    );
  }

  const json = await res.json();
  const saved = json.data || json;

  return {
    name: saved?.name ?? cleanName,
    description: saved?.description ?? cleanDescription,
  };
}

export async function deleteCategoryById(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/categories/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err.error?.message || err.message || "Error al eliminar la categoría."
    );
  }
}

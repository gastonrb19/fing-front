import { API_URL } from "../../../utils/api";

export interface SubcategoryFormData {
  categoryId: string;
  name: string;
  description: string;
}

export async function fetchAllCategories(): Promise<any[]> {
  const res = await fetch(`${API_URL}/categories?limit=100`);
  if (!res.ok) return [];
  const json = await res.json().catch(() => ({}));
  return json.data || [];
}

export async function fetchSubcategoriesByCategory(
  categoryId: string
): Promise<any[]> {
  if (!categoryId) return [];
  const res = await fetch(`${API_URL}/categories/${categoryId}/subcategories?limit=100`);
  if (!res.ok) return [];
  const json = await res.json().catch(() => ({}));
  return json.data || [];
}

export async function fetchSubcategoryById(
  idSubcategory: string,
  fallbackCategoryId?: string
): Promise<SubcategoryFormData> {
  const res = await fetch(`${API_URL}/subcategories/${idSubcategory}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err.error?.message ||
        err.message ||
        "No se encontró la subcategoría."
    );
  }
  const json = await res.json();
  const data = json.data || json;
  return {
    categoryId: String(data?.category?.id ?? fallbackCategoryId ?? ""),
    name: data?.name || "",
    description: data?.description || "",
  };
}

export async function saveSubcategory(
  idSubcategory: string | undefined,
  fallbackCategoryId: string | undefined,
  formData: SubcategoryFormData
): Promise<SubcategoryFormData> {
  const isEditMode = Boolean(idSubcategory);
  const url = isEditMode
    ? `${API_URL}/subcategories/${idSubcategory}`
    : `${API_URL}/subcategories`;
  const method = isEditMode ? "PUT" : "POST";

  // Regla de Arquitectura: Extraer categoryId directamente desde el estado de React
  const selectedCategoryId = Number(formData.categoryId || fallbackCategoryId);
  const cleanName = formData.name.trim();
  const cleanDescription = formData.description.trim();

  const payload = isEditMode
    ? {
        subcategory: {
          name: cleanName,
          description: cleanDescription || undefined,
          categoryId: selectedCategoryId,
        },
      }
    : {
        name: cleanName,
        description: cleanDescription || undefined,
        categoryId: selectedCategoryId,
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
        "Error al guardar la subcategoría."
    );
  }

  const json = await res.json();
  const saved = json.data || json;

  return {
    categoryId: String(
      saved?.category?.id ?? formData.categoryId ?? fallbackCategoryId ?? ""
    ),
    name: saved?.name ?? cleanName,
    description: saved?.description ?? cleanDescription,
  };
}

export async function deleteSubcategoryById(
  idSubcategory: string
): Promise<void> {
  const res = await fetch(`${API_URL}/subcategories/${idSubcategory}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err.error?.message ||
        err.message ||
        "Error al eliminar la subcategoría."
    );
  }
}

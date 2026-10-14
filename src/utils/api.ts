export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Interceptor global de fetch:
 * Asegura que todas las llamadas dirigidas al backend de Fing incluyan siempre
 * credentials: "include" para enviar y recibir la cookie HTTP-Only de sesión (JWT).
 */
const originalFetch = window.fetch;

window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const urlStr =
    typeof input === "string"
      ? input
      : input instanceof URL
      ? input.toString()
      : input.url;

  const isBackendRequest =
    urlStr.startsWith(API_URL) ||
    urlStr.startsWith("http://localhost:8000") ||
    urlStr.startsWith("http://127.0.0.1:8000");

  if (isBackendRequest) {
    init = {
      ...init,
      credentials: init?.credentials || "include",
    };
  }

  return originalFetch(input, init);
};

/**
 * Helper para realizar llamadas directas a la API
 */
export async function apiFetch<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
  const headers = new Headers(options.headers || {});
  
  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  if (!response.ok) {
    let errorData: any = {};
    if (isJson) {
      try {
        errorData = await response.json();
      } catch {
        errorData = {};
      }
    }
    const message = errorData.error?.message || errorData.message || `Error en la solicitud (${response.status})`;
    throw new Error(message);
  }

  if (isJson) {
    return (await response.json()) as T;
  }
  return (await response.text()) as unknown as T;
}

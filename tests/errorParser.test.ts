import { test } from "node:test";
import assert from "node:assert";

/**
 * Función pura de parseo seguro de errores según la regla de arquitectura del Frontend:
 * Extrae siempre el mensaje priorizando la ruta anidada: err.error?.message || err.message
 * y previene caídas si la respuesta es HTML.
 */
export function parseErrorMessage(errorPayload: any, defaultFallback = "Error de red inesperado"): string {
  if (!errorPayload) return defaultFallback;

  if (typeof errorPayload === "string") {
    // Si el backend devolvió HTML (ej. un 404/500 de Express sin manejar)
    if (errorPayload.trim().startsWith("<") || errorPayload.includes("<!DOCTYPE")) {
      return defaultFallback;
    }
    return errorPayload;
  }

  return (
    errorPayload.error?.message ||
    errorPayload.message ||
    defaultFallback
  );
}

test("Parseo seguro de errores del Backend (GEMINI.md Rule)", (t) => {
  t.test("Prioriza err.error?.message si viene estructura anidada", () => {
    const payload = {
      error: {
        code: 401,
        message: "No autorizado: Debes iniciar sesión"
      }
    };
    assert.strictEqual(parseErrorMessage(payload), "No autorizado: Debes iniciar sesión");
  });

  t.test("Usa err.message si no hay objeto error anidado", () => {
    const payload = {
      message: "Credenciales inválidas"
    };
    assert.strictEqual(parseErrorMessage(payload), "Credenciales inválidas");
  });

  t.test("Previene caída y devuelve fallback si el backend devolvió HTML", () => {
    const htmlResponse = "<!DOCTYPE html><html lang='en'><head><title>Error</title></head><body>Cannot GET /unknown</body></html>";
    assert.strictEqual(parseErrorMessage(htmlResponse), "Error de red inesperado");
  });

  t.test("Devuelve fallback si el payload es nulo o indefinido", () => {
    assert.strictEqual(parseErrorMessage(null), "Error de red inesperado");
    assert.strictEqual(parseErrorMessage(undefined), "Error de red inesperado");
  });
});

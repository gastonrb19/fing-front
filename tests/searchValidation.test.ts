import { test } from "node:test";
import assert from "node:assert";

/**
 * Lógica pura de parseo y validación de búsqueda de movimientos
 */
export function sanitizeSearchId(input: string): { isValid: boolean; id: number | null } {
  const trimmed = input.trim().replace(/^@+/, ""); // Quitar @ por compatibilidad si el usuario lo escribe
  if (!trimmed || !/^\d+$/.test(trimmed)) {
    return { isValid: false, id: null };
  }
  const numericId = parseInt(trimmed, 10);
  if (isNaN(numericId) || numericId <= 0) {
    return { isValid: false, id: null };
  }
  return { isValid: true, id: numericId };
}

test("Validación y sanitización del campo de Búsqueda", (t) => {
  t.test("Acepta IDs numéricos positivos válidos", () => {
    assert.deepStrictEqual(sanitizeSearchId("42"), { isValid: true, id: 42 });
    assert.deepStrictEqual(sanitizeSearchId("1"), { isValid: true, id: 1 });
  });

  t.test("Limpia prefijo @ si el usuario lo ingresa", () => {
    assert.deepStrictEqual(sanitizeSearchId("@15"), { isValid: true, id: 15 });
  });

  t.test("Rechaza caracteres no numéricos o vacíos", () => {
    assert.deepStrictEqual(sanitizeSearchId(""), { isValid: false, id: null });
    assert.deepStrictEqual(sanitizeSearchId("   "), { isValid: false, id: null });
    assert.deepStrictEqual(sanitizeSearchId("abc"), { isValid: false, id: null });
    assert.deepStrictEqual(sanitizeSearchId("12a"), { isValid: false, id: null });
    assert.deepStrictEqual(sanitizeSearchId("-5"), { isValid: false, id: null });
  });
});

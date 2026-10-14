import { test } from "node:test";
import assert from "node:assert";

/**
 * Lógica pura de decisión de navegación de ProtectedRoute
 */
export function evaluateRouteAccess(
  user: { id: number; username: string } | null,
  loading: boolean
): { allowed: boolean; redirectTo?: string; isLoading: boolean } {
  if (loading) {
    return { allowed: false, isLoading: true };
  }
  if (!user) {
    return { allowed: false, redirectTo: "/login", isLoading: false };
  }
  return { allowed: true, isLoading: false };
}

test("Lógica de protección de rutas (ProtectedRoute)", (t) => {
  t.test("Mantiene estado de carga mientras se valida la sesión", () => {
    const result = evaluateRouteAccess(null, true);
    assert.strictEqual(result.allowed, false);
    assert.strictEqual(result.isLoading, true);
    assert.strictEqual(result.redirectTo, undefined);
  });

  t.test("Redirige a /login cuando no hay usuario y ya terminó de cargar", () => {
    const result = evaluateRouteAccess(null, false);
    assert.strictEqual(result.allowed, false);
    assert.strictEqual(result.isLoading, false);
    assert.strictEqual(result.redirectTo, "/login");
  });

  t.test("Permite el acceso a la ruta cuando el usuario está autenticado", () => {
    const user = { id: 1, username: "gaston" };
    const result = evaluateRouteAccess(user, false);
    assert.strictEqual(result.allowed, true);
    assert.strictEqual(result.isLoading, false);
    assert.strictEqual(result.redirectTo, undefined);
  });
});

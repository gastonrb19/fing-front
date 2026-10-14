import { test } from "node:test";
import assert from "node:assert";

/**
 * Lógica pura de filtrado y procesamiento de pagos rechazados
 */
export function filterPendingRejectedPayments(payments: any[]) {
  if (!Array.isArray(payments)) return [];
  return payments.filter((p) => p.rejected === true && !p.paymentDone);
}

export function formatAssumedDebtMessage(spendName: string, friendName: string, amount: number): string {
  return `${friendName} rechazó la cuota de $${amount.toLocaleString("es-CL")} en '${spendName}'. La deuda retornó a tu responsabilidad.`;
}

test("Gestión y auditoría de cuotas rechazadas para el Creador", (t) => {
  const mockPayments = [
    {
      idPayment: "pay-1",
      assignedAmount: 10000,
      paymentDone: false,
      rejected: true,
      user: { id: 2, username: "AmigoDePrueba" },
      assumedByUser: { id: 1, username: "gaston" },
    },
    {
      idPayment: "pay-2",
      assignedAmount: 15000,
      paymentDone: true, // Ya fue pagada por el creador
      rejected: true,
      user: { id: 3, username: "TercerAmigo" },
      assumedByUser: { id: 1, username: "gaston" },
    },
    {
      idPayment: "pay-3",
      assignedAmount: 8000,
      paymentDone: false,
      rejected: false, // Cuota normal pendiente
      user: { id: 2, username: "AmigoDePrueba" },
    },
  ];

  t.test("Filtra únicamente las cuotas rechazadas que sigan pendientes de pago", () => {
    const pending = filterPendingRejectedPayments(mockPayments);
    assert.strictEqual(pending.length, 1);
    assert.strictEqual(pending[0].idPayment, "pay-1");
    assert.strictEqual(pending[0].user.username, "AmigoDePrueba");
  });

  t.test("Genera mensaje descriptivo de responsabilidad asumida", () => {
    const msg = formatAssumedDebtMessage("Pizza con Amigos", "AmigoDePrueba", 10000);
    assert.match(msg, /AmigoDePrueba rechazó la cuota de \$10\.000/);
    assert.match(msg, /Pizza con Amigos/);
    assert.match(msg, /La deuda retornó a tu responsabilidad/);
  });
});

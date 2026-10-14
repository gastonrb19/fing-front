import { test } from "node:test";
import assert from "node:assert";

/**
 * Lógica pura de cálculo de cuotas y particiones de gasto
 * utilizada en SplitParticipantsSelector y NewMovementForm
 */
export function calculateEqualSplits(participants: { userId: number; percentage: number }[]) {
  if (participants.length === 0) return [];
  const equalPercentage = Number((100 / participants.length).toFixed(2));
  return participants.map((p, idx) => {
    // Si la división tiene decimales (ej 3 personas: 33.33 + 33.33 + 33.34 = 100)
    if (idx === participants.length - 1) {
      const currentSum = equalPercentage * (participants.length - 1);
      return { ...p, percentage: Number((100 - currentSum).toFixed(2)) };
    }
    return { ...p, percentage: equalPercentage };
  });
}

export function calculateInstallmentPerPerson(
  totalAmount: number,
  percentage: number,
  totalInstallments: number
): number {
  if (totalInstallments <= 0) return 0;
  const userTotal = (totalAmount * percentage) / 100;
  return Math.round(userTotal / totalInstallments);
}

export function validateTotalPercentage(percentages: number[]): { valid: boolean; total: number } {
  const total = Number(percentages.reduce((sum, p) => sum + p, 0).toFixed(2));
  const valid = Math.abs(total - 100) < 0.05;
  return { valid, total };
}

test("Cálculo de particiones equitativas (SplitParticipantsSelector)", (t) => {
  t.test("Divide en partes iguales para 2 participantes", () => {
    const participants = [{ userId: 1, percentage: 100 }, { userId: 2, percentage: 0 }];
    const result = calculateEqualSplits(participants);
    assert.strictEqual(result[0].percentage, 50);
    assert.strictEqual(result[1].percentage, 50);
    assert.strictEqual(result[0].percentage + result[1].percentage, 100);
  });

  t.test("Divide en partes iguales para 3 participantes ajustando remanente decimal", () => {
    const participants = [
      { userId: 1, percentage: 0 },
      { userId: 2, percentage: 0 },
      { userId: 3, percentage: 0 },
    ];
    const result = calculateEqualSplits(participants);
    assert.strictEqual(result[0].percentage, 33.33);
    assert.strictEqual(result[1].percentage, 33.33);
    assert.strictEqual(result[2].percentage, 33.34);
    const sum = result.reduce((s, p) => s + p.percentage, 0);
    assert.strictEqual(Number(sum.toFixed(2)), 100);
  });

  t.test("Calcula correctamente el valor por cuota individual", () => {
    // Total 120.000, 50% = 60.000, en 3 cuotas = 20.000 por cuota
    const perQuota = calculateInstallmentPerPerson(120000, 50, 3);
    assert.strictEqual(perQuota, 20000);
  });

  t.test("Validación de tolerancia de 100%", () => {
    assert.strictEqual(validateTotalPercentage([50, 50]).valid, true);
    assert.strictEqual(validateTotalPercentage([33.33, 33.33, 33.34]).valid, true);
    assert.strictEqual(validateTotalPercentage([50, 49]).valid, false);
    assert.strictEqual(validateTotalPercentage([60, 50]).valid, false);
  });
});

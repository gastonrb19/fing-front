"use client";

import { useState } from "react";
import CardIncome, { type IncomeCardItem } from "./CardIncome";

export interface CategoryIncomeGroup {
  id_category_income: number;
  name_category_income: string;
  incomes: IncomeCardItem[];
}

interface CategoryIncomeMovementProps {
  group: CategoryIncomeGroup;
}

export default function CategoryIncomeMovement({
  group,
}: CategoryIncomeMovementProps) {
  const [displayIncomes, setDisplayIncomes] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 border-b border-emerald-200 pb-1">
        <h3
          className="hover:cursor-pointer text-xl font-bold text-emerald-700 hover:text-emerald-600 transition-colors duration-200"
          onClick={() => setDisplayIncomes(!displayIncomes)}
        >
          {group.name_category_income}
        </h3>
        <button
          type="button"
          onClick={() => setDisplayIncomes(!displayIncomes)}
          className="text-sm text-gray-500 hover:text-emerald-600 transition-colors duration-200 cursor-pointer"
          aria-label={displayIncomes ? "Colapsar ingresos" : "Expandir ingresos"}
        >
          {displayIncomes ? "−" : "+"}
        </button>
      </div>

      <div className={displayIncomes ? "flex flex-col gap-2 pt-1" : "hidden"}>
        {group.incomes.map((inc) => (
          <CardIncome
            key={inc.id}
            id={inc.id}
            name={inc.name}
            amount={inc.amount}
            comentary={inc.comentary}
            date={inc.date}
            isPayed={inc.isPayed}
          />
        ))}
      </div>
    </div>
  );
}

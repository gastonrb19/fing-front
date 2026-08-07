'use client';
import type { SubcategoryInfo } from "./WrapSections";
import CardMovement from "./CardMovement";
import { useState } from "react";

interface SubcategoryMovementProps {
  subcategory: SubcategoryInfo;
}

export default function SubcategoryMovement({ subcategory }: SubcategoryMovementProps) {
  const [displaySubcategory, setDisplaySubcategory] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <h4
          className="hover:cursor-pointer text-lg font-semibold text-gray-700 hover:text-cyan-600 transition-colors duration-200 underline-offset-2 hover:underline"
          onClick={() => setDisplaySubcategory(!displaySubcategory)}
        >
          {subcategory.name_subcategory}
        </h4>
        <button
          type="button"
          onClick={() => setDisplaySubcategory(!displaySubcategory)}
          className="text-sm text-gray-500 hover:text-cyan-600 transition-colors duration-200"
          aria-label={displaySubcategory ? "Collapse subcategory" : "Expand subcategory"}
        >
          {displaySubcategory ? "−" : "+"}
        </button>
      </div>
      <div className={`${displaySubcategory ? "flex flex-col gap-2" : "hidden"}`}>
      {subcategory.movements.map((movement) => (
        <CardMovement
          key={movement.nro}
          nro={movement.nro}
          description={movement.description}
          amount={movement.amount}
          date={movement.date}
        />
      ))}
      </div>
    </div>
  );
}
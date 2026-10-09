"use client";
import FilterDocument from "./FilterMovements";
import { useState } from "react";
import TitleMovements from "./TitleMovements";
import WrapSections from "./WrapSections";

export default function Movements() {
  const [displayFilter, setDisplayFilter] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});

  return (
    <>
      <TitleMovements
        setDisplayFilter={setDisplayFilter}
        displayFilter={displayFilter}
      />
      <FilterDocument
        displayFilter={displayFilter}
        setDisplayFilter={setDisplayFilter}
        onFilter={(filters) => setActiveFilters(filters)}
      />
      <WrapSections filters={activeFilters} />
    </>
  );
}

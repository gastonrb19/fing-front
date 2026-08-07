"use client";
import Menu from "../Menu";
import FilterDocument from "./FilterMovements";
import { useState } from "react";
import TitleMovements from "./TitleMovements";
import WrapSections from "./WrapSections";

export default function Movements() {
  const [displayFilter, setDisplayFilter] = useState(false);
  return (
    <>
      <TitleMovements
        setDisplayFilter={setDisplayFilter}
        displayFilter={displayFilter}
      />
      <FilterDocument
        displayFilter={displayFilter}
        setDisplayFilter={setDisplayFilter}
      />
      <WrapSections/>
      <Menu />
    </>
  );
}

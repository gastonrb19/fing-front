"use client";
import { useState } from "react";
import ItemMenu from "./ItemMenu";

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-[30px] left-1/2 -translate-x-1/2 z-10 flex flex-col items-center bg-white rounded-b-lg shadow-md overflow-hidden w-[170px]">
      <nav
        className={`flex flex-col items-center w-full ${isOpen ? "block" : "hidden"} z-20`}
      >
        <ul className="flex flex-col items-center w-full">
          <ItemMenu title="Home" url="/home" />
          <ItemMenu title="Transacción" url="/transactions" />
          <ItemMenu title="Movimientos" url="/movements" />
        </ul>
      </nav>
      <button
        className="w-full bg-cyan-700 text-white px-4 py-2 rounded-b-lg hover:bg-cyan-900 duration-300 text-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        Menu
      </button>
    </div>
  );
}

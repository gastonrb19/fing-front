"use client";
import { useEffect, useState } from "react";
import ItemMenu from "./ItemMenu";
import Search from "./Shared/Search";

export default function Menu() {
  const [hideMenu, setHideMenu] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isCtrlM = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "m";

      if (isCtrlM) {
        event.preventDefault();
        setHideMenu((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const itemClass =
    "block w-full px-4 py-2 text-center hover:border-cyan-700 border-x-1 border-transparent duration-300 hover:text-cyan-700 bg-white";

  return (
    <>
      <div
        className={`fixed bottom-[30px] left-1/2 z-40 flex w-[170px] -translate-x-1/2 flex-col items-center overflow-hidden rounded-b-lg bg-white shadow-md transition-all duration-1000 ease-in-out ${
          hideMenu ? "pointer-events-none translate-y-2 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <nav
          className={`z-20 flex w-full flex-col items-center ${isOpen ? "block" : "hidden"}`}
        >
          <ul className="flex w-full flex-col items-center">
            <ItemMenu title="Home" url="/" />
            <ItemMenu title="Movimiento" url="/new-movement" />
            <ItemMenu title="Movimientos" url="/movements" />
            <li className="w-full text-center">
              <button
                className={itemClass}
                onClick={() => {
                  setIsSearchOpen(true);
                  setIsOpen(false);
                }}
              >
                Búsqueda
              </button>
            </li>
          </ul>
        </nav>
        <button
          className="w-full rounded-b-lg bg-cyan-700 px-4 py-2 text-center text-white duration-300 hover:bg-cyan-900"
          onClick={() => setIsOpen(!isOpen)}
        >
          Menu
        </button>
      </div>

      <Search isOpen={isSearchOpen} setIsOpen={setIsSearchOpen} />
    </>
  );
}

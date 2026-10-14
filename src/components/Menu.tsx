"use client";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import ItemMenu from "./ItemMenu";
import Search from "./Shared/Search";
import { useAuth } from "../context/AuthContext";

export default function Menu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [hideMenu, setHideMenu] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // 1. Colapsar las opciones del menú automáticamente al cambiar de página
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // 2. Colapsar las opciones al hacer clic fuera del menú o presionar Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // 3. Atajo de teclado (Ctrl + M / Cmd + M) para ocultar o mostrar el menú flotante completo
  useEffect(() => {
    const handleToggleMenuVisibility = (event: KeyboardEvent) => {
      const isCtrlM = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "m";
      if (isCtrlM) {
        event.preventDefault();
        setHideMenu((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleToggleMenuVisibility);
    return () => window.removeEventListener("keydown", handleToggleMenuVisibility);
  }, []);

  if (location.pathname === "/login" || !user) {
    return null;
  }

  const itemClass =
    "block w-full px-4 py-2 text-center hover:border-cyan-700 border-x-1 border-transparent duration-300 hover:text-cyan-700 bg-white text-slate-700 text-sm font-medium cursor-pointer";

  return (
    <>
      <div
        ref={menuRef}
        className={`fixed bottom-[30px] left-1/2 z-40 flex w-[170px] -translate-x-1/2 flex-col items-center overflow-hidden rounded-2xl bg-white shadow-xl border border-slate-200 transition-all duration-500 ease-in-out ${
          hideMenu ? "pointer-events-none translate-y-20 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        {/* Opciones colapsables */}
        {isOpen && (
          <nav className="z-20 w-full flex flex-col items-center border-b border-slate-100 py-1 bg-white animate-fade-in">
            <ul className="flex w-full flex-col items-center">
              <ItemMenu title="Home" url="/" onClick={() => setIsOpen(false)} />
              <ItemMenu title="Movimiento" url="/new-movement" onClick={() => setIsOpen(false)} />
              <ItemMenu title="Movimientos" url="/movements" onClick={() => setIsOpen(false)} />
              <ItemMenu title="Amistades" url="/friendships" onClick={() => setIsOpen(false)} />
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
              {user ? (
                <>
                  <li className="w-full px-3 py-1.5 text-center text-xs font-semibold text-purple-700 bg-purple-50 border-t border-slate-100 truncate">
                    👤 {user.username}
                  </li>
                  <li className="w-full text-center">
                    <button
                      className="block w-full px-4 py-2 text-center text-xs text-rose-600 hover:bg-rose-50 font-medium transition-colors cursor-pointer"
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                    >
                      Cerrar sesión
                    </button>
                  </li>
                </>
              ) : (
                <ItemMenu title="Iniciar sesión" url="/login" onClick={() => setIsOpen(false)} />
              )}
            </ul>
          </nav>
        )}

        {/* Botón flotante para expandir/colapsar las opciones */}
        <button
          type="button"
          className="w-full bg-cyan-700 px-4 py-2.5 text-center text-sm font-semibold text-white duration-200 hover:bg-cyan-800 flex items-center justify-center gap-1.5 cursor-pointer select-none"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-label="Abrir o colapsar menú"
        >
          <span>Menu</span>
          <span
            className={`text-[10px] transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            ▲
          </span>
        </button>
      </div>

      <Search isOpen={isSearchOpen} setIsOpen={setIsSearchOpen} />
    </>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface SearchProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Search({ isOpen, setIsOpen }: SearchProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Resetear estados al abrir/cerrar
  useEffect(() => {
    if (isOpen) {
      setErrorMessage("");
    }
  }, [isOpen]);

  // Limpiar mensaje de error después de unos segundos
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Manejar atajos de teclado globales (Ctrl+F / Cmd+F / Esc)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "f") {
        event.preventDefault();
        setIsOpen(!isOpen);
      }
      
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const trimmed = query.trim();
    if (!trimmed) return;

    // Validación numérica estricta
    if (!/^\d+$/.test(trimmed)) {
      setErrorMessage("Por favor ingresa solo el número del movimiento (ej. 8).");
      return;
    }

    const movementId = trimmed;
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/spends/${movementId}`);
      if (res.ok) {
        const json = await res.json();
        if (json && (json.data || json.id)) {
          setIsOpen(false);
          setQuery("");
          setErrorMessage("");
          navigate(`/movement/${movementId}`);
          return;
        }
      }

      // Si no existe (404) o respuesta no exitosa
      setErrorMessage(`El movimiento #${movementId} no existe.`);
    } catch (error) {
      setErrorMessage("Error de conexión al buscar el movimiento.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity"
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="relative w-[90%] max-w-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute -top-10 right-0 text-white/80 hover:text-white text-xl font-bold transition-colors"
          aria-label="Cerrar búsqueda"
        >
          ✕
        </button>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="relative">
            <input
              type="number"
              min="1"
              autoFocus
              disabled={loading}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (errorMessage) setErrorMessage("");
              }}
              placeholder="Número de movimiento (ej. 8)..."
              className="w-full rounded-2xl border-2 border-cyan-500 bg-white px-6 py-4 pr-16 text-base md:text-lg text-slate-800 shadow-2xl focus:outline-none focus:ring-4 focus:ring-cyan-500/30 placeholder:text-slate-400 disabled:opacity-75 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-xl bg-cyan-700 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-800 disabled:opacity-40 transition-colors"
            >
              {loading ? "..." : "Ir →"}
            </button>
          </div>
        </form>

        {/* Mensaje breve si el movimiento no existe */}
        {errorMessage && (
          <div className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 shadow-md">
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <p className="mt-2 text-center text-xs text-white/70">
          Ingresa el número del movimiento y presiona Enter para abrirlo directamente.
        </p>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface SearchProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Search({ isOpen, setIsOpen }: SearchProps) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  // Handle Ctrl+F globally
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "f") {
        event.preventDefault(); // Prevent browser find
        setIsOpen(!isOpen);
      }
      
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (query.startsWith("@")) {
      const id = query.replace("@", "");
      navigate(`/movement/${id}`);
    } else {
      navigate(`/movements?text=${encodeURIComponent(query)}`);
    }
    
    setIsOpen(false);
    setQuery("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-[90%] max-w-2xl">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 text-xl font-bold"
        >
          X
        </button>
        <form onSubmit={handleSubmit} className="w-full">
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="@enter-command"
            className="w-full rounded-xl border-2 border-cyan-500 bg-white px-6 py-4 text-lg text-slate-800 shadow-2xl focus:outline-none focus:ring-4 focus:ring-cyan-500/30 placeholder:text-slate-400"
          />
        </form>
      </div>
    </div>
  );
}

"use client";
import { useNavigate, useLocation } from "react-router";

export default function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const hiddenRoutes = ["/", "/login"];
  if (hiddenRoutes.includes(location.pathname)) return null;

  return (
    <button
      onClick={() => navigate(-1)}
      className="fixed top-4 left-4 z-[60] flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-800 shadow-md transition-all opacity-50 hover:opacity-100 hover:bg-slate-100 hover:scale-105 active:scale-95 border border-slate-200"
      aria-label="Volver atrás"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke="currentColor"
        className="h-4 w-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 19.5L8.25 12l7.5-7.5"
        />
      </svg>
    </button>
  );
}

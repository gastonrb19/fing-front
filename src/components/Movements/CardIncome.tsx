"use client";

import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router";

export interface IncomeCardItem {
  id: number;
  name: string;
  amount: number;
  comentary?: string;
  date: string;
  isPayed: boolean;
}

export default function CardIncome({
  id,
  name,
  amount,
  comentary,
  date,
  isPayed,
}: IncomeCardItem) {
  const [displayCard, setDisplayCard] = useState(false);
  const navigate = useNavigate();

  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [translateX, setTranslateX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const wasSwiped = useRef(false);

  const SWIPE_THRESHOLD = 75;

  const handleStart = (clientX: number) => {
    setTouchStartX(clientX);
    setIsSwiping(true);
    wasSwiped.current = false;
  };

  const handleMove = (clientX: number) => {
    if (touchStartX === null) return;
    const diff = clientX - touchStartX;
    if (diff < 0) {
      setTranslateX(diff);
      if (Math.abs(diff) > 10) {
        wasSwiped.current = true;
      }
    }
  };

  const handleEnd = () => {
    if (touchStartX === null) return;
    setIsSwiping(false);

    if (translateX < -SWIPE_THRESHOLD) {
      setTranslateX(-500);
      setTimeout(() => {
        navigate(`/income/${id}`);
      }, 250);
    } else {
      setTranslateX(0);
    }
    setTouchStartX(null);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (wasSwiped.current) {
      e.stopPropagation();
      return;
    }
    setDisplayCard(!displayCard);
  };

  return (
    <article
      className={`relative w-full flex flex-col text-center shadow-xl p-2 rounded-b-xl bg-white border-t-2 hover:cursor-pointer select-none overflow-hidden ${
        displayCard ? "border-emerald-600" : "border-transparent"
      } ${!isSwiping ? "transition-transform duration-300 ease-out" : ""}`}
      style={{ transform: `translateX(${translateX}px)` }}
      onClick={handleClick}
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseMove={(e) => {
        if (isSwiping) handleMove(e.clientX);
      }}
      onMouseUp={handleEnd}
      onMouseLeave={() => {
        if (isSwiping) handleEnd();
      }}
    >
      <div className="w-full flex flex-row justify-between items-center px-1">
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-xl font-bold text-gray-800">
              <span className="font-bold px-0.5 text-emerald-600">#</span>
              {id}
            </h3>
            <span className="text-sm font-medium text-slate-700">{name}</span>
          </div>
          <span
            className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${
              isPayed ? "text-emerald-600" : "text-amber-600"
            }`}
          >
            {isPayed ? "Depositado" : "Pendiente"}
          </span>
        </div>

        <div className="text-right">
          <p className="italic font-semibold text-lg text-emerald-700">
            <span className="font-bold mr-0.5">+$</span>
            {Number(amount || 0).toLocaleString("es-CL")}
          </p>
        </div>
      </div>

      <div className={`mt-2 flex flex-col ${displayCard ? "block" : "hidden"}`}>
        {comentary && (
          <p className="italic text-center text-sm text-slate-600">
            {comentary}
          </p>
        )}
        <div className="flex justify-between items-end mt-4 px-1">
          <Link
            to={`/income/${id}`}
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            Ver detalle &rarr;
          </Link>
          <p className="text-sm text-gray-500">Fecha depósito: {date}</p>
        </div>
      </div>
    </article>
  );
}

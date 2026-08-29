"use client";
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router";

interface CardMovementProps {
  nro: number;
  description: string;
  amount: number;
  date: string;
}

export default function CardMovement({
  nro,
  description,
  amount,
  date,
}: CardMovementProps) {
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
    // Solo permitir deslizar hacia la izquierda
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
      setTranslateX(-500); // Animar salida de la pantalla
      setTimeout(() => {
        navigate(`/movement/${nro}`);
      }, 250);
    } else {
      setTranslateX(0); // Restaurar posición
    }
    setTouchStartX(null);
  };

  const handleTouchStart = (e: React.TouchEvent) => handleStart(e.touches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);
  const handleTouchEnd = () => handleEnd();

  const handleMouseDown = (e: React.MouseEvent) => handleStart(e.clientX);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isSwiping) handleMove(e.clientX);
  };
  const handleMouseUp = () => handleEnd();
  const handleMouseLeave = () => {
    if (isSwiping) handleEnd();
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
        displayCard ? "border-cyan-700" : "border-transparent"
      } ${!isSwiping ? "transition-transform duration-300 ease-out" : ""}`}
      style={{ transform: `translateX(${translateX}px)` }}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div className="w-full flex flex-row justify-between items-center">
        <h3 className="text-xl font-bold">
          <span className="font-bold px-0.5">#</span>
          {nro}
        </h3>
        <p className="italic">
          <span className="font-bold">$</span>
          {amount}
        </p>
      </div>
      <div className={`mt-2 flex flex-col ${displayCard ? "block" : "hidden"}`}>
        <p className="italic text-center">{description}</p>
        <div className="flex justify-between items-end mt-4 px-1">
          <Link
            to={`/movement/${nro}`}
            className="text-sm font-semibold text-cyan-600 hover:text-cyan-700 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            Ver detalle &rarr;
          </Link>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
      </div>
    </article>
  );
}

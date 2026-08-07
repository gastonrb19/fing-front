"use client";
import { useState } from "react";

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
  return (
    <article
      className={`w-full flex flex-col text-center shadow-xl p-2 rounded-b-xl bg-white border-t-2 duration-500 hover:cursor-pointer ${displayCard ? "border-cyan-700" : "border-transparent"}`}
      onClick={() => setDisplayCard(!displayCard)}
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
        <p className="text-sm text-gray-500 text-right">{date}</p>
      </div>
    </article>
  );
}

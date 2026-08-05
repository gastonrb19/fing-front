'use client';
import { useState } from 'react';

export default function CardMovement({ nro, description, amount, category, subcategory }: { nro: number, description: string, amount: number, category: string, subcategory: string }) {
  const [displayCard, setDisplayCard] = useState(false);
  return (
    <article className={`w-12/12 text-center shadow-xl p-2 rounded-tl-xl rounded-br-xl bg-white border-2 border-l-2 border-l-cyan-500 border-transparent hover:border-purple-500 duration-500 group ${displayCard ? "" : "hover:cursor-pointer"}`}
      onClick={() => setDisplayCard(true)}>
      <h3>
        <span className="font-bold">Número:</span>
        1
      </h3>
      <p className="italic">Descripción de la carta y el movimiento que se ejecuto (title)  </p>
      <div className={`hide-section ${displayCard ? "block" : "hidden"}`}>
        <div className="container-text-categories flex flex-row justify-center gap-2 font-bold">
          <p className="">Categoria</p>
          <p>Subcategoria</p>
        </div>
        <div className="container-info-categories flex flex-row justify-center gap-2 italic">
          <p>[Info category]</p>
          <p>[Info subcategory]</p>
        </div>
      </div>
      <p className="italic">
        <span className="font-bold">$</span>[Monto]
      </p>
      <button
        onClick={() => setDisplayCard(!displayCard)}
        className={`${displayCard ? "block" : "hidden"} w-8 opacity-50 group-hover:opacity-100 mx-auto cursor-pointer`}>
        <img src="/collapse.png" alt="collapse" />
      </button>
    </article>
  )
}

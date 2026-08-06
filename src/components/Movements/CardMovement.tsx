'use client';
import { useState } from 'react';

interface CardMovementProps {
  nro : number;
  description: string;
  amount: number;
  category : string;
  subcategory: string;
}

export default function CardMovement({ nro, description, amount, category, subcategory }: CardMovementProps ) {
  const [displayCard, setDisplayCard] = useState(false);
  return (
    <article className={`w-12/12 flex flex-col text-center shadow-xl p-2 rounded-tl-xl rounded-br-xl bg-white border-2 border-l-2 border-l-cyan-500 border-transparent hover:border-purple-500 duration-500 group ${displayCard ? "" : "hover:cursor-pointer"}`}
      onClick={() => !displayCard && setDisplayCard(true)}>
      <h3>
        <span className="font-bold">Número:</span>
        {nro} 
      </h3>
      <p className={`hide-section italic ${displayCard ? "block" : "hidden"}`}>{description}</p>
      <div>
        <div className="container-text-categories flex flex-row justify-around gap-2 font-bold">
          <p className="">Categoria</p>
          <p>Subcategoria</p>
        </div>
        <div className="container-info-categories flex flex-row justify-around gap-2 italic">
          <p>{category}</p>
          <p>{subcategory}</p>
        </div>
      </div>
      <p className={`italic ${displayCard ? "" : "mt-auto"}`}>
        <span className="font-bold">$</span>{amount}
      </p>
      <button
        className={`${displayCard ? "block" : "hidden"} w-8 opacity-50 group-hover:opacity-100 mx-auto cursor-pointer`}
        onClick={(e)=> { e.stopPropagation(); setDisplayCard(false); }}>
        <img src="/collapse.png" alt="collapse" />
      </button>
    </article>
  )
}

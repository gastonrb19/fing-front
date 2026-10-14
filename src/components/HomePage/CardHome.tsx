import { NavLink } from "react-router";

export default function CardHome({
  title,
  amount,
  totalAmount,
  counter,
  imagePath,
}: {
  title: string;
  amount?: number;
  totalAmount?: number;
  counter: number;
  imagePath: string;
}) {
  const isIncome = title.toLowerCase() === "ingresos";
  const displayAmount = amount !== undefined ? amount : (totalAmount ?? 0);

  return (
    <NavLink
      to="/movements"
      className="shadow-xl rounded-tl-xl rounded-br-xl p-5 text-center bg-white hover:bg-slate-50 border border-slate-100 transition-all duration-300 hover:scale-[0.98] group"
    >
      <h3 className="text-2xl font-bold text-slate-800">{title}</h3>
      <div className="flex justify-center mb-5 w-8/12 mx-auto">
        <img className="w-full h-full object-contain max-h-36" src={imagePath} alt={title} />
      </div>
      <p className="text-slate-600">
        {" "}
        Total de {title.toLowerCase()}{" "}
        <span
          className={`font-bold ${isIncome ? "text-emerald-600" : "text-rose-600"}`}
        >
          ${Number(displayAmount || 0).toLocaleString("es-CL")}
        </span>
      </p>
      <p className="text-slate-500 text-sm mt-1">
        Cantidad de movimientos <span className="font-bold text-slate-700">{counter}</span>
      </p>
    </NavLink>
  );
}

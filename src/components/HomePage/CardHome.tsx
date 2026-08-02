import { NavLink } from "react-router";

export default function CardHome({
  title,
  totalAmount,
  counter,
  imagePath,
}: {
  title: string;
  totalAmount: number;
  counter: number;
  imagePath: string;
}) {
  return (
    <NavLink
      to="/movements"
      className="shadow-xl rounded-tl-xl rounded-br-xl p-5 text-center bg-gray-200 opacity-50 hover:opacity-100  duration-300 hover:scale-90 group"
    >
      <h3 className="text-2xl font-bold ">{title}</h3>
      <div className="flex justify-center mb-5 w-8/12 mx-auto">
        <img className="w-full h-full" src={imagePath} alt={title} />
      </div>
      <p>
        {" "}
        Total de {title.toLowerCase()}{" "}
        <span
          className={`font-bold ${title === "Ingresos" ? "text-cyan-500" : "text-red-500"}`}
        >
          ${totalAmount}
        </span>
      </p>
      <p>
        Cantidad de movimientos <span className="font-bold">{counter}</span>
      </p>
    </NavLink>
  );
}

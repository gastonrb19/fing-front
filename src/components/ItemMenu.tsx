import { NavLink } from "react-router";

export default function ItemMenu({
  title,
  url,
  onClick,
}: {
  title: string;
  url: string;
  onClick?: () => void;
}) {
  const itemClass =
    "block w-full px-4 py-2 text-center hover:border-cyan-700 border-x-1 border-transparent duration-300 hover:text-cyan-700 text-slate-700 text-sm font-medium";

  return (
    <li className="w-full text-center">
      <NavLink to={url} className={itemClass} onClick={onClick}>
        {title}
      </NavLink>
    </li>
  );
}

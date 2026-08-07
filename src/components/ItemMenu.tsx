import { NavLink } from "react-router";
export default function ItemMenu({
  title,
  url,
}: {
  title: string;
  url: string;
}) {
  const itemClass =
    "block w-full px-4 py-2 text-center hover:border-cyan-700 border-x-1 border-transparent duration-300 hover:text-cyan-700";
  return (
    <li className="w-full text-center">
      <NavLink to={url} className={itemClass}>
        {title}
      </NavLink>
    </li>
  );
}

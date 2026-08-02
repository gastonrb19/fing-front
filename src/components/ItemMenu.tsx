import { NavLink } from "react-router";
export default function ItemMenu({
  title,
  url,
}: {
  title: string;
  url: string;
}) {
  const itemClass =
    "block w-28 min-w-[112px] px-4 py-2 hover:border-purple-700 border-x-1 border-transparent duration-300 hover:text-purple-700";
  return (
    <li className="w-28 text-center">
      <NavLink to={url} className={itemClass}>
        {title}
      </NavLink>
    </li>
  );
}

export interface FriendshipPerson {
  id: string;
  name: string;
}

interface FriendshipListItemProps {
  person: FriendshipPerson;
  selected?: boolean;
  onSelect?: (personId: string) => void;
  actionNode?: React.ReactNode;
}

export default function FriendshipListItem({
  person,
  selected = false,
  onSelect,
  actionNode,
}: FriendshipListItemProps) {
  return (
    <li
      onClick={() => onSelect?.(person.id)}
      className={`flex w-[90%] items-center justify-between rounded-lg px-4 py-3 text-slate-700 transition-colors ${
        onSelect ? "cursor-pointer" : ""
      } ${
        onSelect
          ? selected
            ? "bg-cyan-100 ring-2 ring-cyan-700"
            : "bg-purple-100 hover:bg-cyan-50"
          : "bg-slate-100"
      }`}
    >
      <div>
        <span className="block font-semibold">{person.name}</span>
        <span className="text-sm text-slate-500">ID: {person.id}</span>
      </div>
      
      {/* Nodo Inyectable para renderizar Botones de Acción (Eliminar) sin acoplar lógica */}
      {actionNode && <div>{actionNode}</div>}
    </li>
  );
}

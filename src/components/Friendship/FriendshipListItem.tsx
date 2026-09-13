export interface FriendshipPerson {
  id: string;
  name: string;
}

interface FriendshipListItemProps {
  person: FriendshipPerson;
  selected?: boolean;
  onSelect?: (personId: string) => void;
}

export default function FriendshipListItem({
  person,
  selected = false,
  onSelect,
}: FriendshipListItemProps) {
  return (
    <li
      onClick={() => onSelect?.(person.id)}
      className={`w-[90%] rounded-lg px-4 py-3 text-slate-700 transition-colors ${
        onSelect ? "cursor-pointer" : ""
      } ${
        onSelect
          ? selected
            ? "bg-cyan-100 ring-2 ring-cyan-700"
            : "bg-purple-100 hover:bg-cyan-50"
          : "bg-slate-100"
      }`}
    >
      <span className="block font-semibold">{person.name}</span>
      <span className="text-sm text-slate-500">{person.id}</span>
    </li>
  );
}

import FriendshipList from "./FriendshipList";
import type { FriendshipPerson } from "./FriendshipListItem";

const friends: FriendshipPerson[] = [
  { id: "USR-001", name: "Amigo 1" },
  { id: "USR-002", name: "Amigo 2" },
  { id: "USR-003", name: "Amigo 3" },
  { id: "USR-004", name: "Amigo 4" },
  { id: "USR-005", name: "Amigo 5" },
  { id: "USR-006", name: "Amigo 6" },
];

export default function ListFriendsSection() {
  return (
    <section className="h-96 overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-cyan-700">Lista de amigos</h2>
      <FriendshipList people={friends} />
    </section>
  );
}

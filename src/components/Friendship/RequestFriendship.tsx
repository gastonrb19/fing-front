import { useMemo, useState } from "react";
import FriendshipList from "./FriendshipList";
import type { FriendshipPerson } from "./FriendshipListItem";

type FriendshipMode = "requests" | "add" | "my-requests";

const friendResults: FriendshipPerson[] = [
  { id: "USR-007", name: "Amigo 7" },
  { id: "USR-008", name: "Amigo 8" },
  { id: "USR-009", name: "Amigo 9" },
];

const sentRequests: FriendshipPerson[] = [
  { id: "USR-010", name: "Amigo 10" },
  { id: "USR-011", name: "Amigo 11" },
];

const receivedRequests: FriendshipPerson[] = [
  { id: "USR-012", name: "Amigo 12" },
  { id: "USR-013", name: "Amigo 13" },
];

export default function RequestFriendship() {
  const [mode, setMode] = useState<FriendshipMode>("requests");
  const [search, setSearch] = useState("");
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [selectedReceivedRequestId, setSelectedReceivedRequestId] = useState<string | null>(null);

  const filteredFriends = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return friendResults;
    }

    return friendResults.filter(
      (friend) =>
        friend.name.toLowerCase().includes(normalizedSearch) ||
        friend.id.toLowerCase().includes(normalizedSearch),
    );
  }, [search]);

  const handleModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextMode = event.target.value as FriendshipMode;
    setMode(nextMode);
    setSelectedFriendId(null);
    setSelectedRequestId(null);
    setSelectedReceivedRequestId(null);
    setSearch("");
  };

  return (
    <section className="h-96 overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-cyan-700">Nuevos amigos</h2>
      <select
        value={mode}
        onChange={handleModeChange}
        className="mb-4 w-[90%] rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700"
      >
        <option value="requests">Te solicitaron</option>
        <option value="add">Agregar amigo</option>
        <option value="my-requests">Solicitadas</option>
      </select>

      {mode === "add" && (
        <div className="flex flex-col items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="ingresa nombre o id"
            className="w-[90%] rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700 outline-none focus:border-cyan-700"
          />
          <FriendshipList
            people={filteredFriends}
            selectedId={selectedFriendId}
            onSelect={setSelectedFriendId}
          />
          <button
            type="button"
            disabled={!selectedFriendId}
            className="rounded-lg bg-cyan-700 px-5 py-2 text-white transition-colors hover:bg-cyan-900 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Agregar
          </button>
        </div>
      )}

      {mode === "my-requests" && (
        <div className="flex flex-col items-center gap-3">
          <FriendshipList
            people={sentRequests}
            selectedId={selectedRequestId}
            onSelect={setSelectedRequestId}
          />
          <button
            type="button"
            disabled={!selectedRequestId}
            className="rounded-lg bg-cyan-700 px-5 py-2 text-white transition-colors hover:bg-cyan-900 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Cancelar solicitud
          </button>
        </div>
      )}

      {mode === "requests" && (
        <div className="flex flex-col items-center gap-3">
          <FriendshipList
            people={receivedRequests}
            selectedId={selectedReceivedRequestId}
            onSelect={setSelectedReceivedRequestId}
          />
          <div className="flex gap-3">
            <button
              type="button"
              disabled={!selectedReceivedRequestId}
              className="rounded-lg bg-cyan-700 px-5 py-2 text-white transition-colors hover:bg-cyan-900 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Aceptar
            </button>
            <button
              type="button"
              disabled={!selectedReceivedRequestId}
              className="rounded-lg bg-purple-700 px-5 py-2 text-white transition-colors hover:bg-purple-900 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Denegar
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

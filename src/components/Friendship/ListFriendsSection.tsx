import { useEffect, useState, useCallback } from "react";
import FriendshipList from "./FriendshipList";
import type { FriendshipPerson } from "./FriendshipListItem";
import RemoveFriendButton from "./RemoveFriendButton";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface ListFriendsProps {
  refreshKey: number;
}

export default function ListFriendsSection({ refreshKey }: ListFriendsProps) {
  const [friends, setFriends] = useState<FriendshipPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // TODO: Obtener dinámicamente del AuthContext (LocalStorage/Cookie)
  const currentUserId = 1;

  const loadFriends = useCallback(() => {
    setLoading(true);
    fetch(`${API_URL}/users/${currentUserId}/friends`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener amigos");
        return res.json();
      })
      .then((data) => {
        if(Array.isArray(data)){
            const mappedFriends = data.map((item: any) => ({
              // Dependiendo del lado de la amistad, mapeamos
              id: item.friend?.id?.toString() || item.id?.toString(),
              name: item.friend?.username || `Usuario ${item.friendId || item.id}`
            }));
            setFriends(mappedFriends);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("No se pudieron cargar los amigos.");
        setLoading(false);
      });
  }, [currentUserId]);

  useEffect(() => {
    loadFriends();
  }, [loadFriends, refreshKey]);

  return (
    <section className="h-96 overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col">
      <h2 className="mb-4 text-xl font-semibold text-cyan-700">Lista de amigos</h2>
      
      {loading && friends.length === 0 ? (
        <p className="text-center text-slate-500 my-auto">Cargando...</p>
      ) : error ? (
        <p className="text-center text-red-500 my-auto">{error}</p>
      ) : friends.length === 0 ? (
        <p className="text-center text-slate-500 my-auto">No tienes amigos agregados aún.</p>
      ) : (
        <FriendshipList 
          people={friends} 
          actionRenderer={(person) => (
            <RemoveFriendButton 
               currentUserId={currentUserId}
               friendId={person.id}
               onRemoveSuccess={loadFriends}
            />
          )}
        />
      )}
    </section>
  );
}

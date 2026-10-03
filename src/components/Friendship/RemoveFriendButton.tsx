import { useState } from "react";

interface RemoveFriendButtonProps {
  currentUserId: number;
  friendId: string;
  onRemoveSuccess: () => void;
}

export default function RemoveFriendButton({ currentUserId, friendId, onRemoveSuccess }: RemoveFriendButtonProps) {
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que se seleccione la fila al hacer click
    if (!confirm("¿Estás seguro de que deseas eliminar esta amistad?")) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users/${currentUserId}/friends/${friendId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        onRemoveSuccess();
      } else {
        alert("Error al eliminar la amistad.");
      }
    } catch (error) {
      alert("Error de red al intentar eliminar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRemove}
      disabled={loading}
      title="Eliminar amistad"
      className="rounded-md border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 hover:text-red-800 focus:outline-none disabled:opacity-50"
    >
      {loading ? "..." : "Eliminar"}
    </button>
  );
}

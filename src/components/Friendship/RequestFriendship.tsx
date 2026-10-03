import FriendshipList from "./FriendshipList";
import { useEffect, useState } from "react";
import type { FriendshipPerson } from "./FriendshipListItem";
import FeedbackMessage from "../Shared/FeedbackMessage";

type FriendshipMode = "requests" | "add" | "my-requests";

// TODO: Obtener dinámicamente del AuthContext (LocalStorage/Cookie)
// TODO: Obtener dinámicamente del AuthContext (LocalStorage/Cookie)
  const currentUserId = 3;
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface RequestFriendshipProps {
  onFriendAdded: () => void;
}

export default function RequestFriendship({ onFriendAdded }: RequestFriendshipProps) {
  const [mode, setMode] = useState<FriendshipMode>("requests");
  const [search, setSearch] = useState("");
  
  const [selectedReceivedRequestId, setSelectedReceivedRequestId] = useState<string | null>(null);

  // Estados reales para la BD
  const [receivedRequests, setReceivedRequests] = useState<FriendshipPerson[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Manejo de Feedback visual
  const [feedback, setFeedback] = useState<{ status: "success" | "error" | null; message: string }>({
    status: null,
    message: ""
  });

  // Cargar solicitudes entrantes
  const loadReceivedRequests = () => {
    setLoading(true);
    fetch(`${API_URL}/users/${currentUserId}/friend-requests`)
      .then((res) => res.json())
      .then((data) => {
        if(Array.isArray(data)){
           const mapped = data.map((req: any) => ({
             id: req.id.toString(),
             name: req.sender?.username || `Usuario ${req.sender?.id}`
           }));
           setReceivedRequests(mapped);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (mode === "requests") {
      loadReceivedRequests();
    }
    // Limpiar feedback al cambiar de modo
    setFeedback({ status: null, message: "" });
  }, [mode]);

  // Responder Solicitud (Aceptar o Rechazar)
  const handleRespondRequest = async (status: "ACCEPTED" | "REJECTED") => {
    if (!selectedReceivedRequestId) return;

    try {
      const res = await fetch(`${API_URL}/friend-requests/${selectedReceivedRequestId}/respond`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentUser: currentUserId, status })
      });

      if (res.ok) {
        setFeedback({ status: "success", message: status === "ACCEPTED" ? "¡Solicitud aceptada!" : "Solicitud denegada." });
        if (status === "ACCEPTED") onFriendAdded();
        setSelectedReceivedRequestId(null);
        loadReceivedRequests(); 
      } else {
        const err = await res.json();
        setFeedback({ status: "error", message: err.error?.message || err.message || "Error procesando solicitud." });
      }
    } catch (error) {
      setFeedback({ status: "error", message: "Error de red al conectar con el servidor." });
    }
  };

  // Enviar Solicitud
  const handleSendRequest = async () => {
    if (!search) return;
    const receiverId = parseInt(search);

    try {
      const res = await fetch(`${API_URL}/friend-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentUser: currentUserId, receiverId })
      });

      if (res.ok || res.status === 201) {
        setFeedback({ status: "success", message: "¡Solicitud de amistad enviada correctamente!" });
        setSearch("");
      } else {
        const err = await res.json();
        // El backend mandará NotFoundError (404) o GeneralError (400)
        setFeedback({ status: "error", message: err.error?.message || err.message || "Error al enviar la solicitud." });
      }
    } catch (error) {
      setFeedback({ status: "error", message: "Error de red al conectar con el servidor." });
    }
  };

  const handleModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextMode = event.target.value as FriendshipMode;
    setMode(nextMode);
    setSelectedReceivedRequestId(null);
    setSearch("");
  };

  return (
    <section className="h-96 overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col">
      <h2 className="mb-4 text-xl font-semibold text-cyan-700">Nuevos amigos</h2>
      <select
        value={mode}
        onChange={handleModeChange}
        className="mb-4 w-[90%] mx-auto block rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700"
      >
        <option value="requests">Te solicitaron</option>
        <option value="add">Agregar amigo</option>
        <option value="my-requests">Solicitadas</option>
      </select>

      {mode === "add" && (
        <div className="flex flex-col items-center gap-3">
          <input
            type="number"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setFeedback({ status: null, message: "" }); // Limpia feedback al escribir
            }}
            placeholder="Ingresa ID numérico del usuario"
            className="w-[90%] rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700 outline-none focus:border-cyan-700"
          />
          <button
            type="button"
            onClick={handleSendRequest}
            disabled={!search}
            className="mt-2 rounded-lg bg-cyan-700 px-5 py-2 text-white transition-colors hover:bg-cyan-900 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Enviar Solicitud
          </button>
          
          <FeedbackMessage status={feedback.status} message={feedback.message} />
        </div>
      )}

      {mode === "requests" && (
        <div className="flex flex-col items-center gap-3">
          {loading ? (
            <p className="text-sm text-slate-500">Cargando...</p>
          ) : receivedRequests.length === 0 ? (
            <p className="text-sm text-slate-500">No tienes solicitudes pendientes.</p>
          ) : (
            <FriendshipList
              people={receivedRequests}
              selectedId={selectedReceivedRequestId}
              onSelect={(id) => {
                  setSelectedReceivedRequestId(id);
                  setFeedback({ status: null, message: "" });
              }}
            />
          )}
          
          <div className="flex gap-3">
            <button
              type="button"
              disabled={!selectedReceivedRequestId}
              onClick={() => handleRespondRequest("ACCEPTED")}
              className="rounded-lg bg-cyan-700 px-5 py-2 text-white transition-colors hover:bg-cyan-900 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Aceptar
            </button>
            <button
              type="button"
              disabled={!selectedReceivedRequestId}
              onClick={() => handleRespondRequest("REJECTED")}
              className="rounded-lg bg-purple-700 px-5 py-2 text-white transition-colors hover:bg-purple-900 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Denegar
            </button>
          </div>
          
          <FeedbackMessage status={feedback.status} message={feedback.message} />
        </div>
      )}
      
      {mode === "my-requests" && (
        <div className="flex flex-col items-center gap-3">
           <p className="text-sm text-slate-500 text-center">Aquí verás las solicitudes que has enviado (Próximamente).</p>
        </div>
      )}
    </section>
  );
}

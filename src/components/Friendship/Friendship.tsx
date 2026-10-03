import { useState } from "react";
import ListFriendsSection from "./ListFriendsSection";
import RequestFriendship from "./RequestFriendship";

export default function Friendship() {
  // Estado centralizado para coordinar la recarga entre componentes hermanos
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-slate-700 ml-5 mb-10 mt-20">Amistades</h1>
      <div className="mx-auto grid w-[90%] grid-cols-1 gap-6 lg:grid-cols-2">
        <ListFriendsSection refreshKey={refreshKey} />
        <RequestFriendship onFriendAdded={triggerRefresh} />
      </div>
    </>
  );
}

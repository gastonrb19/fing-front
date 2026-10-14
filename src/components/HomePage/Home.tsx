import ContainerCards from "./ContainerCards";
import TitleHome from "./TitleHome";
import { useAuth } from "../../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <TitleHome username={user?.username || "Usuario"} />
      <ContainerCards />
    </div>
  );
}

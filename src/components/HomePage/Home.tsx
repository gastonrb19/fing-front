import Menu from "../Menu";
import ContainerCards from "./ContainerCards";
import TitleHome from "./TitleHome";
export default function Home() {
  return (
    <div className="min-h-screen">
      <TitleHome username="Xanxito15" />
      <ContainerCards />
      <Menu />
    </div>
  );
}

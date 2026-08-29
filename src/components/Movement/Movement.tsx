import { useParams } from "react-router";
import WrapCardMovement from "./WrapCardMovement";
import Menu from "../Menu";

export default function Movement() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-slate-50 pt-10">
      <div className="mx-auto w-11/12 max-w-3xl mb-4">
        <h2 className="text-xl font-bold text-slate-800">
          Movimiento #{id}
        </h2>
      </div>
      <WrapCardMovement />
      <Menu />
    </div>
  );
}

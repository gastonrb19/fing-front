import Menu from "../Menu";
import FormTransaction from "./FormTransaction";
import TitleTransaction from "./TitleTransaction";

export default function Transaction() {
  return (
    <>
      <TitleTransaction />
      <FormTransaction />
      <Menu />
    </>
  );
}

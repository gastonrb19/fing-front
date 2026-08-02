import CardHome from "./CardHome";
export default function ContainerCards() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 mt-10 gap-5 justify-center w-8/12 mx-auto">
      <CardHome
        counter={15}
        totalAmount={500}
        title="Gastos"
        imagePath="../../public/arrow-down.png"
      />
      <CardHome
        counter={15}
        totalAmount={500}
        title="Ingresos"
        imagePath="../../public/arrow-trend.png"
      />
    </section>
  );
}

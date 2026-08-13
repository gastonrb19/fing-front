export default function TitleTransaction({ name = "Nueva transacción" }: { name?: string }) {
  return (
    <h1 className="mx-auto my-10 w-11/12 text-center text-[1.7rem] font-semibold tracking-[0.14em] text-slate-800 md:text-left">
      {name}
    </h1>
  );
}

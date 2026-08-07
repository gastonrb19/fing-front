export default function TitleMovements({
  setDisplayFilter,
  displayFilter,
}: {
  setDisplayFilter: (display: boolean) => void;
  displayFilter: boolean;
}) {
  return (
    <h1 className="flex items-center justify-center text-2xl font-semibold text-center text-gray-800 my-5">
      <span className="text-cyan-700">Mov</span>imientos
      <button
        className="ml-2 w-6 cursor-pointer"
        onClick={() => setDisplayFilter(!displayFilter)}
      >
        <img src="/filter.png" alt="filter" className="w-full" />
      </button>
    </h1>
  );
}

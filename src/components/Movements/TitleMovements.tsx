export default function TitleMovements({
  setDisplayFilter,
  displayFilter,
}: {
  setDisplayFilter: (display: boolean) => void;
  displayFilter: boolean;
}) {
  return (
    <h1 className="flex justify-center text-4xl font-bold text-center tracking-wide text-gray-800 my-5">
      <span className="text-purple-800">T</span>ransacciones
      <button
        className="ml-2 w-7 cursor-pointer"
        onClick={() => setDisplayFilter(!displayFilter)}
      >
        <img src="/filter.png" alt="filter" className="w-full" />
      </button>
    </h1>
  );
}

"use client";

interface FormEditHeaderProps {
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
}

export default function FormEditHeader({ isEditing, setIsEditing }: FormEditHeaderProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6 mb-6">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Estado Actual:
        </span>
        <span
          className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white ${
            isEditing ? "bg-cyan-600" : "bg-slate-500"
          }`}
        >
          {isEditing ? "Edición" : "Visualización"}
        </span>
      </div>
      {!isEditing && (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 focus:outline-none focus:ring-3 focus:ring-slate-300"
        >
          Editar
        </button>
      )}
    </div>
  );
}

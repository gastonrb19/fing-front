"use client";

interface FormEditFooterProps {
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
}

export default function FormEditFooter({ isEditing, setIsEditing }: FormEditFooterProps) {
  if (!isEditing) return null;

  return (
    <div className="flex justify-center gap-4 pt-2">
      <button
        type="button"
        onClick={() => setIsEditing(false)}
        className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-3 focus:ring-slate-200"
      >
        Cancelar
      </button>
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 focus:outline-none focus:ring-3 focus:ring-slate-300"
      >
        Guardar
      </button>
    </div>
  );
}

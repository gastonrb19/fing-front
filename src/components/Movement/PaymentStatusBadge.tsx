interface PaymentStatusBadgeProps {
  isAccepted: boolean;
  isRejected: boolean;
  isCurrentUser: boolean; // Si es el dueño de la cuenta, no necesita aceptar/rechazar
}

export default function PaymentStatusBadge({ isAccepted, isRejected, isCurrentUser }: PaymentStatusBadgeProps) {
  if (isCurrentUser) {
    return null; // El dueño del gasto no necesita confirmar su propia cuota
  }

  if (isRejected) {
    return (
      <span className="ml-2 inline-flex items-center rounded-md bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
        Rechazado
      </span>
    );
  }

  if (isAccepted) {
    return (
      <span className="ml-2 inline-flex items-center rounded-md bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
        Aceptado
      </span>
    );
  }

  // Si no está aceptado ni rechazado, está pendiente
  return (
    <span className="ml-2 inline-flex items-center rounded-md bg-yellow-50 px-2 py-0.5 text-[10px] font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
      Pendiente de respuesta
    </span>
  );
}

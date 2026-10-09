import { Link } from "react-router";
import PaymentStatusBadge from "./PaymentStatusBadge";

interface InstallmentItemProps {
  spendId: string | number;
  installmentId: string; // idPI
  paymentId: string;
  index: number;
  userName: string;
  amount: number;
  isPaid: boolean;
  date: string;
  isAccepted: boolean;
  isRejected: boolean;
  isCurrentUser: boolean;
}

export default function InstallmentItem({
  spendId,
  paymentId,
  index,
  userName,
  amount,
  isPaid,
  date,
  isAccepted,
  isRejected,
  isCurrentUser
}: InstallmentItemProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:bg-slate-100">
      <div>
        <p className="text-sm font-semibold text-slate-700">
          Cuota #{index}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">
          Asignado a: <span className="font-semibold text-slate-700">{userName}</span>
          <PaymentStatusBadge isAccepted={isAccepted} isRejected={isRejected} isCurrentUser={isCurrentUser} />
        </p>
        <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">
          Vence: {date}
        </p>
      </div>
      <div className="text-right flex flex-col items-end">
        <p className={`text-sm font-bold mb-1 ${isPaid ? "text-emerald-600" : "text-slate-700"}`}>
          ${amount.toLocaleString("es-CL")}
        </p>
        {isCurrentUser ? (
          <Link
            to={`/movement/${spendId}/position/${paymentId}`}
            className={`text-xs font-medium hover:underline ${isPaid ? "text-emerald-600 hover:text-emerald-700" : "text-cyan-600 hover:text-cyan-700"}`}
          >
            {isPaid ? "Tu pago ✓" : "Pagar tu cuota →"}
          </Link>
        ) : (
          <span className={`text-xs font-medium ${isPaid ? "text-emerald-600" : "text-slate-400"}`}>
             {isPaid ? "Pagado ✓" : "Pendiente"}
          </span>
        )}
      </div>
    </div>
  );
}

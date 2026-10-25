import CardHome from "./CardHome";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function ContainerCards() {
  const { user } = useAuth();
  const currentUserId = user?.id;
  const [spendTotal, setSpendTotal] = useState(0);
  const [spendCount, setSpendCount] = useState(0);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [incomeCount, setIncomeCount] = useState(0);

  useEffect(() => {
    if (currentUserId) {
      fetch(`${API_URL}/users/${currentUserId}/spends?limit=1000`)
        .then((res) => (res.ok ? res.json() : { data: [] }))
        .then((json) => {
          if (json.data && Array.isArray(json.data)) {
            let totalSpent = 0;
            let paidCount = 0;

            json.data.forEach((spend: any) => {
              const isOwner =
                spend.isOwner !== undefined
                  ? spend.isOwner
                  : spend.user?.id === currentUserId;

              const userAssigned =
                spend.assignedAmount !== undefined
                  ? Number(spend.assignedAmount)
                  : isOwner
                    ? Number(spend.amount || 0)
                    : 0;

              const totalInst =
                Number(spend.userTotalInstallments || spend.totalInstallment) ||
                1;
              const paidInst = Number(spend.paidInstallments) || 0;

              const userPaid =
                spend.paidAmount !== undefined
                  ? Number(spend.paidAmount)
                  : (userAssigned / totalInst) * paidInst;

              if (paidInst > 0 && userPaid > 0) {
                totalSpent += userPaid;
                paidCount += 1;
              }
            });

            setSpendCount(paidCount);
            setSpendTotal(Math.round(totalSpent));
          }
        })
        .catch(console.error);

      fetch(`${API_URL}/users/${currentUserId}/incomes?limit=1000`)
        .then((res) => (res.ok ? res.json() : { data: [] }))
        .then((json) => {
          if (json.data && Array.isArray(json.data)) {
            let totalDeposited = 0;
            let depositedCount = 0;

            json.data.forEach((inc: any) => {
              if (inc.isPayed) {
                totalDeposited += Number(inc.amount || 0);
                depositedCount += 1;
              }
            });

            setIncomeCount(depositedCount);
            setIncomeTotal(Math.round(totalDeposited));
          }
        })
        .catch(console.error);
    }
  }, [currentUserId]);

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 mt-10 gap-5 justify-center w-8/12 mx-auto mb-30 md:mb-1">
      <CardHome
        counter={spendCount}
        amount={spendTotal}
        title="Gastos"
        imagePath="/arrow-down.png"
      />
      <CardHome
        counter={incomeCount}
        amount={incomeTotal}
        title="Ingresos"
        imagePath="/arrow-trend.png"
      />
    </section>
  );
}

import CardHome from "./CardHome";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function ContainerCards() {
  const { user } = useAuth();
  const currentUserId = user?.id;
  const [spendTotal, setSpendTotal] = useState(0);
  const [spendCount, setSpendCount] = useState(0);

  useEffect(() => {
    if (currentUserId) {
      fetch(`${API_URL}/users/${currentUserId}/spends?limit=1000`)
        .then(res => res.json())
        .then(json => {
          if (json.data && Array.isArray(json.data)) {
            setSpendCount(json.len ?? json.data.length);
            const total = json.data.reduce((acc: number, spend: any) => {
              const amount = spend.assignedAmount !== undefined && !spend.isOwner
                ? spend.assignedAmount
                : (spend.amount || 0);
              return acc + amount;
            }, 0);
            setSpendTotal(total);
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
        counter={0}
        amount={0}
        title="Ingresos"
        imagePath="/arrow-trend.png"
      />
    </section>
  );
}

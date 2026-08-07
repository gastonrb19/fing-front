import CategoryMovement from "./CategoryMovement";

export interface MovementItem {
  nro: number;
  description: string;
  amount: number;
  date: string;
}

export interface SubcategoryInfo {
  id_subcategory: number;
  name_subcategory: string;
  movements: MovementItem[];
}

export interface LoadInfo {
  id_category: number;
  name_category: string;
  subcategories: SubcategoryInfo[];
}

const infoLoad: LoadInfo[] = [
  {
    id_category: 1,
    name_category: "Categoría principal",
    subcategories: [
      {
        id_subcategory: 101,
        name_subcategory: "Alimentación",
        movements: [
          {
            nro: 1,
            description: "Compra de supermercado",
            amount: 120000,
            date: "2026-08-01",
          },
          {
            nro: 2,
            description: "Cena fuera",
            amount: 45000,
            date: "2026-08-03",
          },
        ],
      },
      {
        id_subcategory: 102,
        name_subcategory: "Transporte",
        movements: [
          {
            nro: 3,
            description: "Gasolina",
            amount: 80000,
            date: "2026-08-02",
          },
          {
            nro: 4,
            description: "Transporte público",
            amount: 25000,
            date: "2026-08-05",
          },
        ],
      },
      {
        id_subcategory: 103,
        name_subcategory: "Entretenimiento",
        movements: [
          {
            nro: 5,
            description: "Streaming mensual",
            amount: 30000,
            date: "2026-08-04",
          },
          {
            nro: 6,
            description: "Cine",
            amount: 60000,
            date: "2026-08-06",
          },
        ],
      },
    ],
  },
];

export default function WrapSections() {
  return (
    <section className="w-11/12 mx-auto grid grid-cols-1 gap-3 mt-10 mb-40">
      {infoLoad.map((value) => (
        <CategoryMovement key={value.id_category} category={value} />
      ))}
    </section>
  );
}

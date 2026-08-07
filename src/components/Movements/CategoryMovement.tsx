import type { LoadInfo } from "./WrapSections";
import SubcategoryMovement from "./SubcategoryMovement";

interface CategoryMovementProps {
  category: LoadInfo;
}

export default function CategoryMovement({ category }: CategoryMovementProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xl font-bold text-cyan-700 border-b border-cyan-200 pb-1">
        {category.name_category}
      </h3>
      {category.subcategories.map((subcategory) => (
        <SubcategoryMovement
          key={subcategory.id_subcategory}
          subcategory={subcategory}
        />
      ))}
    </div>
  );
}

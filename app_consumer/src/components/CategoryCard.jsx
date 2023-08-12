import React from "react";
import expandMore from "../assets/expandmore.svg";
import expandLess from "../assets/expandless.svg";
import ItemCard from "../components/ItemCard";
export default function CategoryCard({ categoryName, itemList }) {
  const [expand, setExpand] = React.useState(true);
  function handleExpansion(params) {
    setExpand(!expand);
  }
  return (
    <div
      className="bg-white rounded-lg shadow-sm max-w-2xl mx-auto p-4 mb-4"
      key={categoryName}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">{categoryName}</h2>

        <img
          src={expand ? expandLess : expandMore}
          onClick={(e) => handleExpansion(expand)}
          alt=""
          className="h-6 w-6 cursor-pointer"
        />
      </div>

      {expand && (
        <div className="mt-4">
          {itemList.map((item) => (
            <ItemCard
              key={item.menuId}
              itemName={item.itemName}
              description={item.description}
              price={item.price}
              category={item.category}
              dietCategory={item.dietCategory}
            />
          ))}
        </div>
      )}
    </div>
  );
}

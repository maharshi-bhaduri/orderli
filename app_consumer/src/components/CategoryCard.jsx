import React from "react";
import expandMore from "../assets/expandmore.svg";
import expandLess from "../assets/expandless.svg";
import ItemCard from "../components/ItemCard";

export default function CategoryCard({ categoryName, itemList, orderFlag }) {
  const [expand, setExpand] = React.useState(true);
  function handleExpansion(params) {
    setExpand(!expand);
  }
  return (
    <div
      className="bg-white rounded-lg shadow-md max-w-2xl mx-auto px-2 mb-4 "
      key={categoryName}
    >
      <div
        className="flex justify-between items-center cursor-pointer py-4"
        onClick={(e) => handleExpansion(expand)}
      >
        <h2 className="text-base font-bold mx-4">{categoryName}</h2>

        <img
          src={expand ? expandLess : expandMore}
          alt="background image of a cafe"
          className="h-6 w-6 cursor-pointer"
        />
      </div>

      {expand && (
        <div className="pb-4">
          {itemList.map((item) => (
            <ItemCard
              key={item.menuId}
              itemName={item.itemName}
              description={item.description}
              price={item.price}
              category={item.category}
              dietCategory={item.dietCategory}
              partnerId={item.partnerId}
              menuId={item.menuId}
              orderFlag={orderFlag}
            />
          ))}
        </div>
      )}
    </div>
  );
}

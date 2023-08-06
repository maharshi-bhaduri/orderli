import React from "react";
import { getMenu } from "../utils/queryService";
import Header from "../components/Header";
import { useParams } from "react-router-dom";
import ItemCard from "../components/ItemCard";

import "../styles.css";
export default function DisplayMenu() {
  let { providerHandle } = useParams();
  const { data: foodItems, isLoading } = getMenu(providerHandle);
  const [searchText, setSearchText] = React.useState("");

  return (
    <>
      <div className="bg-cover bg-center pt-20 ">
        <div className="text-white flex justify-evenly">
          <div>sort</div>
          <div>
            <input
              type="text"
              value={searchText}
              placeholder="Search"
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
              className="border border-gray-300 px-2 py-1 rounded text-black"
            />
          </div>
        </div>
        <div className="pt-4"></div>
        {!isLoading &&
          foodItems
            .filter((item) => {
              return searchText.toLowerCase() === ""
                ? item
                : item.itemName
                    .toLowerCase()
                    .includes(searchText.toLowerCase()) ||
                    item.description
                      .toLowerCase()
                      .includes(searchText.toLowerCase()) ||
                    item.category
                      .toLowerCase()
                      .includes(searchText.toLowerCase());
            })
            .map((item) => (
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
    </>
  );
}

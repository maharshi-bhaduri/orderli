import React from "react";
import { getMenu } from "../utils/queryService";
import { useParams, useNavigate } from "react-router-dom";
import TabGroup from "../components/TabGroup";
import { tabMap } from "../utils/OptionMap.js";
import CategoryCard from "../components/CategoryCard";
import SearchService from "../utils/SearchService";
import Loader from "../components/Loader";
import { useCart } from "../utils/CartContext.jsx";

export default function Menu() {
  let { partnerHandle } = useParams();
  const navigate = useNavigate();
  let filteredItems = [];
  const groupedItems = {};
  const { data: foodItems, isLoading } = getMenu(partnerHandle);
  const { cart } = useCart();
  const totalCartItems = Object.keys(cart.cartItems).length;
  const [consumerChoice, setConsumerChoice] = React.useState({
    searchText: "",
    veg: false,
    nonveg: false,
    all: true,
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setConsumerChoice((oldConsumerChoice) => ({
      ...oldConsumerChoice,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function goHome() {
    navigate(`/${partnerHandle}`);
  }

  function handleCategorySelect(option) {
    setConsumerChoice((oldConsumerChoice) => ({
      ...oldConsumerChoice,
      veg: option === "Veg",
      nonveg: option === "Non-Veg",
      all: option === "All",
    }));
  }

  if (!isLoading) {
    filteredItems = Array.isArray(foodItems.menu)
      ? foodItems.menu.filter((item) => {
        if (consumerChoice.all) return true;
        if (consumerChoice.veg) return item.dietCategory === 2;
        if (consumerChoice.nonveg) return item.dietCategory === 1 || item.dietCategory === 3;
        return false;
      })
      : [];
    filteredItems = SearchService(consumerChoice.searchText, filteredItems, [
      "itemName",
      "description",
      "category",
    ]);

    filteredItems.forEach((item) => {
      if (!groupedItems[item.category]) {
        groupedItems[item.category] = [];
      }
      groupedItems[item.category].push(item);
    });
  }

  return (
    <>
      <div className="bg-orange-300 bg-cover bg-center h-screen overflow-y-hidden">
        <div className="text-black rounded-lg w-full flex justify-center items-center">
          <div
            className="rounded-b-lg border bg-white p-2 flex flex-col
                            items-center shadow-md w-full max-w-2xl"
          >
            <div className="w-full flex mb-2 text-sm h-10">
              <button
                className="mr-2 px-2 border border-gray-300 text-gray-500
                    rounded-lg bg-white hover:bg-gray-300 transition ease-in-out"
                onClick={goHome}
              >
                Home
              </button>
              <input
                type="text"
                value={consumerChoice.searchText}
                placeholder="Search"
                name="searchText"
                disabled={isLoading}
                onChange={handleChange}
                className="border border-gray-300 px-2 py-2 rounded-lg text-black w-full"
              />
              {!isLoading && foodItems?.orderFlag && (
                <button
                  className="ml-2 px-2 border border-gray-300 text-gray-500
               rounded-lg bg-white hover:bg-gray-300 transition ease-in-out relative"
                  onClick={() => navigate(`/${partnerHandle}/cart`)}
                >
                  Cart
                  {totalCartItems > 0 && (
                    <span
                      className="absolute top-0 right-0 -mt-2 -mr-2 bg-orange-500
                 text-white text-xs rounded-full px-2 py-1"
                    >
                      {totalCartItems}
                    </span>
                  )}
                </button>
              )}
            </div>
            <div className="flex w-full">
              <TabGroup tabMap={tabMap} onSelect={handleCategorySelect} />
            </div>
          </div>
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="overflow-hidden flex justify-center w-full px-2">
            <div className="pt-2 pl-2 w-full max-w-2xl h-[calc(100vh-96px)] overflow-y-scroll"
              style={{ scrollbarGutter: "stable" }}
            >
              {Object.keys(groupedItems).map((category) => (
                <CategoryCard
                  key={category}
                  categoryName={category}
                  itemList={groupedItems[category]}
                  orderFlag={foodItems.orderFlag}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

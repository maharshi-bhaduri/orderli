import React from "react";
import { getMenu } from "../utils/queryService";
import Header from "../components/Header";
import { useParams, useNavigate } from "react-router-dom";
import ItemCard from "../components/ItemCard";
import TabGroup from "../components/TabGroup";
import { tabMap } from "../utils/OptionMap.js";
import { dietCategoryOptions } from "../utils/OptionMap.js";
import CategoryCard from "../components/CategoryCard";
export default function Menu() {
  let { providerHandle } = useParams();
  const navigate = useNavigate();
  let filteredItems = [];
  const groupedItems = {};
  const { data: foodItems, isLoading } = getMenu(providerHandle);
  console.log("providerHandle ", providerHandle)

  const [searchText, setSearchText] = React.useState("");
  const [consumerChoice, setConsumerChoice] = React.useState({
    searchText: "",
    veg: false,
    nonveg: false,
    all: true,
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setConsumerChoice((oldConsumerChoice) => {
      const result = type === "checkbox" ? checked : value;
      return {
        ...oldConsumerChoice,
        [name]: result,
      };
    });
  }
  function goHome() {
    navigate(`/${providerHandle}`);
  }

  function handleCategorySelect(option) {
    setConsumerChoice((oldConsumerChoice) => {
      return {
        ...oldConsumerChoice,
        veg: option === "Veg" ? true : false,
        nonveg: option === "Non-Veg" ? true : false,
        all: option === "All" ? true : false,
      };
    });
  }

  if (!isLoading) {
    filteredItems = foodItems
      .filter((item) => {
        if (consumerChoice.all === true) return true;
        if (consumerChoice.veg === true) {
          return item.dietCategory === 2;
        }
        if (consumerChoice.nonveg === true) {
          return item.dietCategory === 1 || item.dietCategory === 3;
        }
        return false;
      })
      .filter((item) => {
        return consumerChoice.searchText.toLowerCase() === ""
          ? item
          : item.itemName
            .toLowerCase()
            .includes(consumerChoice.searchText.toLowerCase()) ||
          item.description
            .toLowerCase()
            .includes(consumerChoice.searchText.toLowerCase()) ||
          item.category
            .toLowerCase()
            .includes(consumerChoice.searchText.toLowerCase());
      });

    filteredItems.forEach((item) => {
      if (!groupedItems[item.category]) {
        groupedItems[item.category] = [];
      }
      groupedItems[item.category].push(item);
    });
  }

  return (
    <>
      <div className="bg-gray-300 bg-cover bg-center pt-2 px-2 h-screen overflow-y-scroll">
        <div className="text-black fixed left-1/2 -translate-x-1/2 max-w-2xl w-full mx-auto">
          <div
            className="rounded-lg bg-white p-2 mx-2 flex flex-col
                        justify-center items-center shadow-md"
          >
            <div className="w-full flex mb-2">
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
            </div>
            <div>
              <TabGroup tabMap={tabMap} onSelect={handleCategorySelect} />
            </div>
            {/* <p>All items are in INR</p> */}
          </div>
        </div>
        <div className="mt-32">
          {Object.keys(groupedItems).map((category, index) => (
            <CategoryCard
              key={category}
              categoryName={category}
              itemList={groupedItems[category]}
            />
          ))}
        </div>
      </div>
    </>
  );
}

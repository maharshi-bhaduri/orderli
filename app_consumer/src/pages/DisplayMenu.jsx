import React from "react";
import { getMenu } from "../utils/queryService";
import Header from "../components/Header";
import { useParams } from "react-router-dom";
import ItemCard from "../components/ItemCard";
import TabGroup from "../components/TabGroup";
import { tabMap } from "../utils/OptionMap.js";
import { dietCategoryOptions } from "../utils/OptionMap.js";
export default function DisplayMenu() {
  let { providerHandle } = useParams();
  const { data: foodItems, isLoading } = getMenu(providerHandle);
  console.log(foodItems);
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
  return (
    <>
      <div className="bg-cover bg-center pt-5 ">
        <div className="text-black flex justify-evenly">
          <div>
            <input
              type="text"
              value={consumerChoice.searchText}
              placeholder="Search"
              name="searchText"
              onChange={handleChange}
              className="border border-gray-300 px-2 py-1 rounded text-black"
            />
          </div>
          {/* <div>
            <label className="text-black" htmlFor="veg">
              Veg
            </label>
            <input
              type="checkbox"
              id="veg"
              name="veg"
              checked={consumerChoice.veg}
              onChange={handleChange}
            />
            <label className="text-black" htmlFor="nonveg">
              Non-Veg
            </label>
            <input
              type="checkbox"
              id="nonveg"
              name="nonveg"
              checked={consumerChoice.nonveg}
              onChange={handleChange}
            />
          </div> */}
          <div>
            <TabGroup tabMap={tabMap} onSelect={handleCategorySelect} />
          </div>
        </div>
        <div className="pt-4"></div>
        {!isLoading &&
          foodItems
            .filter((item) => {
              if (consumerChoice.all === true) return item;

              if (consumerChoice.veg === true) {
                return item.dietCategory === 2;
              }
              if (consumerChoice.nonveg === true) {
                return item.dietCategory === 1 || item.dietCategory === 3;
              }
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

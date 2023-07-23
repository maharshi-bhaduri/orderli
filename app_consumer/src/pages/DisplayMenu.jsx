import React from "react";
import { getMenu } from "../utils/queryService";
import Header from "../components/Header";
import { useParams } from "react-router-dom";
import Card from "../components/Card";
import "../styles.css";
export default function DisplayMenu() {
  let { providerHandle } = useParams();
  const { data: foodItems, isLoading } = getMenu(providerHandle);

  console.log(foodItems);
  // let fooditemsArray = foodItems.map((item) => {
  //   return (
  //     <Card
  //       key={item.menuId}
  //       itemName={item.itemName}
  //       description={item.description}
  //       price={item.price}
  //     />
  //   );
  // });

  return (
    <>
      <Header />

      <div className="bg-cover bg-center pt-20 menu-bg">
        <div className="pt-4"></div>
        {!isLoading &&
          foodItems.map((item) => (
            <Card
              key={item.menuId}
              itemName={item.itemName}
              description={item.description}
              price={item.price}
            />
          ))}
      </div>
    </>
  );
}

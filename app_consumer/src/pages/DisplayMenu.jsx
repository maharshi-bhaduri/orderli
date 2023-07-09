import React from "react";
import Header from "../components/Header";
import axios from "axios";
import { useLocation } from "react-router";
import Card from "../components/Card";
export default function DisplayMenu() {
  const [foodItems, setFoodItems] = React.useState([]);
  const location = useLocation();
  React.useEffect(() => {
    axios
      .get(import.meta.env.VITE_APP_GET_MENU_ITEMS, {
        params: { providerHandle: location.state.providerHandle },
      })
      .then(function (response) {
        setFoodItems(response.data.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, []);
  let fooditemsArray = foodItems.map((item) => {
    return (
      <Card
        key={item.menu_id}
        heading={item.item_name}
        subheading={item.description}
      />
    );
  });

  return <div>{fooditemsArray}</div>;
}

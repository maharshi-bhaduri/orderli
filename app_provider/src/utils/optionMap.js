export const optionMap = [
  {
    name: "Dashboard",
    page: "",
    icon: "dashboard",
  },
  {
    name: "Profile",
    page: "profile",
    icon: "qr_code_2",
  },
  {
    name: "Menu",
    page: "menu",
    icon: "restaurant", //"restaurant_menu", menu_book
  },
  {
    name: "Promotions",
    page: "promotions",
    icon: "celebration", //celebration, star
  },
  {
    name: "Feedback",
    page: "feedback",
    icon: "reviews",
  },
  {
    name: "Settings",
    page: "settings",
    icon: "settings",
  },
];

export const menuRowOptions = [
  {
    name: "Item Name",
    type: "text",
    key: "itemName",
  },
  {
    name: "Description",
    type: "text",
    key: "description",
  },
  {
    name: "Price",
    type: "number",
    key: "price",
  },
];

export const ratingColors = {
  5: "bg-green-800",
  4: "bg-lime-700",
  3: "bg-yellow-400",
  2: "bg-orange-500",
  1: "bg-red-600",
};

export const buttonStyles = {
  red: "text-white transition duration-300 bg-red-500 hover:bg-red-700",
  blue: "text-white transition duration-300 bg-blue-500 hover:bg-blue-700"
}
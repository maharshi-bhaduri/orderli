import sGreen from "../images/snaqr_is_green.png";
import sEfficient from "../images/snaqr_efficient.png";
import sInsightful from "../images/snaqr_is_insightful.png";


export const dietCategoryOptions = [
  {
    id: 1,
    value: "non-veg",
  },
  {
    id: 2,
    value: "veg",
  },
  {
    id: 3,
    value: "egg",
  },
];

export const tabMap = ["All", "Non-Veg", "Veg"];

export const palleteColours = {
  notify: "bg-amber-50 border border-yellow-200 text-gray-500",
  warning: "bg-red-50 border border-red-200",
  default: "",
};

export const ratingColors = {
  5: "bg-green-800",
  4: "bg-lime-700",
  3: "bg-yellow-400",
  2: "bg-orange-500",
  1: "bg-red-600",
};

export const buttonStyles = {
  red: {
    org: "text-white transition duration-300 bg-red-500 hover:bg-red-700 cursor-pointer",
    dis: "text-white transition duration-300 bg-red-200 hover:bg-red-200 cursor-default",
  },
  blue: {
    org: "text-blue-500 transition duration-300 border border-blue-500 hover:text-white hover:bg-blue-700 cursor-pointer",
    dis: "text-white transition duration-300 bg-blue-200 hover:bg-blue-200 cursor-deault",
  },
  bluefill: {
    org: "text-white transition duration-300 bg-blue-500 hover:bg-blue-700 cursor-pointer",
    dis: "text-white transition duration-300 bg-blue-200 hover:bg-blue-200 cursor-deault",
  },
  default: {
    org: "text-black transition duration-300 border border-black hover:bg-black hover:text-white cursor-pointer",
    dis: "text-white transition duration-300 bg-gray-200 hover:bg-gray-200 cursor-deault",
  },
};

export const partnerPortalLink = "https://partner.snaqr.com";

export const partner_features = [
  {
    id: 1,
    title: "Efficient",
    desc: "Reduce order processing time and enable swift adaptability.",
    src: sEfficient
  },
  {
    id: 2,
    title: "Insightful",
    desc: "Focus on the important stuff using a data driven approach.",
    src: sInsightful
  },
  {
    id: 3,
    title: "Green",
    desc: "Say goodbye to paper menus. Dine sustainably.",
    src: sGreen
  },
];

export const consumer_features = [
  {
    id: 1,
    title: "Effortless",
    desc: "Skip the menu maze- order with a tap, dine with ease!",
  },
  {
    id: 2,
    title: "Engaging",
    desc: "Beautiful menus- like the opening act to a great meal.",
  },
  {
    id: 3,
    title: "Trackable",
    desc: "Embark on a culinary adventure– follow your food's journey!",
  },
];

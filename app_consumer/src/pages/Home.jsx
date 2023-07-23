import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMenu } from "../utils/queryService";
import Header from "../components/Header";
export default function Home() {
  const navigate = useNavigate();
  let { providerHandle } = useParams();

  /*
  React.useEffect(() => {
    axios
      .get(import.meta.env.VITE_APP_GET_MENU, {
        params: { providerHandle: providerHandle },
      })
      .then((response) => {
        Cookies.set("menu", JSON.stringify(response.data));
        console.log(JSON.parse(Cookies.get("menu")));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
*/
  const data = getMenu(providerHandle);
  console.log(data);
  function goToMenu() {
    navigate(`/${providerHandle}/displaymenu`);
  }
  return (
    <>
      <Header />
      <div className="consumer-container">
        <button
          onClick={goToMenu}
          className="order-btn bg-orderlee-primary-100 hover:bg-orange-500  text-white font-bold py-5 px-10 rounded-full"
        >
          ORDER NOW
        </button>
      </div>
    </>
  );
}

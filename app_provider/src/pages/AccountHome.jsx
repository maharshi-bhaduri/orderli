import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../utils/AuthContextProvider";
import { getService } from "../utils/APIService";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";

export default function AccountHome() {
  const navigate = useNavigate();
  const user = useContext(AuthContext);

  const {
    data: partners,
    isLoading,
    isError,
  } = useQuery(
    ["partners"],
    () =>
      getService(import.meta.env.VITE_APP_GET_PROVIDERS).then(
        (response) => response.data
      ),
    {
      staleTime: 1000 * 60 * 5,
    }
  );

  const message = user ? "Welcome " + user.displayName + "!" : "";

  return (
    <div className="h-screen">
      <div className="w-full flex flex-col justify-center md:justify-start items-center">
        <h1 className="text-2xl my-6">{message}</h1>
        <div className="sm:w-full md:w-3/4 lg:w-2/5 flex flex-col items-center m-0 p-6 border border-gray-300 bg-gray-100 rounded-lg">
          <div className="w-full mb-4 flex justify-items-start items-center">
            <p className="text-xl font-semibold mx-2">Partner restaurants</p>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded mx-2 hover:bg-blue-600"
              onClick={() => {
                navigate("/addRestaurant");
              }}
            >
              Add
            </button>
          </div>
          {isLoading
            ? "DATA IS LOADING"
            : Array.isArray(partners) &&
              partners.map((object, index) => (
                <Card
                  key={index}
                  id={object.partnerId}
                  heading={object.partnerName}
                  subheading={object.partnerHandle}
                  link={`/partner/${object.partnerHandle}`}
                  stateData={object.partnerHandle}
                />
              ))}
        </div>
      </div>
    </div>
  );
}

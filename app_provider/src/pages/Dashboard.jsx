import { useContext } from "react";
import { useQuery } from 'react-query';
import { AuthContext } from "../utils/AuthContextProvider";
import { getService } from "../utils/APIService";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card"


export default function Dashboard() {
  const navigate = useNavigate();
  const user = useContext(AuthContext);

  const { data: providers, isLoading, isError } = useQuery('providers',
    () =>
      getService(import.meta.env.VITE_APP_GET_PROVIDERS)
        .then((response) => response.data),
    {
      staleTime: 1000 * 60 * 5,
    }
  )

  const message = user
    ? "Welcome, " + user.displayName + "!"
    : "Unathenticated";

  return (
    <div className="mx-10 my-28">
      <h1 className="text-2xl">{message}</h1>
      <div className="w-full flex justify-center md:justify-start items-center my-6">
        <div className="sm:w-full md:w-3/4 lg:w-2/5 flex flex-col items-center m-0 p-6 border border-gray-300 bg-gray-100 rounded-lg">
          <div className="w-full mb-4 flex justify-items-start items-center">
            <p className="text-xl font-semibold mx-2">
              Providers
            </p>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded mx-2 hover:bg-blue-600"
              onClick={() => { navigate('/addRestaurant') }}
            >
              Add
            </button>
          </div>
          {isLoading ?
            "DATA IS LOADING"
            :
            providers.map((object, index) => (
              <Card
                key={index}
                id={object.providerId}
                heading={object.providerName}
                subheading={object.providerHandle}
                link={`/provider/${object.providerHandle}`}
                stateData={object.providerHandle}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

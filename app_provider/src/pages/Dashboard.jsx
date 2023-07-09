import { useContext } from "react";
import { useQuery } from 'react-query';
import { AuthContext } from "../utils/AuthContextProvider";
import { getService } from "../utils/APIService";
import Card from "../components/Card"


export default function Dashboard() {
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
    ? "Welcome to the dashboard, " + user.displayName
    : "Unathenticated";

  return (
    <div className="dashboard">
      <h1 className="dashboard-header">{message}</h1>
      <div className="flex flex-col items-center mt-4">
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
        <Card
          key={0}
          id={0}
          heading="Add new provider"
          subheading="coolNewPlace"
          link={`/addRestaurant`}
        />
      </div>
    </div>
  );
}

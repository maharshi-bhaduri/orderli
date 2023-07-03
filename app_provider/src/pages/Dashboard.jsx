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
              id={object.provider_id}
              heading={object.provider_name}
              subheading={object.provider_handle}
              link={`/provider/${object.provider_handle}`}
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

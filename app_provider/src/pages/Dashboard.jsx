import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../utils/AuthContextProvider";
import axios from "axios";
import Cookies from "js-cookie";
import Card from "../components/Card"


export default function Dashboard() {
  const user = useContext(AuthContext);
  const [providers, setProviders] = useState([])
  const [isLoading, setIsLoading] = useState(true);

  const message = user
    ? "Welcome to the dashboard, " + user.displayName
    : "Unathenticated";

  useEffect(() => {
    if (providers.length > 0) {
      setIsLoading(false); // Set loading state to false
      return; // Exit the useEffect early
    }

    axios.get(
      import.meta.env.VITE_APP_GET_PROVIDERS,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: Cookies.get('token'),
          uid: Cookies.get('uid')
        },
      }
    )
      .then((response) => {
        // Handle the API response
        if (parseInt(response.status / 100) == 2) {
          setProviders(response.data);
        }
        else {
          //filler
        }
      })
      .catch((error) => {
        // Handle error
        console.error(error);
      });
  }, [])


  return (
    <div className="dashboard">
      <h1 className="dashboard-header">{message}</h1>
      <div className="flex flex-col items-center mt-4">
        {
          providers.map((object, index) => (
            <Card
              key={index}
              id={object.provider_id}
              heading={object.provider_name}
              subheading={object.provider_handle}
              link={`/provider/${object.provider_handle}`}
            />
          ))}
      </div>
    </div>
  );
}

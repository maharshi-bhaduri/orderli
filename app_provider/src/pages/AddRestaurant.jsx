import React from "react";
import axios from "axios";
import TextInput from "../components/TextInput";
import { useNavigate } from "react-router-dom";

export default function AddRestaurant(props) {
  let navigate = useNavigate();
  const [restaurantFormData, setRestaurantFormData] = React.useState({
    providerName: "",
    providerHandle: "",
    providerType: "cafe",
    about: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent form submission
    // Make the API request
    axios
      .post(
        import.meta.env.VITE_APP_CREATE_PROVIDER,
        JSON.stringify(restaurantFormData),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
            uid: localStorage.getItem("uid"),
          },
        }
      )
      .then((response) => {
        // Handle the API response
        console.log(response.data);
        props.onAdd(response.data)
        navigate(`/${restaurantFormData.providerHandle}`);
      })
      .catch((error) => {
        // Handle error
        console.error(error);
      });
  };

  function handleChange(event) {
    setRestaurantFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.name]: event.value,
      };
    });
    if (event.name == "providerName") {
      let handle = event.value.replace(/\s+/g, "").toLowerCase();
      setRestaurantFormData((prevFormData) => {
        return {
          ...prevFormData,
          providerHandle: handle,
        };
      });
    }
  }
  return (
    <div>
      <div className="restaurant">
        <h1 className="restaurant-header">Register yourself</h1>
        <form onSubmit={handleSubmit} className="restaurant-form">
          <TextInput
            labelName="Let's start with a name."
            name="providerName"
            inputHint="Your awesome place"
            value={restaurantFormData.providerName}
            multiLine={false}
            onChange={handleChange}
          />
          <TextInput
            labelName="This will be your handle at orderlee."
            name="providerHandle"
            prependText="orderlee.in/"
            inputHint="yourawesomeplace"
            value={restaurantFormData.providerHandle}
            multiLine={false}
            onChange={handleChange}
          />
          <TextInput
            labelName="Describe your place."
            name="about"
            inputHint="It's the best place."
            value={restaurantFormData.about}
            multiLine={true}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="bg-orderlee-primary-100 hover:bg-orderlee-primary-200 text-white font-bold py-2 px-4 rounded"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

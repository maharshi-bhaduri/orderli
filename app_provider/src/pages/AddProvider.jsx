import React from "react";
import axios from "axios";
import TextInput from "../components/TextInput";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import Cookies from "js-cookie";

export default function AddProvider() {
  let navigate = useNavigate();
  const [providerFormData, setProviderFormData] = React.useState({
    providerName: "",
    providerHandle: "",
    providerType: "cafe",
    about: "",
  });
  const [alert, setAlert] = React.useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent form submission
    // Make the API request
    axios
      .post(
        import.meta.env.VITE_APP_CREATE_PROVIDER,
        JSON.stringify(providerFormData),
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
          navigate(`/provider/${providerFormData.providerHandle}`,
            { state: response.data.data });
        }
        else {
          setAlert(response.data.operationStatus.message)
        }
      })
      .catch((error) => {
        // Handle error
        console.error(error);
        setAlert(error.response.data.operationStatus.message)
      });
  };

  function handleChange(event) {
    setProviderFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.name]: event.value,
      };
    });
    if (event.name == "providerName") {
      let handle = event.value.replace(/\s+/g, "").toLowerCase();
      setProviderFormData((prevFormData) => {
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
        {
          alert && <Alert heading='Oops' message={alert} />
        }
        <form onSubmit={handleSubmit} className="restaurant-form">
          <TextInput
            labelName="Let's start with a name."
            name="providerName"
            inputHint="Your awesome place"
            value={providerFormData.providerName}
            multiLine={false}
            onChange={handleChange}
          />
          <TextInput
            labelName="This will be your handle at orderlee."
            name="providerHandle"
            prependText="orderlee.in/"
            inputHint="yourawesomeplace"
            value={providerFormData.providerHandle}
            multiLine={false}
            onChange={handleChange}
          />
          <TextInput
            labelName="Describe your place."
            name="about"
            inputHint="It's the best place."
            value={providerFormData.about}
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

import React from "react";
import axios from "axios";
import TextInput from "../components/TextInput";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import Cookies from "js-cookie";

export default function AddPartner() {
  let navigate = useNavigate();
  const [partnerFormData, setPartnerFormData] = React.useState({
    partnerName: "",
    partnerHandle: "",
    partnerType: "cafe",
    about: "",
  });
  const [alert, setAlert] = React.useState("");

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent form submission
    // Make the API request
    axios
      .post(
        import.meta.env.VITE_APP_CREATE_PROVIDER,
        JSON.stringify(partnerFormData),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: Cookies.get("token"),
            uid: Cookies.get("uid"),
          },
        }
      )
      .then((response) => {
        // Handle the API response
        navigate(`/partner/${partnerFormData.partnerHandle}`);
      })
      .catch((error) => {
        // Handle error
        console.error(error);
        setAlert(error.response.data.operationStatus.message);
      });
  };

  function handleChange(event) {
    setPartnerFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.name]: event.value,
      };
    });
    if (event.name === "partnerName") {
      let handle = event.value.replace(/\s+/g, "").toLowerCase();
      setPartnerFormData((prevFormData) => {
        return {
          ...prevFormData,
          partnerHandle: handle,
        };
      });
    }
  }

  return (
    <div>
      <div className="restaurant mx-10 my-28">
        <h1 className="text-4xl">Register yourself</h1>
        {alert && <Alert heading="Oops" message={alert} />}
        <form onSubmit={handleSubmit} className="restaurant-form">
          <TextInput
            labelName="Let's start with a name."
            name="partnerName"
            inputHint="Your awesome place"
            value={partnerFormData.partnerName}
            multiLine={false}
            onChange={handleChange}
          />
          <TextInput
            labelName="This will be your handle at snaqr."
            name="partnerHandle"
            prependText="snaqr.com/"
            inputHint="yourawesomeplace"
            value={partnerFormData.partnerHandle}
            multiLine={false}
            onChange={handleChange}
          />
          <TextInput
            labelName="Describe your place."
            name="about"
            inputHint="It's the best place."
            value={partnerFormData.about}
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

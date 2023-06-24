import React from "react";
import Header from "../Header";
export default function SignUp() {
  const [signUpFormData, setSignUpFormData] = React.useState({
    restName: "",
    restInstagramId: "",
    restBlurb: "",
    restMenu: {},
  });
  console.log(signUpFormData);
  function handleChange(event) {
    setSignUpFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  }
  return (
    <div>
      <Header />
      <div className="signup">
        <h1 className="signup-header">Register yourself</h1>

        <form className="signup-form">
          <label>
            What's your restaurant called?
            <input
              type="text"
              placeholder="Restaurant Name"
              name="restName"
              value={signUpFormData.restName}
              onChange={handleChange}
            />
          </label>
          <label>
            How can we find your restaurant on instagram?
            <input
              type="text"
              name="restInstagramId"
              placeholder="IG Handle"
              value={signUpFormData.restInstagramId}
              onChange={handleChange}
            />
          </label>
          <label>
            Tell us something about yourself
            <textarea
              value={setSignUpFormData.restBlurb}
              name="restBlurb"
              placeholder="Tell us something about yourself"
              id=""
              rows="10"
              cols="30"
              onChange={handleChange}
            ></textarea>
          </label>
          <button className="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

import React from "react";
import { useQuery } from 'react-query';
import { getService } from "../utils/APIService";
import { useLocation, useNavigate } from "react-router-dom";

export default function Provider() {
  const location = useLocation();
  const navigate = useNavigate();
  const providerHandle = location.state ? location.state : location.pathname.split('/').pop();
  const { data: providerDetails, isLoading, isError } = useQuery(['provider', providerHandle],
    () =>
      getService(
        import.meta.env.VITE_APP_GET_PROVIDER_DETAILS,
        {
          providerHandle
        }
      )
      .then((response) => {
        return response.data[0]})
  )

  return (
    <div className="flex flex-col items-center mt-4">
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'blue' }}>{providerDetails?.provider_name}</h1>
      <img src={providerDetails?.qr_data}/>

      <p>Provider ID: {providerDetails?.provider_id}</p>
      <p>Provider Type: {providerDetails?.provider_type}</p>
      <p>Address: {providerDetails?.address}</p>
      <p>City: {providerDetails?.city}</p>
      <p>State: {providerDetails?.state}</p>
      <p>Country: {providerDetails?.country}</p>
      <p>Postal Code: {providerDetails?.postal_code}</p>
      <p>About: {providerDetails?.about}</p>
      <p>Contact No: {providerDetails?.contact_no}</p>
      <button onClick={() => { navigate(`/menu/${providerHandle}`) }}>hi</button>
    </div>
  );
}

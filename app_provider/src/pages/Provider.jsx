import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getService, postService } from "../utils/APIService";
import { useLocation, useNavigate } from "react-router-dom";

export default function Provider() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const providerHandle = location.state ? location.state : location.pathname.split('/').pop();

  const [isEditing, setIsEditing] = useState(false);
  const [updatedProviderDetails, setUpdatedProviderDetails] = useState({});
  const { data: providerDetails, isLoading, isError } = useQuery(['provider', providerHandle],
    () =>
      getService(
        import.meta.env.VITE_APP_GET_PROVIDER_DETAILS,
        {
          providerHandle
        }
      )
        .then((response) => {
          return response.data[0]
        }),
    {
      onSuccess: () => {
        setUpdatedProviderDetails({
          provider_id: providerDetails?.provider_id || null,
          provider_name: providerDetails?.provider_name || "",
          provider_type: providerDetails?.provider_type || "",
          address: providerDetails?.address || "",
          city: providerDetails?.city || "",
          state: providerDetails?.state || "",
          country: providerDetails?.country || "",
          postal_code: providerDetails?.postal_code || "",
          about: providerDetails?.about || "",
          contact_no: providerDetails?.contact_no || ""
        })
      }
    }
  );
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const { mutate: updateProviderDetails } = useMutation(
    (updatedProviderDetails) =>
      postService(import.meta.env.VITE_APP_UPDATE_PROVIDER_DETAILS, updatedProviderDetails),
    {
      onSuccess: () => {
        setIsEditing(false);
        queryClient.invalidateQueries(['provider', providerHandle]);
        console.log("Provider details updated successfully");
      },
      onError: (error) => {
        console.error("Failed to update provider details:", error);
      }
    }
  );

  const handleUpdateProviderDetails = () => {
    updateProviderDetails(updatedProviderDetails);
  };

  const cancelProviderDetailsUpdate = () => {
    setUpdatedProviderDetails(providerDetails);
    setIsEditing(false);
  };


  return (
    <div className="flex flex-col items-center mt-4">
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'blue' }}>{providerDetails?.provider_name}</h1>
      <img src={providerDetails?.qr_data} alt="QR Code" />

      <p>Provider ID: {providerDetails?.provider_id}</p>
      <p>
        Provider Name:{" "}
        {isEditing ? (
          <input
            type="text"
            value={updatedProviderDetails.provider_name}
            onChange={(e) =>
              setUpdatedProviderDetails({ ...updatedProviderDetails, provider_name: e.target.value })
            }
          />
        ) : (
          providerDetails?.provider_name
        )}
      </p>
      <p>
        Provider Type:{" "}
        {isEditing ? (
          <input
            type="text"
            value={updatedProviderDetails.provider_type}
            onChange={(e) =>
              setUpdatedProviderDetails({ ...updatedProviderDetails, provider_type: e.target.value })
            }
          />
        ) : (
          providerDetails?.provider_type
        )}
      </p>
      <p>
        Address:{" "}
        {isEditing ? (
          <input
            type="text"
            value={updatedProviderDetails.address}
            onChange={(e) =>
              setUpdatedProviderDetails({ ...updatedProviderDetails, address: e.target.value })
            }
          />
        ) : (
          providerDetails?.address
        )}
      </p>
      <p>
        City:{" "}
        {isEditing ? (
          <input
            type="text"
            value={updatedProviderDetails.city}
            onChange={(e) =>
              setUpdatedProviderDetails({ ...updatedProviderDetails, city: e.target.value })
            }
          />
        ) : (
          providerDetails?.city
        )}
      </p>
      <p>
        State:{" "}
        {isEditing ? (
          <input
            type="text"
            value={updatedProviderDetails.state}
            onChange={(e) =>
              setUpdatedProviderDetails({ ...updatedProviderDetails, state: e.target.value })
            }
          />
        ) : (
          providerDetails?.state
        )}
      </p>
      <p>
        Country:{" "}
        {isEditing ? (
          <input
            type="text"
            value={updatedProviderDetails.country}
            onChange={(e) =>
              setUpdatedProviderDetails({ ...updatedProviderDetails, country: e.target.value })
            }
          />
        ) : (
          providerDetails?.country
        )}
      </p>
      <p>
        Postal Code:{" "}
        {isEditing ? (
          <input
            type="text"
            value={updatedProviderDetails.postal_code}
            onChange={(e) =>
              setUpdatedProviderDetails({ ...updatedProviderDetails, postal_code: e.target.value })
            }
          />
        ) : (
          providerDetails?.postal_code
        )}
      </p>
      <p>
        About:{" "}
        {isEditing ? (
          <input
            type="text"
            value={updatedProviderDetails.about}
            onChange={(e) =>
              setUpdatedProviderDetails({ ...updatedProviderDetails, about: e.target.value })
            }
          />
        ) : (
          providerDetails?.about
        )}
      </p>
      <p>
        Contact No:{" "}
        {isEditing ? (
          <input
            type="text"
            value={updatedProviderDetails.contact_no}
            onChange={(e) =>
              setUpdatedProviderDetails({ ...updatedProviderDetails, contact_no: e.target.value })
            }
          />
        ) : (
          providerDetails?.contact_no
        )}
      </p>
      {isEditing ? (
        <>
          <button onClick={handleUpdateProviderDetails}>Save</button>
          <button onClick={cancelProviderDetailsUpdate}>Cancel</button>
        </>
      ) : (
        <button onClick={handleEditClick}>Edit</button>
      )}
      <button onClick={() => { navigate(`/menu/${providerHandle}`) }}>Menu</button>
    </div>
  );
}
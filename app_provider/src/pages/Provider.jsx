import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getService, postService } from "../utils/APIService";
import { useLocation, useNavigate } from "react-router-dom";

export default function Provider() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  console.log(location.state)
  const providerHandle = location.pathname.split('/').pop();

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
      <h1 className="text-2xl font-bold text-blue-500">{providerDetails?.provider_name}</h1>
      <img src={providerDetails?.qr_data} alt="QR Code" className="mt-4" />
      <div className="mt-4 rounded">
        <table className="w-full mt-4 rounded">
          <tbody>
            <tr>
              <th className="py-2 px-4 bg-gray-100">Provider ID</th>
              <td className="py-2 px-4">{providerDetails?.provider_id}</td>
            </tr>
            <tr>
              <th className="py-2 px-4 bg-gray-100">Provider Name</th>
              <td className="py-2 px-4">
                {isEditing ? (
                  <input
                    type="text"
                    value={updatedProviderDetails.provider_name}
                    onChange={(e) =>
                      setUpdatedProviderDetails({ ...updatedProviderDetails, provider_name: e.target.value })
                    }
                    className="border border-gray-300 px-2 py-1 rounded"
                  />
                ) : (
                  providerDetails?.provider_name
                )}
              </td>
            </tr>
            <tr>
              <th className="py-2 px-4 bg-gray-100">Provider Type</th>
              <td className="py-2 px-4">
                {isEditing ? (
                  <input
                    type="text"
                    value={updatedProviderDetails.provider_type}
                    onChange={(e) =>
                      setUpdatedProviderDetails({ ...updatedProviderDetails, provider_type: e.target.value })
                    }
                    className="border border-gray-300 px-2 py-1 rounded"
                  />
                ) : (
                  providerDetails?.provider_type
                )}
              </td>
            </tr>
            <tr>
              <th className="py-2 px-4 bg-gray-100">Address</th>
              <td className="py-2 px-4">
                {isEditing ? (
                  <input
                    type="text"
                    value={updatedProviderDetails.address}
                    onChange={(e) =>
                      setUpdatedProviderDetails({ ...updatedProviderDetails, address: e.target.value })
                    }
                    className="border border-gray-300 px-2 py-1 rounded"
                  />
                ) : (
                  providerDetails?.address
                )}
              </td>
            </tr>
            <tr>
              <th className="py-2 px-4 bg-gray-100">City</th>
              <td className="py-2 px-4">
                {isEditing ? (
                  <input
                    type="text"
                    value={updatedProviderDetails.city}
                    onChange={(e) =>
                      setUpdatedProviderDetails({ ...updatedProviderDetails, city: e.target.value })
                    }
                    className="border border-gray-300 px-2 py-1 rounded"
                  />
                ) : (
                  providerDetails?.city
                )}
              </td>
            </tr>
            <tr>
              <th className="py-2 px-4 bg-gray-100">State</th>
              <td className="py-2 px-4">
                {isEditing ? (
                  <input
                    type="text"
                    value={updatedProviderDetails.state}
                    onChange={(e) =>
                      setUpdatedProviderDetails({ ...updatedProviderDetails, state: e.target.value })
                    }
                    className="border border-gray-300 px-2 py-1 rounded"
                  />
                ) : (
                  providerDetails?.state
                )}
              </td>
            </tr>
            <tr>
              <th className="py-2 px-4 bg-gray-100">Country</th>
              <td className="py-2 px-4">
                {isEditing ? (
                  <input
                    type="text"
                    value={updatedProviderDetails.country}
                    onChange={(e) =>
                      setUpdatedProviderDetails({ ...updatedProviderDetails, country: e.target.value })
                    }
                    className="border border-gray-300 px-2 py-1 rounded"
                  />
                ) : (
                  providerDetails?.country
                )}
              </td>
            </tr>
            <tr>
              <th className="py-2 px-4 bg-gray-100">Postal Code</th>
              <td className="py-2 px-4">
                {isEditing ? (
                  <input
                    type="text"
                    value={updatedProviderDetails.postal_code}
                    onChange={(e) =>
                      setUpdatedProviderDetails({ ...updatedProviderDetails, postal_code: e.target.value })
                    }
                    className="border border-gray-300 px-2 py-1 rounded"
                  />
                ) : (
                  providerDetails?.postal_code
                )}
              </td>
            </tr>
            <tr>
              <th className="py-2 px-4 bg-gray-100">About</th>
              <td className="py-2 px-4">
                {
                  isEditing ? (
                    <input
                      type="text"
                      value={updatedProviderDetails.about}
                      onChange={(e) =>
                        setUpdatedProviderDetails({ ...updatedProviderDetails, about: e.target.value })
                      }
                      className="border border-gray-300 px-2 py-1 rounded"
                    />
                  ) : (
                    providerDetails?.about
                  )}
              </td>
            </tr>
            <tr>
              <th className="py-2 px-4 bg-gray-100">Contact No</th>
              <td className="py-2 px-4">
                {isEditing ? (
                  <input
                    type="text"
                    value={updatedProviderDetails.contact_no}
                    onChange={(e) =>
                      setUpdatedProviderDetails({ ...updatedProviderDetails, contact_no: e.target.value })
                    }
                    className="border border-gray-300 px-2 py-1 rounded"
                  />
                ) : (
                  providerDetails?.contact_no
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {isEditing ? (
        <div className="mt-4">
          <button
            onClick={handleUpdateProviderDetails}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mr-2"
          >
            Save
          </button>
          <button
            onClick={cancelProviderDetailsUpdate}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={handleEditClick}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-4"
        >
          Edit
        </button>
      )}

      <button
        onClick={() => navigate(`/menu/${providerHandle}`)}
        className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 mt-4"
      >
        Menu
      </button>
    </div>
  );
}
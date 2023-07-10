import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getService, postService } from "../utils/APIService";
import { useLocation, useNavigate } from "react-router-dom";

export default function Provider() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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
          providerId: providerDetails?.providerId || null,
          providerName: providerDetails?.providerName || "",
          providerType: providerDetails?.providerType || "",
          address: providerDetails?.address || "",
          city: providerDetails?.city || "",
          state: providerDetails?.state || "",
          country: providerDetails?.country || "",
          postalCode: providerDetails?.postalCode || "",
          about: providerDetails?.about || "",
          contactNo: providerDetails?.contactNo || ""
        })
      },
      onError: (response) => {
console.log(response)
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

  const { mutate: deleteProvider } = useMutation(
    (providerId) =>
      postService(import.meta.env.VITE_APP_DELETE_PROVIDER, { providerId }),
    {
      onSuccess: () => {
        navigate('/dashboard')
        queryClient.invalidateQueries('providers');
        console.log("Provider deleted successfully");
      },
      onError: (error) => {
        console.error("Failed to update provider details:", error);
      }
    }
  );

  const handleUpdateProviderDetails = () => {
    updateProviderDetails(updatedProviderDetails);
  };

  const handleDeleteProvider = () => {
    deleteProvider(providerDetails.providerId);
  };

  const cancelProviderDetailsUpdate = () => {
    setUpdatedProviderDetails(providerDetails);
    setIsEditing(false);
  };


  return (
    <div className="flex flex-col items-center mt-4">
      <h1 className="text-2xl font-bold text-blue-500">{providerDetails?.providerName}</h1>
      <img src={providerDetails?.qrData} alt="QR Code" className="mt-4" />
      <div className="mt-4 rounded">
        <table className="w-full mt-4 rounded">
          <tbody>
            <tr>
              <th className="py-2 px-4 bg-gray-100">Provider ID</th>
              <td className="py-2 px-4">{providerDetails?.providerId}</td>
            </tr>
            <tr>
              <th className="py-2 px-4 bg-gray-100">Provider Name</th>
              <td className="py-2 px-4">
                {isEditing ? (
                  <input
                    type="text"
                    value={updatedProviderDetails.providerName}
                    onChange={(e) =>
                      setUpdatedProviderDetails({ ...updatedProviderDetails, providerName: e.target.value })
                    }
                    className="border border-gray-300 px-2 py-1 rounded"
                  />
                ) : (
                  providerDetails?.providerName
                )}
              </td>
            </tr>
            <tr>
              <th className="py-2 px-4 bg-gray-100">Provider Type</th>
              <td className="py-2 px-4">
                {isEditing ? (
                  <input
                    type="text"
                    value={updatedProviderDetails.providerType}
                    onChange={(e) =>
                      setUpdatedProviderDetails({ ...updatedProviderDetails, providerType: e.target.value })
                    }
                    className="border border-gray-300 px-2 py-1 rounded"
                  />
                ) : (
                  providerDetails?.providerType
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
                    value={updatedProviderDetails.postalCode}
                    onChange={(e) =>
                      setUpdatedProviderDetails({ ...updatedProviderDetails, postalCode: e.target.value })
                    }
                    className="border border-gray-300 px-2 py-1 rounded"
                  />
                ) : (
                  providerDetails?.postalCode
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
                    value={updatedProviderDetails.contactNo}
                    onChange={(e) =>
                      setUpdatedProviderDetails({ ...updatedProviderDetails, contactNo: e.target.value })
                    }
                    className="border border-gray-300 px-2 py-1 rounded"
                  />
                ) : (
                  providerDetails?.contactNo
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
      <button
        onClick={() => handleDeleteProvider()}
        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mx-2"
      >
        Delete
      </button>
    </div>
  );
}
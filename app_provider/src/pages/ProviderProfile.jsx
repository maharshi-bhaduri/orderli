import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useParams } from "react-router-dom";
import { postService } from "../utils/APIService";
import { getProfile } from "../utils/queryService";
import { useNavigate } from "react-router-dom";
import BorderedPallete from "../components/BorderedPallete";
import InfoGrid from "../components/InfoGrid";
import Dropdown from "../components/Dropdown";

export default function ProviderProfile() {
  const { providerHandle } = useParams();
  const { data: providerDetails, isLoading: isProfileLoading, isError: isProfileError } = getProfile(providerHandle)
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProviderDetails, setUpdatedProviderDetails] = useState({});
  const navigate = useNavigate();

  const businessInfolist = [
    {
      key: "Name",
      value: providerDetails?.providerName
    },
    {
      key: "Handle",
      value: providerDetails?.providerHandle
    },
    {
      key: "Type",
      value: providerDetails?.providerType
    },
    {
      key: "About",
      value: providerDetails?.about
    },
    {
      key: "Website",
      value: providerDetails?.website
    },
    {
      key: "Contact",
      value: providerDetails?.contactNo
    },
  ]

  const locationInfolist = [
    {
      key: "Address",
      value: providerDetails?.address
    },
    {
      key: "State",
      value: providerDetails?.state
    },
    {
      key: "City",
      value: providerDetails?.city
    },
    {
      key: "Zip Code",
      value: providerDetails?.postalCode
    },
    {
      key: "Country",
      value: providerDetails?.country
    },
  ]

  const socialInfolist = [
    {
      key: "Social Account 1",
      value: providerDetails?.social1
    },
    {
      key: "Social Account 2",
      value: providerDetails?.social2
    },
    {
      key: "Social Account 3",
      value: providerDetails?.social3
    },
  ]

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

  const cancelProviderDetailsUpdate = () => {
    setUpdatedProviderDetails(providerDetails);
    setIsEditing(false);
  };


  return (
    <div className="w-full px-8 flex flex-col items-center">
      <div className="w-full my-6">
        <header className="text-2xl font-medium">Profile</header>
      </div>
      <div
        className={"rounded-lg bg-white " +
          "w-full p-5 transition ease-in-out flex flex-col justify-around items-center"}
      >
        <BorderedPallete>
          <div className="flex flex-col items-center">
            <img src={providerDetails?.qrData}
              alt="QR Code"
              className="transition-transform hover:scale-110 cursor-pointer"
            />
          </div>
          <div className="m-4 border h-3/4">
          </div>
          <InfoGrid
            cols={2}
            title='Business Details'
            infoList={businessInfolist}
          />
        </BorderedPallete>

        <BorderedPallete>
          <InfoGrid
            cols={2}
            title='Location Details'
            infoList={locationInfolist}
          />
        </BorderedPallete>
        <BorderedPallete>
          <InfoGrid
            cols={2}
            title='Social Media'
            infoList={socialInfolist}
          />
        </BorderedPallete>
        <table className="w-full mt-4">
          <tbody>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Address</th>
              <td className="py-2 px-4 text-left">
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
            <tr className="bg-gray-50">
              <th className="py-2 px-4 text-left">City</th>
              <td className="py-2 px-4 text-left">
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
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">State</th>
              <td className="py-2 px-4 text-left">
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
            <tr className="bg-gray-50">
              <th className="py-2 px-4 text-left">Country</th>
              <td className="py-2 px-4 text-left">
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
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Postal Code</th>
              <td className="py-2 px-4 text-left">
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
            <tr className="bg-gray-50">
              <th className="py-2 px-4 text-left">About</th>
              <td className="py-2 px-4 text-left">
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
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Contact No</th>
              <td className="py-2 px-4 text-left">
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
            onClick={() => { updateProviderDetails(updatedProviderDetails) }}
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
          onClick={() => { setIsEditing(true); }}
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
        onClick={() => { deleteProvider(providerDetails.providerId) }}
        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mx-2"
      >
        Delete
      </button>
    </div>
  );
}
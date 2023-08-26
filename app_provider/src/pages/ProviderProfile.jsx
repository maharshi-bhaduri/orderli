import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useParams } from "react-router-dom";
import { postService } from "../utils/APIService";
import { getProfile } from "../utils/queryService";
import { useNavigate } from "react-router-dom";
import BorderedPallete from "../components/BorderedPallete";
import InfoGrid from "../components/InfoGrid";
import GraphicButton from "../components/GraphicButton";
import Loader from "../components/Loader";

export default function ProviderProfile() {
  const { providerHandle } = useParams();
  const { data: providerDetails, isLoading: isProfileLoading, isError: isProfileError } = getProfile(providerHandle)
  const [editable, setEditable] = useState(false)
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [providerDetailsReplica, setProviderDetailsReplica] = useState(null)
  const [profileUpdated, setProfileUpdated] = useState(false);

  useEffect(() => {
    setProviderDetailsReplica(providerDetails);
  }, [providerDetails])

  useEffect(() => {
    if (providerDetails && providerDetailsReplica) {
      setProfileUpdated(providerDetails !== providerDetailsReplica);
    }
  }, [providerDetails, providerDetailsReplica])

  let businessInfolist = [
    {
      label: "Name",
      value: providerDetailsReplica?.providerName,
      key: "providerName"
    },
    {
      label: "Handle",
      value: providerDetailsReplica?.providerHandle,
      key: "providerHandle"
    },
    {
      label: "Type",
      value: providerDetailsReplica?.providerType,
      key: "providerType"
    },
    {
      label: "About",
      value: providerDetailsReplica?.about,
      key: "about"
    },
    {
      label: "Website",
      value: providerDetailsReplica?.website,
      key: "website"
    },
    {
      label: "Contact",
      value: providerDetailsReplica?.contactNo,
      key: "contactNo"
    },
  ];

  const locationInfolist = [
    {
      label: "Address",
      value: providerDetailsReplica?.address,
      key: "address"
    },
    {
      label: "State",
      value: providerDetailsReplica?.state,
      key: "state"
    },
    {
      label: "City",
      value: providerDetailsReplica?.city,
      key: "city"
    },
    {
      label: "Zip Code",
      value: providerDetailsReplica?.postalCode,
      key: "postalCode"
    },
    {
      label: "Country",
      value: providerDetailsReplica?.country,
      key: "country"
    },
  ]

  const socialInfolist = [
    {
      label: "Social Account 1",
      value: providerDetailsReplica?.social1,
      key: "social1"
    },
    {
      label: "Social Account 2",
      value: providerDetailsReplica?.social2,
      key: "social2"
    },
    {
      label: "Social Account 3",
      value: providerDetailsReplica?.social3,
      key: "social3"
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

  return (
    <div className="w-full flex flex-col items-center my-2">
      <div
        className="rounded-lg bg-white shadow-md p-5 h-[calc(100vh-32px)] overflow-y-auto
          w-full flex flex-col items-center"
      >
        {isProfileLoading ?
          <div className="w-full h-full flex items-center justify-center">
            <Loader></Loader>
          </div>
          :
          <>
            <div className="w-full flex justify-between">
              {
                editable ?
                  (
                    <>
                      <GraphicButton
                        text="Save"
                        onClick={() => {
                          setEditable(false);
                          updateProviderDetails(providerDetailsReplica);
                        }}
                      />
                      <GraphicButton
                        text="Cancel"
                        onClick={() => {
                          setProviderDetailsReplica(providerDetails)
                          setEditable(false);
                        }}
                      />
                    </>
                  ) :
                  <GraphicButton
                    text="Unlock"
                    onClick={() => setEditable(true)}
                  >
                    <span className="material-symbols-outlined">
                      lock_open
                    </span>
                  </GraphicButton>
              }
            </div>
            <BorderedPallete
              title='Business Details'>
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
                infoList={businessInfolist}
                editable={editable}
                onChange={(e) => {
                  setProviderDetailsReplica({ ...providerDetailsReplica, ...e });
                }}
              />
            </BorderedPallete>

            <BorderedPallete
              title='Location Details'>
              <InfoGrid
                cols={2}
                infoList={locationInfolist}
                editable={editable}
                onChange={(e) => {
                  setProviderDetailsReplica({ ...providerDetailsReplica, ...e });
                }}
              />
            </BorderedPallete>
            <BorderedPallete
              title='Social Media'>
              <InfoGrid
                cols={2}
                infoList={socialInfolist}
                editable={editable}
                onChange={(e) => {
                  setProviderDetailsReplica({ ...providerDetailsReplica, ...e });
                }}
              />
            </BorderedPallete>
          </>
        }
      </div>
    </div>
  );
}
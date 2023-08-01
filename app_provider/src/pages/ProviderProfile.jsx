import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useParams } from "react-router-dom";
import { postService } from "../utils/APIService";
import { getProfile } from "../utils/queryService";
import { useNavigate } from "react-router-dom";
import BorderedPallete from "../components/BorderedPallete";
import InfoGrid from "../components/InfoGrid";
import GraphicButton from "../components/GraphicButton";

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

  // const deepEqual = (object1, object2) => {
  //   const keys1 = Object.keys(object1);
  //   const keys2 = Object.keys(object2);

  //   if (keys1.length !== keys2.length) {
  //     console.log("1")
  //     return false;
  //   }

  //   for (const key of keys1) {
  //     const val1 = object1[key];
  //     const val2 = object2[key];
  //     const areObjects =
  //       typeof val1 === "object" && typeof val2 === "object";

  //     if (
  //       (areObjects && !deepEqual(val1, val2)) ||
  //       (!areObjects && val1 !== val2)
  //     ) {
  //       return false;
  //     }
  //   }

  //   return true;
  // };

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
    <div className="w-full px-8 mb-10 flex flex-col items-center">
      <div className="w-full my-6 flex justify-between">
        <header className="text-2xl font-medium">Profile</header>
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
      <div
        className={"rounded-lg bg-white " +
          "w-full px-5 pt-5 transition ease-in-out flex flex-col justify-around items-center"}
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
            editable={editable}
            onChange={(e) => {
              setProviderDetailsReplica({ ...providerDetailsReplica, ...e });
            }}
          />
        </BorderedPallete>

        <BorderedPallete>
          <InfoGrid
            cols={2}
            title='Location Details'
            infoList={locationInfolist}
            editable={editable}
            onChange={(e) => {
              setProviderDetailsReplica({ ...providerDetailsReplica, ...e });
            }}
          />
        </BorderedPallete>
        <BorderedPallete>
          <InfoGrid
            cols={2}
            title='Social Media'
            infoList={socialInfolist}
            editable={editable}
            onChange={(e) => {
              setProviderDetailsReplica({ ...providerDetailsReplica, ...e });
            }}
          />
        </BorderedPallete>
      </div>
    </div>
  );
}
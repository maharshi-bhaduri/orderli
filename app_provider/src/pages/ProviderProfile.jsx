import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useParams } from "react-router-dom";
import { postService } from "../utils/APIService";
import { getProfile } from "../utils/queryService";
import BorderedPallete from "../components/BorderedPallete";
import InfoGrid from "../components/InfoGrid";
import { hasDifference } from "../utils/common";
import Loader from "../components/Loader";

export default function PartnerProfile() {
  const { partnerHandle } = useParams();
  const { data: partnerDetails, isLoading: isProfileLoading, isError: isProfileError } = getProfile(partnerHandle)
  const [editable, setEditable] = useState(true);
  const [updating, setUpdating] = useState(false)
  const queryClient = useQueryClient();
  const [partnerDetailsReplica, setPartnerDetailsReplica] = useState(null);

  useEffect(() => {
    setPartnerDetailsReplica(partnerDetails);
  }, [partnerDetails])
  console.log('partnerDetails', partnerDetails)
  console.log('isProfileLoading', isProfileLoading)
  console.log('isProfileError', isProfileError)

  let businessInfolist = [
    {
      label: "Name",
      value: partnerDetailsReplica?.partnerName,
      key: "partnerName"
    },
    {
      label: "Handle",
      value: partnerDetailsReplica?.partnerHandle,
      key: "partnerHandle"
    },
    {
      label: "Type",
      value: partnerDetailsReplica?.partnerType,
      key: "partnerType"
    },
    {
      label: "About",
      value: partnerDetailsReplica?.about,
      key: "about"
    },
    {
      label: "Website",
      value: partnerDetailsReplica?.website,
      key: "website"
    },
    {
      label: "Contact",
      value: partnerDetailsReplica?.contactNo,
      key: "contactNo"
    },
  ];

  const locationInfolist = [
    {
      label: "Address",
      value: partnerDetailsReplica?.address,
      key: "address"
    },
    {
      label: "State",
      value: partnerDetailsReplica?.state,
      key: "state"
    },
    {
      label: "City",
      value: partnerDetailsReplica?.city,
      key: "city"
    },
    {
      label: "Zip Code",
      value: partnerDetailsReplica?.postalCode,
      key: "postalCode"
    },
    {
      label: "Country",
      value: partnerDetailsReplica?.country,
      key: "country"
    },
  ]

  const socialInfolist = [
    {
      label: "Social Account 1",
      value: partnerDetailsReplica?.social1,
      key: "social1"
    },
    {
      label: "Social Account 2",
      value: partnerDetailsReplica?.social2,
      key: "social2"
    },
    {
      label: "Social Account 3",
      value: partnerDetailsReplica?.social3,
      key: "social3"
    },
  ]

  const { mutate: updatePartnerDetails } = useMutation(
    (updatedPartnerDetails) =>
      postService(import.meta.env.VITE_APP_UPDATE_PROVIDER_DETAILS, updatedPartnerDetails),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['partner', partnerHandle]);
        console.log("Partner details updated successfully");
      },
      onError: (error) => {
        console.error("Failed to update partner details:", error);
      }
    }
  );

  const updateDetails = async () => {
    if (hasDifference(partnerDetails, partnerDetailsReplica)) {
      setUpdating(true);
      updatePartnerDetails(partnerDetailsReplica)
    }
  };


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
            <BorderedPallete
              title='Business Details'>
              <div className="flex flex-col items-center">
                <img src={partnerDetails?.qrData}
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
                  setPartnerDetailsReplica({ ...partnerDetailsReplica, ...e });
                }}
                onUpdate={updateDetails}
              />
            </BorderedPallete>

            <BorderedPallete
              title='Location Details'>
              <InfoGrid
                cols={2}
                infoList={locationInfolist}
                editable={editable}
                onChange={(e) => {
                  setPartnerDetailsReplica({ ...partnerDetailsReplica, ...e });
                }}
                onUpdate={updateDetails}
              />
            </BorderedPallete>
            <BorderedPallete
              title='Social Media'>
              <InfoGrid
                cols={2}
                infoList={socialInfolist}
                editable={editable}
                onChange={(e) => {
                  setPartnerDetailsReplica({ ...partnerDetailsReplica, ...e });
                }}
                onUpdate={updateDetails}
              />
            </BorderedPallete>
          </>
        }
      </div>
    </div>
  );
}

import GraphicButton from "../components/GraphicButton";
import { useMutation } from "@tanstack/react-query";
import { postService } from "../utils/APIService";
import { getProfile } from "../utils/queryService";
import { useNavigate, useParams } from "react-router-dom";
import Dropdown from "../components/Dropdown";
import { useEffect, useState } from "react";
export default function ProviderSettings() {
  const [currency, setCurrency] = useState("Set");
  const options = {
    USD: "US Dollar",
    INR: "Indian Ruppee",
    SGD: "Singapore Dollar",
    HKD: "Hongkong Dollar",
  };
  const handleDropdownChange = (value) => {
    setCurrency((oldValue) => {
      // console.log("old value", oldValue);
      // console.log("new value", value);
      setIsChanged(value !== oldValue ? true : false);

      return value;
    });
  };
  const [syncState, setSyncState] = useState("synced"); // 'synced', 'sync', 'syncing'
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    setSyncState(isChanged ? "sync" : "synced");
    // console.log("is value changed", isChanged);
  }, [currency]);
  const { providerHandle } = useParams();
  const { partnerHandle } = useParams();
  const {
    data: providerDetails,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = getProfile(providerHandle);
  const navigate = useNavigate();
  const handleSync = async () => {
    setSyncState("syncing");
    console.log("partner handle and currency", partnerHandle, currency);
    updateCurrency({ partnerHandle, currency });
    // call db to make db changes
  };
  const { mutate: updateCurrency } = useMutation(
    (data) => postService(import.meta.env.VITE_APP_UPDATE_CONFIG, data),
    {
      onSuccess: () => {
        console.log("Currency Set to:", currency);
        setSyncState("synced");
      },
      onError: (err) => {
        console.error("Failed to set currency", err);
      },
    }
  );

  const { mutate: deleteProvider } = useMutation(
    (providerId) =>
      postService(
        import.meta.env.VITE_APP_DELETE_PROVIDER_REMOVE_THIS_TO_UNBLOCK,
        { providerId }
      ),
    {
      onSuccess: () => {
        navigate("/account");
        queryClient.invalidateQueries("providers");
        console.log("Provider deleted successfully");
      },
      onError: (error) => {
        console.error("Failed to update provider details:", error);
      },
    }
  );

  return (
    <div className="w-full px-4 flex flex-col items-center">
      <div className="flex justify-between w-full">
        <div className="my-4">
          <p className="font-semibold ">Provider Settings </p>
        </div>
        <div className=" w-auto flex items-center ">
          {syncState === "syncing" && (
            <GraphicButton buttonStyle="bluefill" disabled={true}>
              Syncing
              <span className="ml-2 relative flex justify-center items-center w-full h-full">
                <span className="w-3/ h-3/4 border-8 border-solid border-transparent border-t-blue-500 border-b-blue-500 rounded-full animate-spin"></span>
              </span>
            </GraphicButton>
          )}
          {syncState === "sync" && (
            <GraphicButton
              buttonStyle="bluefill"
              onClick={handleSync}
              disabled={false}
            >
              Sync
            </GraphicButton>
          )}
          {syncState === "synced" && (
            <GraphicButton buttonStyle="greenline" disabled={true}>
              Synced
              <span className="material-symbols-outlined ml-2">
                check_circle
              </span>
            </GraphicButton>
          )}
        </div>
      </div>
      <div
        className={
          "rounded-lg bg-white " +
          "w-full p-5 transition ease-in-out flex flex-col justify-around items-center"
        }
      >
        <div
          className="p-4 flex items-center justify-between border border-red-500
        rounded-lg w-full bg-red-100"
        >
          <div>
            Delete partner profile
            <div
              className="inline text-sm italic font-semibold 
           text-gray-500"
            >
              {" "}
              (this will permanently remove your profile)
            </div>
          </div>
          <GraphicButton
            text="Delete"
            buttonStyle="red"
            onClick={() => {
              deleteProvider(providerDetails.providerId);
            }}
          >
            <span className="material-symbols-outlined">delete</span>
          </GraphicButton>
        </div>
        <div className="mt-4 p-4 items-center w-full flex justify-between bg-blue-100 border border-blueGray-600 rounded-lg">
          <div>
            Set local currency
            <div className="inline text-sm italic font-semibold text-gray-500">
              {" "}
              (this currency will be set against your menu)
            </div>
          </div>
          <div className="">
            <Dropdown
              selectedOption={currency}
              handleSelectChange={handleDropdownChange}
              options={Object.keys(options)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

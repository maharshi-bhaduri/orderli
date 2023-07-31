import GraphicButton from "../components/GraphicButton";
import { useMutation } from "react-query";
import { postService } from "../utils/APIService";
import { getProfile } from "../utils/queryService";
import { useNavigate, useParams } from "react-router-dom";

export default function ProviderSettings() {
  const { providerHandle } = useParams();
  const { data: providerDetails, isLoading: isProfileLoading, isError: isProfileError } = getProfile(providerHandle)
  const navigate = useNavigate()

  const { mutate: deleteProvider } = useMutation(
    (providerId) =>
      postService(import.meta.env.VITE_APP_DELETE_PROVIDER_REMOVE_THIS_TO_UNBLOCK, { providerId }),
    {
      onSuccess: () => {
        navigate('/account')
        queryClient.invalidateQueries('providers');
        console.log("Provider deleted successfully");
      },
      onError: (error) => {
        console.error("Failed to update provider details:", error);
      }
    }
  );

  return (
    <div className="w-full px-8 flex flex-col items-center">
      <div className="w-full my-6">
        <header className="text-2xl font-medium">Profile Settings</header>
      </div>
      <div
        className={"rounded-lg bg-white " +
          "w-full p-5 transition ease-in-out flex flex-col justify-around items-center"}
      >
        <div className="p-4 flex items-center justify-between border border-red-500
        rounded-lg w-full bg-red-100">
          <div>
            Delete partner profile
            <div className="inline text-sm italic font-semibold 
           text-gray-500"> (this will permanently remove your profile)
            </div>
          </div>
          <GraphicButton
            text="Delete"
            buttonStyle="red"
            onClick={() => { deleteProvider(providerDetails.providerId) }}
          >
            <span className="material-symbols-outlined">
              delete
            </span>
          </GraphicButton>
        </div>
      </div>
    </div>
  );
}
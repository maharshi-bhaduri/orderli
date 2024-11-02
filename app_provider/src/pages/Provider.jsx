import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ProviderProfile from "./ProviderProfile";
import ProviderDefault from "./ProviderDefault";
import { optionMap } from "../utils/optionMap";
import { getMenu, getProfile, getFeedback } from "../utils/queryService";
import { Routes, Route } from "react-router-dom";
import ProviderMenu from "./ProviderMenu";
import { useParams } from "react-router-dom";
import ProviderFeedback from "./ProviderFeedback";
import ProviderSettings from "./ProviderSettings";
export default function Provider() {
  const location = useLocation();
  const { providerHandle } = useParams();
  getProfile(providerHandle);
  getMenu(providerHandle);
  getFeedback(providerHandle);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-200">
      <Sidebar optionMap={optionMap} />
      <div className="mx-2 mr-2 flex flex-grow flex-wrap w-full">
        <Routes>
          <Route path={`/`} element={<ProviderDefault />} />
          <Route path={`/profile`} element={<ProviderProfile />} />
          <Route path={`/menu`} element={<ProviderMenu />} />
          <Route path={`/feedback`} element={<ProviderFeedback />} />
          <Route path={`/settings`} element={<ProviderSettings />} />
        </Routes>
      </div>
    </div>
  );
}

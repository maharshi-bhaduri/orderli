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
  const { partnerHandle } = useParams();
  getProfile(partnerHandle);
  getMenu(partnerHandle);
  getFeedback(partnerHandle);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-200">
      <Sidebar optionMap={optionMap} />
      <div className="mr-2 flex flex-grow flex-wrap w-full rounded-lg my-2 bg-white shadow-md">
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

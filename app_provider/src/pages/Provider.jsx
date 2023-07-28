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
export default function Provider() {
  const location = useLocation();
  const { providerHandle } = useParams();
  getProfile(providerHandle);
  getMenu(providerHandle);
  getFeedback(providerHandle);

  return (
    <div className="flex mt-16 h-[calc(100vh-80px)] overflow-hidden">
      <Sidebar optionMap={optionMap} />
      <div className="rounded-tl-lg flex flex-grow flex-wrap w-full
      md:w-3/4 h-[calc(100vh-80px)] overflow-y-auto bg-gray-100">
        <Routes>
          <Route path={`/profile`} element={<ProviderProfile />} />
          <Route path={`/menu`} element={<ProviderMenu />} />
          <Route path={`/`} element={<ProviderDefault />} />
          <Route path={`/feedback`} element={<ProviderFeedback />} />
        </Routes>
      </div>
    </div>
  );
}

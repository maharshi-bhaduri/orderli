import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ProviderProfile from "./ProviderProfile";
import ProviderDefault from "./ProviderDefault";
import { optionMap } from "../utils/optionMap";
import { getMenu, getProfile } from "../utils/queryService";
import { Routes, Route } from "react-router-dom";
import ProviderMenu from "./ProviderMenu";
import { useParams } from "react-router-dom";

export default function Provider() {
  const location = useLocation();
  const { providerHandle } = useParams();
  getProfile(providerHandle);
  getMenu(providerHandle);

  return (
    <div className="flex mt-20 h-[calc(100vh-80px)] overflow-hidden">
      <Sidebar optionMap={optionMap} />
      <div className="flex flex-grow flex-wrap w-full md:w-3/4 h-[calc(100vh-80px)] overflow-y-auto">
        <Routes>
          <Route path={`/profile`} element={<ProviderProfile />} />
          <Route path={`/menu`} element={<ProviderMenu />} />
          <Route path={`/`} element={<ProviderDefault />} />
        </Routes>
      </div>
    </div>
  );
}
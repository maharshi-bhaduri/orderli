import { NavLink } from "react-router-dom";
import SidebarButton from "./SidebarButton"
import snaqrBrandBold from "../images/snaqr_brand_b.png";

export default function Sidebar(props) {

  return (
    <div className="w-60 flex flex-col my-2">
      <NavLink to={'/account'}>
        <div className="flex mx-2 py-2 rounded-lg bg-white items-center justify-center shadow-md overflow-hidden">
          <img
            src={snaqrBrandBold}
            className="cursor-pointer w-2/3"
          />
        </div>
      </NavLink>
      <div className="m-2 p-2 bg-white rounded-lg shadow-md">
        {props.optionMap.map((option, index) => (
          <NavLink end to={`${option.page}`}
            key={index}
          >
            {({ isActive }) => (
              <SidebarButton name={`${option.name}`}
                key={index}
                active={isActive}
                icon={option.icon ? option.icon : null}
              />
            )}
          </NavLink>
        ))}
      </div>
      <div className="flex-grow mx-2 p-2 rounded-lg bg-white shadow-md">
      </div>
    </div>
  );
}

import { NavLink } from "react-router-dom";
import SidebarButton from "./SidebarButton"

export default function Sidebar(props) {

  return (
    <div className="w-56 p-4">
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
  );
}

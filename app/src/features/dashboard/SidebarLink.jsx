import { NavLink } from "react-router-dom";

function SidebarLink({ to, label, icon }) {
    return (
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex gap-5 items-center w-full hover:bg-slate-500 hover:text-white focus:bg-slate-500 font-semibold py-2 px-5 transition-all cursor-pointer ${
            isActive ? "bg-slate-500 text-white font-semibold" : "text-slate-700"
          }`
          
        }
      >
        {icon}
        <span className="hidden md:block">{label}</span>
      </NavLink>
    );
  }
  
  export default SidebarLink
import { NavLink } from "react-router-dom";
import Logo from "../Components/Logo";
import Button from "./Button";
import { useSettings } from "../context/settingsContext";

function Header() {
  const {  state } = useSettings();
const logoName = state.organization.name;
const logo = state.organization.logo;

  return (
    <header className='flex items-center justify-between bg-slate-500 px-6 py-3 text-white'>
     <Logo
        className="font-serif text-2xl flex items-center gap-2"
        logoName={logoName} logo={logo} />
      <Button type="save">
      <NavLink to="/login">
            Login
          </NavLink>
      </Button>
    </header>
  );
}

export default Header;

import Logo from "../../Components/Logo"
import AppNav from "../../Components/AppNav"
import { useSettings } from "../../context/settingsContext";

function Sidebar() {
  const {  state } = useSettings();
const logoName = state.organization.name;
const logo = state.organization.logo;
    return (
      <aside
        className="text-slate-700 row-span-full py-4 items-center bg-slate-100 flex flex-col space-y-4"
      >
        <Logo
        className="font-serif text-2xl flex flex-col items-center gap-1 py-3"
        logoName={logoName} logo={logo} />
        <AppNav />
      </aside>
    )
}

export default Sidebar

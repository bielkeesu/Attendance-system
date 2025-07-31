import { FaUsers, FaUser, FaCalendarCheck, FaHome, FaCog, FaSignOutAlt} from 'react-icons/fa';
import SidebarLink from "../features/dashboard/SidebarLink";


function AppNav() {
    return (
        <nav className="flex flex-col justify-between h-full md:min-w-full">
          <ul className="text-lg flex flex-col gap-2">
            <li>
            <SidebarLink to="dashboard" label="Dashboard" icon={<FaHome />} />
            </li>
            <li>
              <SidebarLink to="staff" label="Staff" icon={<FaUsers />}/>
            </li>
            <li>
              <SidebarLink to="attendance" label="Attendance" icon={<FaCalendarCheck />}/>
            </li>
            <li>
              <SidebarLink to="profile" label="Profile" icon={<FaUser />}/>
            </li>
            <li>
              <SidebarLink to="settings" label="Settings" icon={<FaCog />}/>
           </li>
          </ul>
          {/* <!-- logout btn at bottom --> */}
          <div
            className="flex space-x-6 text-lg hover:text-white"
          >
              <SidebarLink to="/" label="Logout" icon={<FaSignOutAlt />}/>
          </div>
        </nav>
    )
}

export default AppNav

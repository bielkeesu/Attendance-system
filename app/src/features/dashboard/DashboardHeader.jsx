import Notification from "../../ui/Notification"
import { FaAngleRight } from 'react-icons/fa';
import { NavLink } from "react-router-dom";
import CommentBell from "../../Components/CommentBell";


function DashboardHeader() {
    return (
        <header
        className="rounded-t-xl mr-4 mt-4 border-b bg-white text-slate-500 p-3 flex flex-row justify-between items-center"
      >
        {/* <!-- display routes --> */}
        <div className="text-lg font-semibold flex items-center space-x-3">
          <span> Dashboard </span>
          <FaAngleRight />
        </div>
   
        <div className="flex justify-between space-x-6 items-center">
        <Notification />
        <CommentBell />
          <div className="rounded-full border-slate-400 border bg-slate-50">
            <NavLink to="/admin/profile">
            <img
              src="/images/profile-1.jpg"
              alt="aman"
              className="w-8 h-8 rounded-full"
              />
              </NavLink>
          </div>
        </div>
      </header>
    )
}

export default DashboardHeader

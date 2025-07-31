import { Outlet } from "react-router-dom"

function DashboardBox() {
    return (
        <div className="bg-white p-1  mr-4 mb-4 shadow-lg rounded-b-xl flex-1 overflow-y-auto ">
           <Outlet />
        </div>
    )
}

export default DashboardBox

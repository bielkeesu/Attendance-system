import DashboardBox from "../features/dashboard/DashboardBox"
import DashboardHeader from "../features/dashboard/DashboardHeader"
import Sidebar from "../features/dashboard/Sidebar"

function Dashboard() {
    return (
        <div className="grid grid-cols-[4rem,1fr] md:grid-cols-[16rem,1fr] grid-rows-[auto,1fr] h-screen bg-slate-100"
        >
            <DashboardHeader />
            <Sidebar />
            <DashboardBox />
        </div>
    )
}

export default Dashboard

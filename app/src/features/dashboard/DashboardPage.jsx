import { useEffect, useState } from 'react';
import { FaUsers, FaCalendarCheck, FaClock, FaUserTimes } from 'react-icons/fa';
import { useStaffs } from '../../context/staffContext';
import { useAttendances } from '../../context/AttendanceContext';
import { formatTime } from "../../utils/formatDate"
import SummaryCard from '../../Components/SummaryCard';
import AttendancePieChart from '../../Components/AttendancePieChart';
import Headings from '../../ui/Headings';
import Spinner from '../../ui/Spinner';

export default function DashboardPage() {
  const { staffs } = useStaffs();
  const {attendances} = useAttendances();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [totalAttendance, setTotalAttendance] = useState([]);

  const getValue = (label) =>
    data.find((d) => d.name === label)?.value || 0;   

    useEffect(() => {
      const fetchSummary = async () => {
        setLoading(true)
        try {
          const res = await fetch("http://localhost:5000/api/attendance/summary/today");
          const summary = await res.json();
  
          const chartData = [
            { name: "Present", value: summary.present || 0 },
            { name: "Late", value: summary.late || 0 },
            { name: "Absent", value: summary.absent || 0 },
          ];
  
          setData(chartData);
        } catch (err) {
          console.error("Failed to load chart data", err);
        } finally{
          setLoading(false)
        }
      };
  
      fetchSummary();
    }, []);

    // getl All ATTENDANCES
    useEffect( ()=> async function (){
      setLoading(true);
      try{
        const res = await fetch("http://localhost:5000/api/attendance/all");
        const data = await res.json();
        setTotalAttendance(data)

      }catch {
        console.error("Failed to load chart data");
      }finally{
        setLoading(false)
      }
    }, [])

  
  return (
    <>
    { loading ? <Spinner/>:
      <div className="p-6 space-y-8 ">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard icon={<FaUsers />} title="Total Staffs" value={staffs.length} />
        <SummaryCard icon={<FaCalendarCheck />} title="Total Attendances" value={totalAttendance.length} color="bg-green-500" />
        <SummaryCard icon={<FaClock />} title="Late Check-ins" value={getValue("Late")} color="bg-yellow-500" />
        <SummaryCard icon={<FaUserTimes />} title="Absent Staff" value={getValue("Absent")} color="bg-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-xl shadow p-4">
          <Headings className="text-lg font-semibold mb-4">Recent Attendance</Headings>
          <table className="w-full table-auto text-left text-sm">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="p-2">Name</th>
                <th className="p-2">Time In</th>
                <th className="p-2">Time Out</th>
                <th className="p-2">Status</th>
                </tr>
                </thead>
                <tbody>
                {
                attendances.slice(0, 5).map((s) => (
                  <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{s.fullname}</td>
                  <td className="p-2">{formatTime(s.timeIn)}</td>
                  <td className="p-2">{formatTime(s.timeOut)}</td>
                  <td className="p-2">{s.status}</td>
                </tr>
              ))}
            </tbody>
            </table>
            </div>
            
            <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-semibold">Today’s Attendance</h2>
            <AttendancePieChart data={data} />
            </div>
            </div> 
            </div>
          }
          </>
  );
}
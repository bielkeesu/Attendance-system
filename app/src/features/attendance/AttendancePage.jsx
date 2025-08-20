import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useAttendances } from "../../context/AttendanceContext";
import { formatTime, formatDate } from "../../utils/formatDate"
import Table from "../../ui/Table";
import ActionDropdown from "../../ui/ActionDropdown";
import Pagination from "../../ui/Pagination";
import Spinner from "../../ui/Spinner";
import Headings from "../../ui/Headings";
import Search from "../../ui/Search";
import Button from "../../ui/Button";

import API_BASE_URL from "../../utils/apiConfig";


export default function AttendancePage() {
  const { attendances, currentPage, totalPages, fetchAttendances, dispatch, loading } = useAttendances();
  const [searchDate, setSearchDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      fetchAttendances(page);
    }
  };
  const filtered = attendances.filter((item) => {
    const matchSearch = item.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.staffId.toLowerCase().includes(searchQuery.toLowerCase());

    const timeInDate = item.timeIn ? item.timeIn.split("T")[0] : "";
    const matchDate = searchDate ? timeInDate === searchDate : true;
  // const matchDate = searchDate ? item.date?.startsWith(searchDate) : true;
  return matchSearch && matchDate;
});

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      dispatch({ type: "LOADING" });
      await fetch(`${API_BASE_URL}/api/attendance/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "DELETE_ATTENDANCE", payload: id });
    } catch (err) {
      console.error(err);
    }
  };
  
  const tableRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
    documentTitle: "Attendance Sheet",
  });

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-6">
      <Search
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="flex gap-2">
          <label className="flex items-center gap-2">
            <span className="text-sm font-medium">Filter by date:</span>
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="border px-2 py-1 rounded"
            />
          </label>
        </div>
      </div>
      <div className="flex justify-end ">
        <Button onClick={handlePrint} type="update">
          Print Attendance
        </Button>
      </div>

{loading ? <Spinner/> : 
<div ref={tableRef}>
      <Headings className="text-xl font-semibold text-slate-700 my-6 tracking-wider mx-4">Attendance</Headings>
      <Table
      columns={[
          { key: "staffId", label: "Staff ID" },
          { key: "fullname", label: "Name" },
          {
            key: "timeIn",
            label: "Time-In",
            render: (value) => formatTime(value),
          },
          {  
            key: "timeOut",
            label: "Time-Out",
            render: (value) => formatTime(value),
          },
          {
            key: "date",
            label: "Date",
            render: (value) => formatDate(value),
          },
          {
            key: "status",
            label: "Status",
            render: (value) => (
           <span
           className={`px-2 py-1 rounded-full text-xs font-semibold
          ${
            value === "Present"
              ? "bg-green-100 text-green-800"
              : value === "Late"
              ? "bg-yellow-100 text-yellow-800"
              : value === "Incomplete"
              ? "bg-orange-100 text-orange-600"
              : value === "Absent"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
            }
         `}
           >
           {value}
           </span>
           ),
          },
          {
            key: 'actions',
            label: 'Actions',
            render: (_,row) => (
              <ActionDropdown
              onView={() => alert(JSON.stringify(row, null, 2))}
              onDelete={() => handleDelete(row.id)}
              />
            )
          },
        ]}
        data={filtered}
        />

       {!loading && filtered.length === 0 && (
  <p className="text-center text-gray-500 mt-4">No attendance records found.</p>
)}
         { totalPages > 1 && <Pagination currentPage={currentPage} handlePageChange={handlePageChange} totalPages={totalPages} /> }
        </div>
        }
    </div>
  );
}

    


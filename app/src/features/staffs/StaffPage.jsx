import { useState } from "react";
import { useStaffs } from "../../context/staffContext";
import Table from "../../ui/Table";
import Spinner from "../../ui/Spinner";
import ActionDropdown from "../../ui/ActionDropdown";
import AddEditStaffModal from "./AddEditStaffModal";
import StaffViewModal from "./StaffViewModal";
import Headings from "../../ui/Headings";
import Search from "../../ui/Search";
import Button from "../../ui/Button";
// import API_BASE_URL from "../../utils/apiConfig";

// const API_BASE_URL = "https://attendance-system-p8yd.onrender.com";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function StaffPage() {
  const { staffs, dispatch, loading } = useStaffs();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [viewingStaff, setViewingStaff] = useState(null);
  const [error, setError] = useState("");



  // Filtered search
  const filteredStaffs = staffs.filter(
    (staff) =>
      staff.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.staffId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff?")) return;

    try {
      await fetch(`${API_BASE_URL}/api/staff/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "DELETE_STAFF", payload: id });
    } catch (err) {
      setError(err);
      console.error(err);
    }
  };


  return (
    <div className="p-4 space-y-4">
      <header className="flex flex-col m-6 space-y-6 sm:m-0 sm:mb-8 sm:space-y-0 justify-between py-3 px-5 sm:flex-row">
        <Search
          className="border px-3 py-2 rounded w-64"
          placeholder="Search staff..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          onClick={() => {
            setEditingStaff(null);
            setShowAddEditModal(true);
          }}
          type='save'
        >
          Add New Staff
        </Button>
      </header>

      <Headings className="text-xl font-semibold text-slate-700 mb-10 tracking-widest">
        List of Staffs
      </Headings>
      {error &&  <p className="text-red-500">{error}</p>}
 {loading ? <Spinner/> :
 <>

      <Table
      columns={[
        { key: "staffId", label: "ID" },
        { key: "fullname", label: "Name" },
        { key: "officeNo", label: "Office No" },
        { key: "phoneNo", label: "Phone" },
        {
            key: 'actions',
            label: 'Actions',
            render: (_,row) => (
              <ActionDropdown
              onView={() => setViewingStaff(row)}
              onEdit={() => {
                  setEditingStaff(row);
                  setShowAddEditModal(true);
                }}
                onDelete={() => handleDelete(row.id)}
                />
              )
            },
          ]}
          data={filteredStaffs}
          
          />
         {/* { totalPages > 1 && <Pagination page={page} setPage={setPage} totalPages={totalPages} /> } */}
      
            </>
        }

      {showAddEditModal && (
        <AddEditStaffModal
          editingStaff={editingStaff}
          onClose={() => setShowAddEditModal(false)}
        />
      )}
      {viewingStaff && (
        <StaffViewModal staff={viewingStaff} onClose={() => setViewingStaff(null)} />
      )}
    </div>
  );
}

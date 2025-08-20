import { useState } from "react";
import { useStaffs } from "../../context/staffContext";
import Button from "../../ui/Button";
import API_BASE_URL from "../../utils/apiConfig";

export default function AddEditStaffModal({ editingStaff, onClose }) {
  const isEdit = Boolean(editingStaff);
  const { dispatch } = useStaffs();

  const [formData, setFormData] = useState({
    staffId: editingStaff?.staffId || "",
    fullname: editingStaff?.fullname || "",
    officeNo: editingStaff?.officeNo || "",
    phoneNo: editingStaff?.phoneNo || "",
    image: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      data.append(key, value)
    );

    const url = isEdit
      ? `${API_BASE_URL}/api/staff/${editingStaff.id}`
      : `${API_BASE_URL}/api/staff`;
    const method = isEdit ? "PUT" : "POST";

    try {
    dispatch({ type: "SET_LOADING", payload: true });
      const res = await fetch(url, {
        method,
        body: data,
      });
      const result = await res.json();

      dispatch({
        type: isEdit ? "UPDATE_STAFF" : "ADD_STAFF",
        payload: result,
      });
      onClose();
    } catch (err) {
      console.error(err);
    }finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded p-6 space-y-4 w-96"
      >
        <h2 className="text-xl font-semibold">
          {isEdit ? "Edit Staff" : "Add New Staff"}
        </h2>

        <input
          type="text"
          placeholder="Staff ID"
          value={formData.staffId}
          onChange={(e) =>
            setFormData({ ...formData, staffId: e.target.value })
          }
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Full Name"
          value={formData.fullname}
          onChange={(e) =>
            setFormData({ ...formData, fullname: e.target.value })
          }
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Office No"
          value={formData.officeNo}
          onChange={(e) =>
            setFormData({ ...formData, officeNo: e.target.value })
          }
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="number"
          placeholder="Phone No"
          value={formData.phoneNo}
          onChange={(e) =>
            setFormData({ ...formData, phoneNo: e.target.value })
          }
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="file"
          onChange={(e) =>
            setFormData({ ...formData, image: e.target.files[0] })
          }
        />
        <div className="flex justify-between gap-2">
          <Button
            type="back"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="update" >
            {isEdit ? "Update" : "Add"}
          </Button>
        </div>
      </form>
    </div>
  );
}

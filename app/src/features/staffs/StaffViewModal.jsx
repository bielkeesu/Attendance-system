import { useState, useEffect } from "react";
import Button from "../../ui/Button";
import { getApiUrl } from "../../utils/apiConfig";

export default function StaffViewModal({ staff, onClose }) {
  const [apiUrl, setApiUrl] = useState("");

  useEffect(() => {
    async function fetchApiUrl() {
      const url = await getApiUrl();
      setApiUrl(url);
    }
    fetchApiUrl();
  }, []);

  if (!apiUrl) return null; // or a loader while fetching

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose}></div>

      <div className="bg-white rounded p-6 shadow-lg w-full max-w-xl z-50 relative">
      <div className="py-2 mb-4">
        <h2 className="text-xl font-semibold">Staff Details</h2>
      </div>

      <div className="flex flex-row items-center gap-12">
        <img
          src={`${apiUrl}/uploads/${staff.imageUrl}`}
          alt={staff.fullname}
          className="w-28 h-28 rounded-full object-cover"
          />

        <div>
        <p><strong>ID:</strong> {staff.staffId}</p>
        <p><strong>Name:</strong> {staff.fullname}</p>
        <p><strong>Office:</strong> {staff.officeNo}</p>
        <p><strong>Phone:</strong> {staff.phoneNo}</p>
        </div>
      </div>

        <div className="flex justify-end mt-4">
        <Button type="back" onClick={onClose}>
          Close
        </Button>
        </div>
      </div>
    </div>
  );
}

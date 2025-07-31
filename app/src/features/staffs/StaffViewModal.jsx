import Button from "../../ui/Button";

export default function StaffViewModal({ staff, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded p-6 w-96 space-y-2">
        <h2 className="text-xl font-semibold mb-2">Staff Details</h2>
        <img
          src={`http://localhost:5000/uploads/${staff.imageUrl}`}
          alt={staff.fullname}
          className="w-24 h-24 rounded-full object-cover"
        />
        <p><strong>ID:</strong> {staff.staffId}</p>
        <p><strong>Name:</strong> {staff.fullname}</p>
        <p><strong>Office:</strong> {staff.officeNo}</p>
        <p><strong>Phone:</strong> {staff.phoneNo}</p>
        <Button
        type='back'
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </div>
  );
}

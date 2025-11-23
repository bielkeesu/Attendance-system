import { useState, useEffect } from "react";
import Button from "../../ui/Button";
import { getApiUrl } from "../../utils/apiConfig";
import { formatTime, formatDate } from "../../utils/formatDate"


export default function AttendanceModalView({ attendance, onClose }) {
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

      <div className="bg-white rounded p-6 w-full max-w-2xl z-50  space-y-2">
        <h2 className="text-xl font-semibold">Attendance Details</h2>
         <div className="flex items-end gap-2 justify-between mt-4">
        <div className=" space-y-1 py-6">
        <p className="uppercase"><strong>ID:</strong> {attendance.staffId}</p>
        <p className="capitalize"><strong>Name:</strong> {attendance.fullname}</p>
        <p><strong>Time In:</strong> {formatTime(attendance.timeIn)}</p>
        <p><strong>Time Out:</strong> {formatTime(attendance.timeOut)}</p>
        <p><strong>Date:</strong> {formatDate(attendance.date)}</p>
        <p><strong>Status: </strong>
         {/* {attendance.status} */}
         <span
           className={`font-semibold px-1
          ${
            attendance.status === "Present"
              ? "bg-green-100 text-green-800"
              : attendance.status === "Late"
              ? "bg-yellow-100 text-yellow-800"
              : attendance.status === "Incomplete"
              ? "bg-orange-100 text-orange-600"
              : attendance.status === "Absent"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
            }
         `}
           >
           {attendance.status}
           </span>
         </p>
         {attendance.comment &&<>
        <p><strong>Comment: </strong> 
           {attendance.comment} </p>
          <p className="capitalize"><strong>CommentStatus: </strong> 
          <span
           className={`font-semibold px-1
          ${
            attendance.commentStatus === "approved"
              ? "bg-green-100 text-green-800"
              : attendance.commentStatus === "rejected"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
            }
         `}
           >
           {attendance.commentStatus}
        </span>   
        </p>
          {attendance.adminFeedback &&
          <p><strong>Admin Feedback:</strong> {attendance.adminFeedback}</p>
          }
         </>
         }
        </div>

        <Button type="back" onClick={onClose}>
          Close
        </Button>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { FaPen } from "react-icons/fa";
import { getApiUrl } from "../../utils/apiConfig";
import Toast from "../../ui/Toast";

function MainComment() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="absolute bottom-5 right-5 py-3 px-5 rounded-full bg-slate-300 text-slate-500 flex gap-4 items-center hover:bg-slate-200 hover:text-slate-500 transition-all duration-200 hover:font-semibold"
      >
        <FaPen /> Add Comment
      </button>

      <Modal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

function Modal({ open, onClose }) {
  const [staffId, setStaffId] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [toast, setToast] = useState(null);

  function showToast(message, type = "info") {
    setToast({ message, type });
  }

  // Reset modal when closed
  useEffect(() => {
    if (!open) {
      setStaffId("");
      setComment("");
      setErrorMsg("");
    }
  }, [open]);

  const submitComment = async () => {
    setErrorMsg("");

    if (!staffId.trim() || !comment.trim()) {
      setErrorMsg("Staff ID and Comment are required.");
      return;
    }

    try {
      setLoading(true);
      const apiUrl = await getApiUrl();

      // 1️⃣ Validate Staff ID
      const checkRes = await fetch(`${apiUrl}/api/comment/staff/check/${staffId}`);
      const checkData = await checkRes.json();

      console.log(checkRes)
      if (!checkData.exists) {
        setErrorMsg("Invalid Staff ID. Please enter a correct ID.");
        setLoading(false);
        return;
      }

      // 2️⃣ Submit the comment
      const res = await fetch(`${apiUrl}/api/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staffId: staffId.trim(),
          comment: comment.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Failed to save comment.");
      } else {
        showToast(data.message|| "Comment saved Successfully!","success")
        onClose();
      }
    } catch (err) {
      setErrorMsg("Network or server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">

      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-40 z-10" onClick={onClose}></div>

      {/* Modal */}
      <div className="bg-white rounded p-6 shadow-lg w-full max-w-md z-20 relative">
        <h3 className="text-lg font-semibold mb-3">Add Comment</h3>

        {/* Staff ID */}
        <label className="block mb-2">Staff ID</label>
        <input
          className="w-full border px-3 py-2 rounded mb-2 uppercase placeholder:capitalize"
          value={staffId}
          onChange={(e) => setStaffId(e.target.value)}
          placeholder="Enter staff ID"
        />

        {/* Comment */}
        <label className="block mb-2 mt-3">Comment</label>
        <textarea
          className="w-full border px-3 py-2 rounded mb-4 h-28 placeholder:lowercase normal-case"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment (once per day)"
        />

        {/* Error Message */}
        {errorMsg && <p className="text-red-600 text-sm mb-2">{errorMsg}</p>}

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={submitComment}
            disabled={loading}
          >
            {loading ? "Saving..." : "Submit"}
          </button>
        </div>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default MainComment;

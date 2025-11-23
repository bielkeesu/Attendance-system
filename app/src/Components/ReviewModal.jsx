import { useEffect, useState } from "react";
import Toast from "../ui/Toast";
import { getApiUrl } from "../utils/apiConfig";
import { formatDateTime } from "../utils/formatDate"


export default function ReviewModal({ attendanceId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [toast, setToast] = useState(null);

  function showToast(message, type = "info") {
    setToast({ message, type });
  }
  useEffect(() => {
      if (!attendanceId) return;
      
      (async function load() {
          try {
              const apiUrl = await getApiUrl();
              const res = await fetch(`${apiUrl}/api/comment/inbox/${attendanceId}`);
              
              if (!res.ok) {
                  const error = await res.json();
                  showToast(error.error || "Failed to load comment", "error");
                  return;
                }
                
                const json = await res.json();
                setData(json);
              
            } catch (err) {
                console.error(err);
        showToast("Network error loading modal", "error");
      }
    })();
  }, [attendanceId]);

  async function review(action) {
    if (!attendanceId) return;

    setLoading(true);

    try {
      const apiUrl = await getApiUrl();
      const res = await fetch(`${apiUrl}/api/comment/review/${attendanceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, feedback }),
      });

      const json = await res.json();
      console.log(json)

      if (!res.ok) {
        showToast(json.error || "Review failed", "error");
        return;
      }

      showToast(json.message || "Done", "success");

      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err) {
      showToast("Network error reviewing comment", "error");
    } finally {
      setLoading(false);
    }
  }

  if (!data) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow">Loading…</div>

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

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose}></div>

      <div className="bg-white rounded p-6 shadow-lg w-full max-w-2xl z-50 relative">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">Review Comment</h3>
          <button className="text-gray-500 hover:bg-gray-100 py-2 px-3" onClick={onClose}>Close</button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Staff</p>
            <p className="font-medium">
              {data.staffName} ({data.staffId})
            </p>

            <p className="text-sm text-gray-500 mt-3">Date</p>
            <p className="font-medium">{formatDateTime(data.date)}</p>

            <p className="text-sm text-gray-500 mt-3">Original status</p>
            <p className="font-medium">{data.originalStatus || data.status}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Check-in</p>
            <p>{data.timeIn || "—"}</p>

            <p className="text-sm text-gray-500 mt-3">Check-out</p>
            <p>{data.timeOut || "—"}</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-500">Comment</p>
          <div className="p-3 bg-gray-50 rounded mt-1">{data.comment}</div>
        </div>

        <div className="mt-4">
          <label className="text-sm text-gray-500">Admin Feedback (optional)</label>
          <textarea
            className="w-full border rounded p-2 mt-1"
            rows={3}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>

        <div className="flex gap-3 justify-end mt-4">
          <button
            className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => review("reject")}
            disabled={loading}
          >
            Reject
          </button>

          <button
            className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={() => review("approve")}
            disabled={loading}
          >
            Approve
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

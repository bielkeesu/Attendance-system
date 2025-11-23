// src/components/CommentBell.jsx
import { useEffect, useState, useRef } from 'react';
import { FaInbox } from 'react-icons/fa';
import { getApiUrl } from '../utils/apiConfig';
import ReviewModal from './ReviewModal';
import { useNavigate } from 'react-router-dom';
import { formatDateTime } from '../utils/formatDate';

export default function CommentBell() {
  const [count, setCount] = useState(0);
  const [preview, setPreview] = useState([]);
  const [openDrop, setOpenDrop] = useState(false);
  const [selected, setSelected] = useState(null); // attendanceId
  const dropRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPending();
    // const iv = setInterval(fetchPending, 10000); // poll every 10s
    // return () => clearInterval(iv);
  }, []);

  async function fetchPending() {
    try {
      const apiUrl = await getApiUrl();
      const res = await fetch(`${apiUrl}/api/comment/pending`);
      const data = await res.json();
      setPreview(data.slice(0, 5)); // show 5 latest
      setCount(data.length);
    } catch (err) {
      console.error(err);
    }
  }

  // close dropdown on outside click
  useEffect(() => {
    function onDoc(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) setOpenDrop(false);
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  return (
    <div className="relative" ref={dropRef}>
      <button
        onClick={() => setOpenDrop(v => !v)}
        className="relative p-2 rounded hover:bg-gray-100"
        title="Comments inbox"
      >
        <FaInbox />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5">
            {count}
          </span>
        )}
      </button>

      {openDrop && (
        <div className="absolute right-0 mt-2 w-96 bg-white border rounded shadow-lg z-50">
          <div className="p-3 border-b flex items-center justify-between">
            <strong>Pending Comments</strong>
            <button className="text-sm text-blue-600" onClick={() => navigate('/admin/attendance')}>View all</button>
          </div>

          <div className="max-h-64 overflow-auto">
            {preview.length === 0 && <div className="p-3 text-sm text-gray-500">No pending comments</div>}
            {preview.map(item => (
              <div key={item.attendanceId} className="p-3 border-b hover:bg-gray-50 flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium">{item.staffName} <span className="text-xs text-gray-500">({item.staffId})</span></div>
                  <div className="text-xs text-gray-600 mt-1 line-clamp-2">{item.comment}</div>
                  <div className="text-xs text-gray-400 mt-1">{formatDateTime(item.date)}</div>
                </div>

                <div className="flex flex-col items-end gap-2 ml-3">
                  <button
                    className="text-sm bg-green-600 text-white px-2 py-1 rounded"
                    onClick={async () => setSelected(item.inboxId)}
                  >
                    Review
                  </button>

                  {/* <button className="text-xs text-gray-500" onClick={() => navigate(`/admin/attendance/${item.attendanceId}`)}>
                    Open
                  </button> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selected && (
        <ReviewModal attendanceId={selected} onClose={() => { setSelected(null); fetchPending(); }} />
      )}
    </div>
  );
}

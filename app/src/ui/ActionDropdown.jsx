
import { useState, useRef, useEffect } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';

export default function ActionDropdown({ onView, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button onClick={() => setOpen(!open)} className="p-2 hover:bg-gray-300 duration-400 rounded-full">
        <BsThreeDotsVertical />
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-32 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg">
          <button onClick={onView} className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            View
          </button>
          <button onClick={onEdit} className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Edit
          </button>
          <button onClick={onDelete} className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100">
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { useNotificationReducer } from '../hooks/useNotificationReducer';
import { FaBell } from 'react-icons/fa';

export default function Notification() {
  const [open, setOpen] = useState(false);
  const {
    notifications,
    markAsRead,
    clearNotifications,
  } = useNotificationReducer();

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="relative">
      <button className="relative p-2" onClick={() => setOpen(!open)}>
        <FaBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-md z-20">
          <div className="flex justify-between items-center px-4 py-2 border-b">
            <span className="font-semibold">Notifications</span>
            <button
              className="text-sm text-red-500 hover:underline"
              onClick={clearNotifications}
            >
              Clear all
            </button>
          </div>
          <ul className="max-h-64 overflow-y-auto">
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                  n.is_read ? 'text-gray-500' : 'text-black font-medium'
                }`}
                onClick={() => markAsRead(n.id)}
              >
                {n.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

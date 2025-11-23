import { useEffect } from "react";

export default function Toast({ message, type = "info", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bg = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
  }[type];

  return (
    <div className="fixed top-20 right-50 z-[9999]">
      <div className={`${bg} text-white px-4 py-2 rounded shadow-lg`}>
        {message}
      </div>
    </div>
  );
}

// // utils/formatDate.js
export function formatTime(datetime) {
  if (!datetime) return "-";

  return new Date(datetime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // this ensures AM/PM
  });
}

// Format only the date
export function formatDate(datetime) {
  if (!datetime) return "-";

  return new Date(datetime).toLocaleDateString();
}

// Optional: Format both date and time together
export function formatDateTime(datetime) {
  if (!datetime) return "-";

  const date = new Date(datetime);
  const formattedDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${formattedDate} ${formattedTime}`;
}

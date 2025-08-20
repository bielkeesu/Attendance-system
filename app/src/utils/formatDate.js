// utils/formatDate.js
export function formatTime(datetime) {
    if (!datetime) return "-";
    return new Date(datetime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  
  export function formatDate(datetime) {
    if (!datetime) return "-";
    return new Date(datetime).toLocaleDateString();
  }

  
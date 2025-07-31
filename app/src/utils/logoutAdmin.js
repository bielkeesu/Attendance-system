export function logoutAdmin() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    window.location.href = "/login"; // Or use navigate if inside React component
  }
  
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://attendance-system-p8yd.onrender.com" // Replace with Render backend URL
    : "http://localhost:5000"; // Local development backend

export default API_BASE_URL;

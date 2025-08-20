import API_BASE_URL from "./apiConfig";

// src/api/health.js
export async function checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`); // replace with your backend URL
      if (!res.ok) throw new Error("Server not responding");
  
      const data = await res.json();
      return data;
    } catch (err) {
      return { status: "error", message: err.message };
    }
  }
  
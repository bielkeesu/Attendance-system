import {getApiUrl} from "./apiConfig";

// src/api/health.js
export async function checkHealth() {
    try {
      const apiUrl = await getApiUrl();

      const res = await fetch(`${apiUrl}/health`); // replace with your backend URL
      if (!res.ok) throw new Error("Server not responding");
  
      const data = await res.json();
      return data;
    } catch (err) {
      return { status: "error", message: err.message };
    }
  }
  
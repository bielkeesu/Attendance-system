import { useEffect, useState } from "react";
import { getApiUrl } from "../utils/apiConfig";

export default function useApiHealth() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  async function checkHealth() {
    try {
      const apiUrl = await getApiUrl();
      setLoading(true);
      const res = await fetch(`${apiUrl}/health`);
      if (!res.ok) throw new Error("Backend not available");
      await res.json(); // make sure response is valid JSON
      setError(null);
    } catch (err) {
      setError("Cannot connect to backend service.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkHealth(); // check once on mount

    // retry every 5 seconds if error exists
    // const interval = setInterval(checkHealth, 5000);

    // return () => clearInterval(interval);
  }, []);

  return { error, loading };
}

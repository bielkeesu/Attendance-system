// src/components/HealthCheck.js
import React, { useEffect, useState } from "react";
import { checkHealth } from "../utils/health";

export default function HealthCheck({ children }) {
  const [health, setHealth] = useState({ status: "loading" });

  useEffect(() => {
    async function fetchHealth() {
      const result = await checkHealth();
      setHealth(result);
    }
    fetchHealth();
  }, []);

  if (health.status === "loading") {
    return <div className="p-8 text-center">Checking system health...</div>;
  }

  if (health.status === "error") {
    return (
      <div className="p-8 text-center text-red-600">
        ⚠️ System is down: {health.message}
      </div>
    );
  }

  return <>{children}</>;
}

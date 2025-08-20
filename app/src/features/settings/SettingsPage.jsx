import { useEffect, useState } from "react";
import OrganizationTab from "./OrganizationTab";
import AttendanceTab from "./AttendanceTab";
import ProfileTab from "./ProfileTab";
import { useSettings } from "../../context/settingsContext";


const tabs = [
  { key: "organization", label: "Organization Info" },
  { key: "attendance", label: "Attendance Settings" },
  { key: "profile", label: "Admin Profile" },
];

export default function SettingsPage() {
  const {state} = useSettings();
  
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "organization";
  });
  
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  if (state.loading) return <p>Loading settings...</p>;

  if (state.error) {
    return (
      <div className="error-message">
        <h2>⚠️ Unable to load settings</h2>
        <p>{state.error}</p>
        <p>Please check your server connection.</p>
      </div>
    );
  }
  

  return (
    <div className="p-6">
      <div className="flex space-x-4 border-b mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-2 text-sm font-medium ${
              activeTab === tab.key
                ? "border-b-2 border-green-500 text-green-500"
                : "text-gray-600 hover:text-green-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === "organization" && <OrganizationTab />}
        {activeTab === "attendance" && <AttendanceTab />}
        {activeTab === "profile" && <ProfileTab />}
      </div>
    </div>
  );
}

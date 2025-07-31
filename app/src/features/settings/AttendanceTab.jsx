import { useState } from "react";
import { useSettings } from "../../context/settingsContext";
import Button from "../../ui/Button";

export default function AttendanceTab() {
  const [loading, setLoading] = useState(false);

  const { state, updateAttendanceSettings } = useSettings();
  const { enableAttendance, earliestCheckIn, latestCheckIn, earliestCheckOut, latestCheckOut, allowLateCheckIn, defaultWorkHours } = state.attendance;

  const [form, setForm] = useState({
    enableAttendance: enableAttendance,
    earliestCheckIn: earliestCheckIn || "",
    latestCheckIn: latestCheckIn || "",
    earliestCheckOut: earliestCheckOut || "",
    latestCheckOut: latestCheckOut || "",
    allowLateCheckIn: allowLateCheckIn || "",
    defaultWorkHours: defaultWorkHours || 8,
  });

  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
setLoading(true);
    await updateAttendanceSettings(form);
    setLoading(false)
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="enableAttendance"
          checked={form.enableAttendance}
          onChange={handleChange}
        />
        <span>Enable Attendance</span>
      </label>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Earliest Check-In</label>
          <input
            type="time"
            name="earliestCheckIn"
            value={form.earliestCheckIn || ""}
            onChange={handleChange}
            className="border w-full px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Latest Check-In</label>
          <input
            type="time"
            name="latestCheckIn"
            value={form.latestCheckIn || ""}
            onChange={handleChange}
            className="border w-full px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Earliest Check-Out</label>
          <input
            type="time"
            name="earliestCheckOut"
            value={form.earliestCheckOut || ""}
            onChange={handleChange}
            className="border w-full px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Latest Check-Out</label>
          <input
            type="time"
            name="latestCheckOut"
            value={form.latestCheckOut || ""}
            onChange={handleChange}
            className="border w-full px-3 py-2 rounded"
          />
        </div>
      </div>

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="allowLateCheckIn"
          checked={form.allowLateCheckIn || ""}
          onChange={handleChange}
        />
        <span>Allow Late Check-In</span>
      </label>

      <div>
        <label className="block text-sm font-medium">Default Work Hours (hrs)</label>
        <input
          type="number"
          name="defaultWorkHours"
          value={form.defaultWorkHours || ""}
          onChange={handleChange}
          className="border w-full px-3 py-2 rounded"
        />
      </div>

      <Button
        type="update"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Settings"}
      </Button>
    </form>
  ); 
}

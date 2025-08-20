import { useState, useEffect } from "react";
import { useSettings } from "../../context/settingsContext";
import Button from "../../ui/Button";
// import API_BASE_URL from "../../utils/apiConfig";
const API_BASE_URL = "https://attendance-system-p8yd.onrender.com";

export default function ProfileTab() {
  const { state, dispatch } = useSettings();
  const profile = state.profile;

  const [email, setEmail] = useState(profile.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEmail(profile.email);
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/settings/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to update profile");
        return;
      }

      dispatch({ type: "SET_PROFILE", payload: { email } }); // only email is returned
      alert("Profile updated successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border px-3 py-2 w-full rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Current Password</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="border px-3 py-2 w-full rounded"
          placeholder="current password"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border px-3 py-2 w-full rounded"
          placeholder="new password"
        />
      </div>

      <Button type="update" disabled={loading}>
        {loading ? "Updating..." : "Update Profile"}
      </Button>
    </form>
  );
}

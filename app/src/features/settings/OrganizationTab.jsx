import { useState, useEffect } from "react";
import { useSettings } from "../../context/settingsContext";
import Button from "../../ui/Button";
import { getApiUrl } from "../../utils/apiConfig";

export default function OrganizationTab() {
  const { state, updateOrganizationSettings } = useSettings();
  const { name, checkInTime, checkOutTime, logo } = state.organization;

  const [apiUrl, setApiUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: name || "",
    checkInTime: checkInTime || "",
    checkOutTime: checkOutTime || "",
  });

  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    async function fetchApiUrl() {
      const url = await getApiUrl();
      setApiUrl(url);
    }
    fetchApiUrl();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    setLogoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("checkInTime", form.checkInTime);
    formData.append("checkOutTime", form.checkOutTime);
    if (logoFile) formData.append("logo", logoFile);

    await updateOrganizationSettings(formData);
    setLoading(false);
  };

  if (!apiUrl) return null; // or a loader

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium">Organization Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="border px-3 py-2 w-full rounded"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Check-in Time</label>
          <input
            type="time"
            name="checkInTime"
            value={form.checkInTime}
            onChange={handleChange}
            className="border px-3 py-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Check-out Time</label>
          <input
            type="time"
            name="checkOutTime"
            value={form.checkOutTime}
            onChange={handleChange}
            className="border px-3 py-2 w-full rounded"
          />
        </div>
      </div>

      <div>
        <label className="block font-medium">Logo</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoChange}
          className="block"
        />
        {logo && apiUrl && (
          <img
            src={`${apiUrl}/uploads/${logo}`}
            alt="Logo"
            className="mt-2 w-20 h-20 object-contain"
          />
        )}
      </div>

      <Button type="update" disabled={loading}>
        {loading ? "Saving.." : "Save Changes"}
      </Button>
    </form>
  );
}

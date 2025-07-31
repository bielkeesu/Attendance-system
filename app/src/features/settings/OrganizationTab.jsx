import { useState } from "react";
import { useSettings } from "../../context/settingsContext";
import Button from "../../ui/Button";

export default function OrganizationTab() {
  const { state, updateOrganizationSettings } = useSettings();
  const { name, checkInTime, checkOutTime, logo } = state.organization;

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: name || "",
    checkInTime: checkInTime || "",
    checkOutTime: checkOutTime || "",
  });

  const [logoFile, setLogoFile] = useState(null);

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
    setLoading(false)
  };

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
        {logo && (
          <img
            src={`http://localhost:5000/uploads/${logo}`}
            alt="Logo"
            className="mt-2 w-20 h-20 object-contain"
          />
        )}
      </div>

      <Button
        type="update"
        disabled={loading}
      >
        {loading ? "Saving.. " : "Save Changes"}
      </Button>
    </form>
  );
}






// import { useState, useEffect } from "react";
// import { useSettings } from "../../context/settingsContext";


// export default function OrganizationTab() {

// const { state, dispatch } = useSettings();

// const org = state.organization;

// const [form, setForm] = useState({ ...org, logo: "" });
// const [preview, setPreview] = useState(null);
// const [loading, setLoading] = useState(false);

// useEffect(() => {
//   if (org) {
//     setForm({ ...org, logo: null });
//     setPreview(`http://localhost:5000/uploads/${org.logo}`);
//   }
// }, [org]);

// const handleChange = (e) => {
//   const { name, value, files } = e.target;
//   if (files) {
//     setForm((prev) => ({ ...prev, logo: files[0] }));
//     setPreview(URL.createObjectURL(files[0]));
//   } else {
//     setForm((prev) => ({ ...prev, [name]: value }));
//   }
// };

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);
//   const fd = new FormData();
//   fd.append("name", form.name);
//   fd.append("checkInTime", form.checkInTime);
//   fd.append("checkOutTime", form.checkOutTime);
//   if (form.logo) fd.append("logo", form.logo);

//   try {
//     const res = await fetch("http://localhost:5000/api/settings/organization", {
//       method: "PUT",
//       body: fd,
//     });
//     const updated = await res.json();
//     dispatch({ type: "SET_ORGANIZATION", payload: updated });
//     alert("Organization updated successfully");
//   } catch (err) {
//     console.error("Failed to update", err);
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
//       <div>
//         <label className="block text-sm font-medium">Organization Name</label>
//         <input
//           name="name"
//           value={form.name || ""}
//           onChange={handleChange}
//           className="border px-3 py-2 w-full rounded"
//           required
//         />
//       </div>

//       <div className="flex gap-4">
//         <div className="flex-1">
//           <label className="block text-sm font-medium">Check-In Time</label>
//           <input
//             type="time"
//             name="checkInTime"
//             value={form.checkInTime || ""}
//             onChange={handleChange}
//             className="border px-3 py-2 w-full rounded"
//             required
//           />
//         </div>
//         <div className="flex-1">
//           <label className="block text-sm font-medium">Check-Out Time</label>
//           <input
//             type="time"
//             name="checkOutTime"
//             value={form.checkOutTime || ""}
//             onChange={handleChange}
//             className="border px-3 py-2 w-full rounded"
//             required
//           />
//         </div>
//       </div>

//       <div>
//         <label className="block text-sm font-medium">Organization Logo</label>
//         <input type="file" accept="image/*" onChange={handleChange} />
//         {preview && <img src={preview} alt="Logo" className="w-24 h-24 mt-2 object-cover rounded" />}
//       </div>

//       <button
//         type="submit"
//         disabled={loading}
//         className="bg-blue-600 text-white px-4 py-2 rounded"
//       >
//         {loading ? "Saving..." : "Save Changes"}
//       </button>
//     </form>
//   );
// }

import { useState } from 'react';
import MainHeader from './MainHeader';
import { useSettings } from '../../context/settingsContext';
import Error from '../../ui/Error';
import Button from '../../ui/Button';
import MainDetailsCard from './MainDetailsCard';
// import API_BASE_URL from '../../utils/apiConfig';
// const API_BASE_URL = "https://attendance-system-p8yd.onrender.com";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function MainAttendanceForm() {

  const {state} = useSettings();

  const [staffId, setStaffId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [staffDetails, setStaffDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("")
    setStaffDetails(null);
    
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        setTimeout(() => {
          setError("");
        }, 2000);
      } else {
          // after success
        setSuccessMessage("Attendance taken successfully ✅");
          // hide after 3 seconds
        setTimeout(() => {
         setSuccessMessage("");
        }, 2000);
        setStaffDetails(data);
        setTimeout(() => {
          setStaffDetails(null);
         }, 2000);
      }
    } catch (err) {
      setError('Server error');
    } finally {
      setLoading(false);
      setStaffId('');
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="flex w-[25rem] flex-col space-y-6">
      <MainHeader />
      <input
        type="text"
        placeholder="Enter your Id"
        id="staffId"
        value={staffId}
        onChange={(e) => setStaffId(e.target.value)}
        required
        className="shadow-l rounded-lg px-6 py-4 placeholder:text-sm placeholder:font-thin placeholder:text-gray-400 focus:outline-none"
      />
      <Button type="submit" disabled={!state.attendance.enableAttendance} className="font-bold text-lg px-10 py-3 hover:bg-slate-800 duration-500 transition-all disabled:opacity-50 ">
        {loading ? 'Submitting...' : "Submit"}
      </Button>
    </form>
      {successMessage && (
       <div className="fixed top-5 bg-green-500 text-white px-4 py-2 rounded shadow transition-all duration-300 z-50">
          {successMessage}
        </div>
      )}
      
      {error && <Error error={error} />}
      {staffDetails && <MainDetailsCard staffDetails={staffDetails} />}

    </>
  );
}

export default MainAttendanceForm;


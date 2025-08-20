import { createContext, useContext, useReducer, useEffect } from "react";
// import API_BASE_URL from "../utils/apiConfig";
const API_BASE_URL = "https://attendance-system-p8yd.onrender.com";

const SettingsContext = createContext();

const initialState = {
  loading: false,
  error: null,
  organization: {
    name: "",
    logo: "",
    checkInTime: "",
    checkOutTime: "",
  },
  attendance: {
    enableAttendance: true,
    earliestCheckIn: "",
    latestCheckIn: "",
    earliestCheckOut: "",
    latestCheckOut: "",
    allowLateCheckIn: false,
    defaultWorkHours: 8,
  },
  profile: {
    email: "",
  },
};

function settingsReducer(state, action) {
  switch (action.type) {
    case "LOADING":
      return { ...state, loading: true, error: null };
    case "SET_ORGANIZATION":
      return { ...state, loading: false, organization: action.payload };
    case "SET_ATTENDANCE":
      return { ...state, loading: false, attendance: action.payload };
    case "SET_PROFILE":
      return { ...state, loading: false, profile: action.payload };
    case "ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export function SettingsProvider({ children }) {
  const [state, dispatch] = useReducer(settingsReducer, initialState);

  // Fetch settings once on app load
  useEffect(() => {
    const fetchSettings = async () => {
      dispatch({ type: "LOADING" });
      try {
        const res = await fetch(`${API_BASE_URL}/api/settings/organization`);
        if (!res.ok) throw new Error("Server Error");
        const data = await res.json();

        dispatch({ type: "SET_ORGANIZATION", payload: data });
        dispatch({ type: "SET_ATTENDANCE", payload: data });
        dispatch({ type: "SET_PROFILE", payload: { email: data.email } });
      } catch (err) {
        dispatch({ type: "ERROR", payload: err.message || "Failed to fetch settings" });
      }
    };

    fetchSettings();
  }, []);

  const updateOrganizationSettings = async (formData) => {
    dispatch({ type: "LOADING" });
    try {
      const res = await fetch(`${API_BASE_URL}/api/settings/organization`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      dispatch({ type: "SET_ORGANIZATION", payload: data });
    } catch (err) {
      dispatch({ type: "ERROR", payload: "Failed to update organization settings" });
    }
  };

  const updateAttendanceSettings = async (payload) => {
    dispatch({ type: "LOADING" });
    try {
      const res = await fetch(`${API_BASE_URL}/api/settings/attendance`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      dispatch({ type: "SET_ATTENDANCE", payload: data });
    } catch (err) {
      dispatch({ type: "ERROR", payload: "Failed to update attendance settings" });
    }
  };  
  

  const updateProfileSettings = async (payload) => {
    dispatch({ type: "LOADING" });
    try {
      const res = await fetch(`${API_BASE_URL}/api/settings/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      dispatch({ type: "SET_PROFILE", payload: data });
    } catch (err) {
      dispatch({ type: "ERROR", payload: "Failed to update profile" });
    }
  };
  
  

  return (
    <SettingsContext.Provider
      value={{
        state,
        dispatch,
        updateOrganizationSettings,
        updateAttendanceSettings,
        updateProfileSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
  
}

export function useSettings() {
  return useContext(SettingsContext);
}

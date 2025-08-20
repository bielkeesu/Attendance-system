import { createContext, useContext, useReducer, useEffect } from "react";
import { getApiUrl } from '../utils/apiConfig';


// Create context
const AttendanceContext = createContext();

function attendanceReducer(state, action) {
  switch (action.type) {
    case "SET_ATTENDANCES":
      return { ...state, attendances: action.payload || [] };
    case "ADD_ATTENDANCE":
      return { ...state, attendances: [action.payload, ...state.attendances] };
    case "DELETE_ATTENDANCE":
      return {
        ...state,
        attendances: state.attendances.filter((a) => a.id !== action.payload),
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, attendances: []};
    case "SET_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_TOTAL_PAGES":
      return { ...state, totalPages: action.payload };
    case "UPDATE_ATTENDANCE_STATUS":
      return {
        ...state,
        attendances: state.attendances.map((a) =>
          a.id === action.payload.id ? action.payload : a
        ),
      };

    default:
      return state;
  }
}

export function AttendanceProvider({ children }) {
  const [state, dispatch] = useReducer(attendanceReducer, {
    attendances: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
  });


  const fetchAttendances = async (page = 1) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const apiUrl = await getApiUrl();
      const res = await fetch(`${apiUrl}/api/attendance/page?page=${page}&limit=10`);
      const data = await res.json();
  
      dispatch({ type: "SET_ATTENDANCES", payload: data.data});
      dispatch({ type: "SET_TOTAL_PAGES", payload: data.totalPages || 1 });
      dispatch({ type: "SET_PAGE", payload: data.currentPage });
      dispatch({ type: "UPDATE_ATTENDANCE_STATUS", payload: data });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch attendance" });
      dispatch({ type: "SET_ATTENDANCES", payload: [] });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };
  

  useEffect(() => {
    fetchAttendances(state.currentPage);
    // const interval = setInterval(fetchAttendances, 10000)
    // return ()=> clearInterval(interval)
  }, [state.currentPage]);

  return (
    <AttendanceContext.Provider value={{ ...state, dispatch, fetchAttendances }}>
      {children}
    </AttendanceContext.Provider>
  );
}

export function useAttendances() {
  return useContext(AttendanceContext);
}

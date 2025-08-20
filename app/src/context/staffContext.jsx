import { createContext, useContext, useReducer, useEffect } from "react";
import { getApiUrl } from '../utils/apiConfig';


// Create context
const StaffContext = createContext();

// Reducer
function staffReducer(state, action) {
  switch (action.type) {
    case "SET_STAFFS":
      return { ...state, staffs: action.payload };
    case "ADD_STAFF":
      return { ...state, staffs: [action.payload, ...state.staffs] };
    case "UPDATE_STAFF":
      return {
        ...state,
        staffs: state.staffs.map((s) =>
          s.id === action.payload.id ? action.payload : s
        ),
      };
    case "DELETE_STAFF":
      return {
        ...state,
        staffs: state.staffs.filter((s) => s.id !== action.payload),
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, staffs: [] };
    default:
      return state;
  }
}

// Provider
export function StaffProvider({ children }) {
  const [state, dispatch] = useReducer(staffReducer, {
    staffs: [],
    loading: false,
    error: null,
  });

  // Fetch staff data
  const fetchStaffs = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const apiUrl = await getApiUrl();
      const res = await fetch(`${apiUrl}/api/staff`);
      const data = await res.json();
      dispatch({ type: "SET_STAFFS", payload: data });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch staff" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Load on mount
  useEffect(() => {
    fetchStaffs();
  }, []);

  return (
    <StaffContext.Provider value={{ ...state, dispatch, fetchStaffs }}>
      {children}
    </StaffContext.Provider>
  );
}

// Custom hook
export function useStaffs() {
  return useContext(StaffContext);
}

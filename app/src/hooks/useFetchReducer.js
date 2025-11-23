// hooks/useNotificationReducer.js
import { useEffect, useReducer, useCallback } from "react";

const initialState = {
  notifications: [],
  loading: true,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, notifications: action.payload, loading: false };
    case "FETCH_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "MARK_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, is_read: 1 } : n
        ),
      };
    case "CLEAR_ALL":
      return { ...state, notifications: [] };
    default:
      return state;
  }
}

export function useNotificationReducer() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // FETCH ONCE — WITH useCallback (prevents infinite loop)
  const fetchNotifications = useCallback(async () => {
    try {
      dispatch({ type: "FETCH_START" });
      const res = await fetch("/api/notifications");

      if (!res.ok) throw new Error("Network error");

      const data = await res.json();
      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (err) {
      dispatch({ type: "FETCH_ERROR", payload: err.message });
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = (id) => {
    dispatch({ type: "MARK_READ", payload: id });
  };

  const clearNotifications = () => {
    dispatch({ type: "CLEAR_ALL" });
  };

  return {
    ...state,
    markAsRead,
    clearNotifications,
    refetch: fetchNotifications,
  };
}

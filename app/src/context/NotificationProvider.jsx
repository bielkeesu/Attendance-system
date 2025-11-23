import { createContext, useContext, useEffect, useReducer } from "react";

const NotificationContext = createContext();

const initialState = {
  notifications: [],
  loading: true,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
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

export function NotificationProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        dispatch({ type: "FETCH_START" });
        const res = await fetch("/api/notifications"); // your inbox API
        const data = await res.json();

        const notifications = data.map((item) => ({
          id: item.inboxId,
          message: `New comment from ${item.staffName}`,
          is_read: item.status !== "pending" ? 1 : 0,
        }));

        dispatch({ type: "FETCH_SUCCESS", payload: notifications });
      } catch (err) {
        dispatch({ type: "FETCH_ERROR", payload: err.message });
      }
    };

    fetchNotifications();
  }, []); // run once

  const markAsRead = (id) => {
    dispatch({ type: "MARK_READ", payload: id });
  };

  const clearNotifications = () => {
    dispatch({ type: "CLEAR_ALL" });
  };

  return (
    <NotificationContext.Provider
      value={{ ...state, markAsRead, clearNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);



// // context/NotificationProvider.jsx
// import { createContext, useContext } from "react";
// import { useNotificationReducer } from "../hooks/useNotificationReducer";

// const NotificationContext = createContext();

// export function NotificationProvider({ children }) {
//   const value = useNotificationReducer(); // fetch runs HERE ONCE
//   return (
//     <NotificationContext.Provider value={value}>
//       {children}
//     </NotificationContext.Provider>
//   );
// }

// export const useNotifications = () => useContext(NotificationContext);

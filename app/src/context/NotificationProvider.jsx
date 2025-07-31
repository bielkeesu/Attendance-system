import { createContext, useContext } from "react";
import { useNotificationReducer } from "../hooks/useNotificationReducer";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const value = useNotificationReducer();
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
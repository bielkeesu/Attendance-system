import { useReducer, useEffect } from 'react';

const initialState = {
  notifications: [],
  loading: true,
  error: null
};

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_SUCCESS':
      return { ...state, notifications: action.payload, loading: false };
    case 'FETCH_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'MARK_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, is_read: true } : n
        )
      };
    case 'CLEAR':
      return { ...state, notifications: [] };
    default:
      return state;
  }
}

export function useNotificationReducer() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/notifications');
      const data = await res.json();
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (err) {
      dispatch({ type: 'FETCH_ERROR', payload: err.message });
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    await fetch(`http://localhost:5000/api/notifications/mark-read/${id}`, { method: 'PUT' });
    dispatch({ type: 'MARK_READ', payload: id });
  };

  const clearNotifications = async () => {
    await fetch('http://localhost:5000/api/notifications/clear', { method: 'DELETE' });
    dispatch({ type: 'CLEAR' });
  };

  return { ...state, markAsRead, clearNotifications };
}



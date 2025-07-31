// hooks/useFetchReducer.js
import { useEffect, useReducer } from 'react';

const initialState = {
  data: [],
  loading: true,
  error: null,
};

function fetchReducer(state, action) {
  switch (action.type) {
    case 'FETCH_SUCCESS':
      return { ...state, data: action.payload, loading: false };
    case 'FETCH_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    default:
      return state;
  }
}

export function useFetchReducer(url) {
  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_START' });
      try {
        const res = await fetch(url);
        const result = await res.json();
        dispatch({ type: 'FETCH_SUCCESS', payload: result });
      } catch (err) {
        dispatch({ type: 'FETCH_ERROR', payload: err.message });
      }
    };

    fetchData();
  }, [url]);

  return state;
}

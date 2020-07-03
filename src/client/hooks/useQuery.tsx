import { useLocation } from 'react-router-dom';

// Renamed from useQuery to useLocationQuery due to conflict in name with react-query: useQuery
export const useLocationQuery = () => {
  return new URLSearchParams(useLocation().search);
};

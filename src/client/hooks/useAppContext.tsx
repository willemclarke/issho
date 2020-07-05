import { useConfig } from '../context/ConfigContext';

export const useAppContext = () => {
  const config = useConfig();
  return { ...config };
};

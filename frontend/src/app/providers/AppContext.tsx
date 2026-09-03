import { createContext, useContext } from 'react';
import type { AppDependenciesConfig } from './AppDependenciesConfig';
export const AppContext = createContext<AppDependenciesConfig | null>(null);
export const useAppDependencies = (): AppDependenciesConfig => {
  const value = useContext(AppContext);
  if (!value) throw new Error('App dependencies are not available.');
  return value;
};

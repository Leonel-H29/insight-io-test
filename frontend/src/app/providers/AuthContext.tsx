import { createContext, useContext } from 'react';
import type { AuthContextValue } from './AuthContextValue';
export const AuthContext = createContext<AuthContextValue | null>(null);
export const useAuthContext = (): AuthContextValue => {
  const value = useContext(AuthContext);
  if (!value) throw new Error('Authentication context is not available.');
  return value;
};

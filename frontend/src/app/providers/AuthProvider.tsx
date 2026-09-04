import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { AppContext } from './AppContext';
import { createAppDependencies } from './AppDependencies';
import { Auth0AuthenticationRepository } from '../../adapters/outbound/authentication/Auth0AuthenticationRepository';
import { Environment } from '../../infrastructure/config/Environment';
import { AuthContext } from './AuthContext';
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    getAccessTokenSilently,
    loginWithRedirect,
    logout: auth0Logout,
    isAuthenticated,
    user: auth0User,
    isLoading,
  } = useAuth0();
  const auth = useMemo(
    () =>
      new Auth0AuthenticationRepository(
        {
          getAccessTokenSilently,
          loginWithRedirect,
          logout: auth0Logout,
          isAuthenticated,
          user: auth0User,
        },
        Environment.auth0Audience
      ),
    [
      getAccessTokenSilently,
      loginWithRedirect,
      auth0Logout,
      isAuthenticated,
      auth0User,
    ]
  );
  const dependencies = useMemo(() => createAppDependencies(auth), [auth]);
  const [currentUser, setCurrentUser] =
    useState<Awaited<ReturnType<typeof auth.getCurrentUser>>>(null);
  const [userResolutionComplete, setUserResolutionComplete] = useState(false);
  const [error, setError] = useState('');
  const loading = isLoading || !userResolutionComplete;
  useEffect(() => {
    setUserResolutionComplete(false);
    void auth
      .getCurrentUser()
      .then(setCurrentUser)
      .catch(() => setCurrentUser(null))
      .finally(() => setUserResolutionComplete(true));
  }, [auth, isAuthenticated, auth0User]);
  const login = useCallback(async () => {
    setError('');
    try {
      await auth.login();
    } catch {
      setError('Invalid credentials or authentication unavailable.');
      throw new Error('Login failed.');
    }
  }, [auth]);
  const signOut = useCallback(() => {
    auth.logout();
    setCurrentUser(null);
  }, [auth]);
  return (
    <AppContext.Provider value={dependencies}>
      <AuthContext.Provider
        value={{ user: currentUser, loading, error, login, logout: signOut }}
      >
        {children}
      </AuthContext.Provider>
    </AppContext.Provider>
  );
};

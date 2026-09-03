import type { AuthenticatedUser } from '../../application/task/ports/outbound/AuthenticationRepository';
export interface AuthContextValue {
  user: AuthenticatedUser | null;
  loading: boolean;
  error: string;
  login: () => Promise<void>;
  logout: () => void;
}

export interface AuthenticatedUser {
  id: string;
  email?: string;
  name?: string;
  picture?: string;
}
export interface AuthenticationRepository {
  login(): Promise<void>;
  logout(): void;
  getAccessToken(): Promise<string | null>;
  getCurrentUser(): Promise<AuthenticatedUser | null>;
}

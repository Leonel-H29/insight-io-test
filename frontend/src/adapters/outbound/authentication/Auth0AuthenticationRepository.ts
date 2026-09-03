import type { User } from '@auth0/auth0-react';
import type {
  AuthenticationRepository,
  AuthenticatedUser,
} from '../../../application/task/ports/outbound/AuthenticationRepository';

export interface Auth0AuthenticationClient {
  getAccessTokenSilently: (options: {
    authorizationParams: { audience: string };
  }) => Promise<string>;
  loginWithRedirect: () => Promise<void>;
  logout: (options: { logoutParams: { returnTo: string } }) => void;
  isAuthenticated: boolean;
  user?: User;
}

export class Auth0AuthenticationRepository implements AuthenticationRepository {
  constructor(
    private readonly client: Auth0AuthenticationClient,
    private readonly audience: string
  ) {}

  async login(): Promise<void> {
    await this.client.loginWithRedirect();
  }

  logout(): void {
    this.client.logout({ logoutParams: { returnTo: window.location.origin } });
  }

  async getAccessToken(): Promise<string | null> {
    if (!this.client.isAuthenticated) return null;
    const token = await this.client.getAccessTokenSilently({
      authorizationParams: { audience: this.audience },
    });
    return token;
  }

  async getCurrentUser(): Promise<AuthenticatedUser | null> {
    const id = this.client.user?.sub;
    if (!this.client.isAuthenticated || !id) return null;
    return {
      id,
      email: this.client.user?.email,
      name: this.client.user?.name,
      picture: this.client.user?.picture,
    };
  }
}

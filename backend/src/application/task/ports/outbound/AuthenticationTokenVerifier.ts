import { AuthenticatedActor } from './AuthenticatedActor.js';
export interface AuthenticationTokenVerifier {
  verify(token: string): Promise<AuthenticatedActor>;
}

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AppRouter } from '../adapters/inbound/router/AppRouter';
import { AuthProvider } from '../app/providers/AuthProvider';
import { Auth0Provider } from '@auth0/auth0-react';
import { Environment } from '../infrastructure/config/Environment';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider
      domain={Environment.auth0Domain}
      clientId={Environment.auth0ClientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: Environment.auth0Audience,
      }}
    >
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
    </Auth0Provider>
  </StrictMode>
);

# Frontend

React + TypeScript + Vite + Bootstrap frontend using Hexagonal Architecture. Auth0 authentication is isolated in an outbound adapter and REST communication is isolated in `HttpTaskRepository`.

```bash
npm install
cp .env.example .env
npm run dev
npm run build
npm run cy:run
```

Configure Auth0's Allowed Callback URLs, Allowed Logout URLs and Allowed Web Origins for `http://localhost:5173`. Configure the Cypress `auth0Domain`, `email` and `password` values when running the real Auth0 E2E test.

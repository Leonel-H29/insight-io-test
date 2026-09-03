# Task Management

Production-oriented technical-test implementation: React + TypeScript + Vite frontend, Express + TypeScript backend, JSON REST, Auth0 authentication, PlanetScale MySQL, Bootstrap, Jest and Cypress.

## Architecture

Both applications use pragmatic Hexagonal Architecture. Domain/application code depends on abstractions; UI, HTTP, Auth0 and MySQL live at the boundaries. The backend uses an atomic conditional update for `markAsDone`, so concurrent requests cannot perform the transition twice. The operation is idempotent when the task is already `DONE`.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Prerequisites

- Node.js 20+
- npm 10+
- Auth0 SPA application + API
- PlanetScale MySQL database

## Setup

```bash
npm install
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Fill in the environment variables. Run `backend/database/schema.sql` in the PlanetScale console or your preferred migration workflow.

Configure the Auth0 SPA callback, logout and web origins for `http://localhost:5173`. Set the SPA client ID and API identifier in `frontend/.env.local`, and the Auth0 tenant domain and API identifier in `backend/.env.local`.

## Development

```bash
npm run dev
```

Backend: `http://localhost:3000`  
Frontend: `http://localhost:5173`

## Tests

```bash
npm test
npm run test:e2e
```

Cypress expects a configured Auth0 user and the application to be running. The E2E flow can use credentials supplied through Cypress environment variables; no production authentication bypass is included.

## Production build

```bash
npm run build
```

## API

- `GET /health`
- `POST /api/tasks`
- `GET /api/tasks`
- `GET /api/tasks/:taskId`
- `PATCH /api/tasks/:taskId`
- `DELETE /api/tasks/:taskId`
- `PATCH /api/tasks/:taskId/done`

All task endpoints require `Authorization: Bearer <Auth0 access token>`.

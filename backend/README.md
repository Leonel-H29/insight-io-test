# Backend

Express/TypeScript REST API using Hexagonal Architecture, Auth0 bearer-token verification and PlanetScale MySQL.

```bash
npm install
cp .env.example .env
npm run dev
npm test
npm run build
```

Run `database/schema.sql` against the configured PlanetScale database before using task endpoints.

Set `AUTH0_DOMAIN` to the tenant domain without `https://` and `AUTH0_AUDIENCE` to the Auth0 API identifier.

`GET /api/tasks` requires authentication and supports server-side pagination with `page` (default `1`) and `pageSize` (default `10`, maximum `100`). The response includes the task page and `totalItems`/`totalPages` metadata.

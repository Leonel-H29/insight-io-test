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

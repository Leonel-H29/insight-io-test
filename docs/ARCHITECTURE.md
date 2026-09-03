# Architecture

## 1. Approach

The project uses Hexagonal Architecture (Ports and Adapters) independently in the backend and frontend. The domain is framework-independent. The application layer orchestrates use cases through inbound and outbound ports. Adapters translate between external representations and those contracts.

## 2. Backend dependency direction

```text
HTTP / Auth0 adapters
        ↓
Application inbound ports → Use cases
        ↓
Domain
        ↑
Application outbound ports
        ↑
MySQL / Auth0 implementations
```

The composition root wires concrete adapters to use cases. Controllers never access repositories directly.

## 3. Frontend dependency direction

```text
React UI / Router
        ↓
Inbound ports → Use cases
        ↓
Domain
        ↑
Outbound ports
        ↑
REST / Auth0 adapters
```

React, browser APIs and HTTP remain outside domain/application code.

## 4. Domain

`Task` owns status invariants. Valid transitions are `PENDING → IN_PROGRESS → DONE → ARCHIVED`. The domain rejects all other transitions. DONE tasks only permit title-only correction through the update use case.

## 5. Authentication boundary

The frontend authenticates with Auth0 Universal Login through `@auth0/auth0-react` and obtains an access token for the configured API audience. The token is attached to REST requests. `@auth0/auth0-express-api` verifies the bearer token and creates an application `AuthenticatedActor` from the Auth0 `sub` claim. Auth0 implementation details never enter the domain.

## 6. Persistence boundary

The application depends on `TaskRepository`. The PlanetScale/MySQL adapter implements it. Persistence records are separate from domain entities and mapped explicitly.

`markAsDone` uses an atomic conditional update:

```sql
UPDATE tasks
SET status = 'DONE', updated_at = CURRENT_TIMESTAMP
WHERE id = ? AND owner_id = ? AND status = 'IN_PROGRESS'
```

One concurrent request can affect one row. A second request observes `DONE` and returns the existing task, making the endpoint idempotent.

## 7. API activity logging

Logging middleware records timestamp, method, path, sanitized headers, params, query, actor and response status/duration. Authorization credentials are redacted.

## 8. Validation

HTTP adapters validate transport shape and basic constraints. Domain/application logic remains authoritative for business invariants. The frontend performs UX validation but is never trusted for authorization.

## 9. Testing

Jest covers domain and application behavior using fakes/mocks. Integration tests exercise the persistence adapter where configuration is available. Cypress covers the real UI flow. No production authentication bypass exists.

## 10. Adding functionality

1. Add or extend domain behavior only when a business rule requires it.
2. Define a focused application inbound port.
3. Implement a focused use case using outbound ports.
4. Add an inbound adapter such as an HTTP controller or UI hook.
5. Add/extend outbound adapters for external systems.
6. Wire concrete dependencies in the composition root.
7. Add tests and update this document for architectural decisions.

## 11. Common violations to avoid

- Business rules in controllers/components/hooks.
- `fetch`, Express, Auth0 or MySQL imports in domain/application core.
- Concrete repositories instantiated inside use cases.
- Persistence records used as domain entities.
- Client-supplied owner IDs used for authorization.
- Logging access/refresh tokens.
- Generic `utils.ts`, `helpers.ts`, `common.ts` dumping grounds.

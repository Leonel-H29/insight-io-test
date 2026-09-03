# Implementation Plan

## Requirements → architecture

| Requirement           | Implementation                                                |
| --------------------- | ------------------------------------------------------------- |
| React/TypeScript/Vite | `frontend/` UI adapter and framework bootstrap                |
| Express/TypeScript    | `backend/` HTTP inbound adapter                               |
| JSON REST             | `/api/tasks` routes + `HttpTaskRepository`                    |
| Auth0                 | Auth0 React SPA adapter + Auth0 Express API middleware        |
| PlanetScale MySQL     | MySQL repository adapter + `database/schema.sql`              |
| Bootstrap             | React UI components use Bootstrap classes                     |
| Task CRUD             | Six focused backend use cases and corresponding UI operations |
| Status rules          | Framework-independent `Task` domain entity                    |
| Owner authorization   | Auth0 actor + owner-scoped repository queries                 |
| Atomic completion     | Conditional MySQL update on `IN_PROGRESS`                     |
| API logging           | HTTP middleware with credential redaction                     |
| Jest                  | Domain/application unit tests                                 |
| Cypress               | Real authenticated create/start/done flow                     |

## Final tree

```text
task-management/
├── backend/
│   ├── database/schema.sql
│   ├── src/domain/task/
│   ├── src/application/task/
│   ├── src/adapters/inbound/http/
│   ├── src/adapters/outbound/{authentication,persistence}/
│   ├── src/infrastructure/database/
│   ├── src/config/settings/
│   ├── src/main/bootstrap.ts
│   └── tests/{unit,integration}
├── frontend/
│   ├── src/domain/task/
│   ├── src/application/task/
│   ├── src/adapters/inbound/{router,ui}
│   ├── src/adapters/outbound/{authentication,http}
│   ├── src/infrastructure/config/
│   ├── src/app/providers/
│   ├── src/main/bootstrap.tsx
│   └── cypress/e2e/
├── docs/ARCHITECTURE.md
├── docs/IMPLEMENTATION-PLAN.md
└── README.md
```

## File inventory

The code is intentionally feature-focused. Domain files represent task invariants; application files represent ports, commands, DTOs and use cases; inbound HTTP files translate requests; outbound persistence/authentication files implement external dependencies; frontend UI files adapt React interactions to application ports; documentation files explain setup and architectural decisions.

## Dependency diagram

```text
React UI → inbound port → frontend use case → domain
                                      ↓
                              outbound port
                                      ↓
                              REST adapter
                                      ↓
                               Express API
                                      ↓
                             backend use case
                                      ↓
                                    domain
                                      ↓
                              TaskRepository
                                      ↓
                             PlanetScale/MySQL
```

Authentication runs at the external boundary: React → Auth0 Universal Login → JWT → Express middleware → authenticated actor.

## Use-case flows

- **Create:** form → create hook → CreateTaskUseCase → Task.create → TaskRepository → MySQL.
- **List:** task page → list hook → ListTasksUseCase → TaskRepository → MySQL.
- **Get:** HTTP route → GetTaskUseCase → owner-scoped repository query.
- **Update:** form/action → UpdateTaskUseCase → domain transition/title rule → repository.
- **Delete:** UI confirmation → DeleteTaskUseCase → owner-scoped repository deletion.
- **Mark done:** UI → MarkTaskAsDoneUseCase → domain eligibility → atomic conditional update → PlanetScale; if already DONE, return the existing task.

## Model mapping

Database `TaskRecord` is mapped to domain `Task`; application `TaskResult` is mapped to API/HTTP data; frontend API DTOs are mapped to application results and then to `TaskViewModel` for presentation.

## Technology decisions

React + TypeScript + Vite; Express + TypeScript; JSON REST; Auth0; PlanetScale MySQL via `mysql2`; Bootstrap; Fetch API; React Router; local React state; Jest; Cypress. No global state library, ORM, GraphQL, Lambda, queue, cache or microservice architecture is introduced because the requirements do not justify them.

## Architectural decisions

- Monorepo is preferred for a three-day technical-test delivery and demonstration.
- `mysql2` is used directly instead of an ORM to keep persistence small and explicit.
- DONE title correction is treated as a title-only update; no typo-detection algorithm is invented.
- DONE → ARCHIVED remains a valid status transition and is exposed as a separate Archive action; it is not treated as normal field editing.
- Repeated `markAsDone` against an already-DONE task returns the current task successfully. A concurrent request that loses the atomic update re-reads the task and receives the same final state.
- Cypress uses real Auth0 credentials supplied through Cypress environment variables rather than a production authentication bypass.

# Community → Social integration

Status: **in progress; not production-ready**.

## Current state

- Social is a React/Vite prototype; several views and interactions use `src/data/mockData` and local component state.
- Imported Community sources are under `community-sidecar/`. They depend on h00k-only modules (auth context, archive context, chart types/engine, API helpers).
- Community backend depends on a PostgreSQL schema, secure account/session middleware, image processing and market-data integrations. The imported files are not a standalone backend.
- `src/integrations/community/api.ts` adds a same-origin, cookie-aware client transport. It is **not yet connected to the Social views**.

## Required work before release

1. Decide the target deployment architecture: Social frontend and Community API under one trusted origin, or a dedicated BFF with secure session handling. Avoid browser-side credentials and permissive CORS.
2. Port or replace Community's h00k-specific dependencies, keeping account/session validation, CSRF defenses, permission checks and privacy rules intact.
3. Implement an independently deployable backend using Community routes, schema migrations, database pool, uploads and authentication. Do not reuse production credentials or databases.
4. Replace Social mock feed, comments, reactions, profiles, friends, messages, and notifications with server responses and real loading/error states. Map Community response fields explicitly.
5. Integrate chart sharing without exposing private account/trade data; validate public profile visibility and audience rules server-side.
6. Add tests for authentication, authorization, visibility, post creation, comments, messaging, profile settings and migration rollback.
7. Run dependency installation, TypeScript checks, integration tests and a staging smoke test before requesting a merge.

## Safety

Do not deploy this branch or merge into `main` until the above checks pass. Do not copy `.env.community`, database dumps, API keys, media volumes, or deployment archives into the public repository. No production Docker containers, DBs, or DNS need to be changed during integration.

# Architecture decision: Social owns its identity and database

Decision: Social runs with a **dedicated PostgreSQL database, DB role, session cookie and user identities**. No automatic h00k account import, production database access, or shared sessions.

## Existing Community source is not yet isolated

The imported Community schema uses `hc_*` tables and its authentication code currently reads `DATABASE_URL` and issues `h00k_session` cookies. **Do not run or deploy those files as-is for Social.** The Social database factory in `server/social/database.ts` intentionally requires `SOCIAL_DATABASE_URL`; it is not yet wired to the imported routes.

## Implementation requirements

- Port the Community account/session modules to Social-owned configuration and cookie names; ensure registration, password hashing, email verification, reset, MFA, session revocation and CSRF protections work independently.
- Adapt Community migrations for a fresh Social database. Keep all access through a dedicated least-privileged DB role. Never point `SOCIAL_DATABASE_URL` at h00k production or staging.
- Build the Social API entrypoint and explicitly wire account routes, Community routes, public profiles, media storage, request limits and error handling.
- Connect the React UI to real API responses; remove mock identity and mock social interactions. Add explicit unauthenticated, loading, empty and failure states.
- Add tests for user isolation, session cookies, profile visibility, permissions, data deletion and login/logout. Validate staging deployment before merging.

## Future h00k linking

Optional linking requires a separately designed, consent-based verification flow; never match users solely by email or username.

## Current progress

Dedicated DB factory and example configuration are committed. **Backend bootstrapping, isolated authentication, migrations, frontend wiring and end-to-end tests are still pending.** No VPS or database has been modified.

## Implementation update (2026-11-11)

- `server/social/index.ts` implements a separate **prototype** API with registration, SMTP email confirmation, Argon2id passwords, hashed session tokens, logout, public posts and reactions.
- `server/social/schema.sql` defines a separate Social schema.
- Social Community home now displays a live API-backed feed and an independent login/registration gate.
- Vite development proxy routes `/api` to the local Social API at port 3100.
- Start only with a fresh, dedicated DB and explicitly set `SOCIAL_RUN_MIGRATIONS=1` for the first migration run. The service listens on localhost only.
- **Not production-ready**: password reset, MFA, friends, comments, messages, notifications, profile settings, privacy/audience enforcement beyond public/private, moderation, durable rate limiting, database migration versioning, and full UI data mapping remain unfinished. Imported h00k modules are reference code, not wired into the Social server.
- No CI/build/staging smoke test has been run, and the package lockfile must be regenerated in a controlled development environment.

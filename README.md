# Поймай Жука

Math arcade and learning platform built with Next.js, Tailwind, Supabase
and a hand-rolled canvas game engine.

The platform combines a real-time bug-catching arcade with an arithmetic
trainer: the player solves equations, captures the correct answer, builds
combos and ranks up. Sessions, achievements and aggregate stats are stored
per user.

## Stack

- **Next.js 16** (App Router, Turbopack) with React 19
- **TypeScript** strict mode
- **Tailwind CSS 4**
- **Supabase** — Auth, Postgres, RLS, triggers
- **Canvas** game engine — pure TypeScript, no React dependency
- **lucide-react**, **framer-motion** — UI

## Project layout

```
src/
  app/                 # App Router routes
    api/sessions       # POST/GET game sessions
    api/stats          # GET user stats
    api/achievements   # GET/POST achievements
    api/health         # App Platform healthcheck
    auth/login         # Suspense-wrapped login form
    auth/register      # Sign-up with age_group + display_name
    dashboard          # Authenticated overview
    progress           # History + achievements grid
    play               # Game shell
    theory/[slug]      # Static educational articles
  components/
    game/              # GameCanvas, GameControls, GameResults, GameStats, GameRules
    layout/            # Header, Footer
  hooks/
    useAuth            # Supabase session + profile
    useGameSessions    # Save/load sessions, stats, achievements
    useBackgroundMusic # Audio element lifecycle
    useLocalStorageBoolean # SSR-safe localStorage flag
  lib/
    game/engine.ts     # Canvas game engine
    game/equations.ts  # Math problem bank
    supabase/          # Browser/server clients, middleware, server actions
    validation/api.ts  # Runtime validation for API payloads
  proxy.ts             # Next.js middleware (Supabase session refresh + protected routes)
  types/index.ts       # Shared types + rank table
supabase/
  schema.sql           # Full DB schema for fresh bootstrap
  migrations/          # Incremental SQL migrations for applied schema changes
public/
  audio/               # Background music
```

## Prerequisites

- Node **22.x** (`node --version` should print `v22.*`)
- npm **10.x**
- A Supabase project (free tier is enough)

## Environment variables

Create `.env.local` at the repo root:

```
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable_or_anon_key>
NEXT_PUBLIC_SITE_URL=https://neurozhuk.ru
```

Both legacy JWT anon keys (`eyJhbGciOi...`) and the newer publishable
key format (`sb_publishable_...`) are accepted. The client treats the
following placeholder values as "not configured" and switches the UI to
demo-mode:

- `your-project-url`, `placeholder` (URL)
- `your-anon-key`, `placeholder` (key)

For Docker/App Platform deployment, `NEXT_PUBLIC_*` values must be available
during the Docker build and at runtime. Next.js embeds public env values into
the browser bundle during `npm run build`.

## Database setup

The full schema lives in `supabase/schema.sql`. To bootstrap a fresh Supabase
project, paste it into the SQL Editor and run it once.

The schema creates:

| table          | purpose                                                  |
| -------------- | -------------------------------------------------------- |
| `profiles`     | display name, avatar URL, age group (child/adult)        |
| `game_sessions`| one row per finished session (with full runtime metrics) |
| `user_stats`   | per-user aggregates, recomputed by trigger after inserts |
| `achievements` | one row per unlocked achievement (`UNIQUE(user, key)`)   |

Plus:

- **RLS** enabled on every table — users can only read/write their own rows
- **Trigger** `on_auth_user_created` — auto-creates `profiles` and
  `user_stats` rows from `auth.users` metadata (`display_name`, `age_group`)
- **Trigger** `on_game_session_inserted` — recomputes aggregates and the
  daily streak in `user_stats` after every session insert

### Migrations applied (history)

| migration                             | what it does                                        |
| ------------------------------------- | --------------------------------------------------- |
| `initial_schema`                      | All four tables, RLS, triggers                      |
| `allow_practice_mode`                 | Adds `practice` to the `mode` CHECK constraint      |
| `extend_game_sessions_with_runtime_metrics` | Adds `level`, `max_combo`, `total_correct`, `total_wrong` columns |
| `handle_new_user_with_age_group`      | Trigger now reads `age_group` from user metadata    |

The incremental SQL files are stored in `supabase/migrations/`. For an
existing database, apply only migrations that have not yet been applied. For a
new database, run `supabase/schema.sql` once.

## Local development

```bash
npm install
npm run dev          # Turbopack dev server on http://localhost:3000
```

Other scripts:

| command          | what it does                                  |
| ---------------- | --------------------------------------------- |
| `npm run dev`    | Dev server with Turbopack                     |
| `npm run build`  | Production build                              |
| `npm run start`  | Run a production build                        |
| `npm run lint`   | ESLint                                        |
| `npx tsc --noEmit` | TypeScript-only check (no JS emit)          |

## Docker production build

The app is configured with `output: "standalone"` in `next.config.ts`.

Build locally:

```bash
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  --build-arg NEXT_PUBLIC_SITE_URL="https://neurozhuk.ru" \
  -t neurozhuk:prod .
```

Run locally:

```bash
docker run --rm -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -e NEXT_PUBLIC_SITE_URL="https://neurozhuk.ru" \
  neurozhuk:prod
```

Healthcheck:

```bash
curl http://localhost:3000/api/health
```

Expected response: HTTP 200 with `{"status":"ok"}`.

## Timeweb Cloud App Platform deployment

Recommended deployment route:

1. Push this repository to GitHub.
2. In Timeweb Cloud, create an App Platform application from GitHub.
3. Select Dockerfile-based deployment and use repository root as the build
   context.
4. Set app port to `3000`.
5. Set healthcheck path to `/api/health`.
6. Add env variables from `.env.example` both for build and runtime if the
   panel separates them.
7. Deploy and first test the generated technical domain.

Timeweb Cloud NS for delegating `neurozhuk.ru` from REG.RU:

```text
ns1.timeweb.ru
ns2.timeweb.ru
ns3.timeweb.org
ns4.timeweb.org
```

When the custom domain is linked to an App Platform app, Timeweb Cloud issues
and renews the free Let's Encrypt certificate automatically.

Production env:

| variable | required | value |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Supabase anon/publishable key |
| `NEXT_PUBLIC_SITE_URL` | yes | `https://neurozhuk.ru` |
| `SECURITY_ALLOWED_ORIGINS` | no | comma-separated extra same-origin hosts for technical deploy domains |
| `NODE_ENV` | yes | `production` |
| `PORT` | yes | `3000` |

Supabase production Auth settings:

- Site URL: `https://neurozhuk.ru`
- Redirect URLs:
  - `https://neurozhuk.ru/**`
  - `https://www.neurozhuk.ru/**`
  - Timeweb technical domain with `/**` while testing

After DNS is moved and SSL is issued, remove temporary technical-domain
redirect URLs if they are no longer needed.

## Auth flow

- **Email + password** via Supabase Auth (`@supabase/ssr`)
- The `signUp` server action passes `display_name` and `age_group` into
  `raw_user_meta_data`; the DB trigger writes them into `profiles`
- The `proxy.ts` middleware calls `updateSession()` on every request,
  refreshes Supabase cookies, and redirects unauthenticated users away
  from `/dashboard` and `/progress` (status 307 → `/auth/login?redirect=…`)

If your Supabase project has email confirmation enabled, users have to
verify their email before they get a session. To skip that for a local
demo, disable it in **Supabase → Authentication → Email → Enable email
confirmations**.

## Game flow

1. User opens `/play`
2. Picks `normal`, `timed` or `practice` mode and a difficulty
3. Plays — `GameEngine` emits state via `GameCallbacks`
4. **Finish:** any time during play, "Завершить тренировку" calls
   `engine.finish()` (timed mode also auto-finishes on timeout)
5. `onGameEnd(session)` returns a fully populated `GameSession`
6. Client posts to `/api/sessions` (validated server-side)
7. Server inserts the row, the DB trigger updates `user_stats`
8. Client posts to `/api/achievements` to unlock new ones
9. Results modal shows real save status (saving / saved / error /
   unauthenticated / unconfigured) and any newly-unlocked achievements

## Production build sanity

The build is expected to:

- Compile **0 TypeScript errors**
- Pass `npm run lint` clean (no errors, no warnings)
- Generate static pages for `/`, `/about`, `/auth/login`, `/auth/register`,
  `/dashboard`, `/progress`, `/play`, `/theory`, `/theory/[slug]`,
  `/parents`, `/faq`, `/privacy`, `/terms`
- Register `/api/*` as dynamic routes
- Register `proxy.ts` as middleware

## License

Internal school project. Not licensed for public redistribution.

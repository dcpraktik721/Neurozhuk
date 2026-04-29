# CLAUDE.md — Поймай Жука

## Stack

- **Framework**: Next.js 16.2.3 (App Router, `src/` directory)
- **Runtime**: React 19.2.4, TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/postcss`, no tailwind.config — uses `@import "tailwindcss"` in globals.css)
- **Auth / DB**: Supabase (`@supabase/ssr` + `@supabase/supabase-js`). Not configured yet — `.env.local` has empty values.
- **Animation**: framer-motion 12
- **Icons**: lucide-react
- **Utilities**: clsx
- **Lint**: ESLint 9 flat config (`eslint.config.mjs`) — `eslint-config-next` core-web-vitals + typescript
- **Fonts**: Geist + Geist Mono (next/font/google)
- **Tests**: None configured

## Commands

```bash
npm run dev      # Start dev server on :3000
npm run build    # Production build (strict TS — zero errors required)
npm run start    # Start production server
npm run lint     # ESLint check
```

## Directory Structure

```
src/
  app/                    # Next.js App Router pages
    layout.tsx            # Root layout (Header + Footer wrap all pages)
    page.tsx              # Landing page (/)
    play/page.tsx         # Game page — main product feature
    theory/page.tsx       # Theory articles index
    theory/[slug]/page.tsx
    about/page.tsx
    faq/page.tsx
    parents/page.tsx
    privacy/page.tsx
    terms/page.tsx
    auth/login/page.tsx
    auth/register/page.tsx
    dashboard/page.tsx    # Protected — requires auth
    progress/page.tsx     # Protected — requires auth
    api/
      sessions/route.ts   # Game session CRUD
      stats/route.ts      # User stats
      achievements/route.ts
    globals.css           # Tailwind import + custom styles
  components/
    game/
      GameCanvas.tsx      # Canvas wrapper, touch controls, toast notifications
      GameControls.tsx    # Mode/difficulty selector, start/pause/reset buttons
      GameResults.tsx     # End-of-game results modal
      GameRules.tsx       # Rules modal
      GameStats.tsx       # Right sidebar stats panel (desktop)
    home/
      HeroSection.tsx     # Landing page sections
      BenefitsSection.tsx
      HowItWorksSection.tsx
      AudienceSection.tsx
      TheoryPreviewSection.tsx
      ProgressPreviewSection.tsx
      CTASection.tsx
      TrustSection.tsx
    illustrations/
      BeetleHero.tsx      # Green SVG beetle mascot with antennae, legs, glow filter + sparkle anim
      BrainCircuit.tsx    # Purple brain + neural pathways, pulsing nodes, yellow lightning bolt
      GamePreview.tsx     # Inline SVG game-field preview (enemies, player, HUD, equation bar)
      NeuronPattern.tsx   # Animated neural-network SVG background (dots + paths + traveling pulse)
    layout/
      Header.tsx          # Global nav bar
      Footer.tsx          # Global footer
  lib/
    game/
      engine.ts           # Game engine class (~920 LOC). Pure canvas, no React.
      equations.ts        # 190+ math equations, difficulty 1-3
    supabase/
      client.ts           # Browser Supabase client
      server.ts           # Server Supabase client
      middleware.ts       # Session refresh helper (used by proxy.ts)
      auth-actions.ts     # Server actions for auth
    seo.ts                # Metadata generator helper
  hooks/
    useAuth.ts            # Auth state hook (Supabase)
    useGameSessions.ts    # Game session persistence hook
  content/
    theory-articles.ts    # Static theory article data
  types/
    index.ts              # All shared types + RANKS constant + getRank()
  proxy.ts                # Next.js 16 proxy (replaces middleware.ts)
supabase/
  schema.sql              # DB schema: profiles, game_sessions, achievements, user_stats + RLS
```

## Architecture Rules

### Routing & Rendering
- `proxy.ts` — Next.js 16 replaced `middleware.ts` with `proxy.ts`. Export `default function proxy()`.
- Protected routes (`/dashboard`, `/progress`) redirect to `/auth/login` via proxy when Supabase is configured.
- Pages that need browser APIs use `'use client'` at the top.
- Server components are default — don't add `'use client'` unless needed.

### Game Engine
- `GameEngine` class in `src/lib/game/engine.ts` — pure canvas, zero React dependency.
- Communicates with React via callback interface (`GameCallbacks` in `types/index.ts`).
- React wrapper: `GameCanvas.tsx` creates the engine, passes callbacks, handles lifecycle.
- State flows UP via callbacks: engine -> GameCanvas -> PlayPage -> child components.
- Config constants: canvas 800x800, player 48px, enemy 44px, 3 enemies/side.
- Spawn zones: left enemies at y=0-200 (top, move down), right enemies at y=600-800 (bottom, move up).

### Types
- All shared types in `src/types/index.ts`. Import from `@/types`.
- Key types: `GameMode`, `GameState`, `DifficultyMode`, `Enemy`, `Player`, `GameSession`, `GameCallbacks`.
- `RANKS` array and `getRank(score)` function live in types file.

### Code Style
- Path alias: `@/*` maps to `./src/*`. Always use `@/` for imports, never relative `../`.
- Components: named exports for internal, default exports for page components.
- File headers: `// ========================================` block comment with module description.
- Hooks use `'use client'` directive.
- `useCallback` for all handlers passed as props.
- No prettier configured — follow existing whitespace (2-space indent, single quotes, trailing commas).

### Supabase
- Not connected yet. `.env.local` has empty `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- All Supabase code gracefully degrades: checks `isSupabaseConfigured()` or `!url || !key` before API calls.
- Schema in `supabase/schema.sql` — tables: `profiles`, `game_sessions`, `achievements`, `user_stats`. All have RLS.

### Key Gotchas
- Next.js 16: uses `proxy.ts` NOT `middleware.ts`. Export must be `export default function proxy()`.
- Tailwind v4: no `tailwind.config.js`. Configuration is CSS-first via `@import "tailwindcss"`.
- Supabase SSR is NOT Edge-compatible. Don't import `@supabase/ssr` in `proxy.ts` statically.
- Game engine spawns enemies at canvas edges only — never in center safe zone around the player.
- **Tailwind v4 + global `p {}` override**: `globals.css` has `p { color: #334155 }` which beats any Tailwind `text-*` utility on `<p>` elements due to injection order. Use `style={{ color: '#ffffff' }}` (inline) to guarantee white text on dark backgrounds.

---

## Design & Visual Identity

### Theme
Dark slate base (`slate-950 / slate-900`), green accent (`#22C55E`), amber highlight for game UI. Illustration-first — no external images; all graphics are inline SVG components.

### Illustration Components (`src/components/illustrations/`)
All components accept optional `className` prop for sizing.

| Component | Where used | Description |
|---|---|---|
| `BeetleHero` | HeroSection, AudienceSection (kids), CTASection | Animated green beetle with sparkle, glow filter, neural lines |
| `BrainCircuit` | AudienceSection (adults) | Purple brain + pulsing circuit nodes + lightning bolt |
| `GamePreview` | HowItWorksSection | Static SVG game-field mock: enemies with numbers, player, HUD |
| `NeuronPattern` | HeroSection (bg), CTASection (bg) | Animated neural net: nodes + edges + traveling pulse |

### Section-by-section changes (2026-04-12)
- **HeroSection**: Replaced emoji 🪲 with `<BeetleHero className="w-36 h-40">`, `<NeuronPattern>` as absolute background, subtitle `text-white/90 font-medium`.
- **HowItWorksSection**: Added `<GamePreview>` below 3 steps in dark card (`bg-slate-800/50`, green glow border). Body text: `text-slate-600`.
- **AudienceSection**: Kids card → `<BeetleHero>`, Adults card → `<BrainCircuit>`. List text: `text-slate-700`.
- **CTASection**: `<BeetleHero>` + `<NeuronPattern>` background replace floating emoji.
- **globals.css**: `p { color: #334155 }` (was `#475569`) for better WCAG contrast on white backgrounds.

### Game UI — Equation Panel
`GameStats.tsx` (desktop) and mobile bar in `play/page.tsx`: solid amber gradient, forced white text:
```tsx
<div className="bg-gradient-to-r from-amber-700 to-orange-700 border-2 border-amber-400 rounded-2xl p-4 text-center">
  <p style={{ color: '#ffffff' }}>НАЙДИ ЖУКА С ЧИСЛОМ</p>
  <p style={{ color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>{equation}</p>
</div>
```

### Play Page Hero (idle state)
```tsx
<span className="text-green-400">Поймай</span> <span className="text-green-400">жука</span>
// Subtitle: style={{ color: '#ffffff' }} — NOT text-white (overridden by global p{})
```

---

## Game Engine Tuning (2026-04-12)

`src/lib/game/engine.ts` — verified values after spawn collision fixes:

| Config key | Old | New | Reason |
|---|---|---|---|
| `enemyCount` | 6 | **3** | 3L+3R=6 total (was 12, caused stacking) |
| Spawn zone height | 120px | **200px** | More room per enemy |
| `safeRadius` | 180 | **130** | 180 blocked all left-side spawns |
| Min enemies/side threshold | 5 | **3** | Matches new enemyCount |

Left-side enemies spawn at `y = 0–200` (top), move downward.
Right-side enemies spawn at `y = 600–800` (bottom), move upward.

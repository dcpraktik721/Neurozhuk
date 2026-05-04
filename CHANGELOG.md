# Changelog

Журнал изменений и выкладок проекта `neurozhuk`.

Правило ведения:
- добавлять запись при каждом заметном изменении UI, логики, инфраструктуры или деплоя;
- указывать дату, область изменения, краткий результат и статус выкладки.

## 2026-05-04

### Repository documentation hygiene
- Область: repository hygiene, documentation structure
- Изменение: безопасные SEO, игровые и журнальные материалы вынесены из root в `docs/`; локальные Claude/preview/security/diagnostic артефакты добавлены в `.gitignore`, чтобы не попасть в GitHub и production deploy случайно
- Файлы:
  - `.gitignore`
  - `.dockerignore`
  - `docs/audits/LLM_SEO_AUDIT_NEUROZHUK.md`
  - `docs/game/GAME_EQUATIONS_BY_DIFFICULTY.md`
  - `docs/prompts/SEO_MASTER_PROMPT.md`
  - `docs/articles/NEUROZHUK_SCIENCE_POPULAR_TECH_ARTICLE.docx`
- Проверка: `git diff --check`, secret-scan commit candidates, `npm run lint`, `npx tsc --noEmit`, `npm run build`
- Статус: локально проверено, runtime-код не затронут

### Game movement stability and repo cleanup
- Область: game engine, repository hygiene
- Изменение: добавлен верхний предел скорости жуков, исправлен редкий случай полного совпадения координат при антистеке, временные каталоги `tmp_*` удалены и добавлены в `.gitignore`
- Файлы:
  - `src/lib/game/engine.ts`
  - `.gitignore`
- Проверка: `npm run lint`, `npx tsc --noEmit`, `npm run build`
- Статус: локально проверено, подготовлено к redeploy

### Background music start latency fix
- Область: play flow, background music
- Изменение: устранена задержка старта музыки при начале игры; для `/play` добавлен preload MP3, а `useBackgroundMusic` теперь заранее создает и загружает `Audio`, сохраняет прямой запуск из пользовательского действия и повторяет старт после готовности буфера
- Файлы:
  - `src/app/play/page.tsx`
  - `src/hooks/useBackgroundMusic.ts`
- Проверка: `npm run lint`, `npx tsc --noEmit`, `npm run build`, локальная проверка `/play` на наличие audio preload и доступность `/audio/frog-game.mp3`
- Статус: локально проверено, подготовлено к redeploy

### Rank system expansion
- Область: game progression, ranks, rules UI
- Изменение: ранговая система расширена после уровня `Совершенство`; добавлены 20 новых рангов до `Бесконечность (27390+)`, а сетка списка званий в правилах уплотнена для корректного отображения длинной шкалы
- Файлы:
  - `src/types/index.ts`
  - `src/components/game/GameRules.tsx`
- Проверка: `npm run lint`, `npx tsc --noEmit`, `npm run build`, контрольные проверки порогов рангов
- Статус: локально проверено, подготовлено к redeploy

### Game results visual polish
- Область: game results modal, end-of-session UI
- Изменение: переработан экран итогов игры без изменения игровой логики; убран тяжелый серый вид, добавлен цельный dark arcade gradient, усилена читаемость итогового счета, ранга, карточек статистики и action-кнопок
- Файлы:
  - `src/components/game/GameResults.tsx`
- Проверка: `npm run lint`, локальный visual preview `/game-results-preview`
- Статус: закоммичено локально, ожидает redeploy

### Play flow and music controls
- Область: play flow, background music, replay behavior
- Изменение: музыка теперь стартует и останавливается синхронно с действиями пользователя (`start`, `pause`, `resume`, `finish`, `reset`); кнопка `Играть ещё` возвращает игрока в меню `/play`, а не запускает новую сессию мгновенно
- Файлы:
  - `src/app/play/page.tsx`
  - `src/hooks/useBackgroundMusic.ts`
- Проверка: `npm run lint`, локальные HTTP-проверки `/` и `/play`, ручной smoke-flow
- Статус: закоммичено локально и запушено в `main`, ожидает redeploy

## 2026-05-03

### Security hardening
- Область: auth, API, runtime hardening, dependencies
- Изменение: усилены security headers и отключен `x-powered-by`; добавлены in-memory rate-limit, state-changing Origin/Referer checks, нейтральные auth-ошибки, парольная политика от 8 символов, серверный пересчет accuracy/rank и score integrity checks; `/api/health` очищен от fingerprint/debug-полей и логирования user-agent
- Файлы:
  - `next.config.ts`
  - `src/lib/security/*`
  - `src/lib/supabase/auth-actions.ts`
  - `src/hooks/useAuth.ts`
  - `src/app/auth/register/page.tsx`
  - `src/app/api/sessions/route.ts`
  - `src/app/api/achievements/route.ts`
  - `src/app/api/stats/route.ts`
  - `src/app/api/health/[[...path]]/route.ts`
  - `src/lib/validation/api.ts`
  - `public/.well-known/security.txt`
  - `.github/dependabot.yml`
  - `.github/workflows/security.yml`
- Проверка: `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm audit --omit=dev`, local `curl` headers/health/rate-limit, standalone health smoke
- Статус: локально проверено, подготовлено к redeploy

## 2026-05-02

### SEO technical foundation
- Область: SEO, metadata, индексация
- Изменение: добавлены `robots.txt`, `sitemap.xml`, `manifest.webmanifest`, branded 404 и базовый `og.png`; исправлены metadata helper, корневые Open Graph/Twitter metadata и дублирующийся `<title>` на `/play`
- Файлы:
  - `src/lib/seo.ts`
  - `src/app/layout.tsx`
  - `src/app/play/page.tsx`
  - `src/app/play/layout.tsx`
  - `src/app/robots.ts`
  - `src/app/sitemap.ts`
  - `src/app/manifest.ts`
  - `src/app/not-found.tsx`
  - `src/app/theory/[slug]/page.tsx`
  - `public/og.png`
- Проверка: `npm run lint`, `npx tsc --noEmit`, `npm run build`, локальные HTTP-проверки
- Статус: локально проверено, подготовлено к redeploy

### Footer logo update
- Область: footer, branding
- Изменение: старый inline SVG `LevArtMark` заменен на реальный PNG-логотип `LOGO Levart.png`
- Файлы:
  - `src/components/layout/Footer.tsx`
  - `public/branding/levart-footer-logo.png`
- Статус: выкачено ранее, Timeweb revision `3babf6f`

### Home hero badge refinement
- Область: главная страница, hero badge
- Изменение: увеличены размеры badge и mobile-иконки мозга для лучшей читаемости
- Файлы:
  - `src/components/home/HeroSection.tsx`
- Статус: выкачено ранее, Timeweb revision `5ff5108`

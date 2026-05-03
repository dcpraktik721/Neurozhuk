# Changelog

Журнал изменений и выкладок проекта `neurozhuk`.

Правило ведения:
- добавлять запись при каждом заметном изменении UI, логики, инфраструктуры или деплоя;
- указывать дату, область изменения, краткий результат и статус выкладки.

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

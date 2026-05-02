# Changelog

Журнал изменений и выкладок проекта `neurozhuk`.

Правило ведения:
- добавлять запись при каждом заметном изменении UI, логики, инфраструктуры или деплоя;
- указывать дату, область изменения, краткий результат и статус выкладки.

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

# SEO Master Prompt — «Поймай Жука» (neurozhuk.ru)

> **Repo:** https://github.com/dcpraktik721/Neurozhuk
> **Stack:** Next.js 16 App Router · TypeScript · Tailwind CSS 4 · Supabase
> **Goal:** Устранить все критические и высокоприоритетные SEO/GEO-находки, найденные в аудите 2026-04-29.

---

## Роли команды

| Роль | Зона ответственности |
|------|---------------------|
| **TL** (Team Lead) | Координация, review PR, финальный merge |
| **DEVOPS** | robots.txt, sitemap, llms.txt, заголовки безопасности, env-переменные |
| **META** | `<title>`, `<meta description>`, canonical, Open Graph, noindex |
| **SCHEMA** | JSON-LD структурированные данные |
| **FE** | Server-component миграция, PWA, branded 404 |
| **CONTENT** | E-E-A-T: автор, /about, /faq, /parents |
| **QA** | Прогон всех проверок, финальный отчёт |

---

## Контекст аудита

### Итоговые оценки

| Категория | Оценка | Статус |
|-----------|--------|--------|
| Technical SEO | 6/10 | 🟡 Средний |
| On-Page & Meta | 3/10 | 🔴 Критично |
| Structured Data | 1/10 | 🔴 Критично |
| E-E-A-T | 2/10 | 🔴 Критично |
| AI Visibility (GEO) | 2/10 | 🔴 Критично |
| Crawlability | 7/10 | 🟡 Средний |

### Ключевые находки

#### 🔴 Критические

- `robots.txt` отсутствует → краулеры работают вслепую
- `sitemap.xml` отсутствует → страницы не индексируются
- `llms.txt` отсутствует → AI-краулеры не понимают контент
- JSON-LD полностью отсутствует → нет шансов на Rich Results / AI citations
- Дублирующийся `<title>` на `/play` (JSX + layout metadata)
- Все страницы имеют одинаковый `<title>` «Поймай Жука»
- `og:image` не задан → социальные превью пустые
- Auth-страницы (`/login`, `/register`) индексируются

#### 🟠 Высокий приоритет

- Нет `canonical` ни на одной странице
- `X-Robots-Tag`, `X-Frame-Options`, `X-Content-Type-Options` отсутствуют
- Статические страницы (`/faq`, `/parents`) используют `'use client'` без необходимости
- Нет named author / методолога ни в одной публикации
- Нет данных об организации (ИП/ООО, ИНН)

#### 🟡 Средний приоритет

- PWA manifest отсутствует
- Branded 404 страница отсутствует
- `sameAs` ссылки (ВКонтакте, Telegram, YouTube) не прописаны
- `speakable` schema для ключевых текстов не задана

---

## Порядок выполнения PR

```
PR-1 → PR-2 → PR-3 → PR-4 → PR-5 → PR-6
```

Каждый PR независим, но выполняется последовательно в указанном порядке.

---

## PR-1: Фундамент краулинга

**Исполнитель:** DEVOPS
**Ветка:** `seo/crawl-foundation`

### Задачи

#### 1.1 `robots.txt` — создать как Next.js Route Handler

```typescript
// src/app/robots.ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/auth/', '/dashboard', '/api/'] },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
    ],
    sitemap: 'https://neurozhuk.ru/sitemap.xml',
  };
}
```

#### 1.2 `sitemap.xml` — динамический через Route Handler

```typescript
// src/app/sitemap.ts
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://neurozhuk.ru';
  const staticRoutes = ['', '/play', '/faq', '/parents', '/about', '/theory'];

  // TODO: получить slug'и теоретических статей из Supabase
  const theoryRoutes: string[] = [];

  return [...staticRoutes, ...theoryRoutes].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1.0 : route === '/play' ? 0.9 : 0.7,
  }));
}
```

#### 1.3 `llms.txt` — статический файл

Создать файл `public/llms.txt`:

```
# Поймай Жука — нейротренажёр для детей

## О проекте
Поймай Жука — браузерная игра-нейротренажёр для развития математических навыков у детей 6–14 лет. Основана на методике быстрого устного счёта.

## Целевая аудитория
Дети 6–14 лет, родители, педагоги начальной школы.

## Основные разделы
- /play — игровой режим (нормальный, на время, тренировочный)
- /theory — теоретические материалы по ментальной арифметике
- /faq — частые вопросы
- /parents — информация для родителей

## Технологии
Next.js, TypeScript, Supabase, Canvas API

## Контакт
dc.praktik72.1@gmail.com
```

#### 1.4 Заголовки безопасности — `next.config.ts`

Добавить в секцию `headers()`:

```typescript
{
  source: '/(.*)',
  headers: [
    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  ],
},
```

#### 1.5 `og:image` — базовый

Создать `public/og.png` (1200×630 px) с логотипом и названием сайта.
Добавить в корневой `layout.tsx`:

```typescript
openGraph: {
  images: [{ url: '/og.png', width: 1200, height: 630 }],
},
```

### Критерии готовности PR-1

- [ ] `GET /robots.txt` возвращает 200 с корректным телом
- [ ] `GET /sitemap.xml` возвращает 200 с валидным XML
- [ ] `GET /llms.txt` возвращает 200
- [ ] Response headers содержат `X-Frame-Options`
- [ ] `og:image` задан в корневом layout

---

## PR-2: Метаданные страниц

**Исполнитель:** META
**Ветка:** `seo/page-metadata`

### Задачи

#### 2.1 Исправить дублирующийся `<title>` на `/play`

В `src/app/play/page.tsx` **удалить** `<title>` из JSX-разметки и **добавить** экспорт:

```typescript
export const metadata: Metadata = {
  title: 'Играть — Поймай Жука | Нейротренажёр математики',
  description: 'Запусти игру и лови жуков с правильными ответами. Три режима сложности, мировой рейтинг.',
  robots: { index: true, follow: true },
};
```

#### 2.2 Уникальные title/description для каждой страницы

| Маршрут | title | description |
|---------|-------|-------------|
| `/` | `Поймай Жука — нейротренажёр математики для детей` | `Браузерная игра для развития устного счёта у детей 6–14 лет. Научи ребёнка считать быстро и с удовольствием.` |
| `/play` | `Играть — Поймай Жука` | `Запусти игру и лови жуков с правильными ответами. Три режима сложности.` |
| `/faq` | `Частые вопросы — Поймай Жука` | `Ответы на вопросы о нейротренажёре, методике, безопасности и технических требованиях.` |
| `/parents` | `Родителям — Поймай Жука` | `Как работает нейротренажёр, чем полезен для ребёнка, соответствие 152-ФЗ.` |
| `/about` | `О проекте — Поймай Жука` | `Команда, методика, история создания браузерного нейротренажёра математики.` |
| `/auth/login` | `Вход — Поймай Жука` | — |
| `/auth/register` | `Регистрация — Поймай Жука` | — |
| `/dashboard` | `Мой прогресс — Поймай Жука` | — |

#### 2.3 Canonical и noindex

В **корневом `layout.tsx`** задать базовый canonical:

```typescript
alternates: { canonical: 'https://neurozhuk.ru' },
```

На **auth-страницах** и **dashboard** — добавить:

```typescript
robots: { index: false, follow: false },
```

#### 2.4 Open Graph для каждой страницы

Шаблон для статических страниц:

```typescript
openGraph: {
  type: 'website',
  url: 'https://neurozhuk.ru/ROUTE',
  title: '...',
  description: '...',
  siteName: 'Поймай Жука',
  images: [{ url: '/og.png', width: 1200, height: 630 }],
  locale: 'ru_RU',
},
```

### Критерии готовности PR-2

- [ ] `<title>` уникален на каждой странице (проверить `curl` + grep `<title>`)
- [ ] На `/play` нет дублирующегося `<title>` в HTML
- [ ] `/auth/login` и `/auth/register` имеют `noindex`
- [ ] `canonical` присутствует на всех публичных страницах
- [ ] `og:title`, `og:description`, `og:image` заданы на главной и `/play`

---

## PR-3: JSON-LD структурированные данные

**Исполнитель:** SCHEMA
**Ветка:** `seo/json-ld`

### Задачи

#### 3.1 Корневой layout — Organization + WebSite

```typescript
// src/components/seo/GlobalSchema.tsx
export function GlobalSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://neurozhuk.ru/#organization',
        name: 'Поймай Жука',
        alternateName: 'Поймай Жука — нейротренажёр',
        url: 'https://neurozhuk.ru',
        logo: {
          '@type': 'ImageObject',
          url: 'https://neurozhuk.ru/og.png',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'dc.praktik72.1@gmail.com',
          contactType: 'customer support',
          availableLanguage: 'Russian',
        },
        // sameAs: ['https://vk.com/...', 'https://t.me/...'],  // добавить когда появятся
      },
      {
        '@type': 'WebSite',
        '@id': 'https://neurozhuk.ru/#website',
        url: 'https://neurozhuk.ru',
        name: 'Поймай Жука',
        inLanguage: 'ru',
        publisher: { '@id': 'https://neurozhuk.ru/#organization' },
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://neurozhuk.ru/theory?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

Добавить `<GlobalSchema />` в `src/app/layout.tsx` внутри `<head>`.

#### 3.2 `/play` — SoftwareApplication

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Поймай Жука",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "RUB"
  },
  "audience": {
    "@type": "EducationalAudience",
    "educationalRole": "student",
    "audienceType": "Дети 6–14 лет"
  },
  "inLanguage": "ru",
  "url": "https://neurozhuk.ru/play"
}
```

#### 3.3 `/faq` — FAQPage

Обернуть каждую пару вопрос/ответ:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Для какого возраста подходит тренажёр?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Тренажёр рассчитан на детей 6–14 лет..."
      }
    }
  ]
}
```

#### 3.4 `/theory/[slug]` — Article

```typescript
// Динамически на основе данных из Supabase
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.excerpt,
  "author": {
    "@type": "Person",
    "name": "Имя Методолога",  // TODO: заполнить после PR-5
    "url": "https://neurozhuk.ru/about"
  },
  "publisher": { "@id": "https://neurozhuk.ru/#organization" },
  "datePublished": article.createdAt,
  "dateModified": article.updatedAt,
  "inLanguage": "ru",
  "url": `https://neurozhuk.ru/theory/${article.slug}`
}
```

#### 3.5 Все страницы с хлебными крошками — BreadcrumbList

```typescript
// src/components/seo/Breadcrumb.tsx
// Props: items: Array<{ name: string; url: string }>
```

### Критерии готовности PR-3

- [ ] `https://neurozhuk.ru` → Rich Results Test показывает Organization + WebSite
- [ ] `/play` → SoftwareApplication в `<script type="application/ld+json">`
- [ ] `/faq` → FAQPage schema валидна
- [ ] `/theory/[slug]` → Article schema с `author` и `datePublished`

---

## PR-4: Server-component миграция

**Исполнитель:** FE
**Ветка:** `seo/server-components`

### Задачи

#### 4.1 Удалить `'use client'` со статических страниц

Страницы для миграции:

| Файл | Действие |
|------|----------|
| `src/app/faq/page.tsx` | Убрать `'use client'`, убрать клиентские хуки |
| `src/app/parents/page.tsx` | Убрать `'use client'`, убрать клиентские хуки |
| `src/app/about/page.tsx` | Проверить, убрать если нет нужды в клиентском состоянии |

Если на странице нужен accordion/toggle — вынести интерактивную часть в отдельный `*Client.tsx` компонент.

#### 4.2 Анализ `src/app/theory/page.tsx`

Если страница только fetches данные — сделать async Server Component.

### Критерии готовности PR-4

- [ ] `view-source:https://neurozhuk.ru/faq` содержит полный текст FAQ (не `[object Object]` и не пустые теги)
- [ ] `/parents` рендерится на сервере (нет `__NEXT_DATA__` зависимости для основного контента)
- [ ] `npm run build` проходит без ошибок

---

## PR-5: E-E-A-T инфраструктура

**Исполнитель:** CONTENT
**Ветка:** `seo/eeat-infrastructure`

### Задачи

#### 5.1 Компонент `AuthorByline`

```typescript
// src/components/content/AuthorByline.tsx
interface AuthorBylineProps {
  name: string;
  role: string;           // напр. «Методист начальной математики»
  avatarUrl?: string;
  profileUrl?: string;
}
```

Использовать в заголовке каждой теоретической статьи.

#### 5.2 Страница `/about` — секция команды

Добавить карточки с:
- Фото (или placeholder аватар)
- Имя и должность
- Краткая биография 2–3 предложения
- Ссылки на профессиональные профили (LinkedIn, HH.ru и др.)

> ⚠️ **Требует решения product-команды:** кто является методологом/автором проекта.

#### 5.3 Страница `/faq` — расширение

Добавить минимум 8 вопросов с ответами объёмом 80–150 слов каждый. Темы:
- Безопасность данных и 152-ФЗ
- Методика ментальной арифметики
- Технические требования (браузер, устройство)
- Рекомендованное время занятий
- Разница с другими тренажёрами

#### 5.4 Страница `/parents` — упоминание 152-ФЗ

Добавить раздел «Защита персональных данных» с описанием:
- Какие данные собираются
- Как хранятся (Supabase, EU-регион)
- Право на удаление данных (email для запроса)
- Соответствие ФЗ-152

### Критерии готовности PR-5

- [ ] `/about` содержит хотя бы одного автора с именем и должностью
- [ ] `AuthorByline` отображается на страницах `/theory/[slug]`
- [ ] `/faq` содержит ≥ 8 вопросов
- [ ] `/parents` содержит упоминание 152-ФЗ

---

## PR-6: Полировка

**Исполнитель:** FE + DEVOPS
**Ветка:** `seo/polish`

### Задачи

#### 6.1 Branded 404 страница

```typescript
// src/app/not-found.tsx
// Дизайн в стиле игры — жук не нашёл страницу
// CTA: «Вернуться на главную» и «Играть»
```

#### 6.2 PWA Manifest

```typescript
// src/app/manifest.ts
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Поймай Жука',
    short_name: 'Жука',
    description: 'Нейротренажёр математики для детей',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#10b981',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
```

#### 6.3 ENV-переменные для верификации

Добавить в `.env.local.example`:

```bash
# Верификация поисковиков (получить в вебмастер-панелях)
NEXT_PUBLIC_YANDEX_VERIFICATION=
NEXT_PUBLIC_GOOGLE_VERIFICATION=
```

Добавить в корневой `layout.tsx`:

```typescript
verification: {
  google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
},
```

#### 6.4 SEO Checklist в README

Добавить раздел `## SEO / GEO` в `README.md` с чеклистом:

- [ ] robots.txt доступен
- [ ] sitemap.xml доступен
- [ ] llms.txt доступен
- [ ] JSON-LD валиден (Rich Results Test)
- [ ] Нет дублирующихся title
- [ ] Auth-страницы закрыты noindex
- [ ] og:image задан
- [ ] Yandex Webmaster подтверждён
- [ ] Google Search Console подтверждён

### Критерии готовности PR-6

- [ ] `/404` (несуществующая страница) отдаёт брендированный дизайн с CTA
- [ ] `GET /manifest.webmanifest` возвращает 200
- [ ] `.env.local.example` содержит verification keys

---

## Финальная QA-проверка

**Исполнитель:** QA
**После:** все 6 PR смёржены в `main`, деплой выполнен

### Автоматические проверки

```bash
# Базовая доступность
curl -I https://neurozhuk.ru/robots.txt     | grep "200"
curl -I https://neurozhuk.ru/sitemap.xml    | grep "200"
curl -I https://neurozhuk.ru/llms.txt       | grep "200"

# Дублирование title на /play
curl -s https://neurozhuk.ru/play | grep -c "<title>"   # должно быть 1

# noindex на auth
curl -s https://neurozhuk.ru/auth/login | grep "noindex"

# JSON-LD присутствие
curl -s https://neurozhuk.ru | grep -c 'application/ld+json'   # ≥ 1
curl -s https://neurozhuk.ru/play | grep -c 'application/ld+json'   # ≥ 1
curl -s https://neurozhuk.ru/faq | grep -c 'application/ld+json'    # ≥ 1
```

### Ручные проверки

| Инструмент | URL | Ожидаемый результат |
|------------|-----|---------------------|
| [Rich Results Test](https://search.google.com/test/rich-results) | `https://neurozhuk.ru` | Organization, WebSite ✅ |
| [Rich Results Test](https://search.google.com/test/rich-results) | `https://neurozhuk.ru/faq` | FAQPage ✅ |
| [Rich Results Test](https://search.google.com/test/rich-results) | `https://neurozhuk.ru/play` | SoftwareApplication ✅ |
| [OG Debugger](https://developers.facebook.com/tools/debug/) | `https://neurozhuk.ru` | og:image отображается |
| [Яндекс Вебмастер](https://webmaster.yandex.ru) | — | Сайт подтверждён |
| [Google Search Console](https://search.google.com/search-console) | — | Сайт подтверждён |

### Отчёт QA

После проверки создать `QA_REPORT.md` с результатами каждого пункта и отметить незакрытые задачи.

---

## Задачи вне кода (Product-команда)

Следующие пункты **не могут быть выполнены кодом** — требуют решения на уровне продукта:

| # | Задача | Приоритет |
|---|--------|-----------|
| P1 | Определить named author / методолога проекта | 🔴 Критично |
| P2 | Зарегистрировать юридическое лицо (ИП/ООО) или указать физ. лицо | 🟠 Высокий |
| P3 | Завести ВКонтакте / Telegram / YouTube каналы и добавить `sameAs` | 🟠 Высокий |
| P4 | Подтвердить сайт в Яндекс Вебмастер | 🟠 Высокий |
| P5 | Подтвердить сайт в Google Search Console | 🟠 Высокий |
| P6 | Опубликовать статью на vc.ru / Habr / Дзен для внешних ссылок | 🟡 Средний |
| P7 | Создать профиль на Яндекс Образование / Учи.ру / схожих платформах | 🟡 Средний |

---

## Быстрые победы (Quick Wins ≤ 30 мин)

Если нужно приоритизировать — вот порядок максимального ROI:

1. **robots.txt** — 10 мин, останавливает хаотичный краулинг
2. **sitemap.xml** — 15 мин, открывает индексацию
3. **noindex на auth** — 5 мин, исключает нерелевантные страницы
4. **Исправить дублирующийся `<title>` на /play** — 5 мин
5. **llms.txt** — 10 мин, AI-краулеры
6. **Organization JSON-LD** — 20 мин, фундамент Rich Results

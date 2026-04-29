# Технический аудит проекта «НейроЖук»

Дата аудита: 2026-04-29  
Путь проекта: `/Users/macbook15/Downloads/ЛЕВ/neurozhuk`

## Executive Summary

Технически это Next.js 16.2.3 / React 19 приложение на App Router с canvas-игрой, Supabase Auth/DB, Tailwind CSS 4, Server Actions и Route Handlers.

Проект уже не является набором пустых страниц: есть главный сайт, теория, игра, auth-формы, dashboard/progress, API для сессий/статистики/достижений и SQL-схема Supabase.

Главный плюс: игровой слой вынесен в отдельный `GameEngine` без зависимости от React, а Supabase-схема включает RLS, агрегаты и триггеры статистики.

Главный минус: полный MVP-путь не собран в рабочую платформу. Дефолтный режим игры `normal` не завершает сессию, значит результат не сохраняется. Режим `practice` есть в UI/типах, но запрещён CHECK constraint в БД.

Проект нельзя деплоить как есть: `npm run build` падает на `/auth/login` из-за `useSearchParams()` без `Suspense`.

Линт тоже не проходит: 3 ошибки React hooks и 10 warnings.

Auth flow недособран: `src/lib/supabase/middleware.ts` есть, но `src/proxy.ts` его не вызывает. Защита `/dashboard` и `/progress` фактически клиентская, session refresh не работает через proxy.

Слой достижений раздвоен: API считает реальные достижения, но `dashboard` и `progress` показывают статические `STATIC_ACHIEVEMENTS`.

Сохранение данных частичное: БД хранит score/correct/attempts/accuracy/duration/mode/rank/max_streak, но игровые поля `level`, `maxCombo`, `totalCorrect`, `totalWrong` из `GameSession` не сохраняются.

README оставлен шаблонным от create-next-app. Реальные инструкции есть только в launcher-доках.

Production readiness низкая: нет тестов, нет CI, нет Dockerfile/standalone output, нет migration workflow, нет доменной/SSL инструкции, нет observability.

MVP можно добить без переписывания проекта с нуля, но сначала нужно закрыть build, auth proxy, завершение игры, несовпадение mode/type/schema и реальные достижения в UI.

## 1. Слои платформы

| слой платформы | что реализовано | какой прием применен | сильная сторона | дефект | что исправить |
|---|---|---|---|---|---|
| Frontend App Router | Страницы `/`, `/play`, `/dashboard`, `/progress`, `/theory`, `/auth/login`, `/auth/register`, legal/FAQ/about/parents | Next.js App Router, Client/Server Components | Маршруты продукта в целом покрыты | `/auth/login` ломает production build; крупные client pages по 300-600 строк | Вынести login form в child component под `Suspense` или использовать `searchParams` prop; дробить dashboard/progress |
| Layout/navigation | Глобальный Header/Footer, auth-aware navigation | `useAuth()` в client Header | Пользователь видит вход/кабинет из любой страницы | Auth state размазан по нескольким hook instances; proxy protection не работает | Подключить Supabase proxy, централизовать auth state или сократить лишние подписки |
| Home/content marketing | Главная с секциями, теория, SEO helpers | Static content + JSON-LD | Есть продуктовая упаковка и теория | README шаблонный; бренд расходится: путь `neurozhuk`, UI «Поймай Жука», запрос «НейроЖук» | Зафиксировать одно имя и обновить README/metadata/docs |
| Game UI | Canvas, controls, stats, rules, results modal | React shell вокруг `GameEngine` | Движок отделён от React, UI получает callbacks | Состояния сохранения/достижений заведены, но не показаны; нет кнопки завершить normal/practice | Добавить finish session flow и показать статус save/achievements в results |
| Game engine | Движение, коллизии, уровни, combo, accuracy, streak, particles, timed mode | Класс `GameEngine` + canvas loop | Нет React-зависимости, есть clear public API | Файл монолитный 946 строк; normal/practice не вызывают `endGame()`; localStorage highscore конфликтует с серверным прогрессом | Разделить engine на state/render/input/scoring; добавить явное завершение и server best score |
| Equation/content data | `equations.ts` с наборами примеров | Static array | Просто и предсказуемо для MVP | Нет генератора/валидации уникальности/адаптивности | Добавить тест на корректность ответов и генератор задач V2 |
| Auth | Login/register server actions, client `useAuth`, Supabase browser/server clients | `@supabase/ssr`, Server Actions | Базовая email/password авторизация есть | Google-кнопки декоративные; ageGroup выбирается, но не отправляется; email confirmation flow не обработан | Убрать или реализовать Google OAuth; добавить `ageGroup` в form/server action; показать confirmation state |
| API | `/api/sessions`, `/api/stats`, `/api/achievements` | Next Route Handlers + Supabase RLS | Есть серверная точка сохранения и чтения | Валидация слабая; `practice` из UI ломает DB insert; достижения UI не читает API | Добавить schema validation, синхронизировать enum mode, подключить achievements API к UI |
| Data layer | `profiles`, `game_sessions`, `achievements`, `user_stats`, RLS, triggers | Supabase SQL schema | RLS включён, агрегаты считаются в БД | Нет миграций Supabase CLI; schema не совпадает с TS types; нет policies для admin/service workflows | Ввести migrations, generated DB types, синхронизировать `GameSession` и DB |
| Progress/dashboard | Статистика, история, графики, heatmap | Client fetch через `useGameSessions` | История и агрегаты реально тянутся из API | Достижения статические; `totalPlayTime` в секундах, но комментарий в UI «minutes» | Подключить `/api/achievements`, исправить units и fallback/error UI |
| Launch scripts | `.bat`, `.command`, `.sh`, common scripts, русские инструкции | Dev-server launcher | Полезно для локального школьного запуска | Это не production launch; открывает `localhost:3000`, port fallback не отслеживает | Для MVP сайта отделить local demo launcher от deployment docs |
| Production/deploy | `build/start` scripts | Базовый Next.js Node deployment | Теоретически совместимо с Vercel/Node | Build падает; нет Dockerfile, CI, env checklist, Supabase migration workflow | Сначала починить build, затем добавить deploy checklist и CI |

## 2. Критические дефекты

| файл или слой | проблема | критичность | почему это плохо | как исправить |
|---|---|---|---|---|
| `src/app/auth/login/page.tsx` | `useSearchParams()` используется прямо в client page без `Suspense`; `npm run build` падает | высокая | Production bundle не собирается, деплой невозможен | Вынести содержимое login в `LoginForm` и обернуть в `<Suspense>`, либо сделать server page с `searchParams` prop |
| `src/app/play/page.tsx` + `src/lib/game/engine.ts` | Дефолтный `normal` режим не имеет завершения сессии | высокая | Пользователь может играть, но не может завершить тренировку и сохранить результат | Добавить кнопку «Завершить тренировку» для normal/practice, которая вызывает публичный `finish()`/`endGame()` |
| `src/types/index.ts`, `src/components/game/GameControls.tsx`, `supabase/schema.sql` | Type/UI разрешают `mode: 'practice'`, БД CHECK разрешает только `normal`, `timed` | высокая | Сохранение practice-сессии всегда упадёт на insert | Либо добавить `practice` в SQL CHECK, либо убрать режим из UI/types до поддержки |
| `src/proxy.ts`, `src/lib/supabase/middleware.ts` | `updateSession()` написан, но proxy его не вызывает | высокая | Supabase SSR cookies не refresh-ятся; protected routes не защищены на серверном уровне | Импортировать `updateSession` в `src/proxy.ts` и вернуть `updateSession(request)` |
| `src/app/dashboard/page.tsx`, `src/app/progress/page.tsx` | Достижения показываются из `STATIC_ACHIEVEMENTS`, не из `/api/achievements` | высокая | Пользователь видит фейковый прогресс, не связанный с БД | Добавить `getAchievements()` в hook и заменить статические массивы реальными данными |
| `src/app/play/page.tsx`, `src/components/game/GameResults.tsx` | `savedSession`, `newAchievements`, `saveError` создаются, но не передаются в results UI | средняя | Пользователь видит «Сохранено» только по факту auth, а не по факту успешного сохранения | Передавать save status и новые достижения в `GameResults`; не показывать «Сохранено» до успешного POST |
| `src/app/api/sessions/route.ts` | API принимает body без строгой runtime-схемы и числовых границ | средняя | Можно сохранить мусорные/отрицательные значения, если RLS пропустит owner | Добавить validation function или zod-подобную схему без лишней магии |
| `src/types/index.ts`, `supabase/schema.sql` | `GameSession` содержит `level`, `maxCombo`, `totalCorrect`, `totalWrong`, но БД их не хранит и API не возвращает | средняя | Тип обещает данные, которых нет после сохранения/загрузки | Расширить таблицу/API или разделить `CompletedGameSession` и `StoredGameSession` |
| `src/hooks/useAuth.ts`, `src/components/layout/Header.tsx`, `src/app/play/page.tsx` | `npm run lint` падает на `react-hooks/set-state-in-effect` | средняя | CI/quality gate не проходит; React Compiler lint считает паттерны рискованными | Переписать инициализацию через lazy state/init callbacks или допустимый async flow |
| `src/app/auth/register/page.tsx`, `src/lib/supabase/auth-actions.ts`, `supabase/schema.sql` | Выбор `ageGroup` не отправляется и не пишется в `profiles.age_group` | средняя | UI обещает настройку, но данные теряются | Добавить hidden input `ageGroup`, принять в server action, записать в metadata/trigger или отдельный update profile |
| `src/app/auth/login/page.tsx`, `src/app/auth/register/page.tsx` | Google OAuth кнопки не имеют обработчиков | средняя | Мёртвые CTA в auth flow | Реализовать `signInWithOAuth` + callback route или убрать кнопки |
| `src/lib/game/engine.ts` | Монолит 946 строк: state, input, physics, scoring, rendering, persistence localStorage в одном классе | средняя | Любое изменение механики рискованно и плохо тестируется | Разделить engine core, renderer, input adapter, scoring/session builder |
| `README.md` | README остался шаблоном create-next-app | средняя | Новый разработчик не узнает реальный стек, env, Supabase, запуск и деплой | Заменить на проектный README |
| `src/components/auth`, `src/components/dashboard`, `src/components/ui` | Пустые директории | низкая | Шум в структуре, ложное ожидание компонентов | Удалить или заполнить при рефакторинге |
| `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg` | Остатки create-next-app assets | низкая | Мусор в публичной сборке | Удалить неиспользуемые assets |

## 3. Что готово / что не готово

| блок | статус | комментарий |
|---|---|---|
| Главная страница | частично готово | Секции есть, но есть моковый progress preview и README/бренд не синхронизированы |
| Теория | готово для MVP | Static articles работают; `dangerouslySetInnerHTML` безопасен только пока контент локальный и доверенный |
| Игра как механика | частично готово | Canvas-игра реализована, но normal/practice не завершаются и не сохраняются |
| Timed game | ближе всего к готовому | Сессия завершается по таймеру, но ждать 300 секунд для MVP-проверки неудобно |
| Auth email/password | частично готово | Server Actions есть, но build blocker на login и не обработано подтверждение email |
| Google OAuth | не готово | Кнопки есть, реализации нет |
| Сохранение результата | частично готово | API и таблица есть, но сохраняется только subset метрик; `practice` ломается |
| Статистика | частично готово | `user_stats` и `/api/stats` есть; UI использует часть данных |
| Достижения | не готово как продукт | API есть, UI показывает статический список |
| Progress page | частично готово | История/графики из сессий, достижения фейковые |
| Dashboard | частично готово | Статы/последние сессии реальные, достижения фейковые |
| RLS/DB security | частично готово | RLS включён; нужна миграционная дисциплина и типизация БД |
| Local launcher | готово для demo | Скрипты и инструкции есть, но это dev-server, не production |
| Production build | не готово | `npm run build` падает |
| Lint/quality gate | не готово | `npm run lint` падает |
| Tests/CI | не готово | Тестов и CI не найдено |
| Docker/self-hosting | не готово | Dockerfile и standalone config отсутствуют |

## 4. Приоритет доработки

### N1 - обязательно добить для рабочего MVP

| приоритет | задача | конкретные файлы | результат |
|---|---|---|---|
| N1 | Починить production build на `/auth/login` | `src/app/auth/login/page.tsx` | `npm run build` проходит |
| N1 | Подключить Supabase session refresh/protected routes | `src/proxy.ts`, `src/lib/supabase/middleware.ts` | `/dashboard` и `/progress` защищены серверным proxy |
| N1 | Сделать завершение normal/practice сессии | `src/lib/game/engine.ts`, `src/app/play/page.tsx`, `src/components/game/GameControls.tsx` | Игрок может закончить тренировку и сохранить результат |
| N1 | Синхронизировать game modes с БД | `src/types/index.ts`, `src/components/game/GameControls.tsx`, `supabase/schema.sql` | Ни один режим из UI не ломает insert |
| N1 | Показывать реальный статус сохранения | `src/app/play/page.tsx`, `src/components/game/GameResults.tsx` | Пользователь видит saved/error/new achievements по факту API |
| N1 | Заменить статические достижения реальными | `src/hooks/useGameSessions.ts`, `src/app/dashboard/page.tsx`, `src/app/progress/page.tsx` | Dashboard/progress отражают БД |
| N1 | Убрать lint errors | `src/app/play/page.tsx`, `src/components/layout/Header.tsx`, `src/hooks/useAuth.ts` | `npm run lint` не падает |

### N2 - важно добить после N1

| приоритет | задача | конкретные файлы | результат |
|---|---|---|---|
| N2 | Привести `GameSession` к реальной модели хранения | `src/types/index.ts`, `src/app/api/sessions/route.ts`, `supabase/schema.sql` | Нет расхождения между типами, API и БД |
| N2 | Добавить runtime validation API | `src/app/api/sessions/route.ts`, `src/app/api/achievements/route.ts` | API не принимает мусорные значения |
| N2 | Исправить register profile fields | `src/app/auth/register/page.tsx`, `src/lib/supabase/auth-actions.ts`, `supabase/schema.sql` | `age_group` реально сохраняется |
| N2 | Убрать/реализовать Google OAuth | `src/app/auth/login/page.tsx`, `src/app/auth/register/page.tsx`, новый callback route | Нет мёртвых auth-кнопок |
| N2 | Написать реальный README | `README.md`, `.env.local.example` | Новый разработчик понимает запуск, env, DB setup, deploy |
| N2 | Добавить Supabase migrations workflow | `supabase/` | Схема применима повторяемо, а не копированием SQL |

### N3 - улучшения V2

| приоритет | задача | конкретные файлы | результат |
|---|---|---|---|
| N3 | Разделить игровой монолит | `src/lib/game/engine.ts` | Движок проще тестировать и развивать |
| N3 | Добавить тесты движка и API | `src/lib/game/*`, `src/app/api/*` | Механика и сохранение защищены регресс-тестами |
| N3 | Добавить CI | GitHub Actions или аналог | Build/lint/test проверяются до деплоя |
| N3 | Добавить observability | API routes, frontend errors | Видны ошибки сохранения/auth в production |
| N3 | Подготовить Docker/self-hosting | `next.config.ts`, `Dockerfile` | Возможен не-Vercel деплой |

## 5. Архитектурный вердикт

Удачно: проект уже имеет правильные зачатки платформы: App Router, отдельный canvas engine, Supabase RLS, API routes, server/browser clients, агрегированную статистику, теоретический контент и launch scripts.

Неудачно: слои не доведены до замкнутого пользовательского пути. Самое слабое место не UI, а стык game -> session -> API -> DB -> stats/progress. Сейчас он работает только частично и ломается на дефолтном сценарии.

Нужно сохранить: отдельный `GameEngine`, Supabase RLS/triggers, Route Handlers, static theory content, launcher docs как локальный demo-mode.

Нужно переделать: завершение сессии, enum/типизацию игровых режимов, achievements UI, proxy/session refresh, build blocker на login, README/deploy docs. Переписывать проект с нуля не нужно.

## 6. План дальнейшей доработки

| шаг | цель | что править | ожидаемый результат |
|---|---|---|---|
| 1 | Разблокировать деплой | `src/app/auth/login/page.tsx` | `npm run build` проходит без prerender error |
| 2 | Вернуть серверную auth-защиту | `src/proxy.ts` импортирует и вызывает `updateSession(request)` | Supabase cookies обновляются, protected routes редиректятся до рендера |
| 3 | Закрыть lint gate | `play/page.tsx`, `Header.tsx`, `useAuth.ts` | `npm run lint` проходит или остаются только осознанные warnings |
| 4 | Сделать завершение игры | `GameEngine.finish()`, кнопка в `GameControls`, handler в `PlayPage` | Normal/practice сессия завершается и вызывает `onGameEnd` |
| 5 | Синхронизировать режимы | `schema.sql`, types, controls/API validation | `normal`, `timed`, `practice` одинаково поддержаны или одинаково запрещены |
| 6 | Исправить сохранение и results UI | `PlayPage`, `GameResults`, `useGameSessions` | Видно: сохраняется, сохранено, ошибка, новые достижения |
| 7 | Подключить реальные достижения | `useGameSessions`, dashboard, progress | Статические достижения исчезают, UI отражает `achievements` table |
| 8 | Свести модели данных | `GameSession` types, API mapper, SQL schema | Stored session не теряет важные игровые метрики |
| 9 | Документировать запуск и прод | `README.md`, `.env.local.example`, `supabase/README.md` | Разработчик может поднять проект и применить БД без догадок |
| 10 | Добавить минимальные тесты | engine scoring/equations/API validation | MVP защищён от повторной поломки |

## 7. Файлы, которые нужно править в первую очередь

| файл | зачем трогать |
|---|---|
| `src/app/auth/login/page.tsx` | Починить production build: `useSearchParams` требует `Suspense` или server `searchParams` |
| `src/proxy.ts` | Подключить `updateSession`; сейчас Supabase middleware helper мёртвый |
| `src/lib/supabase/middleware.ts` | Проверить matcher/protected paths и поведение при отсутствующем Supabase |
| `src/lib/game/engine.ts` | Добавить публичное завершение сессии и затем разделить монолит |
| `src/components/game/GameControls.tsx` | Добавить кнопку «Завершить тренировку» и синхронизировать режимы |
| `src/app/play/page.tsx` | Передать save status/achievements/error в results modal; убрать unused state/lint error |
| `src/components/game/GameResults.tsx` | Показывать реальный статус сохранения, а не просто наличие auth |
| `src/types/index.ts` | Разделить runtime session и stored session; синхронизировать `GameMode` |
| `src/app/api/sessions/route.ts` | Добавить валидацию и привести payload к SQL schema |
| `supabase/schema.sql` | Исправить enum mode и добавить недостающие session metrics или убрать их из TS |
| `src/hooks/useGameSessions.ts` | Добавить загрузку achievements и лучше обрабатывать API errors |
| `src/app/dashboard/page.tsx` | Убрать `STATIC_ACHIEVEMENTS`, использовать API |
| `src/app/progress/page.tsx` | Убрать `STATIC_ACHIEVEMENTS`, исправить единицы `totalPlayTime` |
| `src/app/auth/register/page.tsx` | Реально отправлять `ageGroup`; убрать/реализовать Google OAuth |
| `src/lib/supabase/auth-actions.ts` | Сохранять profile metadata корректно и обработать email confirmation |
| `README.md` | Заменить шаблон create-next-app на фактическую инструкцию проекта |

## Проверка командами

| команда | результат |
|---|---|
| `npm run build` | Падает: `/auth/login` использует `useSearchParams()` без `Suspense` |
| `npm run lint` | Падает: 3 errors (`react-hooks/set-state-in-effect`), 10 warnings |
| `node --version` | `v22.22.0` |
| `npm --version` | `10.9.4` |


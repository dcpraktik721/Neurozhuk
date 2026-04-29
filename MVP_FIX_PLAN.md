# MVP Fix Plan

## N1 - обязательно добить для рабочего MVP

| шаг | цель | что править | ожидаемый результат | проверка |
|---|---|---|---|---|
| 1 | Разблокировать production build | `src/app/auth/login/page.tsx` | `/auth/login` не ломает prerender | `npm run build` |
| 2 | Починить auth/session proxy | `src/proxy.ts`, `src/lib/supabase/middleware.ts` | Supabase cookies refresh-ятся, `/dashboard` и `/progress` защищены до рендера | Ручной вход + переход на protected route |
| 3 | Убрать lint blockers | `src/app/play/page.tsx`, `src/components/layout/Header.tsx`, `src/hooks/useAuth.ts` | Lint не падает на React hooks rules | `npm run lint` |
| 4 | Добавить завершение normal/practice игры | `src/lib/game/engine.ts`, `src/components/game/GameControls.tsx`, `src/app/play/page.tsx` | Игрок может завершить тренировку и получить `GameSession` | Запустить normal, завершить, увидеть results |
| 5 | Синхронизировать режимы игры | `src/types/index.ts`, `src/components/game/GameControls.tsx`, `src/app/api/sessions/route.ts`, `supabase/schema.sql` | Режим из UI гарантированно сохраняется в БД | Сохранить `normal`, `timed`, `practice` или убрать `practice` |
| 6 | Исправить статус сохранения | `src/app/play/page.tsx`, `src/components/game/GameResults.tsx`, `src/hooks/useGameSessions.ts` | Results modal показывает `saving/saved/error`, а не фейковое «Сохранено» | Завершить игру под auth и без auth |
| 7 | Подключить реальные достижения | `src/hooks/useGameSessions.ts`, `src/app/dashboard/page.tsx`, `src/app/progress/page.tsx` | Dashboard/progress показывают данные из `/api/achievements` | Получить первое достижение после сохранения |
| 8 | Проверить полный MVP-путь | auth + game + API + progress | Регистрация/вход → игра → завершение → сохранение → статистика → прогресс работают | Ручной E2E сценарий |

## N2 - важно добить после N1

| шаг | цель | что править | ожидаемый результат | проверка |
|---|---|---|---|---|
| 1 | Свести типы, API и БД | `src/types/index.ts`, `src/app/api/sessions/route.ts`, `supabase/schema.sql` | `GameSession` не содержит полей, которые теряются при сохранении | TypeScript + ручная загрузка истории |
| 2 | Добавить runtime validation | `src/app/api/sessions/route.ts`, `src/app/api/achievements/route.ts` | API отклоняет отрицательные/NaN/чужие значения | POST с некорректным payload |
| 3 | Исправить регистрацию профиля | `src/app/auth/register/page.tsx`, `src/lib/supabase/auth-actions.ts`, `supabase/schema.sql` | `display_name` и `age_group` реально попадают в profile | Зарегистрировать child/adult пользователя |
| 4 | Убрать мёртвый Google OAuth или реализовать его | `src/app/auth/login/page.tsx`, `src/app/auth/register/page.tsx`, callback route | На auth-страницах нет неработающих кнопок | Клик по Google не является no-op |
| 5 | Обновить README и env docs | `README.md`, `.env.local.example`, новый Supabase setup раздел | Новый разработчик поднимает проект без чтения кода | Fresh setup по README |
| 6 | Ввести migration workflow | `supabase/` | Схема применима повторяемо и версионируемо | Создание чистого Supabase проекта |

## N3 - улучшения V2

| шаг | цель | что править | ожидаемый результат | проверка |
|---|---|---|---|---|
| 1 | Разделить игровой монолит | `src/lib/game/engine.ts` → modules для state/render/input/scoring | Механику можно менять без риска сломать canvas/render | Unit tests engine core |
| 2 | Добавить тесты | `src/lib/game/*`, `src/app/api/*` | Scoring, equations и API защищены от регрессий | `npm test` или выбранный test runner |
| 3 | Добавить CI | workflow config | Build/lint/test проверяются автоматически | PR/check run |
| 4 | Подготовить production deployment | `next.config.ts`, при необходимости `Dockerfile` | Есть понятный путь Vercel/Node/Docker деплоя | Deploy preview или container run |
| 5 | Добавить observability | API error logging, frontend error boundary | Ошибки auth/save видны после запуска | Проверка controlled API failure |


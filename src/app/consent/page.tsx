import type { Metadata } from 'next';
import Link from 'next/link';
import { ClipboardCheck } from 'lucide-react';
import { generateBreadcrumbSchema, generatePageMetadata } from '@/lib/seo';

const CONTACT_EMAIL = 'levart72@mail.ru';
const LAST_UPDATED = '3 мая 2026 г.';

export const metadata: Metadata = generatePageMetadata(
  'Согласие на обработку персональных данных',
  'Согласие пользователя neurozhuk.ru на обработку персональных данных при регистрации и использовании платформы Поймай Жука.',
  '/consent',
);

const breadcrumbs = [
  { name: 'Главная', href: '/' },
  { name: 'Согласие на обработку персональных данных', href: '/consent' },
];

export default function ConsentPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbs)),
        }}
      />

      <div className="min-h-screen bg-white">
        <section className="bg-slate-900 py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm mb-5">
              <ClipboardCheck className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
              Согласие на обработку персональных данных
            </h1>
            <p className="text-slate-50 text-sm">
              Последнее обновление: {LAST_UPDATED}
            </p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.href}>
                {i > 0 && <span className="mx-2">/</span>}
                {i === breadcrumbs.length - 1 ? (
                  <span className="text-slate-700 font-medium">{crumb.name}</span>
                ) : (
                  <Link href={crumb.href} className="hover:text-emerald-600 transition-colors">
                    {crumb.name}
                  </Link>
                )}
              </span>
            ))}
          </nav>
        </div>

        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-p:leading-relaxed prose-p:mb-4 prose-li:mb-1">
            <p>
              Настоящее согласие дается пользователем сайта neurozhuk.ru при регистрации аккаунта
              на платформе «Поймай Жука». Согласие относится только к сервисной обработке данных,
              необходимой для работы аккаунта, игры, личного кабинета, прогресса и обратной связи.
            </p>

            <h2>1. Оператор</h2>
            <p>
              Оператором является владелец сайта neurozhuk.ru. Контакт для обращений по вопросам
              персональных данных:{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-emerald-600 hover:text-emerald-700">
                {CONTACT_EMAIL}
              </a>
              .
            </p>

            <h2>2. Данные, на обработку которых дается согласие</h2>
            <ul>
              <li>email;</li>
              <li>имя или никнейм;</li>
              <li>возрастная группа: ребенок или взрослый;</li>
              <li>идентификатор аккаунта Supabase;</li>
              <li>игровые результаты, статистика, достижения, режимы игры, дата и время сессий;</li>
              <li>технические данные, необходимые для авторизации, безопасности и диагностики работы сайта;</li>
              <li>содержание обращения, если пользователь пишет на контактный email.</li>
            </ul>

            <h2>3. Цели обработки</h2>
            <ul>
              <li>создание и ведение аккаунта;</li>
              <li>авторизация пользователя и поддержание защищенной сессии;</li>
              <li>сохранение и отображение игрового прогресса, статистики и достижений;</li>
              <li>работа личного кабинета и страницы прогресса;</li>
              <li>ответы на обращения пользователя;</li>
              <li>техническая диагностика и защита сайта от злоупотреблений.</li>
            </ul>

            <h2>4. Действия с персональными данными</h2>
            <p>
              Пользователь соглашается на сбор, запись, систематизацию, накопление, хранение,
              уточнение, использование, передачу инфраструктурным подрядчикам в объеме, необходимом
              для работы сайта, обезличивание, блокирование, удаление и уничтожение персональных
              данных.
            </p>

            <h2>5. Срок действия и отзыв согласия</h2>
            <p>
              Согласие действует до удаления аккаунта, отзыва согласия или прекращения обработки
              по основаниям, указанным в{' '}
              <Link href="/privacy" className="text-emerald-600 hover:text-emerald-700">
                политике обработки персональных данных
              </Link>
              . Отзыв можно направить на{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-emerald-600 hover:text-emerald-700">
                {CONTACT_EMAIL}
              </a>
              . После отзыва согласия использование аккаунта и сохранение прогресса могут быть
              недоступны.
            </p>

            <h2>6. Отдельные согласия</h2>
            <p>
              Это согласие не включает маркетинговые рассылки, рекламное профилирование и передачу
              данных рекламным системам. В текущей версии сайта такие процессы в коде не обнаружены.
              Если они будут добавлены, для них потребуется отдельное согласие и обновление политики.
            </p>
          </div>
        </article>
      </div>
    </>
  );
}

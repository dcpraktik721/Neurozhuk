'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, MessageCircle } from 'lucide-react';
import { generateFaqSchema, generateBreadcrumbSchema } from '@/lib/seo';

/* ------------------------------------------------
   FAQ Data
   ------------------------------------------------ */
interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSection {
  title: string;
  items: FaqItem[];
}

const faqSections: FaqSection[] = [
  {
    title: 'О платформе',
    items: [
      {
        question: 'Что такое Поймай Жука?',
        answer:
          'Поймай Жука — это онлайн-платформа для развития когнитивных навыков в игровой форме. В основе платформы лежит математическая аркада, в которой нужно ловить жуков с правильными ответами на арифметические задания. Платформа также включает научно-популярные статьи о работе мозга, систему отслеживания прогресса и достижений.',
      },
      {
        question: 'Для кого подходит Поймай Жука?',
        answer:
          'Платформа предназначена для детей от 7 лет и взрослых. Дети могут тренировать навыки устного счёта и внимания в игровой форме, а взрослые — поддерживать когнитивную активность и скорость мышления. Сложность заданий адаптируется под уровень каждого пользователя.',
      },
      {
        question: 'Это бесплатно?',
        answer:
          'Базовый функционал Поймай Жукаа бесплатен. Вы можете играть, отслеживать прогресс и читать все образовательные материалы без оплаты. В будущем мы можем добавить расширенные функции по подписке, но основная игра и обучающий контент останутся бесплатными.',
      },
      {
        question: 'Поймай Жука научно обоснован?',
        answer:
          'Мы основываемся на исследованиях когнитивной психологии и честно описываем возможности и ограничения когнитивных тренировок. Мы не утверждаем, что игра «повышает IQ» или «гарантирует результаты». Поймай Жука помогает тренировать устный счёт, скорость реакции и концентрацию — это подтверждённые эффекты регулярных арифметических упражнений.',
      },
    ],
  },
  {
    title: 'Об игре',
    items: [
      {
        question: 'Как играть?',
        answer:
          'На экране появляется арифметическое задание (например, 7 + 5) и несколько жуков с числами. Ваша задача — нажать на жука с правильным ответом до того, как он уползёт за край экрана. Чем быстрее и точнее вы отвечаете, тем больше очков получаете.',
      },
      {
        question: 'Какие режимы игры есть?',
        answer:
          'В Поймай Жукае доступно несколько режимов: «Классический» — стандартный режим с нарастающей сложностью; «На время» — как можно больше правильных ответов за ограниченное время; «Без ошибок» — каждая ошибка заканчивает игру, требуется максимальная точность. Сложность автоматически подстраивается под ваш уровень.',
      },
      {
        question: 'Как начисляются очки?',
        answer:
          'Очки зависят от скорости ответа, правильности и текущей серии правильных ответов подряд (комбо). Быстрый правильный ответ приносит больше очков, чем медленный. Серия правильных ответов увеличивает множитель очков. Ошибка сбрасывает серию.',
      },
      {
        question: 'Что такое ранговая система?',
        answer:
          'По мере набора очков и достижений вы поднимаетесь по ранговой системе — от «Новичка» до высших рангов. Каждый новый ранг отражает ваш общий прогресс и опыт на платформе. Ранги не зависят от сравнения с другими пользователями — только от вашего личного развития.',
      },
    ],
  },
  {
    title: 'О тренировках',
    items: [
      {
        question: 'Сколько времени нужно тренироваться?',
        answer:
          'Мы рекомендуем 5–15 минут в день. Для детей 7–10 лет достаточно 3–5 минут. Исследования показывают, что короткие, но регулярные сессии более эффективны, чем длинные и редкие. Не нужно проводить часы за тренировкой — важна последовательность.',
      },
      {
        question: 'Как часто нужно заниматься?',
        answer:
          'Идеально — каждый день или через день. Регулярность важнее продолжительности. Но если вы пропустили день или два — ничего страшного, просто продолжайте, когда удобно. Мы не наказываем за пропуски и не создаём лишнее давление.',
      },
      {
        question: 'Можно ли заниматься на телефоне?',
        answer:
          'Да, Поймай Жука работает в браузере на любом устройстве — компьютере, планшете или смартфоне. Специальное приложение не нужно. Интерфейс адаптируется под размер экрана.',
      },
      {
        question: 'Могут ли дети заниматься самостоятельно?',
        answer:
          'Дети от 10 лет обычно могут заниматься самостоятельно. Для детей 7–9 лет рекомендуется первоначальная помощь родителей в освоении интерфейса. После этого ребёнок может тренироваться самостоятельно, а родители — отслеживать прогресс через панель родительского контроля.',
      },
    ],
  },
  {
    title: 'Аккаунт и данные',
    items: [
      {
        question: 'Как зарегистрироваться?',
        answer:
          'Нажмите кнопку «Регистрация» в верхнем правом углу. Для создания аккаунта нужен email. Для детей до 14 лет аккаунт должен быть создан родителем или законным представителем.',
      },
      {
        question: 'Как сохраняется мой прогресс?',
        answer:
          'Весь прогресс автоматически сохраняется в вашем аккаунте после каждого раунда. Вы можете заниматься на разных устройствах — данные синхронизируются. Без аккаунта прогресс не сохраняется между сессиями.',
      },
      {
        question: 'Мои данные в безопасности?',
        answer:
          'Мы серьёзно относимся к защите данных. Мы собираем только необходимый минимум информации (email, результаты игр, статистику использования) и не продаём данные третьим лицам. Для детей до 14 лет действуют дополнительные меры защиты. Подробнее — в нашей Политике конфиденциальности.',
      },
    ],
  },
];

// Flatten for schema
const allFaqItems = faqSections.flatMap((s) => s.items);

const breadcrumbs = [
  { name: 'Главная', href: '/' },
  { name: 'FAQ', href: '/faq' },
];

/* ------------------------------------------------
   Accordion component
   ------------------------------------------------ */
function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
        aria-expanded={isOpen}
      >
        <span className="text-base font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
          {item.question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100 pb-5' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-slate-600 leading-relaxed pr-8">{item.answer}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------
   Page
   ------------------------------------------------ */
export default function FaqPage() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (key: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFaqSchema(allFaqItems)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbs)),
        }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 py-20 md:py-28">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-5">
              Часто задаваемые вопросы
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-white/85 leading-relaxed">
              Ответы на самые популярные вопросы о Поймай Жукае, игровых
              тренировках, аккаунтах и безопасности данных.
            </p>
          </div>
        </section>

        {/* Breadcrumbs */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.href}>
                {i > 0 && <span className="mx-2">/</span>}
                {i === breadcrumbs.length - 1 ? (
                  <span className="text-slate-700 font-medium">{crumb.name}</span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="hover:text-emerald-600 transition-colors"
                  >
                    {crumb.name}
                  </Link>
                )}
              </span>
            ))}
          </nav>
        </div>

        {/* FAQ sections */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {faqSections.map((section) => (
            <div key={section.title} className="mb-12 last:mb-0">
              <h2 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
                {section.title}
              </h2>
              <div className="bg-white rounded-2xl border border-slate-100 px-6 shadow-sm">
                {section.items.map((item) => {
                  const key = `${section.title}-${item.question}`;
                  return (
                    <AccordionItem
                      key={key}
                      item={item}
                      isOpen={openItems.has(key)}
                      onToggle={() => toggleItem(key)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        {/* Contact CTA */}
        <section className="bg-slate-50 border-t border-slate-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-50 mb-4">
              <MessageCircle className="w-7 h-7 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-3">
              Не нашли ответ?
            </h2>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              Напишите нам, и мы с удовольствием ответим на ваш вопрос.
            </p>
            <a
              href="mailto:levart72@mail.ru"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300"
            >
              <MessageCircle className="w-4 h-4" />
              Написать нам
            </a>
          </div>
        </section>
      </div>
    </>
  );
}

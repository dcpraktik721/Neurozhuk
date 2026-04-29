import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';
import { getSortedArticles } from '@/content/theory-articles';
import { generatePageMetadata, generateBreadcrumbSchema, WEBSITE_SCHEMA } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata(
  'Теория: наука о развитии мозга',
  'Научно-популярные статьи о когнитивных функциях, внимании, рабочей памяти, скорости мышления и когнитивных тренировках. Честно и доступно.',
  '/theory',
);

const breadcrumbs = [
  { name: 'Главная', href: '/' },
  { name: 'Теория', href: '/theory' },
];

export default function TheoryPage() {
  const articles = getSortedArticles();

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(WEBSITE_SCHEMA),
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
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 py-20 md:py-28">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-5">
              Теория: наука о развитии мозга
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-white/85 leading-relaxed">
              Научно-популярные статьи о когнитивных функциях, внимании, памяти и
              тренировках. Без обещаний «суперспособностей» — только честная и
              доступная информация.
            </p>
          </div>
        </section>

        {/* Breadcrumbs */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
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

        {/* Articles grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/theory/${article.slug}`}
                className="group bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{article.icon}</div>
                <h2 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                  {article.title}
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">
                  {article.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    {article.readTime}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 group-hover:gap-2 transition-all">
                    Читать
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Clock, BookOpen } from 'lucide-react';
import {
  getArticleBySlug,
  getSortedArticles,
  theoryArticles,
} from '@/content/theory-articles';
import {
  generatePageMetadata,
  generateBreadcrumbSchema,
  generateArticleSchema,
} from '@/lib/seo';

/* ------------------------------------------------
   Static params for build-time generation
   ------------------------------------------------ */
export function generateStaticParams() {
  return theoryArticles.map((a) => ({ slug: a.slug }));
}

/* ------------------------------------------------
   Metadata
   ------------------------------------------------ */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return generatePageMetadata(article.title, article.description, `/theory/${slug}`, {
    openGraphType: 'article',
  });
}

/* ------------------------------------------------
   Page
   ------------------------------------------------ */
export default async function TheoryArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const sorted = getSortedArticles();
  const currentIndex = sorted.findIndex((a) => a.slug === slug);
  const prev = currentIndex > 0 ? sorted[currentIndex - 1] : null;
  const next = currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null;

  // Related articles (up to 3, excluding current)
  const related = sorted.filter((a) => a.slug !== slug).slice(0, 3);

  const breadcrumbs = [
    { name: 'Главная', href: '/' },
    { name: 'Теория', href: '/theory' },
    { name: article.title, href: `/theory/${slug}` },
  ];

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbs)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateArticleSchema(article)),
        }}
      />

      <div className="min-h-screen bg-white">
        {/* Header bar */}
        <div className="bg-slate-50 border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="text-sm text-slate-500 mb-3">
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

            <Link
              href="/theory"
              className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Все статьи
            </Link>
          </div>
        </div>

        {/* Article */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          {/* Title block */}
          <header className="mb-10">
            <span className="text-5xl mb-4 block">{article.icon}</span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {article.readTime} чтения
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                Статья {article.order} из {sorted.length}
              </span>
            </div>
          </header>

          {/* Content */}
          <div
            className="prose prose-lg max-w-none
              prose-headings:text-slate-900 prose-headings:font-bold
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-4
              prose-ul:text-slate-600 prose-ul:my-4 prose-ul:pl-6
              prose-li:mb-1.5 prose-li:leading-relaxed
              prose-strong:text-slate-800 prose-strong:font-semibold"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>

        {/* Prev / Next navigation */}
        <nav className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <div className="border-t border-slate-200 pt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prev ? (
              <Link
                href={`/theory/${prev.slug}`}
                className="group flex flex-col p-5 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all"
              >
                <span className="text-xs font-medium text-slate-50 mb-1">
                  ← Предыдущая статья
                </span>
                <span className="text-sm font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={`/theory/${next.slug}`}
                className="group flex flex-col items-end text-right p-5 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all"
              >
                <span className="text-xs font-medium text-slate-50 mb-1">
                  Следующая статья →
                </span>
                <span className="text-sm font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {next.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </nav>

        {/* Related articles */}
        <section className="bg-slate-50 border-t border-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-8 text-center">
              Читайте также
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/theory/${r.slug}`}
                  className="group bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="text-3xl mb-3">{r.icon}</div>
                  <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">
                    {r.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2">
                    {r.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium mt-3">
                    Читать <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

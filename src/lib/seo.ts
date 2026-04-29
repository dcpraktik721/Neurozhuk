import type { Metadata } from 'next';

const SITE_NAME = 'Поймай Жука';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://neurozhuk.ru';

/**
 * Generate page-level metadata for Next.js App Router.
 */
export function generatePageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'ru_RU',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}

/* -----------------------------------------------
   JSON-LD Schemas
   ----------------------------------------------- */

export const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    'Онлайн-платформа для развития когнитивных навыков. Тренировка внимания, скорости мышления и арифметики в игровой форме для детей и взрослых.',
  sameAs: [],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'levart72@mail.ru',
    contactType: 'customer support',
    availableLanguage: 'Russian',
  },
};

/**
 * Generate FAQ JSON-LD markup for Schema.org.
 */
export function generateFaqSchema(
  items: { question: string; answer: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

/**
 * Generate BreadcrumbList JSON-LD.
 */
export function generateBreadcrumbSchema(
  items: { name: string; href: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`,
    })),
  };
}

/**
 * Generate Article JSON-LD.
 */
export function generateArticleSchema(article: {
  title: string;
  description: string;
  slug: string;
  readTime: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/theory/${article.slug}`,
    },
    timeRequired: `PT${parseInt(article.readTime)}M`,
  };
}

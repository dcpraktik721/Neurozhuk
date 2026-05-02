import type { Metadata } from 'next';

export const SITE_NAME = 'Поймай Жука';
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://neurozhuk.ru').replace(
  /\/$/,
  '',
);
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og.png`;

type PageMetadataOptions = {
  openGraphType?: 'website' | 'article';
  index?: boolean;
};

/**
 * Generate page-level metadata for Next.js App Router.
 */
export function generatePageMetadata(
  title: string,
  description: string,
  path: string,
  options: PageMetadataOptions = {},
): Metadata {
  const url = `${SITE_URL}${path}`;
  const shouldIndex = options.index ?? true;

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
      type: options.openGraphType ?? 'website',
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — математическая аркада`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    robots: {
      index: shouldIndex,
      follow: shouldIndex,
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
  logo: DEFAULT_OG_IMAGE,
  image: DEFAULT_OG_IMAGE,
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

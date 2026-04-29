import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://neurozhuk.ru'),
  title: {
    default: 'Поймай Жука — Тренируй мозг играючи',
    template: '%s | Поймай Жука',
  },
  description:
    'Поймай Жука — онлайн-платформа для развития внимания, скорости мышления и когнитивных навыков. Математические игры для детей и взрослых.',
  keywords: [
    'когнитивное развитие',
    'тренировка мозга',
    'развитие внимания',
    'математические игры',
    'скорость мышления',
    'когнитивные навыки',
    'развитие детей',
    'обучающие игры',
    'Поймай Жука',
    'тренировка памяти',
    'арифметика онлайн',
  ],
  authors: [{ name: 'Поймай Жука' }],
  creator: 'Поймай Жука',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Поймай Жука',
    title: 'Поймай Жука — Тренируй мозг играючи',
    description:
      'Онлайн-платформа для развития внимания, скорости мышления и когнитивных навыков. Для детей и взрослых.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Поймай Жука — Тренируй мозг играючи',
    description:
      'Онлайн-платформа для развития когнитивных навыков в игровой форме.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={{ scrollBehavior: 'smooth' }}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

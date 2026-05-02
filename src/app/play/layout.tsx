import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata(
  'Играть',
  'Запусти математическую аркаду Поймай Жука: решай примеры, лови жуков с правильными ответами, набирай очки и отслеживай прогресс.',
  '/play',
);

export default function PlayLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

import Image from 'next/image';
import Link from 'next/link';
import { Bug, Globe, MessageCircle, Mail } from 'lucide-react';

const CONTACT_EMAIL = 'levart72@mail.ru';

const footerLinks = {
  platform: {
    title: 'Платформа',
    links: [
      { name: 'Главная', href: '/' },
      { name: 'Играть', href: '/play' },
      { name: 'Личный кабинет', href: '/dashboard' },
      { name: 'Прогресс', href: '/progress' },
    ],
  },
  theory: {
    title: 'Теория',
    links: [
      { name: 'Когнитивные функции', href: '/theory/cognitive-functions' },
      { name: 'Как работает внимание', href: '/theory/attention' },
      { name: 'Рабочая память', href: '/theory/working-memory' },
      { name: 'О проекте', href: '/about' },
    ],
  },
  support: {
    title: 'Поддержка',
    links: [
      { name: 'FAQ', href: '/faq' },
      { name: 'Для родителей', href: '/parents' },
      { name: 'Обратная связь', href: `mailto:${CONTACT_EMAIL}` },
    ],
  },
  legal: {
    title: 'Правовая информация',
    links: [
      { name: 'Политика обработки', href: '/privacy' },
      { name: 'Согласие на обработку', href: '/consent' },
      { name: 'Пользовательское соглашение', href: '/terms' },
    ],
  },
};

export default function Footer() {
  return (
    <footer className="bg-[#0B1326] text-[#CBD5E1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-teal-500 text-white shadow-md">
                <Bug className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Поймай Жука
              </span>
            </Link>
            <p className="mb-6 text-sm leading-relaxed !text-[#64748B]">
              Онлайн-платформа для развития когнитивных навыков. Тренируйте внимание, скорость мышления и арифметику в игровой форме.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-[#CBD5E1] transition-all duration-200 hover:bg-slate-700 hover:text-[#EAFBFF]"
                aria-label="Сайт"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-[#CBD5E1] transition-all duration-200 hover:bg-slate-700 hover:text-[#EAFBFF]"
                aria-label="Сообщения"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-[#CBD5E1] transition-all duration-200 hover:bg-slate-700 hover:text-[#EAFBFF]"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([sectionKey, section]) => (
            <div key={section.title} className="flex flex-col items-start">
              <h3 className="mb-4 w-full text-left !text-[#EAFBFF]">
                <span
                  className={
                    sectionKey === 'legal'
                      ? 'block max-w-[12rem] !text-[#EAFBFF] text-sm font-bold leading-tight sm:text-base'
                      : 'block !text-[#EAFBFF] text-lg font-bold leading-snug sm:text-xl'
                  }
                >
                  {section.title}
                </span>
              </h3>
              <ul className="w-full space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#CBD5E1] transition-colors duration-200 hover:text-[#EAFBFF] hover:no-underline"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm !text-[#64748B]">
            &copy; 2024&ndash;2026 Поймай Жука. Все права защищены.
          </p>
          <div className="flex items-center gap-3 text-sm">
            <Image
              src="/branding/levart-footer-logo.png"
              alt="Lev.Art"
              width={44}
              height={44}
              className="h-11 w-11 rounded-full object-cover shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
            />
            <p className="!text-[#64748B]">Сделано с заботой о развитии каждого</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
